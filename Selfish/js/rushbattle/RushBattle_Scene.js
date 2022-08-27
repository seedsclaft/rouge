//-----------------------------------------------------------------------------
// RushBattle_Scene
//

class RushBattle_Scene extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Presenter_RushBattle(this);
    
        this._lastIndex = null;
    }

    create(){
        super.create();
        this._backSprite = new Sprite();
        this._backSprite.y = -24;
        this.addChild(this._backSprite);
        this.createScreenSprite();
    
        this.createListWindow();
        //this.createBossSprite();
        this.createStatusWindow();
        this.createMenuButton();
        this.createBackButton();
        this.createMenuSprite();
        this.setMenuSprite(TextManager.getText(900100));
        this.hideMenuPlate(0);
        if($gameDefine.mobileMode == true){
            this.createChallengeDockButton();
        }
        this.createKeyMapWindow();
    }

    start(){
        super.start();
        this.setCommand(ArenaCommand.Start);
        
    }

    showListWindow(data){
        this.showMenuPlate(0.25,this.callMenuScene.bind(this),TextManager.getMenuText(),TextManager.getText(900100));
        
        this._listWindow.setData(data);
        this._listWindow.activate();
        this._listWindow.selectLast();

        this._keyMapWindow.show();
    }

    popupSaveActor(){
        PopupManager.openPopupSaveActor(() => {
            this._listWindow.activate();
        });
    }

    deactivateListWindow(){
        this._listWindow.deactivate();
    }

    showStatusWindow(data,clearNum){
        this._statusWindow.setData(data,clearNum);
    }

    createHelpWindow(){
        this._helpWindow = new Window_Help(1);
        this._helpWindow.setText(this.helpWindowText());
        this.addChild(this._helpWindow);
    }

    createListWindow(){
        this._listWindow = new Window_RushBattleList(-16,96,400,408);
        this._listWindow.setHandler('ok',     this.onArenaOk.bind(this));
        this._listWindow.setHandler('index',  this.changeListIndex.bind(this));
        this._listWindow.setHandler('cancel', this.callMenuScene.bind(this));
        this._listWindow.setHandler('shift', this.callPopScene.bind(this));
        this.addChild(this._listWindow);
    }

    createChallengeDockButton(){
        this._dockMenu = new Sprite_ChallengeDock(this.callPopScene.bind(this));
        this.addChild(this._dockMenu);
    }

    onArenaOk(){
        const mainText = TextManager.getTroopName(this._listWindow.item().troopId) + " " + TextManager.getText(900200);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:1});
        _popup.setHandler(text1,'ok',() => {   
            this.setCommand(ArenaCommand.Battle);
        });
        _popup.setHandler(text2,'cancel',() => {
            this._listWindow.activate();
        });
        _popup.open();
    }

    createStatusWindow(){
        this._statusWindow = new Window_RushBattleStatus(540, 48, 400, 160);
        this.addChild(this._statusWindow);
    }

    createBossSprite(troops){
        if (this._layerBattleTroop == null){
            this._layerBattleTroop = new Layer_BattleTroop(troops.members());
            this._layerBattleTroop.x = 120;
            this._layerBattleTroop.y = 40;
            this.addChild(this._layerBattleTroop);

            
            this.removeChild(this._listWindow);
            this.addChild(this._listWindow);
            this.removeChild(this._statusWindow);
            this.addChild(this._statusWindow);
        }
        this._layerBattleTroop.clear();
        this._layerBattleTroop.createEnemies(troops.members());
    }

    changeListIndex(){
        this.setCommand(ArenaCommand.ChangeList);
    }

    changeTroopMembers(bg,troops,data,turns){
        this._backSprite.bitmap = ImageManager.loadBattleback1(bg);
        this.createBossSprite(troops);
        this._statusWindow.setData(data,turns);
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this._keyMapWindow.hide();
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh("challenge");
        }
    }

    callPopScene(){
        this.setCommand(ArenaCommand.PopScene);
    }

    callMenuScene(){
        this.setCommand(ArenaCommand.Menu);
    }

    popScene(lastSceneName){
        if (lastSceneName == "Terminal_Scene"){
            SceneManager.goto(Terminal_Scene);
        }
        if (lastSceneName == "Map_Scene"){
            SceneManager.goto(Map_Scene);
        }
    }

    terminate(){
        super.terminate();
        if (this._listWindow){
            this._listWindow.destroy();
        }
        this._listWindow = null;
        if (this._backSprite){
            this._backSprite.destroy();
        }
        this._backSprite = null;
    }
}

const ArenaCommand = {
    Start : 1,
    Battle : 2,
    ChangeList : 3,
    PopScene : 4,
    Menu : 5
}