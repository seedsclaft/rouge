class PopupStageInfoManager {
    constructor(){
    }

    static setPopup(){
        if (this._busy){
            return;
        }
        this._backSprite = new ScreenSprite();
        this._backSprite.setColor(0, 0, 0);
        this._window = new Window_StageInfo(160,80,640,400);
        SceneManager._scene.addChild(this._backSprite);
        SceneManager._scene.addChild(this._window);
    }

    static open(){
        if (this._busy){
            return;
        }
        gsap.to(this._backSprite,0.5,{opacity:128});
        const stageData = DataManager.getStageInfos($gameParty.stageNo());
        this._window.refresh(stageData);
        this._window.alpha = 0;
        this._window.show();
        this._window.open();
        this._window.activate();
        this._window.selectLast();
        gsap.to(this._window,0.5,{alpha:1});
        this._busy = true;
    }

    static setHandler(key,action){
        this._window.setHandler(key,  () => {
            this.close(action);
        });
    }

    static async close(action){
        gsap.to(this._backSprite,0.5,{opacity:0});
        this._window.close();
        this._window.deactivate();
        this._busy = false;
        await this.setWait(150);
        if (action){
            action();
        }
        if (this._window && this._window.parent){
            this._window.parent.removeChild(this._backSprite);
            this._window.parent.removeChild(this._window);
        }
        gsap.killTweensOf(this._backSprite);
        gsap.killTweensOf(this._window);
        this._backSprite.destroy();
        this._window.destroy();
        this._backSprite = null;
        this._window = null;
    }

    static setWait(num){
        return new Promise(resolve => {
            const delayTime = num;
            setTimeout(() => {
                return resolve()
            }, delayTime)
        })
    }
    
    static busy(){
        return this._busy;
    }

    static popupStageInfo(endCall){
        this.setPopup();
        this.setHandler('ok',() => {
            if (endCall) endCall();
        });
        this.setHandler('cancel',() => {
            if (endCall) endCall();
        });
        this.open();
    }
}