//=============================================================================
// Game_BackGround.js
//=============================================================================
/*:
 * @plugindesc 背景データを管理する。
 * @author econa
 * 
 * @param BackGroundDataList
 * @type struct<BackGroundData>[]
 * 
 */

/*~struct~BackGroundData:
 * 
 * @param backGround
 * @type file
 * @dir img/battlebacks1
 * @default 
 * 
 * @param needGridBack
 * @type boolean
 * @default false
 * 
 * */

//-----------------------------------------------------------------------------
// Game_BackGround
//
// The game object class for an actor.

function Game_BackGround() {
  this.initialize.apply(this, arguments);
}

Game_BackGround.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_BackGround');
    let list = [];
    JSON.parse(this._data.BackGroundDataList).forEach(bg => {
        let data = JSON.parse(bg);
        data.needGridBack = (data.needGridBack === "true") ? true:false;
        list.push(data);
    });
    this._data = list;
};

Game_BackGround.prototype.needGridLine = function(background) {
    const find = _.find(this._data,(d) => background.bitmap._url === "img/battlebacks1/" + d.backGround + ".png");
    if (!find){
        return false;
    }
    return find.needGridBack;
}