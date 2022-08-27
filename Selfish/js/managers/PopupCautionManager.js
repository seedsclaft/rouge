class PopupCautionManager {
    constructor(){
    }

    static setPopup(mainText,endCall) {
        if (this._busy){
            return;
        }
        if (this._window && this._window.parent){
            this._window.parent.removeChild(this._window);
        }
        this._window = new Window_Caution(mainText,-60,184,1080,160);
        SceneManager._scene.addChild(this._window);
        this._endCall = endCall;
    }

    static open(){
        if (this._busy){
            return;
        }
        this._window.show();
        this._window.open();
        this._window.activate();
        this._busy = true;
    }

    static async openClose(action){
        if (this._busy){
            return;
        }
        this._window.show();
        this._window.open();
        this._window.activate();
        this._busy = true;
        const self = this;
        gsap.to(this._window,0.4,{alpha:0,delay:0.6,onComplete:function(){
            self._window.destroy();
            self._window = null;
            self._busy = false;
            if (action){
                action();
            }
        } }); 
    }
    
    static async close(action) {
        if (this._window == null){
            return;
        }
        this._window.close();
        this._window.deactivate();
        await this.setWait(150);
        this._window.destroy();
        this._window = null;
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
        })
    }
    
    static busy(){
        return this._busy;
    }
}