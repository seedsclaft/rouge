class Presenter_File extends Presenter_Base {
    constructor(view) {
        super();
        this._lastStageNo = 0;

        this._view = view;
        this._model = new Model_File();
        this.setEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    start(){
    }

    updateCommand(){
        if (PopupManager.busy()){
            return;
        }
        super.updateCommand();
        switch (this._view._command){
            case FileCommand.Load:
            return this.commandLoad();
            case FileCommand.Save:
            return this.commandSave();
            case FileCommand.Lock:
            return this.commandLock();
            case FileCommand.Start:
            return this.commandStart();
            case FileCommand.UpLoad:
            return this.commandUpLoad();
        }
        this._view.clearCommand();
    }

    commandStart(){
        this._view.commandStart();

        const files = this._model.saveFiles();
        const index = this._model.selectLastIndex();
        this._view.showListWindow(files,index);
    }

    async commandLoad(){
        if (SceneManager._previousClass.name == 'Title_Scene'){
            BackGroundManager.changeBackGround(null,null);
        }
        
        const index = this._view._listWindow.index();
        const result = this._model.loadFile(index);

        this._lastStageNo = this._model.lastStageNo();

        if (result){
            this._view.onLoadSuccess();
            this.loadSuccess(index);
        } else{
            this._view.onLoadFailure();
        }
    }

    loadSuccess(index){
        this.releaseResourceData();
        // 最終アクセスを更新
        this._model.setSelectLastIndex(index);
        // タイトル音楽を解放
        AudioManager.purgeBgm($gameBGM.getBgm('title'));

        $gameParty.allMembers().forEach(actor => {
            actor.exChangeslotData();
            actor.setSelfElement();
            actor.clearAllPassiveState();
        });
        $gameParty.resetBattleParameter();
        BackGroundManager.resetStageMode();
        Graphics.frameCount = $gameSystem._framesOnSave;

        AudioManager.fadeOutBgm(1);
        const resumeScene = this._model.resumeScene();
        if ( resumeScene ){
            this.commandContinue();
        }
        this.checkUpdate();
    }

    releaseResourceData(){
        if ($gameParty.stageNo() == this._lastStageNo){
            return;
        }
        const resouces = ResourceLoadManager.getStageResource(this._lastStageNo);
        if (resouces){
            // アニメーションを解放
            resouces.animation.forEach(anim => {
                ImageManager.clearImageAnimation(anim);
            });
            // 敵グラフィックを解放
            resouces.enemy.forEach(en => {
                ImageManager.clearImageEnemy(en);
            });
            // サウンドを解放
            resouces.sound = resouces.sound.map((s) => s.name);
            resouces.sound.forEach(se => {
                AudioManager.purgeSe(se);
            });        
            resouces.bgm.forEach(bgm => {
                AudioManager.purgeBgm(bgm);
            });
        }
    }

    commandSave() {
        const index = this._view._listWindow.index();
        const result = this._model.saveFile(index);

        if (result){
            this.saveSuccess(index);
        } else{
            this._view.onSaveFailure();
        }
    }

    async saveSuccess(index){
        SoundManager.playSave();
        // 最終アクセスを更新
        this._model.setSelectLastIndex(index);
        StorageManager.cleanBackup(index);
        DataManager.refreshSaveData();
        await CriateSpriteManager.addSaveImage(index);
        PopupManager.openSaveSuccess(() => {
            this._view.onSaveSuccess(index);

            const files = this._model.saveFiles();
            index = this._model.selectLastIndex();
            this._view.showListWindow(files,index);
        } );

    }

    commandLock() {
        const index = this._view._listWindow.index();
        this._view.commandLock(index);
        if (this._view.isAllLocked()){
            const endEvent = this._model.lockEndEvent();
            if (endEvent){
                EventManager.setup(endEvent);
            }
        }
    }

}