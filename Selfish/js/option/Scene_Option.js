class Scene_Option {
    constructor(){
    }

    static init (){
        this._presenter = null;
        this._window = null;
        this._busy = false;
        this._endCall = null;
    }

    static setPopup(endCall,sceneIndex) {
        if (this._busy){
            return;
        }

        this.createControlWindow(sceneIndex);
        //this.createMessageWindow(sceneIndex);
        this.createOptionCategory(sceneIndex);
        this.createOptionWindow(sceneIndex);
        this.createBackSprite(sceneIndex);

        this._presenter = new Presenter_Option(this);
        this._endCall = endCall;
        this._busy = true;
    }

    static createBackSprite(sceneIndex){
        this._backSprite = new Sprite();
        var bitmap = new Bitmap(960,540);
        bitmap.fillRect(0,0,960,540,"rgba(0,0,0,0.5)" );
        this._backSprite.bitmap = bitmap;
        SceneManager._scene.addChildAt(this._backSprite,sceneIndex);
    }

    static createOptionCategory(sceneIndex){
        this._categoryWindow = new Window_OptionCaterogy(64,120);
        this._categoryWindow.setHandler('ok', this.onCategory.bind(this));
        this._categoryWindow.setHandler('cancel', this.cancelCategory.bind(this));
        this._categoryWindow.setHandler('index', this.changeCategoryIndex.bind(this));
        SceneManager._scene.addChildAt(this._categoryWindow,sceneIndex);
    }

    static createOptionWindow(sceneIndex){
        this._optionWindow = new Window_OptionList(320,120);
        this._optionWindow.setHandler('ok', this.onControlOption.bind(this));
        this._optionWindow.setHandler('cancel', this.cancelOption.bind(this));
        this._optionWindow.setHandler('index', this.changeOptionIndex.bind(this));
        this._optionWindow.setHandler('right', this.onOptionGain.bind(this));
        this._optionWindow.setHandler('left', this.onOptionLess.bind(this));
        SceneManager._scene.addChildAt(this._optionWindow,sceneIndex);
    }

    /*
    static createMessageWindow(sceneIndex){
        this._messageWindow = new Window_Base(new Rectangle( 240 ,400, 512, 48 ));
        SceneManager._scene.addChildAt(this._messageWindow,sceneIndex);
        this._messageWindow.padding = 4;
        this._messageWindow.hide();
    }
    */

    static createControlWindow(sceneIndex){
        this._controlOptionWindow = new Window_OptionKeyAssign(320,120);
        this._controlOptionWindow.setHandler('ok', this.onKeyChange.bind(this));
        this._controlOptionWindow.setHandler('cancel', this.cancelControlOption.bind(this));
        SceneManager._scene.addChildAt(this._controlOptionWindow,sceneIndex);
    }

    static setOptionList(data){
        this._optionWindow.setData(data);
    }

    static setOptionCategory(category){
        this._categoryWindow.setData(category);
    }

    static windowInitilize(){
        this._optionWindow.deactivate();
        this._categoryWindow.activate();
    }

    static onCategory(){
        this._optionWindow.activate();
        this._optionWindow.select(0);
    }

    static cancelCategory(){
        this._categoryWindow._helpWindow.contents.clear();
        if (this._backButton){
            this._backButton.hide();
        }
        if (this._menuButton){
            this._menuButton.hide();
        }
        if (this._keyHelpWindow){
            this._keyHelpWindow.hide();
        }
        this.terminate();
        if (this._endCall){
            this._endCall();
            this._endCall = null;
            this._busy = false;
        }
    }

    static changeCategoryIndex(){
        this.setCommand(OptionCommand.Category);
    }

    static onOptionGain(){
        this.setCommand(OptionCommand.OptionGain);
    }

    static onOptionLess(){
        this.setCommand(OptionCommand.OptionLess);
    }
    
    static onControlOption(){
        switch (this._optionWindow.currentSymbol()){
            case 'initialize':
                this._optionWindow.deactivate();
                this.openPopupInitialize();
                break;
            case 'messageTweet':
                this._optionWindow.deactivate();
                this.openPopupMessageTweet();
                break;
            case 'credit':
                this._optionWindow.deactivate();
                this.openPopupCredit();
                break;
            case 'support':
                this._optionWindow.deactivate();
                this.openPopupSupport();
                break;
            case 'datatransport':
                this._optionWindow.deactivate();
                this.openPopupDataTransport();
                break;
            case 'controlType':
                this.onKeyOption();
                break;
            default:
                this.onOptionGain();
                break;
        }
    }

    static onKeyOption(){
        this.setCommand(OptionCommand.KeyAssign);
    }

    static commandKeyAssign(keyAssign){
        $gameMessage.clear();
        ConfigManager.save();
        this.closeMessage();
        this._optionWindow.hide();
        this._optionWindow.deactivate();
        this._controlOptionWindow.show();
        this._controlOptionWindow.activate();
        this._controlOptionWindow.setData(keyAssign);
        this._controlOptionWindow.selectLast();
    }

    static onKeyChange(){
        this.setCommand(OptionCommand.KeyChange);
    }

    static commandKeyChange(){
        Input.clear();
        this._waitAssign = true;
        const mainText = TextManager.getText(51910);
        
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:-1});
        _popup.open();
    }

    static cancelOption(){
        if (this._creditWindow != null && this._creditWindow.active){
            this._creditWindow.close();
            this._creditWindow.deactivate();
            this._optionWindow.activate();
            return;
        }
        if (this._controlOptionWindow.active){
            this.cancelControlOption();
            return;
        }
        if (this._categoryWindow.active){
            this.cancelCategory();
            return;
        }
        $gameMessage.clear();
        ConfigManager.save();
        this._categoryWindow.activate();
        this._optionWindow.deactivate();
        this._optionWindow.deselect();
        
        this.closeMessage();
    }

    static changeOptionIndex(){
        const symbol = this._optionWindow.currentSymbol();
        if (symbol == 'messageSpeed'){
            this.closeMessage();
            this.startMessage();
        } else{
            this.closeMessage();
        }
        if (symbol == 'controlType'){
            this._keyHelpWindow.refresh("menuKeyOption");
        } else{
            this._keyHelpWindow.refresh("menuOption");
        }
    }

    static startMessage(){
        this._messageWindow.show();
        this._messageIndex = 0;
        this._waitCount = 4 - $dataOption.getUserData("messageSpeed");
        this._messageTime = new TimelineMax();
        let self = this;
        this._messageTime.to(this._messageWindow, 2.5, {
            repeat:-1,
            onRepeat:function(){
                self._messageIndex = 0;
            }
        })
    }

    static closeMessage(){
        if (this._messageTime){
            this._messageTime.kill();
            this._messageTime = null;
        }
        if (this._messageWindow){
            this._messageIndex = 0;
            this._waitCount = 0;
            this._messageWindow.hide();
            this._messageWindow.deactivate();
        }
    }

    static cancelControlOption(){
        this._keyHelpWindow.refresh("menuKeyOption");
        this._controlOptionWindow.hide();
        this._controlOptionWindow.deactivate();
        this._optionWindow.show();
        this._optionWindow.activate();
    }

    static openPopupInitialize(){
        const mainText = TextManager.getText(51001);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        
        const _popup = PopupManager;
        _popup.setPopup(mainText);
        _popup.setHandler(text1,'ok',async () => {   
            $dataOption.initializeSettings();
            ConfigManager.save();
            /*
            */
            //await LocalizeUtility.convertTextData();
            this._presenter.setOptionList();
            this._optionWindow.activate();
            this._categoryWindow.deactivate();
        });
        _popup.setHandler(text2,'cancel',() => {   
            this._optionWindow.activate();
        });
        _popup.open();
    }

    static openPopupMessageTweet(){
        SoundManager.playOk();
        const mainText = TextManager.getText(50801);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:1});
        _popup.setHandler(text1,'ok',() => {    
            const url = "https://twitter.com/intent/tweet?screen_name=ecoddr1";
            const platform = $gameDefine.platForm();
            if (platform == PlatForm.iOS){
                cordova.InAppBrowser.open(url,"_blank");
            } else{
                if(window.open(url,"_blank")){
                }else{
                  window.location.href = url;
                }
            }
            this._optionWindow.activate();

        });
        _popup.setHandler(text2,'cancel',() => {   
            this._optionWindow.activate();
        });
        _popup.open();
    }

    static openPopupCredit(){
    }

    static openPopupSupport(){
        SoundManager.playOk();
        PopupManager.openPopupSupport(() => {
            const url = "https://message.blogcms.jp/livedoor/ecoddr3/message2";
            const platform = $gameDefine.platForm();
            if (platform == PlatForm.iOS){
                cordova.InAppBrowser.open(url,"_blank");
            } else{
                if(window.open(url,"_blank")){
                }else{
                  window.location.href = url;
                }
            }
            this._optionWindow.activate();
        },
        () =>{
            this._optionWindow.activate();
        });
    }

    static openPopupDataTransport(){
    }

    static inputFileName(){
        PopupInputManager.inputFileName(() => {
            this._fileName = PopupInputManager.getInputText();
            this.setCommand(OptionCommand.DataTransport);
        });
    }


    static terminate(){
        this.closeMessage();
        if (this._optionWindow){
            SceneManager._scene.removeChild(this._optionWindow);
            this._optionWindow.destroy();
            this._optionWindow = null;
        }
        if (this._messageWindow){
            SceneManager._scene.removeChild(this._messageWindow);
            this._messageWindow.destroy();
            this._messageWindow = null;
        }
        if (this._controlOptionWindow){
            SceneManager._scene.removeChild(this._controlOptionWindow);
            this._controlOptionWindow.destroy();
            this._controlOptionWindow = null;
        }
        if (this._categoryWindow){
            SceneManager._scene.removeChild(this._categoryWindow);
            this._categoryWindow.destroy();
            this._categoryWindow = null;
        }
        if (this._backSprite){
            this._backSprite.destroy();
            this._backSprite = null;
        }
        if (this._creditWindow){
            SceneManager._scene.removeChild(this._creditWindow);
            this._creditWindow.destroy();
            this._creditWindow = null;
        }
    }

    static setBackButton(backButton){
        this._backButton = backButton;
        this._backButton.setup(TextManager.getBackText());
        this._backButton.setClickHandler(() => {
            if (PopupInputManager.busy()){
                return;
            }
            SoundManager.playCancel();
            this.cancelOption();
        });
    }

    static setMenuButton(menuButton){
        this._menuButton = menuButton;
    }

    static setKeyHelpWindow(keyMapWindow){
        this._keyHelpWindow = keyMapWindow;
        this._controlOptionWindow.setKeyHelpWindow(keyMapWindow);
    }

    static setHelpWindow(helpWindow){
        this._categoryWindow.setHelpWindow(helpWindow);
        this._optionWindow.setHelpWindow(helpWindow);
    }
    
    static busy(){
        return this._busy;
    }

    static setEvent (command) {
        this._commandUpdate = command;
    }
    
    static setCommand (command) {
        this._command = command;
        this._commandUpdate();
    }
    
    static clearCommand () {
        this._command = null;
        TouchInput.clear();
    }

    static commandOptionGain(symbol){
        SoundManager.playCursor();
        this._optionWindow.redrawItem(this._optionWindow.findSymbol(symbol));
        this._optionWindow.activate();
        if (symbol == 'controlType'){
            this._keyHelpWindow.refresh("menuKeyOption");
        } else{
            this._keyHelpWindow.refresh("menuOption");
        }
        if (symbol == 'messageSpeed'){
            this.closeMessage();
            this.startMessage();
        } else{
            this.closeMessage();
        }
    }

    static commandKeyDecide(){
        Input.clear();
        PopupManager.close();
        this._keyHelpWindow.refresh("menuKeyOption");
    }

    static update(){
        if (this._waitAssign && Input._latestKey){
            this._waitAssign = false;
            this.setCommand(OptionCommand.KeyDecide);
        }
        this.updateWaitCount();
    }

    static updateWaitCount(){
        if (this._waitCount > 0){
            this._waitCount -= 1;
            if (this._waitCount == 0){
                this._messageIndex += 1;
                this._waitCount = 4 - $dataOption.getUserData("messageSpeed");
                let dispText = "";
                TextManager.getText(50260).split("").forEach((element,index) => {
                    if (index < this._messageIndex){
                        dispText += element;
                    }
                });;
                this._messageWindow.createContents();
                this._messageWindow.drawText(dispText,8,0,480,48);
            }
        }
    }
}

const OptionCommand = {
    Category : 1,
    Option : 2,
    OptionGain : 11,
    OptionLess : 12,
    KeyAssign : 21,
    KeyChange : 22,
    KeyDecide : 23,
    DataTransport : 31
}