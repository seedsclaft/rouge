class PopupStatus_View  {
    constructor(){
    }

    static initialize(){
        this._listWindow = new PopupStatus_ActorList(496,40,400,440);
        /*
        this._listWindow.setHandler('ok',     this.selectActor.bind(this));
        this._listWindow.setHandler('right',     this.changeActor.bind(this,1));
        this._listWindow.setHandler('left',     this.changeActor.bind(this,-1));
        this._listWindow.setHandler('index',     this.changeSelectIndex.bind(this));
        */
        //this._listWindow.setHandler('cancel',     SceneManager._scene.popScene.bind(this));
        SceneManager._scene.addChild(this._listWindow);
    }

    static setData(data){
        this._listWindow.setData(data);
        this._listWindow.activate();
        this._listWindow.selectLast();
    }

    static setLvupData(data,endCall){
        this._listWindow.setData(data);
        this._listWindow.stratLvup(endCall);
    }

    static setLvupAfter(data,endCall){
        this._listWindow.setLvupAfter(data);
        this._listWindow.setHandler('ok',     () => {if (endCall) endCall() });
    }

    static close(){
        this._listWindow.hide();
    }
    

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('PopupStatus');
        }
    }

    createArrows(){
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
        this.setCommand(PopupStatusCommand.Start);
    }

    setActorData(data){
        this._listWindow.setData(data);
        this._listWindow.activate();
        this._listWindow.selectLast();
    }

    changeSelectIndex(){
    }

    changeActor(value){
        if (value > 0){
            this._listWindow.cursorDown();
        } else{
            this._listWindow.cursorUp();
        }
        this._listWindow.refresh();
        this._listWindow.activate();
    }

    selectActor(){
        this.setCommand(PopupStatusCommand.Select);
        this.setCommand(PopupStatusCommand.Refresh);
        this._listWindow.activate();
    }

    currentActorId(){
        return this._listWindow.item().actorId();
    }

    update(){
        super.update();
    }

    swipHelp(moveX){
        this._statusWindow.swipHelp(moveX);
    }

    swipReset(){
        this._statusWindow.swipReset();
    }

    swipEndHelp(moveX){
        this._statusWindow.swipEndHelp(moveX);
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

const PopupStatusCommand = {
    Start :0,
    Select :1,
    Refresh : 100
}