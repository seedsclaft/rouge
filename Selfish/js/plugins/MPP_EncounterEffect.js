//=============================================================================
// MPP_EncounterEffect.js
//=============================================================================
// Copyright (c) 2018 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.2】戦闘開始時のエフェクトを特殊なものに変更します。
 * @author 木星ペンギン
 *
 * @help プラグインコマンド:
 *   EncEffChar evId             # エフェクトの中心となるキャラクター
 *   EncEffColor r g b           # エフェクトの色を変更
 *   EncEffType type             # 画面の割れ方を変更
 * 
 * ※ プラグインコマンドにて指定する値には変数が使用できます。
 *    v[n] と記述することでn番の変数の値を参照します。
 * 
 * ================================================================
 * ▼プラグインコマンド詳細
 * --------------------------------
 *  〇EncEffChar evId
 *      evId : エフェクトの中心となるイベントのID
 *  
 *   次の１回のみ、エフェクトが指定したイベントIDの
 *   キャラクターを中心に実行されます。
 *   
 *   0を指定した場合は[このイベント]、
 *   -1を指定した場合は[プレイヤー]となります。
 *    
 * --------------------------------
 *  〇EncEffColor r g b
 *      r g b : エフェクトの色RGB
 *  
 *   次の１回のみ、エフェクトが指定した色に変更されます。
 *    
 * --------------------------------
 *  〇EncEffType type
 *      type : 画面の割れ方
 *  
 *   エフェクトの画面の割れ方が指定したタイプに変更されます。
 * 
 * ================================================================
 * ▼プラグインパラメータ詳細
 * --------------------------------
 *  〇Break Type (画面の割れ方)
 *   -1 : デフォルトのエンカウントエフェクト
 *   0  : キャラクターを中心に三角形に割れる
 *   1  : キャラクターを中心に四角形に割れる
 *   
 * ================================================================
 * ▼補足
 * --------------------------------
 *  〇プラグインコマンドにて中心となるキャラクターを指定していない場合、
 *   ランダムエンカウントでは[プレイヤー]、
 *   イベントコマンドの【戦闘の処理】では[このイベント]が中心となります。
 *  
 *  〇モバイル機器で実行した場合は一部のエフェクトが省略されます。
 * 
 *  〇MPP_PreloadBattleImage.js(戦闘画像先読み込み)プラグインと
 *   併用した場合、画像読み込み完了まで画面が割れたエフェクトを維持します。
 *  
 *   これにより、Loadingの文字が表示される時間が短くなります。
 * 
 *  〇プラグインコマンドで使用するコマンド名は、
 *   プラグインパラメータから変更できます。
 *  
 *   コマンドを短くしたり日本語にしたりなどして、
 *   自分が使いやすいようにしてください。
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param Effect Duration
 * @type number
 * @min 1
 * @desc エフェクト時間
 * @default 90
 * 
 * @param Default Color
 * @desc エフェクトのデフォルト色
 * (r,g,bで指定)
 * @default 255,255,255
 * 
 * @param Radial Number
 * @type number
 * @min 3
 * @desc 放射状に分割する数
 * @default 10
 * 
 * @param Radial Random Rate
 * @desc 放射状に分割する際の乱数
 * (0～1)
 * @default 0.9
 * 
 * @param Circle Radius
 * @type number
 * @min 1
 * @desc 円状に分割する際の基本半径
 * @default 96
 * 
 * @param Circle Increase Rate
 * @desc 円状に分割する際の増加率
 * @default 1.5
 * 
 * @param Circle Random Rate
 * @desc 円状に分割する際の乱数
 * (0～1)
 * @default 0.4
 * 
 * @param === Command ===
 * 
 * @param Plugin Commands
 * @type struct<Plugin>
 * @desc プラグインコマンド名
 * @default {"EncounterEffectCharacter":"EncEffChar","EncounterEffectColor":"EncEffColor","EncounterEffectType":"EncEffType"}
 * @parent === Command ===
 * 
 * 
 */

