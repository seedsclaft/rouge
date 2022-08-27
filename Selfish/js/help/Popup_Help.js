class Popup_Help {
    constructor() {
    }

    static init() {
        if (this._isInit == true){
            return;
        }
        this._busy = false;
        this._isInit = true;
        this._model = new Model_Help();
    }

    static open(key,endCall,select){
        this.init();
        if (this._busy){
            return;
        }
        if (this._window == null){ 
            this._bgSprite = new ScreenSprite();
            this._bgSprite.setColor(0,0,0);
            this._bgSprite.opacity = 0;
            this._window = new Window_HelpStatus(152,40,1080,540);
        }
        if (this._window && this._window.parent){
            this._bgSprite.parent.removeChild(this._bgSprite);
            this._window.parent.removeChild(this._window);
            this._categoryLeftButton.parent.removeChild(this._categoryLeftButton);
            this._categoryRightButton.parent.removeChild(this._categoryRightButton);
        }
        SceneManager._scene.addChild(this._bgSprite);
        SceneManager._scene.addChild(this._window);
        this.createArrows();
        this._endCall = endCall;
        this._window.setHandler('ok',this.closecheck.bind(this));
        this._window.setHandler('cancel',this.closecheck.bind(this));
        this._window.setHandler('index',this.refreshArrowsCursor.bind(this));
        const helpData = this._model.helpData(key);
        if (select){
            this._window.select(select);
        } else{
            this._window.select(0);
        }
        this._window.setData(helpData);
        this._window.activate();
        gsap.to(this._bgSprite,0.5,{opacity:128});
        this.refreshArrows();
        this._busy = true;
    }

    static closecheck(){
        if (TouchInput.y > 440){
            return;
        }
        if (PopupManager.busy()){
            return;
        }
        if (TouchInput.y < 440 && TouchInput.isTriggered()){
            SoundManager.playCancel();
        }
        PopupManager.openHelpCheck(this.close.bind(this),() => {this._window.activate()});
    }

    static close(){
        this._window.hide();
        this._window.deactivate();
        if (this._window && this._window.parent){
            this._bgSprite.parent.removeChild(this._bgSprite);
            this._window.parent.removeChild(this._window);
            this._categoryLeftButton.parent.removeChild(this._categoryLeftButton);
            this._categoryRightButton.parent.removeChild(this._categoryRightButton);
        }
        this._window.destroy();
        this._bgSprite.destroy();
        this._categoryLeftButton.destroy();
        this._categoryRightButton.destroy();
        gsap.killTweensOf(this._bgSprite);
        this._window = null;
        this._bgSprite = null;
        this._busy = false;
        if (this._endCall)this._endCall();
        this._endCall = null;
        TouchInput.clear();
        Input.clear();
    }
    
    static busy(){
        return this._busy;
    }

    static createArrows(){
        this._categoryRightButton = new Sprite_Button();
        this._categoryRightButton.bitmap = ImageManager.loadSystem("minus");
        this._categoryRightButton.x = 420;
        this._categoryRightButton.y = 464;
        this._categoryRightButton.setClickHandler(this.callPageArrow.bind(this,-1));
        SceneManager._scene.addChild(this._categoryRightButton);
        const scale = 1;
        this._categoryRightButton.scale.x = scale;
        this._categoryRightButton.scale.y = scale;

        this._categoryLeftButton = new Sprite_Button();
        this._categoryLeftButton.bitmap = ImageManager.loadSystem("plus");
        this._categoryLeftButton.x = 480;
        this._categoryLeftButton.y = 464;
        this._categoryLeftButton.setClickHandler(this.callPageArrow.bind(this,1));
        SceneManager._scene.addChild(this._categoryLeftButton);
        this._categoryLeftButton.scale.x = scale;
        this._categoryLeftButton.scale.y = scale;
    }

    static callPageArrow(plus){
        if (PopupManager.busy()){
            return;
        }
        SoundManager.playCursor();
        if( plus > 0){
            this._window.cursorRight();
        } else{
            this._window.cursorLeft();
        }
        this._window.refresh();
        this.refreshArrows();
    }
    
    static refreshArrows(){
        this._categoryRightButton.visible = (this._window.index() != 0) && (this._window._data.length != 1);
        this._categoryLeftButton.visible = (this._window.index() != (this._window._data.length-1)) && (this._window._data.length != 1);
    }

    static refreshArrowsCursor(){
        this._window.refresh();
        this.refreshArrows();
    }
}