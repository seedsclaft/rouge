class Presenter_Stage extends Presenter_Base{
    constructor(view) {
        super();
        this._busy = false;
        this._view = view;
        this._model = new Model_Stage();
        this.setEvent();
        this.start();

    }
    
    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    async start () {
        if (!this._model.isStagePhase()){
            if (!this._model.isBossBefore()){
                //$gameParty.setStageData($gameParty._stageNo);
                //SceneManager.clearStack();
            }
        }
        $gameSystem.setResume("Stage_Scene");
        if ($gameTemp._needDisPlayEffectChange){
            BackGroundManager.setWeather($gameScreen.backGroundWeather());
            EventManager.setWeather($gameScreen.eventWeather());
            $gameTemp._needDisPlayEffectChange = false;
        }
        await this._model.loadStageSequence();

        var resourceData = this._model.loadResourceData();
        this._view.setResourceData(resourceData);
    }
    
    updateCommand(){
        super.updateCommand();
        if (this._busy){
            return;
        }
        if (EventManager.busy()){
            return;
        }
        if (PopupManager.busy()){
            return;
        }
        if (Popup_Help.busy()){
            return;
        }
        if (PopupStageInfoManager.busy()){
            return;
        }
        switch (this._view._command){
            case StageCommand.Menu:
            return this.commandMenu();
            case StageCommand.Save:
            return this.commandSave();
            case StageCommand.StageInfo:
            return this.commandStageInfo();
            case StageCommand.Seeking:
            return this.commandSeeking();
            case StageCommand.Start:
            return this.commandStart();
        }
        this._view.clearCommand();
    }

    commandMenu(){
        if ($gameSystem.isMenuEnabled()){
            SceneManager.snapForBackground();
            SoundManager.playCancel();
            Window_MenuListCommand.initCommandPosition();
            SceneManager.push(Menu_Scene);
        }
    }

    commandSave(){
        if ($gameSystem.isMenuEnabled()){
            SceneManager.snapForBackground();
            SoundManager.playCancel();
            SceneManager.push(Save_Scene);
        }
    }

    commandStageInfo(){
        SoundManager.playOk();
        this._view.showStageInfo(null);
    }

    commandSeeking(){
        if (this._model.isInitPhase()){
            SoundManager.playCancel();
            this._view.commandStageStart(() => {
                TutorialManager.clear();
                this._model.setStagePhase('ready');
                EventManager.setup('common_003');
                this._view.showReadyAnimation(() => {
                    this._model.setStagePhase('stage');
                });
            });
        } else
        if (this._model.isStagePhase() || this._model.isBossBefore()){
            this.stageSeeking();
        }
    }

    async stageSeeking(){
        this._busy = true;
        const bossBeforeEvent = this._model.bossBeforeEvent();
        this._model.gainStepCount(1); 
        var data = this._model.stageEvent();
        this._view.commandStagePhase();
        this.playStageBgm();
        await this.setWait(200);
        if (bossBeforeEvent == true){
            EventManager.setup('common_004',() => {
                TouchInput.clear();
                this._busy = false;
            });
            AudioManager.fadeOutBgm(1);
            this._model.setStagePhase('bossBefore');
            return;
        }
        if (!data && bossBeforeEvent == false){
            this._busy = false;
            return;
        }
        switch (data._type){
            case 'battle':
                if ($dataOption.getUserData('battleSkipMode') === BattleSkipMode.Skip){
                    this._busy = false;
                    return;
                }
                this._view.showBattleAnimation(() => {
                    SceneManager.push(Battle_Scene);
                });
                // 音量を落とす
                const stageBgmData = this._model.stageBgmData();
                AudioManager.fadeToBgm(0.1,stageBgmData.volume,0.7);
                const stageBgsData = this._model.stageBgsData();
                AudioManager.fadeToBgs(0.1,stageBgsData.volume,0.7);
                return;
            case 'bossBefore':
                /*
                EventManager.setup('common_004',() => {
                    this._busy = false;
                });
                AudioManager.fadeOutBgm(1);
                this._model.setStagePhase('bossBefore');
                */
                this._busy = false;
                return;
            case 'boss':
                this._view.hideUiView();
                this._model.loadResourceBossBefore();
                this._model.disableMenu();
                EventManager.setup(this._model.bossAnimation(),() => {
                    this._model.enableMenu();
                    this.commandBossBattle();
                });
                this._model.setStagePhase('save');
                return;
            case 'event':
                const event = this._model.getStageEvent(data._eventId);
                if (event == undefined){
                    this._busy = false;
                    return;
                }
                // スイッチ判定（GUIと逆で対象のスイッチがオンの時はイベントを行わない）
                if (event.conditions && event.conditions.switch1Valid == true){
                    if ($gameSwitches.value( event.conditions.switch1Id ) == true){
                        this._busy = false;
                        return;
                    }
                }
                if (event.list[0].code == 355 && event.list[0].parameters[0].includes('EventManager.setup')){
                    var setupEvent = event.list[0].parameters[0].substring(20,event.list[0].parameters[0].length - 3);
                    EventManager.setup(setupEvent,() => {
                        if (this._view){
                            this._view.refreshSpriteSet();
                            this._view.setDragHandler((sprite) => {this.commandFeature(sprite)});  
                        }
                        this._busy = false;
                    });
                } else{
                    EventManager.setupEvent(event,() => {
                        this._busy = false;
                    });
                }
                return;
            default:
                this._busy = false;
                return;
        }
    }

    commandStart(){
        if (!this._model.readFlag()){
            this._model.setReadFlag(true);
            this._busy = true;
            EventManager.setup('common_001',() => {
                this.playBeforeStageBgm();
                this._view.showStageInfo(() => {
                    // ステージを開始するチュートリアル
                    if (this._model.stageNo() == 1){
                        if ($gameDefine.mobileMode == true){
                            TutorialManager.openGuide("beforestage_m");
                        } else{
                            TutorialManager.openGuide("beforestage");
                        }
                    }
                    $gameHelp.refresh();
                });
                this._busy = false;
            });
        } else{
            this.playStageBgm();
            $gameHelp.refresh();
        }
        this._view.setDragHandler((sprite) => {this.commandFeature(sprite)});    
        TouchInput.clear();

        $gameAchievement.checkAchievement();
    }

    commandFeature(sprite){
        if (sprite == null){
            this._view.clearFeature();
            return;
        }
        if (EventManager.busy()){
            return;
        }
        const feature = this._model.battlerFeature(sprite._battler);
        const x = sprite.x;
        const y = sprite.y - 12;
        this._view.commandFeature(feature,x,y);
    }

    playBeforeStageBgm(){
        if (this._model.isUseBeforeBattleBgm()){
            AudioManager.playBgm($gameBGM.stagemenu);
        }
        const stageBgsData = this._model.stageBgsData();
        AudioManager.playBgs(stageBgsData);
    }

    playStageBgm(){
        const stageBgmData = this._model.stageBgmData();
        if (stageBgmData != null){
            if (this._model.isUseBeforeBattleBgm()){
                AudioManager.playBgm(stageBgmData);
            }
        } else{
            AudioManager.fadeOutBgm(1);
        }
        const stageBgsData = this._model.stageBgsData();
        AudioManager.playBgs(stageBgsData);
    }

    setWait (num) {
        return new Promise(resolve => {
            const delayTime = num
            setTimeout(() => {
              return resolve()
            }, delayTime)
        });
    }

    update(){

    }

    commandBossBattle(){
        SceneManager.push(Battle_Scene);
    }
}