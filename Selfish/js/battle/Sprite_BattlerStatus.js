//-----------------------------------------------------------------------------
// Sprite_BattlerStatus
//

class Sprite_BattlerStatus extends Sprite{
    constructor(){
        super();
        this._nameSprite = null;
        this._hpSprite = null;
        this._hpGaugeSprite = null;
    
        this._requestHpUpdateAddict = false;
        this._battler = null;
    
        this._addictHpSprite = null;
    
        this._weakText = null;
        this._weakAnim = null;
    
        this._statusMpSprite = null;
    
        this._elementImage = ImageManager.loadSystem("IconSet");

    }

    setup(battler){
        this._battler = battler;
        this.setHp();
        this.setMp();
        //this.setTp();
        this.setStateIconSprite();
    
        this.setWeakSprite();

    
        this._isInit = true;
    }

    setName(){
        this._nameSprite = new Sprite();
        this._nameSprite.bitmap = this.createBitmap(this._battler.name(),21,'left');
        this._nameSprite.x = 78;
        this.addChild(this._nameSprite);
    }

    setHp(){
        if (this._battler.isActor()){
            const width = 80;
            const height = 6;
            const x = 0;
            const y = 64;
            this._hpGaugeSpriteBack = new Sprite(new Bitmap(width,height));
            this._hpGaugeSpriteBack.bitmap.fillRect(0, 0, width, height ,$gameColor.getColor('gaugeback'));
            this._hpGaugeSpriteBack.pivot.x = 0;
            this.addChild(this._hpGaugeSpriteBack);
            this._hpGaugeSpriteBack.x = x;
            this._hpGaugeSpriteBack.y = y;
            this._hpGaugeSprite = new Sprite(new Bitmap(width - 4,height - 2));
            this._hpGaugeSprite.bitmap.gradientFillRect(0, 0, width - 4, height - 2,$gameColor.getColor('hpgauge2'),$gameColor.getColor('hpgauge1'));
            this._hpGaugeSprite.pivot.x = 0;
            this._hpGaugeSprite.x = x + 2;
            this._hpGaugeSprite.y = y + 1;
            this._hpGaugeSprite.scale.x = this._battler.hp / this._battler.mhp;
            this.addChild(this._hpGaugeSprite);
            this._hpSprite = new Sprite();
            this.setHpBitmap(this._battler.hp);
            this._hpSprite.x = x - 80;
            this._hpSprite.y = y - 32;
            this.addChild(this._hpSprite);
        } else{
            const width = 80;
            const height = 6;
            const x = 0;
            const y = 0;
            this._hpGaugeSpriteBack = new Sprite(new Bitmap(width,height));
            this._hpGaugeSpriteBack.bitmap.fillRect(0, 0, width, height ,$gameColor.getColor('gaugeback'));
            this._hpGaugeSpriteBack.pivot.x = 0;
            this.addChild(this._hpGaugeSpriteBack);
            this._hpGaugeSpriteBack.x = x;
            this._hpGaugeSpriteBack.y = y;
            this._hpGaugeSprite = new Sprite(new Bitmap(width - 4,height - 2));
            this._hpGaugeSprite.bitmap.gradientFillRect(0, 0, width - 4, height - 2,$gameColor.getColor('hpgauge2'),$gameColor.getColor('hpgauge1'));
            this._hpGaugeSprite.pivot.x = 0;
            this._hpGaugeSprite.x = x + 2;
            this._hpGaugeSprite.y = y + 1;
            this._hpGaugeSprite.scale.x = this._battler.hp / this._battler.mhp;
            this.addChild(this._hpGaugeSprite);
            this._hpSprite = new Sprite();
            this._hpSprite.scale.x = this._hpSprite.scale.y = 1;
            this.setHpBitmap(this._battler.hp);
            this._hpSprite.x = x - 80;
            this._hpSprite.y = y - 32;
            this.addChild(this._hpSprite);
        }
    }

