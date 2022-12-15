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
        if ($gamePlayer._state == State.Battle){
            members.push(this.player());
        }
        const _enemieEvents = $gameMap.getAllEnemyEvents();
        _enemieEvents.forEach(enemyEvent => {
            if (enemyEvent._state == State.Battle){
                members.push(enemyEvent._enemy);
            }
        });
        this._battleMembers = members.filter(a => a.canMove());
        this._battleMembers = _.sortBy(this._battleMembers,(a) => a.agi);
    }

    makeActions(){
        let battleActions = [];
        this._battleMembers.forEach(battler => {
            if (battler._chargeTurn > 0){
                battler._chargeTurn -= 1;
                if (battler._chargeTurn == 0){
                    battler._actions.forEach(action => {
                        battleActions.push(action);
                    });
                    return;
                }
            }
            let actions = battler.makeActions();
            actions.forEach(action => { 
                if (!battler.isActor()){
                    battler.setAction(action);
                }
                let battleAction = battler.battleAction();
                if (battleAction == null) return;
                if (DataManager.isSkill(battleAction)){
                    if ($dataSkills[battleAction.id].stypeId == 2){
                        if (battler.canUse($dataSkills[battleAction.id])){
                            if (battler._isChant == false){
                                battler._isChant = true;
                                battler.useItem($dataSkills[battleAction.id]);
                                return;
                            }
                            action.setSkill(battleAction.id);
                        }
                    } else
                    if ($dataSkills[battleAction.id].damage.elementId == 3){
                        if (battler.weapons().find(a => a && a.wtypeId == 4)){
                            if (battler._isArrow == false){
                                battler._isArrow = true;
                                return;
                            }
                            action.setSkill(battleAction.id);
                        } else{                        
                            return;
                        }
                    } else{
                        action.setSkill(battleAction.id);
                    }
                } else{
                    action.setItem(battleAction.id);
                }
                if (battler.canUse(action.item())){
                    battler._chargeTurn = action.chargeTurn();
                    action.setAgi(battler.agi);
                    battleActions.push(action);
                    if ($dataSkills[battleAction.id].stypeId == 2){
                        battler._isChant = false;
                    } else{
                        battler.useItem(action.item());
                    }
                    if ($dataSkills[battleAction.id].damage.elementId == 3 && battler._isArrow == true){ 
                        battler._isArrow = false;
                    }
                }
            });
        });
        this._battleActions = battleActions;
        this._battleActions = _.sortBy(this._battleActions,(a) => -a.agi());
    }

    makeActionResult(battler,action){
        let target = null;
        if (action.isForOpponent()){
            target = this.makeOpponentTarget(battler,action);
        } else{
            target = this.makeFriendTarget(battler,action);
        }
        if (target){
            action.makeActionResult([target]);
        }
    }

    makeOpponentTarget(battler,action){
        let target = null;
        let rangeType = action.item().rangeType;
        let range = action.item().range;
        if (battler.isActor()){
            let x = $gamePlayer.x;
            let y = $gamePlayer.y;
            const _direction = $gamePlayer.direction();
            for (let i = 0;i < range;i++){
                if (target) break;
                if (_direction ==DirectionType.Up){
                    y -= 1;
                }
                if (_direction ==DirectionType.Down){
                    y += 1;
                }
                if (_direction ==DirectionType.Right){
                    x += 1;
                }
                if (_direction ==DirectionType.Left){
                    x -= 1;
                }
                target = $gameMap.findEnemyByPosition(x,y);
            }
        } else{
            let enemyEvent = $gameMap.getEnemyEvent(battler);
            let x = enemyEvent.x;
            let y = enemyEvent.y;
            const _direction = enemyEvent.direction();
            for (let i = 0;i < range;i++){
                if (target) break;
                if (_direction ==DirectionType.Up){
                    y -= 1;
                }
                if (_direction ==DirectionType.Down){
                    y += 1;
                }
                if (_direction ==DirectionType.Right){
                    x += 1;
                }
                if (_direction ==DirectionType.Left){
                    x -= 1;
                }
                if (x == $gamePlayer.x && y == $gamePlayer.y){
                    target = this.player();
                }
                if (!target){
                    target = $gameMap.findEnemyByPosition(x,y);
                }
            }
        }
        return target;
    }

    makeFriendTarget(battler,action){
        return battler;
    }

    appryBattleActions(actions){

    }
    /*
    turnStateData(battler){
        let turnStateData = {add:[],remove:[]};
        if (battler){
            turnStateData = battler.onTurnEnd();
        }
        return turnStateData;
    }
    */

    removeState(action){
        let results = action.results();
        results.forEach(result => {
            const removeStates = result.removedStateObjects();
            if (removeStates){
                removeStates.forEach(state => {
                    result.target.removeState(state.id);
                });
            }
        });
    }

    addState(action){
        let results = action.results();
        let skill = $dataSkills[action.item().id];
        let turns = skill.stateTurns ? skill.stateTurns : 0;
        let stateEffect = skill.stateEffect ? skill.stateEffect : 0;
        results.forEach(result => {
            let addStates = result.addedStateObjects();
            if (addStates){
                addStates.forEach(state => {
                    result.target.addState(state.id,turns,stateEffect,false,0);
                });
            }
        });
    }

    endBattle(){
        this._battleMembers = [];
        this._battleActions = [];
        this.initDamageData();
    }

    enemyEvent(){
        return $gameMap.getAllEnemyEvents();
    }
}