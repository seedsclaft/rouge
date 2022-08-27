//-----------------------------------------------------------------------------
// Window_Progress
//

class Window_Progress extends Window_Base{
    constructor(){
        super();
    }

    initialize(){
        const x = 640;
        const y = 36;
        const width = 400;
        const height = this.fittingHeight(1.25)
        super.initialize(new Rectangle( x, y, width, height ));
        
        this._numberSprite = new Sprite();
        this._numberSprite.x = 80 + 40;
        this._numberSprite.y = 8;
        this._numberSprite.bitmap = this.createBitmap("0",21);
        this.addChild(this._numberSprite);
        this._gaugeSprite = new Sprite(new Bitmap(250,6));
        this._gaugeSprite.bitmap.gradientFillRect(0, 0, 250, 6,$gameColor.getColor('hpgauge2'),$gameColor.getColor('hpgauge1'));
        this._gaugeSprite.pivot.x = 0;
        this._gaugeSprite.x = 12 + 40;
        this._gaugeSprite.y = 44;
        this._gaugeSprite.scale.x = 0;
        this.addChild(this._gaugeSprite);
    
        this.opacity = 0;
        this.refresh();
        this.show();
        this._lastNumber = 0;
    }

    maxCount(){
        return $gameParty.stageLength();
    }

    nowCount(){
        return $gameParty._stageStepCount;
    }

    refresh(){
        this.contents.clear();
        this.drawProgress();
    }

    drawProgress(){
        const color1 = this.hpGaugeColor1();
        const color2 = this.hpGaugeColor2();    
        this.drawBackSkewX(0,0,320,44,"rgba(0,0,0,255)",128,0.25);
            
        this.drawGauge(40, 0, 250, 0, color1, color2);
        this.drawText(TextManager.getText(400300) ,40,0,224);
        
        this.drawText(TextManager.getText(300) ,40,0,248,'right');
    }

    update(){
        super.update();
        let value = this.nowCount() / this.maxCount();
        value = Math.round(value * 100);
        if (value != this._lastNumber){
            this._lastNumber = value;
            if (this._anim){
                this._anim.kill();
            }
            var tl = new TimelineMax();
            tl.to(this._gaugeSprite.scale, 0.2, {
                x: value / 100,
                onUpdate : () => {
                    var progress = Math.floor(100 * this._gaugeSprite.scale.x);
                    this._numberSprite.bitmap = this.createBitmap(progress,21,'right');
                },
                onComplete : () => {
                    this._numberSprite.bitmap = this.createBitmap(value,21,'right');
                }
            })
            this._anim = tl;
        ;}
    }

    createBitmap(text,fontSize,align){
        if (fontSize === undefined){
            fontSize = 24;
        }
        if (align === undefined){
            align = 'right';
        }
        let bitmap = new Bitmap(160,48);
        bitmap.fontSize = fontSize;
        bitmap.drawText(text, 0, 0, 160, 48, align);
        return bitmap;
    }

    terminate(){
        if (this._anim){
            this._anim.kill();
        }
        gsap.killTweensOf(this);
        gsap.killTweensOf(this._gaugeSprite);
        gsap.killTweensOf(this._numberSprite);
        this._anim = null;
        this._numberSprite.destroy();
        this._numberSprite = null;
        this._gaugeSprite.destroy();
        this._gaugeSprite = null;
        this._lastNumber = null;
        this.destroy();
    }
}