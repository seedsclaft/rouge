//-----------------------------------------------------------------------------
// Presenter_Terminal
//

class Presenter_Terminal extends Presenter_Base{
    constructor(view){
        super();
        this.initialize(view);
    }

    initialize(view){
        this._view = view;
        this._model = new Model_Terminal();
        this.setEvent();
        this._resourceData = this._model.loadResourceData();
        this._view.setResourceData(this._resourceData);
    }

    start(){
        this._view.showHelpText("chapter");
        this._view.setChapterData(this._model.chapterData());
        this._view.setTerminalCommand(this._model.terminalCommand());

        TutorialManager.openGuide("terminal2",7);
        if ($gameDefine.gameVersionNumber() < 100){
            if ($gameParty.recordData() && $gameParty.recordData()._recordData.length > 5)
            TutorialManager.openGuide("release002",7);
        }
        const loaded = this._model.loadLastPartyMember();
        if (loaded == true){
            $gameSystem.clearResume();
            this._view.popupLoadActor();
        }
        const tempBg = this._model.loadLastRushBg();
        if (tempBg != null){
            BackGroundManager.changeBackGround(tempBg,null);
            this._model._tempBgName = tempBg;
            $gameSystem._lastRushBg = null;
        }
        $gameAchievement.checkAchievement();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    updateCommand(){
        super.updateCommand();
        if (PopupManager.busy()){
            return;
        }
        switch (this._view._command.command){
            case TerminalCommand.MENU:
                return this.commandMenu();
            case TerminalCommand.CONTINUESELECT:
                return this.commandContinueSelect();
            case TerminalCommand.CONTINUE:
                return this.commandContinue();
            case TerminalCommand.CHAPTEROPEN:
                return this.commandChapterOpen();
            case TerminalCommand.CHAPTERSELECT:
                return this.commandChapterSelect();
            case TerminalCommand.CHAPTERSTART:
                return this.commandChapterStart();
            case TerminalCommand.GUIDE:
                return this.commandGuide();
            case TerminalCommand.WORDOPEN:
                return this.commandWordOpen();
            case TerminalCommand.WORDSELECT:
                return this.commandWordSelect(this._view._command.itemId);
            case TerminalCommand.WORDSET:
                return this.commandWordSet(this._view._command.itemId);
            case TerminalCommand.WORDEVENT:
                return this.commandWordEvent(this._view._command.itemId);
            case TerminalCommand.MESSAGEOPEN:
                return this.commandMessageOpen();
            case TerminalCommand.SHOTDOWN:
                return this.commandShotdown();
            case TerminalCommand.RUSHBATTLE:
                return this.commandRushBattle();
        }
        this._view.clearCommand();
    }

    commandMenu(){
        this._view.commandMenu();
        //SoundManager.playCancel();
        this._model.pushPartyMember();
        if (!SceneManager._backgroundBitmap){
            SceneManager.snapForBackground();
        }
        SceneManager.push(Menu_Scene);
    }

    commandContinueSelect(){
        if (!this._model.isContinue()){
            return;
        }
        const bgName = this._model.bgName();
        const stageData = this._model.stageData();
        const positionData = this._model.continuePositionData();
        const sizeData = this._model.continueSizeData();
        const screenVisibleData = $gameScreen.screenVisible();
        this._view.commandContinueSelect(bgName,stageData,positionData,sizeData,screenVisibleData);
    }

    commandChapterOpen(){
        this._view.commandChapterOpen();
    }

    commandChapterSelect(){
        this._chapterSelect = null;
        const stage = this._view._chapterSelect.item();
        this._view.commandChapterSelect(stage,TextManager.getText(stage.nameId));
    }

    commandChapterStart(){
        AudioManager.purgeBgm(this._resourceData.bgm);
        BackGroundManager.clearWeather();
        EventManager.clearWeather();
        FilterMzUtility.changeThrouthTerminal(false);
        FilterMzUtility.initFilters();
    
        this._model.chapterStart(this._view._chapterSelect.item());
        //this._model.reloadMapIfUpdated();
        EventManager.startFadeOut(0);
        const stage = this._view._chapterSelect.item();
        SceneManager.goto(Map_Scene);
        EventManager.setup(stage.startEvent);
    }

    commandContinue(){
        BackGroundManager.clearWeatherLoad();
        EventManager.clearWeatherLoad();
        FilterMzUtility.changeThrouthTerminal(false);
        this._model.resumePartyMember();
        this._model.clearLastActorsId();
        
        const resumeScene = this._model.resumeScene();
        
        AudioManager.purgeBgm(this._resourceData.bgm);
        //AudioManager.fadeOutBgm(0.2);
    
        // 天気の復帰
        BackGroundManager.setWeather($gameScreen.backGroundWeather());
        EventManager.setWeather($gameScreen.eventWeather());
    
        // 見えるかの判定
        const isVisible = $gameScreen.screenVisible();
    
        switch (resumeScene){
            case 'Battle_Scene':
                SceneManager.push(Battle_Scene);
                break;
            case 'Stage_Scene':
                this._model.reloadMapIfUpdated();
                SceneManager.goto(Stage_Scene);
                break;
            case 'endEvent':
                $gamePlayer.clearTransferInfo();
                const endEvent = this._model.endEvent();
                EventManager.setup(endEvent);
                SceneManager.goto(Event_Scene);
                break;
            default:
                this._model.reloadMapIfUpdated();
                SceneManager.goto(Map_Scene);
                if (!isVisible){
                    EventManager.startFadeOut(0);
                }
                break;
        }
        $gameSystem.onAfterLoad();
    }

    commandGuide(){
    }

    commandWordOpen(){
        const userMaterialAll = this._model.userMaterialAll();
        this._view.commandWordOpen(userMaterialAll);
    }

    commandWordSelect(itemId){
        const userMaterialStatus = this._model.userMaterialStatus(itemId);
        this._view.commandWordSelect(userMaterialStatus);
    }

    commandWordSet(itemId){
        const userMaterialStatus = this._model.userMaterialStatus(itemId);
        this._view.commandWordSet(userMaterialStatus);
    }

    commandWordEvent(material){
        // クリア済み・イベント再生
        if (material.eventName){
            this._view.startMaterialEvent();
            material.eventItemList.forEach(item => {
                this._model.gainEventItem(item);
            });
            EventManager.setup(material.eventName,() => {
                this._view.endMaterialEvent();
            });
        }
    }

    commandMessageOpen(){
    }

    commandShotdown(){
        if ($gameDefine.platForm() == PlatForm.Android || $gameDefine.platForm() == PlatForm.iOS){
            navigator.app.exitApp();
        } else{
            SceneManager.exit();
        }
    }

    commandRushBattle(){
        SceneManager.push(RushBattle_Scene);
    }
}