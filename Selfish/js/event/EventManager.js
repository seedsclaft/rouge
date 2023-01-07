//-----------------------------------------------------------------------------
// EventManager
//
// The static class that manages event progress.

function EventManager() {
    throw new Error('This is a static class');
}

//シーンブートで作成
EventManager.init = function() {
    this._interpreter = new Game_Interpreter();
    this._model = new Model_Event();
    this._eventView = new View_Event();
    this._label = null;
    this._fastFlag = false;

    this._reserveEvent = [];
    this._reserveEndCall = [];
    this._loading = false;    

    this._bgmLoader = new BgmLoader_Event();
    this._pictureLoader = new PictureLoader_Event();
    this._messageName = {};
    this.destinationEvent = [];

    this._resetValue = null;
    this._nextStageBusy = false;

    this._logSprites = [];
    this._busyLogSprites = [];
    this._waitLogData = [];
    this.createLogSprite();
}

EventManager.createLogSprite = function() {
    for (let i = 0 ; i < 4;i++){
        let sprite = new Sprite(new Bitmap(560,40));
        this._eventView.layer.addChild(sprite);
        this._logSprites.push(sprite);
        sprite.opacity = 0;
    }
}

EventManager.startLogText = function(text) {
    if (this._logSprites.length == 0){
        this._waitLogData.push(text);
        return;
    }
    let _sprite = this._logSprites.shift();
    _sprite.bitmap.clear();
    _sprite.bitmap.fontSize = 21;
    //_sprite.bitmap.gradientFillRect(0,0,560,40,"rgba(40,40,40,0.8)","rgba(40,40,40,0.0)");
    _sprite.bitmap.drawText(text,24,0,360,40);
    _sprite.y = 8;
    gsap.to(_sprite,0.4,{opacity:255});
    if (this._busyLogSprites.length > 0){
        this._busyLogSprites.forEach((element,index) => {
            let idx = this._busyLogSprites.length - index;
            gsap.to(element,0.15,{y:(idx) * 40 + 8});
        });
    }
    this._busyLogSprites.push(_sprite);
    const self = this;
    gsap.to(_sprite,0.4,{delay:4,opacity:0,onComplete:function(){
        self._busyLogSprites = _.without(self._busyLogSprites,_sprite);
        _sprite.y = 8;
        self._logSprites.push(_sprite);
        if (self._waitLogData.length > 0){
            const log = self._waitLogData.shift();
            self.startLogText(log);
        }
    }});
}

//イベントの再生開始
EventManager.setup = async function(eventName,endCall) {
    this._loading = true;
    if (this._interpreter.isRunning()){
        this.setNextEvent(eventName,endCall);
        return;
    }

    await this._model.loadEventFile(eventName).then((event) =>{
        this.start(event);
    });

    this._model.gainCommonEventFlag(eventName);

    if (endCall){
        this._endCall = endCall;
    }
}
//イベントで開始
EventManager.setupEvent = function(event,endCall) {
    this._loading = true;
    this.start(event);
    if (endCall){
        this._endCall = endCall;
    }
}

EventManager.start = async function(event) {
    this._label = null;
    this._messageName = {};
    this._skipEnable = (event.name && !event.name.includes('common'));
    
    this._eventSkip = false;
    if (this._skipEnable && $dataOption.getUserData('messageDockDisplay')){
        this._eventView.showEventMenu();
    } else{
        this._eventView.hideEventMenu();
    }
    this._loading = false;

    if (this._skipEnable){
        Presenter_Loading.open();
    }
    this._interpreter.setup(event.list);
    //this._bgmLoader.setCommand(event.list);
    //this._pictureLoader.setCommand(event.list);
    /*
    if (event && event.name && !event.name.includes('common')){
        await Promise.all(
            [this._bgmLoader.loadBgmFirst(),this._pictureLoader.loadPictureFirst()]
        )
    }
    */
    if (this._skipEnable){
        Presenter_Loading.close();
    }
    // チューリアルを消す
    TutorialManager.clear();
};

