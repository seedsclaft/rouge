//-----------------------------------------------------------------------------
// Sprite_EventPicture
//
// The sprite for displaying a picture.

class Sprite_EventPicture extends Sprite{
    constructor(){
        super();
        this._animation = [];
        this._pictureLabel = '';
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this._posData = null;
        this._z = 0;
        this._mainSprite = new Sprite();
        this._mainSprite.anchor.x = 0.5;
        this._mainSprite.anchor.y = 0.5;
        this.addChild(this._mainSprite);
        this._faceSprite = new Sprite();
        this._faceSprite.anchor.x = 0.5;
        this._faceSprite.anchor.y = 0.5;
        this.addChild(this._faceSprite);
    
        this._easeMode = true;
        this._filters = {};
    }

    setup(labelName,x,y,z){
        this.x = x;
        this.y = y;
        this._z = z;
        this._pictureLabel = labelName;
        this.setFacePosition();
    }

    setFacePosition(){
        this._posData = DataManager.getFacePositionData(this._pictureLabel);
        if (this._posData){
            this.y = this._posData.y;
            this._faceSprite.x = 0;
            this._faceSprite.y = 0;
            if (this._mainSprite.scale.x < 0){
                this._mainSprite.scale.x = this._posData.scale * -1;
                this._mainSprite.scale.y = this._posData.scale;
            } else{
                this._mainSprite.scale.x = this._mainSprite.scale.y = this._posData.scale;
            }
        }
    }

    resetAnim(){
        this._animation.forEach(anim => {
            anim.seek(anim.endTime());
        });
        gsap.killTweensOf(this);
    }

    move(x, y,scaleX,scaleY,opacity,duration,delay){
        if (delay === undefined){
            delay = 0;
        }
        this.resetAnim();
        let SX = this._mainSprite.scale.x * scaleX;
        let SY = this._mainSprite.scale.y * scaleY;
        let easeMode = this._easeMode ? Power1.easeOut : Power0.easeNone;

        var tl = new TimelineMax();
        tl.to(this, duration, {
            x:this.x + x,
            y:this.y + y,
            opacity:opacity,
            delay:delay,
            ease:easeMode
        });
        var tl2 = new TimelineMax();
        tl2.to(this._mainSprite.scale, duration, {
            x:SX,
            y:SY,
        });
        this._animation =[tl,tl2];
    }

    walk(repeat,x,duration,opacity,scale){
        if (x === undefined){
            x = 0;
        }
        if (duration === undefined){
            duration = 0;
        }
        if (opacity === undefined){
            opacity = 255;
        }
        this.resetAnim();
        this.setFacePosition();
        var tl1 = new TimelineMax();
        tl1.to(this, duration, {
            x: this.x + x,
            ease:Power0.easeNone,
            onComplete:() => {
                this.playFootSound();
                this.resetAnim();
            }
        })
        var tl2 = new TimelineMax();
        tl2.to(this, repeat, {
            y:this.y -24,
            repeat:1,
            yoyo:true,
            ease:Power1.easeOut,
            onRepeat : () => {this.shouldStop(repeat)},
            onComplete:() => {this.shouldStopComplete()}
        })
        var tl3 = new TimelineMax();

        tl3.to(this, duration, {
            opacity:opacity,
        })
        var tl4 = new TimelineMax();
        if (scale !== undefined){
            tl4.to(this, duration, {
                pixi: {
                    scaleX:scale,
                    scaleY:scale
                },
                ease:Power0.easeNone,
            })
        }
        this._animation = [tl1,tl2,tl3,tl4];
        this._repeat = 0;
        this._walkStop = false;
    }

    playFootSound(){
    }

    walkX(repeat,x,duration){
        this._animation[0].to(this, duration, {
            x: this.x + x,
            ease:Power0.easeNone,
        });
    }

    shouldStop(duration,x){
        if (this._walkStop){
        } else{
            this._repeat += 1;
            this._animation[1].repeat(this._repeat);
        }
    }

