class Tactics_Presenter extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new Tactics_Model();
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
        /*
        var swipEneble = this._view._statusWindow.active && lastswipX > 240 && lastswipX < 960;
        if (swipEneble){
            this._view.swipHelp(swipX);
        }
        */
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
            case TacticsCommand.Start:
                return this.commandStart();
            case TacticsCommand.Train:
                return this.commandTrain();
            case TacticsCommand.SelectOk:
                return this.commandSelectOk();
            case TacticsCommand.SelectCancel:
                return this.commandSelectCancel();
            case TacticsCommand.SelectEnd:
                return this.commandSelectEnd();
        }
        this._view.clearCommand();
    }

    commandStart(){
        this._view.setEnergyData(999999);
        this._view.setTurnInfoData(this._model.turnInfo());
        const _speiteList = this._model.actorSpriteList();
        this._view.setActorSpriteList(_speiteList);
        this._view.setSelectActor(_speiteList);
        this._view.setCommandData(this._model.commandList());
        this._view.createObjectAfter();
    }

    commandTrain(){;
        this._view.commandTrain();
    }

    commandSelectOk(){
        const _actorId = this._view.selectActorId();
        const _category = this._view.selectCategory();
        const _isSelected = this._model.isSelectedActor(_category,_actorId);
        if (_isSelected){
            this._model.removeSelectData(_category,_actorId);
        } else{
            this._model.addSelectData(_category,_actorId);
        }
        this._view.commandSelectOk(_isSelected);
    }

    commandSelectCancel(){
        this._model.clearSelectData();
        this._view.commandSelectCancel();
    }

    commandSelectEnd(){
    }

    commandRefresh(){
        this._view.refresh(this._model.refreshData());
    }

}