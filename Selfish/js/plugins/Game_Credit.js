//=============================================================================
// Game_Credit.js
//=============================================================================
/*:
 * @plugindesc クレジットデータ。
 * @author econa
 *
 * @param CreditData
 * @desc クレジット
 * @type note[]
 * @default 
 * */

//-----------------------------------------------------------------------------
// 
//

function Game_Credit() {
    this.initialize.apply(this, arguments);
}

Game_Credit.getData = function() {
    const _data = PluginManager.parameters('Game_Credit');
    let list = [];
    JSON.parse(_data.CreditData).forEach(credit => {
        let textData = JSON.parse(credit);
        textData = textData.split('\n');
        textData.forEach(text => {
            list.push(text);
        });
        list.push("");
        list.push("");
        list.push("");
    });
    return list;
}

Game_Credit.getDataForEndRool = function() {
    const _data = PluginManager.parameters('Game_Credit');
    let list = [];
    JSON.parse(_data.CreditData).forEach(credit => {
        let textData = JSON.parse(credit);
        textData = textData.split('\n');
        let temp = [];
        textData.forEach(text => {
            if (text.length != 0){
                temp.push(text);
            }
            if (text.length == 0){
                list.push(temp);
                temp = [];
            }
        });
    });
    return list;
}