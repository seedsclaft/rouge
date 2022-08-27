
//-----------------------------------------------------------------------------
// Sprite_Emotion
//

class Sprite_Emotion extends Sprite{
    constructor(){
        super();
        this.initMembers();
    }

    initMembers(){
        this._base = null;
        gsap.killTweensOf(this._base);
        this.x = 0;
        this.y = 0;
        this.bitmap = null;
        this.z = 7;
        this._baseY = 0;
        this._lastY = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0;
    }

    setPosY(baseY,lastY){
        this._baseY = baseY;
        this._lastY = lastY;
    }

    setup(base,balloonId){
        if (base._posData == null){
            return;
        }
        this.bitmap = null;
        this.x = 40;
        this.y = this._lastY;
        this.scale.x = 1;
        this.opacity = 255;
        base.y = this._baseY;
        if (this._anim){
            this._anim.kill()
        }
        if (this._balloonAnim){
            this._balloonAnim.kill()
        }
        if (this._balloonAnim2){
            this._balloonAnim2.kill()
        }
        this._anim = null;
        this._balloonAnim = null;
        this._balloonAnim2 = null;
    
        this._balloonId = balloonId;
        this._base = base;
    
        switch (this._balloonId){
            case 1:
                this.setSurprise();
                break;
            case 2:
                this.setQuestion();
                break;
            case 3:
                this.setEnjoy();
                break;
            case 4:
                this.setHeartfull();
                break;
            case 5:
                this.setAngry();
                break;
            case 6:
                this.setImpatient();
                break;
            case 7:
                this.setDondori();
                break;
            case 8:
                this.setSilent();
                break;
            case 9:
                this.setPirameki();
                break;
            case 10:
                this.setSleep();
                break;
            case 11:
                this.bitmap = null;
                if (this._anim){
                    this._anim.kill();
                }
                if (this._balloonAnim){
                    this._balloonAnim.kill();
                }
                if (this._balloonAnim2){
                    this._balloonAnim2.kill();
                }
                this._anim = null;
                this._balloonAnim = null;
                this._balloonAnim2 = null;
                base.y = this._base.y;
                return;
        }
    }

    seatAction(){
        this._anim = new TimelineMax();
        this._anim.to(this._base, 0.8, {
            y:this._base.y + 24,
        }).to(this._base, 0.8, {
            y:this._base.y,
            delay:0.8
        })
        this._anim.repeat(-1);
    }

    jumpAction(){
        this._anim = new TimelineMax();
        this._anim.to(this._base, 0.2, {
            y:this._base.y - 24,
            repeat:1,
            yoyo:true
        })
        this._anim.repeat(-1);
    }

    setSurprise(){
        this.bitmap = ImageManager.loadSystem('emo_6');
        this.x = + 40;
        this._anim = new TimelineMax();
        this._anim.to(this._base, 0.2, {
            y:this._base.y - 24,
            repeat:1,
            yoyo:true
        }).to(this._base, 0.6, {
            y:this._base.y,
            delay:0.6
        })
        this._anim.repeat(-1);
        
        this._balloonAnim = new TimelineMax();
        this._balloonAnim.to(this, 0, {
            opacity:0
        }).to(this, 0.2, {
            x:this.x + 40,
            y:this.y - 40,
            opacity:255
        }).to(this, 0.7, {
            y:this.y - 40,
            delay:0.7,
            opacity:0
        })
        this._balloonAnim.repeat(-1);
    }

    setQuestion(){
        this.bitmap = ImageManager.loadSystem('emo_7');
        if (this._base.scale.x < 0){
            this.scale.x = -1;
        }
        this.seatAction();
    
        this._balloonAnim = new TimelineMax();
        this._balloonAnim2 = new TimelineMax();
        this.x = -24;
        this._balloonAnim.to(this, 0.4, {
            x:this.x + 80,
            repeat:1,
            yoyo:true
        }).to(this, 0.4, {
            x:this.x - 80,
            repeat:1,
            yoyo:true,
        })
        this._balloonAnim2.to(this, 0, {
            y:this.y,
            opacity:0
        }).to(this, 1.2, {
            y:this.y - 80,
            opacity:255,
            ease:Power0.easeNone
        }).to(this, 1.2, {
            y:this.y - 160,
            opacity:0,
            ease:Power0.easeNone
        })
        this._balloonAnim.repeat(-1);
        this._balloonAnim2.repeat(-1);
    }

