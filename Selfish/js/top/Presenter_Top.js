class Presenter_Top extends Presenter_Base {
    constructor(view) {
        super();
        this._view = view;
        this._model = new Model_Top();
        this._busy = false;
        this.setEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    updateCommand(){
        super.updateCommand();
        if (this._busy){
            return;
        }
        switch (this._view._command){
            case TopCommand.Start:
            return this.commandStart();
        }
        this._view.clearCommand();
    }

    async commandStart(){
        $dataOption.adjustScreen();
        const platForm = $gameDefine.platForm();
        //if (platForm == PlatForm.Steam || platForm == PlatForm.DlSite || platForm == PlatForm.DlSite){
            await this._model.convertTextData();
        //}

        if ($gameDefine.gameVersionNumber() < 100 && !$gameTemp.isPlaytest()){
            this._view.commandLogo();
            return;
        }
        this.commandGameStart();
    }

    commandGameStart(){
        Presenter_Loading.close();
        this._view.commandGameStart();
    }
}