//=============================================================================
// Game_Tutorial.js
//=============================================================================
/*:
 * @plugindesc チュートリアルデータ。
 * @author econa
 *
 * @param TutorialList
 * @desc チュートリアルデータ
 * @type struct<Tutorial>[]
 * @default []
 * */

/*~struct~Tutorial:
 * @param key
 * @type string
 * @default ""
 * 
 * @param text
 * @type note
 * @default ""
 * 
 * @param textData
 * @type struct<TutorialText>[]
 * @default []
 * 
 * */

/*~struct~TutorialText:
 * 
 * @param x
 * @type number
 * @min -9999
 * @default 
 * 
 * @param y
 * @type number
 * @default 
 * 
 * @param textId
 * @type number
 * @default 
 * 
 * @param fontSize
 * @type number
 * @default 
 * 
 * @param color
 * @type string
 * @default 
 * 
 * @param align
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_Tutorial
//
// The game object class for an actor.

function Game_Tutorial() {
  this.initialize.apply(this, arguments);
}

Game_Tutorial.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Tutorial');
    let list = [];
    JSON.parse(this._data.TutorialList).forEach(help => {
        let data = JSON.parse(help);
        //data.text = JSON.parse(data.text);
        if (data.textData){
            let tempText = [];
            data.textData = JSON.parse(data.textData);
            data.textData.forEach(temp => {
                temp = JSON.parse(temp);
                tempText.push(temp);
            });
            data.textData = tempText;
        }
        list.push(data);
    });
    this._data = list;
};

Game_Tutorial.prototype.getData = function(key) {
    const tutorial = _.find(this._data,(data) => data.key == key);
    if (tutorial){
        return tutorial;
    }
    return null;
}


