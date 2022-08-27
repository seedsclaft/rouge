//-----------------------------------------------------------------------------
// Window_MagicInfoStatus
//

class Window_MagicInfoStatus extends Window_Base{
    constructor(x, y, width, height){
        super(new Rectangle( x, y, width, height));
        this.opacity = 0;
        this.setSkillHelpWindow(-32,this.lineHeight() * 2,564,124);
        this._data = null;
    }

    lineHeight(){
        return 36;
    }

    setSkillHelpWindow(x,y,width,height){
        this._skillhelpWindow = new Window_SkillHelp(x,y,width,height,false);
        this.addChild(this._skillhelpWindow);
        this.removeChild(this._downArrowSprite);
        this.addChild(this._downArrowSprite);
    }

    setData(data){
        this._data = data;
        this.refresh();
    }

    refresh(){
        this.contents.clear();
        this.drawBack(0,0,this.width,this.height - 4,0x000000,128);
        this.drawLine();
        this.drawInfo();
    }

    drawLine(){
        const y = 2;
        const width = 160;
        this.drawLineText(TextManager.getText(1200200),20,y, width);
        this.drawLineText(TextManager.getText(10200),324 + 24,y, width);
        this.drawLineText(TextManager.getText(10300),408 + 64,y, width);
        this.drawText(TextManager.getText(1200220),20,56 + this.lineHeight() * 3,200);
    }


    drawInfo(){
        if (this._data){
            const magicId = this._data;
            const skill = $dataSkills[magicId];
            const marginY = 36;
            
            let battler = $gameActors.actor(6);

            this.drawSkillIcon(skill.iconIndex,24, marginY + 2);
            this.drawText(TextManager.getSkillName(skill.id), 60, marginY,240);
            if (skill.maxLevel){
                //this.drawText(skill.maxLevel,382,marginY,80);
                let skillData = new Game_SlotSkill(
                    skill.id,
                    {
                        mpCost:battler.skillMpCost(skill),
                        level:battler.skillLevel(skill.id),
                        lessLevel:battler.skillLevelWithoutSP(skill.id),
                        expRate:battler.getSkillExpPercent(skill.id),
                        expRateTotal:battler.getSkillExpPercentTotal(skill.id),
                        //enable:(actor && actor.canUse(skill) && skill.id > $gameDefine.defaultSlotId),
                        //elementId:[skill.damage.elementId,battler._selfElement,battler.slotElement(index)],
                        //helpData:new Game_SkillHelp(battler,skillId)
                    })
                this.drawSkillExp(skillData,334,marginY - 2,72);
                this.drawSkillLevel(skillData,skill.maxLevel,344, marginY - 2, this.width);
            
            }
            
            this.drawText(skill.mpCost, 56, marginY, this.width - 120,'right');

            if (skill.damage.elementId >= 1 && skill.damage.elementId <= 5){
                battler = $gameActors.actor(skill.damage.elementId);
            }
            const helpData = new Game_SkillHelp(battler,skill.id);
            this._skillhelpWindow.setData(helpData);

            this.contents.fontSize = 21;
            if (skill.features){
                skill.features.forEach((f,index) => {
                    let featureText = TextManager.getText(10200) + "." + f.lv;
                    if (skill.maxLevel != f.lv){
                        featureText += " ～";
                    }
                    this.drawText(featureText, 32, marginY + 16 + this.lineHeight() * (4+index), this.width);
                    this.drawText(TextManager.getText(f.text), 144, marginY + 16 + this.lineHeight() * (4+index), this.width);
                });
            }
            const awake = _.find(battler.currentClass().learnings,(learn) => (learn.awake.type == 4 || learn.awake.type == 9) && learn.awake.skill && _.find(learn.awake.skill,(s) => s.id == skill.id) );
            if (awake){
                const learn = _.find(awake,a => _.find(a.skill,(askill) => askill.id == skill.id));
                if (learn){
                    const awakeSkill = _.find(learn.skill,lskill => lskill.id == skill.id);
                    const index = skill.features ? skill.features.length : 0;
                    if (awakeSkill){
                        this.drawText(TextManager.getText(10200) + "." + awakeSkill.lv, 32, marginY + 16 + this.lineHeight() * (4+index), this.width);
                    }
                    const openFlag = _.contains( $gameParty._learnedSkills, learn.skillId);
                    let learnSkillText = TextManager.getSkillName(learn.skillId);
                    if (!openFlag){
                        learnSkillText = "";
                        for (let i = 0;i < TextManager.getSkillName(learn.skillId).length;i++){
                            learnSkillText += $dataOption.getUserData('language') == LanguageType.English ? "?" : "？";
                        }
                    }
                    this.drawText(learnSkillText + TextManager.getText(1200230), 144, marginY + 16 + this.lineHeight() * (4+index), this.width);    
                }
            }
        }
    }
}