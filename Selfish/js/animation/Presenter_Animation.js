class Presenter_Animation extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new Model_Animation();
        this.setEvent();
        this.start();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    start(){
        this._isReady = true;
    }

    isReady(){
        return this._isReady;
    }

    updateCommand(){
        switch (this._view._command){
            case AnimationCommand.Start:
            return this.commandStart();
            case AnimationCommand.ChangeSelect:
            return this.commandChangeSelect();
        }
        this._view.clearCommand();
    }
    commandStart(){
        const data = this._model.animationData;
        this._view.setData(data);
    }
    commandChangeSelect(){
        const item = this._view._listWindow.item();
        if (item){
            const id = item.id;
            const animationData = this._model.getAnimationById(id);
            this._view.playAnimation(animationData);
        }
    }
    update(){
    }

    static animationDebug(){
        SceneManager.goto(Animation_Scene);
    }
}