class View_Event {
    constructor() {
        this._layer = new Sprite();
        this.createSpritePictureLayer();
        this.createMapEventPicture();
        this.createWeather();
        this.createFadeSprite();
        //this.createMessageWindow();
        this.createTransFadeSprite();
        this.createFlashSprite();
        this.createAutoSprite();
        this.createMessageCursorSprite();
        this._eventMessageWindow = [];
    }

    get layer(){
        return this._layer;
    }

    resetup(){
        this._scene = SceneManager._scene;
        this._scene.addChild(this._layer);
    }

    pause(){
        this._messageWindow.setSkipBusyMode(true);
        this._eventMessageWindow.forEach(message => {
            message.setSkipBusyMode(true);
        });
        this._spritePictureLayer.children.forEach(sprite => {
            sprite.pause();
        });
        this.pauseWeather();
    }

    resume(){
        this._messageWindow.setSkipBusyMode(false);
        this._eventMessageWindow.forEach(message => {
            message.setSkipBusyMode(false);
        });
        this._spritePictureLayer.children.forEach(sprite => {
            sprite.resume();
        });
        this.resumeWeather();
    }

    createSpritePictureLayer(){
        this._spritePictureLayer = new Sprite();
        this._layer.addChild(this._spritePictureLayer);
    }

    getEventPicture(labelName){
        return _.find(this._spritePictureLayer.children,(p) => p && p._pictureLabel == labelName);
    }

    showPicture(labelName,fileName,x,y,z,scaleX,scaleY,opacity,blendmode){
        let eventPicture = this.getEventPicture(labelName);
        if (!eventPicture){
            eventPicture = new Sprite_EventPicture();
            eventPicture.setup(fileName,x,y,z);
            this._spritePictureLayer.addChild(eventPicture);
        } else{
            eventPicture.setup(labelName,x,y,eventPicture._z);
        }
        eventPicture.opacity = opacity;
        eventPicture.setScale(scaleX*0.01,scaleY*0.01);
        if (blendmode){
            eventPicture._mainSprite._blendMode = blendmode;
        }
        console.error(this._spritePictureLayer.children)
    }

    movePicture(label,x, y, z, scaleX,scaleY, opacity,duration,delay){
        const sprite = this.getEventPicture(label);
        if (sprite){
            sprite._z = z;
            this._spritePictureLayer.children = _.sortBy(this._spritePictureLayer.children,(picture) => picture._z);
            sprite.move(x, y,scaleX,scaleY,opacity,duration,delay);
        }
    }

