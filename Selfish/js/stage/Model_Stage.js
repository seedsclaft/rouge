class Model_Stage extends Model_Base {
    constructor() {
        super();
        this._stageData = $gameParty.stageData();
        this._stageSeaquence = null;
    }
    
    isInitPhase () {
        return this._stageData.phase == 'init';
    }

    isStagePhase () {
        return this._stageData.phase == 'stage';
    }

    isBossBefore () {
        return this._stageData.phase == 'bossBefore';
    }

    bossBeforeEvent(){
        const nowCount = $gameParty._stageStepCount;
        const maxCount = $gameParty.stageLength();
        let value = Math.round((nowCount / maxCount) * 100);
        let value2 = Math.round(((nowCount+1) / maxCount) * 100);
        if (value < 95 && value2 >= 95){
            return true;
        }
        return false;
    }

    isStartPhase () {
        return this._stageData.phase == 'start';
    }

    setStagePhase (phase) {
        $gameParty.setStagePhase(phase);
    }

    stageEvent () {
        return $gameParty.stageEvent();
    }

    gainStepCount (num) {
        $gameParty._stageStepCount += num;   
    }

    setReadFlag (flag) {
        this._stageData._readFlag = flag;
    }

    readFlag () {
        return this._stageData._readFlag;
    }
    
    loadResourceData(){
        const needBgm = $gameParty.getStageResourceBgm();
        let resource = [];
        needBgm.forEach(bgmData => {
            if (!AudioManager.loadedBgmResource([bgmData])){
                resource.push(bgmData);
                AudioManager.loadBgm(bgmData);
            }
        });

        return {bgm:resource};
    }

    async loadStageSequence(){
        var data = await this.loadStageSequenceData();
        var event = _.find(data.events,(e) => e && e.name == "Stage" + $gameParty.stageNo());
        this._stageSeaquence = event.pages;
    }

    loadStageSequenceData () {
        return new Promise(resolve => {
            return DataManager.loadStageSequenceData(resolve);
        });
    }
    
    getStageEvent(id){
        var event = _.find(this._stageSeaquence,(sea) => sea && sea.conditions.variableValue == id);
        return event;
    }

    stageNo () {
        return this._stageData.id;
    }

    isUseBeforeBattleBgm () {
        const stageData = DataManager.getStageInfos(this._stageData.id);
        return stageData.beforeBattleBgm;
    }

    stageBgmData(){
        let stageData = this._stageData;
        if (stageData == null){
            return null;
        }
        if (stageData.phase == 'start' || stageData.phase == 'init'){
            return $gameBGM.getBgm('stagemenu');
        } else
        if (stageData.phase == 'stage'){
            if ($gameParty.stageProgress() < 0.1){
                const stage = DataManager.getStageInfos(stageData.id);
                //return null;
                $gameSystem.setBattleBgm($gameBGM.getBgm(stage.bgm));
                return $gameBGM.getBgm(stage.bgm);
            } else
            if ($gameParty.stageProgress() >= 0.1 && $gameParty.stageProgress() <= 0.95){
                const stage = DataManager.getStageInfos(stageData.id);
                //if (!AudioManager.isCurrentBgm($gameBGM.getBgm(stage.bgm))){
                    $gameSystem.setBattleBgm($gameBGM.getBgm(stage.bgm));
                    return $gameBGM.getBgm(stage.bgm);
                //}
                //return null;
            } else{
                return null;
            }
        } else
        if (stageData.phase == 'bossBefore'){
            return null;
        }
    }

    bossAnimation(){
        return this.stageData().bossAnimation;
    }

    loadResourceBossBefore(){
        const resources = ResourceLoadManager.getBossResource();
        resources.animation.forEach(name => {
            ImageManager.loadAnimation(name);
        });
        resources.enemy.forEach(e => {
            ImageManager.loadEnemy(e.battlerName);
        });
        resources.sound.forEach(name => {
            AudioManager.loadSe(name);
        });
        const stageDate = this._stageData;
        const stage = DataManager.getStageInfos(stageDate.id);
        let bgmKey;
        if (stage.bossBattleBgm == true){
            bgmKey = $gameBGM.getBgm("boss");
        } else{
            bgmKey = $gameBGM.getBgm("lastbattle");
        }
        if (bgmKey != null){
            AudioManager.playBgm(bgmKey);
            $gameSystem.setBattleBgm(bgmKey);
        }
    }

    enableMenu(){
        $gameSystem.enableMenu();
    }

    disableMenu(){
        $gameSystem.disableMenu();
    }

}