//-----------------------------------------------------------------------------
// Sprite_EyeCatch
//

class Sprite_EyeCatch extends Sprite{
    constructor(){
        super();
        this._squareSprites = [];
        this._titleSprites = [];
        this._title = ["R","e",":","K","u","r","o","i"];
        for (let i = 0;i < 8;i++){
            this.createTitle(i);
        }
        this.createSquare(0);
    }

    createSquare(){
        let sprite = new Sprite();
        sprite.x = 548;
        sprite.y = 444;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.opacity = 0;
        let bitmap = new Bitmap(40,40);
        sprite.bitmap = bitmap;
        sprite.bitmap.fillAll('white');
        this.addChild(sprite);
        this._squareSprites.push(sprite);
    }

    createTitle(idx){
        let sprite = new Sprite();
        sprite.x = 8 * idx + 560;
        sprite.y = 440;
        sprite.opacity = 0;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        let bitmap = new Bitmap(40,40);
        sprite.bitmap = bitmap;
        sprite.bitmap.drawText(this._title[idx],0,0,40,40);
        this.addChild(sprite);
        this._titleSprites.push(sprite);
    }

    start(){
        gsap.to(this._squareSprites[0],0.5,{opacity:255});
        gsap.to(this._squareSprites[0],0.8,{x:580 + 20,rotation:Math.PI * 1});
        gsap.to(this._squareSprites[0],0.8,{y:456});
        gsap.to(this._squareSprites[0],0.4,{pixi:{scaleY:0.05},delay:0.35});
        gsap.to(this._squareSprites[0],2.0,{pixi:{scaleX:4.3},x:632 + 8 + 64,delay:1.0,opacity:255});
    
        gsap.to(this._squareSprites[0],1.0,{pixi:{scaleX:0},delay:3.0,opacity:0});
    
    
        this._titleSprites.forEach((title,index)=> {
            
            if (index == 0 || index == 1 || index == 2){
                gsap.to(title,0.5,{opacity:255,delay:0.1});
            } else
            if (index == 3 || index == 4){
                title.opacity = 255;
            } else
            if (index == 5 || index == 6){
                title.opacity = 255;
            } else{
                title.opacity = 255;
            }
            
            gsap.to(title,1.0,{x:600 + index * 24});
            gsap.to(title,2.0,{x:632 + index * 25,delay:1.0,opacity:255});
            gsap.to(title,1.0,{delay:3.0,opacity:0});
        });
        let self = this;
        gsap.to(this,4,{onComplete:function(){
            self.terminate();
        }});
    }

    terminate(){
        gsap.killTweensOf(this);
        this.destroy();
    }
}