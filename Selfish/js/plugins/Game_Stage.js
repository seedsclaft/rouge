//=============================================================================
// Game_Stage.js
//=============================================================================
/*:
 * @plugindesc ステージデータ。
 * @author econa
 *
 * @param StageDataList
 * @desc 通常文字色
 * @type struct<StageData>[]
 * */

/*~struct~StageData:
 * @param id
 * @type number
 * @default 0
 * 
 * @param turns
 * @type number
 * @default 0
 * 
 * @param bossId
 * @type number
 * @default 0
 * 
 * @param memo
 * @type string
 * @default ""
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
        data.id = Number(data.id);
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

class Game_Stage {
    constructor(){
        this._init = false;
        this._stageId = 0;
        this._turns = 0;
        this._selectedData = {};
        this._alchemyData = [];
        this._searchId = 0;
    }

    initialize(stageId){
        $gameCommand.menuCommand().forEach(command => {
            this._selectedData[command.key] = [];
        });
        this._stageId = stageId;
        this._turns = $gameStageData.stageData(stageId).turns;
    }
    
    selectedData(){
        return this._selectedData;
    }

    alchemyData(){
        return this._alchemyData;
    }

    searchId(){
        return this._searchId;
    }

    setSearchId(searchId){
        this._searchId = searchId;
    }

    setAlchemy(alchemyData){
        this._alchemyData = alchemyData;
    }

    turns(){
        return this._turns;
    }

    setSelectedData(selectedData){
        this._selectedData = selectedData;
    }

    clearSelect(){
        Object.keys(this._selectedData).forEach(key => {
            this._selectedData[key] = [];
        });
        this._alchemyData = [];
        this._searchId = 0;
    }
}