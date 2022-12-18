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
 * @param rankMin
 * @type number
 * @default 0
 * 
 * @param rankMax
 * @type number
 * @default 0
 * 
 * @param rate
 * @type number
 * @default 0
 * 
 * @param enemy
 * @type enemy[]
 * 
 * @param enemyNum
 * @type number[]
 * 
 * @param lvMin
 * @type number
 * @default 0
 * 
 * @param lvMax
 * @type number
 * @default 0
 * 
 * @param bossEnemy
 * @type enemy
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
    JsonEx.parse(data.SearchList).forEach(search => {
        let data = JSON.parse(search);
        data.rate = Number(data.rate);
        data.rankMin = Number(data.rankMin);
        data.rankMax = Number(data.rankMax);
        data.lvMin = Number(data.lvMin);
        data.lvMax = Number(data.lvMax);
        data.bossLv = Number(data.bossLv);
        data.bossEnemy = Number(data.bossEnemy);
        data.enemy = data.enemy.split(',').map(a => Number(a.replace(/[^0-9]/g,"")));
        data.enemyNum = data.enemyNum.split(',').map(a => Number(a.replace(/[^0-9]/g,"")));
        this._data.push(data);
    });
};

Game_Search.prototype.data = function() {
    return this._data;
}


