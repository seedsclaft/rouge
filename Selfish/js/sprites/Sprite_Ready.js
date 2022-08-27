//-----------------------------------------------------------------------------
// Sprite_Ready
//

class Sprite_Ready extends Sprite{
    constructor(){
        super();
        this._sprites = [];
    }

    setup(okAction){
        this.createBack();
        this.createLine();
        this.createBackReady();
        const self = this;
        gsap.to(this, 0, {delay:2.2,onComplete:function(){
            FilterMzUtility.addFilter(FilterType.BlurFade);
        }.bind(this)});
        gsap.to(this, 0, {delay:4,onComplete:function(){
            if (okAction){
                okAction();
            }
            FilterMzUtility.removeFilter(FilterType.BlurFade);
            self.terminate();
        }.bind(this)});
    }

    createLine(){
        this._frontWhite = new Sprite();
        this._frontWhite.anchor.y = 0.5;
        this._frontWhite.y = -32 + 270;
        this._frontWhite.bitmap = ImageManager.loadSystem('Window');
        this._frontWhite.setFrame(128,0,40,8);
        this._frontWhite.scale.x = 24;
        //this.addChild(this._frontWhite);

        this._frontWhite.x = 960;
        const duration = 0.25;
        gsap.to(this._frontWhite,duration,{x:0 ,delay:0.8});

        
        this._backWhite = new Sprite();
        this._backWhite.anchor.y = 0.5;
        this._backWhite.y = 32 + 270;
        this._backWhite.bitmap = ImageManager.loadSystem('Window');
        this._backWhite.setFrame(128,0,40,8);
        this._backWhite.scale.x = 24;
        //this.addChild(this._backWhite);
        this._backWhite.x = -960;
        gsap.to(this._backWhite,duration,{x:0,delay:0.8});
    }

    createBack(){
        this._backBlack = new Sprite();
        this._backBlack.bitmap = new Bitmap(960,64);
        this._backBlack.anchor.y = 0.5;
        this._backBlack.y = 270;
        this._backBlack.bitmap.fillAll('rgba(0, 0, 0, 0.5)');
        this.addChild(this._backBlack);
        this._backBlack.alpha = 0;
        gsap.to(this._backBlack,0.5,{alpha:1, delay:0.8});
    }

    createBackReady(){
        this._textSprite = new Sprite();
        this._textSprite.y = 270;
        this._textSprite.anchor.y = 0.5;
        let bitmap = new Bitmap(960,64);
        bitmap.fontSize = 32;
        bitmap.drawText(TextManager.getText(400500),0,0,960,64,"center");
        this._textSprite.bitmap = bitmap;
        this.addChild(this._textSprite);
        this._sprites.push(this._textSprite);

        
        this._textSprite.width = 0;
        let self = this;
        gsap.to(this._textSprite,0.5,{width:965,delay:0.8,onComplete:function(){
            self.hideAnimation();
        }});
    }

    hideAnimation(){
        const duration = 0.4;
        const wait = 1.0;
        gsap.to(this._backBlack,duration,{alpha:0,height:0,delay:wait});
        gsap.to(this._frontWhite,duration,{x:0,y:270,alpha:0,delay:wait});
        gsap.to(this._backWhite,duration,{x:0,y:270,alpha:0,delay:wait});
        let self = this;
        gsap.to(this._textSprite,duration,{alpha:0,delay:wait,onComplete:function(){
            //self.terminate();
        }});
    }

    terminate(){
        for (let i = this._sprites.length-1;i >= 0;i--){
            gsap.killTweensOf(this._sprites[i]);
            this._sprites[i].destroy();
        }
        gsap.killTweensOf(this);
        if (this.parent){
            this.parent.removeChild(this);
        }
        this.destroy();
    }
}