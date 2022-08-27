class Presenter_MagicInfo extends Presenter_Base {
    constructor(view) {
        super();
        this._view = view;
        this._model = new Model_MagicInfo();
        this.setEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    updateCommand(){
        super.updateCommand();
        switch (this._view._command.command){
            case MagicInfoCommand.Start:
            return this.commandStart();
            case MagicInfoCommand.ChangeIndex:
            return this.commandChangeIndex();
            case MagicInfoCommand.ChangeCategory:
            return this.commandChangeCategory(this._view._command.select);
        }
        this._view.clearCommand();
    }

    commandStart(){
        const magicInfos = this._model.magicIdList();
        this._view.commandStart(magicInfos);
        this.commandChangeIndex();
    }

    commandChangeIndex(){
        const categoryText = this._model.categoryText();
        const magicId = this._view._listWindow.item();
        this._view.commandChangeIndex(magicId,categoryText);
    }

    commandChangeCategory(select){
        SoundManager.playCursor();
        this._model.selectCategory(select);
        this.commandStart();
    }
}