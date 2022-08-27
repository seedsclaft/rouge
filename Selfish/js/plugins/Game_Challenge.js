//=============================================================================
// Game_Challenge.js
//=============================================================================
/*:
 * @plugindesc チャレンジデータを管理する。
 * @author econa
 * 
 * @param ChallengeDataList
 * @type struct<ChallengeData>[]
 * 
 */

/*~struct~ChallengeData:
 * 
 * @param id
 * @type number
 * @default 0
 * 
 * @param troopId
 * @type troop
 * @default 
 * 
 * @param lv
 * @type number
 * @default 1
 * 
 * @param backGround
 * @type file
 * @dir img/battlebacks1
 * @default 
 * 
 * @param conditionTextIds
 * @type number[]
 * @default 
 * 
 * @param statement
 * @type string
 * @default 
 * 
 * @param loseType
 * @type number
 * @default 0
 * 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_Challenge
//

function Game_Challenge() {
  this.initialize.apply(this, arguments);
}

Game_Challenge.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Challenge');
    let list = [];

    JSON.parse(this._data.ChallengeDataList).forEach(rush => {
        let data = JSON.parse(rush);
        data.id = data.id != null ? Number(data.id) : 0;
        data.troopId = data.troopId != null ? Number(data.troopId) : 0;
        data.lv = data.lv != null ? Number(data.lv) : 0;
        data.conditionTextIds = (data.conditionTextIds != null && data.conditionTextIds != "") ? JSON.parse(data.conditionTextIds) : [];
        data.loseType = data.loseType != null ? Number(data.loseType) : 0;
        list.push(data);
    });
    this._data = list;
};

Game_Challenge.prototype.getChallengeDataList = function(lv) {
    return bossData = _.filter(this._data,(data) => {return eval(data.statement) == true });
}

Game_Challenge.prototype.getChallengeIdByTroopId = function(troopId) {
    const challengeData = _.find(this._data,(data) => {return data.troopId == troopId });
    return challengeData != 0 ? challengeData.id : 0;
}

