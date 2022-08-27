//-----------------------------------------------------------------------------
// Stage_Scene
//

class Stage_Scene extends Scene_Base {
    constructor(){
        super();
        this._encounterEffectDuration = 0;
        this._resourceData = null;
        this._presenter = new Presenter_Stage(this);
        this._waitCount = 0;
        if (DataManager.autoSaveGame()) {
            DataManager.autoSaveSuccess();
        }
    }

    setResourceData(resourceData){
        this._resourceData = resourceData;
    }

    waitResourceLoad(){
        return AudioManager.loadedBgmResource(this._resourceData.bgm) && super.isReady();
    }

    async start(){
        BackGroundManager.setStageMode();
        BackGroundManager.resetup();
        super.start();
    
        Presenter_Loading.open();
        if (SceneManager._previousClass.name && SceneManager._previousClass.name == "Terminal_Scene"){
            await this.loading(this.waitResourceLoad.bind(this));
        }
        if (SceneManager._previousClass.name && SceneManager._previousClass.name == "Map_Scene"){
            await this.loading(this.waitResourceLoad.bind(this));
        }
        if (SceneManager._previousClass.name && SceneManager._previousClass.name == "Load_Scene"){
            await this.loading(this.waitResourceLoad.bind(this));
        }
        Presenter_Loading.close();
        BackGroundManager.zoom(0.25,1,1);
        this.createDisplayObjects();
        EventManager.resetup();
        
        BackGroundManager.enableWeather(true);
        EventManager.enableWeather(true);
        TipsManager.setTips();
    
        this.setCommand(StageCommand.Start);
    }

    update(){
        if (Presenter_Loading.busy()){
            return;
        }
        if (this.isSceneChangeOk()) {
            this.updateScene();
        }
        $gameScreen.update();
        super.update();
    }

    showStageInfo(action){
        PopupStageInfoManager.popupStageInfo(() => {
            if (action) {action()};
        } );
    }

    showUiView(){
        this._spriteset.showActorSprites();
        this._progressWindow.show();
        this._keyMapWindow.show();
        if (this._dockMenu) this._dockMenu.show();
    }

    hideUiView(){
        this._spriteset.hideActorSprites();
        this._progressWindow.hide();
        this._keyMapWindow.hide();
        if (this._dockMenu) this._dockMenu.hide();
    }

    isBusy(){
        return ((this._messageWindow && this._messageWindow.isClosing()) ||
        this._encounterEffectDuration > 0 ||
        super.isBusy());
    }

    isSceneChangeOk(){
        return this.isActive();
    }

    updateScene(){
        if (!SceneManager.isSceneChanging()) {
            this.updateInputMethod();
            this.updateWaitCount();
        }
        const visible = EventManager.busy();
        if (this._backButton){
            this._backButton.visible = !visible;
            this._menuPlate.visible = !visible;
            this._menuSprite.visible = !visible;
            if (this._battleSkipSprite) this._battleSkipSprite.visible = !visible;
            if (visible){
                this.hideUiView();
            } else{
                this.showUiView();
            }
        }
    }

    updateInputMethod(){
        if (this.isMenuCalled()) {
            this.commandMenu();
        } else
        if (this.isSaveCalled()) {
            this.commandSave();
        } else
        if (this.isStageInfoCalled()) {
            this.commandStageInfo();
        } else
        if (this.isSeeking()) {
            this.commandSeeking();
        }
    }

    createDisplayObjects(){
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
        this.createMenuButton();
        this.createBackButton();
        this.createMenuSprite();
        this.setMenuSprite(TextManager.getText(DataManager.getStageInfos($gameParty._stageNo).nameId));
    
        this.createStageButton();
        this.createKeyMapWindow();
        this.createFeatureWindow();
        this.createBattleSkipSprite();
        if($gameDefine.mobileMode == true){
            this.createStageDockButton();
        }
    }

    createBackButton(){
        this._backButton = new Sprite_IconButton();
        this.addChild(this._backButton);
        this._backButton.setup('Menu');
        this._backButton.x = 0;
        this._backButton.y = 0;
        this._backButton.setClickHandler(() => {
            this.commandMenu();
        });
    }

    createStageButton(){
        this._stageButton = new Sprite_Button();
        this.addChild(this._stageButton);
        this._stageButton.x = 0;
        this._stageButton.y = 80;
        this._stageButton.setColdFrame(0,0,960,280);
        this._stageButton.setClickHandler(this.commandSeeking.bind(this));
    }

    commandStagePhase(){
        this._progressWindow.refresh();
        //TipsManager.close();
        TipsManager.setTips();
        AudioManager.playSe($gamePlayer._stepSound);
        EventManager.moveActors(8);
        //時間係数
        const speedRate = 4.0 / $gamePlayer.moveSpeed();
        BackGroundManager.moveFrontStage(speedRate);
    }

    createSpriteset(){
        this._spriteset = new Spriteset_Stage();
        this.addChild(this._spriteset);
    }

