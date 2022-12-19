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
        let background = new Sprite();
        background.bitmap = ImageManager.loadBackground("nexfan_01");
        background.x = -40;
        background.y = -200;
        this.addChild(background);
        this.createWindowLayer();
    }

    createObjectAfter(){
        this.createHelpWindow();
        this.createKeyMapWindow();
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
    Refresh : 100
}