    setEnjoy(){
        this.bitmap = ImageManager.loadSystem('emo_3_1' );
        this.scale.x = -1;
    
        this.x = 80;
        this.y = this.y - 40;
        this.jumpAction();
        this._balloonAnim = new TimelineMax();
        
        var self = this;
        this._balloonAnim.to(this, 0.2, {
            y:this.y - 24,
            repeat:1,
            yoyo:true,
            onComplete:function() {
                self.bitmap = ImageManager.loadSystem('emo_3_2');
            }
        }).to(this, 0.2, {
            y:this.y - 24,
            repeat:1,
            yoyo:true,
            onComplete:function() {   
                self.bitmap = ImageManager.loadSystem('emo_3_1');
            }
        })
        this._balloonAnim.repeat(-1);
    }

    setHeartfull(){
        this.bitmap = ImageManager.loadSystem('emo_4');

        this.seatAction();
    
        this._balloonAnim = new TimelineMax();
        this.x = 0;
        this.y = this.y + 80;
        this._balloonAnim.to(this, 0, {
            opacity:0,
        }).to(this, 1.6, {
            opacity:80,
        }).to(this, 0.8, {
            opacity:0,
        })
        this._balloonAnim.repeat(-1);
    }

    setAngry(){
        this.bitmap = ImageManager.loadSystem('emo_5');
    
        this.jumpAction();
    
        this._balloonAnim = new TimelineMax();
        this.x = 40;
        var self = this;
        this._balloonAnim.to(this, 0.2, {
            x:this.x + 40,
            y:this.y - 40,
            repeat:1,
            yoyo:true,
            onComplete:function() {
                self.scale.x = -1;
            }
        }).to(this, 0, {
            x:this.x - 120,
        }).to(this, 0.2, {
            x:this.x - 160,
            y:this.y - 40,
            repeat:1,
            yoyo:true,
            onComplete:function() {
                self.scale.x = 1;
            }
        })
        this._balloonAnim2 = new TimelineMax();
        
        this._balloonAnim2.to(this, 0, {
            delay:0.2,
            opacity:255
        }).to(this, 0.2, {
            opacity:0
        }).to(this, 0, {
            opacity:255
        })
        this._balloonAnim.repeat(-1);
        this._balloonAnim2.repeat(-1);
    }

    setImpatient(){
        this.bitmap = ImageManager.loadSystem('emo_2');

        this.seatAction();
    
        this._balloonAnim = new TimelineMax();
        this.x = 64;
        this.scale.x = -1;
        var points = [
            {x:this.x + 0, y:this.y + 0}, 
            {x:this.x + 32, y:this.y + -4}, 
            {x:this.x + 64, y:this.y + 48}
        ];
        this._balloonAnim.to(this, 0.8, {
            bezier : points,
            opacity:0
        }).to(this, 0.4, {
            opacity:0
        })
        this._balloonAnim.repeat(-1);
    }

    setDondori(){
        this.bitmap = ImageManager.loadSystem('emo_10');
        this.seatAction();
        this._balloonAnim = new TimelineMax();
        this.x = 12;
        this.y = this.y - 12;
        this._balloonAnim.to(this, 0, {
            opacity:0,
        }).to(this, 1.6, {
            opacity:128,
        }).to(this, 0.8, {
            opacity:0,
        })
        this._balloonAnim.repeat(-1);
    }

