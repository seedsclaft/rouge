class MemberSelect_Presenter extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new MemberSelect_Model();
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
        var swipEneble = this._view._statusWindow.active && lastswipX > 240 && lastswipX < 960;
        if (swipEneble){
            this._view.swipHelp(swipX);
        }
    }

    updateSwipEndEvent(swipX,swipY,lastswipX,lastswipY){
        if (swipX < 100 && swipX > -100){
            this._view.swipEndHelp(swipX);
        } else
        if (swipX >= 100){
            this.commandNextHelpStatus(1);
            this._view.swipEndHelp(swipX);
        } else
        if (swipX <= -100){
            this.commandNextHelpStatus(-1);
            this._view.swipEndHelp(swipX);
        }
        this._view.swipReset();
        this._lastSkillSwipX = null;
    }

    updateCommand(){
        super.updateCommand();
        const _currentCommand = this._view._command.pop();
        switch (_currentCommand){
            case MemberSelectCommand.Start:
                return this.commandStart();
            case MemberSelectCommand.Select:
                return this.commandSelect();
            case MemberSelectCommand.Refresh:
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