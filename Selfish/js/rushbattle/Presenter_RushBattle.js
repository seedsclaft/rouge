class Presenter_RushBattle extends Presenter_Base{
    constructor(view) {
        super();
        this._lastStageNo = 0;

        this._view = view;
        this._model = new Model_RushBattle();
        this.setEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    commandStart(){
        this._model.saveLastSceneNames();
        const saved = this._model.saveLastMembers();
        this._model.addPartyMemberAll();
        const challengeList = this._model.challengeList();
        this._view.showListWindow(challengeList);

        this.commandChangeList();

        if (saved == true){
            this._view.popupSaveActor();
            this._view.deactivateListWindow();
        }
        $gameParty.stageData().loseType = null;
        AudioManager.playBgm($gameBGM.getBgm('chapter'));

        $gameAchievement.checkAchievement();
    }

    updateCommand(){
        super.updateCommand();
        switch (this._view._command){
            case ArenaCommand.Start:
            return this.commandStart();
            case ArenaCommand.Battle:
            return this.commandBattle();
            case ArenaCommand.ChangeList:
            return this.commandChangeList();
            case ArenaCommand.Menu:
            return this.commandMenu();
            case ArenaCommand.PopScene:
            return this.commandPopScene();
        }
        this._view.clearCommand();
    }

    commandBattle(){
        const item = this._view._listWindow.item();
        const bg = item.backGround;
        EventManager.clearPictures();
        $gameSystem._lastRushBg = $gamePlayer._lastMapBG1;
        BackGroundManager.changeBackGround(bg,null);
        
        $gameSystem.setBattleBgm($gameBGM.getBgm("challenge"));
        // ステージデータを強制設定
        this._model.createRushBattleData(item);
        SceneManager.push(Battle_Scene);
    }

    commandCancel(){
    }

    commandChangeList(){
        const item = this._view._listWindow.item();
        const bg = item.backGround;
        let troops = new Game_Troop();
        troops.setup(item.troopId , 1);
        const turns = this._model.recordDataTurns(item.id);
        this._view.changeTroopMembers(bg,troops,item,turns);
    }

    commandPopScene(){
        //this._model.loadLastPartyMember();
        const lastScene = this._model.loadLastSceneName();
        this._view.popScene(lastScene);
        this._model.clearLastSceneName();
    }
    
    commandMenu(){
        SoundManager.playCancel();
        if (!SceneManager._backgroundBitmap){
            SceneManager.snapForBackground();
        }
        SceneManager.push(Menu_Scene);
    }
}