//=============================================================================
// Game_Element.js
//=============================================================================
/*:
 * @plugindesc 属性相性管理。
 * @author econa
 * 
 * @param Fire
 * @desc 炎
 * @default 1
 * 
 * @param Thunder
 * @desc 雷
 * @default 2
 * 
 * @param Ice
 * @desc 氷
 * @default 3
 * 
 * @param White
 * @desc 白
 * @default 4
 * 
 * @param Black
 * @desc 黒
 * @default 5
 * 
 */

//-----------------------------------------------------------------------------
// Game_Element
//
// The game object class for an actor.

function Game_Element() {
  this.initialize.apply(this, arguments);
}

Game_Element.prototype.initialize = function() {
    this._data = [];
    const data = PluginManager.parameters('Game_Element');
    Object.keys(data).forEach(keys => {
        let elementData = JSON.parse(data[keys]);
        this._data.push(elementData);
    });
};

Game_Element.prototype.gainElement = function(id,elementId) {
    const data = _.find(this._data,(d) => d.id == id);
    return data && data.gain == elementId;
};

Game_Element.prototype.lessElement = function(id,elementId) {
    const data = _.find(this._data,(d) => d.id == id);
    return data && data.less == elementId;
};