//イベントの再生開始
EventManager.setupTest = async function(testData) {
    if (this._interpreter.isRunning()){
        return;
    }
    this._label = null;
    this._eventSkip = false;
    Presenter_Loading.open();
    this._bgmLoader.setCommand(testData);
    this._pictureLoader.setCommand(testData);
    await Promise.all(
        [this._bgmLoader.loadBgmFirst(),this._pictureLoader.loadPictureFirst()]
    )
    Presenter_Loading.close();
    this._eventView.showEventMenu();
    this._skipEnable = true;
    this._interpreter.setup(testData);
}

EventManager.nowEvent = function() {
    if (this._interpreter == null){
        return null;
    }
    if (this._interpreter._list == null || this._interpreter._list.length < 1){
        return null;
    }
    return this._interpreter._list[this._interpreter._index];
}

//止める
EventManager.exit = function() {
    EventManager.hideMessageCursor();
    this._eventView.hideEventMenu();
    this._eventView.messageClear();
    this._eventView.exit();
    this._interpreter._list = null;

    this._model.clearMessageActor();

    if (this._reserveEvent.length > 0){
        this.setup(this._reserveEvent[0],this._reserveEndCall[0]);
        this._reserveEvent.shift();
        this._reserveEndCall.shift();
    }
    if ($gameDefine.mobileMode){
        TouchInput._pressedTime = 0;
    }
    //this._bgmLoader.releaseBgmAll();
    if (this._endCall){
        this._endCall();
        this._endCall = null;
    }

    TouchInput.clear();
    Window_BackLog._lastActorName = "";
    this.eventFilterEnd();
    //console.error("exit");
}

EventManager.setMessagePosition = function(x,y){
    this._eventView.setMessagePosition(this._label,x,y);
}

EventManager.setNextEvent = function(eventName,endcall) {
    this._reserveEvent.push(eventName);
    this._reserveEndCall.push(endcall);
}

//シーンスタートの最後に呼ぶ
EventManager.resetup = function() {
    this._eventView.resetup();
}

EventManager.remove = function() {
    this._scene = SceneManager._scene;
    this._scene.removeChild(this._eventView.layer);
    this._scene = null;
}


// イベントピクチャを取得
EventManager.getEventPicture = function(labelName) {
    return _.find(this._spritePictureLayer.children,(p) => p && p._pictureLabel == labelName);
}

// コマンド：ラベル
EventManager.setLabel = function(label){
    this._label = label;
    if (label == 'End'){
        this._eventSkip = true;
        this._eventView.hideEventMenu();
    }
}

// コマンド：ピクチャ表示
EventManager.showPicture = function(labelName,fileName,x,y,z,scaleX,scaleY,opacity,blendmode) {
    this._eventView.showPicture(labelName,fileName,x,y,z,scaleX,scaleY,opacity,blendmode);
}

EventManager.clearPictures = function() {
    this._eventView.clearPictures();
}

// マップのイベントピクチャを設定
EventManager.showMapPicture = function(fileName) {
    this._eventView.showMapPicture(fileName);
}

EventManager.showFastMapPicture = function(fileName) {
    this._eventView.showFastMapPicture(fileName);
}


EventManager.resetMapPicture = function(){
    this._eventView.resetMapPicture();
}

// イベントピクチャを移動
EventManager.movePicture = function(x, y, z, scaleX,scaleY, opacity,duration,delay) {
    this._eventView.movePicture(this._label,x, y, z, scaleX,scaleY, opacity,duration,delay);
}

// イベントピクチャを一括フェードアウト
EventManager.fadeoutPictures = function() {
    this._eventView.fadeoutPictures();
}

EventManager.fadeoutMapPictures = function() {
    this._eventView.fadeoutMapPictures();
}

// イベントピクチャの顔変更
EventManager.changePictureFace = function(fileName,index) {
    this._eventView.changePictureFace(fileName,index);
}

EventManager.anglePicture = function(duration,angle) {
    this._eventView.anglePicture(this._label,duration,angle);
}

EventManager.angleReset = function(duration) {
    this._eventView.angleReset(this._label,duration);
}

// 吹き出しをセット
EventManager.setPictureEmotion = function(index) {
    this._eventView.setPictureEmotion(this._label,index);
}

EventManager.walkPicture = function(repeat,x,duration,opacity,scale) {
    this._eventView.walkPicture(this._label,repeat,x,duration,opacity,scale); 
}

