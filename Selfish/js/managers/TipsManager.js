class TipsManager {
    constructor(){
    }

    static setTips(selectTips){
        let tips = $gameTips.findTips();
        if (selectTips != null){
            tips = selectTips;
        }
        if (!tips){
            return;
        }
        if ($gameParty.checkReadTips(tips.id) && tips.id < 999){
            return;
        }
        this.open(tips);
        $gameParty.gainReadTips(tips.id);
        SceneManager._scene.addChild(this._tips);
    }

    static open(tips){
        if (!this._tips){
            this._tips = new Window_Base(new Rectangle( 540,40,540,400 ));
            this._tips.y = 0;
            this._tips.scale.x = 0.75;
            this._tips.scale.y = 0.75;
            this._tips.opacity = 0;
            this._tips.lineHeight = function() {
                return 32;
            };
        }
        let textData = $gameTips.getTipsText(tips.id);
        let helpTextData = $gameTips.getTipsHelpText(tips.id);
        let text = "\\{" + TextManager.getText(360) + textData + "\n" + "\\}" + helpTextData;
        this._tips.contents.clear();
        let lines = helpTextData.split("\n");
        let linesNum = lines.length;
        lines.forEach(lineText => {
            if (lineText == ""){
                linesNum -= 1;
            }
        });
        let height = 48 + linesNum * 32;
        this._tips.contents.fillRect(0,0,480,height,"rgba(0, 0, 0, 0.5)");
        this._tips.drawTextEx(text,8,4);
        this._tips.alpha = 0;
        this._tips.x = 760;
        let posY = 40;
        this._tips.y = posY;
        gsap.to(this._tips,0.25,{alpha:1,x:640});
        gsap.to(this._tips,0.25,{alpha:0,x:680,delay:5});
    }

    static close(){
        if (this._tips){
            let self = this;
            gsap.to(this._tips,0.25,{alpha:0,x:680,onComplete:function(){
                self.remove();
            }});
        }
    }

    static setWait(num){
        return new Promise(resolve => {
            const delayTime = num
            setTimeout(() => {
              return resolve()
            }, delayTime)
        })
    }
    
    static remove(){
        if (this._tips){
            Debug.log("tips remove")
            gsap.killTweensOf(this._tips);
            this._tips.destroy();
            if (this._tips.parent){
                this._tips.parent.removeChild(this._tips);
            }
            gsap.killTweensOf(this);
        }
        this._tips = null;
    }
}