//=============================================================================
// Game_Text.js
//=============================================================================
/*:
 * @plugindesc システムテキストを設定する。
 * @author econa
 *
 * @param SystemText
 * @type struct<SystemTextData>[]
 * 
 */

/*~struct~SystemTextData:
 * @param id
 * @type number
 * @default 
 * 
 * @param text
 * @type string[]
 * @default 
 * 
 * @param memo
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_Text
//

function Game_Text() {
    this.initialize.apply(this, arguments);
}

Game_Text.prototype.initialize = async function() {
    this._data = {};
    JSON.parse(PluginManager.parameters('Game_Text').SystemText).forEach(stateInfo => {
        const data = JSON.parse(stateInfo);
        const textData = JSON.parse(data.text);
        this._data[data.id] = textData[0];
    });
    const textdata = await this.huckTextData("systemtext");
    if (textdata){
        this._data = textdata;
    }
};

Game_Text.prototype.getText = function(id) {
    const text = this._data[id];
    if (text) return text;
    return '';
}

Game_Text.prototype.getDecideText = function() {
    return this.getText(100);
}

Game_Text.prototype.getCancelText = function() {
    return this.getText(110);
}

Game_Text.prototype.getMenuText = function() {
    return this.getText(200);
}

Game_Text.prototype.getBackText = function() {
    return this.getText(210);
}

Game_Text.prototype.getNewText = function() {
    return this.getText(310);
}

Game_Text.prototype.huckTextData = function(src) {
    const lang = $dataOption.getUserData('language');
    let dirPath = '';
    if (lang == LanguageType.Japanese){
        dirPath = 'jp';
    }
    if (lang == LanguageType.English){
        dirPath = 'en';
    }
    if (lang == LanguageType.Chinese){
        dirPath = 'ch';
    }
    return new Promise(resolve => {
        return DataManager.loadTextData(dirPath + "/" + src,resolve);
    });
}

Game_Text.prototype.huckSystemTextData = async function() {
    this._data = await this.huckTextData("systemText");
}

Game_Text.prototype.baseTextData = function() {
    let _data = {};
    JSON.parse(PluginManager.parameters('Game_Text').SystemText).forEach(stateInfo => {
        const data = JSON.parse(stateInfo);
        const textData = JSON.parse(data.text);
        _data[data.id] = textData[0];
    });
    return _data;
}

const LanguageType = {
    Japanese : 0,
    English : 1,
    Chinese : 2
}