/*~struct~Plugin:
 * @param EncounterEffectCharacter
 * @desc エフェクトの中心となるキャラクター
 * @default EncEffChar
 * 
 * @param EncounterEffectColor
 * @desc エフェクトの色を変更
 * @default EncEffColor
 * 
 * @param EncounterEffectType
 * @desc エフェクトの色を変更
 * @default EncEffType
 * 
 */


var MPPlugin = {};

(function() {
    
    var parameters = PluginManager.parameters('MPP_EncounterEffect');
    
    MPPlugin.EffectDuration = Number(parameters['Effect Duration'] || 90);
    MPPlugin.DefaultColor = parameters['Default Color'];
    
    MPPlugin.width = Number(parameters['Radial Number']);
    MPPlugin.RadialRandomRate = Number(parameters['Radial Random Rate']);
    MPPlugin.CircleRadius = Number(parameters['Circle Radius']);
    MPPlugin.CircleIncreaseRate = Number(parameters['Circle Increase Rate']);
    MPPlugin.CircleRandomRate = Number(parameters['Circle Random Rate']);
    
    var commands = JSON.parse(parameters['Plugin Commands']);
    commands.EncounterEffectCharacter = commands.EncounterEffectCharacter || "EncEffChar";
    commands.EncounterEffectColor = commands.EncounterEffectColor || "EncEffColor";
    commands.EncounterEffectType = commands.EncounterEffectType || "EncEffType";
    MPPlugin.PluginCommands = commands;
    
})();

var Alias = {};

//-----------------------------------------------------------------------------
// EncounterEffect

var EncounterEffect = {};

EncounterEffect.character = null;
EncounterEffect.color = null;
EncounterEffect._encounterEffectDuration = -1;

