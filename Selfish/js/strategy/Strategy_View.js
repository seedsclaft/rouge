class Strategy_View extends Scene_Base {
    constructor(){
        super();
        this._presenter = new Strategy_Presenter(this);
    }

    create(){
        BackGroundManager.resetup();
        EventManager.resetup();
        super.create();
        this.createDisplayObjects();
    }

    setResourceData(resourceData){
        this._resourceData = resourceData;
    }

    isReady(){
        return true;
    }

    createDisplayObjects(){
        BackGroundManager.resetup();
        this.createWindowLayer();
    }

    createObjectAfter(){
        this.createHelpWindow();
        this.createKeyMapWindow();
        PopupStatus_View.resetUp();
        PopupStatus_View.close();
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            //this._keyMapWindow.refresh('Tactics');
        }
    }

    start(){
        super.start();
        this.setCommand(StrategyCommand.Start);
    }

    commandTrainStart(before){
        PopupStatus_View.setData(before);
        PopupStatus_View.setLvupData(before,() => {
            this.setCommand(StrategyCommand.TrainResult);
        });
    }

    commandTrainResult(lvUpData){
        PopupStatus_View.setLvupAfter(lvUpData,() => {
            PopupStatus_View.close();
            this.setCommand(StrategyCommand.TrainStart);
        });
    }

    commandAlchemyStart(nameList){
        const mainText = TextManager.getText(11000).replace("/d",nameList);
        const text = TextManager.getDecideText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:null});
        _popup.setHandler(text,'ok',() => {
            this.setCommand(StrategyCommand.AlchemyResult);
        });
        _popup.open();
    }

    commandRecoveryStart(nameList){
        const mainText = TextManager.getText(11010).replace("/d",nameList);
        const text = TextManager.getDecideText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:null});
        _popup.setHandler(text,'ok',() => {
            this.setCommand(StrategyCommand.RecoveryResult);
        });
        _popup.open();
    }

    commandSearchStart(){
        const mainText = TextManager.getText(11020);
        const text = TextManager.getDecideText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:null});
        _popup.setHandler(text,'ok',() => {
            this.setCommand(StrategyCommand.BattleStart);
        });
        _popup.open();
    }

    commandMagicStart(nameList){
        const mainText = TextManager.getText(11030).replace("/d",nameList);
        const text = TextManager.getDecideText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:null});
        _popup.setHandler(text,'ok',() => {
            this.setCommand(StrategyCommand.MagicResult);
        });
        _popup.open();
    }

    swipHelp(moveX){
    }

    swipReset(){
    }

    swipEndHelp(moveX){
    }


}

const StrategyCommand = {
    Start :0,
    TrainStart :11,
    TrainResult :12,
    AlchemyStart : 21,
    AlchemyResult : 22,
    RecoveryResult : 31,
    BattleStart : 32,
    MagicStart : 41,
    MagicResult : 42,
    Refresh : 100
}