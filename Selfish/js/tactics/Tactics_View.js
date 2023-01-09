class Tactics_View extends Scene_Base {
    constructor(){
        super();
        this._presenter = new Tactics_Presenter(this);
    }

    create(){
        BackGroundManager.resetup();
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

    setBackGround(backGround){
        BackGroundManager.changeBackGround(backGround[0],backGround[1]);
        BackGroundManager.resetPosition();
    }

    eventStart(){
        this._commandList.deactivate();
        this._commandList.hide();
        this._eventStart = true;
    }

    eventEnd(){
        this._commandList.show();
        this._commandList.activate();
    }

    createObjectAfter(){
        PopupStatus_View.resetUp();
        this.createHelpWindow();
        this._commandList.setHelpWindow(this._helpWindow);
        this.createKeyMapWindow();
        PopupStatus_View.close();
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            //this._keyMapWindow.refresh('Tactics');
        }
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


    commandDecide(){
        this.setCommand(TacticsCommand.DecideCommand);
    }

    commandDecideCommand(isEnable,selectedActorNameList,category){
        if (isEnable){
            this._actorSelect.activate();
            this._actorSelect.smoothSelect(0);
            this._actorSpriteList.setInfoSprite(category);
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
            this._actorSelect.setHandler('ok',     this.setCommand.bind(this,TacticsCommand.SelectActor));
            this._actorSelect.setHandler('cancel', this.setCommand.bind(this,TacticsCommand.SelectCancel));
            this._actorSelect.setHandler('save',   this.setCommand.bind(this,TacticsCommand.SelectEnd));
            this._actorSelect.setHandler('index',  this.refreshActorIndex.bind(this));
            this.addChild(this._actorSelect);
        }
        this._actorSelect.setData(data);
    }

    setMagicCategory(data){
        if (this._magicCategory == null){
            this._magicCategory = new Tactics_MagicCategory(176,94,272,64);
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
            this._alchemyMagicList = new Tactics_AlchemyMagicList(160,144,540 + 104,320);
            this._alchemyMagicList.setHandler("ok", this.setCommand.bind(this,TacticsCommand.SelectAlchemy));
            this._alchemyMagicList.setHandler("cancel", this.setCommand.bind(this,TacticsCommand.CancelAlchemy));
            this._alchemyMagicList.setHandler("pageup", this.changeCategory.bind(this,1));
            this._alchemyMagicList.setHandler("pagedown", this.changeCategory.bind(this,-1));
            this.addChild(this._alchemyMagicList);
        }
        this._alchemyMagicList.setAlchemyMagic(data);
        this._alchemyMagicList.hide();
    }

    changeCategory(value){
        if (value > 0){
            this._magicCategory.cursorLeft();
        } else
        if (value < 0){
            this._magicCategory.cursorRight();
        }
        this.refreshCategoryIndex();
        this._alchemyMagicList.activate();
        if (this._alchemyMagicList._magicList.length > 0){
            this._alchemyMagicList.smoothSelect(0);
        } else{
            this._alchemyMagicList.select(-1);
        }
    }

    commandSelectAlchemy(isEnableResult,actorId,alchemyId){
        if (isEnableResult){
            this._alchemyMagicList.deactivate();
            const mainText = TextManager.actorName(actorId) + TextManager.getText(10030).replace("/d",TextManager.getSkillName(alchemyId));
            const text1 = TextManager.getDecideText();
            const text2 = TextManager.getCancelText();
            const _popup = PopupManager;
            _popup.setPopup(mainText,{select:0,subText:null});
            _popup.setHandler(text1,'ok',() => {
                this._magicCategory.hide();
                this._alchemyMagicList.hide();
                this._alchemyMagicList.deactivate();
                this._actorSelect.activate();
                this.setCommand(TacticsCommand.DecideAlchemy);
            });
            _popup.setHandler(text2,'cancel',() => {
                this._magicCategory.show();
                this._alchemyMagicList.show();
                this._alchemyMagicList.activate();
            });
            _popup.open();
        } else{
            const mainText = TextManager.getText(textId);
            const text1 = TextManager.getDecideText();
            const _popup = PopupManager;
            _popup.setPopup(mainText,{select:0,subText:null});
            _popup.setHandler(text1,'ok',() => {
                this._alchemyMagicList.activate();
            });
            _popup.open();
        }
    }

    commandDecideAlchemy(){
        this._actorSelect.activate();
        this._actorSelect.smoothSelect(0);
        this.refreshActorIndex();
    }

    setSearchList(data){
        if (this._searchList == null){
            this._searchList = new Tactics_SearchList(170,96,640,344);
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

    commandSelectActor(actorIdList){
        this._actorSelect.removeActorList(actorIdList);
        this._actorSpriteList.removeActorList(actorIdList);
    }

    commandSelectOk(isSelected,isEnable){
        if (isEnable){
            const _index = this._actorSelect.index();
            this._actorSpriteList.setSelectedIndex(_index,isSelected);
            this._actorSelect.activate();
            this._actorSpriteList.activate();
        } else{
            const mainText = TextManager.getText(10040);
            const text1 = TextManager.getDecideText();
            const _popup = PopupManager;
            _popup.setPopup(mainText,{select:0,subText:null});
            _popup.setHandler(text1,'ok',() => {
                this._actorSelect.activate();
                this._actorSpriteList.activate();
            });
            _popup.open();
        }
    }

    commandSelectClear(actorIdList,memberList){
        this._actorSelect.setData(memberList);
        this._actorSpriteList.addActorList(actorIdList);
        this._actorSpriteList.deactivate();
    }

    commandSelectCancel(isEnable,selectedActorNameList){
        this._actorSelect.deactivate();
        this._keyMapWindow.refresh("null");
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
            if (this._searchList) this._searchList.hide();
            this._actorSpriteList.setInfoSprite([]);
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
        this._actorSpriteList.setInfoSprite([]);
    }

    commandShowAlchemy(){
        this._commandList.deactivate();
        this._alchemyMagicList.show();
        this._alchemyMagicList.activate();
        this._alchemyMagicList.select(0);
        this._magicCategory.show();
        this._magicCategory.select(0);
        this._actorSelect.deactivate();
        this.refreshCategoryIndex();
    }

    commandCancelAlchemy(){
        const _index = this._actorSelect.index();
        this._actorSpriteList.setSelectedIndex(_index,true);
        this._alchemyMagicList.hide();
        this._magicCategory.hide();
        this._actorSelect.activate();
    }

    commandDecideAlchemy(){
        this._actorSelect.activate();
    }

    commandCommandSearch(){
        this._searchList.show();
        this._searchList.activate();
        this._searchList.select(0);
    }

    commandCommandTurnend(){
        this._actorSelect.deactivate();
        this._commandList.deactivate();
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

    changeEnergyValue(value){
        this._energyInfo.changeEnergy(value);
    }
    
    update(){
        super.update();
        if (this._eventStart && EventManager._eventEnded == true){
            this._eventStart = false;
            this.setCommand(TacticsCommand.EventEnd);
            return;
        }
        if (!PopupStatus_View.busy() && Input.isTriggered("menu")){
            SceneManager.push(Scene_Save);
        }
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

    terminate(){
        super.terminate();
        
        EventManager.remove();
        BackGroundManager.remove();
        PopupStatus_View.remove();
        TipsManager.remove();
        this.destroy();
    }
}

const TacticsCommand = {
    Start :0,
    DecideCommand :10,
    Train :11,
    SelectActor :30,
    SelectCancel :31,
    SelectClear :32,
    SelectEnd :33,
    DecideMember :51,
    TrainMagic :71,
    SelectAlchemy :81,
    CancelAlchemy :82,
    DecideAlchemy :83,
    SearchMember :91,
    Turnend :111,
    EventEnd : 200,
    Refresh : 100
}