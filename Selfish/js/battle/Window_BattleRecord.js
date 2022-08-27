//-----------------------------------------------------------------------------
// Window_BattleRecord
//

class Window_BattleRecord extends Window_Base{
    constructor(x,y){
        super(x,y);
    }

    initialize(x,y){
        const width = this.windowWidth();
        const height = this.windowHeight();
        super.initialize(new Rectangle( x, y, width, height ));
        Window_Base.prototype.initialize.call(this, new Rectangle( x, y, width, height ));
        this.opacity = 0;
        this._lines = [];
        this._recordCollapse = [];
    }

    windowWidth(){
        return 0;
    }

    windowHeight(){
        return 0;
    }

    clear(){
        this._lines.forEach(line => {
            gsap.killTweensOf(line);
            gsap.to(line,0.25,{opacity:0,onComplete:function(){
                if (line.parent){
                    line.parent.removeChild(line);
                }
                if (line){
                    line.destroy();
                }
            }})
        });
        this._lines = [];
        this._recordCollapse = [];
    }

    addText(text,isdim){
        if (isdim === undefined){
            isdim = true;
        }
        const color = this.backColor();
        let line = new Sprite();
        line.bitmap = new Bitmap(540,40);
        line.bitmap.fontSize = 21;
        if (isdim){
            line.bitmap.gradientFillRect(0, 0,540, 30, color ,ColorManager.dimColor2());
        }
        line.bitmap.drawText(text,24,2,540,26,'left');
        line.scale.x = line.scale.y = 0.75;
        line.opacity = 0;
        line.x = 40;
        line.y = this._lines.length * 26;
        this.addChild(line);
        this._lines.push(line);
        const tl = new TimelineMax();
        tl.to(line, 0.25, {
            opacity:255,x:-12
        }).to(line, 2, {
            opacity:255
        }).to(line, 0.25, {
            opacity:255,x:-12
        });
    }

    addDamageText(battler,type, damage){
        let text = "";
        if (type == "hpHeal"){
            text = TextManager.getText(610100).format(battler.name(),TextManager.getText(500), Math.abs(damage));
        }
        if (type == "hpDamage" || type == "hpDamageWeak"){
            text = TextManager.getText(610200).format(battler.name(),damage);
        }
        if (type == "mpHeal"){
            text = TextManager.getText(610100).format(battler.name(),TextManager.getText(510), Math.abs(damage));
        }
        if (type == "missed"){
            // damageは$dataSkills
            text = TextManager.getText(610400).format(battler.name(),TextManager.getSkillName(damage.id));
        }
        if (type == "invisible"){
            // damageは$dataSkills
            text = TextManager.getText(610300).format(battler.name(),TextManager.getSkillName(damage.id));
        }
        if (type == "damageBlock"){
            // damageは$dataSkills
            text = TextManager.getText(610300).format(battler.name(),TextManager.getSkillName(damage.id));
        }
        if (type == "vantageBlock"){
            // damageは$dataSkills
            text = TextManager.getText(610300).format(battler.name(),TextManager.getSkillName(damage.id));
        }
        if (text != ""){
            this.addText(text);  
        }
    }

    addStateText(target,type,value){
        if (type == PopupTextType.AddState){
            var text = TextManager.getText(610500).format(target.name(), value);
            this.addText(text);
        }
        if (type == PopupTextType.RemoveState){
            var text = TextManager.getText(610600).format(target.name(), value);
            this.addText(text);
        }
        if (type == PopupTextType.ResistState){
            var text = TextManager.getText(610300).format(target.name(), value);
            this.addText(text);
        }
        if (type == PopupTextType.Grow){
            var text = TextManager.getText(610700).format(target.name(), value);
            this.addText(text);
        }
        if (type == PopupTextType.Summon){
            this.addText(value);
        }
        if (type == PopupTextType.Charge){
            var text = TextManager.getText(610500).format(target.name(), TextManager.getStateName($gameStateInfo.getStateId(StateType.CHARGE)));
            this.addText(text);
        }
    }

    recordCollapse(battler){
        if (_.contains(this._recordCollapse,(battler))){
            return;
        }
        this._recordCollapse.push(battler);
        const text = TextManager.getText(610800).format(battler.name());
        this.addText(text);
    }

    backColor(){
        return '#000000';
    }

    terminate(){
        this._lines.forEach(line => {
            gsap.killTweensOf(line);
            if (line.parent){
                line.parent.removeChild(line);
            }
            if (line){
                line.destroy();
            }
        });
        this.destroy();
    }
}