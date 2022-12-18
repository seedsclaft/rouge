class Tactics_Model {
    constructor() {
        this._selectedData = {};
        $gameCommand.menuCommand().forEach(command => {
            this._selectedData[command.key] = [];
        });

        const _actorList = $gameParty.members();
        let _position = $gameTacticsActorPosition.data();
        _position = _.shuffle( _position );
        let data = [];
        _actorList.forEach((actor,index) => {
            data.push({actor:actor,position:_position[index]})
        });
        this._members = this.positionSelectData(data);
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

        console.log($gameParty)
    }
    
    positionSelectData(data){
        return data.sort((a,b) => a.position.x - b.position.x);
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
            let member = this._selectedMembers.find(a => a.actor.actorId() == selectIds[i]);
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
            let member = this._members.find(a => a.actor.actorId() == selectIds[i]);
            this._selectedMembers.push(member);
            this._members = _.without(this._members,member);
            members.push(member);
        }
        this._members = this.positionSelectData(this._members);
        return members;
    }
}