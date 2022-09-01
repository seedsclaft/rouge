class Model_Map extends Model_Base{
    constructor() {
        super();
        this._needTarnsfer = false;
        this._levelUpValue = 0;
        this._levelUpPoint = 0;
        this._tempRoleData = null;

        this._battleMembers = [];
        this._battleActions = [];
        this._damageData = [];
    }

    tempRoleData(){
        return this._tempRoleData;
    }

    damageData(){
        return this._damageData;
    }
    
    async loadMapData(){
        const transfer = $gamePlayer.isTransferring();
        const mapId = transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
        this._needTarnsfer = transfer;
        return new Promise((resolve,reject) => {
            DataManager.loadMapData(mapId,resolve);
        });
    }

    setMapData(){
        const transfer = $gamePlayer.isTransferring();
        if (transfer) {
            $gamePlayer.performTransfer();
        }
        if ($gamePlayer._lastMapId != $gameMap.mapId()){
            $gamePlayer._lastMapId = $gameMap.mapId();
        }
    }

    needTransfer(){
        return this._needTarnsfer;
    }

    fadeType(){
        return $gamePlayer.fadeType();
    }
    
    mapBgm(){
        return $gameSystem._mapBgm;
    }

    mapBgs(){
        const mapBgs = $gameSystem._mapBgs;
        if (mapBgs){
            let temp = {
                name: mapBgs.name,
                volume: mapBgs.volume,
                pitch: mapBgs.pitch,
                pan: mapBgs.pan,
                pos: 0
            };
            return temp;
        }
        return null;
    }

    enableWeather(){
        return $dataMap.tilesetId < 3;
    }
    
    mapName(){
        if ($dataMapInfos && $gameMap.mapId() != 0 && $dataMapInfos[$gameMap.mapId()]){
            return TextManager.mapInfosName($gameMap.mapId());
        }
        return null;
    }
    
    loadResourceData(){
        let needBgm = [];
        let needBgs = [];
        const mapBgm = $gameSystem._mapBgm;
        const mapBgs = $gameSystem._mapBgs;
        if (mapBgm && mapBgm.name != ""){
            if ( !AudioManager.loadedBgmResource([mapBgm]) ){
                needBgm.push(mapBgm);
            }
        }
        if (mapBgs && mapBgs.name != ""){
            if ( !AudioManager.loadedBgsResource([mapBgm]) ){
                needBgs.push(mapBgs);
            }
        }
        needBgm.forEach(bgm => {
            AudioManager.loadBgm(bgm);
        });
        needBgs.forEach(bgs => {
            AudioManager.loadBgs(bgs);
        });
        return {bgm:needBgm,bgs:needBgs};
    }

    player(){
        return $gameParty.battleMembers()[0];
    }

    gainExp(lv){
        let value = 20;
        value += (lv - this.player().level) * 2;
        if (value <= 0){
            value = 1;
        }
        value = Math.floor(value * this.player().finalExpRate());
        this.player().gainExp(value);
    }

    roleData(){
        const _player = this.player();
        const _roleStateId = $gameDefine.RoleStateIdArray;
        let list = [];
        _roleStateId.forEach(roleStateId => {
            list.push(
                {
                    state:$dataStates[roleStateId],
                    level:_player.getStateEffect(roleStateId),
                    up :false
                }
            )
        });
        return list;
    }

    makeLevelUpData(lv){
        this._levelUpValue = lv;
        this._levelUpPoint = lv * 3;
        this._tempRoleData = this.roleData();
    }

    resetLevelUpData(){
        this._levelUpPoint = this._levelUpValue * 3;
        this._tempRoleData = this.roleData();
        return this._tempRoleData;
    }

    changeRoleData(item){
        this._levelUpPoint -= 1;
        let _roleData = this.tempRoleData();
        _roleData.forEach(role => {
            if (role.state.id == item.state.id){
                role.level += 1;
                role.up = true;
            }
        });
        return _roleData;
    }

    desideLevelUp(){
        const _tempData = this.tempRoleData();
        _tempData.forEach(temp => {
            if (temp.up == true){
                let stateId = _player.getStateEffect(temp.state.id);
                let value = temp.level - _player.getStateEffect(roleStateId);
                this.player().addStatePlus(stateId,value);
            }
        });
        this._levelUpValue = 0;
        this.player().refreshPassive();
    }

    initDamageData(){
        this._damageData = [];
    }

    pushDamageData(result){
        this._damageData.push(result);
    }

    totalDamage(){
        let damage = 0;
        this._damageData.forEach(element => {
            damage += element;
        });
        return damage;
    }

    battleMembers(){
        return this._battleMembers;
    }

    setBattleMembers(){
        let members = [];
        const event = $gamePlayer.checkFrontEvent();
        if (event && event._enemy) {
            members.push(this.player());
            members.push(event._enemy);
        }
        const nears = $gamePlayer.checkNearEvents();
        nears.forEach(nearEvent => {
            members.push(nearEvent._enemy);
        });
        this._battleMembers = members;
        this._battleMembers = _.sortBy(this._battleMembers,(a) => a.agi);
    }

    makeActions(){
        const _enemy = $gamePlayer.frontEnemy();
        let battleActions = [];
        this._battleMembers.forEach(battler => {
            let actions = battler.makeActions();
            actions.forEach(action => { 
                let target = null;
                if (battler.isActor()){
                    target = _enemy;
                } else{
                    target = this.player();
                    battler.setAction(action);
                }
                let battleAction = battler.battleAction();
                if (DataManager.isSkill(battleAction)){
                    action.setSkill(battleAction.id);
                } else{
                    action.setItem(battleAction.id);
                }
                action.makeActionResult([target]);
                battleActions.push(action);
            });

        });
        this._battleActions = battleActions;
    }

    startBattle(){
        const action = this._battleActions.shift();
        const _results = action._results;
        _results.forEach(result => {
            if (result.hpDamage > 0){

            }
        });
    }

    endBattle(){
        this._battleMembers = [];
        this._battleActions = [];
    }
}