EventManager.walkPictureX = function(repeat,x,duration) {  
    this._eventView.walkPictureX(this._label,repeat,x,duration); 
}

EventManager.walkStop = function(duration,endAction) {  
    this._eventView.walkStop(this._label,duration,endAction); 
}

EventManager.flipPicture = function(duration) {
    this._eventView.flipPicture(this._label,duration); 
}

EventManager.stopPicture = function() {
    this._eventView.stopPicture(this._label); 
}

EventManager.createCopyPicture = function(num) {
    this._eventView.createCopyPicture(this._label,this._label+ "_"+ num);
}

EventManager.createCopyEnemy = function(num) {
    this._eventView.createCopyEnemy(this._label,this._label+ "_"+ num);
}

EventManager.setSpriteHue = function(hue) {
    this._eventView.setSpriteHue(this._label,hue);
}

EventManager.startFadeIn = function(duration) {
    this._eventView.startFade(duration,0);
}

EventManager.startFadeOut = function(duration) {
    this._eventView.startFade(duration,255);
}

EventManager.startFlash = function(color,duration) {
    this._eventView.startFlash(duration,color);
}

EventManager.busy = function() {
    if (this._loading){
        return true;
    }
    return this._interpreter && this._interpreter.isRunning();
}

EventManager.nextStagebusy = function() {
    return this._nextStageBusy;
}

EventManager.update = function() {
    if (this._interpreter == null){
        return;
    }
    if (this._scene != SceneManager._scene){
        //return;
    }
    if (this._interpreter._list == null){
        return;
    }
    if (PopupManager.busy()){
        return;
    }
    if (this._bgmLoader.busy()){
        return;
    }
    if (this._pictureLoader.busy()){
        return;
    }
    if (this._eventView) this._eventView.update();
    this.updateSkip();
    if (this._interpreter.isRunning() == false) {
        return;
    }
    if (this._interpreter.eventId() > 0) {
        this.unlockEvent(this._interpreter.eventId());
        this._interpreter.clear();
    }
    this._interpreter.update();
};

EventManager.setWeather = async function(type,x,y,start,noSave) {
    if (noSave === undefined){
        noSave = false;
    }
    if (type){
        if (!noSave){
            $gameScreen.changeEventWeather(type);
        }
        if ($dataOption.getUserData("displayEffect") == true){
            await this._eventView.setWeather(type,x,y,start);
        } else{
            await this._eventView.clearWeather();
        }
    }
}

EventManager.clearWeather = function() {
    $gameScreen.clearEventWeather();
    this._eventView.clearWeather();
}

EventManager.clearWeatherLoad = function() {
    this._eventView.clearWeather();
}

EventManager.setStage = async function(num){
}

EventManager.loadStageSequenceData = function(){
    return new Promise(resolve => {
        return DataManager.loadStageSequenceData(resolve);
    });
}


EventManager.callSkip = function() {
    this._callSkip = true;
}

EventManager.onSkip = function() {
    this._callSkip = false;
    const mainText = TextManager.getText(800100);
    const text1 = TextManager.getDecideText();
    const text2 = TextManager.getCancelText();
    
    const _popup = PopupManager;
    _popup.setPopup(mainText,{select:1});
    _popup.setHandler(text1,'ok',() => {   
        this._eventSkip = true;
        let index = _.findIndex(this._interpreter._list,(l) => l.code == 118 && l.parameters[0] == "End" )
        
        this._interpreter._index = index;
        this._eventView.hideEventMenu();
        this.pauseResume(false);
        this._eventView.messageClear();
        this._eventView.closeChioceWindow();
    });
    _popup.setHandler(text2,'cancel',() => {   
        this.pauseResume(false);
    });
    _popup.open();
    
    // メッセージウィンドウを止める
    this.pauseResume(true);
}
EventManager.onEventMenu = function() {
    if (!this._skipEnable){
        return;
    }
    const eventMenu = this._eventView.eventMenuSprite();
    eventMenu.visible = !eventMenu.visible;
}