EncounterEffect.setup = function(bitmap,pointX,pointY) {
    var minX = 0;
    var minY = 0;
    var maxX = Graphics.width;
    var maxY = Graphics.height;
    
    var char = this.character;
    if (!char && $gameMap._interpreter.isRunning()) {
        char = $gameMap._interpreter.character(0);
    }
    char = char || $gamePlayer;
    if (!this.color) this.color = MPPlugin.DefaultColor;
    var cx = pointX;//Math.round(char.screenX()+76).clamp(minX, maxX - 1);
    var cy = pointY;//(Math.round(char.screenY()) - 24 - 144).clamp(minY, maxY - 1);
    this._data = [];
    this._center = [cx, cy];
    var startR = 0;
    /*
    if (Utils.isMobileDevice()) {
        startR = Math.randomInt(4) / 2;
    } else {
        startR = Math.random() * 2;
    }
    */
    startR = Math.random() * 2;
    var bType = -1;
    var width = 16;//MPPlugin.width;
    var radius = 96;//MPPlugin.CircleRadius;
    var randomWidth = MPPlugin.RadialRandomRate;
    var randomHeight = MPPlugin.CircleRandomRate;
    var baseAngle = 2 / width;
    
    // 座標作成
    function createPos(j) {
        var angle = startR + baseAngle * j;
        angle += baseAngle * Math.random() * randomWidth;
        angle %= 2;
        var r = radius * (0.8 + Math.random() * randomHeight);
        var sx = r * Math.cos(angle * Math.PI);
        var sy = r * Math.sin(angle * Math.PI);
        var out = false;
        if (sx !== 0 && cx + sx < minX) {
            sy *= (minX - cx) / sx;
            sx = minX - cx;
            out = true;
        }
        if (sx !== 0 && cx + sx >= maxX) {
            sy *= (maxX - cx) / sx;
            sx = maxX - cx;
            out = true;
        }
        if (sy !== 0 && cy + sy < minY) {
            sx *= (minY - cy) / sy;
            sy = minY - cy;
            out = true;
        }
        if (sy !== 0 && cy + sy >= maxY) {
            sx *= (maxY - cy) / sy;
            sy = maxY - cy;
            out = true;
        }
        return [Math.round(cx + sx), Math.round(cy + sy), out];
    }
    function addFrame(frame) {
        for (var i = 0; i < frame.length - 1; i++) {
            var pos1 = frame[i];
            for (var j = i + 1; j < frame.length; j++) {
                var pos2 = frame[j];
                if (pos1[0] === pos2[0] && pos1[1] === pos2[1]) {
                    frame.splice(j, 1);
                    j--;
                }
            }
        }
        if (frame.length > 2) {
            EncounterEffect._data.push(frame);
        }
    }
    
    var inPos, frame, pos1, pos2, pos3, pos4;
    for (var i = 0; i < 10; i++) {
        if (bType === 0) startR += baseAngle / 2;
        if (i === 9) radius = 1000000;
        var outPos = [];
        var create = false;
        for (var j = 0; j <= width; j++) {
            if (j < width) {
                outPos[j] = createPos(j);
            }
            if (j > 0) {
                frame = [];
                if (i > 0) {
                    pos1 = inPos[j % width];
                    pos2 = inPos[j - 1];
                    if (pos1[2] && pos2[2]) {
                        continue;
                    }
                    if (bType === 0) {
                        frame.push(pos1);
                    } else {
                        frame.push(pos1, pos2);
                    }
                } else {
                    frame.push(this._center);
                }
                pos3 = outPos[j - 1];
                pos4 = outPos[j % width];
                frame.push(pos3);
                if (pos3[0] === minX && pos4[1] === minY) {
                    frame.push([minX,minY]);
                } else if (pos3[1] === minY && pos4[0] === maxX) {
                    frame.push([maxX,minY]);
                } else if (pos3[0] === maxX && pos4[1] === maxY) {
                    frame.push([maxX,maxY]);
                } else if (pos3[1] === maxY && pos4[0] === minX) {
                    frame.push([minX,maxY]);
                } else if (pos3[0] === minX && pos4[0] === maxX) {
                    frame.push([minX,minY]);
                    frame.push([maxX,minY]);
                } else if (pos3[1] === minY && pos4[1] === maxY) {
                    frame.push([maxX,minY]);
                    frame.push([maxX,maxY]);
                } else if (pos3[0] === maxX && pos4[0] === minX) {
                    frame.push([maxX,maxY]);
                    frame.push([minX,maxY]);
                } else if (pos3[1] === maxY && pos4[1] === minY) {
                    frame.push([minX,maxY]);
                    frame.push([minX,minY]);
                }
                frame.push(pos4);
                addFrame(frame);
                create = true;
                if (i > 0 && bType === 0) {
                    addFrame([pos1, pos2, pos3]);
                }
            }
        }
        if (!create) {
            break;
        }
        inPos = outPos;
        radius += MPPlugin.CircleRadius * MPPlugin.CircleIncreaseRate;
    }

    var zoom = this.zoom();
    this.bitmap = new Bitmap(maxX / zoom, maxY / zoom);
    this.bitmap.blt(bitmap, 0, 0, maxX, maxY, 0, 0, maxX / zoom, maxY / zoom);

    this.baseSprite = new Sprite();
    this.baseSprite.bitmap = bitmap;
    //this.baseSprite.bitmap = new Bitmap(maxX, maxY);
    this.baseSprite.bitmap.blt(bitmap, 0, 0, maxX, maxY, 0, 0);
    this._sprites = [];
    for (var i = 0; i < this._data.length; i++) {
        var sprite = new Sprite_Encounter();
        //sprite.setSnap(this._data[i], this.bitmap, this._center);
        this._sprites[i] = sprite;
        this.baseSprite.addChildAt(sprite, 0);
    }
};

EncounterEffect.draw = function(index) {
    var frame = this._data[index];
    var bitmap = this.baseSprite.bitmap;
    var sprite = this._sprites[index];
    sprite.setSnap(frame, this.bitmap, this._center, this.color);

    var context = bitmap._context;
    context.save();
    context.beginPath();
    context.moveTo(frame[0][0], frame[0][1]);
    for (var i = 1; i < frame.length; i++) {
        context.lineTo(frame[i][0], frame[i][1]);
    }
    context.closePath();
    context.clip();
    context.clearRect(0, 0, Graphics.width, Graphics.height)
    context.restore();
    bitmap._baseTexture.update();
};

