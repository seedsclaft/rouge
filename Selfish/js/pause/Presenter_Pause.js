class Presenter_Pause {
    constructor(){
    }

    static open() {
        if (this._busy){
            return;
        }
        this._window = new Window_Pause(0,0,Graphics.boxWidth,Graphics.boxHeight);
        SceneManager._scene.addChild(this._window);
        this._window.open();
        this._busy = true;
    }
    
    static close() {
        if (!this._busy){
            return;
        }
        this._window.close();
        this._busy = false;
        this._window.destroy();
    }
    
    static busy(){
        return this._busy;
    }
}