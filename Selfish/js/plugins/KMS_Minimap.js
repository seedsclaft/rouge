//=============================================================================
// KMS_Minimap.js
//  last update: 2017/11/19
//=============================================================================

/*:
 * @plugindesc
 * [v0.1.2] Display minimap.
 *
 * @author TOMY (Kamesoft)
 *
 * @param Map rect
 * @default 524, 32, 260, 200
 * @desc
 * Specify minimap position and its size.
 * Format: X, Y, Width, Height
 *
 * @param Grid size
 * @default 10
 * @desc Grid size of the minimap in pixel.
 *
 * @param Blink time
 * @default 180
 * @desc Blinking interval of icons on the minimap in frames.
 *
 * @param Foreground color
 * @default rgba(224, 224, 240, 0.6)
 * @desc
 * Format: rgba(Red, Green, Blue, Alpha)
 *
 * @param Background color
 * @default rgba(0, 0, 160, 0.6)
 * @desc
 * Format: rgba(Red, Green, Blue, Alpha)
 *
 * @param Mask style
 * @default 0
 * @desc
 * Mask style for minimap.
 * 0: None  1: Ellipse  2: Rounded rectangle  3, 4: Hex
 *
 * @param Mask radius
 * @default 48
 * @desc
 * The radius of each of the corners.
 * (Rounded rectangle style only)
 *
 * @help
 * ## Disable minimap
 *
 * Add <NoMinimap> to the note field in a map, the minimap will be disabled on that map.
 *
 *
 * ## Plugin command
 *
 * Minimap show     # Show minimap. If <NoMinimap> is specified, the minimap can't be shown.
 * Minimap hide     # Hide minimap.
 * Minimap refresh  # Redraw minimap.
 *
 * @requiredAssets img/system/MinimapPlayerIcon
 * @requiredAssets img/system/MinimapObjectIcon
 */

/*:ja
 * @plugindesc
 * [v0.1.2] 画面上にミニマップを表示します。
 *
 * @author TOMY (Kamesoft)
 *
 * @param Map rect
 * @default 524, 32, 260, 200
 * @desc
 * ミニマップの表示位置とサイズをピクセル単位で指定します。
 * 書式: X, Y, 幅, 高さ
 *
 * @param Grid size
 * @default 10
 * @desc ミニマップの 1 マスのサイズをピクセル単位で指定します。
 *
 * @param Blink time
 * @default 180
 * @desc ミニマップ上のアイコンを点滅させる時間をフレーム単位で指定します。
 *
 * @param Foreground color
 * @default rgba(224, 224, 240, 0.6)
 * @desc
 * ミニマップの通行可能領域の色を CSS カラーで指定します。
 * 書式: rgba(赤, 緑, 青, 不透明度)
 *
 * @param Background color
 * @default rgba(0, 0, 160, 0.6)
 * @desc
 * ミニマップの通行不可領域の色を CSS カラーで指定します。
 * 書式: rgba(赤, 緑, 青, 不透明度)
 *
 * @param Mask style
 * @default 0
 * @desc
 * ミニマップの表示領域のマスク方法を指定します。
 * 0: なし  1: 楕円  2: 角丸矩形  3: 六角形1  4: 六角形2
 *
 * @param Mask radius
 * @default 48
 * @desc
 * 角丸矩形マスクを指定した場合の、角の丸め具合を指定します。
 *
 * @help
 * ## ミニマップの非表示
 *
 * マップのメモ欄に <NoMinimap> を追加すると、そのマップではミニマップが表示されなくなります。
 *
 *
 * ## プラグインコマンド
 *
 * Minimap show     # ミニマップを表示します。<NoMinimap> を指定したマップでは表示できません。
 * Minimap hide     # ミニマップを隠します。
 * Minimap refresh  # ミニマップを再描画します。
 *
 * @requiredAssets img/system/MinimapPlayerIcon
 * @requiredAssets img/system/MinimapObjectIcon
 */

var KMS = KMS || {};

(function()
{

'use strict';

KMS.imported = KMS.imported || {};
KMS.imported['Minimap'] = true;

/**
 * 矩形を表す文字列を解析
 */
var parseRect = function(str)
{
    var rectReg = /([-]?\d+),\s*([-]?\d+),\s*([-]?\d+),\s*([-]?\d+)/;
    var rect = new PIXI.Rectangle(524, 32, 260, 200);
    var match = rectReg.exec(str);
    if (match)
    {
        rect.x      = Number(match[1]);
        rect.y      = Number(match[2]);
        rect.width  = Number(match[3]);
        rect.height = Number(match[4]);
    }

    return rect;
};

var pluginParams = PluginManager.parameters('KMS_Minimap');
var Params = {};
Params.mapRect = parseRect(pluginParams['Map rect']);
Params.gridSize = Number(pluginParams['Grid size'] || 10);
Params.blinkTime = Number(pluginParams['Blink time'] || 180);
Params.foregroundColor = pluginParams['Foreground color'] || 'rgba(224, 224, 240, 0.6)';
Params.backgroundColor = pluginParams['Background color'] || 'rgba(  0,   0, 160, 0.6)';
Params.playerIconImage = pluginParams['Player icon'] || 'MinimapPlayerIcon';
Params.objectIconImage = pluginParams['Object icon'] || 'MinimapObjectIcon';
Params.displayTileImage = pluginParams['Display tile'];
Params.maskStyle = Number(pluginParams['Mask style'] || 0);
Params.maskRadius = Number(pluginParams['Mask radius'] || 48);

var Minimap = {};
Minimap.passageCacheCountMax = 5;
Minimap.regex = {
    wallEvent: /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:壁|障害物|WALL)>/i,
    moveEvent: /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:移動|MOVE)>/i,
    person:    /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:人物|PERSON)\s*(\d+)>/i,
    object:    /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*OBJ(?:ECT)?\s*(\d+)>/i,
    mapName:   /<(?:ミニマップ|MINIMAP)\s*[:\s]\s*(?:マップ名|MapName)\s*(\d+)>/i,
    rotation:  /<(?:rotation)\s*[:\s]\s*(\d+)>/i,
    nameArray:  /<(?:nameArray)\s*[:\s]\s*(\d+)>/i,
};
Minimap.keysRequireNumber = [ 'person', 'object' , 'mapName'];
Minimap.dirFlags = { down: 0x01, left: 0x02, right: 0x04, up: 0x08 };
Minimap.maskStyles = { none: 0, ellipse: 1, roundedRect: 2, hex1: 3, hex2: 4 };


/**
 * 指定した円に内接する正 n 角形の塗り潰し
 */
var fillRegularPolygon = function(graphics, x, y, width, height, startRad, vertexCount)
{
    if (vertexCount < 1)
    {
        return;
    }

    var points = [];
    for (var i = 0; i < vertexCount; i++)
    {
        var angle = i * Math.PI * 2 / vertexCount - Math.PI / 2 + startRad;
        points.push(x + Math.cos(angle) * width);
        points.push(y + Math.sin(angle) * height);
    }

    graphics.drawPolygon(points);
};

//-----------------------------------------------------------------------------
// Tilemap

