//-----------------------------------------------------------------------------
// Window_StatusSkill
//

class Window_StatusSkill extends Window_SkillBase{
    constructor(x,y,width,height){
        super(x,y,width,height);
        this._flagList = [];
        this.createBack(width - 112);
        this.createList(128,32,width - 156,264);
        this.deactivate();
    }

    createBack(width){
        this._backSprite = new Sprite(new Bitmap(width, Graphics.boxHeight));
        this._backSprite.bitmap.fillRect(0, 0, width, 384,'black');
        this._backSprite.alpha = 0.4;
        this._backSprite.anchor.y = 0.5;
        this._backSprite.y = 274;
        this.addChildAt(this._backSprite,1);
    }

    createList(x, y, width, height) {
        this._skillList = new Window_ScrollSkillBase(x,y,width,height);
        this._skillList.setSkillHelpWindow(-180,244,600,124);
        this._skillList.setCostWidth(72);
        this.addChild(this._skillList);
    }

    drawLine(){
        const x = -4;
        const y = 0;
        const width = 160;
        
        this.drawBackSkewX(x + 76,32,128,236,0x000000,80,-0.27); 
        
        this.drawLineText(TextManager.getText(10400),x + this._offsetX + 12,y, width);
        this.drawLineText(TextManager.getText(10500),x + this._offsetX + 148, y, width);
                
        this.drawLineText(TextManager.getText(10300),x + this._offsetX + 452, y, width);
        
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA,x + 76 ,36,80,'left');
        this.resetFontSettings();
        if (_.find(this._flagList,(f) => f == "lv")){
            this.changeTextColor(this.powerUpColor());
        }
        if (this._actor){
            if (this._actor.level >= this._actor.maxLevel()){
                this.drawText(TextManager.getText(1200210),x + 92 ,36,80,'right');
            } else{
                this.drawText(this._actor.level,x + 92 ,36,80,'right');
            }
        }
        this.drawParameters(x + 28, 68);
        this.drawExp(x + 16, 200);
            
        this.resetFontSettings();
    }

    setParameterFlag(list){
        this._flagList = list;
    }

    drawParameters(x, y){
        if (this._actor == null){
            return;
        }
        const lineHeight = this.lineHeight() - 8;
        [0,2,6,3].forEach((paramId ,index) => {
            var y2 = y +(lineHeight) * index;
            var x2 = x - (8) * index;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(paramId), x + x2 + 16, y2, 160);
            this.resetTextColor();
            if (this._actor.param(paramId) < this._actor.paramBase(paramId)){
                this.changeTextColor(this.powerDownColor());
            }
            if (this._actor.param(paramId) > this._actor.paramBase(paramId)){
                this.changeTextColor(this.powerUpColor());
            }
            if (paramId == 0){
                if (_.find(this._flagList,(f) => f == "hp")){
                    this.changeTextColor(this.powerUpColor());
                }
            }
            if (paramId == 1){
                if (_.find(this._flagList,(f) => f == "mp")){
                    this.changeTextColor(this.powerUpColor());
                }
            }
            if (paramId == 2){
                if (_.find(this._flagList,(f) => f == "atk")){
                    this.changeTextColor(this.powerUpColor());
                }
                if (this._actor.param(paramId) + this._actor.getStateEffectTotal($gameStateInfo.getStateId(StateType.ETHER)) > this._actor.paramBase(paramId)){
                    this.changeTextColor(this.powerUpColor());
                }
            }
            if (paramId == 3){
                if (_.find(this._flagList,(f) => f == "def")){
                    this.changeTextColor(this.powerUpColor());
                }
            }
            if (paramId == 6){
                if (_.find(this._flagList,(f) => f == "spd")){
                    this.changeTextColor(this.powerUpColor());
                }
            }
            this.drawText(this._actor.param(paramId), x + 52 + x2, y2, 60, 'right');
        });
    }

    drawExp(x,y){
        if (this._actor == null){
            return;
        }
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.getText(400), x + 16, y , 160);
        this.resetTextColor();
        
        this.contents.fontSize = 24;
        if (this._actor.level >= this._actor.maxLevel()){
            this.drawText(this._actor.expForLevel(2), x - 40, y + 29, 96,'right');
        } else{
            this.drawText(this._actor.expForLevel(2) + this._actor.currentExp() - this._actor.nextLevelExp(), x - 40, y + 29, 96,'right');
        }
        
        this.contents.fontSize = 16;
        this.drawText("/", x + 16 - 40, y + 28, 96,'right');
        
        this.contents.fontSize = 21;
        this.drawText(this._actor.expForLevel(2), x + 48 - 32, y + 30, 96,'right');
    }

    selectSkill(skillId){
        const skillIndex = _.findIndex(this._skillList._data,(d) => d.skillId == skillId);
        if (skillIndex){
            this._skillList.refresh();
            this._skillList.forceSelect(skillIndex);
            this._skillList.updateHelp();
        }
    }

    selectLast(){
        this._skillList.refresh();
        this._skillList.forceSelect(0);
        this._skillList.updateHelp();
    }

    setNoRemoveNewSkillId(){
        this._skillList.setNoRemoveNewSkillId();
    }
}