//-----------------------------------------------------------------------------
// Map_Scene
//
class Map_Scene extends Scene_Base{
    constructor(){
        super();
        this._sceneMessage = Scene_Message.prototype;
        this._sceneMessage.initialize();
        this._waitCount = 0;
        this._encounterEffectDuration = 0;
        this._mapLoaded = false;
        this._resourceData = null;
    
        this._lastDirection = $gamePlayer.direction();
        this._lastBattleState = $gamePlayer._battleState;
        this._lastEnemyEventId = 0;
        this._presenter = new Presenter_Map(this);
    }

    create(){
        this._sceneMessage.create();
        BackGroundManager.resetup();
        this.createEnemy();
        this.createOtherEvent();
        EventManager.resetup();
        super.create();
    }

    setResourceData(resourceData){
        this._resourceData = resourceData;
    }

    isReady(){
        if (this._presenter.isReady()) {
            //this.onMapLoaded();
            this._mapLoaded = true;
            //this.hideMenuPlate(0);
        }
        return this._presenter.isReady() && this._sceneMessage.isReady();
    }

    createDisplayObjects(){
        this.createSpriteset();
        this.createWindowLayer();
    
        this.createBattleStatus();
        this.createRoleSkillSelectWindow();
        this._levelUpText = new Sprite(new Bitmap(Graphics.width,80));
        this.addChild(this._levelUpText);
        this._levelUpText.y = 80;
    }

    createEnemy(){
        this._enemySpirite = new Sprite_Enemy(new Game_Enemy(1,664,400));
        this.addChild(this._enemySpirite);
        this._enemySpirite.opacity = 0;
    }

    createOtherEvent(){
        this._otherSprite = new Sprite(new Bitmap(480,480));
        this.addChild(this._otherSprite);
        this._otherSprite.opacity = 0;
    }

    createBattleStatus(){
        this._battleStatus = new Sprite_BattlerStatus();
        this._battleStatus.setup($gameParty.battleMembers()[0]);
        this.addChild(this._battleStatus);
        this._battleStatus.x = 0;
        this._battleStatus.y = 584;
        this._battleStatus.updateSkillSet();
    }


    createRoleSkillSelectWindow(){
        this._roleSelectWindow = new Window_RoleSkillSelect(320,200,640,320);
        this._roleSelectWindow.setHandler('ok',this.okRoleSelect.bind(this));
        //this._roleSelectWindow.setHandler('cancel',this.cancelRoleSelect.bind(this));
        this.addChild(this._roleSelectWindow);
        this._roleSelectWindow.hide();
    }

    createSpriteset(){
        this._mapSprite = new Sprite_Map();
        this.addChild(this._mapSprite);
    }

    createBackButton(){
        this._backButton = new Sprite_IconButton();
        //this.addChild(this._backButton);
        this._backButton.setup('Menu');
        this._backButton.setClickHandler(() => {
            this.callCommandMenu();
        })
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if(!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
        }
    }

    async start(){
        super.start();
        this.createDisplayObjects();
        
        this._sceneMessage.start();
        SceneManager.clearStack();
        Presenter_Loading.open();
        if (SceneManager._previousClass.name && SceneManager._previousClass.name != "Menu_Scene" || !(Menu_Scene._calledScene instanceof Map_Scene)){
            await this.loading(this.waitResourceLoad.bind(this));
        }
        Presenter_Loading.close();
        this.createAllWindows();
        this.setCommand(MapCommand.Start);
    }

    createAllWindows(){
        this._sceneMessage._windowLayer = this._windowLayer;
        this._sceneMessage.createAllWindows();
    }

    commandStart(needTarnsfer,fadeType,mapPictureName){
        if (needTarnsfer) {
            BackGroundManager.changeBackGroundByTile();
        }
        /*
        if ($gameParty._destinationX != 0 && $gameParty._destinationY != 0){
            $gameTemp.setDestination($gameParty._destinationX, $gameParty._destinationY);
        }
        */
        if (this._keyMapWindow){
            this._keyMapWindow.refresh('map');
        }
        if (mapPictureName != ''){
            EventManager.setLabel(mapPictureName);
            EventManager.showFastMapPicture(mapPictureName);
            this._eventPicture = mapPictureName;
        }
        this.updateFrontSprite();
    }

