class Presenter_Title extends Presenter_Base{
    constructor(view) {
        super();
        this._busy = false;
        this._view = view;
        this._model = new Model_Title();
        this.setEvent();
        //this.start();
    }

    setEvent(){
        this._resourcedata = this._model.loadResourceData();
        this._view.setResourceData(this._resourcedata);
        this._view.setEvent(this.updateCommand.bind(this));
    }

    async checkVersion () {
        await this.commandVersionCheck();
        //var resourceData = this._model.loadResourceData();
        //this._view.setResourceData(resourceData);
    }

    updateCommand(){
        super.updateCommand();
        if (this._busy){
            return;
        }
        if (EventManager.busy()){
            return;
        }
        if (PopupManager.busy()){
            return;
        }
        const _currentCommand = this._view._command.pop();
        console.log(_currentCommand)
        switch (_currentCommand){
            case TitleCommand.NewGame:
            return this.commandNewGame();
            case TitleCommand.Continue:
            return this.commandContinue();
            case TitleCommand.Debug:
            return this.commandDebug();
            case TitleCommand.OutputEventFile:
            return this.commandOutputEventFile();
            case TitleCommand.OutputTextData:
            return this.commandOutputTextData();
            case TitleCommand.CsvToTextData:
            return this.commandCsvToTextData();
            case TitleCommand.CsvToEventData:
            return this.commandCsvToEventData();
            case TitleCommand.CsvToTextDataUTF8:
            return this.commandCsvToTextDataUTF8();
            case TitleCommand.CsvToEventDataUTF8:
            return this.commandCsvToEventData();
            case TitleCommand.OutputAndroid:
            return this.commandOutputAndroid();
            case TitleCommand.OutputActorsText:
            return this.commandOutPutActorsText();
            case TitleCommand.VersionCheck:
            return this.commandVersionCheck();
            case TitleCommand.ResourceDownload:
            return this.commandResourceDownload();
            case TitleCommand.TwitterApply:
            return this.commandTwitterApply();
            case TitleCommand.ScriptMinify:
            return this.commandScriptMinify();
            case TitleCommand.DeploySteamWin:
            return this.commandDeploySteamWin();
            case TitleCommand.DeploySteamMac:
            return this.commandDeploySteamMac();
            case TitleCommand.DeployDlSiteWin:
            return this.commandDeployDlSiteWin();
            case TitleCommand.DeployDlSiteMac:
            return this.commandDeployDlSiteMac();
            case TitleCommand.DeployAndroid:
            return this.commandDeployAndroid();
            case TitleCommand.DeployiOS:
            return this.commandDeployiOS();
            case TitleCommand.OutputDeployAssetOnly:
            return this.commandOutputDeployAssetOnly();
            case TitleCommand.OutputDeployAll:
            return this.commandOutputDeployAll();
        }
        this._view.clearCommand();
    }

    commandNewGame(){
        this._view.commandNewGame();
    }

    commandContinue(){
        /*
        */
    }

    commandDebug(){
        this._view.sendDebugMode();
    }

    commandOutputEventFile(){
        EventManager.allEventFileOutput();
    }

    commandOutputTextData(){
        this._model.outputTextdata();
    }

    commandCsvToTextData(){
        const _popup = PopupManager;
        _popup.setPopup("エンコードタイプは？",{select:0});
        _popup.setHandler("Shift_JIS",'ok',() => {
            this._model.csvToTextdata("Shift_JIS");
        });
        _popup.setHandler("utf-8",'cancel',() => {
            this._model.csvToTextdata("utf-8");
        });
        _popup.open();
    }

    commandCsvToEventData(){
        const _popup = PopupManager;
        _popup.setPopup("エンコードタイプは？",{select:0});
        _popup.setHandler("Shift_JIS",'ok',() => {
            this._model.csvToEventdata("Shift_JIS");
        });
        _popup.setHandler("utf-8",'cancel',() => {
            this._model.csvToEventdata("utf-8");
        });
        _popup.open();
    }

    commandOutputAndroid(){
        //this._model.outputAndroid();
        //this._model.outputiOS();
        //this._model.outputSteam();
        //this._model.outputSteamMac();
        //this._model.outputDlSite();
    }

    commandOutPutActorsText(){
        this._model.outputActorsText();
    }


    async commandVersionCheck(){ 
        const version = DataManager.checkUpdate();
        if (version && (version.currencyUnit != $dataSystem.currencyUnit)){
            Debug.log("バージョン違い");
            this._view.checkUpdatePopup();
            return true;
        }
        return false;
    }

    async commandResourceDownload(){
        /*
        */
    }

    commandTwitterApply(){
        
    }

    commandScriptMinify(){
        this._model.scriptMinify();
    }

    commandDeploySteamWin(){
        this._model.outputSteamWin();
    }

    commandDeploySteamMac(){
        this._model.outputSteamMac();
    }

    commandDeployDlSiteWin(){
        this._model.outputDlSiteWin();
    }

    commandDeployDlSiteMac(){
        this._model.outputDlSiteMac();
    }

    commandDeployAndroid(){
        this._model.outputAndroid();
    }

    commandDeployiOS(){
        this._model.outputiOS();
    }

    commandOutputDeployAssetOnly(){
        this._model.outputDeployAssetOnly();
    }

    commandOutputDeployAll(){
        this._model.outputDeployAll();
    }
    
    setWait (num) {
        return new Promise(resolve => {
            const delayTime = num
            setTimeout(() => {
              return resolve()
            }, delayTime)
          })
    }
    
    update(){

    }
}