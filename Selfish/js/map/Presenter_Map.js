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
            case MapCommand.CheckPoint:
            return this.commandCheckPoint();
            case MapCommand.LevelUp:
            return this.commandLevelUp();
            case MapCommand.DesideLevelUp:
            return this.commandDesideLevelUp();
            case MapCommand.ResetLevelUp:
            return this.commandResetLevelUp();
        }
        this._view.clearCommand();
    }

    commandStart(){
        const needTarnsfer = this._model.needTransfer();
        const fadeType = this._model.fadeType();
        this._view.commandStart(needTarnsfer,fadeType);
        const enableWeather = this._model.enableWeather();
        this._view.enableWeather(enableWeather);
        const mapName = this._model.mapName();
        this._view.showMapName(mapName);
        this.playMapBgm();
        this._view.refreshMiniMap();
        BackGroundManager.changeBackGround($dataMap.battleback1Name);
    }

    playMapBgm(){
        if ($gamePlayer._battleState == false){
            $gameMap.autoplay();
        } else{
            AudioManager.playBgm($gameBGM.getBgm('battle'));
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


    commandMovePlayer(){
        $gamePlayer.moveStraight(Input.dir8);
        $gameMap.moveStraightPlayer();
        this._view.updateFrontSprite();
    }

    commandBattle(setSkilled){
        console.error("command")
        const _player = this._model.player();
        if (!setSkilled){
            _player.setBattleAction($dataSkills[1]);
        }
        this._model.initDamageData();
        const event = $gamePlayer.checkFrontEvent();
        const nears = $gamePlayer.checkNearEvents();
        const _playerLevel = _player.level;
        let _enemy = null;
        if (event) {
            _enemy = event._enemy;
        }
        this._model.setBattleMembers();
        this._model.makeActions();

        let deadTarget = [];
        const _actions = this._model._battleActions;
        
        _actions.forEach(action => {
            let battler = action.subject();
            if (battler.isDead()){
                return;
            }
            let _results = action._results;
            _results.forEach(result => {
                let target = result.target;
                action.applyResult(target,result);
                if (result.hpDamage > 0){
                    target.performDamage();
                    if (target.isActor()){
                        this._model.pushDamageData(result.hpDamage);
                    } else{
                        this._view.enemyEffectDamage(result.hpDamage);
                    }
                }
                if (_player.isDead()){
                    SceneManager.goto(Scene_Gameover);
                }
                if (target.isDead()){
                    deadTarget.push(target);
                    target.performCollapse();
                }
            });
        });

        let totalDamage = this._model.totalDamage();
        if (totalDamage > 0){
            this._view.playerEffectDamage(totalDamage,1);
        }
        this._view.updateStatus();

        this._model.endBattle();
        Input.clear();
        $gameMap.moveStraightPlayer();
        this._view.updateFrontSprite();
        if (event && _enemy.isAlive()){
            event.changeState(EnemyState.Battle);
        }
        let _enemyEvent = [];
        if (event && event._enemy) {
            _enemyEvent.push(event);
        }
        nears.forEach(nearEvent => {
            _enemyEvent.push(nearEvent);
        });
        
        _enemyEvent.forEach(enemyEvent => {
            enemyEvent.setStopCount(0);        
            enemyEvent.setMoveType(0);
        });
        deadTarget.forEach(enemy => {
            let enemyEvent = _enemyEvent.find(a => a._enemy == enemy);
            const key = [enemyEvent._mapId, enemyEvent._eventId, "C"];
            $gameSelfSwitches.setValue(key, true);
            this._model.gainExp(enemy.level());
        });
        if (_player.level > _playerLevel){
            this._model.makeLevelUpData(_player.level - _playerLevel);
            SoundManager.playLevelUp();
            EventManager.startLogText("Level Up : " + _player.level);
            this.commandLevelUp();
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
        const _role = this._model.tempRoleData();
        const _value = this._model._levelUpPoint;
        this._view.commandLevelUp(_role,_value);
    }

    commandCheckPoint(){
        const item = this._view._roleSelectWindow.item();
        const _changeRole = this._model.changeRoleData(item);
        if (this._model._levelUpPoint == 0){
            this._view.commandCheckPoint(_changeRole);
        } else{        
            const _value = this._model._levelUpPoint;
            this._view.nextCheckPoint(_changeRole,_value);
        }
    }

    commandResetLevelUp(){
        const _role = this._model.resetLevelUpData();
        const _value = this._model._levelUpPoint;
        this._view.commandLevelUp(_role,_value);
    }

    commandDecideLevelUp(){
        this._model.desideLevelUp();
    }
}