    enableWeather(enable){
        BackGroundManager.enableWeather(enable);
        EventManager.enableWeather(enable);
    }

    showMapName(mapName){

    }

    waitResourceLoad(){
        return AudioManager.loadedBgmResource(this._resourceData.bgm) && AudioManager.loadedBgsResource(this._resourceData.bgs) && DataManager.isMapLoaded() && Scene_Base.prototype.isReady.call(this);
    }

    update(){
        if (Presenter_Loading.busy()){
            return;
        }
        this.updateMainMultiply();
    
        if (this.isSceneChangeOk()) {
            this.updateScene();
        }
        this.updateWaitCount();
    
        if (this._keyMapWindow){
            this._keyMapWindow.visible = !EventManager.busy();
        }
        super.update();
        this._sceneMessage.update();
    }

    updateMainMultiply(){
        const active = this.isActive();
        $gameMap.update(active);
        $gameTimer.update(active);
        $gameScreen.update();
        if (PopupManager.busy()){
            return;
        }
        if (EventManager.busy()){
            return
        }
        if (EventManager._interpreter._list != null){
            return
        }
        if ($gameMap._interpreter._list != null){
            return;
        }
        if (Popup_Help.busy()){
            return;
        }
        if (this._roleSelectWindow.active){
            return;
        }
        $gamePlayer.update(true);
        this.updateMain();
    }

    updateFrontSprite(){
        const event = $gamePlayer.checkFrontEvent();
        if(event && event.eventType() == EventType.Enemy){
            if (event.eventId() != this._lastEnemyEventId){
                this._enemySpirite.setBattler(event._enemy);
                gsap.to(this._enemySpirite,0.4,{opacity : 255});
                this._lastEnemyEventId = event.eventId();
            }
        } else{
            gsap.to(this._enemySpirite,0.4,{opacity : 0,});
            this._lastEnemyEventId = 0;
        }
        if(event && event.eventType() == EventType.Box){
            this._otherSprite.bitmap = ImageManager.loadPicture('Box');
            this._otherSprite.scale.x = this._otherSprite.scale.y = 1;
            this._otherSprite.x = 504;
            this._otherSprite.y = 144;
            gsap.to(this._otherSprite,0.4,{opacity : 255});
        } else
        if(event && event.eventType() == EventType.Event){
            this._otherSprite.bitmap = ImageManager.loadPicture('Event');
            this._otherSprite.scale.x = this._otherSprite.scale.y = 1;
            this._otherSprite.x = 528;
            this._otherSprite.y = 104;
            gsap.to(this._otherSprite,0.4,{alpha : 0.6});
        } else {
            gsap.to(this._otherSprite,0.4,{alpha : 0,});
        }
    }

