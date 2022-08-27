//=============================================================================
// Game_Tips.js
//=============================================================================
/*:
 * @plugindesc Tipsデータ。
 * @author econa
 *
 * @param TipsList
 * @desc Tips
 * @type struct<Tips>[]
 * @default []
 * 
 * */

/*~struct~Tips:
 * @param key
 * @type string
 * @default 
 * 
 * @param id
 * @type number
 * @default 
 * 
 * @param text
 * @type string[]
 * @default 
 * 
 * @param helpText
 * @type note[]
 * @default 
 * 
 * @param mobileMode
 * @type boolean
 * @default false
 * 
 * @param memo
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_Tips
//

function Game_Tips() {
  this.initialize.apply(this, arguments);
}

Game_Tips.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Tips');
    let list = [];
    JSON.parse(this._data.TipsList).forEach(tips => {
        let data = JSON.parse(tips);
        data.key = data.key;
        data.id = Number(data.id);
        data.nameId = Number(data.nameId);
        data.text = JSON.parse(data.text);
        let helpTextList = [];
        data.helpText = JSON.parse(data.helpText);
        data.helpText.forEach(helpData => {
            helpTextList.push(JSON.parse(helpData));
        });
        data.helpText = helpTextList;
        data.mobileMode = data.mobileMode != null ? JSON.parse(data.mobileMode) : false;
        if ($gameDefine.mobileMode == true){
            if (data.mobileMode){
                list[list.length-1] = list;
            } else{
                list.push(data);
            }
        } else{
            if (!data.mobileMode){
                list.push(data);
            }
        }
    });

    this._data = list;
    var tipsText = [];
    var tipsHelpText = [];
};

Game_Tips.prototype.findTips = function() {
    return _.find(this._data,(data) => this.checkTips(data.id) && !$gameParty.checkReadTips(data.id));
}

Game_Tips.prototype.checkTips = function(tipsId) {
    switch (tipsId){
        case 1: // ステージが２・味方の誰か毒状態
        return $gameParty.stageNo() == 2 && _.find($gameParty.members(),(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.POISON)));
    }
    return false;
}

Game_Tips.prototype.getTipsData = function(id) {
    const tips = _.find(this._data,(data) => data.id == id);
    if (tips){
        return tips;
    }
    return null;
}

Game_Tips.prototype.getTipsDataByKey = function(key) {
    const tips = _.find(this._data,(data) => data.key == key);
    if (tips){
        return tips;
    }
    return null;
}

Game_Tips.prototype.getTipsText = function(id) {
    return TextManager.getTipsText(id);
}

Game_Tips.prototype.getTipsHelpText = function(id) {
    return TextManager.getTipsHelpText(id);
}