EncounterEffect.clearBitmap = function() {
    this.bitmap = null;
    this.baseSprite.bitmap = null;
    this.character = null;
    this.color = null;
};

EncounterEffect.clear = function() {
    this._data = null;
    this._center = null;
    this._sprites = null;
    this.baseSprite = null;
    this._opacity = 0;
};

EncounterEffect.startBattle = function() {
    for (var i = 0; i < this._sprites.length; i++) {
        this._sprites[i].startBattle(this._center);
    }
    this._opacity = 480 + 120;
};

EncounterEffect.updateBattle = function() {
    if (this.isValid()) {
        this._opacity -= 3;
        this.baseSprite.opacity = this._opacity;
        if (this._opacity === 390 + 120) {
            for (var i = 0; i < this._sprites.length; i++) {
                this._sprites[i]._pace = 1;
            }
        }
        return this._opacity === 0;
    }
    return false;
};

EncounterEffect.maxItems = function() {
    return this._data ? this._data.length : 0;
};

EncounterEffect.isValid = function() {
    return !!this._data;
};

EncounterEffect.zoom = function() {
    return 2;
};

EncounterEffect.isReady = function() {
    return !this.isValid() || this._opacity < 320;
};

//-----------------------------------------------------------------------------
// Sprite_Encounter

function Sprite_Encounter() {
    this.initialize.apply(this, arguments);
}

Sprite_Encounter.prototype = Object.create(Sprite.prototype);
Sprite_Encounter.prototype.constructor = Sprite_Encounter;

Sprite_Encounter.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.scale.x = 2;
    this.scale.y = 2;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    
    this._flashColor = null;
    this._flashDuration = 0;
    this._speed = 0;
    this._pace = 0;
    this._moveX = 0;
    this._moveY = 0;
    this._rotationX = 0;
    this._rotationY = 0;
    this._rotationZ = 0;
    if (Math.random() < 0.5) {
        this._rotationSpeedX = (Math.random() + 0.5) * 2;
        this._rotationSpeedX *= (Math.random() < 0.5 ? -1 : 1);
        this._rotationSpeedY = 0;
    } else {
        this._rotationSpeedX = 0;
        this._rotationSpeedY = (Math.random() + 0.5) * 2;
        this._rotationSpeedY *= (Math.random() < 0.5 ? -1 : 1);
    }
    this._rotationSpeedZ = (Math.random() - 0.5) * 2;
    this._zoom = EncounterEffect.zoom();
    this._zoomSpeed = (0.25 + Math.random()) / 800;
};

Sprite_Encounter.prototype.setSnap = function(frame, snap, center, color) {
    var xs = frame.map(function(pos) { return pos[0]; });
    var ys = frame.map(function(pos) { return pos[1]; });
    var minX = Math.min.apply(null, xs);
    var minY = Math.min.apply(null, ys);
    var width = Math.max.apply(null, xs) - minX;
    var height = Math.max.apply(null, ys) - minY;
    var zoom = this._zoom;
    var bitmap = new Bitmap(width / zoom, height / zoom);
    var cx = minX + width / 2;
    var cy = minY + height / 2;
    var radian = Math.atan2(cy - center[1], cx - center[0]);
    
    var context = bitmap._context;
    //context.scale(2 / zoom, 2 / zoom);
    if (!context){
        return;
    }
    context.translate(-minX / zoom, -minY / zoom);
    context.beginPath();
    context.moveTo(frame[0][0] / zoom, frame[0][1] / zoom);
    for (var i = 1; i < frame.length; i++) {
        context.lineTo(frame[i][0] / zoom, frame[i][1] / zoom);
    }
    context.closePath();
    var rx = 16 * Math.cos(radian);
    var ry = 16 * Math.sin(radian);
    context.translate(rx * Math.random(), ry * Math.random());
    context.fillStyle = context.createPattern(snap._canvas, 'no-repeat');
    context.fill();
    
    context.lineWidth = 4 / zoom;
    context.strokeStyle = 'rgb(' + color + ')';
    context.globalAlpha = 0.5;
    context.stroke();
    context.globalAlpha = 1;
    
    this.bitmap = bitmap;
    this.x = cx;
    this.y = cy;
    //this._flashDuration = 24;
    //this._flashColor = eval('[' + color + ',255]');
    //this.setFrame(0, 0, width, height);
    //this.setBlendColor(this._flashColor);
    
    this._moveX = rx / 32;
    this._moveY = ry / 32;
    this.startEncounter(center);
};