    shouldStopComplete(duration,x){
        if (duration === undefined){
            duration = 0;
        }
        if (x === undefined){
            x = 0;
        }
        if (this._walkStop){
            this._animation[0].to(this, duration, {
                x: this.x,
                ease:Power0.easeNone,
            });
            this._animation[1].kill();
            this.resetAnim();
            if (this._walkEndAction){
                this._walkEndAction();
                this._walkEndAction = null;
            }
            this.walkStop = false;
        }
        this.playFootSound();
    }

    walkStopPicture(duration,endAction){
        if (this._animation.length > 2){
            this._walkStop = true;
            this._walkEndAction = endAction;
        }
    }

    flip(duration){
        this.resetAnim();
        var targetSprite = this._mainSprite;
        var targetX = targetSprite.scale.x < 1 ? 1 : -1;
        if (this._posData){
            targetX *= this._posData.scale;
        }
        var tl = new TimelineMax();
        tl.to(targetSprite.scale, duration, {
            x:targetX,
        })
        var tl2 = new TimelineMax();
        tl2.to(this, duration / 2, {
            y:this.y,
            repeat:1,
            yoyo:true
        })
        this._animation = [tl,tl2];
    }

    setFace(index){
    }

    startMessagePoint(name){
        if (this._pictureLabel.indexOf('Actor') == -1){
            return;
        };
        let positionX = this._faceSprite.x;
        if (this._mainSprite.scale.x < 0){
            positionX *= -1;
        }
            
        var actor = this._pictureLabel.substring(5,9);
        
        let targetScale = 1.0;
        targetScale = Math.abs(this._mainSprite.scale.x);
        if (this._posData && this._posData.scale){
            targetScale += 1 - this._posData.scale;
        }
    }

    stopMessagePoint(){
    }

    setEmotion(index){
    }

    update(){

        this.updateFaceName();
        super.update();
    }

    updateFaceName(){
        if (!this._animation){
            return;
        }
    }

    setBattleback1(){
        this._mainSprite.bitmap = ImageManager.loadBattleback1(this._pictureLabel);
    }

    setPicture(){
        this._mainSprite.bitmap = ImageManager.loadPicture(this._pictureLabel);
    }

    setEnemyPicture(){
        this._mainSprite.bitmap = ImageManager.loadEnemy(this._pictureLabel);
    }

    setTextPicture(text,vertical,flat){
        this._mainSprite.bitmap = new Bitmap(text.length * 40 , 40);
        if (flat){
            this._mainSprite.bitmap.textColor = 'rgba(40, 40, 40, 1)';
            this._mainSprite.bitmap.drawText(text,0,0,text.length * 40 , 40,"center",false,false);
        } else{
            this._mainSprite.bitmap.drawText(text,0,0,text.length * 40 , 40,"center",true,true);
        }
        if (vertical){
            this._mainSprite.rotation = 1 *  Math.PI / 2;
        }
    }




    setAnimation(animation,loop){             
    }


    walkFast(){
        this.resetAnim();                   
    }


    setSelected(flag){
        if (flag){
            this.opacity = 160;
        } else{
            this.opacity = 255;
        }
    }

    setSelecting(flag){
        if (flag){
            this.setBlendColor([255, 255, 255, 64]);
        } else{
            this.setBlendColor([0, 0, 0, 0]);
        }
    }

    pause(){
        this._animation.forEach(anim => {
            anim.pause();
        });
    }

    resume(){
        this._animation.forEach(anim => {
            anim.resume();
        });
    }

    fadeOut(duration){
        this.removeFilters("_alphaFilter");
        gsap.to(this,duration,{opacity:0});
    }

    fadeIn(duration,delay){
        if (delay === undefined){
            delay = 0;
        }
        this.removeFilters("_alphaFilter");
        gsap.to(this,duration,{opacity:255,delay:delay});
    }


    filterEventAdd(){
        let drawActorFilter;
        if (!this.existFilters("_drawActorFilter")){
            drawActorFilter = new PIXI.filters.DrawActorFilter();
        }
        this.setFilters("_drawActorFilter",drawActorFilter);
        drawActorFilter = this._filters["_drawActorFilter"];
        var actor = this._pictureLabel.substring(5,9);
        drawActorFilter.uniforms.time = 0;
        drawActorFilter.uniforms.element = Number(actor);
    }

    filterEventStart(){
        if (!this.existFilters("_drawActorFilter")){
            return;
        }
        this._eventStart = true;
    }

