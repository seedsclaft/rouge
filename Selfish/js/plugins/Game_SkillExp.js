//=============================================================================
// Game_SkillExp.js
//=============================================================================
/*:
 * @plugindesc スキル経験値データ。
 * @author econa
 *
 * @param SkillExpList
 * @desc 通常文字色
 * @type struct<SkillExp>[]
 * */

/*~struct~SkillExp:
 * @param id
 * @type number
 * @default 0
 * 
 * @param expData
 * @type string
 * @default 
 * 
 * @param memo
 * @type string
 * @default ""
 * 
 * */


//-----------------------------------------------------------------------------
// Game_SkillExp
//
// The game object class for an actor.

function Game_SkillExp() {
  this.initialize.apply(this, arguments);
}

Game_SkillExp.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_SkillExp');
    var list = [];
    JSON.parse(this._data.SkillExpList).forEach(skillExp => {
        var data = JSON.parse(skillExp);
        var expList = data.expData.split(',');
        data.id = Number(data.id);
        data.nextExp = [];
        expList.forEach(exp => {
            data.nextExp.push(Number(exp));
        });
        list.push(data);
    });
    this._data = list;
};

Game_SkillExp.prototype.getData = function(id) {
    var data = _.find(this._data,(data) => data.id == id);
    if (data){
        return data.nextExp;
    }
    return null;
}


