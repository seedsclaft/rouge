class Game_SkillHelp{
    constructor(battler,skillId,awakeFlag){
        this._damageRateUp = false;
        skillId = this.changeExpSkill(battler,skillId);
        this._power = this.evalDamage(battler,skillId);
        this._hit = $dataSkills[skillId].repeats;
        if ($dataSkills[skillId].damage.type == 0){
            this._hit = 0;
        }
        this._baseText = this.replaceText(battler,skillId);
    }

    get elementId (){
        return this._elementId;
    }

    get baseText (){
        return this._baseText;
    }

    get power (){
        return this._power;
    }

    get hit (){
        return this._hit;
    }

    get damageRateUp (){
        return this._damageRateUp;
    }

    changeExpSkill(battler,skillId){

        return skillId;
    }


    replaceText(battler,skillId){
        const scopeType = $dataSkills[skillId].scope;
        let text = this.stypeText(skillId) + "\n";
        let descriptionId = skillId;
        const helpTextId = $dataSkills[skillId].helpTextId;
        if (helpTextId){
            descriptionId = helpTextId;
        }
        text += TextManager.getSkillDescription(descriptionId);
        text = TextManager.convertEscapeCharacters(text);
        text = text.replace(/\x1bS/gi, this.scopeText(scopeType)); 
        
        const skill = $dataSkills[skillId];
        let value;
        if (_.find(skill.effects,(a) => a.code == 21)){

            value = 20;
            text = text.replace(/\x1bE/gi, value);
        } else{
            value = skill.stateEffect;
            text = text.replace(/\x1bE/gi, value);
        }
        // ～属性
        text = text.replace(/\x1bT/gi, TextManager.getDamageElement(this._elementId));
        // アクター名
        let name = "";
        if (battler instanceof Game_Battler && battler.isActor()) {
            name = TextManager.actorName(battler.actorId());
        } else if (battler instanceof Game_Battler && !battler.isActor()){
            name = TextManager.getEnemyName(battler.enemyId());
        } else{
            name = TextManager.getEnemyName(battler.id);
        }
        text = text.replace(/\x1bA/gi, name);
        // 回復
        text = text.replace(/\x1bH/gi, this._power);
        text = text.replace(/\x1bD/gi, this._power);
        text = text.replace(/\x1bR/gi, this._hit);

        text = text.replace(/\x1bN/gi, "\n");
        return text;
    }

    stypeText(skillId){
        const item = $dataSkills[skillId];
        let text = "";
        if (item.stypeId == Game_BattlerBase.SKILL_TYPE_MAGIC && item.damage.elementId > 0){
            text = TextManager.getText(700100);
        } else
        if (item.stypeId == Game_BattlerBase.SKILL_TYPE_MAGIC && item.damage.elementId == -1){
            text = TextManager.getText(700100);
        } else
        if (item.stypeId == Game_BattlerBase.SKILL_TYPE_COMMON){
            text = TextManager.getText(700200);
        } else
        if (item.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE){
            text = TextManager.getText(700300);
        } else
        if (item.stypeId == Game_BattlerBase.SKILL_TYPE_SPECIAL){
            text = TextManager.getText(700700);
        } else{
            if (this._battler){
                text = "\n";
            }
        }
        if (item.id > 1000){
            text += TextManager.getText(700900);
        }
        return text;
    }

    scopeText(scopeType){
        return TextManager.getText(720100 + Number( (scopeType-1) * 10 ));
    }

    evalDamage(battler,skillId){
        var item = $dataSkills[skillId];
        if (item.damage.type == 0 || item.damage.type == 4){
            return 0;
        }
        var a = battler;
        var value = Math.max(eval(item.damage.formula), 0);

        if (battler instanceof Game_Battler && item.damage.type == 1){
            const damageRate = battler.damageRate();
            if (damageRate > 0){
                value += damageRate;
                this._damageRateUp = true;
            }
        }
        return value;
    }

}