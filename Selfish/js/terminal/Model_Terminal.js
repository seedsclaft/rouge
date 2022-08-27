class Model_Terminal extends Model_Base{
    constructor() {
        super();
        this._tempBgName = $gamePlayer._lastMapBG1;
        /*
        const tempBg = this.loadLastRushBg();
        if (tempBg != null){
            this._tempBgName = tempBg;
        }
        */
        this._tempContinueBackGroundPosition = $gameScreen.backGroundPosition();
        this._tempContinueBackGroundSize = $gameScreen.backGroundSize();
        this._continue = $gameSystem._continue != null ? $gameSystem._continue : true;
        $gameMaterial.convertUserData();
    }

    loadResourceData(){
        let resource = {};
        if (SceneManager._previousClass.name && SceneManager._previousClass.name != "Menu_Scene" || !(Menu_Scene._calledScene instanceof Terminal_Scene)){
            const bgmData = $gameBGM.getBgm('chapter');
            if ( !AudioManager.loadedBgmResource([bgmData]) ){
                AudioManager.loadBgm(bgmData);
                resource = {bgm:[bgmData]};
            }
        }
        return resource;
    }

    isContinue(){
        return this._continue;
    }


    resumePartyMember(){
    }

    pushPartyMember(){
    }

    clearLastActorsId(){
    }

    chapterStart(stageData){
        $gamePlayer._destinationEvent = [];
        $gameParty._commonEventNum = {};
        $gameSystem._mapBgm = null;
        $gameSystem._mapBgs = null;
        $gameSystem._battleCalledMenu = false;
        $gamePlayer.resetStepSound();
        
        $gameParty.stageInit();
        $gameParty.setStageNo(stageData.id);
        $gameVariables.setValue(stageData.variableId,0);
        $gameSystem._continue = true;
        // スイッチの初期化
        for (var i = 201 ; i < 1000 ; i ++){
            $gameSwitches.setValue(i,false);
        }
        // 進行度の復帰
        $dataStage.forEach(stage => {
            let value = (stage.id < stageData.id) ? 9999 : 0; 
            $gameVariables.setValue(stage.variableId,value);
        });
        $gamePlayer.clearTransferInfo();
        $gamePlayer.reserveTransfer(1, 1, 1, 2, 0);
        // 背景見えるかの判定
        $gameScreen.setScreenVisible(true);
        this.removeNewStageId(stageData.id);
    }

    chapterData(){
        return _.sortBy($gameParty.stages(),(d) => d.id);
    }

    storyData(){
        return null;//$gameWordEvent.getWordEvent($gameParty.readItemId());
    }

    gainEventItem(getItemId){
        $gameParty.gainItem($dataItems[getItemId],1);
        $gameMaterial.convertUserData();
    }

    terminalCommand(){
        return $gameCommand.terminalCommand();
    }
    
    materialEvent(){
        return $gameMaterial.getUserMaterial(itemId);
    }

    userMaterialAll(){
        return $gameMaterial.getUserMaterialAll();
    }

    userMaterialStatus(material){
        return $gameMaterial.getUserMaterialStatus(material);
    }

    wordMaterial(itemId){
        return $gameMaterial.getUserMaterial(itemId);
    }

    material(id){
        return $gameMaterial.getData(id);
    }

    removeNewStageId(stageId){
        if (stageId){
            $gameParty._newStageIdList = _.without($gameParty._newStageIdList,stageId);
        }
    }

    loadLastPartyMember(){
        if ($gameSystem._lastPartyMember == null){
            return false;
        }
        [1,2,3,4,5].forEach(num => {
            $gameParty.removeActor(num);
        });
        $gameSystem._lastPartyMember.forEach(num => {
            $gameParty.addActor(num);
        });
        $gameSystem._lastPartyMember = null;
        return true;
    }

    loadLastRushBg(){
        if ($gameSystem._lastRushBg){
            return $gameSystem._lastRushBg;
        }
        return null;
    }
}