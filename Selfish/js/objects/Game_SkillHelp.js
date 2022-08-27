class Game_SkillHelp{
    constructor(battler,skillId,awakeFlag){
        this._damageRateUp = false;
        skillId = this.changeExpSkill(battler,skillId);
        this._elementId = this.skillElement(battler,skillId);
        this._power = this.evalDamage(battler,skillId);
        this._hit = $dataSkills[skillId].repeats;
        if ($dataSkills[skillId].damage.type == 0){
            this._hit = 0;
        }
        this._baseText = this.replaceText(battler,skillId);
        if (awakeFlag){
            this._baseText = this.changeAwake(battler,skillId);
        }
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
        if (battler instanceof Game_Battler && battler.isActor()){
            const skill = battler.getSkillData(skillId,battler.skillLevel(skillId));
            return skill.id;
        }
        return skillId;
    }

    skillElement(battler,skillId){
        const skill = $dataSkills[skillId];
        if (skill.damage.elementId == -1 || skill.damage.elementId == 0){
            if (battler.elementId) return battler.elementId;
            return battler._selfElement;
        }
        return skill.damage.elementId;
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
            if (battler instanceof Game_Battler && battler.isActor()){
                value = ((8 + battler.skillLevel(skillId) * 2) * 1).padZero(1);
            } else{
                value = 20;
            }
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
        const limitBreakId = $gameStateInfo.getStateId(StateType.LIMIT_BREAK);
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
        if (item.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE_SELF){
            text = TextManager.getText(700400);
        } else
        if (item.stypeId == Game_BattlerBase.SKILL_TYPE_SELF){
            text = TextManager.getText(700600);
        } else
        if (item.stypeId == Game_BattlerBase.SKILL_TYPE_SPECIAL){
            text = TextManager.getText(700700);
        } else
        if (item.stypeId == 0 && item.id > $gameDefine.defaultSlotId){
            text = TextManager.getText(700800);
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

    changeAwake(battler,skillId){
        var text = this._baseText;
        var awakeData = _.find(SkillAwakeManager.getActorClassData(battler),(info) => info.skillId == skillId);
        if (awakeData && !battler.isLearnedSkill(skillId)){
            if (awakeData.awake.type == 0){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5000);
                text = text.replace("\\l", awakeData.awake.level);
                text = text.replace("\\N", battler.name());
            } else if (awakeData.awake.type == 4 || awakeData.awake.type == 9){
                var text = TextManager.getText(700500) + "\n";
                awakeData.awake.skill.forEach(s => {
                    var base = TextManager.getText(5040);
                    base = base.replace("\\m", TextManager.getSkillName(s.id));
                    base = base.replace("\\a", s.lv);
                    text += base + "\n";
                });
            } else if (awakeData.awake.type == 7){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5070);
                awakeData.awake.skill.forEach(s => {
                    text = text.replace("\\m", TextManager.getSkillName(s.id));
                });
                this.setHelpWindowText(text);
            } else if (awakeData.awake.type == 8){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5080);
            } else if (awakeData.awake.type == 3){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5030);
            } else if (awakeData.awake.type == 2){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5020);
            } else if (awakeData.awake.type == 1){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5010);
            } else if (awakeData.awake.type == 10){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5090);
            } else if (awakeData.awake.type == 11){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5100);
            } else if (awakeData.awake.type == 12){
                var text = TextManager.getText(700500) + "\n";// + TextManager.getText(5110);
                if ($gameParty.hasStage(15)){
                    var temp = TextManager.getText(5110).split("");
                    var isReplace = false;
                    temp.forEach(t => {
                        if (t != "？"){
                            if (isReplace == false){
                                isReplace = true;
                                text += TextManager.getText(5111);
                            }
                            text += t;
                        }
                    });
                } else{
                    text += TextManager.getText(5110);
                }
            } else if (awakeData.awake.type == 13){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5120);
            } else if (awakeData.awake.type == 14){
                var text = TextManager.getText(700500) + "\n" + TextManager.getText(5130).format(awakeData.awake.value);
            }
        }
        return text;
    }
}