    setSilent(){
        this.bitmap = ImageManager.loadSystem('emo_8');
        this._anim = new TimelineMax();
        this._anim.to(this._base, 0.4, {
            y:this._base.y + 12,
            repeat:1,
            yoyo:true
        }).to(this._base, 0.8, {
            y:this._base.y,
            delay:0.4
        })
        this._anim.repeat(-1);
    
        this._balloonAnim = new TimelineMax();
        this.scale.x = -1;
        this.x = 120;
        this._balloonAnim.to(this, 0, {
            opacity:0,
        }).to(this, 1.2, {
            x: this.x + 40,
            y: this.y - 40,
            ease:Back.easeOut.config(1.2),
            opacity:255,
        }).to(this, 0.8, {
            opacity:0,
        })
    
        var self = this;
        var anims = [
            ImageManager.loadSystem("emo_8_1"),
            ImageManager.loadSystem("emo_8_2"),
            ImageManager.loadSystem("emo_8_3"),
            ImageManager.loadSystem("emo_8"),
        ]
        this._balloonAnim2 = new TimelineMax();
        this._balloonAnim2.to(this, 0.4, {
            onComplete:function() { 
                self.bitmap = anims[0];
            }
        }).to(this, 0.4, {
            onComplete:function() {
                self.bitmap = anims[1];
            }
        }).to(this, 0.4, {
            onComplete:function() {
                self.bitmap = anims[2];
            }
        }).to(this, 0.8, {
            onComplete:function() {
                self.bitmap = anims[3];
            }
        })
    
        this._balloonAnim.repeat(-1);
        this._balloonAnim2.repeat(-1);
    }

    setPirameki(){
        this.bitmap = ImageManager.loadSystem('pirameki');
        this.x = 0;
        this._anim = new TimelineMax();
        this._anim.to(this._base, 0.2, {
            y:this._base.y - 24,
            repeat:1,
            yoyo:true
        }).to(this._base, 0.6, {
            y:this._base.y,
            delay:0.6
        })
        this._anim.repeat(-1);
        
        this._balloonAnim = new TimelineMax();
        this.opacity = 0;
        this._balloonAnim.to(this, 0.4, {
            y:this.y - 96,
            opacity: 255
        }).to(this,0.2,{
            
        }).to(this,0.1,{
            opacity:0
        }).to(this,0.1,{
            opacity:255
        }).to(this,0.1,{
            opacity:0
        }).to(this,0.1,{
            opacity:255
        }).to(this,0.1,{
            opacity:0
        }).to(this,0.1,{
            opacity:255
        }).to(this,0.4,{
        })
        this._balloonAnim.repeat(-1);
    }

    setSleep(){
        this.bitmap = ImageManager.loadSystem("sleep");
        this.x = 80;
        if (this._base.scale.x < 0){
            this.scale.x = -1;
            this.x = this.x - 200;
        }
        this.setFrame(0,0,144,144);
        this.seatAction();
        this._balloonAnim = new TimelineMax();
        var self = this;
        this._balloonAnim.to(this, 0.2, {
            onComplete:function() { 
                self.setFrame(144 * 1,0,144,144);
            }
        }).to(this, 0.1, {
            onComplete:function() {
                self.setFrame(144 * 2,0,144,144);
            }
        }).to(this, 0.1, {
            onComplete:function() {
                self.setFrame(144 * 3,0,144,144);
            }
        }).to(this, 0.1, {
            onComplete:function() {
                self.setFrame(144 * 4,0,144,144);
            }
        }).to(this, 0.3, {
            onComplete:function() {
                self.setFrame(144 * 5,0,144,144);
            }
        }).to(this, 0.3, {
            onComplete:function() {
                self.setFrame(144 * 6,0,144,144);
            }
        }).to(this, 0.3, {
            onComplete:function() {
                self.setFrame(144 * 7,0,144,144);
            }
        }).to(this, 1.0, {
        })
        this._balloonAnim.repeat(-1);
    }

    terminate(){
        if (this._anim){
            this._anim.kill();
        }
        if (this._balloonAnim){
            this._balloonAnim.kill();
        }
        if (this._balloonAnim2){
            this._balloonAnim2.kill();
        }
        this._anim = null;
        this._balloonAnim = null;
        this._balloonAnim2 = null;
        this.destroy();
    }
}