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
 * @param id
 * @type number
 * 
 * @param enemy
 * @type enemy[]
 * 
 * @param enemyNum
 * @type number
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
 * @param pt
 * @type number
 * @default 0
 * 
 * @param eventFlag
 * @type boolean
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
        data.id = Number(data.id);
        data.lvMin = Number(data.lvMin);
        data.lvMax = Number(data.lvMax);
        data.bossLv = Number(data.bossLv);
        data.bossEnemy = Number(data.bossEnemy);
        data.enemy = data.enemy != null ? data.enemy.split(',').map(a => Number(a.replace(/[^0-9]/g,""))) : [];
        data.enemyNum = Number(data.enemyNum);
        data.pt = Number(data.pt);
        data.eventFlag = Boolean(data.eventFlag && data.eventFlag == "true");
        this._data.push(data);
    });
    // 野良データ作成
    let enemy = []
    for (let i = 0;i < 20;i++){
        enemy.push(i+1);
    }
    for (let i = 0;i < 20;i++){
        let data = {};
        data.enemy = enemy;
        data.bossEnemy = i;
        data.eventFlag = false;
        this._data.push(data);
    }
    
};

Game_Search.prototype.data = function() {
    return this._data;
}

Game_Search.prototype.getData = function(id) {
    return this._data.find(a => a.id == id);
}


