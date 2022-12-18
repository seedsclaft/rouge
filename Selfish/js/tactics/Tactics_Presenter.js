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
            case TacticsCommand.SearchMember:
                return this.commandSearchMember();
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
        this._view.setMagicCategory(this._model.magicCategory());
        this._view.setAlchemyMagicList(this._model.alchemyMagicList());
        this._view.setSearchList(this._model.searchList());
    }

    commandCommandOk(){;
        const _category = this._view.selectCategory();
        const _selected = this._model.selectedData(_category);
        if (_category == "status"){
            SceneManager.push(MemberSelect_View);
        } else
        if (_category == "search" && _selected.length == 0){
            this._view.commandCommandSearch();
        } else{
            this._view.commandCommandOk(_selected.length == 0,this._model.selectedActorNameList(_category));
        }
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
        const _category = this._view.selectCategory();
        this._view.commandSelectCancel(this._model.selectedData(_category).length > 0,this._model.selectedActorNameList(_category));
    }

    commandSelectClear(){
        const _category = this._view.selectCategory();
        const _selected = this._model.selectedData(_category);
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

    commandSearchMember(){;
        const _category = this._view.selectCategory();
        const _selected = this._model.selectedData(_category);
        this._view.commandCommandOk(_selected.length == 0,this._model.selectedActorNameList(_category));
   }

    commandRefresh(){
        this._view.refresh(this._model.refreshData());
    }
}