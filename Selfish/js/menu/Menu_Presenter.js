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
            case MenuCommand.ActorSelect:
            return this.commandActorSelect();
            case MenuCommand.ActorSelectEnd:
            return this.commandActorSelectEnd();
            case MenuCommand.StageStart:
            return this.commandStageStart();
        }
        this._view.clearCommand();
    }

    commandStart(){
        AudioManager.playBgm(this._model.menuBgm());
        this._view.setBackGround(this._model.backGround());
        this._view.setStageData(this._model.stageData());
        this._view.commandStart();
        FilterMzUtility.addFilter(FilterType.OldFilm);
    }

    commandSelectStage(){
        const _stage = this._view.selectStage();
        this._model.selectStage(_stage);
        this._view.commandSelectStage();
    }

    commandActorSelect(){
        FilterMzUtility.removeFilter(FilterType.OldFilm);
        const _actorList = this._model.actorList();
        this._view.commandActorSelect(_actorList);
    }

    commandActorSelectEnd(){
        const _actor = this._view.selectedActor();
        this._model.setStageActor(_actor);
        const _stage = this._view.selectStage();
        this._view.commandActorSelectEnd(_actor.name(),TextManager.getText(_stage.titleTextId));
    }

    commandStageStart(){
        SceneManager.goto(Tactics_View);
    }
}