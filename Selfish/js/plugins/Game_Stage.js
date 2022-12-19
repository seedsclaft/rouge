//-----------------------------------------------------------------------------
// Game_Stage
//

class Game_Stage {
    constructor(){
        this._init = false;
        this._turns = 0;
        this._selectedData = {};
    }

    initialize(){
        $gameCommand.menuCommand().forEach(command => {
            this._selectedData[command.key] = [];
        });
    }
}