//-----------------------------------------------------------------------------
// Help_Scene
//

class MemberSelect_View extends Scene_Base {
    constructor(){
        super();
        this._presenter = new MemberSelect_Presenter(this);
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
        this.createScreenSprite();
        this.createWindowLayer();
        this._listWindow = new MemberSelect_ActorList(0,0,960,540);
        this._listWindow.setHandler('ok',     this.selectActor.bind(this));
        this._listWindow.setHandler('right',     this.changeActor.bind(this,1));
        this._listWindow.setHandler('left',     this.changeActor.bind(this,-1));
        this._listWindow.setHandler('index',     this.changeSelectIndex.bind(this));
        this._listWindow.setHandler('cancel',     this.popScene.bind(this));
        this.addChild(this._listWindow);
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
        this.createHelpWindow();
        this.createKeyMapWindow();
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('memberSelect');
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
        this.setCommand(MemberSelectCommand.Start);
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
        this.setCommand(MemberSelectCommand.Select);
        this.setCommand(MemberSelectCommand.Refresh);
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

const MemberSelectCommand = {
    Start :0,
    Select :1,
    Refresh : 100
}