EventManager.onLogOpen = function() {
    this._onLogOpen = true;
    if (this._backLogWIndow == null){
        this._backLogWIndow = new Window_BackLog(60,-12,840,564);
        this._backLogWIndow.setHandler('ok',  this.onLogClose.bind(this));
        this._backLogWIndow.setHandler('cancel',this.onLogClose.bind(this));

        this._eventView.layer.addChild(this._backLogWIndow);
    }
    if (this._backLogWIndow.parent != null){
        this._eventView.layer.removeChild(this._backLogWIndow);
        this._eventView.layer.addChild(this._backLogWIndow);
    }
    this._backLogWIndow.show();
    this._backLogWIndow.activate();
    this._backLogWIndow.refresh();
    this._backLogWIndow.selectLast();
    this.pauseResume(true);
}
EventManager.onLogClose = function() {
    this._backLogWIndow.hide();
    this._backLogWIndow.deactivate();
    this.pauseResume(false);
    this._onLogOpen = false;
}
EventManager.onDisplay = function() {
    this._onDisplay = true;
    this._eventView.hideEventMenu();
    this.pauseResume(true);
}
EventManager.updateSkip = function() {
    if (this._eventSkip == true){
        return;
    }
    if (!this._skipEnable){
        return;
    }
    if (this._onDisplay){
        if (Input.isTriggered('cancel') || TouchInput.isTriggered()){
            this._onDisplay = false;
            this._eventView.showEventMenu();
            this.pauseResume(false);
        }
        return;
    }
    if (this._onLogOpen){
        if (TouchInput.isTriggered() && (TouchInput.x < 200 || TouchInput.x > 720)){
            this.onLogClose();
        }
        return;
    }
    if (Input.isTriggered('pageup') || this._callSkip){
        this.onSkip();
    } else
    if (Input.isTriggered('pagedown')){
        this.onEventMenu();
        //this.onLogOpen();
    }
};

EventManager.shutdown = function(){
    if ($gameDefine.platForm() == PlatForm.Android || $gameDefine.platForm() == PlatForm.iOS){
        navigator.app.exitApp();
    } else{
        SceneManager.exit();
    }
}


EventManager.showAnimation = function(id,x,y,scaleX,scaleY,noSoundFlag){
    this._eventView.showAnimation(id,x,y,scaleX,scaleY,noSoundFlag);
}

EventManager.showEffekseer = function(id,x,y,scaleX,scaleY){
    this._eventView.showEffekseer(id,x,y,scaleX,scaleY);
}

EventManager.startBossCollapseAnimation = function(x,y){
    this._eventView.startBossCollapseAnimation(x,y);
}

EventManager.setTitleSprite = function(x,y,endCall){
    if (this._titleSprite == null){
        this._titleSprite = new Sprite_Title();
        this._eventView.layer.addChild(this._titleSprite);
    }
    
    this._titleSprite.setup(TextManager.getText(DataManager.getStageInfos($gameParty.stageData().id).nameId),x,y);
    this._titleSprite.start(endCall);
}

EventManager.endTitleSprite = function(){
    this._titleSprite.reset();
}

EventManager.setBattlePicture = function(fileName,x,y,opacity) {
    this._eventView.setBattlePicture(fileName,x,y,opacity);
};

EventManager.setEnemyPicture = function(fileName,x,y,opacity) {
    this._eventView.setEnemyPicture(fileName,x,y,opacity);
};

EventManager.setTextPicture = function(text,x,y,opacity,vertical,flat) {
    this._eventView.setTextPicture(text,x,y,opacity,vertical,flat);
};

EventManager.pauseAnim = function() {
    this._eventView.pauseAnim(this._label);
}

EventManager.playAnim = function() {
    this._eventView.playAnim(this._label);
}

EventManager.walkFast = function(){
    this._eventView.walkFast(this._label);
}

EventManager.pauseResume = function(isResume){
    if (isResume){
        this._eventView.pause();
        BackGroundManager.pause();
    } else{
        this._eventView.resume();
        BackGroundManager.resume();
    }
}

EventManager.eventFilterSet = function() {
    this._eventView.eventFilterSet();
}

EventManager.eventFilterStart = function() {
    this._eventView.eventFilterStart();
}

EventManager.eventFilterEnd = function() {
    this._eventView.eventFilterEnd();
}