Tilemap.prototype.getTileCount = function()
{
    return {
        x: Math.ceil(this._width  / this._tileWidth)  + 1,
        y: Math.ceil(this._height / this._tileHeight) + 1
    };
};


//-----------------------------------------------------------------------------
// Game_Temp

var _KMS_Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function()
{
    _KMS_Game_Temp_initialize.call(this);

    this._minimapPassageCache     = [];
    this._minimapCacheRefreshFlag = false;
};

Object.defineProperty(Game_Temp.prototype, 'minimapCacheRefreshFlag', {
    get: function()
    {
        return this._minimapCacheRefreshFlag;
    },
    set: function(value)
    {
        this._minimapCacheRefreshFlag = value;
    },
    configurable: true
});

Game_Temp.prototype.getMinimapPassageCache = function(mapId)
{
    return null;
};

/**
 * 通行可否キャッシュの登録
 */
Game_Temp.prototype.registerMinimapPassageCache = function(mapId, passage)
{
    // 最新のキャッシュは先頭に置く
    var newCache = [ { mapId: mapId, passage: passage } ].concat(
        this._minimapPassageCache.filter(function(cache)
        {
            return cache.mapId !== mapId;
        }));

    // しばらく参照されていないキャッシュは消す
    this._minimapPassageCache = newCache.slice(0, Minimap.passageCacheCountMax);
};

/**
 * 通行可否キャッシュの取得
 */
Game_Temp.prototype.getMinimapPassageCache = function(mapId)
{
    for (var i = 0; i < this._minimapPassageCache.length; i++)
    {
        var tempCache = this._minimapPassageCache[i];
        if (tempCache.mapId !== mapId)
        {
            continue;
        }

        if (i > 0)
        {
            // 取得したキャッシュは先頭に移す
            this.registerMinimapPassageCache(mapId, tempCache);

        }
        return tempCache;
    }

    return null;
};

/**
 * 通行可否キャッシュをクリア
 */
Game_Temp.prototype.clearMinimapPassageCache = function(mapId)
{
    this._minimapPassageCache     = [];
    this._minimapCacheRefreshFlag = true;
};


//-----------------------------------------------------------------------------
// Game_System

/**
 * ミニマップの有効状態を取得
 */
Game_System.prototype.isMinimapEnabled = function()
{
    return this._minimapEnabled != null ? this._minimapEnabled : true;
};

/**
 * ミニマップの有効状態を設定
 */
Game_System.prototype.setMinimapEnabled = function(enabled)
{
    this._minimapEnabled = !!enabled;
};


//-----------------------------------------------------------------------------
// Game_Map

var _KMS_Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId)
{
    _KMS_Game_Map_setup.call(this, mapId);
    if (DataManager.isEventTest()){
        return;
    }
    this.setupMinimap();
};

/**
 * ミニマップに関する設定
 */
Game_Map.prototype.setupMinimap = function()
{
    this._minimapEnabled = $dataMap.data.length > 0 && !$dataMap.meta.NoMinimap;
};

/**
 * ミニマップの表示可否を取得
 */
Game_Map.prototype.isMinimapEnabled = function()
{
    return this._minimapEnabled;
};

/**
 * ミニマップのキャッシュを再構築
 */
Game_Map.prototype.refreshMinimapCache = function()
{
    $gameTemp.clearMinimapPassageCache();
};


//-----------------------------------------------------------------------------
// Game_Event

var _KMS_Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function()
{
    _KMS_Game_Event_setupPage.call(this);

    this.setupMinimapAttribute();
};

/**
 * ミニマップ用属性の設定
 */
Game_Event.prototype.setupMinimapAttribute = function()
{
    this._minimapAttribute = { wall: false, move: false, person: -1, mapName: -1,rotation : -1,nameArray : -1,object: -1 , readCount:-1, readEvent: "" };

    var isComment = function(command)
    {
        return command && (command.code === 108 || command.code === 408);
    };
    var isScript = function(command)
    {
        return command && (command.code === 355);
    };

    // 注釈以外に達するまで解析
    var page = this.page();
    if (!page)
    {
        return;
    }

    var commands = page.list;
    var index    = 0;
    var command  = commands[index++];
    var index2    = 0;
    var script  = commands[index++];
    while (isComment(command))
    {
        var comment = command.parameters[0];

        this._minimapAttribute.wall |= Minimap.regex.wallEvent.test(comment);
        this._minimapAttribute.move |= Minimap.regex.moveEvent.test(comment);
        Minimap.keysRequireNumber.forEach(function(key)
        {
            var match = Minimap.regex[key].exec(comment);
            if (match)
            {
                this._minimapAttribute[key] = Number(match[1]);
                var match2 = Minimap.regex["rotation"].exec(comment);
                if (match2){
                    this._minimapAttribute.rotation = Number(match2[1]);
                }
                if ($dataOption.getUserData("language") == LanguageType.Japanese){
                    var match3 = Minimap.regex["nameArray"].exec(comment);
                    if (match3){
                        this._minimapAttribute.nameArray = Number(match3[1]);
                    }
                }
            }
        }, this);

        command = commands[index++];
    }
    while (isScript(script))
    {
        var comment = script.parameters[0];
        if (comment.includes("EventManager.setup")){
            if (this._minimapAttribute.object == 0){
                var event = comment;
                event = event.replace("EventManager.setup(\"","");
                event = event.replace("EventManager.setup(\'","");
                event = event.replace("\")","");
                event = event.replace("\')","");
                event = event.replace("\;","");
                if (!$gameParty._commonEventRead){
                    $gameParty._commonEventRead = {};
                }
                let readNum = $gameParty._commonEventRead[event];
                let needNum = $dataEventReadInfos[event];
                if (needNum && needNum > 0){
                    if (!readNum){
                        // 会話あり
                        this._minimapAttribute.readEvent = event;
                        this._minimapAttribute.readCount = needNum;
                    }
                    if (readNum && readNum < needNum){
                        // 会話あり
                        this._minimapAttribute.readEvent = event;
                        this._minimapAttribute.readCount = needNum;
                    }
                }

            }

        }

        script = commands[index2++];
    }
};

Game_Event.prototype.isMinimapWall = function()
{
    return this._minimapAttribute.wall;
};

Game_Event.prototype.isMinimapMove = function()
{
    return this._minimapAttribute.move;
};

Game_Event.prototype.minimapPersonType = function()
{
    return this._minimapAttribute.person;
};

Game_Event.prototype.minimapObjectType = function()
{
    return this._minimapAttribute.object;
};

Game_Event.prototype.minimapReadCount = function()
{
    return this._minimapAttribute.readCount;
};

Game_Event.prototype.minimapReadEvent = function()
{
    return this._minimapAttribute.readEvent;
};

//-----------------------------------------------------------------------------
// Game_MinimapPassageCache

function Game_MinimapPassageCache()
{
    this.initialize(...arguments);
};

