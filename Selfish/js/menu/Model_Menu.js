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

    selectActorStatusSkills(){
        let data = [];
        this.selectActor().currentClass().learnings.forEach(function(learning) {
            const skill = $dataSkills[learning.skillId];
            const awakeInfo = _.find(SkillAwakeManager.getActorClassData(this.selectActor()),(a) => a.skillId == learning.skillId);
            let flag = true;
            if (awakeInfo && awakeInfo.type == 4 && awakeInfo.skill && awakeInfo.skill.length > 0){
                awakeInfo.skill.forEach(skill => {
                    if (!this.selectActor().isLearnedSkill(skill.id)){
                        flag = false;
                    }
                });
            }
            if (flag){
                data.push(skill);
            }
        }, this);
        // 覚醒魔法を追加
        const limitBreakId = $gameStateInfo.getStateId(StateType.LIMIT_BREAK);
        this.selectActor()._skills.forEach(skillId => {
            let skill = $dataSkills[skillId];
            if (_.find(skill.effects ,(effect) => effect.code == Game_Action.EFFECT_ADD_STATE && effect.dataId == limitBreakId)){
                this.pushLimitBreakSkillId(this.selectActor(),data);
            }
        });

        // 習得>ID順にソート
        const self = this;
        data = data.sort(function(a,b){
            if((self.selectActor().isLearnedSkill(a.id) || a.id > 1000 ) && !(self.selectActor().isLearnedSkill(b.id) || b.id > 1000 )) return -1;
            if(!(self.selectActor().isLearnedSkill(a.id) || a.id > 1000 ) && (self.selectActor().isLearnedSkill(b.id) || b.id > 1000 )) return 1;
            if(a.id<b.id) return -1;
            if(a.id>b.id) return 1;
        },this);
        return data;
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

    skillItemData(index,selectSkill){
        const actor = this.selectActor();
        let skills = this.selectActorSkillItems(index,selectSkill);
        let skillItemData = [];
        skills.forEach(skillId => {
            let skill = $dataSkills[skillId];
            skillItemData.push(new Game_SlotSkill(
                skillId,
                {
                    mpCost:actor.skillMpCost(skill),
                    level:actor.skillLevel(skillId),
                    lessLevel:actor.skillLevelWithoutSP(skillId),
                    expRate:actor.getSkillExpPercent(skillId),
                    expRateTotal:actor.getSkillExpPercentTotal(skillId),
                    selected:_.find(actor.slotSkillIds(), (slotSkillId) => slotSkillId == skillId),
                    elementId:[skill.damage.elementId,skill.damage.elementId,skill.damage.elementId],
                    helpData:new Game_SkillHelp(actor,skillId)
                })
            )
        });
        skillItemData.push(new Game_SlotSkill(
            $gameDefine.removeSkillId,
            {
                mpCost:-1,
                elementId:[6,6,6],
                helpData:new Game_SkillHelp(actor,$gameDefine.removeSkillId)
            })
        );
        return skillItemData;
    }

    statusSkillData(){
        const actor = this.selectActor();
        const skills = this.selectActorStatusSkills();
        let statusSkillData = [];
        skills.forEach(skill => {
            let skillId = skill.id;
            statusSkillData.push(new Game_SlotSkill(
                skillId,
                {
                    mpCost:actor.skillMpCost(skill),
                    hideFlag:(!actor.isLearnedSkill(skillId) && skillId < 1000),
                    elementId:[skill.damage.elementId,skill.damage.elementId,skill.damage.elementId],
                    helpData:new Game_SkillHelp(actor,skillId,true)
                })
            );
        });
        return statusSkillData;
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