    filterEventRemove(){
        this._eventStart = false;
        this.removeFilters("_drawActorFilter");
    }

    shadowOn(onlyShadow,distance,rotation,alpha){
        let drawShadowFilter;
        if (!this.existFilters("drawShadowFilter")){
            drawShadowFilter = new PIXI.filters.DropShadowFilter();
        }
        this.setFilters("drawShadowFilter",drawShadowFilter);
        drawShadowFilter = this._filters["drawShadowFilter"];
        drawShadowFilter.shadowOnly = onlyShadow;
        drawShadowFilter.blur = 0;
        drawShadowFilter.quality = 0;
        drawShadowFilter.pixelSize = 0;
        drawShadowFilter.distance = distance;
        drawShadowFilter.rotation = rotation;
        drawShadowFilter.alpha = alpha;
    }

    filterShadowRemove(){
        this.removeFilters("drawShadowFilter");
    }

    glowOn(){
        let glowFilter;
        if (!this.existFilters("glowFilter")){
            glowFilter = new PIXI.filters.GlowFilter();
        } else{
            return;
        }
        this.setFilters("glowFilter",glowFilter);
        glowFilter = this._filters["glowFilter"];
        glowFilter.outerStrength = 1.5;
        this._tpEffectTiming = false;
    }

    glowRemove(){
        this.removeFilters("glowFilter");
    }

    pauseAnim(){
    }

    playAnim(){
    }

    setEaseMode(isEase){
        this._easeMode = isEase;
    }

    stopAnime(){
        this.resetAnim();
    }

    setAnchor(x,y){
        this._anchor.x = x;
        this._anchor.y = y;
    }

    windAnime(duration,rotation){
        var tl = new TimelineMax();
        tl.to(this, duration, {
            rotation:this.rotation + rotation,
            repeat:-1,
            yoyo:true,
            ease : RoughEase.ease.config({ template:  Power0.easeNone, strength: 0.25, points: 15, taper: "none", randomize: true, clamp: false})
        });
    }

    terminate(){
        if (this._faceSprite){
            this._faceSprite.destroy();
            this.removeChild(this._faceSprite);
        }
        if (this._mainSprite){
            this._mainSprite.destroy();
            this.removeChild(this._mainSprite);
        }
        if (this._animation){
            this._animation.forEach(element => {
                if (element){
                    element.kill();
                }
            });
            this._animation = [];    
            gsap.killTweensOf(this);
        }
        this._faceSprite = null;
        this._filters = null;
        this._tweens = null;
        this._posData = null;
        this.destroy();
    }

    setFootSound(footSound){
    }

    setScale(scaleX,scaleY){
        var targetSprite = this._mainSprite;
        if (this._posData){
            targetSprite.scale.x = scaleX * this._posData.scale;
            targetSprite.scale.y = scaleY * this._posData.scale;
        } else{
            targetSprite.scale.x = scaleX;
            targetSprite.scale.y = scaleY;
        }
    }

    setFilters(key, filter){

        if (this._mainSprite.filters == null){
            this._mainSprite.filters = [];
        }
        if (!this.existFilters(key)){
            this._mainSprite.filters.push(filter);
            this._filters[key] = filter;
        }
    }

    existFilters(key){
        return this._filters[key] != null;
    }

    removeFilters(key){
        if (this.existFilters(key)){
            this.filters = _.without(this.filters,this._filters[key]);
            this._mainSprite.filters = _.without(this._mainSprite.filters,this._filters[key]);
            delete this._filters[key];
        }
    }

    resetScale(){
        if (this._posData){
            this.scale.x = this.scale.y = this._posData.scale;
            this._mainSprite.scale.x = this._mainSprite.scale.y = this._posData.scale;
        }
    }

    resetPosition(){
        this.setFacePosition();
    }
}

const FaceType = {
    Normal : 0,     // 通常
    Smile : 1,      // 笑顔
    Damage : 2,     // ダメージ
    Attack : 3,     // 攻撃
    Victory : 4,    // 勝利
    Angry : 5,      // 怒り
    Surprise : 6,   // 驚き
    Sad : 7,        // 悲しみ
    Other1 : 8,     // その他１
    Other2 : 9,     // その他２
}