class Model_Menu extends Model_Base {
    constructor() {
        super();
        this._lastDisPlayEffect = $dataOption.getUserData("displayEffect");
    }
    
    selectActor(){
        return $gameParty.menuActor();
    }

    selectActorIndex(){
        return $gameParty.allMembers().indexOf($gameParty.menuActor());
    }

    selectActorSkillIds(){
        return [];
    }

    selectActorSkillItems(index,selectSkill){
        const actor = this.selectActor();
        const element = actor.slotElement(index);
        const data = actor.getReserveSkillData(element);
        return _.chain(data).sortBy((d) => d).sortBy((d) => $dataSkills[d] && $dataSkills[d].damage.elementId == element).sortBy((d) => d != selectSkill.skillId).value();
    }

    removeNewSkillId(item){
        if (item){
            $gameParty._newSkillIdList = _.without($gameParty._newSkillIdList,item);
        }
    }

    changeSlotSkill(index,item){
        this.selectActor().changeSlotSkill(index,item);
    }

    changeSelectActor(value){
        if (value == 1){
            $gameParty.makeMenuActorNext();
        }
        if (value == -1){
            $gameParty.makeMenuActorPrevious();
        }
    }

    pushLimitBreakSkillId(actor,ids){
    }

    menuCommand(){
        return $gameCommand.menuCommand();
    }

    libraryCommand(){
        return $gameCommand.menuSubCommand();
    }

    slotSkillData(){
        const actor = this.selectActor();
        let slotSkillData = [];
        return slotSkillData;
    }


    needDisPlayEffectChange(){
        return this._lastDisPlayEffect != $dataOption.getUserData("displayEffect");
    }

    roleData(){
        const _player = this.player();
        const _roleStateId = $gameDefine.RoleStateIdArray;
        let list = [];
        _roleStateId.forEach(roleStateId => {
            list.push(
                {
                    state:$dataStates[roleStateId],
                    level:_player.getStateEffect(roleStateId)
                }
            )
        });
        return list;
    }

    player(){
        return $gameParty.battleMembers()[0];
    }
}