Game_MinimapPassageCache.prototype.initialize = function(map, grid)
{
    this._mapId = map.mapId();
    this._width = map.width();
    this._height = map.height();
    this._grid = grid;
    this._blockCount = {
        x: Math.floor((this._width  + grid.x - 1) / grid.x),
        y: Math.floor((this._height + grid.y - 1) / grid.y)
    };

    // 各タイルの通行可否フラグ
    this._flags = new Array(this._width * this._height);

    // チェック済みブロックフラグ
    this._blockChecked = new Array(this._blockCount.x * this._blockCount.y);
};

/**
 * ブロック数の取得
 */
Game_MinimapPassageCache.prototype.getBlockCount = function()
{
    return this._blockCount;
};

/**
 * ブロックチェック済み判定
 */
Game_MinimapPassageCache.prototype.isBlockChecked = function(bx, by)
{
    return this._blockChecked[bx + by * this._blockCount.y];
};

/**
 * ブロックチェック済みフラグの設定
 */
Game_MinimapPassageCache.prototype.setBlockChecked = function(bx, by, checked)
{
    this._blockChecked[bx + by * this._blockCount.y] = checked;
};

/**
 * 通行フラグの取得
 */
Game_MinimapPassageCache.prototype.getFlag = function(x, y)
{
    if ($gameMap.isLoopHorizontal())
    {
        x = (x + this._width) % this._width;
    }
    else if (x < 0 || x >= this._width)
    {
        return 0;
    }

    if ($gameMap.isLoopVertical())
    {
        y = (y + this._height) % this._height;
    }
    else if (y < 0 || y >= this._height)
    {
        return 0;
    }

    return this._flags[x + y * this._width];
};

/**
 * 通行フラグの設定
 */
Game_MinimapPassageCache.prototype.setFlag = function(x, y, flag)
{
    this._flags[x + y * this._width] = flag;
};

/**
 * 指定位置が通行可能か
 */
Game_MinimapPassageCache.prototype.isPassable = function(x, y)
{
    return this.getFlag(x, y) !== 0;
};

/**
 * 指定方向への通行が可能か
 */
Game_MinimapPassageCache.prototype.isPassableDir = function(x, y, dir)
{
    var flag = this.getFlag(x, y);
    switch (dir)
    {
        case 2: return (flag & Minimap.dirFlags.down)  !== 0;
        case 4: return (flag & Minimap.dirFlags.left)  !== 0;
        case 6: return (flag & Minimap.dirFlags.right) !== 0;
        case 8: return (flag & Minimap.dirFlags.up)    !== 0;
        default: return false;
    }
};


//-----------------------------------------------------------------------------
// Sprite_Minimap
//
// ミニマップ用のスプライトです。

function Sprite_Minimap()
{
    this.initialize(...arguments);
}

Sprite_Minimap.prototype = Object.create(Sprite.prototype);
Sprite_Minimap.prototype.constructor = Sprite_Minimap;

Sprite_Minimap.prototype.initialize = function()
{
    Sprite.prototype.initialize.call(this);
    this._targetRotation = 0;

    var rect = Params.mapRect;
    this.x = rect.x;
    this.y = rect.y;
    this._gridNumber = {
        x: Math.floor((rect.width + Params.gridSize - 1) / Params.gridSize),
        y: Math.floor((rect.height + Params.gridSize - 1) / Params.gridSize),
    };
    this._drawGridNumber = { x: this._gridNumber.x + 2, y: this._gridNumber.y + 2 };
    this._drawRange = { begin: new PIXI.Point(0, 0), end: new PIXI.Point(0, 0) };

    this._lastPosition = new Point($gamePlayer.x, $gamePlayer.y);
    this._scrollDiff = new Point();

    this.createSubSprites();
    
    this._otherActionSprites = [];

    this._baseOpacity = 255;
};

/**
 * 内部のスプライトを作成
 */
Sprite_Minimap.prototype.createSubSprites = function()
{
    this._bitmapSize = {
        width: (this._gridNumber.x + 2) * Params.gridSize,
        height: (this._gridNumber.y + 2) * Params.gridSize
    };

    this.createBaseSprite();
    this.createFieldSprite();
    this.createPassageSprite();
    this.createPlayerSprite();
    this.createObjectSprites();
};

/**
 * ベース部分のスプライトを作成
 */
Sprite_Minimap.prototype.createBaseSprite = function()
{
    var rect = Params.mapRect;

    this._baseSprite = new Sprite();
    this._baseSprite.bitmap = new Bitmap(rect.width, rect.height);
    this._baseSprite.bitmap.fillAll(Params.backgroundColor);

    this.addChild(this._baseSprite);


    if (Params.displayTileImage)
    {
        this._tilemap = Graphics.isWebGL() ?
            new ShaderTilemap() :
            new Tilemap();

        // 軽量化のためにタイルのアニメーションを切る
        this._tilemap.update = null;

        this.addChild(this._tilemap);
    }

    this.applyMask(rect);
};

Sprite_Minimap.prototype.createFieldSprite = function()
{
    const rect = Params.mapRect;

    this._fieldSprite = new Sprite();
    this._fieldSprite.anchor.x = 0.5
    this._fieldSprite.anchor.y = 0.5;
    this._fieldSprite.x += rect.width /2;
    this._fieldSprite.y += rect.height /2;
    this.addChild(this._fieldSprite);

    const direction = $gamePlayer.direction();
    let targetRotation = null;
    if (direction == 6){
        targetRotation = -1 *  Math.PI / 2;
    } else
    if (direction == 4){
        targetRotation = Math.PI / 2;
    } else
    if (direction == 2){
        targetRotation = -1 *  Math.PI;
    }
    gsap.to(this._fieldSprite, 0, {pixi:{},rotation:targetRotation});
    this._targetRotation = targetRotation;

    this._lastAngle = direction;
};


/**
 * マスクの適用
 */
Sprite_Minimap.prototype.applyMask = function(rect)
{
    this._maskGraphic = new PIXI.Graphics();
    this._maskGraphic.beginFill(0x000000);

    switch (Params.maskStyle)
    {
        case Minimap.maskStyles.ellipse:
            this._maskGraphic.drawEllipse(rect.width / 2, rect.height / 2, rect.width / 2, rect.height / 2);
            break;

        case Minimap.maskStyles.roundedRect:
            this._maskGraphic.drawRoundedRect(0, 0, rect.width, rect.height, 64);
            break;

        case Minimap.maskStyles.hex1:
        case Minimap.maskStyles.hex2:
            fillRegularPolygon(
                this._maskGraphic,
                rect.width / 2,
                rect.height / 2,
                rect.width / 2,
                rect.height / 2,
                (Params.maskStyle === Minimap.maskStyles.hex1) ? 0 : (Math.PI / 2),
                4);
            break;

        default:
            this._maskGraphic.drawRect(0, 0, rect.width, rect.height);
            break;
    }

    this._maskGraphic.endFill();

    this.addChild(this._maskGraphic);
    this.mask = this._maskGraphic;
};

/**
 * 通行可能領域スプライトの作成
 */
