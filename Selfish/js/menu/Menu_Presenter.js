class Menu_Presenter extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new Menu_Model();
        this.setEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }


    commandPopScene(){
        if (EventManager.busy()){
            return;
        }
        this._view.popScene();
    }

    updateCommand(){
        super.updateCommand();
        const _currentCommand = this._view._command.pop();
        switch (_currentCommand){
            case MenuCommand.Start:
            return this.commandStart();
            case MenuCommand.SelectStage:
            return this.commandSelectStage();
        }
        this._view.clearCommand();
    }

    commandStart(){
        AudioManager.playBgm(this._model.menuBgm());
        this._view.setBackGround(this._model.backGround());
        this._view.setStageData(this._model.stageData());
        this._view.commandStart();
    }

    commandSelectStage(){
        const _stage = this._view.selectStage();
        this._model.selectStage(_stage);
        
        SceneManager.goto(Tactics_View);
        FilterMzUtility.removeFilter(FilterType.OldFilm);
    }

}