//=============================================================================
// Game_Search.js
//=============================================================================
/*:
 * @plugindesc 索敵データ。
 * @author econa
 *
 * @param SearchList
 * @desc 
 * @type struct<Search>[]
 * */

/*~struct~Search:
 * @param rank
 * @type number
 * @default 0
 * 
 * @param troop
 * @type troop[]
 * 
 * @param lvMin
 * @type number
 * @default 0
 * 
 * @param lvMax
 * @type number
 * @default 0
 * 
 * @param bossTroop
 * @type troop
 * 
 * @param bossLv
 * @type number
 * @default 0
 * 
 * @param memo
 * @type string
 * @default ""
 * 
 * */


//-----------------------------------------------------------------------------
// Game_Search
//

function Game_Search() {
  this.initialize.apply(this, arguments);
}

Game_Search.prototype.initialize = function() {
    let data = PluginManager.parameters('Game_Search');
    this._data = [];
    JSON.parse(data.SearchList).forEach(search => {
        let data = JSON.parse(search);
        this._data.push(data);
    });
};

Game_Search.prototype.data = function() {
    return this._data;
}


