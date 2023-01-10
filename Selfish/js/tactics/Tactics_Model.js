class Tactics_Model {
    constructor() {
        this._selectedData = $gameStage.selectedData();
        console.log(this._selectedData)
        let _actorList = $gameParty.members();
        _actorList = _.sortBy(_actorList,(a) => a.selectedIndex());
        let _position = $gameTacticsActorPosition.data();
        _actorList.forEach((actor,index) => {
            actor.setPosition(_position[index]);
        });
        this._members = this.positionSelectData(_actorList);
        this._selectedMembers = [];


        this._alchemyMagicList = [];
        /*
        $gameAlchemy.data().forEach(alchemy => {
            this._alchemyMagicList.push(
                {
                    skill:$dataSkills[alchemy.skill],
                    cost:Number( alchemy.cost )
                }
            )
        });
        */
        this._alchemyMagicList.push(
            {
                skill:$dataSkills[11],
                cost:Number( 1 )
            }
        )

        this._selectAlchemy = {};

        this.actorList().forEach(actor => {
            ImageManager.loadFace(actor.faceName())
        });


        this._searchData = [];
        let searchdData = $gameSearch.data().filter(a => a.eventFlag == false);
        console.log(searchdData)
        searchdData = _.shuffle(searchdData);
        const _stageData = $gameStageData.stageData($gameStage._stageId);
        for (let i = 0; i < 4 ;i ++){
            let rank = $gameParty.enemyRank() + (i * 2);
            searchdData[i].pt = rank;
            searchdData[i].enemyNum = Math.floor( (_stageData.turns - $gameStage.turns()) / 6) + 1;
            searchdData[i].lvMin = rank;
            searchdData[i].lvMax = rank;
            searchdData[i].bossLv = rank;
            this._searchData.push(searchdData[i]);
        }
    }

    eventCheck(){
        const _stageData = $gameStageData.stageData($gameStage._stageId);
        const _readEvent = $gameStage.readEvent();
        if (_stageData){
            const _turn = (_stageData.turns) - $gameStage._turns;
            const _timing = 0;
            const event = _stageData.eventData.find(a => a.turns == _turn && a.timing == _timing);
            if (event && !_readEvent.contains(event.eventName)){
                $gameStage.addReadEvent(event.eventName);
                return event.eventName;
            }
        }
        return null;
    }

    backGround(){
        return ["274",null];
    }

    stageBgm(){
        return $gameBGM.getBgm('stage1');
    }

    actorList(){
        return $gameParty.members();
    }

    energy(){
        return $gameParty.gold();
    }

    gainEnergy(value){
        $gameParty.gainGold(value);
    }

    loseEnergy(value){
        $gameParty.loseGold(value);
    }
    
    positionSelectData(data){
        return data.sort((a,b) => a.position().x - b.position().x);
    }
    
    commandList(){
        return $gameCommand.menuCommand();
    }

    magicCategory(){
        return $gameElement.data();
    }

    alchemyMagicList(){
        return this._alchemyMagicList;
    }

    searchList(){
        return this._searchData;//$gameSearch.data().filter(a => a.eventFlag == false);
    }
    
    turnInfo(){
        return $gameStage._turns;
    }

    refreshData(){
        const _param = {
            actorList : this._actorList,
            selectActorId : this._selectActorId
        }
        return _param;
    }

    actorSpriteList(){
        return this._members;
    }

    actorPositionData(){
        return $gameTacticsActorPosition.data();
    }

    selectedData(category){
        return this._selectedData[category];
    }

    needTrainEnergy(category,actorId){
        let a = $gameActors.actor(actorId);
        switch (category){
            case TacticsCommandType.Train:
                return eval( $gameDefine.data().TrainCurrency);
            case TacticsCommandType.Recovery:
                return eval( $gameDefine.data().RecoveryCurrency);
        }
        return 0;
    }
    
    needEnergy(category,selected){
        let cost = 0;
        switch (category){
            case TacticsCommandType.Train:
                selected.forEach(selectId => {
                    cost += this.needTrainEnergy(category,selectId);
                });
                return cost;
            case TacticsCommandType.Alchemy:
                selected.forEach(selectId => {
                    if (this._selectAlchemy[selectId]){
                        cost += this._selectAlchemy[selectId].cost;
                    }
                });
                return cost;
            case TacticsCommandType.Recovery:
                selected.forEach(selectId => {
                    cost += this.needTrainEnergy(category,selectId);
                });
                return cost;
        }
        return 0;
    }

    isEnableAlchemy(alchemy){
        return alchemy.cost <= this.energy();
    }

    selectedActorNameList(category){
        return this._selectedData[category].map(a => $gameActors.actor(a).name()).join(",");
    }

    isSelectedActor(category,actorId){
        return this._selectedData[category].find(a => a == actorId);
    }

    addSelectData(category,actorId){
        console.error(this._selectedData[category])
        this._selectedData[category].push(actorId);
    }

    removeSelectData(category,actorId){
        this._selectedData[category] = _.without(this._selectedData[category],actorId);
    }

    clearSelectData(category){
        let members = [];
        const selectIds = this._selectedData[category];
        for (let i = 0;i < selectIds.length;i++){
            let member = this._selectedMembers.find(a => a.actorId() == selectIds[i]);
            if (member){
                this._members.push(member);
                this._selectedMembers = _.without(this._selectedMembers,member);
                members.push(member);
            }
        }
        this._members = this.positionSelectData(this._members);
        this._selectedData[category] = [];
        if (category == TacticsCommandType.Alchemy){
            this._selectAlchemy = {};
        }
        return members;
    }

    decidedMember(category){
        let members = [];
        const selectIds = this._selectedData[category];
        for (let i = 0;i < selectIds.length;i++){
            let member = this._members.find(a => a.actorId() == selectIds[i]);
            if (member){
                this._selectedMembers.push(member);
                this._members = _.without(this._members,member);
                members.push(member);
            }
        }
        this._members = this.positionSelectData(this._members);
        return members;
    }

    addAlchemy(actorId,alchemy){
        this.loseEnergy(alchemy.cost);
        if (!this._selectAlchemy[actorId]) this._selectAlchemy[actorId] = {};
        this._selectAlchemy[actorId] = {skillId: alchemy.skill.id,cost:alchemy.cost};
    }

    setSearchData(serach){
        $gameStage.setSearchData(serach);
    }

    decidedAll(){
        return this._members.length == 0;
    }

    turnend(){
        $gameStage.setAlchemy(this._selectAlchemy);
        $gameStage.setSelectedData(this._selectedData);
    }
}