    refreshSpriteSet(){
        let pageIndex = 0;
        if (this._spriteset){
            this.children.forEach((element,index) => {
                if (element == this._spriteset){
                    pageIndex = index;
                }
            });
            this.removeChild(this._spriteset);
            this._spriteset.terminate();
            this._spriteset = null;
        }
        this._spriteset = new Spriteset_Stage();
        this.addChildAt(this._spriteset,pageIndex);
    }

    createAllWindows(){
        this.createActorWindow()
        this.createProgressWindow();
    }

    createActorWindow(){
        this._actorWindow = new Window_BattleActor(0,400);
        this.addWindow(this._actorWindow);
    }

    createProgressWindow(){
        this._progressWindow = new Window_Progress();
        this.addChild(this._progressWindow);
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh("stage");
        }
    }

    createFeatureWindow(){
        this._featureWindow = new Window_FeatureList(80,96,640, 384);
        this.addChild(this._featureWindow);
    }

    createBattleSkipSprite(){
        if ($dataOption.getUserData("battleSkipMode") === BattleSkipMode.Skip){
            this._battleSkipSprite = new Sprite(new Bitmap(240,28));
            let _battleSkipSprite = this._battleSkipSprite;
            _battleSkipSprite.x = 720;
            _battleSkipSprite.y = 368;
            _battleSkipSprite.opacity = 0;
            _battleSkipSprite.bitmap.fontSize = 21;
            _battleSkipSprite.bitmap.drawText(TextManager.getText(400400),0,0,240,28);
            gsap.to(_battleSkipSprite,0.8,{opacity:255, repeat:-1,yoyo:true});
            this.addChild(_battleSkipSprite);
        }
    }

    createStageDockButton(){
        this._dockMenu = new Sprite_StageDock();
        this.addChild(this._dockMenu);
    }

    setDragHandler(handler){
        this._spriteset.setDragHandler(handler);
    }

    commandFeature(feature,x,y){
        this._featureWindow.show();
        this._featureWindow.open();
        this._featureWindow.refresh(feature,x,y);
    }

    clearFeature(){
        this._featureWindow.close();
    }

    isMenuCalled(){
        return TouchInput.isCancelled() || Input.isTriggered('cancel');
    }

    isSaveCalled(){
        return Input.isTriggered('shift');
    }

    isStageInfoCalled(){
        return Input.isTriggered('menu');
    }

    isSeeking(){
        return (TouchInput.isRepeated() && TouchInput.y > 120 && TouchInput.y < 400) || Input.isTriggered('ok') || Input.isTriggered('up') || Input.isRepeated('ok') || Input.isRepeated('up');
    }

    commandMenu(){
        if (Presenter_Loading.busy()){
            return;
        }
        this.setCommand(StageCommand.Menu);
    }

    commandSave(){
        this.setCommand(StageCommand.Save);
    }

    commandStageInfo(){
        this.setCommand(StageCommand.StageInfo);
    }

    commandSeeking(){
        this.setCommand(StageCommand.Seeking);
    }

    updateWaitCount(){
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    updateTouchEvent(){
        return;
    }

    commandStageStart(endCall){
        const mainText = TextManager.getText(400100);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:1});
        _popup.setHandler(text1,'ok',() => {
            if (endCall) endCall();
        });
        _popup.setHandler(text2,'cancel',null);
        _popup.open();
    }

    showBattleAnimation(okAction){
        this._waitCount = 90;
        SoundManager.playBattleStart();
        FilterMzUtility.addFilter(FilterType.Blur);
        BackGroundManager.zoom(0.5,1.25,1.25);
        gsap.to(this, 0.5, {pixi:{},onComplete:function(){
            FilterMzUtility.removeFilter(FilterType.Blur);
            if (okAction){
                okAction();
            }
        }.bind(this)});
    }

    showReadyAnimation(okAction){
        super.showReadyAnimation(okAction,4);
        this._spriteset.hideActorSprites();
        this._progressWindow.hide();
        this._keyMapWindow.hide();
        if (this._dockMenu) this._dockMenu.hide();
    }

    terminate(){
        super.terminate();
        if (this._spriteset){
            this._spriteset.terminate();
        }
        this._spriteset = null;
        this._stageButton.destroy();
        this._stageButton = null;
        this._keyMapWindow.terminate();
        this._keyMapWindow = null;
        this._progressWindow.terminate();
        this._progressWindow = null;
        this._actorWindow.destroy();
        this._actorWindow = null;
        this._featureWindow.destroy();
        this._featureWindow = null;
        this._presenter = null;
        if (this._battleSkipSprite){
            gsap.killTweensOf(this._battleSkipSprite);
            this._battleSkipSprite.destroy();
            this._battleSkipSprite = null;
        }
        EventManager.remove();
        BackGroundManager.remove();
        TipsManager.remove();
        this.destroy();
    }
}

const StageCommand = {
    Menu : 0,
    Save : 1,
    Start : 2,
    Seeking : 3,
}