Sprite_Encounter.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._flashDuration > 0) {
        var d = --this._flashDuration;
        this._flashColor[3] *= d / (d + 1);
        if (d % (Utils.isMobileDevice() ? 24 : 8) === 0) {
            //this.setBlendColor(this._flashColor);
        }
    }
    if (this._pace !== 0) {
        if (this._pace < 0) {
            this._speed *= 1.1;
        } else if (this._pace > 0) {
            this._speed *= 0.98;
        }
        this.x += this._moveX * this._speed * 2.5;
        this.y += this._moveY * this._speed * 2;
        
        this._zoom += this._zoomSpeed * this._speed;
        this._rotationX += this._rotationSpeedX * this._speed * 0.75;
        this._rotationY += this._rotationSpeedY * this._speed * 0.75;
        this._rotationZ += this._rotationSpeedZ * this._speed * 1;

        this.scale.x = Math.cos(this._rotationX * Math.PI / 180) * this._zoom;
        this.scale.y = Math.cos(this._rotationY * Math.PI / 180) * this._zoom;
        //this.rotation = this._rotationZ * Math.PI / 180;
    }
};

Sprite_Encounter.prototype.startEncounter = function(center) {
    var sx = this.x - center[0];
    var sy = this.y - center[1];
    this._speed = 16 / Math.sqrt(sx * sx + sy * sy);
    //this._speed *= 8//16 / Math.sqrt(sx * sx + sy * sy);
    //this._pace = 1;
    this._speed *= 3.2
};

Sprite_Encounter.prototype.startBattle = function(center) {
    var sx = this.x - center[0];
    var sy = this.y - center[1];
    //this._speed = 0;
    this._pace = -1;
};

//-----------------------------------------------------------------------------
// Battle_Scene

//22
/*
Alias.ScBat_start = Scene_Base.prototype.start;
Battle_Scene.prototype.start = function() {
    Alias.ScBat_start.call(this);
    if (EncounterEffect.isValid()) {
        EncounterEffect.startBattle();
        this.addChild(EncounterEffect.baseSprite);
    }
};
*/

//29
Alias.ScBat_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    Alias.ScBat_update.call(this);
    if ($gamePause == true){
        return;
    }
    if (EncounterEffect.updateBattle()) {
        this.removeChild(EncounterEffect.baseSprite);
        EncounterEffect.clear();
    }
    if (EncounterEffect._encounterEffectDuration > 0) {
        EncounterEffect._encounterEffectDuration--;
        var speed = 60;
        var n = speed - EncounterEffect._encounterEffectDuration;
        var end = Math.floor(speed * 1 / 2);
        if (n >= 3 && n < end) {
            var i = Math.floor(EncounterEffect.maxItems() * (n - 3) / (end - 3));
            var max = Math.floor(EncounterEffect.maxItems() * (n - 2) / (end - 3));
            
            for (; i < max; i++) {
                EncounterEffect.draw(i);
            }
        }
        if (n === end) {
            EncounterEffect.clearBitmap();
        }
        if (n === Math.floor(speed / 5)) {
        }
        if (n === speed && !ImageManager.isReady()) {
            EncounterEffect._encounterEffectDuration = 1;
        }
    }
};

