//-----------------------------------------------------------------------------
// Sprite_PopupText
//

class Sprite_PopupText extends Sprite{
    constructor(){
        super();
        this._animation = new TimelineMax();
    }

    setup(type,value,delay){
        const text       = this.convertText(type,value);
        let sprite = new Sprite();
        this.setBaseData(sprite);
        let bitmap      = new Bitmap(240, 40);
        bitmap.fontSize = 20;
        bitmap.textColor = '#ffffff';
        bitmap.drawText(text, 0, 0, bitmap.width, bitmap.height, 'center',true);
    
        sprite.bitmap  = bitmap;
        sprite.y -= 24;
        sprite.opacity = 0;
        if (type == PopupTextType.RemoveState){
            sprite.y -= 24;
            this.setPopupAnim(sprite,delay);
        } else{
            this.setPopupUpAnim(sprite,delay);
        }
    }

    convertText(type,value){
        switch (type){
            case PopupTextType.AddState:
            case PopupTextType.Grow:
                return "+" + value;
            case PopupTextType.RemoveState:
                return "-" + value;
            case PopupTextType.Text:
            case PopupTextType.UpText:
            case PopupTextType.Charge:
                return value;
        }
        return value;
    }

    setPopupAnim(sprite,delay){
        this._animation.to(sprite, 0, {
            opacity : 255,
            delay : delay,
        }).to(sprite, 0.5, {
            y : sprite.y + 24,
            ease: Power2.easeOut,
        })
        .to(sprite, 1, {
            y : sprite.y + 48,
            ease: Power2.easeOut,
            alpha : 0,
            onComplete: () => {this.terminate(sprite)}
        });
    }

    setPopupUpAnim(sprite,delay){
        this._animation.to(sprite, 0, {
            opacity : 255,
            delay : delay,
        }).to(sprite, 0.5, {
            y : sprite.y - 24,
            ease: Power2.easeOut,
        })
        .to(sprite, 1, {
            y : sprite.y - 48,
            ease: Power2.easeOut,
            alpha : 0,
            onComplete: () => {this.terminate(sprite)}
        });
    }

    setBaseData(sprite){
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;	
        sprite.zt = 0;
        sprite.ry = sprite.y;
        sprite.yf = 0;
        sprite.yf2 = 0;
        sprite.yf3 = 0;
        sprite.ex = false;
        this.addChild(sprite);
    }

    terminate(sprite){
        if (this._animation){
            this._animation.kill();
        }
        this._animation = null;
        if (sprite){
            gsap.killTweensOf(sprite);
            sprite.destroy(true);
        }
    }
}

const PopupTextType ={
    AddState : 0,
    RemoveState : 1,
    Text : 2,
    UpText : 3,
    ResistState : 4,
    Damage : 5,
    Grow : 6,
    Summon : 7,
    Charge : 8
}

class PopupTextData  {
    constructor (battler,type,value,animationId) {
         this.battler = battler;
         this.type = type;
         this.value = value;
         this.animationId = animationId;
    }
}