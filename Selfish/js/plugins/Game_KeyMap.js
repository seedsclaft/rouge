//=============================================================================
// Game_KeyMap.js
//=============================================================================
/*:
 * @plugindesc キーマップデータ。
 * @author econa
 *
 * @param KeyMapList
 * @desc キーマップリスト
 * @type struct<KeyMapList>[]
 * @default []
 * */

/*~struct~KeyMapList:
 * @param key
 * @type string
 * @default ""
 * 
 * @param text
 * @type string
 * @default ""
 * 
 * */

//-----------------------------------------------------------------------------
// Game_KeyMap
//

class Game_KeyMap {
    constructor(){
        this.initialize();
    }

    initialize(){
        this._data = PluginManager.parameters('Game_KeyMap');
        let list = [];
        JSON.parse(this._data.KeyMapList).forEach(keymap => {
            let data = JSON.parse(keymap);
            list.push(data);
        });
        this._data = list;
    }

    getKeyMap(key){
        let help = _.find(this._data,(data) => data.key == key);
        if (help){
            return help.text;
        }
        return null;
    }
}