Sprite_Minimap.prototype.createPassageSprite = function()
{
    this._passageSprite = new Sprite_MinimapPassage(this._bitmapSize.width, this._bitmapSize.height);

    this.updateScroll();

    this._fieldSprite.addChild(this._passageSprite);
    const rect = Params.mapRect;
    this._passageSprite.x -= rect.width / 2;
    this._passageSprite.y -= rect.height / 2;
    this._northSprite = new Sprite();
    this._northSprite.bitmap = new Bitmap(60, 80);
    this._northSprite.scale.x = this._northSprite.scale.y = 0.5;
    this._northSprite.bitmap.drawText(TextManager.getText(301000),0,24,60,60);
    this._northSprite.bitmap.fontSize = 18;
    this._northSprite.bitmap.drawText(TextManager.getText(301100),0,0,60,60);
    this._northSprite.x = -4;
    this._northSprite.y = -96;
    this._fieldSprite.addChild(this._northSprite);
};

/**
 * オブジェクトスプライトの作成
 */
Sprite_Minimap.prototype.createObjectSprites = function()
{
    this._objectSprites = [];

    const objects = $gameMap.events();
    objects.forEach(function(obj)
    {
        let sprite = new Sprite_MinimapIcon();
        sprite.setObject(obj);

        this._objectSprites.push(sprite);
        this._fieldSprite.addChild(sprite);
    }, this);
};

/**
 * 現在位置スプライトの作成
 */
Sprite_Minimap.prototype.createPlayerSprite = function()
{
    const rect = Params.mapRect;

    this._playerSprite = new Sprite_MinimapIcon();
    this._playerSprite.bitmap = ImageManager.loadSystem(Params.playerIconImage);
    this._playerSprite.x = rect.width / 2;
    this._playerSprite.y = rect.height / 2;

    this.addChild(this._playerSprite);

    this._lightObject = new Sprite();
    this._lightObject.bitmap = ImageManager.loadSystem(Params.playerIconImage);
    this._lightObject.anchor.x = 0.5;
    this._lightObject.anchor.y = 0.5;
    this._lightObject.setBlendColor([255,255,255,180]);
    this._playerSprite.addChild(this._lightObject);
};

/**
 * 全体の不透明度を設定
 */
Sprite_Minimap.prototype.setWholeOpacity = function(baseOpacity)
{
    this.opacity = this._baseOpacity * baseOpacity / 255;
};

/**
 * ミニマップ位置の移動
 */
Sprite_Minimap.prototype.move = function(x, y)
{
    this.x = x;
    this.y = y;
};

Sprite_Minimap.prototype.isNeedUpdate = function()
{
    return this.visible && this.opacity > 0;
};

Sprite_Minimap.prototype.update = function()
{
    Sprite.prototype.update.call(this);
    if (SceneManager.isSceneChanging()){
        return;
    }

    this.updateVisibility();

    if ($gameTemp.minimapCacheRefreshFlag)
    {
        $gameTemp.minimapCacheRefreshFlag = false;
        this.refreshPassageTable();
    }

    if (!this.isNeedUpdate())
    {
        return;
    }

    this.updatePosition();
    this.updateTilemap();
    this.updatePassageSprite();
    this.updateObjectSprites();
    this.updatePlayerSprite();
};

/**
 * 可視状態の更新
 */
Sprite_Minimap.prototype.updateVisibility = function() {
    this.visible = !EventManager.busy();
};

/**
 * 描画範囲の更新
 */
Sprite_Minimap.prototype.updateDrawRange = function()
{
    const range = {
        x: Math.floor(this._drawGridNumber.x / 2),
        y: Math.floor(this._drawGridNumber.y / 2)
    };
    this._drawRange.begin.x = Math.round($gamePlayer.x - range.x);
    this._drawRange.begin.y = Math.round($gamePlayer.y - range.y);
    this._drawRange.end.x   = Math.round($gamePlayer.x + range.x);
    this._drawRange.end.y   = Math.round($gamePlayer.y + range.y);
};

/**
 * タイルマップの表示領域を更新
 */
Sprite_Minimap.prototype.updateTilemap = function()
{
    if (!this._tilemap)
    {
        return;
    }

    this._tilemap.origin.x =
        ($gamePlayer._realX - this._tileCount.x / 2.0 + 1.5) * $gameMap.tileWidth();
    this._tilemap.origin.y =
        ($gamePlayer._realY - this._tileCount.y / 2.0 + 1.5) * $gameMap.tileHeight();
};

/**
 * 通行可能領域スプライトの更新
 */
Sprite_Minimap.prototype.updatePassageSprite = function()
{
    // TODO: 実装
};

/**
 * オブジェクトスプライトの更新
 */
Sprite_Minimap.prototype.updateObjectSprites = function()
{
    const beginX = this._drawRange.begin.x;
    const beginY = this._drawRange.begin.y;
    this._objectSprites.forEach(function(sprite)
    {
        let obj = sprite.getObject();
        let x = (obj.x - beginX - 1) * Params.gridSize;
        let y = (obj.y - beginY - 1) * Params.gridSize;
        const rect = Params.mapRect;
        sprite.x = x - this._scrollDiff.x - rect.width / 2;
        sprite.y = y - this._scrollDiff.y - rect.height / 2;
        if (!obj || !this.isInDrawRange(obj.x - 1, obj.y - 1))
        {   
            sprite.visible = false;
            return;
        }
    }, this);
};

/**
 * 現在位置スプライトの更新
 */
Sprite_Minimap.prototype.updatePlayerSprite = function()
{
    // スプライトの向きを設定
    if (KMS.imported['3DVehicle'] && $gameMap.is3DMode())
    {
        angle = -$gameMap.get3DPlayerAngle();
    }
    else
    {
        switch ($gamePlayer.direction())
        {
        }
    }
    if (this._lastAngle != $gamePlayer.direction()){
        if (this._lastAngle == 8 && $gamePlayer.direction() == 6){
            this._targetRotation += -90 / 180 * Math.PI;
        }
        if (this._lastAngle == 8 && $gamePlayer.direction() == 4){
            this._targetRotation += Math.PI / 2;
        }
        if (this._lastAngle == 8 && $gamePlayer.direction() == 2){
            this._targetRotation += -1 * Math.PI;
        }
        if (this._lastAngle == 6 && $gamePlayer.direction() == 2){
            
            this._targetRotation += -0.5 * Math.PI;
        }
        if (this._lastAngle == 6 && $gamePlayer.direction() == 8){
            this._targetRotation -= -0.5 * Math.PI;
        }
        if (this._lastAngle == 6 && $gamePlayer.direction() == 4){
        
            //this._targetRotation += -1 * Math.PI;
        }
        if (this._lastAngle == 4 && $gamePlayer.direction() == 8){            
            
            this._targetRotation += -0.5 * Math.PI;
        }
        if (this._lastAngle == 4 && $gamePlayer.direction() == 2){
            this._targetRotation += Math.PI / 2;
        }
        if (this._lastAngle == 4 && $gamePlayer.direction() == 6){
            this._targetRotation += -1 * Math.PI;
        }
        if (this._lastAngle == 2 && $gamePlayer.direction() == 4){            
            this._targetRotation += -0.5 * Math.PI;
        }
        if (this._lastAngle == 2 && $gamePlayer.direction() == 6){
            this._targetRotation += Math.PI / 2;
        }
        if (this._lastAngle == 2 && $gamePlayer.direction() == 8){
            this._targetRotation += -1 * Math.PI;
        }
        if (this._targetRotation != null){
            this._tween = gsap.to(this._fieldSprite, 0.6, {rotation:this._targetRotation});
        }
        this._lastAngle = $gamePlayer.direction();
    }
    const alpha = 128 * (Math.sin(this._playerSprite._blinkDuration * Math.PI * 2 / Params.blinkTime) + 1);
    
    this._lightObject.opacity = alpha;
    
};

