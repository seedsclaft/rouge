//-----------------------------------------------------------------------------
// Sprite_NextStage
//

class Sprite_NextStage extends Sprite{
    constructor(title,endCall){
        super();
        this._linesSprites = [];
        this._nextSprites = [];
        this._titleSprites = [];
        this._next = ["N","e","x","t","","","","i","s"];
        this._title = title;
        this._title = this._title.split("");
        
        this._whiteScreen = new ScreenSprite();
        this._whiteScreen.setColor(255,255,255);
        this.addChild(this._whiteScreen);
        this._whiteScreen.opacity = 180;
        for (let i = 0;i < 12;i++){
            this.createLines(i);
        }
        for (let i = 0;i < 9;i++){
            this.createNext(i);
        }
        for (let i = 0;i < this._title.length;i++){
            this.createTitle(i);
        }

        this._endCall = endCall;
    }

    createLines(){
        let sprite = new Sprite();
        sprite.x = 280;
        //sprite.y = 444;
        sprite.anchor.x = 1;
        sprite.anchor.y = 0.5;
        sprite.scale.x = 1;
        sprite.scale.y = 24;
        //sprite.opacity = 0;
        let bitmap = new Bitmap(2,64);
        sprite.bitmap = bitmap;
        sprite.bitmap.fillAll('white');
        this.addChild(sprite);
        this._linesSprites.push(sprite);
    }

    createNext(idx){
        let sprite = new Sprite();
        sprite.x = 36 * idx + 464;
        sprite.y = 400;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.scale.x = 1;
        sprite.scale.y = 1;
        sprite.opacity = 0;
        let bitmap = new Bitmap(64,64);
        bitmap.fontSize = 32;
        sprite.bitmap = bitmap;
        sprite.bitmap.drawText(this._next[idx],0,0,64,64,'center');
        this.addChild(sprite);
        this._nextSprites.push(sprite);
    }

    createTitle(idx){
        let sprite = new Sprite();
        sprite.x = 36 * idx + 496;
        sprite.y = 482;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.opacity = 0;
        let bitmap = new Bitmap(64,64);
        bitmap.fontSize = 32;
        sprite.bitmap = bitmap;
        sprite.bitmap.drawText(this._title[idx],0,0,64,64,'center');
        this.addChild(sprite);
        this._titleSprites.push(sprite);
    }

    start(){
        FilterMzUtility.addFilter(FilterType.OldFilmFade);
        gsap.to(this._whiteScreen,6,{opacity:0});
        let tl = new TimelineMax();
        tl.to(this._linesSprites[0], 0.4, {
            x: this._linesSprites[0].x - 64,
            opacity :128
        }).to(this._linesSprites[0], 0.8, {
            x: this._linesSprites[0].x - 88,
            opacity:0
        })
    
        let t2 = new TimelineMax();
        t2.to(this._linesSprites[1], 0.4, {
            x: this._linesSprites[1].x + 64,
            opacity :128,
            delay :0.28
        }).to(this._linesSprites[1], 0.8, {
            x: this._linesSprites[1].x + 72,
            opacity:0
        })
    
        let t3 = new TimelineMax();
        t3.to(this._linesSprites[2], 0.4, {
            x: this._linesSprites[2].x + 96,
            opacity :128,
            delay :0.28 * 2
        }).to(this._linesSprites[2], 0.8, {
            x: this._linesSprites[2].x + 120,
            opacity:0
        })
    
        
        let t4 = new TimelineMax();
        t4.to(this._linesSprites[3], 0.4, {
            x: this._linesSprites[3].x + 280,
            opacity :128,
            delay :0.3*3
        }).to(this._linesSprites[3], 2.4, {
            x: this._linesSprites[3].x + 328,
            opacity:0
        })
    
        let t5 = new TimelineMax();
        t5.to(this._linesSprites[4], 0.4, {
            x: this._linesSprites[4].x + 96,
            opacity :128,
            delay :1.25
        }).to(this._linesSprites[4], 2, {
            x: this._linesSprites[4].x + 128,
            opacity:0
        })
    
        let t6 = new TimelineMax();
        t6.to(this._linesSprites[5], 0.4, {
            x: this._linesSprites[5].x + 200,
            opacity :128,
            delay :1.5
        }).to(this._linesSprites[5], 1.6, {
            x: this._linesSprites[5].x + 248,
            opacity:0
        })
    
        let t7 = new TimelineMax();
        t7.to(this._linesSprites[6], 0.4, {
            x: this._linesSprites[6].x + 400,
            opacity :128,
            delay :1.75
        }).to(this._linesSprites[6], 1.2, {
            x: this._linesSprites[6].x + 448,
            opacity:0
        })
    
        let t8 = new TimelineMax();
        t8.to(this._linesSprites[7], 0.4, {
            x: this._linesSprites[7].x + 280,
            opacity :128,
            delay :2.5
        }).to(this._linesSprites[7], 1.2, {
            x: this._linesSprites[7].x + 256,
            opacity:0
        })
    
        let t9 = new TimelineMax();
        t9.to(this._linesSprites[8], 0.3, {
            x: this._linesSprites[8].x + 200,
            opacity :128,
            delay :2.5
        }).to(this._linesSprites[8], 2, {
            x: this._linesSprites[8].x + 174,
            opacity:0
        })
    
        let t10 = new TimelineMax();
        t10.to(this._linesSprites[9], 0.2, {
            x: this._linesSprites[9].x + 140,
            opacity :128,
            delay :2.5
        }).to(this._linesSprites[9], 2, {
            x: this._linesSprites[9].x + 80,
            opacity:0
        })
    
        let t11 = new TimelineMax();
        t11.to(this._linesSprites[10], 0.4, {
            x: this._linesSprites[10].x + 360,
            opacity :128,
            delay :3.0
        }).to(this._linesSprites[10], 2.4, {
            x: this._linesSprites[10].x + 520,
            opacity:0
        })
    
        let t12 = new TimelineMax();
        t12.to(this._linesSprites[11], 0.4, {
            x: this._linesSprites[11].x + 360,
            opacity :128,
            delay :3.0
        }).to(this._linesSprites[11], 1.2, {
            x: this._linesSprites[11].x + 320,
            opacity:0
        })
    
    
        this._nextSprites.forEach((next,index) => {
            if (index < 4){
                gsap.to(next,1,{x:index * 28 + 440,opacity:255,delay:0.8 + index * 0.2});
            } else{
                next.x = 440;
                next.y = 440;
                gsap.to(next,1,{x:(index - 7) * 28 + 440,opacity:255,delay:0.8 + index * 0.2});
            }
        });
    
        this._titleSprites.forEach((title,index) => {
            gsap.to(title,1,{x:index * 28 + 440,opacity:255,delay:3 + index * 0.01});
        });
    
        let self = this;
        gsap.to(this,5.25,{onComplete:function(){
            gsap.to(self,1,{opacity:0});
        }});
    
        gsap.to(this,6.5,{onComplete:function(){
            self.terminate();
        }});
    }

    terminate(){
        if (this._endCall) this._endCall();
        this._endCall = null;
        FilterMzUtility.removeFilter(FilterType.OldFilmFade);
        gsap.killTweensOf(this);
        this.destroy();
    }
}