    setMp(){

        const width = Math.floor( this._battler.mmp * 1 );
        const height = 8;
        const x = 80;
        const y = 62 + 14;
        this._mpGaugeSpriteBack = new Sprite(new Bitmap(width,height));
        this._mpGaugeSpriteBack.bitmap.fillRect(0, 0, width, height ,$gameColor.getColor('gaugeback'));
        this._mpGaugeSpriteBack.pivot.x = 0;
        //this.addChild(this._mpGaugeSpriteBack);
        this._mpGaugeSpriteBack.x = x;
        this._mpGaugeSpriteBack.y = y;
        
        this._mpGaugeSprite = new Sprite(new Bitmap(width - 4,height - 2));
        this._mpGaugeSprite.bitmap.gradientFillRect(0, 0, width - 4, height - 2,$gameColor.getColor('mpgauge2'),$gameColor.getColor('mpgauge1'));
        this._mpGaugeSprite.pivot.x = 0;
        this._mpGaugeSprite.x = x + 2;
        this._mpGaugeSprite.y = y + 1;
        this._mpGaugeSprite.scale.x = this._battler.mp / this._battler.mmp;
        //this.addChild(this._mpGaugeSprite);
        this._mpSprite = new Sprite();
        this.setMpBitmap(this._battler.mp);
        this._mpSprite.x = 200 / 2;
        this._mpSprite.y = y / 2;

        //this.addChild(this._mpSprite);
    }

    setTp(){
        /*
        const width = Math.floor( this._battler.maxTp() * 1 );
        const height = 8;
        const x = 80;
        const y = 62 + 22;
        this._tpGaugeSpriteBack = new Sprite(new Bitmap(width,height));
        this._tpGaugeSpriteBack.bitmap.fillRect(0, 0, width, height ,$gameColor.getColor('gaugeback'));
        this._tpGaugeSpriteBack.pivot.x = 0;
        this.addChild(this._tpGaugeSpriteBack);
        this._tpGaugeSpriteBack.x = x;
        this._tpGaugeSpriteBack.y = y;
        
        this._tpGaugeSprite = new Sprite(new Bitmap(width - 4,height - 2));
        this._tpGaugeSprite.bitmap.gradientFillRect(0, 0, width - 4, height - 2,$gameColor.getColor('tpgauge2'),$gameColor.getColor('tpgauge1'));
        this._tpGaugeSprite.pivot.x = 0;
        this._tpGaugeSprite.x = x + 2;
        this._tpGaugeSprite.y = y + 1;
        this._tpGaugeSprite.scale.x = this._battler.tp / this._battler.maxTp();
        this.addChild(this._tpGaugeSprite);
        this._tpSprite = new Sprite();
        this.setTpBitmap(this._battler.tp);
        this._tpSprite.x = 200 / 2;
        this._tpSprite.y = y / 2;
        //this.addChild(this._tpSprite);
        */
    }


    setWeakSprite(){
        this._weakText = new Sprite();
        this._weakText.scale.x = 0.75;
        this._weakText.scale.y = 0.75;
        this._weakText.x = 192;
        this._weakText.y = 20;
        let bitmap = new Bitmap(200,40);
        bitmap.fontSize = 21;
        bitmap.drawText(TextManager.getText(600400),0,0,200,40,"left",true);
        this._weakText.bitmap = bitmap;
        this.addChild(this._weakText);
        this._weakText.opacity = 0;
    }

    refreshStatus(){
        this.changeHp();
        this.changeMp();
        this.changeTp();
    }

    changeHp(){
        if (!this._battler){
            return;
        }
        if (!this._battler.isAlive() && !this._battler.isActor()){
            this.alpha = 0;
        } else{
            this.alpha = 1;
        }
        if (this._lastHp == this._battler.hp && this._lastMHp == this._battler.mhp){
            return
        }
        this._lastMHp = this._battler.mhp;
        this._lastHp = this._battler.hp;
        let tl = new TimelineMax();
        if (this._hpAnim){
            this._hpAnim.kill();
        }
        tl.to(this._hpGaugeSprite.scale, 0.4, {
            x: this._battler.hp / this._battler.mhp,
            onUpdate : () => {
                let hp = Math.floor(this._battler.mhp * this._hpGaugeSprite.scale.x);
                this.setHpBitmap(hp);
            },
            onComplete : () => {
                this.setHpBitmap(this._battler.hp);
            }
        })
        this._hpAnim = tl;
    }

    changeMp(){
        if (!this._battler){
            return;
        }
        if (!this._battler.isAlive() && !this._battler.isActor()){
            this.alpha = 0;
        } else{
            this.alpha = 1;
        }
        if (this._lastMp == this._battler.mp && this._lastMMp == this._battler.mmp){
            return
        }
        this._lastMMp = this._battler.mmp;
        this._lastMp = this._battler.mp;
        let tl = new TimelineMax();
        if (this._mpAnim){
            this._mpAnim.kill();
        }
        console.log(this._mpGaugeSprite)
        tl.to(this._mpGaugeSprite.scale, 0.4, {
            x: this._battler.mp / this._battler.mmp,
            onUpdate : () => {
                let mp = Math.floor(this._battler.mmp * this._mpGaugeSprite.scale.x);
                this.setMpBitmap(mp);
            },
            onComplete : () => {
                this.setMpBitmap(this._battler.mp);
            }
        })
        this._mpAnim = tl;
    }

