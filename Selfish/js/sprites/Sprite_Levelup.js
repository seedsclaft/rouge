//-----------------------------------------------------------------------------
// Sprite_Levelup
//

class Sprite_Levelup extends Sprite{
    constructor(){
        super();
    }

    setup(levelUpType){
        const text = this.levelupText(levelUpType);
        this.createText(text,32);
        
        return new Promise(resolve => {
            this.start(0.5,() => {
                resolve();
            } );
        }); 
    }

    setupNewRecord(levelUpType,recordData){
        let text = this.levelupText(levelUpType);
        if (recordData.old){
            text += "  " + recordData.old + TextManager.getText(900500) + TextManager.getText(900501);
        }
        if (recordData.new){
            text += "  " + recordData.new + TextManager.getText(900500);
        }
        this.createText(text,21);
        
        return new Promise(resolve => {
            this.start(2.0,() => {
                resolve();
            } );
        }); 
    }

    createText(text,fontSize){
        this.y = 270;

        this._backBlack = new Sprite();
        this._backBlack.bitmap = new Bitmap(960,64);
        this._backBlack.anchor.y = 0.5;
        this._backBlack.bitmap.fillAll('rgba(0, 0, 0, 0.5)');
        //this._backBlack.alpha = 0.5;
        this.addChild(this._backBlack);
    
        /*
        this._frontWhite = new Sprite();
        this._frontWhite.anchor.y = 0.5;
        this._frontWhite.y = -32;
        this._frontWhite.bitmap = ImageManager.loadSystem('Window');
        this._frontWhite.setFrame(128,0,40,8);
        this._frontWhite.scale.x = 24;
        this.addChild(this._frontWhite);
        */
    
        /*
        this._backWhite = new Sprite();
        this._backWhite.anchor.y = 0.5;
        this._backWhite.y = 32;
        this._backWhite.bitmap = ImageManager.loadSystem('Window');
        this._backWhite.setFrame(128,0,40,8);
        this._backWhite.scale.x = 24;
        this.addChild(this._backWhite);
        */
    
        this._textSprite = new Sprite();
        this._textSprite.anchor.y = 0.5;
        this._textSprite.bitmap = new Bitmap(960,64);
        this._textSprite.bitmap.fontSize = fontSize;
        this._textSprite.bitmap.drawText(text,0,0,960,64,'center');
        this.addChild(this._textSprite);

    }

    levelupText(levelUpType){
        switch (levelUpType){
            case LevelUpType.Level:
                return TextManager.getText(601200);
            case LevelUpType.SkillAwake:
                return TextManager.getText(601210);
            case LevelUpType.Both:
                return TextManager.getText(601220);
            case LevelUpType.Victory:
                return TextManager.getText(601230);
            case LevelUpType.Lose:
                return TextManager.getText(601240);
            case LevelUpType.NewRecord:
                return TextManager.getText(901000);
        }
    }

    start(delay,endCall){
        let anim = new TimelineMax();
        anim.to(this._textSprite, 0.5, {
            x:0,
            opacity:255,
        }).to(this._textSprite, 0.3, {
        })
        this._backBlack.alpha = 0;
        gsap.to(this._backBlack,0.5,{alpha:1});
        
        /*
        this._frontWhite.x = 960;
        gsap.to(this._frontWhite,duration,{x:0});
    
        this._backWhite.x = -960;
        gsap.to(this._backWhite,duration,{x:0});
        */
    
        this._textSprite.width = 0;
        let self = this;
        gsap.to(this._textSprite,0.5,{width:960});
        gsap.to(this._textSprite,delay,{onComplete:function(){
            self.hideAnimation(endCall);
        }});
    }

    hideAnimation(endCall){
        const duration = 0.4;
        const wait = 0.8;
        gsap.to(this._backBlack,duration,{alpha:0,height:0,delay:wait});
        //gsap.to(this._frontWhite,duration,{x:0,y:0,alpha:0,delay:wait});
        //gsap.to(this._backWhite,duration,{x:0,y:0,alpha:0,delay:wait});
        let self = this;
        gsap.to(this._textSprite,duration,{alpha:0,delay:wait,onComplete:function(){
            self.terminate();
            if (endCall) endCall();
        }});
    }

    terminate(){
        gsap.killTweensOf(this);
        if (this.parent) {this.parent.removeChild(this)};
        this.destroy();
    }
}

const LevelUpType = {
    Level:1,
    SkillAwake:2,
    Both:11,
    Victory: 101,
    Lose: 102,
    NewRecord: 201
}