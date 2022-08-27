//-----------------------------------------------------------------------------
// Sprite_MapName
//
// The sprite for displaying a popup damage.

class Sprite_MapName extends Sprite{
    constructor(){
        super();
        this.y = 270;
    
        this._backBlack = new Sprite();
        this._backBlack.bitmap = new Bitmap(960,64);
        this._backBlack.anchor.y = 0.5;
        this._backBlack.bitmap.fillAll('rgba(0, 0, 0, 0.5)');
        //this._backBlack.alpha = 0.5;
        this.addChild(this._backBlack);
    
        this._frontWhite = new Sprite();
        this._frontWhite.anchor.y = 0.5;
        this._frontWhite.y = -32;
        this._frontWhite.bitmap = ImageManager.loadSystem('Window');
        this._frontWhite.setFrame(128,0,40,8);
        this._frontWhite.scale.x = 24;
        this.addChild(this._frontWhite);
    
        this._backWhite = new Sprite();
        this._backWhite.anchor.y = 0.5;
        this._backWhite.y = 32;
        this._backWhite.bitmap = ImageManager.loadSystem('Window');
        this._backWhite.setFrame(128,0,40,8);
        this._backWhite.scale.x = 24;
        this.addChild(this._backWhite);
    
        this._textSprite = new Sprite();
        this._textSprite.anchor.y = 0.5;
        this._textSprite.bitmap = new Bitmap(960,64);
        this.addChild(this._textSprite);
    }

    start(text){
        const dispText = TextManager.convertEscapeCharacters(text);
        this._textSprite.bitmap.clear();
        this._textSprite.bitmap.drawText(dispText,0,0,960,64,'center');
        this.showAnimation();
    }

    showAnimation(){
        const duration = 0.5;
        this._backBlack.alpha = 0;
        gsap.to(this._backBlack,duration,{alpha:1});
        
        this._frontWhite.x = 960;
        gsap.to(this._frontWhite,duration,{x:0});
    
        this._backWhite.x = -960;
        gsap.to(this._backWhite,duration,{x:0});
    
        this._textSprite.width = 0;
        let self = this;
        gsap.to(this._textSprite,duration,{width:960,onComplete:function(){
            self.hideAnimation();
        }});
    }

    hideAnimation(){
        const duration = 0.4;
        const wait = 1.2;
        gsap.to(this._backBlack,duration,{alpha:0,height:0,delay:wait});
        gsap.to(this._frontWhite,duration,{x:0,y:0,alpha:0,delay:wait});
        gsap.to(this._backWhite,duration,{x:0,y:0,alpha:0,delay:wait});
        let self = this;
        gsap.to(this._textSprite,duration,{alpha:0,delay:wait,onComplete:function(){
            self.terminate();
        }});
    }

    terminate(){
        gsap.killTweensOf(this);
        this.destroy();
    }
}