/**
 * ミニマップの再構築
 */
Sprite_Minimap.prototype.refresh = function()
{
    this.updatePosition();
    this.refreshTilemap();
    this.refreshParameters();
    this.refreshMapImage();
};

/**
 * タイルマップの再構築
 */
Sprite_Minimap.prototype.refreshTilemap = function()
{
    if (!this._tilemap)
    {
        return;
    }

    const rect = Params.mapRect;
    const baseSize = {
        width:  Math.floor(rect.width  * $gameMap.tileWidth()  / Params.gridSize),
        height: Math.floor(rect.height * $gameMap.tileHeight() / Params.gridSize)
    };

    // タイルマップのパラメータを設定
    this._tilemap.tileWidth  = $gameMap.tileWidth();
    this._tilemap.tileHeight = $gameMap.tileHeight();
    this._tilemap.width      = baseSize.width;
    this._tilemap.height     = baseSize.height;
    this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap   = $gameMap.isLoopVertical();

    const scaleX = Params.mapRect.width / this._tilemap.width;
    const scaleY = Params.mapRect.height / this._tilemap.height;
    this._tilemap.scale.x = scaleX;
    this._tilemap.scale.y = scaleY;
    this._tilemap.x += this._tilemap._margin * scaleX;
    this._tilemap.y += this._tilemap._margin * scaleY;

    // タイルマップを再描画するために update を呼ぶ
    (Graphics.isWebGL() ? ShaderTilemap : Tilemap)
        .prototype.update.call(this._tilemap);

    this._tileCount = this._tilemap.getTileCount();
};

/**
 * ミニマップ用パラメータの再構築
 */
Sprite_Minimap.prototype.refreshParameters = function()
{
    this.updateDrawRange();
    this.refreshPassageTable();
};

/**
 * 通行フラグテーブルの更新
 */
Sprite_Minimap.prototype.refreshPassageTable = function()
{
    this._passageCache = this.getPassageTableCache();
};

/**
 * 現在のマップに対応する通行フラグキャッシュを取得
 */
Sprite_Minimap.prototype.getPassageTableCache = function()
{
    return new Game_MinimapPassageCache($gameMap, this._drawGridNumber);
};

/**
 * マップ画像の再構築
 */
Sprite_Minimap.prototype.refreshMapImage = function()
{
    this.drawMap();
};

/**
 * 指定した座標が含まれるブロックの通行フラグをスキャン
 */
Sprite_Minimap.prototype.scanPassage = function(x, y)
{
    const mapWidth  = $gameMap.width();
    const mapHeight = $gameMap.height();
    if ($gameMap.isLoopHorizontal())
    {
        x = (x + mapWidth) % mapWidth;
    }
    if ($gameMap.isLoopVertical())
    {
        y = (y + mapHeight) % mapHeight;
    }

    const blocks = this._passageCache.getBlockCount();
    const bx = Math.floor(x / this._drawGridNumber.x);
    const by = Math.floor(y / this._drawGridNumber.y);

    if (bx < 0 || bx >= blocks.x || by < 0 || by >= blocks.y)
    {
        // マップ範囲外
        return;
    }

    if (this._passageCache.isBlockChecked(bx, by))
    {
        // 探索済み
        return;
    }

    const range = {
        x: {
            begin: bx * this._drawGridNumber.x,
            end:   (bx + 1) * this._drawGridNumber.x
        },
        y: {
            begin: by * this._drawGridNumber.y,
            end:   (by + 1) * this._drawGridNumber.y
        }
    };

    // 探索範囲内の通行テーブルを生成
    for (let ty = range.y.begin; ty < range.y.end; ty++)
    {
        if (ty < 0 || ty >= mapHeight)
        {
            continue;
        }

        for (let tx = range.x.begin; tx < range.x.end; tx++)
        {
            if (tx < 0 || tx >= mapWidth)
            {
                continue;
            }

            // 通行方向フラグの作成
            // (方向は 2, 4, 6, 8)
            let flag = 0;
            for (let i = 0; i < 4; i++)
            {
                let dir = (i + 1) * 2;
                if ($gameMap.isPassable(tx, ty, dir))
                {
                    flag |= 1 << (dir / 2 - 1);
                }
            }
            this._passageCache.setFlag(tx, ty, flag);
        }
    }

    this._passageCache.setBlockChecked(bx, by, true);
};

/**
 * プレイヤー周囲の通行フラグテーブルを更新
 */
Sprite_Minimap.prototype.updateAroundPassageTable = function()
{
    const gx = this._drawGridNumber.x;
    const gy = this._drawGridNumber.y;
    const dx = $gamePlayer.x - Math.floor(gx / 2);
    const dy = $gamePlayer.y - Math.floor(gy / 2);
    this.scanPassage(dx, dy);
    this.scanPassage(dx + gx, dy);
    this.scanPassage(dx, dy + gy);
    this.scanPassage(dx + gx, dy + gy);
};

/**
 * プレイヤー位置の更新
 */
Sprite_Minimap.prototype.updatePosition = function()
{
    this._scrollDiff.x = ($gamePlayer._realX - $gamePlayer.x) * Params.gridSize;
    this._scrollDiff.y = ($gamePlayer._realY - $gamePlayer.y) * Params.gridSize;
    this.updateScroll();
    if (this._lastPosition.x !== $gamePlayer.x ||
        this._lastPosition.y !== $gamePlayer.y)
    {
        this.updateDrawRange();
        this.drawMap();
        this._lastPosition.x = $gamePlayer.x;
        this._lastPosition.y = $gamePlayer.y;
    }
};

/**
 * スクロール処理
 */
Sprite_Minimap.prototype.updateScroll = function()
{
    const offset = {
        x: Math.floor((Params.gridSize) * 1.5) + this._scrollDiff.x,
        y: Math.floor((Params.gridSize) * 1.5) + this._scrollDiff.y
    };
    const rect = Params.mapRect;
    this._passageSprite.setFrame(offset.x, offset.y, rect.width, rect.height);
};

/**
 * 描画範囲か判定
 */
Sprite_Minimap.prototype.isInDrawRange = function(x, y)
{
    const begin = this._drawRange.begin;
    const end   = this._drawRange.end;

    const dx = x;
    if ($gameMap.isLoopHorizontal())
    {
        dx = (dx + $gameMap.width()) % $gameMap.width();
    }

    const dy = y;
    if ($gameMap.isLoopVertical())
    {
        dy = (dy + $gameMap.height()) % $gameMap.height();
    }

    return x >= begin.x && x <= end.x &&
        y >= begin.y && y <= end.y;
};

