//-----------------------------------------------------------------------------
// Sprite_TimeLine
//

class Sprite_TimeLine extends Sprite{
    constructor(){
        super();
        this.anchor.x = this.anchor.y = 0.5;
        this._yearArray = ["0","1","2","3","4","5","6","7","8","9","10","11","12"];
        this._monthArray = ["Jan","Mar","May","Jul","Sep","Nov"];
        this._yearSprite = [];
        this._monthSprite = [];
    }

    setup(x,y){
        this.x = 540;
        this.y = 200;
        
        this._yearArray.forEach((char,index) => {
            let sprite = new Sprite();
            let bitmap = new Bitmap(120,120);
            bitmap.fontSize = 22;
            bitmap.drawText(char,0,0,48,120);
            sprite.anchor.x = 0.5;
            sprite.alpha = 0;
            sprite.bitmap = bitmap;
            sprite.x = -360 * index - 134;
            sprite.y = 128;
            this.addChild(sprite);
            this._yearSprite.push(sprite);
        });
        this._monthArray = this._monthArray.reverse();
        //for (var i = 0;i < 4 ; i++){
        let sprite = new Sprite_BackGround();
        sprite.anchor.x = 0.5;
        sprite.alpha = 0;
        var bitmap = new Bitmap(1080,120);
        bitmap.fontSize = 16;
        for (var i = 0;i < 3 ; i++){
            this._monthArray.forEach((char,index) => {
                bitmap.drawText(char,1080 - (index * 60 + i * 360) - 60,0,48,120,'center');
            });
        }
        sprite.bitmap = bitmap;
        sprite.setSize(1080,120);
        sprite.x = 0;
        sprite.y = 224;
        this.addChild(sprite);
        this._monthSprite.push(sprite);
        //}
        gsap.to(sprite.origin,8,{x : -1 * x});
        gsap.to(sprite,2,{alpha : 1});
        this._yearSprite.forEach(element => {
            gsap.to(element,8,{x : x + element.x});
            gsap.to(element,2,{alpha : 1});
        });
    }

    endTimeLine(){
        const self = this;
        gsap.to(this,1,{alpha:0, onComplete:function(){
            self.terminate();
        }});
    }

    terminate(){
        gsap.killTweensOf(this);
        this._yearSprite.forEach(element => {
            gsap.killTweensOf(element);
        });
        this._monthSprite.forEach(element => {
            gsap.killTweensOf(element);
        });
        if (this.parent){
            this.parent.removeChild(this);
        }
        this._yearArray = null;
        this._monthArray = null;
        this._yearSprite = null;
        this._monthSprite = null;
        if (this.parent){
            this.parent.removeChild(this);
        }
        this.destroy();
    }
}