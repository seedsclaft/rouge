class PopupErrorManager {
    constructor(){
    }

    static init (){
        this._window = new Window_Confirm();
        this._editBox = new EditBoxTextImpl(360,120,640,80);
        this._busy = false;
    }

    static setErrorMessage(error) {
        if (!this._isInit){
            this.init();
        }
        this._isInit = true;
        if (this._busy){
            return;
        }
        let children = SceneManager._scene.children;
        for (var i = children.length ; 0 <= i ; i--){
            SceneManager._scene.removeChild(children[i]);
        }
        SceneManager._scene.removeChild(EventManager._eventView);
        gsap.globalTimeline.pause();
        WebAudio._onHide();
        if (this._window && this._window.parent){
            this._window.parent.removeChild(this._window);
        }
        SceneManager._scene.addChild(this._window);
        this._window.y = -24;
        this._window.initHandlers();
        let mainText = $dataOption.getUserData("language") == LanguageType.Japanese ? "エラーしてしまいました…。ログを送りますか？" : "Oops... Send error message?"
        this._window.setMainText(mainText);
        this._window.select(0);
        this._editBox.setMaxLength(200);
        this._editBox.readOnly = true;
        this._editBox.activate();
        let errorMessage;
        String(error).split("\n").forEach(element => {
            errorMessage += element + "\n";
        });

        this._editBox._edTxt.value = errorMessage;
        this._window.setHandler("ok",  () => {
            this.senderror();
        });
        this._window.setHandler("cancel",  () => {
            this.endGame();
        });
        let sendText = $dataOption.getUserData("language") == LanguageType.Japanese ? "ログを送る" : "Yes, Send";
        let sendNotText = $dataOption.getUserData("language") == LanguageType.Japanese ? "ゲームを終了" : "No, ShutDown";
        
        this._window.setCommandText("ok", sendText);
        this._window.setCommandText("cancel", sendNotText);
        this._window.refresh();
        this._window.show();
        this._window.open();
        this._window.activate();
    }

    static senderror(){
        FireStoreUtility.sendErrorMessage(this._editBox._edTxt.value);
        this._window.setHandler("ok",  () => {
            this.endGame();
        });
        let thanksText = $dataOption.getUserData("language") == LanguageType.Japanese ? "ありがとう！" : "Thanks!";
        let sendNotText = $dataOption.getUserData("language") == LanguageType.Japanese ? "ゲームを終了" : "ShutDown Game";
        
        this._window.setCommandText("ok", thanksText);
        this._window.setCommandText("cancel", sendNotText);
        this._window.refresh();
        this._window.show();
        this._window.open();
        this._window.activate();
    }

    static endGame(){
        EventManager.shutdown();
    }

    static open(){
        if (this._busy){
            return;
        }
        this._window.refresh();
        this._window.show();
        this._window.open();
        this._window.activate();
        this._editBox.activate();
        this._busy = true;
    }
    
    static setSelect(num){
        this._window.select(num);
        this._window.refresh();
    }
    
    static setHandler(text,key,action){
        this._window.setHandler(key,  () => {
            this.close(action);
        });
        this._window.setCommandText(key, text);
    }
    
    static async close(action) {
        this._window.close();
        this._window.deactivate();
        this._lastInputText = this._editBox._edTxt.value;
        this._editBox.close();
        this._editBox.deactivate();
        await this.setWait(100);
        this._busy = false;
        if (action){
            action();
        }
    }

    static getInputText(){
        if (this._lastInputText){
            return this._lastInputText;
        }
        return this._editBox._edTxt.value;
    }
    
    static setWait (num){
        return new Promise(resolve => {
            const delayTime = num
            setTimeout(() => {
              return resolve()
            }, delayTime)
          })
    }
    
    static busy(){
        return this._busy;
    }

    static setFocus(){
        this._editBox.focus();
    }

    static update(){
        if (this._editBox && this._editBox._edTxt){
            this._editBox._update();
        }
    }

    static inputFileName(okHandler){
        const mainText = TextManager.getText(210400);
        PopupInputManager.setInputPopup(mainText,null,0,null,14);
        PopupInputManager.setHandler(TextManager.getText(840),'ok',() => {
            if (okHandler){
                okHandler();
            }
        });
        PopupInputManager.open();
    }
}