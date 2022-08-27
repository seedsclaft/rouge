//=============================================================================
// Game_Achievement.js
//=============================================================================
/*:
 * @plugindesc 達成データ。
 * @author econa
 *
 * @param AchievementList
 * @desc Achievement
 * @type struct<Achievement>[]
 * @default []
 * 
 * */

/*~struct~Achievement:
 * @param key
 * @type string
 * @default 
 * 
 * @param textid
 * @type number
 * @default 
 * 
 * @param statement
 * @type string
 * @default 
 * 
 * @param platform
 * @type select
 * @option All
 * @value 1
 * @option Steam
 * @value 2
 * @option DlSite
 * @value 3
 * @option Android
 * @value 4
 * @option iOs
 * @value 5
 * 
 * @param memo
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_Achievement
//

function Game_Achievement() {
  this.initialize.apply(this, arguments);
}

Game_Achievement.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Achievement');
    let list = [];
    JSON.parse(this._data.AchievementList).forEach(achievement => {
        let data = JSON.parse(achievement);
        list.push(data);
    });

    this._data = list;
};

Game_Achievement.prototype.checkAchievement = function() {
}