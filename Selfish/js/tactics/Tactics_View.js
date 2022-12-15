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
        let background = new Sprite();
        background.bitmap = ImageManager.loadBackground("nexfan_01");
        background.x = -40;
        background.y = -200;
        this.addChild(background);
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

    commandDecide(commandIndex){
        this.setCommand(TacticsCommand.Select + commandIndex + 1);
    }

    commandTrain(){
        this._actorSelect.activate();
        this._actorSelect.select(0);
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
            this._actorSelect = new Tactics_ActorSelect(0,0,960,80);
            this._actorSelect.setHandler('ok',     this.setCommand.bind(this,TacticsCommand.SelectOk));
            this._actorSelect.setHandler('cancel', this.setCommand.bind(this,TacticsCommand.SelectCancel));
            this._actorSelect.setHandler('save',   this.setCommand.bind(this,TacticsCommand.SelectEnd));
            this._actorSelect.setHandler('index',  this.refreshActorIndex.bind(this));
            this.addChild(this._actorSelect);
        }
        this._actorSelect.setData(data);
        //this._actorSelect.activate();
    }

    selectActorId(){
        return this._actorSelect.actor().actorId();
    }

    selectCategory(){
        return this._commandList.currentSymbol();
    }

    commandSelectOk(_isSelected){
        const _index = this._actorSelect.index();
        this._actorSpriteList.setSelectedIndex(_index,_isSelected);
        this._actorSelect.activate();
    }

    commandSelectCancel(){
        this._actorSelect.deactivate();
        this._commandList.activate();
    }

    refreshActorIndex(){
        const _index = this._actorSelect.index();
        this._actorSpriteList.selectingIndex(_index);
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
    Select :10,
    Train :11,
    SelectOk :30,
    SelectCancel :31,
    SelectEnd :32,
    Refresh : 100
}