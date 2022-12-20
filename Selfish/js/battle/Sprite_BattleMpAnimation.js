//-----------------------------------------------------------------------------
// Sprite_BattleMpAnimation
//

class Sprite_BattleMpAnimation extends Sprite{
    constructor(battler,posX,posY,mpNumber,cb){
        super(battler,posX,posY,mpNumber,cb);
    }

    initialize(battler,posX,posY,mpNumber,cb){
        super.initialize();
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.bitmap = ImageManager.loadSystem("IconSet");
        
        let index = battler.selfElement();
        this.setFrame(index * Window_Base._iconWidth + 160,324,Window_Base._iconWidth,Window_Base._iconHeight - 8)
        
        battler.startAnimation(1664,false,0,0.75);
        const offsetX = 46;
        const initY = posY + 43;
        const targetY = 40;
        // 最大MPが5以上の時座標を修正
        if (battler.mmp >= 5){
            if (battler.mp < 5){
                mpNumber = 1;
            }else{
                mpNumber -= 4;
            }
        }
        // instantiate TimelineMax
        this._timeline = new TimelineMax();
        this._timeline.set(this, { 
            x : posX,
            y : initY,
            alpha : 1
        })
        .to(this, 1.0, {
            y : posY - targetY,
            alpha : 0.5,
            ease: Power2.easeOut,
        })
        .to(this, 0.5, {
            x : posX + (mpNumber-1) * 23 + offsetX,
            y : initY,
            alpha : 0.5,
            //ease: Power2.easeOut,
            onComplete : cb,
            ease: Power1.easeOut,
        })
        .to(this, 0.25, {
            alpha : 0,
            onComplete: () => {this.terminate()}
        });
        gsap.to(this.scale,0.25,{x:-1,repeat:2,yoyo:true});
    }

    terminate(){
        if (this._timeline){
            this._timeline.kill();
        }
        this._timeline = null;
        gsap.killTweensOf(this);
        gsap.killTweensOf(this.scale);
        //this.destroy();
    }
}