    updateMain(){
        if ($gamePlayer.moveSpeed > 4){
            return;
        }
        if ($gamePlayer.checkMoveStraightPlayer()){
            if ($gamePlayer.canPass($gamePlayer.x, $gamePlayer.y, $gamePlayer.direction())) {
                this.setCommand(MapCommand.MovePlayer);
            } else{            
                const event = $gamePlayer.checkFrontEvent();
                if(event && event.eventType() == EventType.Enemy){
                    this.setCommand(MapCommand.Battle);
                } else{
                    gsap.to(this._enemySpirite,0.4,{opacity : 0});
                }
                if(event && event.eventType() == EventType.Box){
                    this.setCommand(MapCommand.Event);
                }
            }
        }
        if (this._lastDirection != $gamePlayer.direction()){
            this.updateFrontSprite();
            this._lastDirection = $gamePlayer.direction();
        }
        if (this._lastBattleState != $gamePlayer._battleState){
            if ($gamePlayer._battleState == true){
                AudioManager.fadeOutBgm(0.8);
                gsap.to(this,0.8,{x:0,onComplete:function(){
                    AudioManager.playBgm($gameBGM.getBgm('battle'));
                }});
                gsap.to(this._mapSprite._minimap._maskGraphic.scale,0.4,{x : 0.75,y:0.75});
                gsap.to(this._mapSprite._minimap._maskGraphic,0.4,{x : 60,y:60});
            } else{
                AudioManager.fadeOutBgm(2);
                gsap.to(this,2,{x:0,onComplete:function(){
                    $gameMap.autoplay();
                }});
                gsap.to(this._mapSprite._minimap._maskGraphic.scale,0.4,{x : 1,y:1});
                gsap.to(this._mapSprite._minimap._maskGraphic,0.4,{x : 0,y:0});
            }
            this._lastBattleState = $gamePlayer._battleState;
        }
        return;
        const destinationEvent = EventManager.checkDestinationEvent($gamePlayer.x,$gamePlayer.y);
        if (destinationEvent != null){
            EventManager.setup(destinationEvent.event);
            return;
        }
        if (event == null){
            this._eventPicture = null;
        } else{
            const charaName = event.characterName();
            if (this._eventPicture != charaName && charaName != ""){
                EventManager.setLabel(charaName);
                EventManager.showMapPicture(charaName);
                TouchInput._pressedTime = 0;
                this._eventPicture = charaName;
            }
        }
    }

    stop(){
        super.stop();
        this._sceneMessage.stop();
    }

    isBusy(){
        return ((this._messageWindow && this._messageWindow.isClosing()) ||
        this._waitCount > 0 || this._encounterEffectDuration > 0 ||
        Scene_Base.prototype.isBusy.call(this) || this._sceneMessage.isBusy());
    }

    updateWaitCount(){
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    isSceneChangeOk(){
        return this.isActive();
    }

    updateScene(){
        if (!SceneManager.isSceneChanging()) {
            this.updateTransferPlayer();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateCallMenu();
        }
    }

    updateTransferPlayer(){
        if ($gamePlayer.isTransferring()) {
            this.terminate();
            SceneManager.goto(Map_Scene);
            //SceneManager._scene = null;
        }
    }

    updateCallMenu(){
        if (this._roleSelectWindow.active){
            return;
        }
        if (this.isMenuEnabled() && !$gamePlayer.isMoving() && !EventManager.busy() && !PopupManager.busy()) {
            if (this.isMenuCalled()) {
                this.callCommandMenu();
            }
            if (this.isSkill1Called()) {
                this.commandSkill1();
            }
            if (this.isSkill2Called()) {
                this.commandSkill2();
            }
        }
    }

    isMenuEnabled(){
        if (!$gameSystem.isMenuEnabled() && $gameTemp.isPlaytest() && !$gameMap.isEventRunning()){
            return true;
        }
        return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
    }

    isMenuCalled(){
        return (TouchInput.isCancelled() || Input.isTriggered('cancel')) && this.commandTriggerEnable();
    }

    isSkill1Called(){
        return (Input.isTriggered('shift')) && this.commandTriggerEnable();
    }

    isSkill2Called(){
        return (Input.isTriggered('menu')) && this.commandTriggerEnable();
    }



    commandTriggerEnable(){
        return (!EventManager.busy() && !Popup_Help.busy() && !PopupManager.busy())
    }

    callCommandMenu(){
        if (!$gameSystem.isMenuEnabled()){
            return;
        }
        if (Presenter_Loading.busy()){
            return;
        }
        if ($gameMap.isEventRunning()){
            return;
        }
        this.setCommand(MapCommand.Menu);
    }

    commandMenu(){
        SceneManager.snapForBackground();
    }

    commandSkill1(){
        if (Presenter_Loading.busy()){
            return;
        }
        if ($gameMap.isEventRunning()){
            return;
        }
        this.setCommand(MapCommand.Skill1);
        Input.clear();
    }

    commandSkill2(){
        if (Presenter_Loading.busy()){
            return;
        }
        if ($gameMap.isEventRunning()){
            return;
        }
        this.setCommand(MapCommand.Skill2);
        Input.clear();
    }

    callCommandSave(){
        this.setCommand(MapCommand.Save);
    }

    commandSave(){
        if (this._keyMapWindow){
            this._keyMapWindow.hide();
        }
        SceneManager.snapForBackground();
        SoundManager.playCancel();
    }

    fadeInForTransfer(fadeType){
        /*
        switch (fadeType) {
            case 0: case 1:
                this.startFadeIn(this.fadeSpeed(), fadeType === 1);
                break;
            }
            */
    }

    launchBattle(){
        //this.startEncounterEffect();
    }

    startEncounterEffect(){
        this._encounterEffectDuration = this.encounterEffectSpeed();
    }

    updateEncounterEffect(){
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
        }
    }

