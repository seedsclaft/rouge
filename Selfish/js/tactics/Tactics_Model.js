class Tactics_Model {
    constructor() {
        this._selectedData = {};
    }
    
    commandList(){
        $gameCommand.menuCommand().forEach(command => {
            this._selectedData[command.key] = [];
        });
        return $gameCommand.menuCommand();
    }

    turnInfo(){
        return 8;
    }

    refreshData(){
        const _param = {
            actorList : this._actorList,
            selectActorId : this._selectActorId
        }
        return _param;
    }

    actorSpriteList(){
        const _actorList = $gameParty.members();
        let _position = $gameTacticsActorPosition.data();
        _position = _.shuffle( _position );
        let data = [];
        _actorList.forEach((actor,index) => {
            data.push({actor:actor,position:_position[index]})
        });
        return this.positionSelectData(data);
    }

    positionSelectData(data){
        return data.sort((a,b) => a.position.x - b.position.x);
    }

    actorPositionData(){
        return $gameTacticsActorPosition.data();
    }

    isSelectedActor(category,actorId){
        return this._selectedData[category] && this._selectedData[category].find(a => a == actorId);
    }

    addSelectData(category,actorId){
        this._selectedData[category].push(actorId);
    }

    removeSelectData(category,actorId){
        this._selectedData[category] = _.without(this._selectedData[category],actorId);
    }

    clearSelectData(){
        this._selectedData = {};
    }
}