class Presenter_Loading {
    constructor(){
    }
    static init (){
        this._window = null;
        this._busy = false;
        this._endCall = null;
    }

    static open() {
        if (this._busy){
            return;
        }
        this._window = new Window_Loading(0,0,Graphics.boxWidth,Graphics.boxHeight);
        SceneManager._scene.addChild(this._window);
        this._window.open();
        this._busy = true;
    }
    
    static close(action) {
        if (!this._busy){
            return;
        }
        this._window.close();
        this._busy = false;
        if (action){
            action();
        }
        this._window.destroy();
    }

    static refreshProgress(value){
        if (!this._busy){
            return;
        }
        this._window.refreshProgress(value);
    }
    
    static busy(){
        return this._busy;
    }
}