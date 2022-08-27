//=============================================================================
// Game_Help.js
//=============================================================================
/*:
 * @plugindesc ヘルプデータ。
 * @author econa
 *
 * @param HelpList
 * @desc ガイドデータ
 * @type struct<Help>[]
 * @default []
 * 
 * */

/*~struct~Help:
 * @param key
 * @type string
 * @default 
 * 
 * @param nameId
 * @type number
 * @default 
 * 
 * @param pages
 * @type note[]
 * @default []
 * 
 * @param imgs
 * @type file[]
 * @dir image/helps
 * @default []
 * 
 * @param imgsTexts
 * @type struct<HelpImageText>[]
 * @default []
 * 
 * @param statement
 * @type string
 * @default 
 * 
 * */

/*~struct~HelpImageText:
 * 
 * @param index
 * @type number
 * @default 
 * 
 * @param x
 * @type number
 * @default 
 * 
 * @param y
 * @type number
 * @default 
 * 
 * @param width
 * @type number
 * @default 
 * 
 * @param height
 * @type number
 * @default 
 * 
 * @param scale
 * @type number
 * @default 
 * 
 * @param textId
 * @type number
 * @default 
 * 
 * @param rect
 * @type boolean
 * @default 
 * 
 * @param color
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_Help
//
// The game object class for an actor.

function Game_Help() {
  this.initialize.apply(this, arguments);
}

Game_Help.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Help');
    let list = [];
    JSON.parse(this._data.HelpList).forEach(help => {
        let data = JSON.parse(help);
        data.nameId = Number(data.nameId);
        data.pages = JSON.parse(data.pages);
        let pageData = [];
        data.pages.forEach(page => {
            pageData.push(JSON.parse(page));
        });
        let imgsTexts = [];
        if (data.imgsTexts && data.imgsTexts.length > 0){
            data.imgsTexts = JSON.parse(data.imgsTexts);
            data.imgsTexts.forEach(text => {
                imgsTexts.push(JSON.parse(text));
            });
        }
        data.pages = pageData;
        data.imgsTexts = imgsTexts;
        data.imgs = JSON.parse(data.imgs);
        list.push(data);
    });
    this._data = list;
    /*
    $dataText['helpText'] = this._data.map(d => d != null ? d.pages : null);
    console.log($dataText['helpText'])
    */
};

Game_Help.prototype.getHelpData = function(key) {
    const help = _.find(this._data,(data) => data.key == key);
    if (help){
        if (key == "stateinfo"){
            this.convertStateInfoHelp();
        }
        return help;
    }
    return null;
}

Game_Help.prototype.refresh = function() {
    if ($gameSwitches.value(1) == false) return;
    const keyData = $gameParty._helpKeyData;
    if (!keyData) return;
    this._data.forEach(helpdata => {
        if (helpdata.statement){
            if (eval(helpdata.statement)){
                if (!_.find(keyData,(data) => data.key == helpdata.key)){
                    keyData.push({key:helpdata.key , isOpen:true, isRead : false});
                    const tips = $gameTips.getTipsDataByKey("newhelp");
                    TipsManager.setTips(tips);
                }
            }
        } else{
            if (!_.find(keyData,(data) => data.key == helpdata.key)){
                keyData.push({key:helpdata.key , isOpen:true, isRead : true});
            }
        }
    });
}

Game_Help.prototype.convertStateInfoHelp = function() {
    let help = _.find(this._data,(data) => data.key == "stateinfo");
    if (help){
        help.pages = this.stateInfoPages();
        help.imgs = [];
        help.pages.forEach(data => {
            help.imgs.push("");
        });
    }
}

Game_Help.prototype.stateInfoPages = function() {
    let pageData = [];
    let idx = 0;
    let pageInfo = {};
    let pageArray = [];
    $gameStateInfo._data.forEach(element => {
        if ($dataStates[element.id].iconIndex == 0){
            return;
        }
        // バフ系は表示しない
        if (element.id > 100 && element.id < 200){
            return;
        }
        if (!element.textId){
            return;
        }
        if (element.textId == 0){
            return;
        }
        idx += 1;
        pageInfo = {iconId:$dataStates[element.id].iconIndex,title : TextManager.getText( element.textId ), text : TextManager.getText( element.textId + 1 )};
        
        pageArray.push(pageInfo);
        if (idx >= 11){
            idx = 0;
            pageData.push(pageArray);
            pageArray = [];
        }

    });
    if (pageArray.length != 0){
        pageData.push(pageArray);
    }
    return pageData;
}