    changeTp(){
        /*
        if (!this._battler){
            return;
        }
        if (!this._battler.isAlive() && !this._battler.isActor()){
            this.alpha = 0;
        } else{
            this.alpha = 1;
        }
        if (this._lastTp == this._battler.tp && this._lastMTp == this._battler.maxTp()){
            return
        }
        this._lastMTp = this._battler.maxTp();
        this._lastTp = this._battler.tp;
        let tl = new TimelineMax();
        if (this._tpAnim){
            this._tpAnim.kill();
        }
        tl.to(this._tpGaugeSprite.scale, 0.4, {
            x: this._battler.tp / this._battler.maxTp(),
            onUpdate : () => {
                let tp = Math.floor(this._battler.maxTp() * this._mpGaugeSprite.scale.x);
                this.setTpBitmap(tp);
            },
            onComplete : () => {
                this.setTpBitmap(this._battler.tp);
            }
        })
        this._tpAnim = tl;
        */
    }

    changeTpEffect(isGlow){
        /*
        if (this._battler.isActor() == false){
            return;
        }
        if (isGlow){
            if (this._tpEffect == null){
                this._tpEffect = new PIXI.filters.GlowFilter();
            }
            this._tpEffect.outerStrength = 1.5;
            this._tpEffect.innerStrength = 0.5;
            this._tpEffectTiming = false;
            this._statusMpSprite.filters = [this._tpEffect];
        } else{
            if (this._tpEffect){
                this._tpEffect.destroy();
            }
            this._tpEffect = null;
            this._statusMpSprite.filters = [];
        }
        */
    }

    update(){
        super.update();
        /*
        if (this._tpEffect){
            if (Graphics.frameCount % 6 == 0){
                if (this._tpEffectTiming){
                    this._tpEffect.outerStrength += 0.10;
                } else{
                    this._tpEffect.outerStrength -= 0.10;
                }
                if (this._tpEffect.outerStrength > 2.6){
                    this._tpEffect.outerStrength = 2.5;
                    this._tpEffectTiming = !this._tpEffectTiming;
                } else
                if (this._tpEffect.outerStrength < 1.9){
                    this._tpEffect.outerStrength = 2;
                    this._tpEffectTiming = !this._tpEffectTiming;
                }
            }
        }
        */
        //if ($gameDefine.mobileMode){
            this._infoSprite.visible = (this._stateIconSprite.states().length > 0);
        //}
    }

    setStateIconSprite(){
        //if ($gameDefine.mobileMode){
            this._infoSprite = new Sprite();
            this._infoSprite.bitmap = ImageManager.loadSystem("pageA_1off");
            this._infoSprite.x = 228;
            this._infoSprite.y = -10;
            this._infoSprite.visible = false;
            this.addChild(this._infoSprite);
        //}

        this._stateIconSprite = new Sprite_StateIcon();
        this._stateIconSprite.setup(this._battler);
        this._stateIconSprite.x = 248;
        this._stateIconSprite.y = 54;
        this.addChild(this._stateIconSprite);
    }

    setAddictHpBar(){
    }

    createBitmap(text,fontSize,align){
        let bitmap = new Bitmap(160,48);
        bitmap.fontSize = fontSize;
        bitmap.drawText(text, 0, 0, 160, 48, align,true);
        return bitmap;
    }

    createBitmapPlus(text,fontSize,align){
        let bitmap = new Bitmap(160,48);
        bitmap.fontSize = fontSize;
        bitmap.textColor = $gameColor.getColor('powerup');
        bitmap.drawText(text, 0, 0, 160, 48, align,true);
        return bitmap;
    }

    createBitmapDying(text,fontSize,align){
        let bitmap = new Bitmap(160,48);
        bitmap.fontSize = fontSize;
        bitmap.textColor = $gameColor.getColor('crisis');
        bitmap.drawText(text, 0, 0, 160, 48, align,true);
        return bitmap;
    }

