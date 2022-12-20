//-----------------------------------------------------------------------------
// Game_Stage
//

class Game_Stage {
    constructor(){
        this._init = false;
        this._turns = 0;
        this._selectedData = {};
        this._alchemyData = [];
        this._searchId = 0;
        this.initialize();
    }

    initialize(){
        $gameCommand.menuCommand().forEach(command => {
            this._selectedData[command.key] = [];
        });
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
}