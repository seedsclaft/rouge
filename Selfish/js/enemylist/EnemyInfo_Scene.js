//-----------------------------------------------------------------------------
// EnemyInfo_Scene
//

class EnemyInfo_Scene extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Presenter_EnemyInfo(this);
    }

    create(){
        super.create();
        //this.createHelpWindow();
        this.createScreenSprite();
        this.createListWindow();
        this.createEnemySprite();
        this.createStatusWindow();
        this.createMenuButton();
        this.createBackButton();
        this.createMenuSprite();
        this.createKeyMapWindow();
        this.setMenuSprite(TextManager.getText(2100));
    }

    createBackButton(){
        this._backButton = new Sprite_IconButton();
        this.addChild(this._backButton);
        this._backButton.setup(TextManager.getBackText());
        this._backButton.setClickHandler(() => {
            SoundManager.playCancel();
            if (this._statusWindow.active){
                this.cancelStatus();
                return;
            }
            this.popScene()
        })
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('menuEnemy');
        }
    }

    createEnemySprite(){
        this._enemySprite = new Sprite();
        this._enemySprite.x = 120;
        this._enemySprite.y = 400;
        this._enemySprite.anchor.x = 0;
        this._enemySprite.anchor.y = 1;
        this._enemySprite.opacity = 160;
        this.addChild(this._enemySprite);
    }

    createListWindow(){
        this._listWindow = new Window_EnemyInfoList(-16,96,264,408);
        this._listWindow.setHandler('ok',     this.onEnemyInfoOk.bind(this));
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this._listWindow.setHandler('index',  this.selectChange.bind(this));
        this.addChild(this._listWindow);
    }

    createStatusWindow(){
        this._statusWindow = new Window_EnemyInfoStatus(320,96,584,384);
        this._statusWindow.setHandler('cancel', this.cancelStatus.bind(this));
        this.addChild(this._statusWindow);
    }

    start(){
        super.start();
        this.setCommand(EnemyListCommand.Start);
    }

    commandStart(data){
        this._listWindow.setData(data);
        this._listWindow.activate();
        this._listWindow.selectLast();
        this._statusWindow.show();
        this._statusWindow.showAnimation();
    }

    selectChange(){
        this.setCommand(EnemyListCommand.ChangeIndex);
    }

    commandChangeIndex(enemy,actionList){
        this._statusWindow.deselect();
        this._statusWindow.setData(actionList);
        this._enemySprite.bitmap = ImageManager.loadEnemy(enemy.battlerName);
    }

    onEnemyInfoOk(){
        this._listWindow.deactivate();
        this._statusWindow.selectLast();
        this._statusWindow.skillRefresh();
        this._statusWindow.skillHelpUpdate();
        this._statusWindow.activate();
    }

    cancelStatus(){
        this._listWindow.activate();
        this._statusWindow.deselect();
        this._statusWindow.deactivate();
        this._statusWindow.skillRefresh();
        //this._statusWindow.skillHelpUpdate();
    }

    terminate(){
        super.terminate();
        if (this._statusWindow){
            this._statusWindow.terminate();
        }
        this._statusWindow = null;
    }

}

const EnemyListCommand = {
    Start : 1,
    ChangeIndex : 2
}