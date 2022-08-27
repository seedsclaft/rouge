//-----------------------------------------------------------------------------
// Game_Result
//

function Game_Result() {
    this.initialize.apply(this, arguments);
}

Game_Result.prototype.initialize = function() {
    this._recordData = [];
    this.setup();
};

Game_Result.prototype.setup = function() {
    const baseData = new Game_ResultData(Game_ResultType.Base);
    this._recordData.push(baseData);
}

Game_Result.prototype.gainRecordData = function(data) {
    const sameIdData = _.find(this._recordData,(record) => record._id == data._id);
    if (sameIdData){
        if (sameIdData._turnCount > data._turnCount){
            this._recordData = _.without(this._recordData,sameIdData);
            this._recordData.push(data);
            this._recordData = _.sortBy(this._recordData,(data) => data._id);
            return {isNew:true,old:sameIdData._turnCount,new:data._turnCount};
        }
    } else{
        this._recordData.push(data);
        return {isNew:true,new:data._turnCount};
    }
    return {isNew:false};
}

function Game_ResultData() {
    this.initialize.apply(this, arguments);
}

Game_ResultData.prototype.initialize = function(type,params) {
    if (params === undefined){
        params = null;
    }
    this._type = type;
    if (type == Game_ResultType.Base){
        this._id = 0;

        this._text = "";
    }
    if (type == Game_ResultType.Battle){
        if (params){
            this._id = params.id;
            this._time = params.time;
            this._turnCount = params.turnCount;
    
            this._partyMemberId = params.partyMemberId;
            this._finishActorId = params.finishActorId;
            this._finishSkillId = params.finishSkillId;
    
            this._bossId = params.bossId;
            let stageNameId = this._id;
            if (this._id > 100){
                stageNameId -= 100;
            }
            this._text = TextManager.getText(DataManager.getStageInfos(stageNameId).nameId);
            this._sended = params.sended;
        }
    }
};

Game_ResultData.prototype.actor = function() {
    if (this._type == Game_ResultType.Base){
        var actorId = 1;
        var max = 0;
        $gameActors._data.forEach(actor => {
            if (actor && max < $gameSystem.useActorCount(actor.actorId())){
                max = $gameSystem.useActorCount(actor.actorId());
                actorId = actor.actorId();
            }
        });
        return $dataActors[actorId];
    }
    if (this._type == Game_ResultType.Battle){
        return $dataActors[this._finishActorId];
    }
}

var Game_ResultType = {
    Base :0,
    Battle :1
}