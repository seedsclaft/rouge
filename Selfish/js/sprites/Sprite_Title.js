//-----------------------------------------------------------------------------
// Sprite_Title
//

class Sprite_Title extends Sprite{
    constructor(){
        super();
        this.anchor.x = this.anchor.y = 0.5;
        this._textArray = [];
        this._textSprite = [];
        this._textSprite2 = [];
        this._bgSprite = null;
    }

    setup(text,x,y){
        if (x === undefined){
            x = 240;
        }
        if (y === undefined){
            y = 264;
        }
        this.x = x;
        this.y = y;
        let sprite = new Sprite();
        let bitmap = new Bitmap(640,52);
        const baseWidth = 640;
        const margin = 120;
        bitmap.gradientFillRect(0,0,margin,120,'black','white',false);
        bitmap.fillRect(margin,0,baseWidth - margin*2,120,'white');
        bitmap.gradientFillRect(baseWidth - margin,0,margin,120,'white','black',false);
        sprite.bitmap = bitmap;
        sprite.anchor.x = 0;
        sprite.anchor.y = 0.5;
        sprite.x = -96;
        this._bgSprite = sprite;
        this.addChild(sprite);
        
        this._textArray = text.split("");
        this._textArray.forEach(char => {
            let sprite = new Sprite();
            let bitmap = new Bitmap(48,48);
            bitmap.fontSize = 32;
            bitmap.drawText(char,24,0,48,48)
            sprite.anchor.x = 0;
            sprite.anchor.y = 0.5;
            sprite.alpha = 1;
            sprite.bitmap = bitmap;
            this.addChild(sprite);
            this._textSprite.push(sprite);
        });
        this._textArray.forEach(char => {
            let sprite = new Sprite();
            let bitmap = new Bitmap(96,48);
            bitmap.fontSize = 32;
            bitmap.drawText(char,24,0,96,48,null,true,true);
            sprite.anchor.x = 0;
            sprite.anchor.y = 0.5;
            sprite.alpha = 0;
            sprite.bitmap = bitmap;
            this.addChild(sprite);
            this._textSprite2.push(sprite);
        });

    }

    start(endCall){
        let offsetX = 0;
        const length = this._textArray.length;
        if (17 > length){
            offsetX = (17-length) * 12;
        }
        let idx = 0;
        this._textSprite.forEach(sprite => {
            sprite.width = 24;
            sprite.x = offsetX;
            gsap.to(sprite,1,{width: 48});
            gsap.to(sprite,2,{x:sprite.x + idx * 24,alpha:1});
            gsap.to(sprite,0.5,{alpha:0 , delay : 1.9});
            idx += 1;
        });
        idx = 0;
        this._textSprite2.forEach(sprite => {
            sprite.x = offsetX;
            gsap.to(sprite,2,{x:sprite.x + idx * 24});
            gsap.to(sprite,0.5,{alpha:1 , delay : 2});
            //gsap.to(sprite.scale,1,{x:1.1 , y:1.1});
            idx += 1;
        });
        this._bgSprite.scale.x = 0;
        this._bgSprite.opacity = 0;
        gsap.to(this._bgSprite.scale,2,{x:1});
        gsap.to(this._bgSprite,2,{opacity:128});
        gsap.to(this._bgSprite,0.5,{opacity:224,delay:2});
        
        if (endCall){
            gsap.to(this,6,{onComplete:function(){
                endCall();
            }});
        }
    }

    reset(){
        this._textSprite.forEach(sprite => {
            gsap.to(sprite,0.25,{alpha:0,onComplete:function(){
                sprite.destroy();
            }});
        });
        this._textSprite2.forEach(sprite => {
            gsap.to(sprite,0.25,{alpha:0,onComplete:function(){
                sprite.destroy();
            }});
        });
        var self = this;
        gsap.to(this._bgSprite,0.25,{alpha:0,onComplete:function(){
            self._bgSprite.destroy();
            self._bgSprite = null;
        }})
        this._textSprite = [];
        this._textSprite2 = [];
    }
}