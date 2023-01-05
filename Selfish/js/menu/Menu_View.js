//-----------------------------------------------------------------------------
// Menu_View
//

class Menu_View extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Menu_Presenter(this);
        Menu_View._calledScene = SceneManager._scene;
        this._lastLanguage = null;
    }

    create(){
        super.create();
        BackGroundManager.resetup();
        PopupStatus_View.resetUp();
        PopupStatus_View.close();
        this.createHelpWindow();
    
    
        this.createKeyMapWindow();
        this.createStageList();
    
        //this.createFeatureWindow();

        if ($gameDefine.mobileMode){
            this.createMenuDockButton();
        }
        if (this._keyMapWindow && !$gameDefine.mobileMode){
            this.removeChild(this._keyMapWindow);
            this.addChild(this._keyMapWindow);
        }
    }

    createStageList(){
        this._stageList = new Menu_StageList(40,16,920,480);
        this._stageList.setHandler("ok",this.setCommand.bind(this,MenuCommand.SelectStage));
        this.addChild(this._stageList);
    }

    createHelpWindow(){
        this._helpWindow = new Window_Help();
        this.addChild(this._helpWindow);
    }

    start(){
        super.start();
        this.setCommand(MenuCommand.Start);
    }

    commandStart(){
        Input.clear();
    }

    setBackGround(backGround){
        BackGroundManager.changeBackGround(backGround[0],backGround[1]);
        BackGroundManager.resetPosition();
    }

    setStageData(data){
        this._stageList.setStageData(data);
        this._stageList.select(0);
        this._stageList.activate();
    }

    selectStage(){
        return this._stageList.item();
    }

    commandSelectStage(){
        const mainText = TextManager.getText(14020);
        const text1 = TextManager.getDecideText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:null});
        _popup.setHandler(text1,'ok',() => {
            this._stageList.hide();
            this.setCommand(MenuCommand.ActorSelect);
        });
        _popup.open();
    }

    commandActorSelect(actorList){
        PopupStatus_View.setSelectData(actorList,
            () => {
                PopupStatus_View.close();
                this.setCommand(MenuCommand.ActorSelectEnd);
            },
            () => {
                FilterMzUtility.addFilter(FilterType.OldFilm);
                PopupStatus_View.close();
                this._stageList.activate();
                this._stageList.show();
        });
    }

    selectedActor(){
        return PopupStatus_View.selectedData();
    }

    commandActorSelectEnd(actorName,stageName){
        const mainText = TextManager.getText(14030).replace("/d",actorName).replace("/d2",stageName);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:null});
        _popup.setHandler(text1,'ok',() => {
            this.setCommand(MenuCommand.StageStart);
        });
        _popup.setHandler(text2,'cancel',() => {
            this.setCommand(MenuCommand.ActorSelect);
        });
        _popup.open();
    }

    createFeatureWindow(){
        this._featureWindow = new Window_FeatureList(80,96,640, 384);
        this.addChild(this._featureWindow);
    }

    setDragHandler(handler){
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('menuCommand');
        }
    }

    update(){
        super.update();
    }


    terminate(){
        super.terminate();
        EventManager.remove();
        BackGroundManager.remove();
        PopupStatus_View.remove();
        TipsManager.remove();
        this.destroy();
    }

    callPopScene(){
        this.setCommand(MenuCommand.PopScene);
    }

    popScene(){
        Window_MenuListCommand._lastCommandSymbol = null;
        super.popScene();
    }
}

const MenuCommand = {
    Start : 0,
    SelectStage : 1,
    ActorSelect : 2,
    ActorSelectEnd : 3,
    StageStart : 4
}