class Model_Map extends Model_Base{
    constructor() {
        super();
        this._needTarnsfer = false;
        this._levelUpValue = 0;
        this._levelUpPoint = 0;
        this._tempRoleData = null;
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

    mapPictureName(){
        const event = $gamePlayer.checkFrontEvent();
        if (event){
            return event.characterName();
        }
        return '';
    }

    commandBattle(subject,target){
        let _weaponAtk = 0;
        if (subject.isActor()){
            const _weapon = subject.weapons();
            _weapon.forEach(w => {
                _weaponAtk += w.params[2];
            });
        } else{
            _weaponAtk = subject.atk;
        }
        const roleAtk = subject.getStateEffect($gameStateInfo.getStateId( StateType.ONE_HANDED ));
        const _skillAtk = 1 + 0.5 * roleAtk / 100;
        const _atk = (subject.atk - _weaponAtk) + _weaponAtk * _skillAtk;

        const _defRate = (target.def-1) * 0.12;
        if (!subject.isActor()){
            subject.makeActions();
            if (DataManager.isSkill(subject._actions[0]._item)){
                subject.setBattleAction($dataSkills[subject._actions[0]._item._itemId]);
            }
        }
        const _action = subject.battleAction();
        const _damageRate = _action != null ? Number( eval(_action.damage.formula) ) : 1.0;
        
        const _damage = Math.floor( _atk * (1-_defRate) * -1 * _damageRate);
        target.gainHp(_damage);
        return _damage;
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
}