/**
 * マップの範囲内か判定
 */
Sprite_Minimap.prototype.isInMapRange = function(x, y)
{
    return x >= 0 && x < $gameMap.width() &&
        y >= 0 && y < $gameMap.height();
};

/**
 * マップ画像の描画
 */
Sprite_Minimap.prototype.drawMap = function()
{
    this.updateAroundPassageTable();

    let bitmap = this._passageSprite.bitmap;
    bitmap.clear();
    this.drawMapForeground(bitmap);
};

/**
 * 移動可能領域の描画
 */
Sprite_Minimap.prototype.drawMapForeground = function(bitmap)
{
    for (let y = this._drawRange.begin.y; y < this._drawRange.end.y; y++)
    {
        for (let x = this._drawRange.begin.x; x < this._drawRange.end.x; x++)
        {
            this.drawMapForegroundGrid(bitmap, x, y);
        }
    }
};

/**
 * 移動可能グリッドの描画
 */
Sprite_Minimap.prototype.drawMapForegroundGrid = function(bitmap, x, y)
{
    const passage = this._passageCache;
    if (!passage.isPassable(x, y))
    {
        return;
    }

    var dx = (x - this._drawRange.begin.x) * Params.gridSize;
    var dy = (y - this._drawRange.begin.y) * Params.gridSize;
    var dw = Params.gridSize;
    var dh = Params.gridSize;

    if (!passage.isPassableDir(x, y, 2))  // 下方向移動不可
    {
        dh -= 1;
    }
    if (!passage.isPassableDir(x, y, 4))  // 左方向移動不可
    {
        dx += 1;
        dw -= 1;
    }
    if (!passage.isPassableDir(x, y, 6))  // 右方向移動不可
    {
        dw -= 1;
    }
    if (!passage.isPassableDir(x, y, 8))  // 上方向移動不可
    {
        dy += 1;
        dh -= 1;
    }
    bitmap.fillRect(dx, dy, dw, dh, Params.foregroundColor);
};

Sprite_Minimap.prototype.updateTargetSprites = function(battlers){
    this._otherActionSprites.forEach(element => {
        if (element){
            if (element.parent != null){
                element.parent.removeChild(element);
                element.destroy();
            }
        }
    });
    this._otherActionSprites = [];
    battlers.forEach(battler => {
        if (battler._isArrow || battler._isChant){
            let battleAction = battler.battleAction();
            if (battleAction == null) return; 
            if (DataManager.isSkill(battleAction)){
                let skill = $dataSkills[battleAction.id];
                let range = skill.range;
                let width = 40;
                let height = 40;
                let angle = 90;
                let anchor = [1,0.5];
                width *= range;
                let sprite = new Sprite(new Bitmap(width,height));
                sprite.angle = angle;
                sprite.x = this._playerSprite.x;
                sprite.y = this._playerSprite.y;
                sprite.anchor.x = anchor[0];
                sprite.anchor.y = anchor[1];
                sprite.opacity = 128;
                sprite.bitmap.fillRect(0,0,width,height,"white");
                this.addChild(sprite);
                this._otherActionSprites.push(sprite);
            }
        }
    });
}

Sprite_Minimap.prototype.updateOtherActions = function(actions){
    this._otherActionSprites.forEach(element => {
        if (element){
            if (element.parent != null){
                element.parent.removeChild(element);
                element.destroy();
            }
        }
    });
    this._otherActionSprites = [];
    actions.forEach(action=> {
        if (action){
            if (action.battler.isActor()){
                let x = $gamePlayer.x;
                let y = $gamePlayer.y;
                let width = 40;
                let height = 40;
                let angle = 0;
                let anchor = [0.5,0.5];
                action.positions.forEach(position => {
                    if (x != position[0]) width += 40;
                    if (y != position[1]) height += 40;
                    if (x != position[0]) angle = 270;
                    if (y != position[1]) angle = 0;
                    if (x != position[0]) anchor = [0,0.5];
                    if (y != position[1]) anchor = [0.5,1];
                });
                let sprite = new Sprite(new Bitmap(width,height));
                sprite.angle = angle;
                sprite.x = this._playerSprite.x;
                sprite.y = this._playerSprite.y;
                sprite.anchor.x = anchor[0];
                sprite.anchor.y = anchor[1];
                sprite.opacity = 128;
                sprite.bitmap.fillRect(0,0,width,height,"white");
                this.addChild(sprite);
                this._otherActionSprites.push(sprite);
            }
        }
    });

}

Sprite_Minimap.prototype.terminateObjects = function(){
    if (this._tween){
        this._tween.kill();
    }
    for (let i = this._objectSprites.length-1;i >= 0;i--){
        if (this._objectSprites[i].children){
            this._objectSprites[i].children.forEach(child => {   
                gsap.killTweensOf(child);
            });
        }
        gsap.killTweensOf(this._objectSprites[i]);
        this._objectSprites[i].destroy();
    }
    this._objectSprites = null;
    gsap.killTweensOf(this._northSprite);
    this._northSprite.destroy();
    this._northSprite = null;
    gsap.killTweensOf(this._maskGraphic);
    this._maskGraphic.destroy();
    this._maskGraphic = null;
    gsap.killTweensOf(this);
    this._baseSprite.destroy();
    this._baseSprite = null;
    this._fieldSprite.destroy();
    this._fieldSprite = null;
    this._playerSprite.destroy();
    this._playerSprite = null;
    this.destroy();
}

//-----------------------------------------------------------------------------
// Sprite_MinimapPassage
//
// ミニマップ上の通行可能領域表示用スプライトです。

function Sprite_MinimapPassage()
{
    this.initialize(...arguments);
}

Sprite_MinimapPassage.prototype = Object.create(Sprite.prototype);
Sprite_MinimapPassage.prototype.constructor = Sprite_MinimapPassage;

Sprite_MinimapPassage.prototype.initialize = function(width, height)
{
    Sprite.prototype.initialize.call(this);

    this.bitmap = new Bitmap(width, height);
};


//-----------------------------------------------------------------------------
// Sprite_MinimapIcon
//
// ミニマップ上のアイコン用スプライトです。

function Sprite_MinimapIcon()
{
    this.initialize(...arguments);
}

Sprite_MinimapIcon.prototype = Object.create(Sprite.prototype);
Sprite_MinimapIcon.prototype.constructor = Sprite_MinimapIcon;

Sprite_MinimapIcon.prototype.initialize = function()
{
    Sprite.prototype.initialize.call(this);

    this.bitmap   = ImageManager.loadSystem(Params.objectIconImage);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this._object         = null;
    this._lastIconIndex = -1;
    this._blinkDuration = 0;

    this._lastReadNum = 0;
    this._lastDirection = 0;
    this._lastRotation = 0;

    this._lastPositionX = 0;
    this._lastPositionY = 0;
};

/**
 * 追従するオブジェクトの取得
 */
Sprite_MinimapIcon.prototype.getObject = function()
{
    return this._object;
};

/**
 * 追従するオブジェクトの設定
 */
