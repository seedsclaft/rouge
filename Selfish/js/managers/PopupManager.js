class PopupManager {
    constructor(){
    }

    static setPopup(mainText,option) {
        if (this._busy){
            return;
        }
        if (this._window && this._window.parent){
            this._window.parent.removeChild(this._window);
        }
        this._window = new Window_Confirm();
        SceneManager._scene.addChild(this._window);

        let useOpt = { ...popupOption, ...option };
        this._window.initHandlers();
        this._window.setMainText(mainText);
        this._window.setSubText(useOpt.subText);
        this._window.select(useOpt.select);
        this._endCall = useOpt.endCall;
    }

    static open(){
        if (this._busy){
            return;
        }
        this._window.refresh();
        this._window.show();
        this._window.open();
        this._window.activate();
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
        await this.setWait(150);
        this._busy = false;
        if (action){
            action();
        }
    }
    
    static setWait (num){
        return new Promise(resolve => {
            const delayTime = num
            setTimeout(() => {
              return resolve()
            }, delayTime)
        });
    }
    
    static busy(){
        return this._busy;
    }

    static openBattleLose(okHandler,cancelHandler){
        const mainText = TextManager.getText(620000);
        const text1 = TextManager.getText(620100);
        const text2 = TextManager.getText(620200);
        this.setPopup(mainText,{select:0});
        this.setHandler(text1,'ok',() => {
            if (okHandler) okHandler();
        });
        this.setHandler(text2,'cancel',() => {
            if (cancelHandler) cancelHandler();
        });
        this.open();
    }

    static openChallengeLose(okHandler){
        const mainText = TextManager.getText(900800);
        const text1 = TextManager.getText(100);
        this.setPopup(mainText,{select:0});
        this.setHandler(text1,'ok',() => {
            if (okHandler) okHandler();
        });
        this.open();
    }

    static openPopupSupport(okHandler,cancelHandler){
        const mainText = TextManager.getText(210700);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const subText = TextManager.getText(210701);
        this.setPopup(mainText,{select:1,subText:subText});
        this.setHandler(text1,'ok',() => {
            if (okHandler) okHandler();
        });
        this.setHandler(text2,'cancel',() => {
            if (cancelHandler) cancelHandler();
        });
        this.open();
    }

    static openPopupSaveActor(okHandler){
        const mainText = TextManager.getText(900600);
        const subText = TextManager.getText(900601);
        const text1 = TextManager.getText(120);
        this.setPopup(mainText,{subText:subText});
        this.setHandler(text1,'ok',() => {
            if (okHandler) okHandler();
        });
        this.open();
    }

    static openPopupLoadActor(okHandler){
        const mainText = TextManager.getText(900700);
        const text1 = TextManager.getText(120);
        this.setPopup(mainText);
        this.setHandler(text1,'ok',() => {
            if (okHandler) okHandler();
        });
        this.open();
    }

    static openHelpCheck(okHandler,cancelHandler){
        const mainText = TextManager.getText(1300010);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        //const subText = TextManager.getText(210301);
        this.setPopup(mainText,{select:1});
        this.setHandler(text1,'ok',() => {
            if (okHandler) okHandler();
        });
        this.setHandler(text2,'cancel',() => {
            if (cancelHandler) cancelHandler();
        });
        this.open();
    }

    static openSaveSuccess(okHandler){
        const mainText = TextManager.getText(201800);
        const text1 = TextManager.getText(120);
        this.setPopup(mainText,{select:0});
        this.setHandler(text1,'ok',() => {
            if (okHandler) okHandler();
        });
        this.open();
    }
}

const popupOption = {
    subText : "",
    select : 0,
    endcall : null
};