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
            case StrategyCommand.AlchemyResult:
                return this.commandAlchemyResult();
            case StrategyCommand.RecoveryResult:
                return this.commandRecoveryResult();
            case StrategyCommand.BattleStart:
                return this.commandBattleStart();
            case StrategyCommand.MagicResult:
                return this.commandMagicResult();
        }
        this._view.clearCommand();
    }

    commandStart(){
        this._view.createObjectAfter();
        this.commandTrainStart();
    }

    commandTrainStart(){
        const _selected = this._model.selectedMember();
        if (_selected.length > 0){
            PopupLevelUpManager.init();
            this._view.commandTrainStart(_selected);
        } else{
            this._model.commandNext();
            this.commandAlchemyStart();
        }
    }

    commandTrainResult(){
        const _lvUpData = this._model.train();
        this._view.commandTrainResult(_lvUpData);
    }

    commandAlchemyStart(){
        const _selected = this._model.selectedMember();
        if (_selected.length > 0){
            const _alchemyName = this._model.alchemyNameList();
            this._model.alchemy();
            this._view.commandAlchemyStart(_alchemyName);
        } else{
            this._model.commandNext();
            this.commandRecoveryStart();
        }
    }

    commandAlchemyResult(){
        this._model.commandNext();
        this.commandRecoveryStart();
    }

    commandRecoveryStart(){
        const _selected = this._model.selectedMember();
        if (_selected.length > 0){
            const _recoveryName = this._model.recoveryNameList();
            this._model.recovery();
            this._view.commandRecoveryStart(_recoveryName);
        } else{
            this._model.commandNext();
            this.commandSearchStart();
        }
    }

    commandRecoveryResult(){
        this._model.commandNext();
        this.commandSearchStart();
    }

    commandSearchStart(){
        const _selected = this._model.selectedMember();
        if (_selected.length > 0){
            this._view.commandSearchStart();
        } else{
            this._model.commandNext();
            this.commandMagicStart();
        }
    }

    commandBattleStart(){
        this._model.battleStart();
        SceneManager.push(Battle_View);
    }

    commandMagicStart(){
        const _selected = this._model.selectedMember();
        if (_selected.length > 0){
            const _recoveryName = this._model.magicRecoveryNameList();
            this._model.magicRecovery();
            this._view.commandMagicStart(_recoveryName);
        } else{
            this._model.turnend();
            SceneManager.goto(Tactics_View);
        }
    }

    commandMagicResult(){
        this._model.turnend();
        SceneManager.goto(Tactics_View);
    }

    commandRefresh(){
        this._view.refresh(this._model.refreshData());
    }
}