Sprite_MinimapIcon.prototype.setObject = function(object)
{
    this._object = object;
    if (object && object._minimapAttribute.mapName > 0){
        const width = 240;
        const height = 32;
        this.width = width;
        this.height = height;
        this.scale.x = this.scale.y = 0.5;
        this.anchor.x = 0.5;
        this.anchor.y = 0.75;
        this.opacity = 200;
        this.bitmap = new Bitmap(width,height);
        this.bitmap.fontSize = 26;
        let name = TextManager.mapInfosName(object._minimapAttribute.mapName);
        if (object._minimapAttribute.nameArray >= 0){
            name = name.split(' ')[object._minimapAttribute.nameArray];
        }
        this.bitmap.drawText(name,0,0,width,height,"center");
        
        if (object._minimapAttribute.rotation > 0){
            gsap.to(this,0,{rotation : object._minimapAttribute.rotation * ( Math.PI / 180 )});
        }

    } else
    if (object)
    {
        this.bitmap = ImageManager.loadSystem(Params.objectIconImage);
        this.updateIconInfo();
        this._lightObject = new Sprite();
        let bitmap = ImageManager.loadSystem(Params.objectIconImage);
        this._lightObject.bitmap = bitmap;
        this._lightObject.anchor.x = 0.5;
        this._lightObject.anchor.y = 0.5;
        this._lightObject.setBlendColor([255,255,255,180]);
        //this.addChild(this._lightObject)
        // 会話ありか判定
        this._lastReadEvent = object.minimapReadEvent();
    }

    this.refresh();
};

/**
 * アイコン情報の更新
 */
Sprite_MinimapIcon.prototype.updateIconInfo = function()
{
    this._iconSize    = Math.floor(this.bitmap.height / 3);
    this._iconColumns = Math.floor(this.bitmap.width / this._iconSize);
};

/**
 * リフレッシュ
 */
Sprite_MinimapIcon.prototype.refresh = function()
{
    this._lastIconIndex = -1;
};

/**
 * オブジェクト更新
 */
Sprite_MinimapIcon.prototype.update = function()
{
    Sprite.prototype.update.call(this);

    this.updateImage();
    this.updateBlink();

    this.updateEventFlash();
    this.updateReadCount();
};

/**
 * 表示する画像の更新
 */
Sprite_MinimapIcon.prototype.updateImage = function()
{
    if (!this._object)
    {
        return;
    }

    if (!this._iconColumns)
    {
        this.updateIconInfo();
    }

    var iconIndex = this.getCurrentIconIndex();
    if (iconIndex >= 0)
    {
        //if (iconIndex !== this._lastIconIndex)
        {
            this.setIconIndex(iconIndex);
        }
    }
    else
    {
        this._lastIconIndex = iconIndex;
        this.visible = (this._object._minimapAttribute.mapName > 0);
    }
};

/**
 * 現在のオブジェクトに対応するオブジェクトアイコン番号の取得
 */
Sprite_MinimapIcon.prototype.getCurrentIconIndex = function()
{
    if (!this._object)
    {
        return -1;
    }

    return this.getCurrentIconIndexForEvent();
};

/**
 * 現在のイベントに対応するアイコン番号の取得
 */
Sprite_MinimapIcon.prototype.getCurrentIconIndexForEvent = function()
{
    var obj = this._object;

    if (obj.isMinimapMove())
    {
        return 0;
    }
    else if (obj.minimapPersonType() >= 0)
    {
        // person は 2 行目
        return this._iconColumns + obj.minimapPersonType();
    }
    else if (obj.minimapObjectType() >= 0)
    {
        // object は 3 行目
        return this._iconColumns * 2 + obj.minimapObjectType();
    }
    else
    {
        return -1;
    }
};

/**
 * オブジェクトアイコン番号の設定
 */
Sprite_MinimapIcon.prototype.setIconIndex = function(iconIndex)
{
    const x = (iconIndex % this._iconColumns) * this._iconSize;
    const y = Math.floor(iconIndex / this._iconColumns) * this._iconSize;
    const width = this._iconSize;
    const height = this._iconSize;
    this.setFrame(x,y,width,height);
    this._lightObject.setFrame(x,y,width,height);
    this._lastIconIndex = iconIndex;
    this.visible = true;
}

/**
 * 明滅エフェクトの更新
 */
Sprite_MinimapIcon.prototype.updateBlink = function()
{
    this._blinkDuration = (this._blinkDuration + 1) % Params.blinkTime;

    //var color = [255, 255, 255, alpha];
    if (this._lightObject){
        const alpha = 128 * (Math.sin(this._blinkDuration * Math.PI * 2 / Params.blinkTime) + 1);
        this._lightObject.opacity = alpha;
    }
    //this.setBlendColor(color);
};

/**
 * 目的イベントエフェクトの更新
 */
