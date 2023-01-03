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
            case TacticsCommand.CommandOk:
                return this.commandCommandOk();
            case TacticsCommand.SelectOk:
                return this.commandSelectOk();
            case TacticsCommand.SelectCancel:
                return this.commandSelectCancel();
            case TacticsCommand.SelectClear:
                return this.commandSelectClear();
            case TacticsCommand.SelectEnd:
                return this.commandSelectEnd();
            case TacticsCommand.DecideMember:
                return this.commandDecideMember();
            case TacticsCommand.AlchemySelect:
                return this.commandAlchemySelect();
            case TacticsCommand.DecideAlchemy:
                return this.commandDecideAlchemy();
            case TacticsCommand.AlchemyEnd:
                return this.commandAlchemyEnd();
            case TacticsCommand.SearchMember:
                return this.commandSearchMember();
            case TacticsCommand.Turnend:
                return this.commandTurnend();
        }
        this._view.clearCommand();
    }

    commandStart(){
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
    }

    commandCommandOk(){;
        const _category = this._view.selectCategory();
        const _selected = this._model.selectedData(_category);
        if (_category == "turnend"){
            this._view.commandCommandTurnend();
            return;
        } else
        if (_category == "status"){
            const _actorList = this._model.actorList();
            PopupStatus_View.setData(_actorList,() => {
                PopupStatus_View.close();
                this.commandSelectCancel();
            });
            return;
        } else
        if (_category == "alchemy"){
            this._view.setAlchemyParam(null);
        }
        if (_category == "search" && _selected.length == 0){
            this._view.commandCommandSearch();
            return;
        }
        const _info = this._model.infoData(_category);
        this._view.commandCommandOk(_selected.length == 0,this._model.selectedActorNameList(_category),_info);
   }

    commandSelectOk(){
        const _actorId = this._view.selectActorId();
        const _category = this._view.selectCategory();
        const _isSelected = this._model.isSelectedActor(_category,_actorId);
        if (_isSelected){
            this._model.removeSelectData(_category,_actorId);
        } else{
            this._model.addSelectData(_category,_actorId);
            if (_category == "search"){
                const _serach = this._view.selectSearch();
                this._model.setSearchId(_serach.id);
            }
        }
        if (_category == "alchemy"){
            const _alchemyParam = this._model.alchemyParam(_category);
            this._view.setAlchemyParam(_alchemyParam);
        }
        const _needEnergy = this._model.needTrainEnergy(_category,_actorId);
        if (!_isSelected){
            if (this._model.energy() >= _needEnergy){
                this._model.loseEnergy(_needEnergy);
                this._view.changeEnergyValue(_needEnergy * -1);
                this._view.commandSelectOk(_isSelected,true);
            } else{
                this._view.commandSelectOk(_isSelected,false);
            }
        } else{
            this._model.gainEnergy(_needEnergy);
            this._view.changeEnergyValue(_needEnergy);  
            this._view.commandSelectOk(_isSelected,true);
        }
    }

    commandSelectCancel(){
        const _category = this._view.selectCategory();
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

        if (_category == "alchemy"){
            this._view.commandSelectAlchemy(this._model.alchemyMagicList());
        }
    }
    
    commandAlchemySelect(){
        const _category = this._view.selectCategory();
        const _alchemy = this._view.selectAlchemy();
        const _isSelected = this._model.checkSelectedAlchemy(_alchemy.skill.id);
        let checkSelectAlchemy = false;
        if (_isSelected){
            this._model.removeAlchemy(_alchemy);
            this._view.changeEnergyValue(_alchemy.cost);
        } else
        if (!_isSelected){
            checkSelectAlchemy = this._model.checkSelectAlchemy(_category,_alchemy);
            if (checkSelectAlchemy == 0){
                this._model.addAlchemy(_alchemy);
                this._view.changeEnergyValue(_alchemy.cost * -1);
            }
        }
        const _alchemyParam = this._model.alchemyParam(_category);
        this._view.setAlchemyParam(_alchemyParam);
        this._view.commandAlchemySelect(_isSelected,checkSelectAlchemy,_alchemy.skill.id);
    }

    commandDecideAlchemy(){
        const _alchemyName = this._model.selectAlchemyName();
        this._view.commandDecideAlchemy(_alchemyName != "",_alchemyName);
    }

    commandAlchemyEnd(){
        this._model.setAlchemy();
    }

    commandSearchMember(){;
        const _category = this._view.selectCategory();
        const _selected = this._model.selectedData(_category);
        this._view.commandCommandOk(_selected.length == 0,this._model.selectedActorNameList(_category));
    }

    commandTurnend(){
        this._model.turnend();
        SceneManager.goto(Strategy_View);
    }

    commandRefresh(){
        this._view.refresh(this._model.refreshData());
    }
}