    changePictureFace(fileName,index){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            sprite.setFace(index);
        }
    }

    startMessagePoint(fileName,name){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            sprite.startMessagePoint(name);
        }
    }

    stopMessagePoint(){
        this._spritePictureLayer.children.forEach(sprite => {
            sprite.stopMessagePoint();
        });
    }

    fadeoutPictures(){
        this._spritePictureLayer.children.forEach(child => {
            child.fadeOut(1);
        });
    }

    fadeoutMapPictures(){
        this._mapEventPicture.fadeOut(0.5);
    }

    anglePicture(label,duration,angle){
        const sprite = this.getEventPicture(label);
        if (sprite){
            const rotate = angle * ( Math.PI / 180 );
            gsap.to(sprite, duration, {rotation:rotate});
        }
    }

    angleReset(label,duration){
        const sprite = this.getEventPicture(label);
        if (sprite){
            gsap.to(sprite, duration, {rotation:0});
        }
    }

    setPictureEmotion(label,index){
        const sprite = this.getEventPicture(label);
        if (sprite){
            sprite.setEmotion(index);
        }
    }

    walkPicture(label,repeat,x,duration,opacity,scale){
        const sprite = this.getEventPicture(label);
        if (sprite){
            sprite.walk(repeat,x,duration,opacity,scale);
        }
    }

    walkPictureX(label,repeat,x,duration){
        const sprite = this.getEventPicture(label);
        if (sprite){
            sprite.walkX(repeat,x,duration);
        }
    }

    walkStop(label,duration,endAction){
        const sprite = this.getEventPicture(label);
        if (sprite){
            sprite.walkStopPicture(duration,endAction);
        }
    }

    flipPicture(label,duration){
        const sprite = this.getEventPicture(label);
        if (sprite){
            sprite.flip(duration);
        }
    }

    stopPicture(label){
        const sprite = this.getEventPicture(label);
        if (sprite){
            sprite.stopAnime();
        }
    }
    
    createCopyPicture(label,fileName){
        let sprite = this.getEventPicture(label);
        if (sprite){
            let copysprite = new Sprite_EventPicture();
            copysprite.setup(sprite._pictureLabel,sprite.x,sprite.y,sprite._z);
            copysprite.opacity = sprite.opacity;
            this._spritePictureLayer.addChild(copysprite);
            copysprite._pictureLabel = fileName;
        }
    }
    
    createCopyEnemy(label,fileName){
        let sprite = this.getEventPicture(label);
        if (sprite){
            let copysprite = new Sprite_EventPicture();
            copysprite.setup(sprite._pictureLabel,sprite.x,sprite.y,sprite._z);
            copysprite.opacity = sprite.opacity;
            copysprite.setEnemyPicture();
            this._spritePictureLayer.addChild(copysprite);
            copysprite._pictureLabel = fileName;
        }
    }

    setSpriteHue(label,hue){
        let sprite = this.getEventPicture(label);
        if (sprite){
            sprite.setHue(hue);
        }
    }


    setBattlePicture(label,x,y,opacity){
        let sprite = this.getEventPicture(label);
        if (sprite){
            return;
        }
        sprite = new Sprite_EventPicture();
        sprite.setup(label);
        sprite.setBattleback1();
        if (x !== undefined){
            sprite.x = x;
        }
        if (y !== undefined){
            sprite.y = y;
        }
        if (opacity !== undefined){
            sprite.opacity = opacity;
        }
        this._spritePictureLayer.addChild(sprite);
    }

    setEnemyPicture(label,x,y,opacity){
        let sprite = this.getEventPicture(label);
        if (sprite){
            return;
        }
        sprite = new Sprite_EventPicture();
        sprite.setup(label);
        sprite.setEnemyPicture();
        sprite.x = x;
        sprite.y = y;
        if (opacity)
        sprite.opacity = opacity;
        this._spritePictureLayer.addChild(sprite);
    }

    setTextPicture(label,x,y,opacity,vertical,flat){
        let sprite = this.getEventPicture(label);
        if (sprite){
            return;
        }
        sprite = new Sprite_EventPicture();
        sprite.setup(label);
        sprite.setTextPicture(label,vertical,flat);
        sprite.x = x;
        sprite.y = y;
        sprite._z = this._spritePictureLayer.children.length;
        sprite.opacity = 0;
        this._spritePictureLayer.addChild(sprite);
        this._spritePictureLayer.children = _.sortBy(this._spritePictureLayer.children,(picture) => picture._z);
    }

    pauseAnim(label){
        let sprite = this.getEventPicture(label);
        if (sprite){
            sprite.pauseAnim();
        }
    }

    playAnim(label){
        let sprite = this.getEventPicture(label);
        if (sprite){
            sprite.playAnim();
        }
    }

    walkFast(label){
        let sprite = this.getEventPicture(label);
        if (sprite){
            sprite.walkFast();
        }
    }

    eventFilterSet(){
        this._spritePictureLayer.children.forEach(sprite => {
            sprite.pauseAnim();
            sprite.filterEventAdd();
        });
    }

    eventFilterStart(){
        this._spritePictureLayer.children.forEach(sprite => {
            sprite.playAnim();
            sprite.filterEventStart();
        });
    }

    eventFilterEnd(){
        this._spritePictureLayer.children.forEach(sprite => {
            sprite.filterEventRemove();
        });
    }

    shadowOn(label,onlyShadow,distance,rotation,alpha){
        const sprite = this.getEventPicture(label);
        if (sprite){
            sprite.shadowOn(onlyShadow,distance,rotation,alpha);
        }
    }

    shadowOff(label){
        const sprite = this.getEventPicture(label);
        if (sprite){
            sprite.filterShadowRemove();
        }
    }

    setAnchor(label,x,y){
        let sprite = this.getEventPicture(label);
        if (sprite){
            sprite.setAnchor(x,y);
        }
    }

    windAnime(label,duration,rotation){
        let sprite = this.getEventPicture(label);
        if (sprite){
            sprite.windAnime(duration,rotation);
        }

    }

    createMapEventPicture(){
        this._mapEventPicture = new Sprite_EventPicture("");
        this._spritePictureLayer.addChild(this._mapEventPicture);
    }

    showMapPicture(fileName){
        this._mapEventPicture.setup(fileName,Graphics.width / 2,376,1);
        this._mapEventPicture.fadeOut(0);
        this._mapEventPicture.fadeIn(0.5,0.2);
    }

    showFastMapPicture(fileName){
        this._mapEventPicture.setup(fileName,Graphics.width / 2,376,1);
        this._mapEventPicture.fadeIn(0);
    }


    resetMapPicture(){
        this._mapEventPicture.resetMapPicture();
    }

    clearPictures(){
        let length = this._spritePictureLayer.children.length - 1;
        for (let i = length; i >= 0; i--){
            if (this._mapEventPicture != this._spritePictureLayer.children[i]){
                this._spritePictureLayer.children[i].terminate();
            }
        }
        
        this._spritePictureLayer.children = [];
        this._spritePictureLayer.addChild(this._mapEventPicture);
        this.resetMapPicture();
        this.messageClear();
    }

    createWeather(){
        this._weather = new PIXI.Graphics();
        this._weather.x = Graphics.width / 2;
        this._weather.y = Graphics.height / 2;
        this._layer.addChild(this._weather);
        this._partcle = new Sprite_Particle();
        this._layer.addChild(this._partcle);
    }

    createFadeSprite(){
        this._fadeSprite = new ScreenSprite();
        this._layer.addChild(this._fadeSprite);
        this._fadeSprite.setBlack();
    }

    startFade(duration,opacity){
        gsap.to(this._fadeSprite,duration / 60,{opacity:opacity});
    }

    //createMessageWindow(){
        //const rect = this.messageWindowRect();
        //this._messageWindow = new Window_Message(rect);
        //this._layer.addChild(this._messageWindow);
        //this._messageWindow.deactivate();
    //}

    messageWindowRect(){
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    }

    getEventMessage(sprite){
        return _.find(this._eventMessageWindow,(e) => e._sprite._pictureLabel == sprite._pictureLabel);
    }


    setMessageAssign(fileName,isAssign){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            let message = this.getEventMessage(sprite);
            if (!message){
                message = new Window_EventMessage();
                message.setSprite(sprite);
                this._layer.addChild(message);
                this._eventMessageWindow.push(message); 
            }
            if (message){
                message.setMessageAssign(isAssign);
            }
        }
    }

    setMessagePosition(fileName,x,y){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            let message = this.getEventMessage(sprite);
            if (!message){
                message = new Window_EventMessage();
                message.setSprite(sprite);
                this._layer.addChild(message);
                this._eventMessageWindow.push(message); 
            }
            message.setMessagePosition(x,y);
        }
    }
    
    setNormalMessage(){
        this._messageWindow.activate();
    }

    messageClear(){
        this._messageWindow.terminateMessage();
        this._messageWindow.pause = false;
        this._messageWindow.setSkipBusyMode(false);
        this._messageWindow._textState = null;
        this._eventMessageWindow.forEach(message => {
            message.close();
            message.terminate();
        });
        this._eventMessageWindow = [];
    }

    createTransFadeSprite(){
        this._transfadeSprite = new Sprite_TransFade();
        this._transfadeSprite.bitmap = ImageManager.loadSystem("Fade");
        this._transfadeSprite.x = 1280;
        this._transfadeSprite.scale.x = 2;
        this._transfadeSprite.scale.y = 3;
        this._transfadeSprite.opacity = 224;
        this._transfadeSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this._layer.addChild(this._transfadeSprite);
    }

    transLeft(speedRate){
        this._transfadeSprite.transLeft(speedRate);
    }

    transRight(speedRate){
        this._transfadeSprite.transRight(speedRate);
    }

    createFlashSprite(){
        this._flashSprite = new ScreenSprite();
        this._layer.addChild(this._flashSprite);
    }

    startFlash(duration,color){
        this._flashSprite.setColor(color[0], color[1], color[2]);
        gsap.to(this._flashSprite,duration / 60 / 2,{opacity:color[3]});
        gsap.to(this._flashSprite,duration / 60 / 2,{delay:duration / 60 / 2,opacity:0});
    }

    showAnimation(id,x,y,scaleX,scaleY,noSoundFlag){
        if (x === undefined){
            x = 0;
        }
        if (y === undefined){
            y = 0;
        }
        if (scaleX === undefined){
            scaleX = 1.0;
        }
        if (scaleY === undefined){
            scaleY = 1.0;
        }
        if (noSoundFlag === undefined){
            noSoundFlag = false;
        }
        let anim = new Sprite_AnimationMV();
        if (x != undefined && y != undefined){
            let animation = new Sprite();
            this._layer.addChild(animation);
            animation.x = x;
            animation.y = y;
            animation.scale.x = scaleX;
            animation.scale.y = scaleY;
            anim.setup(animation, $dataAnimationsMv[id], false, 0 ,noSoundFlag);
            animation.addChild(anim);
            gsap.to(anim,$dataAnimationsMv[id].frames.length * 4 / 60,{onComplete:() => {
                animation.removeChild(anim);
                this._layer.removeChild(animation);
                animation.destroy();
            }})
        } else{
            anim.setup(this._layer, $dataAnimations[id], false, 0);
            this._layer.addChild(anim);
            gsap.to(anim,$dataAnimations[id].frames.length * 4 / 60,{onComplete:() => {
                this._layer.removeChild(anim);
            }})
        }
    }

    showEffekseer(id,x,y,scaleX,scaleY){
        if (x === undefined){
            x = 0;
        }
        if (y === undefined){
            y = 0;
        }
        if (scaleX === undefined){
            scaleX = 1.0;
        }
        if (scaleY === undefined){
            scaleY = 1.0;
        }
        let sprite = new Sprite_Animation();
        let target = new Sprite();
        target.x = x;
        this._layer.addChild(target);
        const animation = $dataAnimations[id];
        sprite.targetObjects = target;
        sprite.setup([target], animation, false, 0, null);
        this._layer.addChild(sprite);
        target.getCenterY = function(){
            return y;
        };
    }

    startBossCollapseAnimation(x,y){
    }

    setEaseMode(fileName,isEase){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            sprite.setEaseMode(isEase);
        }
    }

    createAutoSprite(){
        this._eventMenuSprite = new Sprite_EventMenu();
        this._eventMenuSprite.setAction(EventMenuButton.Auto, this.commandEventAuto.bind(this));
        this._eventMenuSprite.setAction(EventMenuButton.Skip, this.commandEventSkip.bind(this));
        this._eventMenuSprite.setAction(EventMenuButton.Log, this.commandEventLog.bind(this));
        this._eventMenuSprite.setAction(EventMenuButton.Display, this.commandEventDisplay.bind(this));
        this._layer.addChild(this._eventMenuSprite);
        this.hideEventMenu();
    }

    createMessageCursorSprite(){
        const sx = 144;
        const sy = 96;
        const p = 24;
        this._messageCursor = new Sprite();
        this._messageCursor.bitmap = ImageManager.loadSystem('Window');
        this._messageCursor.anchor.x = 0.5;
        this._messageCursor.anchor.y = 1;
        this._messageCursor.x = Graphics.width - 36;
        this._messageCursor.y = Graphics.height - 32;
        this._messageCursor.setFrame(sx, sy, p, p);
        this._messageCursor.alpha = 1;
        this._messageanim = new TimelineMax();
        this._messageanim.set(this._messageCursor,{
            alpha :0,
        }).to(this._messageCursor,0.4,{
            alpha :0,
        }).to(this._messageCursor,0.4,{
            alpha :1,
            y : Graphics.height - 24
        }).to(this._messageCursor,0.8,{
            alpha :0,
            y : Graphics.height - 16
        })
        this._messageanim.repeat(-1);
        this._messageanim.pause();
        this._messageCursor.visible = false;
        this._layer.addChild(this._messageCursor);
    }

    showMessageCursor(){
        this._messageanim.resume();
        this._messageanim.seek("-=1.5");
        this._messageCursor.visible = true;
    }

    hideMessageCursor(){
        this._messageanim.pause();
        this._messageCursor.visible = false;
    }

    commandEventAuto(){
        $gameSystem._autoMode = $gameSystem._autoMode == true ? false : true;
        if ($gameSystem._autoMode){
            this._eventMenuSprite.showAutoButton();
        } else{
            this._eventMenuSprite.hideAutoButton();
        }
    }

    commandEventSkip(){
        EventManager.callSkip();
    }

    commandEventLog(){
        EventManager.onLogOpen();
    }

    commandEventDisplay(){
        EventManager.onDisplay();
    }

    showEventMenu(){
        if ($gameSystem._autoMode){
            this._eventMenuSprite.showAutoButton();
        } else{
            this._eventMenuSprite.hideAutoButton();
        }
        this._eventMenuSprite.visible = true;
    }

    hideEventMenu(){
        this._eventMenuSprite.visible = false;
    }

    eventMenuSprite(){
        return this._eventMenuSprite;
    }

    choiseMessageIndex (){
        return this._messageWindow._choiceListWindow.index();
    }

    skipQuiz(){
        this._messageWindow._choiceListWindow.callOkHandler();
    }

    async setWeather (type,x,y,start) {
        let ext = {}
        if (x != null && y != null) {
            ext = {pos:{x:x,y:y}};
        }
        await this._partcle.setup(this._weather,type,ext,start);
    }

    clearWeather () {
        this._partcle.clear();
    }

    setFootSound (fileName,sound){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            sprite.setFootSound(sound);
        }
    }

    update(){
        if (this._layer == null){
            return
        }
        this.updateShake();
    }

    updateShake(){
        this._layer.y = Math.round($gameScreen.shake());
    }

    enableWeather(enable){
        if (DataManager.isEventTest()){
            enable = true;
        }
        if (enable){
            if (this._weather.parent == null){
                this._layer.addChildAt(this._weather,2);
            }
        } else {
            if (this._weather.parent != null){
                this._layer.removeChild(this._weather);
            }
        }
    }

    stageTitle(no,x,y){
        let sprite = new Sprite_StageTitle();
        sprite.x = x;
        sprite.y = y;
        let stage = DataManager.getStageInfos(no);
        sprite.setup(no,TextManager.getText(stage.nameId));
        this._layer.addChild(sprite);
    }

    showMapName(text){
        let sprite = new Sprite_MapName();
        this._layer.addChild(sprite);
        sprite.start(text);
    }

    hideStageTitle(){
        this._layer.children.forEach(sprite => {
            if (sprite instanceof Sprite_StageTitle){
                gsap.killTweensOf(sprite);
                sprite.terminate();
            }
        });
    }

    changeActorFace(fileName,index){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            sprite.setFace(index);
        }
    }

    resetScale(fileName){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            sprite.resetScale();
        }
    }

    resetPosition(fileName){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            sprite.resetPosition();
        }
    }

    exit(){
        this.stopMessagePoint();
        this._spritePictureLayer.children.forEach(sprite => {
            sprite.setEmotion(11);
        });
        // 選択肢アリのウィンドウを消す
        this.closeChioceWindow();
    }

    showJingle(){
    }

    showNextStage(title,endCall){
        let sprite = new Sprite_NextStage(title,endCall);
        this._layer.addChild(sprite);
        sprite.start();
    }

    pauseWeather(){
        this._partcle.pause();
    }

    resumeWeather(){
        this._partcle.resume();
    }

    setTimeLine(x){
        if (this._timeLine == null){
            this._timeLine = new Sprite_TimeLine();
            this._layer.addChild(this._timeLine);
        }
        this._timeLine.setup(x);
    }

    endTimeLine(){
        if (this._timeLine != null){
            this._timeLine.endTimeLine();
            this._timeLine = null;
        }
    }

    setCrystal(fileName,x,y){
        if (this._crystal == null){
            this._crystal = new Sprite_Crystal();
            const index = _.findIndex(this._layer.children,(child) => child == this._fadeSprite);
            this._layer.addChildAt(this._crystal,index);
        }
        this._crystal.setup(fileName,x,y);
    }

    moveCrystal(duration,x,y){
        if (this._crystal != null){
            this._crystal.moveCrystal(duration,x,y);
        }
    }
    
    endCrystal(){
        if (this._crystal != null){
            this._crystal.endCrystal(() => {
                this._crystal = null;
            });
        }
    }

    tintPicture(fileName,color){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            sprite.setBlendColor(color);
        }
    }

    closeChioceWindow(){
        this._messageWindow.closeChioceWindow();
    }

    setTypeSoundEnable(fileName,enable){
        const sprite = this.getEventPicture(fileName);
        if (sprite){
            let message = this.getEventMessage(sprite);
            if (!message){
                message = new Window_EventMessage();
                message.setSprite(sprite);
                this._layer.addChild(message);
                this._eventMessageWindow.push(message); 
            }
            message.setTypeSoundEnable(enable);
        }
    }

    endRollCredit(no,x,y,onlyOnes,noIndent){
        let sprite = new Sprite_EndRollCredit();
        sprite.x = x;
        sprite.y = y;
        sprite.setup(no,onlyOnes,noIndent);
        this._layer.addChild(sprite);
    }
}