class Model_MagicInfo {
    constructor() {
        this._category = MagicInfoCategory.None;
    }

    magicIdList (){
        let magicIds = _.sortBy($gameParty._learnedSkills);
        magicIds = _.filter(magicIds,(id) => {return this.filterCategory( $dataSkills[id] )});
        magicIds = this.addLimitBreakSkills(magicIds);
        magicIds = this.sortSkillIds(magicIds);
        magicIds = this.changeExpSkill(magicIds);
        return magicIds;
    }

    selectCategory(select){
        this._category += select;
        if (this._category > 6) this._category = 0;
        if (this._category < 0) this._category = 6;
    }

    changeExpSkill(ids){
        let result = [];
        ids.forEach(skillId => {
            let baseSkill = $dataSkills[skillId];
            let battler = $gameActors.actor(baseSkill.damage.elementId);
            if (battler){
                let skill = battler.getSkillData(skillId,battler.skillLevel(skillId));
                result.push( skill.id );
            } else{
                result.push( skillId );
            }
        });
        return result;
    }

    filterCategory(skill){
        if (this._category == MagicInfoCategory.None){
            return true;
        }
        if (skill.damage && this._category == skill.damage.elementId){
            return true;
        }
        return false;
    }

    categoryText(){
        let text = "";
        if (this._category == 0) return text + TextManager.getText(1200010);
        let elementText = "";
        if ($dataOption.getUserData("language") == LanguageType.English){
            elementText = TextManager.getDamageElement( this._category );
        } else{
            elementText = TextManager.getText(700100);
            elementText = elementText.replace("\\T", TextManager.getDamageElement( this._category ));
        }
        return text + elementText;
    }

    addLimitBreakSkills(ids){
        const limitBreakId = $gameStateInfo.getStateId(StateType.LIMIT_BREAK);
        for (let i = 1 ; i < 6 ; i++){
            let actor = $gameActors.actor(i);
            let added = false;
            actor._skills.forEach(skillId => {
                let skill = $dataSkills[skillId];
                if (skill.damage && (this._category == skill.damage.elementId || this._category == MagicInfoCategory.None)){
                    if (_.find(skill.effects ,(effect) => effect.code == Game_Action.EFFECT_ADD_STATE && effect.dataId == limitBreakId)){
                        if (added == false){
                            this.pushLimitBreakSkillId(actor,ids);
                            added = true;
                        }
                    }
                }
            });
        }
        return ids;
    }

    pushLimitBreakSkillId(actor,ids){
        actor._skills.forEach(skillId => {
            let lemitBreakSkill = $dataSkills[skillId+1000];
            if (skillId && lemitBreakSkill != null && lemitBreakSkill.damage.elementId == actor.selfElement()){
                ids.push(skillId+1000);
            }
        });
    }

    sortSkillIds(ids){
        let sortIndex = [];
        ids.forEach(skillId => {
            if (skillId > 1000){
                sortIndex.push({id:skillId, index:skillId - 1000 + 0.1});
            } else{
                sortIndex.push({id:skillId, index:skillId});
            }
        });
        sortIndex = _.sortBy(sortIndex,(sort) => sort.index);
        let result = [];
        sortIndex.forEach(sort => {
            result.push(sort.id);
        });
        return result;
    }
}

const MagicInfoCategory = {
    None : 0,
    Element1 : 1,
    Element2 : 2,
    Element3 : 3,
    Element4 : 4,
    Element5 : 5,
    Element6 : 6,
}
