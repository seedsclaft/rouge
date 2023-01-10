//=============================================================================
// Game_Command.js
//=============================================================================
/*:
 * @plugindesc コマンドデータ。
 * @author econa
 *
 * @param MenuCommandList
 * @desc メニューコマンド
 * @type struct<Command>[]
 * @default []
 * 
 * 
 * */

/*~struct~Command:
 * @param key
 * @type string
 * @default 
 * 
 * @param textId
 * @type number
 * @default 
 * 
 * @param helpTextId
 * @type number
 * 
 * @param iconPath
 * @type file
 * @dir img/icon/
 * 
 * @param enable
 * @type string
 * 
 * @param isOpen
 * @type string
 * 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_Command
//

function Game_Command() {
  this.initialize.apply(this, arguments);
}

Game_Command.prototype.initialize = function() {
    this._menuCommand = [];
    this._menuSubCommand = [];
    this._terminalCommand = [];

    this._data = PluginManager.parameters('Game_Command');
    var list = [];
    JSON.parse(this._data.MenuCommandList).forEach(command => {
        var data = JSON.parse(command);
        data.key = data.key != "" ? data.key : "";
        data.textId = Number(data.textId);
        data.helpTextId = Number(data.helpTextId);
        data.iconPath = data.iconPath != null ? String(data.iconPath) : null;
        data.enable = data.enable != "" ? String(data.enable) : null;
        data.isOpen = data.isOpen != "" ? String(data.isOpen) : null;
        list.push(data);
    });
    this._menuCommand = list;

};

Game_Command.prototype.menuCommand = function() {
    return this._menuCommand;
}

Game_Command.prototype.menuSubCommand = function() {
    return this._menuSubCommand;
}

const TacticsCommandType = {
    Train:"train",
    Alchemy:"alchemy",
    Recovery:"recovery",
    Search:"search",
    Status:"status",
    Turnend:"turnend",
}