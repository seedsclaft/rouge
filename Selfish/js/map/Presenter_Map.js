class Presenter_Map extends Presenter_Base {
    constructor(view) {
        super();
        this._isReady = false;
        this._view = view;
        this._model = new Model_Map();
        this.setEvent();
        this.start();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    async start(){
        $gameSystem.setResume("Map_Scene");
        this._resourcedata = this._model.loadResourceData();
        this._view.setResourceData(this._resourcedata);

        await this._model.loadMapData();
        this._model.setMapData();
        
        if ($gameTemp._needDisPlayEffectChange){
            BackGroundManager.setWeather($gameScreen.backGroundWeather());
            EventManager.setWeather($gameScreen.eventWeather());
            $gameTemp._needDisPlayEffectChange = false;
        }
        
        this._view.requestAutosave();
        this._isReady = true;
    }
    isReady(){
        return this._isReady;
    }

    updateCommand(){
        super.updateCommand();
        if (PopupManager.busy()){
            this._view.clearCommand();
            return;
        }
        if (Popup_Help.busy()){
            this._view.clearCommand();
            return;
        }
        if (this._view == null){
            return;
        }
        if (EventManager.busy() && this._view._command != MapCommand.Start){
            return;
        }
        switch (this._view._command){
            case MapCommand.Menu:
            return this.commandMenu();
            case MapCommand.Save:
            return this.commandSave();
            case MapCommand.SkipStage:
            return this.commandSkipStage();
            case MapCommand.EndStage:
            return this.commandEndStage();
            case MapCommand.Start:
            return this.commandStart();
            case MapCommand.MovePlayer:
            return this.commandMovePlayer();
            case MapCommand.Battle:
            return this.commandBattle();
            case MapCommand.Skill1:
            return this.commandSkillUse(1);
            case MapCommand.Skill2:
            return this.commandSkillUse(2);
            case MapCommand.Event:
            return this.commandEvent();
            case MapCommand.CheckRole:
            return this.commandCheckRole();
            case MapCommand.LevelUp:
            return this.commandLevelUp();
            case MapCommand.RoleUp:
            return this.commandRoleUp();
        }
        this._view.clearCommand();
    }

    commandStart(){
        const needTarnsfer = this._model.needTransfer();
        const fadeType = this._model.fadeType();
        const mapPictureName = this._model.mapPictureName();
        this._view.commandStart(needTarnsfer,fadeType,mapPictureName);
        const enableWeather = this._model.enableWeather();
        this._view.enableWeather(enableWeather);
        const mapName = this._model.mapName();
        this._view.showMapName(mapName);
        this.playMapBgm();
        BackGroundManager.changeBackGround($dataMap.battleback1Name);
    }

    playMapBgm(){
        if ($gamePlayer._battleState == false){
            $gameMap.autoplay();
        }
    }

    commandMenu(){
        this._view.commandMenu();
        SceneManager.push(Menu_Scene);
    }

    commandSave(){
        this._view.commandSave();
        SceneManager.push(Save_Scene);
    }

    commandSkipStage(){
        const stageData = this._model.stageData();
        $gameScreen.setFilters(null);
        FilterMzUtility.initFilters();
        if (stageData.length != 0){
            EventManager.setStage(stageData.id);
        } else{
            EventManager.endStage(stageData.id);
        }
    }

    commandEndStage(){
        EventManager.setup("common_009");
    }

    commandMovePlayer(){
        $gamePlayer.moveStraight(Input.dir8);
        $gameMap.moveStraightPlayer();
        this._view.updateFrontSprite();
    }

    commandBattle(setSkilled){
        if (setSkilled == false){
            _player.setBattleAction($dataSkills[1]);
        }
        const event = $gamePlayer.checkFrontEvent();
        const nears = $gamePlayer.checkNearEvents();
        const _player = this._model.player();
        const _playerLevel = _player.level;
        const _enemy = event._enemy;
        if (event && _enemy.isAlive()){
            let _battler = [_enemy,_player];
            let _enemyEvent = [event];
            nears.forEach(nearEvent => {
                _battler.push(nearEvent._enemy);
                _enemyEvent.push(nearEvent);
            });
            _battler = _.sortBy(_battler,(a) => a.agi);
            _battler.forEach(battler => {
                if (battler.isActor()){
                    let enemyEvent = _enemyEvent.find(a => a._enemy == _enemy);
                    this.commandActor(_player,_enemy,enemyEvent);
                } else{
                    let enemyEvent = _enemyEvent.find(a => a._enemy == battler);
                    this.commandEnemy(_player,battler,enemyEvent);
                }
            });
            this._view.updateStatus();
        }
        Input.clear();
        $gameMap.moveStraightPlayer();
        this._view.updateFrontSprite();
        if (event && _enemy.isAlive()){
            event.changeState(EnemyState.Battle);
        }
        if (_player.level > _playerLevel){
            this._model._levelUpValue = _player.level > _playerLevel;
            this.commandLevelUp();
        }
    }

    commandActor(_player,_enemy,event){
        const _result = this._model.commandBattle(_player,_enemy,1);
        if (_result < 0){
            _enemy.performDamage();
            this._view.effectStart(1);
            this._view.effectDamage(_result);
        }
        if (_enemy.isDead()){
            _enemy.performCollapse();
            const key = [event._mapId, event._eventId, "C"];
            $gameSelfSwitches.setValue(key, true);
            this._model.gainExp(_enemy.level());
        }
    }

    commandEnemy(_player,_enemy,event){
        if (_enemy.isAlive()){
            event.setStopCount(0);
            const _result = this._model.commandBattle(_enemy,_player,1);
            if (_result != 0){
                _player.performDamage();
            }
        }
        event.setMoveType(0);
        if (_player.isDead()){
            SceneManager.goto(Scene_Gameover);
        }
    }

    commandSkillUse(setId){
        const _player = this._model.player();
        const _skill = setId == 1 ? _player.skillSet1() : _player.skillSet2();
        if (_skill != null){
            _player.setBattleAction(_skill);
            this.commandBattle(true);
        }
    }

    commandEvent(){
        $gamePlayer.checkEventTriggerMapHere([0]);
    }

    commandLevelUp(){
        const _role = this._model.roleData();
        this._view.commandLevelUp(_role);
    }

    commandCheckRole(){
        const item = this._view._roleSelectWindow.item();
        const _changeRole = this._model.changeRoleData(item);
        this._view.commandCheckRole(_changeRole);
    }

    commandRoleUp(){
        const item = this._view._roleSelectWindow.item();
        this._model.roleUp(item);
    }
}