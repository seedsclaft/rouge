//=============================================================================
// Game_Color.js
//=============================================================================
/*:
 * @plugindesc 固定の色情報などを管理する。
 * @author econa
 * 
 * @param ColorDataList
 * @type struct<ColorData>[]
 */

/*~struct~ColorData:
 * @param key
 * @type string
 * @default 
 * 
 * @param color
 * @type string
 * @default rgba(255, 255, 255, 1)
 * 
 * @param memo
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_Color
//
// The game object class for an actor.

function Game_Color() {
  this.initialize.apply(this, arguments);
}

Game_Color.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Color');
    var list = [];
    JSON.parse(this._data.ColorDataList).forEach(color => {
        var data = JSON.parse(color);
        list.push(data);
    });
    this._data = list;
};

Game_Color.prototype.getColor = function(key) {
    return _.find(this._data,(data) => data.key == key).color;
}