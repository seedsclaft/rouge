//-----------------------------------------------------------------------------
// Sprite_FaceSquare
//

class Sprite_FaceSquare extends Sprite{
    constructor(){
        super();
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.bitmap = ImageManager.loadSystem('messagePoint');
        this._animation = null;
        this.opacity = 0;
    }

    setPosition(x,y){
        this.x = x;
        this.y = y + 24;
    }

    zoomIn(plusScale){
        if (plusScale === undefined){
            plusScale = 1;
        }
        this.opacity = 72;
        this.scale.x = 1.5 * plusScale;
        this.scale.y = 1.5 * plusScale;
        this._animation = new TimelineMax();
        this._animation.to(this.scale, 0.1, {
            y:1 * plusScale,
            x:1 * plusScale,
        }).to(this, 0.4, {
            opacity : 32,
            repeat : 2,
            yoyo : true
        }).to(this,0.5,{
            opacity : 0,
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