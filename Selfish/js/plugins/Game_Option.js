//=============================================================================
// Game_Option.js
//=============================================================================
/*:
 * @plugindesc オプションデータ。
 * @author econa
 *
 * @param OptionCategory
 * @desc オプションカテゴリ
 * @type number[]
 * 
 * @param OptionList
 * @desc オプション
 * @type struct<Option>[]
 * @default []
 * */

/*~struct~Option:
 * @param key
 * @type string
 * @default ""
 * 
 * @param category
 * @type number
 * 
 * @param initValue
 * @type number
 * 
 * @param textId
 * @type number
 * 
 * @param type
 * @type select
 * 
 * @option 0-100%
 * @value 1
 * 
 * @option ON/OFF
 * @value 2
 * 
 * @option Other
 * @value 3
 * 
 * @param otherOption
 * @type number[]
 * 
 * @param version
 * @type number
 * @default 0
 * 
 * @param enableAndroid
 * @type boolean
 * @default true
 * 
 * @param enableiOS
 * @type boolean
 * @default true
 * 
 * @param enableMac
 * @type boolean
 * @default true
 * 
 * */

//-----------------------------------------------------------------------------
// 
//
// The game object class for an actor.

function Game_Option() {
    this.initialize.apply(this, arguments);
}

Game_Option.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Option');
    let list = [];
    JSON.parse(this._data.OptionList).forEach(option => {
        let data = JSON.parse(option);
        if (data.otherOption){
            data.otherOption = JSON.parse(data.otherOption);
        }
        if (data.enableAndroid){
            data.enableAndroid = data.enableAndroid == "true" ? true : false;
        }
        if (data.enableiOS){
            data.enableiOS = data.enableiOS == "true" ? true : false;
        }
        if (data.enableMac){
            data.enableMac = data.enableMac == "true" ? true : false;
        }
        list.push(data);
    });

    this._category = [];
    JSON.parse(this._data.OptionCategory).forEach(category => {
        this._category.push( category );
    });

    this._data = list;

    this._userOption = {};
};

Game_Option.prototype.getOptionData = function(categoryIndex) {
    let optionData = _.filter (this._data,(data) => {return data.category == categoryIndex});
    if ($gameDefine.platForm() == PlatForm.Android){
        optionData = _.filter (optionData,(data) => {return data.enableAndroid == true});
    }
    if ($gameDefine.platForm() == PlatForm.iOS){
        optionData = _.filter (optionData,(data) => {return data.enableiOS == true});
    }
    if ($gameDefine.platForm() != PlatForm.Android
        && $gameDefine.platForm() != PlatForm.iOS){
        if (process.platform == 'darwin'){
            optionData = _.filter (optionData,(data) => {return data.enableMac == true});
        }
    }
    if ($gameDefine.mobileMode && $gameTemp.isPlaytest()){
        optionData = _.filter (optionData,(data) => {return data.enableAndroid == true});
        optionData = _.filter (optionData,(data) => {return data.enableiOS == true});
    }
    return optionData;
}

Game_Option.prototype.getCategoryData = function() {
    return this._category;
}

Game_Option.prototype.applyData = function(config) {
    console.log(this._userOption)
    this.initializeSaveIndex();
    this.initializeKeyControl();
    this.initializexpadControl();
    this._data.forEach(option => {
        if (config[option.key] != null){
            this._userOption[option.key] = config[option.key];
        } else{
            this._userOption[option.key] = Number( option.initValue );
        }
    });
    if (config["keyControl"]){
        this._userOption["keyControl"] = config["keyControl"];
    }
    if (config["xpadControl"]){
        this._userOption["xpadControl"] = config["xpadControl"];
    }
    if (config["lastAccessSaveId"] != null){
        this._userOption["lastAccessSaveId"] = config["lastAccessSaveId"];
    }
    if (this._userOption['bgmVolume'] != null){
        AudioManager._bgmVolume = this._userOption['bgmVolume'];
    }
    if (this._userOption['bgsVolume'] != null){
        AudioManager._bgsVolume = this._userOption['bgsVolume'];
    }
    if (this._userOption['seVolume'] != null){
        AudioManager._seVolume = this._userOption['seVolume'];
    }
    AudioManager.updateVolumeOption();
}

Game_Option.prototype.adjustScreen = function() {
    if (!Utils.isNwjs()){
        return;
    }
    const screenMode = this._userOption["screenMode"];
    if (screenMode != null){
        if (screenMode == 0) {
            Graphics._cancelFullScreen();
        } else {
            Graphics._requestFullScreen();
        }
    }
}

Game_Option.prototype.keyControl = function() {
    return this._userOption["keyControl"];
}

Game_Option.prototype.setKeyControl = function(key,value) {
    this._userOption["keyControl"][key] = value;
}

Game_Option.prototype.xpadControl = function() {
    return this._userOption["xpadControl"];
}

Game_Option.prototype.lastAccessSaveId = function() {
    return this._userOption["lastAccessSaveId"];
}

Game_Option.prototype.getUserData = function(key) {
    const optionData = _.find(this._data,(data) => data.key == key);
    if (optionData.type == OptionType.OnOff){    
        return this.getUserDataBoolean(key);
    }
    return this._userOption[key];
}

Game_Option.prototype.getUserDataBoolean = function(key) {
    return this._userOption[key] == 1 ? true : false;
}

Game_Option.prototype.setUserData = function(key,value) {
    this._userOption[key] = value;
    if (key === 'bgmVolume'){
        AudioManager._bgmVolume = value;
    }
    if (key === 'bgsVolume'){
        AudioManager._bgsVolume = value;
    }
    if (key === 'seVolume'){
        AudioManager._seVolume = value;
    }
    this.adjustScreen();
    AudioManager.updateVolumeOption();
}

Game_Option.prototype.makeData = function() {
    return this._userOption;
}

Game_Option.prototype.initializeSettings = function() {
    this._data.forEach(option => {
        this._userOption[option.key] = Number(option.initValue);
    });
    this.initializeKeyControl();
    this.initializexpadControl();
}

Game_Option.prototype.initializeKeyControl = function() {
    const data = {
        left : "ArrowLeft", 
        right : "ArrowRight", 
        up : "ArrowUp", 
        down :"ArrowDown",
        ok :"z",
        escape :"x",
        shift :"s",
        menu :"a",
        pageup :"q",
        pagedown :"w",
        pause : "p",
    };
    this._userOption["keyControl"] = data;
}

Game_Option.prototype.initializexpadControl = function() {
    const data = {
        left : 14, 
        right : 15, 
        up : 12, 
        down :13,
        ok :0,
        escape :1,
        shift :2,
        menu :3,
        pageup :4,
        pagedown :5,
        pause : 6,
    };
    this._userOption["xpadControl"] = data;
}

Game_Option.prototype.initializeSaveIndex = function() {
    this._userOption["lastAccessSaveId"] = 1;
}

const OptionType = {
    Volume : 1,
    OnOff : 2,
    Other : 3
}

const BattleSkipMode = {
    None : 0,
    Skip : 1,
}
