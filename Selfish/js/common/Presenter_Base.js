class Presenter_Base {
    constructor() {
    }

    updateCommand(){
        if ($gamePause == true){
            return;
        }
        if (Presenter_Loading.busy()){
            return;
        }
        if (!this._view._command || this._view._command.length == 0) return;        
    }
    
    async commandContinue () {
        BackGroundManager.clearWeatherLoad();
        EventManager.clearWeatherLoad();
        const resumeScene = this._model.resumeScene();
        // 天気の復帰
        BackGroundManager.setWeather($gameScreen.backGroundWeather());
        EventManager.setWeather($gameScreen.eventWeather());
        // システムフェードアウト
        await Presenter_Fade.fadein(0.25);

        const bgName = this._model.bgName();
        const continuePositionData = this._model.continuePositionData();
        const continueSizeData = this._model.continueSizeData();
        BackGroundManager.changeBackGround(bgName,null);
        BackGroundManager.setSize(continueSizeData[0],continueSizeData[1]);
        BackGroundManager.moveUV(0,continuePositionData[0],continuePositionData[1],true);
    
        this._model.resetingFilters();
        // 見えるかの判定
        const isVisible = $gameScreen.screenVisible();
        switch (resumeScene){
            case 'Battle_View':

                SceneManager.push(Battle_View);
                break;
            case 'endEvent':
                $gamePlayer.clearTransferInfo();
                const endEvent = this._model.endEvent();
                EventManager.setup(endEvent);
                SceneManager.goto(Event_Scene);
                break;
            default:
                this._model.reloadMapIfUpdated();
                SceneManager.goto(Scene_Map);
                if (!isVisible){
                    EventManager.startFadeOut(0);
                }
                break;
        }
        $gameSystem.onAfterLoad();
        // システムフェードイン
        Presenter_Fade.fadeout(0.25);
    }

    terminate(){
        if (this._model){
            delete this._model;
            this._model = null;
        }
        if (this._view){
            delete this._view;
            this._view = null;
        }
    }

    checkUpdate(){
        // DEMO版から製品への引継ぎ
        const loadData = this.nowLoadData();
        if (loadData != null){
            this.fromDemoToVer005(loadData);
            this.fromDemoToVer100(loadData);
            this.fromAllVerUpdate();
        }
    }

    nowLoadData(){
        let loadData;
        if (DataManager._lastAccessedId == 100){
            loadData = DataManager.autoSavefile();
        } else{
            let savefiles = DataManager.savefiles();
            loadData = savefiles[DataManager._lastAccessedId-1];
        }
        return loadData;
    }

    // ver1-4 >> ver5
    fromDemoToVer005(loadData){
        const versionId = 5;
        if ($gameDefine.gameVersionNumber() < versionId){
            return;
        }
        if (loadData.version == null || loadData.version < versionId){
            this.addAchirvement5();
        }
    }

    addAchirvement5(){
        // act5のボス「オーガ」を倒しているか
        if (_.contains($gameParty.enemyInfoData() , 106 )){
            // act5クリアの実績を解放する
            $gameAchievement.checkAchievement();
        }
    }

    // ver1-5 >> ver100
    fromDemoToVer100(loadData){
        const versionId = 100;
        if ($gameDefine.gameVersionNumber() < versionId){
            return;
        }
        if (loadData.version == null || loadData.version < versionId){
            this.addNewAct6();
        }
    }
    
    addNewAct6(){
        // act5のボス「オーガ」を倒しているか
        if (_.contains($gameParty.enemyInfoData() , 106 )){
            // act6を追加 
            $gameParty.gainStage(6);
        }
    }

    // 全てのバージョンで行う不具合修正
    fromAllVerUpdate(){
        this.resetPassiveSkillExp();
    }

    resetPassiveSkillExp(){
        // パッシブスキルの使用カウントをリセット
        $gameActors._data.forEach(actor => {
            if (actor && actor.actorId() <= 5){
                for (let ownSkillId in actor._ownSkills){
                    let skill = $dataSkills[ownSkillId];
                    if (skill.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE){
                        if (actor._ownSkills[ownSkillId].count > 0){
                            actor._ownSkills[ownSkillId].count = 0;
                        }
                    }
                }
            }
        });
    }
}