class Model_RushBattle extends Model_Base {
    constructor() {
        super();
    }

    recordDataTurns(stageId){
        const record = _.find($gameParty.recordData()._recordData,record => record._id == stageId);
        if (record) return record._turnCount;
        return 0;
    }

    challengeList (){
        const partyLv = $gameParty.highestLevel();
        const challengeList = $gameChallenge.getChallengeDataList(partyLv);
        return challengeList;
    }

    bossBattler(troops){
        const boss = new Game_Enemy( item.boss ,0,0,1);
        return boss;
    }

    saveLastSceneNames(){
        if (SceneManager._previousClass.name == "Battle_Scene"
        || SceneManager._previousClass.name == "RushBattle_Scene"
        || SceneManager._previousClass.name == "Menu_Scene" ){
            return;
        }
        $gameSystem._lastRushSceneName = SceneManager._previousClass.name;
    }

    saveLastMembers(){
        if (SceneManager._previousClass.name == "Battle_Scene" ){
            return false;
        }
        if (SceneManager._previousClass.name == "Menu_Scene" ){
            return false;
        }
        const actorsId = $gameParty.members().map(member => member.actorId());
        $gameSystem._lastPartyMember = actorsId;
        return true;
    }

    addPartyMemberAll(){
        [1,2,3,4,5].forEach(num => {
            $gameParty.addActor(num);
        });
    }

    loadLastPartyMember(){
        [1,2,3,4,5].forEach(num => {
            $gameParty.removeActor(num);
        });
        $gameSystem._lastPartyMember.forEach(num => {
            $gameParty.addActor(num);
        });
        $gameSystem._lastPartyMember = null;
    }

    loadLastSceneName(){
        return $gameSystem._lastRushSceneName;
    }

    clearLastSceneName(){
        $gameSystem._lastSceneName = null;
    }

    createRushBattleData(item){
        let troopId = item.troopId;
        let troop = new Game_Troop(item);
        troop.setup(troopId,1);
        let stageEvent = new Game_StageEvent();
        stageEvent.setBattle(troop);
        stageEvent._type = "mapBattle";
        $gameParty._stageData._stageSeaquence["-1"] = stageEvent;
        $gamePlayer.resetStepSound();
        $gameParty._stageStepCount = 0;
        $gameParty.stageData().loseType = item.loseType;
    }
}