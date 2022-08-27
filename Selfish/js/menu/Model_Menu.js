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
    
    skillSpGain(skillId,value){
        if (skillId < $gameDefine.defaultSlotId){
            return false;
        }
        const lv = this.selectActor().skillLevel(skillId);
        const max = $dataSkills[skillId].maxLevel;
        if (lv >= max && value > 0){
            return false;
        }
        const actor = this.selectActor();

        actor.refreshPassive();
        actor.setHp(actor.mhp);
        return true;
    }

    pushLimitBreakSkillId(actor,ids){
        actor._skills.forEach(skillId => {
            let lemitBreakSkill = $dataSkills[skillId+1000];
            if (skillId && lemitBreakSkill != null && lemitBreakSkill.damage.elementId == actor.selfElement()){
                ids.push(lemitBreakSkill);
            }
        });
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