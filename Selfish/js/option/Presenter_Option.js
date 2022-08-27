class Presenter_Option extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new Model_Option();
        this.setEvent();
        this.start();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    start(){
        this.setOptionList();
    }

    setOptionList(){
        const categoryData = this._model.categoryData();
        this._view.setOptionCategory(categoryData);

        const options = this._model.optionData();
        this._view.setOptionList(options);

        this._view.windowInitilize();
    }

    updateCommand(){
        super.updateCommand();
        switch (this._view._command){
            case OptionCommand.Category:
            return this.commandCategory();
            case OptionCommand.Option:
            return this.commandOption();
            case OptionCommand.OptionGain:
            return this.commandOptionGain();
            case OptionCommand.OptionLess:
            return this.commandOptionLess();
            case OptionCommand.KeyAssign:
            return this.commandKeyAssign();
            case OptionCommand.KeyChange:
            return this.commandKeyChange();
            case OptionCommand.KeyDecide:
            return this.commandKeyDecide();
            case OptionCommand.DataTransport:
            return this.commandDataTransport();
        }
        this._view.clearCommand();
    }

    commandCategory(){
        const index = this._view._categoryWindow.index();
        this._model.setCategoryIndex(index+1);

        const options = this._model.optionData();
        this._view.setOptionList(options);
    }

    commandOption(){

    }

    async commandOptionGain(){
        let option = this._view._optionWindow.option();
        const isEnable = option.version ? Number(option.version) <= $gameDefine.gameVersionNumber() : true;
        const symbol = option.key;
        if (isEnable){
            this._model.optionGain(option,symbol);
            if (symbol == "language"){
                //await LocalizeUtility.convertTextData();
                this.setOptionList();
                this._view._optionWindow.activate();
                this._view._categoryWindow.deactivate();
            }
        }
        this._view.commandOptionGain(symbol);
    }

    async commandOptionLess(){
        let option = this._view._optionWindow.option();
        const isEnable = option.version ? Number(option.version) <= $gameDefine.gameVersionNumber() : true;
        const symbol = option.key;
        if (isEnable){
            this._model.optionLess(option,symbol);
            if (symbol == "language"){
                //await LocalizeUtility.convertTextData();
                this.setOptionList();
                this._view._optionWindow.activate();
                this._view._categoryWindow.deactivate();
            }
        }
        this._view.commandOptionGain(symbol);
    }

    commandKeyAssign(){
        const keyAssign = this._model.keyAssaginData();
        this._view.commandKeyAssign(keyAssign);
    }

    commandKeyChange(){
        let changeKeyIndex = this._view._controlOptionWindow.index();
        this._model.setChangeKeyByIndex(changeKeyIndex);
        this._view.commandKeyChange();
    }

    commandKeyDecide(){
        const key = Input._latestKey;
        this._model.changeKeyAssign(key);
        this._view.commandKeyDecide();
        const keyAssign = this._model.keyAssaginData();
        this._view.commandKeyAssign(keyAssign);
    }

    async commandDataTransport(){
        
    }
}