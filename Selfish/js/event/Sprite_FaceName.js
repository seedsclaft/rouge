//-----------------------------------------------------------------------------
// Sprite_FaceName
//

class Sprite_FaceName extends Sprite{
    constructor(){
        super();
        let bitmap = new Bitmap(160,24);
        this.bitmap = bitmap;
        this.scale.x = 0.75;
        this.scale.y = 0.75;
        this._animation = null;
    }

    setPosition(x,y){
        this.x = x;
        this.y = y;
    }

    setName(name){
        this.bitmap.clear();
        this.bitmap.fontSize = 21;
        this.bitmap.drawText(name,0,0,160,24,'center',true);
    }

    zoomIn(){
        this.opacity = 72;
        this._animation = new TimelineMax();
        this._animation.to(this, 0.4, {
            opacity:255,
            delay:0.1
        }).to(this, 0.6, {
            opacity : 0,
            delay:1
        });
    }

    stopMessagePoint(){
        if (this._animation){
            this._animation.kill();
            this.opacity = 0;
        }
    }

    pause(){
        if (this._animation){
            this._animation.pause();
        }
    }

    resume(){
        if (this._animation){
            this._animation.resume();
        }
    }
}