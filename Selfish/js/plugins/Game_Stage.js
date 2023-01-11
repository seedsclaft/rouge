//=============================================================================
// Game_Stage.js
//=============================================================================
/*:
 * @plugindesc ステージデータ。
 * @author econa
 *
 * @param StageDataList
 * @desc ステージデータ
 * @type struct<StageData>[]
 * */

/*~struct~StageData:
 * @param id
 * @type number
 * @default 0
 * 
 * @param titleTextId
 * @type number
 * @default 0
 * 
 * @param description
 * @type multiline_string
 * 
 * @param turns
 * @type number
 * @default 0
 * 
 * @param eventData
 * @type struct<StageEventData>[]
 * 
 * @param bossId
 * @type number
 * @default 0
 * 
 * @param memo
 * @type string
 * @default ""
 * 
 * 
 * */
/*~struct~StageEventData:
 * 
 * @param eventName
 * @type string
 * @default ""
 * 
 * @param turns
 * @type number
 * @default 0
 * 
 * @param timing
 * @type number
 * @default 0
 * 
 * */

function Game_StageData() {
    this.initialize.apply(this, arguments);
}

Game_StageData.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Stage');
    let list = [];
    JSON.parse(this._data.StageDataList).forEach(data => {
        data = JSON.parse(data);
        data.titleTextId = Number(data.titleTextId);
        data.description = String(data.description);
        data.id = Number(data.id);
        let eventData = [];
        if (data.eventData){
            JSON.parse(data.eventData).forEach(event => {
                eventData.push(JSON.parse(event));
            });

        }
        data.eventData = eventData;
        
        data.turns = Number(data.turns);
        data.bossId = Number(data.bossId);
        list.push(data);
    });
    this._data = list;
};

Game_StageData.prototype.data = function() {
    return this._data;
}

Game_StageData.prototype.stageData = function(stageId) {
    return this._data.find(a => a.id == stageId);
}

function Game_Stage() {
    this.initialize.apply(this, arguments);
}

Game_Stage.prototype.initialize = function() {
    this._init = false;
    this._stageId = 0;
    this._turns = 0;
    this._selectedData = {};
    this._alchemyData = null;
    this._searchData = null;
    this._readEvent = [];

    this._searchSelection = null;
    this._getAlchemyMagic = {};
}

Game_Stage.prototype.setup = function(stageId){
    $gameCommand.menuCommand().forEach(command => {
        this._selectedData[command.key] = [];
    });
    this._stageId = stageId;
    this._turns = $gameStageData.stageData(stageId).turns;
    this._readEvent = [];
    this._searchSelection = null;
    this._getAlchemyMagic = {};
}

Game_Stage.prototype.gainAlchemyMagic = function(alchemyMagic,value){
    if (this._getAlchemyMagic[alchemyMagic] != null){
        this._getAlchemyMagic[alchemyMagic] = 0;
    }
    this._getAlchemyMagic[alchemyMagic] += value;
}

Game_Stage.prototype.getAlchemyMagic = function(){
    return this._getAlchemyMagic;
}

Game_Stage.prototype.setSearchSelection = function(searchSelection){
    this._searchSelection = searchSelection;
}

Game_Stage.prototype.searchSelection = function(){
    return this._searchSelection;
}

Game_Stage.prototype.selectedData = function(){
    return this._selectedData;
}

Game_Stage.prototype.alchemyData = function(){
    return this._alchemyData;
}

Game_Stage.prototype.searchData = function(){
    return this._searchData;
}

Game_Stage.prototype.setSearchData = function(search){
    this._searchData = search;
}

Game_Stage.prototype.setAlchemy = function(alchemyData){
    this._alchemyData = alchemyData;
}

Game_Stage.prototype.turns = function(){
    return this._turns;
}

Game_Stage.prototype.setSelectedData = function(selectedData){
    this._selectedData = selectedData;
}

Game_Stage.prototype.clearSelect = function(){
    Object.keys(this._selectedData).forEach(key => {
        this._selectedData[key] = [];
    });
    this._alchemyData = null;
    this._searchData = null;
    this._searchSelection = null;
}

Game_Stage.prototype.addReadEvent = function(eventName){
    this._readEvent.push(eventName);
}

Game_Stage.prototype.readEvent = function(){
    return this._readEvent;
}