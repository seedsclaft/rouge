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
            case TacticsCommand.DecideCommand:
                return this.commandDecideCommand();
            case TacticsCommand.SelectActor:
                return this.commandSelectActor();
            case TacticsCommand.SelectCancel:
                return this.commandSelectCancel();
            case TacticsCommand.SelectClear:
                return this.commandSelectClear();
            case TacticsCommand.SelectEnd:
                return this.commandSelectEnd();
            case TacticsCommand.DecideMember:
                return this.commandDecideMember();
            case TacticsCommand.SelectAlchemy:
                return this.commandSelectAlchemy();
            case TacticsCommand.CancelAlchemy:
                return this.commandCancelAlchemy();
            case TacticsCommand.DecideAlchemy:
                return this.commandDecideAlchemy();
            case TacticsCommand.AlchemyEnd:
                return this.commandAlchemyEnd();
            case TacticsCommand.SearchMember:
                return this.commandSearchMember();
            case TacticsCommand.Turnend:
                return this.commandTurnend();
            case TacticsCommand.EventEnd:
                return this.commandEventEnd();
        }
        this._view.clearCommand();
    }

    commandStart(){
        AudioManager.playBgm(this._model.stageBgm());
        this._view.setBackGround(this._model.backGround());
        this._view.setEnergyData(this._model.energy());
        this._view.setTurnInfoData(this._model.turnInfo());
        const _speiteList = this._model.actorSpriteList();
        this._view.setActorSpriteList(_speiteList);
        this._view.setSelectActor(_speiteList);
        this._view.setCommandData(this._model.commandList());
        this._view.createObjectAfter();
        this._view.setMagicCategory(this._model.magicCategory());
        this._view.setAlchemyMagicList(this._model.alchemyMagicList());
        this._view.setSearchList(this._model.searchList());
        
        const _event = this._model.eventCheck();
        if (_event){
            EventManager.setup(_event,() => this._view.enentEnd());
            EventManager.resetup();
            this._view.eventStart();
        }
        if (DataManager.isEventTest()){
            EventManager.setupTest($testEvent);
            EventManager.resetup();
            this._view.eventStart();
        }
    }

    commandDecideCommand(){;
        const _category = this._view.selectCategory();
        const _selected = this._model.selectedData(_category);
        switch (_category){
            case TacticsCommandType.Search:
                if (_selected.length == 0){
                    return this._view.commandCommandSearch();
                }
                break;
            case TacticsCommandType.Turnend:
                return this._view.commandCommandTurnend();
            case TacticsCommandType.Status:
                const _actorList = this._model.actorList();
                PopupStatus_View.setData(_actorList,() => {
                    PopupStatus_View.close();
                    this.commandSelectCancel();
                });
                return;
        }
        if (this._model.decidedAll() && _selected.length == 0){
            this._view.commandSelectCancel(false);
            return;
        }
        this._view.commandDecideCommand(_selected.length == 0,this._model.selectedActorNameList(_category),_category);
   }

    commandSelectActor(){
        const _actorId = this._view.selectActorId();
        const _category = this._view.selectCategory();
        const _isSelected = this._model.isSelectedActor(_category,_actorId);
        const _needEnergy = this._model.needTrainEnergy(_category,_actorId);
        if (!_isSelected){
            if (_category == TacticsCommandType.Search || _category == TacticsCommandType.Alchemy){
                this._model.addSelectData(_category,_actorId);
                this._view.commandSelectOk(_isSelected,true);
            } else{
                if (this._model.energy() >= _needEnergy){
                    this._model.addSelectData(_category,_actorId);
                    this._model.loseEnergy(_needEnergy);
                    this._model.decidedMember(_category);
                    this._view.changeEnergyValue(_needEnergy * -1);
                    this._view.commandSelectActor([_actorId]);
                    if (this._model.decidedAll()){
                        this._view.commandDecideMember([]);
                        this.commandSelectCancel();
                    } else{
                        this._view.commandDecideCommand(true,null,_category);
                    }
                } else{
                    this._view.commandSelectOk(_isSelected,false);
                }
            }
        } else{
            this._model.removeSelectData(_category,_actorId);
            this._view.commandSelectOk(_isSelected,true);
        }
        if (_category == TacticsCommandType.Search){
            const _serach = this._view.selectSearch();
            this._model.setSearchData(_serach);
        }
        if (_category == TacticsCommandType.Alchemy){
            this._view.commandShowAlchemy(this._model.alchemyMagicList());
        }
    }

    commandSelectCancel(){
        const _category = this._view.selectCategory();
        if (_category == TacticsCommandType.Alchemy){
            const _actorId = this._view.selectActorId();
            this._model.removeSelectData(_category,_actorId);
        }
        this._view.commandSelectCancel(this._model.selectedData(_category).length > 0,this._model.selectedActorNameList(_category));
    }

    commandSelectClear(){
        const _category = this._view.selectCategory();
        const _selected = this._model.selectedData(_category);

        let needEnergy = this._model.needEnergy(_category,_selected);

        if (needEnergy != 0){
            this._model.gainEnergy(needEnergy);
            this._view.changeEnergyValue(needEnergy);
        }
        this._model.clearSelectData(_category);
        this._view.commandSelectClear(_selected,this._model.actorSpriteList());
    }

    commandSelectEnd(){
    }

    commandDecideMember(){
        const _category = this._view.selectCategory();
        this._model.decidedMember(_category);
        this._view.commandDecideMember(this._model.selectedData(_category));

        if (this._model.decidedAll()){
            this._view.commandCommandTurnend();
        }
    }
    
    commandSelectAlchemy(){
        const _alchemy = this._view.selectAlchemy();
        const _isEnableAlchemy = this._model.isEnableAlchemy(_alchemy);
        if (_isEnableAlchemy){
            //this._model.addAlchemy(_alchemy);
            //this._view.changeEnergyValue(_alchemy.cost * -1);
        }
        const _actorId = this._view.selectActorId();
        this._view.commandSelectAlchemy(_isEnableAlchemy,_actorId,_alchemy.skill.id);
    }

    commandCancelAlchemy(){
        this._view.commandCancelAlchemy();
    }

    commandDecideAlchemy(){
        const _alchemy = this._view.selectAlchemy();
        const _actorId = this._view.selectActorId();
        this._model.addAlchemy(_actorId,_alchemy);
        this._view.changeEnergyValue(_alchemy.cost * -1);

        const _category = this._view.selectCategory();
        this._model.decidedMember(_category);
        this._view.commandDecideMember(this._model.selectedData(_category));

        if (this._model.decidedAll()){
            this._view.commandCommandTurnend();
        } else{
            this._view.commandDecideCommand(true);
        }
    }

    commandSearchMember(){;
        const _category = this._view.selectCategory();
        const _selected = this._model.selectedData(_category);
        this._view.commandDecideCommand(_selected.length == 0,this._model.selectedActorNameList(_category));
    }

    commandTurnend(){
        this._model.turnend();
        SceneManager.goto(Strategy_View);
    }

    commandEventEnd(){
        SceneManager.goto(Tactics_View);
    }

    commandRefresh(){
        this._view.refresh(this._model.refreshData());
    }
}