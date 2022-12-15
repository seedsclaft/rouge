//=============================================================================
// Game_TacticsActorPosition.js
//=============================================================================
/*:
 * @plugindesc 固定の色情報などを管理する。
 * @author econa
 * 
 * @param TacticsActorPositionDataList
 * @type struct<TacticsActorPositionData>[]
 */

/*~struct~TacticsActorPositionData:
 * @param id
 * @type number
 * @default 0
 * 
 * @param x
 * @type number
 * @default 0
 * 
 * @param y
 * @type number
 * @default 0
 * 
 * @param scale
 * @type number
 * @default 1.0
 * @decimals 3
 * 
 * @param memo
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_TacticsActorPosition
//

function Game_TacticsActorPosition() {
  this.initialize.apply(this, arguments);
}

Game_TacticsActorPosition.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_TacticsActorPosition');
    let list = [];
    JSON.parse(this._data.TacticsActorPositionDataList).forEach(positionData => {
        let data = JSON.parse(positionData);
        data.x = Number(data.x);
        data.y = Number(data.y);
        data.scale = Number(data.scale);
        list.push(data);
    });
    this._data = list;
};

Game_TacticsActorPosition.prototype.data = function() {
    return this._data;
}