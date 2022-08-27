class Presenter_Fade {
    constructor(){
    }
    static init (){
        this._window = new ScreenSprite();
        this._window.alpha = 0;
        this._busy = false;
        this._endCall = null;
    }

    static async fadein(duration) {
        if (this._busy){
            return;
        }
        this.init();
        if (this._window && this._window.parent){
            this._window.parent.removeChild(this._window);
        }
        SceneManager._scene.addChild(this._window);
        gsap.to(this._window,duration,{alpha:1});
        this._busy = false;
    }

    static async fadeout(duration, resolve) {

        const self = this;
        gsap.to(this._window,duration,{alpha:0,onComplete:function(){
            self._busy = false;
            if (self._window && self._window.parent){
                self._window.parent.removeChild(self._window);
                self._window.destroy();
            }
        }});
    }

    static async setWait(duration) {
        return new Promise(resolve => {
            const delayTime = duration;
            setTimeout(() => {
              return resolve();
            }, delayTime)
          })
    }
    
    static busy(){
        return this._busy;
    }
}