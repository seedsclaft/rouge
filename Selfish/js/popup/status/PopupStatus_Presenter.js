class PopupStatus_Presenter extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new PopupStatus_Model();
        this.setEvent();
        this.setSwipEvent();
        this.setSwipEndEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    setSwipEvent(){
        this._view.setSwipEvent(this.updateSwipEvent.bind(this));
    }

    setSwipEndEvent(){
        this._view.setSwipEndEvent(this.updateSwipEndEvent.bind(this));
    }

    updateSwipEvent(swipX,swipY,lastswipX,lastswipY){
    }

    updateSwipEndEvent(swipX,swipY,lastswipX,lastswipY){
    }

    updateCommand(){
        super.updateCommand();
        const _currentCommand = this._view._command.pop();
        switch (_currentCommand){
            case PopupStatusCommand.Start:
                return this.commandStart();
            case PopupStatusCommand.Select:
                return this.commandSelect();
            case PopupStatusCommand.Refresh:
                return this.commandRefresh();
        }
        this._view.clearCommand();
    }

    commandStart(){
        this._view.setActorData(this._model.actorList());
    }

    commandSelect(){
        const _currentActorId = this._view.currentActorId();
        this._model.selectActor(_currentActorId);
    }

    commandRefresh(){
        this._view.refresh(this._model.refreshData());
    }

}