Sprite_MinimapIcon.prototype.updateEventFlash = function()
{
    if (!this._object){
        return;
    }
    if (this._object instanceof Game_Event){
        //更新するタイミングを統一
        if (this._object._enemy != null && this._object._state == State.Battle){
            if (this._eventFlash == null){
                this._eventFlash = new PIXI.Graphics();
                this._eventFlash.beginFill(0xFFFFFF);
                this._eventFlash.drawEllipse(64, 64, 64, 64);
                this._eventFlash.pivot.x = 64;
                this._eventFlash.pivot.y = 64;
                this._eventFlash.endFill();
                this.addChild(this._eventFlash);
                const parent = this.parent;
                const index = _.findIndex(parent.children,this);
                if (index > 0){
                    parent.removeChild(this);
                    parent.addChild(this);
                }
                this._eventFlash.alpha = 0;
            }
            if (this._eventArrow == null){
                this._eventArrow = new Sprite(new Bitmap(20,20));
                this._eventArrow.bitmap.fontSize = 18;
                this._eventArrow.bitmap.drawText(TextManager.getText(301100),0,0,20,20);
                this._eventArrow.anchor.x = 0.5;
                this._eventArrow.anchor.y = 0.5;
                this.parent.addChild(this._eventArrow);
                const parent = this.parent;
                const index = _.findIndex(parent.children,this);
                if (index > 0){
                    parent.removeChild(this);
                    parent.addChild(this);
                }
                this._eventArrow.alpha = 0;
                this._eventArrow.scale.x = this._eventArrow.scale.y = 0.5;
            }
        } else{
            if (this._eventFlash){
                this._eventFlash.scale.x = 0;
                this._eventFlash.scale.y = 0;
            }
            if (this._eventArrow){
                this._eventArrow.alpha = 0;
            }
        }
        if (Graphics.frameCount % 120 == 0){
            if (this._object._enemy != null && this._object._state == State.Battle){
                if (this._eventFlash){
                    this._eventFlash.alpha = 0.75;
                    this._eventFlash.scale.x = 0;
                    this._eventFlash.scale.y = 0;
                    gsap.to(this._eventFlash,1.5,{alpha:0,pixi:{scaleX:1,scaleY:1} });
                }
                if (this._eventArrow){
                    this._eventArrow.alpha = 0.75;
                }
            }
        }
        // 会話アリの時に表示
        this._lastReadEvent = this._object.minimapReadEvent();
        if (this._lastReadEvent != ""){
            let isRead = false;
            if (!$gameParty._commonEventRead){
                $gameParty._commonEventRead = {};
            }
            let readNum = $gameParty._commonEventRead[this._lastReadEvent];
            if (readNum != this._lastReadNum){
                this._lastReadNum = readNum;
                let needNum = $dataEventReadInfos[this._lastReadEvent];
                if (needNum && needNum > 0){
                    if (!readNum){
                        // 会話あり
                        isRead = true;
                    }
                    if (readNum && readNum < needNum){
                        // 会話あり
                        isRead = true;
                    }
                }
                if (isRead && this._readCountSprite == null){
                    this._readCountSprite = new Sprite();
                    this._readCountSprite.bitmap = new Bitmap(16,16);
                    this._readCountSprite.bitmap.fontSize = 21;
                    this._readCountSprite.bitmap.fontItalic = true;
                    this._readCountSprite.bitmap.drawText(TextManager.getText(301500),0,0,16,16);
                    this._readCountSprite.anchor.x = 0.5;
                    this._readCountSprite.anchor.y = 0.5;
                    this._readCountSprite.scale.x = 0.75;
                    this._readCountSprite.scale.y = 0.75;
                    this.addChild(this._readCountSprite);
                    const parent = this.parent;
                    const index = _.findIndex(parent.children,this);
                    if (index > 0){
                        parent.removeChild(this);
                        parent.addChild(this);
                    }
                    this._readCountSprite.alpha = 1;
                    gsap.to(this._readCountSprite,0.8,{alpha:0.75,repeat:-1,yoyo:true });
                }
                if (isRead){
                    this._readCountSprite.alpha = 1;
                    gsap.to(this._readCountSprite,0.8,{alpha:0.75,repeat:-1,yoyo:true });
                }
                if (isRead == false){
                    if (this._readCountSprite != null){
                        this._readCountSprite.alpha = 0;
                        gsap.killTweensOf(this._readCountSprite);
                    }
                }
            }
        }
    }

        
    if (this._eventArrow != null && this._eventFlash != null){
        if (this._object._enemy != null && this._object._state == State.Battle){
            const x = this._eventFlash.parent.x;
            const y = this._eventFlash.parent.y;
            const angle = Math.atan2(y, x) * 180 / Math.PI;
            this._eventArrow.angle = angle + 90;
            const limit = this.parent.parent._maskGraphic.scale.x * 228;
            const distance = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y , 2 ) ) ;
            if (limit < distance){
                const x2 = limit * Math.cos( angle * (Math.PI / 180) ) ;
                const y2 = limit * Math.sin( angle * (Math.PI / 180) ) ;
                this._eventArrow.x = x2;
                this._eventArrow.y = y2;
                this._eventArrow.alpha = 1;
            } else{
                this._eventArrow.alpha = 0;
            }
        } else{
            this._eventArrow.alpha = 0;
        }
    }
};


Sprite_MinimapIcon.prototype.updateReadCount = function(){
    let sprite = this._readCountSprite;
    if (sprite == null) return;
    if (this._lastDirection != $gamePlayer.direction()){
        const direction = $gamePlayer.direction();
        let targetX = null;
        let targetY = null;
        let targetRotation = null;
        let targetTime = 0.4;
        if (this._lastDirection == 0){
            targetTime = 0;
        }
        if (direction == 8){
            targetX = 3;
            targetY = -6;
            if (this._lastDirection == 0){
                targetRotation = 0;
            }
            if (this._lastDirection == 2){
                targetRotation += 1 * Math.PI;
            }
            if (this._lastDirection == 4){
                targetRotation += 1 * Math.PI / 2;
            }
            if (this._lastDirection == 6){
                targetRotation += -1 * Math.PI / 2;
            }
        }
        if (direction == 2){
            targetX = -3;
            targetY = 6;
            if (this._lastDirection == 0){
                targetRotation += -1 * Math.PI;
            }
            if (this._lastDirection == 4){
                targetRotation += -1 * Math.PI / 2;
            }
            if (this._lastDirection == 6){
                targetRotation += 1 * Math.PI / 2;
            }
            if (this._lastDirection == 8){
                targetRotation += -1 * Math.PI;
            }
        }
        if (direction == 4){
            targetX = -6;
            targetY = -3;
            if (this._lastDirection == 0){
                targetRotation += -1 * Math.PI / 2;
            }
            if (this._lastDirection == 2){
                targetRotation += 1 * Math.PI / 2;
            }
            if (this._lastDirection == 6){
                targetRotation += 1 * Math.PI;
            }
            if (this._lastDirection == 8){
                targetRotation += -1 * Math.PI / 2;
            }
        }
        if (direction == 6){
            targetX = 6;
            targetY = 3;
            if (this._lastDirection == 0){
                targetRotation += 1 * Math.PI / 2;
            }
            if (this._lastDirection == 2){
                targetRotation += -1 * Math.PI / 2;
            }
            if (this._lastDirection == 4){
                targetRotation += -1 * Math.PI;
            }
            if (this._lastDirection == 8){
                targetRotation += 1 * Math.PI / 2;
            }
        }
        this._lastDirection = $gamePlayer.direction();
        this._lastRotation += targetRotation;
        if (targetX != null && targetY != null && targetRotation != null){
            gsap.to(sprite,targetTime,{x:targetX,y:targetY,rotation:this._lastRotation});
        }
    }

}

Sprite_MinimapIcon.prototype.updateLastPosition = function(x,y){
    this._lastPositionX = x;
    this._lastPositionY = y;
}

Sprite_MinimapIcon.prototype.checkDifPositionX = function(x){
    return (this._lastPositionX != x );
}
Sprite_MinimapIcon.prototype.checkDifPositionY = function(y){
    return (this._lastPositionY != y );
}

//-----------------------------------------------------------------------------
// Sprite_Map

var _KMS_Spriteset_Map_createUpperLayer = Sprite_Map.prototype.createUpperLayer;
Sprite_Map.prototype.createUpperLayer = function()
{
    _KMS_Spriteset_Map_createUpperLayer.call(this);

    this.createMinimap();

    this.alpha = 0;
    this._minimap.alpha = 0;
    gsap.to(this,0.25,{alpha:1})
};

/**
 * ミニマップの作成
 */
Sprite_Map.prototype.createMinimap = function()
{
    this._minimap = new Sprite_Minimap();
    this._minimap.refresh();
    this.addChild(this._minimap);
};

var _KMS_Spriteset_Map = Sprite_Map.prototype.update;
Sprite_Map.prototype.update = function()
{
    _KMS_Spriteset_Map.call(this);

    this.updateMinimap();
};

/**
 * ミニマップの更新
 */
Sprite_Map.prototype.updateMinimap = function()
{
    //this._minimap.setWholeOpacity(255 - this._fadeSprite.opacity);
    if (this._minimap){
        this._minimap.update();
    }
};

//0827 タッチサークル
Sprite_Map.prototype.minimap = function() {
    return this._minimap;
};


})();
