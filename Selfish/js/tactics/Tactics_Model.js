class Tactics_Model {
    constructor() {
        if ($gameParty._stageData._init == false){
            $gameParty._stageData.initialize();
        }
        this._selectedData = $gameParty._stageData._selectedData;

        const _actorList = $gameParty.members();
        let _position = $gameTacticsActorPosition.data();
        _position = _.shuffle( _position );
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
                    cost:alchemy.cost
                }
            )
        });

        this._selectAlchemy = [];
    }

    energy(){
        return $gameParty.gold();
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
        return $gameSearch.data();
    }

    selectAlchemy(){
        return this._selectAlchemy;
    }
    
    turnInfo(){
        return $gameParty._stageData._turns;
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
        this._selectAlchemy.push(alchemy);
        console.log(
        this._selectAlchemy)
    }

    selectAlchemyName(){
        return this._selectAlchemy.map(a => $dataSkills[a].name).join(",");
    }

    turnend(){
        $gameParty._stageData._selectedData = this._selectedData;
    }
}