    encounterEffectSpeed(){
        return 4;
    }

    updateTouchEvent(){
        return;
    }

    updateStatus(){
        this._battleStatus.refreshStatus();
        this._enemySpirite.refreshStatus();
    }

    effectStart(animationId){
        EventManager.showEffekseer(animationId,640,320,1,1);
    }

    effectDamage(value){
        const damageSprite = this._enemySpirite.setDamagePopup("hpDamage",value,1);
        this._enemySpirite.addChild(damageSprite);
    }

    commandLevelUp(role,value){
        this._levelUpText.show();
        this.updateLevelUpText(value);
        this._roleSelectWindow.setData(role);
        this._roleSelectWindow.show();
        this._roleSelectWindow.activate();
        this._roleSelectWindow.opacity = 255;
    }

    okRoleSelect(){
        const item = this._roleSelectWindow.item();
        this.setCommand(MapCommand.CheckPoint);
    }

    nextCheckPoint(role,value){
        this.updateLevelUpText(value);
        this._roleSelectWindow.setData(role);
        this._roleSelectWindow.activate();
    }
    
    commandCheckPoint(role){
        this.updateLevelUpText(0);
        this._roleSelectWindow.setData(role);
        const mainText = "確定？";
        const subText = "";
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{subText:subText, select:0});
        _popup.setHandler(text1,'ok',() => {
            this.setCommand(MapCommand.DesideLevelUp);
            this._roleSelectWindow.deactivate();
            this._roleSelectWindow.hide();
            this._levelUpText.hide();
        });
        _popup.setHandler(text2,'cancel',() => {
            this.setCommand(MapCommand.ResetLevelUp);
        });
        _popup.open();
    }

    updateLevelUpText(value){
        this._levelUpText.bitmap.clear();
        const _text = "残りポイント：" + value;
        this._levelUpText.bitmap.drawText("成長させる技能を選択してください",0,0,Graphics.width,40,"center");
        this._levelUpText.bitmap.drawText(_text,0,40,Graphics.width,40,"center");
    }

    terminate(){
        super.terminate();
        this._sceneMessage.terminate();
        if (this._keyMapWindow){
            this._keyMapWindow.terminate();
        }
        this._keyMapWindow = null;
        if (this._mapSprite){
            this._mapSprite.terminate();
        }
        this._mapSprite = null;
        
        delete this._presenter;
        this._presenter = null;
        EventManager.remove();
        BackGroundManager.remove();
        TipsManager.remove();
        if (!SceneManager._nextScene instanceof Map_Scene){
            this.destroy();
        }
    }
}

const MapCommand = {
    Menu : 0,
    Save : 1,
    SwapOrder : 3,
    Start : 4,

    
    MovePlayer : 11,
    Battle : 12,
    Skill1 : 13,
    SKill2 : 14,
    Event : 15,
    CheckPoint : 16,
    LevelUp : 17,
    DesideLevelUp : 18,
    ResetLevelUp : 19
}