    changeHpAddict(max,min){
        if (this._requestHpUpdateAddict == true){
            return
        }
        this._requestHpUpdateAddict = true;
        if (this._hpAnim){
            this._hpAnim.kill();
        }
        this._addictHpSprite.scale.x = (this._battler.hp / this._battler.mhp)
        this._hpGaugeSprite.scale.x = (this._battler.hp - max) / this._battler.mhp;
        if (this._hpGaugeSprite.scale.x < 0){
            this._hpGaugeSprite.scale.x = 0;
        }
        min = (this._battler.hp - min) / this._battler.mhp;
        if (min < 0){
            min = 0;
        }
        let tl = new TimelineMax();
        tl.to(this._hpGaugeSprite.scale, 0.5, {
            x:min, repeat:-1,yoyo:true,ease:Power1.easeInOut,
            onUpdate : () => {
                 let hp = Math.floor(this._battler.mhp * this._hpGaugeSprite.scale.x);
                 this._hpSprite.bitmap = this.createBitmap(hp,21,'right');
            }
        }).to(this._addictHpSprite, 0.5, {
            alpha:1, repeat:-1,yoyo:true,ease:Power1.easeInOut
        },"-=0.5")
        this._hpAnim = tl;
    }

    changeWeakAddict(flag){
        if (this._weakAnim){
            return;
        }
        this._weakText.alpha = 0;
        if (flag == true){
            let t1 = gsap.to(this._weakText,0.5,{
                alpha:1,
                repeat:-1,
                yoyo:true
            })
            this._weakAnim = t1;
        }
    }

    stopAddict(){
        if (this._requestHpUpdateAddict == false){
            return
        }
        this._hpAnim.kill();
        if (this._weakAnim){
            this._weakAnim.kill();
        }
        this._weakAnim = null;
        this._addictHpSprite.alpha = 0;
        this._requestHpUpdateAddict = false;
        let hp = Math.floor(this._battler.hp);    
        this.setHpBitmap(hp);
        this._hpGaugeSprite.scale.x = this._battler.hp / this._battler.mhp;
        this._addictHpSprite.scale.x = this._hpGaugeSprite.scale.x;
    
        this._weakText.opacity = 0;
    }


    setHpBitmap(hp){
        if (hp < this._battler.hp){
            return;
        }
        const _text = hp;
        if (this._battler.isStatusParamUp(0,hp)){
            this._hpSprite.bitmap = this.createBitmapPlus(_text,16,'right');
        } else if (this._battler.isDying(hp)){
            this._hpSprite.bitmap = this.createBitmapDying(_text,16,'right');
        } else{
            this._hpSprite.bitmap = this.createBitmap(_text,16,'right');
        }
    }
    setMpBitmap(mp){
        if (mp < this._battler.mp){
            return;
        }
        const _text = mp + " / " + this._battler.mmp;
        if (this._battler.isStatusParamUp(1,mp)){
            this._mpSprite.bitmap = this.createBitmapPlus(_text,21,'center');
        } else if (this._battler.mp / this._battler.mmp < 0.25){
            this._mpSprite.bitmap = this.createBitmapDying(_text,21,'center');
        } else{
            this._mpSprite.bitmap = this.createBitmap(_text,21,'center');
        }
    }
    setTpBitmap(tp){
        if (tp < this._battler.tp){
            return;
        }
        const _text = tp + " / " + this._battler.maxTp();
        //if (this._battler.isStatusParamUp(1,tp)){
        //    this._mpSprite.bitmap = this.createBitmapPlus(_text,21,'center');
        //} else 
        if (this._battler.tp / this._battler.maxTp() < 0.25){
            this._tpSprite.bitmap = this.createBitmapDying(_text,21,'center');
        } else{
            this._tpSprite.bitmap = this.createBitmap(_text,21,'center');
        }
    }


    terminate(){
        if (this._statusMpSprite){
            this._statusMpSprite.terminate();
        }
        this._statusMpSprite = null;
        if (this._stateIconSprite){
            this._stateIconSprite.destroy();
        }
        this._stateIconSprite = null;
        if (this._weakText){
            this._weakText.destroy();
        }
        this._weakText = null;
        if (this._addictHpSprite){
            this._addictHpSprite.destroy();
        }
        this._addictHpSprite = null;
        for (let i = this.children.length-1; i >= 0; i--){
            this.children[i].destroy();
            this.removeChild(this.children[i]);
        }
        
        this._battler = null;
        this._nameSprite = null;
        this._hpGaugeSprite = null;
        this._hpSprite = null;
        if (this._hpAnim){
            this._hpAnim.kill();
        }
        this._hpAnim = null;
        
        if (this._weakAnim){
            this._weakAnim.kill();
        }
        this._weakAnim = null;
        this._elementImage = null;
        this._texture = null;
        this._lastHp = null;
        this._lastMHp = null;
        this._lastMp = null;
        this._lastMMp = null;
        this._lastTp = null;
        this._lastMTp = null;
        //this.destroy();
    }
}