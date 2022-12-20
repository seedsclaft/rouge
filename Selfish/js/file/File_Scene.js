//-----------------------------------------------------------------------------
// Scene_FileList
//

class File_Scene extends Scene_Base {
    constructor(){
        super();
        this._presenter = new Presenter_File(this);
    }

    create(){
        super.create();
        BackGroundManager.resetup();
        this._backSprite = new ScreenSprite();
        this._backSprite.setColor(0,0,0);
        this.addChild(this._backSprite);
        this._backSprite.opacity = 168;
    
        this.createWindowLayer();
        this.createHelpWindow();
        this.createListWindow();
        
        this.createMenuButton();
        this.createBackButton();
        this.createMenuSprite();
        this.createKeyMapWindow();
        if ($gameDefine.mobileMode){
            this.createDockButton();
        }
    }

    start(){
        super.start();
        this.setCommand(FileCommand.Start);
    }

    commandStart(){
        this.showMenuPlate(0.25,this.popScene.bind(this),TextManager.getBackText(),TextManager.getText(200800));
    }

    popScene(){
        if (PopupInputManager.busy()){
            return;
        }
        if ($gameDefine.mobileMode){
            SoundManager.playCancel();
        }
        super.popScene();
    }

    showListWindow(data,index){
        this._backSprite.opacity = 168;
        this._helpWindow.setText(this.helpWindowText());
        this._listWindow.show();
        this._listWindow.activate();
        this._listWindow.setData(data);
        //this._listWindow.setTopRow(index - 2);
        this._listWindow.forceSelect(index);
    }

    savefileId(){
        if (this._listWindow.index() == 0){
            return DataManager.autoSaveGameId();
        }
        return this._listWindow.index();
    }

    createHelpWindow(){
        this._helpWindow = new Window_Help(1);
        this.addChild(this._helpWindow);
    }

    createListWindow(){
        this._listWindow = new Window_FileList(144, 32, 680, 464);
        this._listWindow.setHandler('ok',     this.onFileOk.bind(this));
        this._listWindow.setHandler('cancel', this.onFileCancel.bind(this));
        this.addChild(this._listWindow);
    }

    createKeyMapWindow(){
        //
    }

    createDockButton(){
        //
    }

    helpWindowText(){
        return '';
    }

    onFileOk(){
        /* override */
    }

    onFileCancel(){
        /* override */
    }

    terminate(){
        super.terminate();
        if (this._listWindow){
            this._listWindow.terminate();
        }
        this._listWindow = null;
        if (this._helpWindow){
            this._helpWindow.destroy();
        }
        this._helpWindow = null;
        if (this._backSprite){
            this._backSprite.destroy();
        }
        if (this._keyMapWindow){
            this._keyMapWindow.terminate();
        }
        this._keyMapWindow = null;
        this._backSprite = null;
        //this.destroy();
        // 不要リソースを解放
        // タイトル
        //ImageManager.clearImageBattleBack1("Title");
    }
}

//-----------------------------------------------------------------------------
// Save_Scene
//

class Save_Scene extends File_Scene {
    constructor(){
        super();
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('save');
        }
    }

    helpWindowText(){
        return TextManager.getText(200300);
    }

    onFileOk(){
        if (this._listWindow.index() == 0){
            this._listWindow.activate();
            SoundManager.playBuzzer();
            return;
        }
        this._listWindow.hide();
        this._helpWindow.setText('');
        this._backSprite.opacity = 0;
        CriateSpriteManager.createSaveImage(this.savefileId());
        
        this.setCommand(FileCommand.Save);
    }

    onFileCancel(){
        this.popScene();
    }

    onSaveSuccess(index){
        CriateSpriteManager.loadSaveImageByIndex(index);
        //this.popScene();
    }

    onSaveFailure(){
        SoundManager.playBuzzer();
        this._listWindow.activate();
    }

    popScene(){
        if (Scene_Save._nextScene != null){
            if (PopupInputManager.busy()){
                return;
            }
            if ($gameDefine.mobileMode){
                SoundManager.playCancel();
            }
            if (Scene_Save._nextScene == "Shutdown"){
                Scene_Save._nextScene = null;
                EventManager.shutdown();
                return;
            }
            SceneManager.push(Scene_Save._nextScene);
            Scene_Save._nextScene = null;
            $gamePlayer.clearTransferInfo();
        } else{
            super.popScene();
            //SceneManager.pop();
        }
    }
}

Scene_Save._nextScene = null;

//-----------------------------------------------------------------------------
// Load_Scene
//
// The scene class of the load screen.

class Load_Scene extends File_Scene {
    constructor(){
        super();
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('load');
        }
    }

    createDockButton(){
        this._dockMenu = new Sprite_LoadDock();
        this._dockMenu.setClickHandler(LoadDockActionType.Upload,this.onFileUpLoad.bind(this));
        this._dockMenu.setClickHandler(LoadDockActionType.DataTransport,this.onFileDownLoad.bind(this));
        this.addChild(this._dockMenu);
    }

    helpWindowText(){
        return TextManager.getText(200400);
    }

    onFileOk(){
        this.setCommand(FileCommand.Load);
    }

    onFileCancel(){
        this.popScene();
    }

    onLoadSuccess(){
        SoundManager.playLoad();
    }

    onLoadFailure(){
        SoundManager.playBuzzer();
        this._listWindow.activate();
    }

    createListWindow(){
        super.createListWindow();
        this._listWindow.setHandler('shift', this.onFileUpLoad.bind(this));
        this._listWindow.setHandler('menu', this.onFileDownLoad.bind(this));
    }

    onFileUpLoad(){
        this._listWindow.deactivate();
        const mainText = TextManager.getText(210100);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const subText = TextManager.getText(210101);
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:1,subText:subText});
        _popup.setHandler(text1,'ok',() => { 
            this.setCommand(FileCommand.UpLoad);
        });
        _popup.setHandler(text2,'cancel',() => {
            this._listWindow.activate();
        });
        _popup.open();
    }

    commandUpLoadEnd(fileName){
        const mainText = TextManager.getText(210200);
        const subText = TextManager.getText(210201);
        const _popup = PopupManager;
        _popup.setPopup(mainText,{subText:subText});
        _popup.setHandler(fileName,'ok',() => { 
            this._listWindow.activate();
        });
        _popup.open();
    }

    failUpLoadEnd(){
        const mainText = TextManager.getText(210600);
        const subText = TextManager.getText(210601);
        const text1 = TextManager.getText(840);
        const _popup = PopupManager;
        _popup.setPopup(mainText,{subText : subText});
        _popup.setHandler(text1,'ok',() => { 
            this._listWindow.activate();
        });
        _popup.open();
    }

    onFileDownLoad(){
    }

}

const FileCommand = {
    Load : 0,
    Save : 1,
    Lock : 2,
    Start : 3,
    UpLoad : 4,
}