class Strategy_Presenter extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new Strategy_Model();
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
            case StrategyCommand.Start:
                return this.commandStart();
            case StrategyCommand.TrainStart:
                return this.commandTrainStart();
            case StrategyCommand.TrainResult:
                return this.commandTrainResult();
        }
        this._view.clearCommand();
    }

    commandStart(){
        PopupStatus_View.initialize();
        //this._view.setEnergyData(this._model.energy());
        //this._view.setTurnInfoData(this._model.turnInfo());
        //const _speiteList = this._model.actorSpriteList();
        //this._view.setActorSpriteList(_speiteList);
        //this._view.setSelectActor(_speiteList);
        //this._view.setCommandData(this._model.commandList());
        this._view.createObjectAfter();
        //this._view.setMagicCategory(this._model.magicCategory());
        //this._view.setAlchemyMagicList(this._model.alchemyMagicList());
        //this._view.setSearchList(this._model.searchList());
        this.commandTrainStart();
    }

    commandTrainStart(){
        const _before = this._model.selectedMember();
        if (_before.length > 0){
            PopupLevelUpManager.init();
            this._view.commandTrainStart(_before);
        } else{
            this.commandAlchemyStart();
        }
    }

    commandTrainResult(){
        const _lvUpData = this._model.train();
        this._view.commandTrainResult(_lvUpData);
    }

    commandAlchemyStart(){

    }

    commandRefresh(){
        this._view.refresh(this._model.refreshData());
    }
}