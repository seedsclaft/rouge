class Tactics_View extends Scene_Base {
    constructor(){
        super();
        this._presenter = new Tactics_Presenter(this);
    }

    create(){
        BackGroundManager.resetup();
        EventManager.resetup();
        super.create();
        this.createDisplayObjects();
    }

    setResourceData(resourceData){
        this._resourceData = resourceData;
    }

    isReady(){
        return true;
    }

    createDisplayObjects(){
        //this.createScreenSprite();
        BackGroundManager.resetup();
        this.createWindowLayer();
        /*
        this._statusWindow = new Window_HelpStatus(264,64,1080,540);
        this._statusWindow.setHandler('index',     this.refreshArrows.bind(this));
        this.addChild(this._statusWindow);
        this.createMenuButton();
        this.createBackButton();
        this.createMenuSprite();
        this.setMenuSprite(TextManager.getText(2090));
        this._backButton.setClickHandler(() => {
            SoundManager.playCancel();
            this.popScene()
        });
        this.createArrows();
        */
    }

    createObjectAfter(){

        this.createHelpWindow();
        this.createKeyMapWindow();
        PopupStatus_View.resetUp();
        PopupStatus_View.close();
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            //this._keyMapWindow.refresh('Tactics');
        }
    }

    createArrows(){
        this._categoryRightButton = new Sprite_Button();
        this._categoryRightButton.bitmap = ImageManager.loadSystem("minus");
        this._categoryRightButton.x = 534;
        this._categoryRightButton.y = 488;
        this._categoryRightButton.setClickHandler(this.callPageArrow.bind(this,-1));
        this.addChild(this._categoryRightButton);
        const scale = 1;
        this._categoryRightButton.scale.x = scale;
        this._categoryRightButton.scale.y = scale;

        this._categoryLeftButton = new Sprite_Button();
        this._categoryLeftButton.bitmap = ImageManager.loadSystem("plus");
        this._categoryLeftButton.x = 584;
        this._categoryLeftButton.y = 488;
        this._categoryLeftButton.setClickHandler(this.callPageArrow.bind(this,1));
        this.addChild(this._categoryLeftButton);
        this._categoryLeftButton.scale.x = scale;
        this._categoryLeftButton.scale.y = scale;
    }

    callPageArrow(plus){
        SoundManager.playCursor();
        if( plus > 0){
            this._statusWindow.cursorRight();
        } else{
            this._statusWindow.cursorLeft();
        }
        this._statusWindow.refresh();
        this.refreshArrows();
    }

    refreshArrows(){
        this._statusWindow.refresh();
        this._categoryRightButton.visible = (this._statusWindow.index() != 0) && (this._statusWindow._data.length != 1);
        this._categoryLeftButton.visible = (this._statusWindow.index() != (this._statusWindow._data.length-1)) && (this._statusWindow._data.length != 1);
    }

    start(){
        super.start();
        this.setCommand(TacticsCommand.Start);
    }

    setActorSpriteList(data){
        if (this._actorSpriteList == null){
            this._actorSpriteList = new Tactics_ActorSpriteList(0,270);
            this.addChild(this._actorSpriteList);
        }
        this._actorSpriteList.setData(data);
    }

    setCommandData(commandData){
        if (this._commandList != null) return;
        let commandListBack = new Sprite();
        commandListBack.bitmap = ImageManager.loadSystem("textplateC");
        commandListBack.x = 48;
        commandListBack.y = 416;
        commandListBack.scale.x = 1.2;
        commandListBack.scale.y = 1.2;
        this.addChild(commandListBack);
        this._commandList = new Tactics_CommandList(144,384,680,commandData);
        commandData.forEach((command,index) => {
            this._commandList.setHandler(command.key, this.commandDecide.bind(this,index));
        });
        this.addChild(this._commandList);
        /*
        this._commandList.setData(data);
        this._commandList.activate();
        this._commandList.selectLast();
        */
    }

    setAlchemyParam(apchemyParam){
        if (this._alchemyParam == null){
            this._alchemyParam = new Tactics_AlchemyParam(464,64,360,64);
            this.addChild(this._alchemyParam);
        }
        this._alchemyParam.setData(apchemyParam);
        this._alchemyParam.show();
    }

    commandDecide(){
        this.setCommand(TacticsCommand.CommandOk);
    }

    commandCommandOk(isEnable,selectedActorNameList){
        if (isEnable){
            this._actorSelect.activate();
            this._actorSelect.select(0);
            this.refreshActorIndex();
        } else{
            const mainText = TextManager.getText(10000).replace("/d",selectedActorNameList);
            const text1 = TextManager.getDecideText();
            const text2 = TextManager.getCancelText();
            const _popup = PopupManager;
            _popup.setPopup(mainText,{select:0,subText:null});
            _popup.setHandler(text1,'ok',() => {
                this.setCommand(TacticsCommand.SelectClear);
                this._commandList.activate();
            });
            _popup.setHandler(text2,'cancel',() => {
                this._commandList.activate();
            });
            _popup.open();
        }
    }


    setTurnInfoData(data){
        if (this._turnInfo == null){
            this._turnInfo = new Sprite_TurnInfo();
            this.addChild(this._turnInfo);
        }
        this._turnInfo.setTurn(data);
    }

    setEnergyData(data){
        if (this._energyInfo == null){
            this._energyInfo = new Tactics_EnergyInfo(40,8,320,64);
            this.addChild(this._energyInfo);
        }
        this._energyInfo.setEnergy(data);
    }

    setSelectActor(data){
        if (this._actorSelect == null){
            this._actorSelect = new Tactics_ActorSelect(0,0,2,2);
            this._actorSelect.setHandler('ok',     this.setCommand.bind(this,TacticsCommand.SelectOk));
            this._actorSelect.setHandler('cancel', this.setCommand.bind(this,TacticsCommand.SelectCancel));
            this._actorSelect.setHandler('save',   this.setCommand.bind(this,TacticsCommand.SelectEnd));
            this._actorSelect.setHandler('index',  this.refreshActorIndex.bind(this));
            this.addChild(this._actorSelect);
        }
        this._actorSelect.setData(data);
        //this._actorSelect.activate();
    }

    setMagicCategory(data){
        if (this._magicCategory == null){
            this._magicCategory = new Tactics_MagicCategory(120,128,72,264);
            this.addChild(this._magicCategory);
        }
        this._magicCategory.setMagicCategory(data);
        this._magicCategory.hide();
    }

    refreshCategoryIndex(){
        const _category = this._magicCategory.category();
        this._alchemyMagicList.setCategory(_category);
    }

    setAlchemyMagicList(data){
        if (this._alchemyMagicList == null){
            this._alchemyMagicList = new Tactics_AlchemyMagicList(184,128,640,360);
            this._alchemyMagicList.setHandler("ok", this.setCommand.bind(this,TacticsCommand.AlchemySelect));
            this._alchemyMagicList.setHandler("cancel", this.setCommand.bind(this,TacticsCommand.DecideAlchemy));
            this._alchemyMagicList.setHandler("pageup", this.changeCategory.bind(this,1));
            this._alchemyMagicList.setHandler("pagedown", this.changeCategory.bind(this,-1));
            this.addChild(this._alchemyMagicList);
        }
        this._alchemyMagicList.setAlchemyMagic(data);
        this._alchemyMagicList.hide();
    }

    changeCategory(value){
        if (value > 0){
            this._magicCategory.cursorUp();
        } else
        if (value < 0){
            this._magicCategory.cursorDown();
        }
        this.refreshCategoryIndex();
        this._alchemyMagicList.activate();
    }

    commandAlchemySelect(alchemyId){
        this._alchemyMagicList.setSelected(alchemyId);
        this._alchemyMagicList.activate();
    }

    setSearchList(data){
        if (this._searchList == null){
            this._searchList = new Tactics_SearchList(120,128,640,360);
            this._searchList.setHandler("ok", () => {
                this._searchList.hide();
                this.setCommand(TacticsCommand.SearchMember);
            });
            this._searchList.setHandler("cancel", this.setCommand.bind(this,TacticsCommand.SelectCancel));
            this.addChild(this._searchList);
        }
        this._searchList.setSearch(data);
        this._searchList.hide();
    }

    selectActorId(){
        return this._actorSelect.actor().actorId();
    }

    selectCategory(){
        return this._commandList.currentSymbol();
    }

    selectAlchemy(){
        return this._alchemyMagicList.item();
    }

    selectSearch(){
        return this._searchList.item();
    }

    commandSelectOk(isSelected){
        const _index = this._actorSelect.index();
        this._actorSpriteList.setSelectedIndex(_index,isSelected);
        this._actorSelect.activate();
        this._actorSpriteList.activate();
    }

    commandSelectClear(actorIdList,memberList){
        this._actorSelect.setData(memberList);
        this._actorSpriteList.addActorList(actorIdList);
        this._actorSpriteList.deactivate();
    }

    commandSelectCancel(isEnable,selectedActorNameList){
        this._actorSelect.deactivate();
        if (isEnable){
            const mainText = selectedActorNameList + TextManager.getText(10010).replace("/d",TextManager.getText(this._commandList.currentCommand().textId));
            const text1 = TextManager.getDecideText();
            const text2 = TextManager.getCancelText();
            const _popup = PopupManager;
            _popup.setPopup(mainText,{select:0,subText:null});
            _popup.setHandler(text1,'ok',() => {
                this._commandList.activate();
                this.setCommand(TacticsCommand.DecideMember);
            });
            _popup.setHandler(text2,'cancel',() => {
                this._commandList.activate();
                this._actorSpriteList.deactivate();
                this.setCommand(TacticsCommand.SelectClear);
            });
            _popup.open();
        } else{
            this._commandList.activate();
            this._actorSpriteList.deactivate();
            if (this._alchemyParam) this._alchemyParam.hide();
            if (this._searchList) this._searchList.hide();
        }
        //const subText = TextManager.getText(210101);
    }

    refreshActorIndex(){
        const _index = this._actorSelect.index();
        this._actorSpriteList.selectingIndex(_index);
    }

    commandDecideMember(actorIdList){
        this._actorSelect.removeActorList(actorIdList);
        this._actorSpriteList.removeActorList(actorIdList);
        this._actorSpriteList.deactivate();
    }

    commandSelectAlchemy(){
        this._commandList.deactivate();
        this._alchemyMagicList.show();
        this._alchemyMagicList.activate();
        this._magicCategory.show();
        //this._magicCategory.activate();
    }

    commandDecideAlchemy(isEnable,alchemyNameList){
        if (isEnable && alchemyNameList != ""){
            const mainText = TextManager.getText(10030).replace("/d",alchemyNameList);
            const text1 = TextManager.getDecideText();
            const text2 = TextManager.getCancelText();
            const _popup = PopupManager;
            _popup.setPopup(mainText,{select:0,subText:null});
            _popup.setHandler(text1,'ok',() => {
                this._commandList.activate();
                this._alchemyMagicList.hide();
                this._magicCategory.hide();
                this._alchemyParam.hide();
                this.setCommand(TacticsCommand.AlchemyEnd);
            });
            _popup.setHandler(text2,'cancel',() => {
                this._commandList.activate();
                this.setCommand(TacticsCommand.AlchemySelect);
            });
            _popup.open();
        } else{
            this._commandList.activate();
            this._alchemyMagicList.hide();
            this._magicCategory.hide();
            this._alchemyParam.hide();
            this.setCommand(TacticsCommand.SelectClear);
        }
    }

    commandCommandSearch(){
        this._searchList.show();
        this._searchList.activate();
        this._searchList.select(0);
    }

    commandCommandTurnend(){
        const mainText = TextManager.getText(10020);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:null});
        _popup.setHandler(text1,'ok',() => {
            this.setCommand(TacticsCommand.Turnend);
        });
        _popup.setHandler(text2,'cancel',() => {
            this._commandList.activate();
        });
        _popup.open();
    }
    
    update(){
        super.update();
    }

    swipHelp(moveX){
    }

    swipReset(){
    }

    swipEndHelp(moveX){
    }

    commandNextHelpStatus(cursor){
        SoundManager.playCursor();
        if( cursor > 0){
            this._statusWindow.cursorRight();
        } else{
            this._statusWindow.cursorLeft();
        }
        this._statusWindow.refresh();
        this.refreshArrows();
    }

    refresh(param){
        this._listWindow.selectActorId(param.selectActorId);
    }
}

const TacticsCommand = {
    Start :0,
    CommandOk :10,
    Train :11,
    SelectOk :30,
    SelectCancel :31,
    SelectClear :32,
    SelectEnd :33,
    DecideMember :51,
    TrainMagic :71,
    AlchemySelect :81,
    DecideAlchemy :82,
    AlchemyEnd :83,
    SearchMember :91,
    Turnend :111,
    Refresh : 100
}