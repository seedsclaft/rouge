class Presenter_Help extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new Model_Help();
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
        switch (this._view._command){
            case HelpCommand.Start:
            return this.commandStart();
            case HelpCommand.ChangeSelect:
            return this.commandChangeSelect();
        }
        this._view.clearCommand();
    }

    commandStart(){
        const data = this._model.helpList();
        this._view.setData(data);
        this.commandChangeSelect();
    }

    commandChangeSelect(){
        const listItem = this._view._listWindow.item();
        const helpData = this._model.helpData(listItem.key);
        if (helpData){
            this._view.commandChangeSelect(helpData);
            const nextItem = this._view._listWindow.item();
            this._model.readHelpData(nextItem);
        }
    }

    commandNextHelpStatus(cursor){
        this._view.commandNextHelpStatus(cursor);
    }
}