EventManager.shadowOn = function(onlyShadow,distance,rotation,alpha) {
    if (onlyShadow === undefined){
        onlyShadow = true;
    }
    if (distance === undefined){
        distance = 0;
    }
    if (rotation === undefined){
        rotation = 0;
    }
    if (alpha === undefined){
        alpha = 0.5;
    }
    this._eventView.shadowOn(this._label,onlyShadow,distance,rotation,alpha);
}

EventManager.shadowOff = function() {
    this._eventView.shadowOff(this._label);
}

EventManager.setAnchor = function(x,y) {
    this._eventView.setAnchor(this._label,x,y);
}

EventManager.windAnime = function(duration,rotation) {
    this._eventView.windAnime(this._label,duration,rotation);
}


EventManager.setMessageAssign = function(isAssign){
    this._eventView.setMessageAssign(this._label,isAssign);
}

EventManager.fadeEventBgm = function() {
    const bgmData = AudioManager._currentBgm;
    if (bgmData != null){
        this._resetValue = bgmData.volume;
        AudioManager.fadeToBgm(1,bgmData.volume,0.7);
    }
}

EventManager.resetEventBgm = function() {
    if (this._resetValue){
        AudioManager.fadeToBgm(1,this._resetValue,1.0);
    }
    this._resetValue = null;
}

EventManager.loadBgm = async function(bgm) {
    if (this.nowEvent()){
        if (!AudioManager.loadedBgmResource([bgm])){
            Presenter_Loading.open();
        }
        await this._bgmLoader.loadBgm(this.nowEvent());
        Presenter_Loading.close();
    }
}

EventManager.setEaseMode = function(isEase) {
    this._eventView.setEaseMode(this._label,isEase);
}

EventManager.allEventFileOutput = function() {
    this._model.allEventFileOutput();
};

EventManager.outputActorsText = function() {
    this._model.outputActorsText();
};

EventManager.setFootSound = function(sound) {  
    this._eventView.setFootSound(this._label,sound); 
}

EventManager.enableWeather = function(enable) {
    this._eventView.enableWeather(enable);
}

EventManager.stageTitle = function(no,x,y) {
    this._eventView.stageTitle(no,x,y);
}

EventManager.showMapName = function(text) {
    if (!text){
        text = $dataMap.displayName;
    }
    this._eventView.showMapName(text);
}

EventManager.changeActorFace = function(index) {
    this._eventView.changeActorFace(this._label,index); 
}

EventManager.setMessageName = function(key, toName) {
    const isEnglish = $dataOption.getUserData('language') == LanguageType.English;
    if (isEnglish){
        const strArray = toName.split("");
        if (strArray[0] == "？"){
            toName = "";
            for (let i = 0;i < strArray.length;i++){
                toName += "?";
            }
        }
    }
    this._messageName[key] = toName;
}

EventManager.resetScale = function(faceName) {
    this._eventView.resetScale(faceName); 
}

EventManager.resetPosition = function(faceName) {
    this._eventView.resetPosition(faceName); 
}

EventManager.showJingle = function() {
    this._eventView.showJingle();
}

EventManager.showNextStage = function(title) {
    this._eventView.showNextStage(title,() => this._nextStageBusy = false);
    this._nextStageBusy = true;
}

EventManager.pauseWeather = function() {
    this._eventView.pauseWeather();
}

EventManager.resumeWeather = function() {
    this._eventView.resumeWeather();
}

EventManager.hideEventMenu = function(){
    this._eventView.hideEventMenu();
}

EventManager.setSkipEnable = function(enable){
    this._skipEnable = enable;
}

EventManager.showMessageCursor = function(){
    this._eventView.showMessageCursor();
}

EventManager.hideMessageCursor = function(){
    this._eventView.hideMessageCursor();
}

EventManager.tintPicture = function(color) {
    this._eventView.tintPicture(this._label,color);
}

EventManager.setTypeSoundEnable = function(enable) {
    this._eventView.setTypeSoundEnable(this._label,enable);
}

EventManager.endRollCredit = function(no,x,y,onlyOnes,noIndent) {
    this._eventView.endRollCredit(no,x,y,onlyOnes,noIndent);
}