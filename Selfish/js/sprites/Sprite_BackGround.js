//-----------------------------------------------------------------------------
// Sprite_BackGround
//

class Sprite_BackGround extends TilingSprite {
    constructor(width,height){
        super();
        this._defalutWidth = width;
        this._defalutHeight = height;
        this._init = false;
        this._anim = [];
    }

    resetPosition(){
        const width = this._bitmap ? this._bitmap.width : this._defalutWidth;
        const height = this._bitmap ? this._bitmap.height : this._defalutHeight;
        const scaleX = this._bitmap ? this._defalutWidth / width : 1.0;
        const scaleY = this._bitmap ? this._defalutHeight / height : 1.0;
        const marginX = this._bitmap ? (this._defalutWidth - width) / 2 : 0;
        const marginY = this._bitmap ? (this._defalutHeight - height) / 2 : 0;
        const x = width / 2 + marginX;
        const y = height / 2 + marginY;
        this.move(x, y, width, height);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.origin.x = 0;
        this.origin.y = 0;
        this.scale.x = scaleX;
        this.scale.y = scaleY;
    }



    fadeIn(duration,opacity){
        this.killAnim();
        this.opacity = opacity;
        let anim = new TimelineMax();
        anim.to(this, duration, {
            opacity : 255
        })
        this._anim.push(anim);
    }

    fadeOut(duration,opacity){
        this.killAnim();
        this.opacity = opacity;
        let anim = new TimelineMax();
        anim.to(this, duration, {
            opacity : 0
        })
        this._anim.push(anim);
    }

    frontBlur(opacity){
        this.killAnim();
        this.opacity = opacity;
        this.scale.x = this.scale.y = 1;
        let anim = new TimelineMax();
        anim.to(this, 0.5, {
            opacity : 0,
            pixi:{scaleX:1.1,scaleY:1.1},
            onComplete:() => {
                this.parent.removeChild(this);
                this.destroy();
            }
        });
        this._anim.push(anim);
    }

    setRotation(duration,r){
        this.killAnim();
        let anim = new TimelineMax();
        anim.to(this, duration, {
            rotation:r,
        });
        this._anim.push(anim);
    }

    zoom(duration,zoomX,zoomY){
        this.killAnim();
        let anim = new TimelineMax();
        anim.to(this, duration, {
            pixi:{scaleX:zoomX,scaleY:zoomY},
        });
        this._anim.push(anim);
    }

    moveDirection(duration,x,y){
        this.killAnim();
        let anim = new TimelineMax();
        anim.to(this, duration, {
            x:this.x+x,
            y:this.y+y,
            ease:Power0.easeNone
        })
        this._anim.push(anim);
    }

    moveUV(duration,x,y,repeat){
        if (repeat === undefined){
            repeat = false;
        }
        this.killAnim();
        //let anim = new TimelineMax();
        const rep = repeat == true ? -1 : 0;
        let anim = gsap.to(this.origin, duration, {
            x:this.origin.x+x,
            y:this.origin.y+y,
            repeat:rep,
            ease:Power0.easeNone
        })
        this._anim.push(anim);
    }

    setSize(width,height) {
        this.move(width / 2, height / 2, width, height);
        this.origin.x = 0;
        this.origin.y = 0;
    }

    seekAnim(){
        this._anim.forEach(anim => {
            anim.seek(anim.endTime());
        });
    }

    killAnim(){
        this._anim.forEach(anim => {
            anim.kill();
        });
        this._anim = [];
    }

    pause(){
        this._anim.forEach(anim => {
            anim.pause();
        });
    }

    resume(){
        this._anim.forEach(anim => {
            anim.resume();
        });
    }


    terminate(){
        this.killAnim();
        this.filters = [];
        this.destroy();
    }

    update(){
        super.update();
        if (this._bitmap && this._bitmap._baseTexture != null && this._init == false){
            this.resetPosition();
            this._init = true;
        }
    }
}