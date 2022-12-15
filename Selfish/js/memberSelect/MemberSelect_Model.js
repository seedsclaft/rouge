class MemberSelect_Model {
    constructor() {
        this._actorList = null;
        this._selectActorId = [];
    }
    
    actorList(){
        if (this._actorList == null){
            let actorList = [];
            $gameActors._data.forEach(actorData => {
                if (actorData) actorList.push(actorData);
            });
            this._actorList = actorList;
        }
        return this._actorList;
    }

    selectActor(actorId){
        if (this._selectActorId.indexOf(actorId) == -1){
            this._selectActorId.push(actorId);
        } else{
            this._selectActorId = _.without(this._selectActorId,actorId);
        }
    }

    refreshData(){
        const _param = {
            actorList : this._actorList,
            selectActorId : this._selectActorId
        }
        return _param;
    }
}