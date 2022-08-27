//-----------------------------------------------------------------------------
// Result_Scene
//

class Result_Scene extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Presenter_Result(this);
    }

    create(){
        this._backGround = new Sprite();
        this._backGround.bitmap = ImageManager.loadBattleback1('School5');
        this.addChild(this._backGround);

        super.create();
    
        this.createWindowLayer();
        this.createAllWindows();
        this.createMenuButton();
        this.createBackButton(this.commandMenu.bind(this));
        this.setBackSprite(TextManager.getMenuText());
        this.createMenuSprite();
        this.setMenuSprite(TextManager.getText(2110));
        this.createKeyMapWindow();
        if ($gameDefine.mobileMode){
            this.createDockButton();
        }
    }

    async start(){
        super.start();
        this.setCommand(ResultCommand.Start);
    }

    showRecordList(data,select){
        this._listWindow.setDataList(data);
        this._listWindow.select(select);
    }

    activateRecordList(){
        this._listWindow.activate();
    }

    changeListIndex(){
        this._listWindow.deactivate();
        this.setCommand(ResultCommand.ChangeIndex);
    }

    callScoreUpdate(){
        this._listWindow.deactivate();
        this.setCommand(ResultCommand.ScoreUpdate);
    }

    commandChangeIndex(recordData,rankingData,actorName,backGround){
        this._listWindow.activate();
        this._infoWindow.setDataInfo(recordData,rankingData);
        this._backGround.bitmap = ImageManager.loadBattleback1(backGround);
    }

    createAllWindows(){
        this.createScreenSprite();
        this.createActorPicture();
        this.createRecordListWindow();
        this.createRecordInfoWindow();
        //this.createNumberInputWindow();
        this.createHelpWindow();
    }

    createHelpWindow(){
        this._helpWindow = new Window_Help();
        this.addChild(this._helpWindow);
        this._helpWindow.setText(TextManager.getItemDescription(110));
    }

    createRecordListWindow(){
        this._listWindow = new Window_RecordList(-16,96,264,408);
        this._listWindow.setHandler('cancel',    this.commandMenu.bind(this));
        this._listWindow.setHandler('menu',     this.callScoreUpdate.bind(this));
        this._listWindow.setHandler('index',     this.changeListIndex.bind(this));
        this.addChild(this._listWindow);
    }

    createNumberInputWindow(){
        this._numberWindow = new Window_NumberInput();
        this.addChild(this._numberWindow);
    }

    createActorPicture(){
        this._actorPicture = new Sprite_EventPicture();
        this._actorPicture.setup("Actor0004",840,0,0);
        this.addChild(this._actorPicture);
    }

    createRecordInfoWindow(){
        this._infoWindow = new Window_RecordInfo(0,0,960,540);
        this.addChild(this._infoWindow);
    }

    showMenuPlate(backCommand,backMenu,menuSprite){
        gsap.to(this._menuPlate,0.2,{opacity:128,y:0});
        gsap.to(this._backButton,0.2,{opacity:255,x:24});
        this._backButton.setup(backMenu);
        this._backButton.setClickHandler(backCommand);
        gsap.to(this._menuSprite,0.2,{opacity:255,y:-8});
        this.setMenuSprite(menuSprite);
    }

    hideMenuPlate(){
        gsap.to(this._menuPlate,0.2,{opacity:0,y:this._menuPlate.y - 64});
        gsap.to(this._backButton,0.2,{opacity:0,x:this._backButton.x - 80});
        gsap.to(this._menuSprite,0.2,{opacity:0,y:this._menuSprite.y - 64});
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh("result");
        }
    }

    createDockButton(){
        this._dockMenu = new Sprite_ResultDock();
        this._dockMenu.setClickHandler(ResultDockActionType.Upload,this.commandScoreUpdate.bind(this));
        this.addChild(this._dockMenu);
    }

    commandMenu(){
        SoundManager.playCancel();
        SceneManager.pop();
    }

    commandScoreUpdate(){
        const mainText = TextManager.getText(1101500);
        const subText = TextManager.getText(1101501);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{subText:subText, select:1});
        _popup.setHandler(text1,'ok',() => {
            this.setCommand(ResultCommand.LoadRanking);
        });
        _popup.setHandler(text2,'cancel',() => {
            this._listWindow.activate();
        });
        _popup.open();
    }

    commandLoadRanking(recordData,rankingData){
        this._listWindow.activate();
        this._infoWindow.setDataInfo(recordData,rankingData);
    }
}

const ResultCommand = {
    Start : 1,
    ChangeIndex : 2,
    ScoreUpdate : 3,
    LoadRanking : 4,
}