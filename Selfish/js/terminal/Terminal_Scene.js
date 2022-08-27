//-----------------------------------------------------------------------------
// Terminal_Scene
//

class Terminal_Scene extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Presenter_Terminal(this);
    }

    isReady(){
        return true;
    }

    async start(){
        super.start();
        Presenter_Loading.open();
        if (SceneManager._previousClass.name && SceneManager._previousClass.name != "Menu_Scene" || !(Menu_Scene._calledScene instanceof Terminal_Scene)){
            await this.loading(this.waitResourceLoad.bind(this));
        }
        
        Presenter_Loading.close();
        AudioManager.playBgm($gameBGM.getBgm('chapter'));
        AudioManager.fadeOutBgs(0.5);
        this._presenter.start();
        this._keyMapWindow.show();
        this._commandWindow.showAnimation();
    
        this.showMenuPlate(0.25,this.callBackCommand.bind(this),TextManager.getMenuText(),TextManager.getText(500100));
    }

    waitResourceLoad(){
        return AudioManager.loadedBgmResource(this._resourceData.bgm) && Scene_Base.prototype.isReady.call(this);
    }

    showHelpText(key){
        this._keyMapWindow.refresh(key);
    }

    create(){
        BackGroundManager.resetup();
        BackGroundManager.enableWeather(false);
        BackGroundManager.bgFadeOut(0);
        EventManager.resetup();
        EventManager.enableWeather(false);
    
        Scene_Base.prototype.create.call(this);
    
        this.createScreenSprite();
    
        this.createHelpWindow();
        this.createTerminalCommand();
    
    
        this.createChapterSelect();
        this.createWordSelect();
        this.createWordStatus();
    
        this.createMenuButton();
        this.createBackButton(this.callBackCommand.bind(this));
        this.setBackSprite(TextManager.getMenuText());
        this.createMenuSprite();
        this.setMenuSprite(TextManager.getText(500100));
        this.createKeyMapWindow();
        
        this.hideMenuPlate(0);
    }

    createTerminalCommand(){
        this._commandWindow = new Window_TerminalCommand(-96,144,480,88);
        this._commandWindow.setHelpWindow(this._helpWindow);
        this._commandWindow.setHandler('cancel',     this.callMenuCommand.bind(this));
        this._commandWindow.setHandler('disable',    this.callMenuDisable.bind(this));
        this.addChild(this._commandWindow);
    }

    showCommandWindow(){
        this._commandWindow.show();
        this._commandWindow.activate();
        this._commandWindow.showAnimation();
    }

    setTerminalCommand(data){
        this._commandWindow.setData(data);
        data.forEach((command,index) => {
            this._commandWindow.setHandler(command.key,     this.commandTerminal.bind(this));
        });
        if (!$gameSystem._continue && this._commandWindow.index() == 0){
            this._commandWindow.select(1);
        }
    }

    commandTerminal(){
        this._commandWindow.deactivate();
        this._commandWindow.hideAnimation();
        switch (this._commandWindow.currentSymbol()){
            case "continue": //Continue
                this.setCommand({command: TerminalCommand.CONTINUESELECT});
                return;
            case "stage": //StageSelect
                this.setCommand({command:TerminalCommand.CHAPTEROPEN});
                return;
            case "material": //Materials
                this.setCommand({command:TerminalCommand.WORDOPEN});
                return;
            case "menu": //Menu
                this.callMenuCommand();
                return;
            case "gameend": //ShotDown
                this.callShotdownCommand();
                return;
            case "rushbattle": //RashBattle
                this.callRushBattleCommand();
                return;
        }
    }

    commandMessageOpen(){
        this.setCommand({command:TerminalCommand.MESSAGEOPEN});
    }

    createHelpWindow(){
        this._helpWindow = new Window_Help();
        this.addChild(this._helpWindow);
    }

    callBackCommand(){
        if (Presenter_Loading.busy()){
            return;
        }
        if (PopupManager.busy()){
            return;
        }
        if (this._wordStatus.active){
            if (this._wordStatus.hitIndex() == -1){
                if ($gameDefine.mobileMode){
                    this.commandWordCancel();
                } else{
                    this.commandWordStatusCancel();
                }
            }
        } else
        if (this._wordSelect.active){
            if (this._wordSelect.hitIndex() == -1){
                this.commandWordCancel();
            }
        } else
        if (this._chapterSelect.active){
            if (this._chapterSelect.hitIndex() == -1){
                this.commandCharterEnd();
            }
        } else{
            this.callMenuCommand();
        }
        SoundManager.playCancel();
        TouchInput.clear();
        this.setBackMenuText();
    }

    setBackMenuText(){
        let text = TextManager.getMenuText();
        if (this._chapterSelect.active || this._wordSelect.active){
            text = TextManager.getBackText();
        }
        this.setBackSprite(text);
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this._keyMapWindow.hide();
            this.addChild(this._keyMapWindow);
        }
    }

    createChapterSelect(){
        this._chapterSelect = new Window_TerminalSelect(-64,400,480,88);
        this._chapterSelect.setHandler('ok',this.callChapterSelect.bind(this));
        this._chapterSelect.setHandler('cancel',this.commandCharterEnd.bind(this));
        this.addChild(this._chapterSelect);
    }

    setChapterData(data){
        this._chapterSelect.setData(data);
    }

    createWordSelect(){
        this._wordSelect = new Window_WordSelect(680,72,320,408);
        this._wordSelect.setHandler('ok',this.commandWordOk.bind(this));
        this._wordSelect.setHandler('cancel',this.commandWordCancel.bind(this));
        this.addChild(this._wordSelect);
    }

    createWordStatus(){
        this._wordStatus = new Window_WordStatus(148,54,504,432);
        this._wordStatus.setHandler('ok',this.commandWordStatusEvent.bind(this));
        this._wordStatus.setHandler('cancel',this.commandWordStatusCancel.bind(this));
        this.addChild(this._wordStatus);
    }

    callMenuCommand(){
        this.setCommand({command: TerminalCommand.MENU});
    }

    callMenuDisable(){
        this._commandWindow.deactivate();
        // 画面ブレとポップアップ
        FilterMzUtility.addFilter(FilterType.PixelateFade,{x:6,y:6});
        
        const symbol = this._commandWindow.currentSymbol();
        let textId = 0;
        if (symbol == "continue"){
            textId = 301200;
            PopupCautionManager.setPopup(TextManager.getText(textId));
            PopupCautionManager.openClose(() => {
                this._commandWindow.activate();
            });
        } else
        if (symbol == "rushbattle"){
            const mainText = TextManager.getText(301600);
            const subText = TextManager.getText(301610);
            const text1 = TextManager.getDecideText();
            const text2 = TextManager.getCancelText();

            const _popup = PopupManager;
            _popup.setPopup(mainText,{select:1, subText:subText});
            _popup.setHandler(text1,'ok',() => {
                $gameSystem._continue = false;
                $gameParty._stageStepCount = 0;
                $gamePlayer.resetStepSound();
                $gameParty.setStagePhase('init');
                $gameParty.clearReadTips();
                const stageData = $gameParty.stageData();
                
                ResourceLoadManager.releaseBattleResource(stageData.id);
                this.callRushBattleCommand();
                $gameParty.clearStageData();
            });
            _popup.setHandler(text2,'cancel',() => {
                this._commandWindow.activate();
            });
            _popup.open();
        }
    }

    commandMenu(){
        Window_TerminalCommand._lastCommandSymbol = this._commandWindow.currentSymbol();
        BackGroundManager.bgFadeOut(0);
        EventManager.startFadeIn(0);
        EventManager.clearPictures();
        EventManager.exit();
    }

    callShotdownCommand(){
        let textId = 500300;
        const mainText = TextManager.getText(textId);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:1});
        _popup.setHandler(text1,'ok',() => { 
            this.setCommand({command:TerminalCommand.SHOTDOWN});
        });
        _popup.setHandler(text2,'cancel',() => {
            this.showCommandWindow();
        });
        _popup.open();
    }

    callChapterSelect(){
        this.setCommand({command: TerminalCommand.CHAPTERSELECT});
    }

    callStorySelect(){
        this.setCommand({command: TerminalCommand.STORYSELECT});
    }

    callGuideCommand(){
        this.setCommand({command: TerminalCommand.GUIDE});
    }

    callRushBattleCommand(){
        this.setCommand({command: TerminalCommand.RUSHBATTLE});
    }

    commandChapterOpen(){
        this._lastSelectCapter = null;

        this._chapterSelect.showAnimation();
        this._chapterSelect.activate();
        this._chapterSelect.refresh();
        this._chapterSelect.selectLast();
        this.setBackMenuText();
    }

    commandChapterSelect(stage,stageName){
        this._chapterSelect.hideAnimation();
        this._chapterSelect.deactivate();
        const mainText = stageName + TextManager.getText(400100);
        if ($gameSystem._continue){
            var subText = TextManager.getText(400110);
        }
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
    
        this._lastSelectCapter = null;
        EventManager.startFadeIn(0);
        EventManager.clearPictures();
        EventManager.exit();
        BackGroundManager.changeBackGround(stage.backGround,null);
        BackGroundManager.resetPosition();
        BackGroundManager.bgFadeIn(0.25);

        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:1, subText:subText});
        _popup.setHandler(text1,'ok',() => {
            EventManager.clearPictures();
            EventManager.exit();
            AudioManager.fadeOutBgm(0);
            this.setCommand({command:TerminalCommand.CHAPTERSTART});
        });
        _popup.setHandler(text2,'cancel',() => {
            EventManager.clearPictures();
            EventManager.exit();
            BackGroundManager.bgFadeOut(0);
            this._chapterSelect.showAnimation();
            this._chapterSelect.activate();
        });
        _popup.open();
    }

    commandCharterEnd(){
        this._chapterSelect.hideAnimation();
        this._chapterSelect.deactivate();
        this.showCommandWindow();
    
        BackGroundManager.bgFadeOut(0);
        
        EventManager.startFadeIn(0);
        EventManager.clearPictures();
        EventManager.exit();
        this.setBackMenuText();
    }

    commandContinueSelect(bg,stage,position,size,isVisible){
        const mainText = TextManager.getText(stage.nameId) + TextManager.getText(400200);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        
        EventManager.startFadeIn(0);
        EventManager.clearPictures();
        EventManager.exit();
        if (isVisible){
            BackGroundManager.changeBackGround(bg,null);
            BackGroundManager.setSize(size[0],size[1]);
            BackGroundManager.moveUV(0,position[0],position[1],true);
        }
        BackGroundManager.bgFadeIn(0.0);

        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:1});
        _popup.setHandler(text1,'ok',() => { 
            EventManager.startFadeIn(0);
            this.setCommand({command:TerminalCommand.CONTINUE});
        });
        _popup.setHandler(text2,'cancel',() => {
            BackGroundManager.bgFadeOut(0.25);
            this.showCommandWindow();
        });
        _popup.open();
    }

    setResourceData(resourceData){
        this._resourceData = resourceData;
    }

    update(){
        if (Presenter_Loading.busy()){
            return;
        }
        super.update();
        this.updateSelect();
    }

    updateSelect(){
        if (this._materialBusy == true){
            return;
        }
        if (this._chapterSelect && this._chapterSelect.active){
            if (this._lastSelectCapter != this._chapterSelect.index()){
                EventManager.clearPictures();
                EventManager.exit();
                this._lastSelectCapter = this._chapterSelect.index();
                EventManager.setup('chapter' + (this._chapterSelect.index()+1));
            }
        }
        if (this._wordSelect && this._wordSelect.active){
            if (this._lastSelectWord != this._wordSelect.index()){
                this._lastSelectWord = this._wordSelect.index();
                var item = this._wordSelect.item();
                this.setCommand({command:TerminalCommand.WORDSET,itemId:item});
            }
        }
        if (this._wordStatus && this._wordStatus.active){
            if (this._lastSelectStatus != this._wordStatus.index()){
                this._lastSelectStatus = this._wordStatus.index();
                const item = this._wordStatus.wordItem();
                if (item != null && item.eventName){
                    this.refreshKeyHelpWindow("materialEvent");
                } else{
                    this.refreshKeyHelpWindow("material");
                }
                this._wordSelect.refresh();
            }
        }
    }

    terminate(){
        super.terminate();
        this._chapterSelect.terminate();
        this._chapterSelect = null;
        this._helpWindow.destroy();
        this._helpWindow = null;
        this._commandWindow.terminate();
        this._commandWindow = null;
        this._wordSelect.destroy();
        this._wordSelect = null;
        this._wordStatus.destroy();
        this._wordStatus = null;
        this._keyMapWindow.terminate();
        this._keyMapWindow = null;
        this._presenter = null;
        EventManager.remove();
        BackGroundManager.remove();
        TipsManager.remove();
        this.destroy();
    }

    commandWordOpen(wordItem){
        this.refreshKeyHelpWindow("materialSelect");
        this._lastSelectWord = null;
        this._wordSelect.setData(wordItem);
        this._wordSelect.showAnimation();
        this._wordSelect.activate();
        this._wordSelect.selectLast();
        this._wordStatus.showAnimation();
        TouchInput.clear();
        this.setBackMenuText();
        if ($gameDefine.mobileMode){
            this.commandWordOk();
        }
    }

    commandWordSelect(wordStatus){
        this._wordSelect.refresh();
        this._wordSelect.deactivate();
        //this._wordStatus.showAnimation();
        this._wordStatus.activate();
        this._wordStatus.setData(wordStatus);
        TouchInput.clear();
        if ($gameDefine.mobileMode){
            this._wordSelect.activate();
        }
    }

    commandWordSet(wordStatus){
        this._wordStatus.setData(wordStatus);
        this._wordStatus.forceSelect(0);
        this._wordStatus.select(-1);
        TouchInput.clear();
    }

    commandWordCancel(){
        this.refreshKeyHelpWindow("chapter");
        this._wordSelect.refresh();
        this._wordSelect.hideAnimation();
        this._wordSelect.deactivate();
        this._wordStatus.hideAnimation();
        this._commandWindow.refresh();
        this.showCommandWindow();
        TouchInput.clear();
        this.setBackMenuText();
        if ($gameDefine.mobileMode){
            this._wordStatus.deactivate();
        }
    }

    commandWordOk(){
        this._lastSelectStatus = null;
        const item = this._wordSelect.item();
        this.setCommand({command:TerminalCommand.WORDSELECT,itemId:item});
    }

    commandWordStatusEvent(){
        const item = this._wordStatus.wordItem();
        this.setCommand({command:TerminalCommand.WORDEVENT,itemId:item});
        TouchInput.clear();
    }

    commandWordStatusCancel(){
        this.refreshKeyHelpWindow("materialSelect");
        //this._wordStatus.hideAnimation();
        this._wordStatus.deactivate();
        this._wordStatus.select(-1);
        this._wordSelect.activate();
        this._wordSelect.selectLast();
        TouchInput.clear();
    }

    startMaterialEvent(){
        this._materialBusy = true;
        this._wordStatus.hideAnimation();
        this._wordStatus.deactivate();
        this._wordSelect.hideAnimation();
        this._wordSelect.deactivate();
        this._helpWindow.hide();
        this._menuBack.opacity = 0;
        this.hideMenuPlateEvent(0.2);
        this._keyMapWindow.alpha = 0;
        TouchInput.clear();
    }

    endMaterialEvent(){
        this._materialBusy = false;
        var lastSelect = this._wordSelect.index();
        //this._wordSelect.setData($gameParty.items());
        this._wordSelect.select(lastSelect);
        this._wordSelect.refresh();
        var lastSelect2 = this._wordStatus.index();
        this.commandWordOk();
        this._wordStatus.select(lastSelect2);
        this._wordStatus.showAnimation();
        this._wordStatus.activate();
        this._wordSelect.showAnimation();
        this._helpWindow.show();
        this._menuBack.opacity = 255;
        let text = TextManager.getMenuText();
        if ($gameDefine.mobileMode){
            text = TextManager.getBackText();
        }
        this.showMenuPlate(0.25,this.callBackCommand.bind(this),text,TextManager.getText(500100));
        this.showMenuPlateEvent();
        this._keyMapWindow.alpha = 1;
        TouchInput.clear();
    }

    showMenuPlateEvent(){
        gsap.to(this._menuPlate,0.2,{opacity:128,y:0});
        gsap.to(this._backButton,0.2,{opacity:255,x:0});
        gsap.to(this._menuSprite,0.2,{opacity:255,y:-8});
    }

    hideMenuPlateEvent(duration){
        super.hideMenuPlate(duration);
        gsap.to(this._menuPlate,0.2,{opacity:0,y:this._menuPlate.y - 64});
        gsap.to(this._backButton,0.2,{opacity:0,x:this._backButton.x - 80});
        gsap.to(this._menuSprite,0.2,{opacity:0,y:this._menuSprite.y - 64});
    }

    refreshKeyHelpWindow(key){
        if (this._keyMapWindow){
            this._keyMapWindow.refresh(key);
        }
    }

    popupLoadActor(){
        this._commandWindow.deactivate();
        PopupManager.openPopupLoadActor(() => {
            this._commandWindow.activate();
        })
    }
}

const TerminalCommand = {
    MENU : 0,
    CONTINUESELECT : 1,
    CONTINUE : 2,
    CHAPTEROPEN : 3,
    CHAPTERSELECT : 4,
    CHAPTERSTART: 5,
    GUIDE : 8,
    WORDOPEN : 9,
    WORDSELECT : 10,
    WORDSET : 11,
    WORDEVENT : 12,
    MESSAGEOPEN : 13,
    SHOTDOWN : 14,
    RUSHBATTLE : 15,
}