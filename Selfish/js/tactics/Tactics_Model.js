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
        $gameAlchemy.data().forEach(alchemy => {
            this._alchemyMagicList.push(
                {
                    skill:$dataSkills[alchemy.skill],
                    needRank:alchemy.needRank,
                    cost:Number( alchemy.cost )
                }
            )
        });

        this._selectAlchemy = [];

        this.actorList().forEach(actor => {
            ImageManager.loadFace(actor.faceName())
        });

        this._usedAlchemyParam = [0,0,0,0,0];

        this._searchData = [];
        let searchdData = $gameSearch.data().filter(a => a.eventFlag == false);
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
        return ["stage1",null];
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

    infoData(category){
        let info = [];
        switch (category){
            case "train":
                this._members.forEach(member => {
                    const a = $gameActors.actor(member.actorId());
                    info.push(TextManager.getText(700) + "." + member.level + "\n" + TextManager.getText(740) + eval( $gameDefine.data().TrainCurrency) + TextManager.currencyUnit);
                });
                break;
            case "recovery":
                this._members.forEach(member => {
                    const a = $gameActors.actor(member.actorId());
                    info.push(TextManager.getText(500) + member.hp + TextManager.getText(710) + member.mhp + "\n" + TextManager.getText(740) + eval( $gameDefine.data().RecoveryCurrency) + TextManager.currencyUnit);
                });
                break;
            }
        return info;
    }

    alchemyParam(category){
        let alchemyParam = [0,0,0,0,0];
        let actors = this._selectedData[category].map(a => $gameActors.actor(a));
        actors.forEach(actor => {
            actor.alchemyParam().forEach((param,index) => {
                alchemyParam[index] += param;
            });
        });
        this._usedAlchemyParam.forEach((used,index) => {
            alchemyParam[index] -= used;
        });
        return alchemyParam;
    }

    searchList(){
        return this._searchData;//$gameSearch.data().filter(a => a.eventFlag == false);
    }

    selectAlchemy(){
        return this._selectAlchemy;
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
            case "train":
                return eval( $gameDefine.data().TrainCurrency);
            case "recovery":
                return eval( $gameDefine.data().RecoveryCurrency);
        }
        return 0;
    }
    needEnergy(category,selected){
        let cost = 0;
        switch (category){
            case "train":
                selected.forEach(selectId => {
                    cost += this.needTrainEnergy(category,selectId);
                });
                return cost;
            case "alchemy":
                this._selectAlchemy.forEach(alchemyId => {
                    let alchemy = this._alchemyMagicList.find(a => a.skill.id == alchemyId);
                    if (alchemy){
                        cost += alchemy.cost;
                    }
                });
                return cost;
        }
        return 0;
    }

    checkSelectAlchemy(category,alchemy){
        let result = 0;
        const _cost = alchemy.cost;
        const _needRank = alchemy.needRank;
        const _alchemyParam = this.alchemyParam(category);
        _alchemyParam.forEach((alchemyParam,index) => {
            if (_needRank[index] > alchemyParam){
                result = 1;
            }
        });
        if (result == 0){
            if (_cost > this.energy()){
                result = 2;
            };
        }
        return result;
    }

    checkSelectedAlchemy(_alchemy){
        return this._selectAlchemy.find(a => a == _alchemy);
    }

    selectedActorNameList(category){
        return this._selectedData[category].map(a => $gameActors.actor(a).name()).join(",");
    }

    isSelectedActor(category,actorId){
        return this._selectedData[category].find(a => a == actorId);
    }

    addSelectData(category,actorId){
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
            this._members.push(member);
            this._selectedMembers = _.without(this._selectedMembers,member);
            members.push(member);
        }
        this._members = this.positionSelectData(this._members);
        this._selectedData[category] = [];
        if (category == "alchemy"){
            this._selectAlchemy = [];
            this._usedAlchemyParam = [0,0,0,0,0];
        }
        return members;
    }

    decidedMember(category){
        let members = [];
        const selectIds = this._selectedData[category];
        for (let i = 0;i < selectIds.length;i++){
            let member = this._members.find(a => a.actorId() == selectIds[i]);
            this._selectedMembers.push(member);
            this._members = _.without(this._members,member);
            members.push(member);
        }
        this._members = this.positionSelectData(this._members);
        return members;
    }

    addAlchemy(alchemy){
        this.loseEnergy(alchemy.cost);
        alchemy.needRank.forEach((need,index) => {
            this._usedAlchemyParam[index] += need;
        });
        this._selectAlchemy.push(alchemy.skill.id);
    }

    removeAlchemy(alchemy){
        this.gainEnergy(alchemy.cost);
        alchemy.needRank.forEach((need,index) => {
            this._usedAlchemyParam[index] -= need;
        });
        this._selectAlchemy = _.without(this._selectAlchemy,alchemy.skill.id);
    }

    selectAlchemyName(){
        return this._selectAlchemy.map(a => $dataSkills[a].name).join(",");
    }

    setAlchemy(){
        $gameStage.setAlchemy(this._selectAlchemy);
    }

    setSearchId(serachId){
        $gameStage.setSearchId(serachId);
    }

    decidedAll(){
        return this._members.length == 0;
    }

    turnend(){
        $gameStage.setSelectedData(this._selectedData);
    }
}