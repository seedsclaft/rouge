//=============================================================================
// Game_Alchemy.js
//=============================================================================
/*:
 * @plugindesc 魔法習得データ。
 * @author econa
 *
 * @param AlchemyList
 * @desc 
 * @type struct<Alchemy>[]
 * */

/*~struct~Alchemy:
 * @param skill
 * @type skill
 * 
 * @param fire
 * @type number
 * @default 0
 * 
 * @param thunder
 * @type number
 * @default 0
 * 
 * @param ice
 * @type number
 * @default 0
 * 
 * @param white
 * @type number
 * @default 0
 * 
 * @param black
 * @type number
 * @default 0
 * 
 * 
 * @param memo
 * @type string
 * @default ""
 * 
 * */


//-----------------------------------------------------------------------------
// Game_Alchemy
//

function Game_Alchemy() {
  this.initialize.apply(this, arguments);
}

Game_Alchemy.prototype.initialize = function() {
    let data = PluginManager.parameters('Game_Alchemy');
    this._data = [];
    JSON.parse(data.AlchemyList).forEach(alchemy => {
        let data = JSON.parse(alchemy);
        let needRank = [
            Number( data.fire ),
            Number( data.thunder),
            Number( data.ice ),
            Number( data.white ),
            Number( data.black )
        ];
        data.needRank = needRank;
        this._data.push(data);
    });
};

Game_Alchemy.prototype.data = function() {
    return this._data;
}


