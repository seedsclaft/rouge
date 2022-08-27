//-----------------------------------------------------------------------------
// Sprite_Crystal
//

class Sprite_Crystal extends Sprite {
    constructor(){
        super();
    }

    setup(fileName,x,y){
        this.bitmap = ImageManager.loadSvActor(fileName);
        this.setFrame(0,0,96,96);
        this.alpha = 0;
        this.scale.x = this.scale.y = 2.5;
        this.x = x;
        this.y = y;
        let i = 0;
        gsap.to(this,0.25,{delay:1.5,alpha:1});
        var self = this;
        gsap.to(this,0.4,{repeat:-1,onRepeat:function(){
            i = (i > 11) ? 0 : i + 1;
            self.setFrame(i * 96,0,96,96);
        }});
    }

    endCrystal(endCall){
        let self = this;
        gsap.to(this,0.5,{alpha:0, onComplete:function(){
            self.terminate();
            if (endCall){
                endCall();
            }
        }});
    }

    moveCrystal(duration,x,y){
        gsap.to(this,duration,{x:x,y:y});
    }

    terminate(){
        gsap.killTweensOf(this);
        if (this.parent){
            this.parent.removeChild(this);
        }
        this.destroy();
    }
}