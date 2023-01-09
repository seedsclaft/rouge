class Strategy_Model {
    constructor() {
        this._commandIndex = 0;
    }

    eventCheck(){
        const _stageData = $gameStageData.stageData($gameStage._stageId);
        const _readEvent = $gameStage.readEvent();
        if (_stageData){
            const _turn = (_stageData.turns) - $gameStage._turns;
            const _timing = 1;
            const event = _stageData.eventData.find(a => a.turns == _turn && a.timing == _timing);
            if (event && !_readEvent.contains(event.eventName)){
                $gameStage.addReadEvent(event.eventName);
                return event.eventName;
            }
        }
        return null;
    }

    currentCommand(){
        return this.commandList()[this._commandIndex];
    }

    commandNext(){
        this._commandIndex++;
    }

    energy(){
        return $gameParty.gold();
    }

    turnInfo(){
        return $gameStage.turns();
    }

    selectedData(category){
        return $gameStage.selectedData()[category];
    }

    commandList(){
        return $gameCommand.menuCommand();
    }

    selectedMember(){
        const _command = this.currentCommand();
        const _selected = this.selectedData(_command.key);
        let member = [];
        _selected.forEach(actorId => {
            member.push($gameActors.actor(actorId));
        });
        return member;
    }

    train(){
        let actor = this.selectedMember()[0];
        let lvUpData = {
            lv:actor.level,
            hp:0,
            mp:0,
            atk:0,
            spd:0,
            def:0
        };

        actor.levelUp();
        const _command = this.currentCommand();
        $gameStage.selectedData()[_command.key] = _.without($gameStage.selectedData()[_command.key],actor.actorId());
     
        lvUpData = {
            lv:lvUpData.lv - actor.level,
            hp:0,
            mp:0,
            atk:0,
            spd:0,
            def:0
        };
        return lvUpData;
    }

    alchemy(){
    }

    alchemyNameList(){
        return $gameStage.alchemyData().map(a => $dataSkills[a].name).join(",");
    }

    recovery(){
        const _command = this.currentCommand();
        const _selectedData = $gameStage.selectedData()[_command.key];
        _selectedData.forEach(actorId => {
            $gameActors.actor(actorId).recoverAll();
        });
    }

    recoveryNameList(){
        const _command = this.currentCommand();
        const _selectedData = $gameStage.selectedData()[_command.key];
        return _selectedData.map(a => $gameActors.actor(a).name()).join(",");
    }

    battleStart(){
        const _command = this.currentCommand();
        const _selectedData = $gameStage.selectedData()[_command.key];
        const _member = $gameParty.members();
        _member.forEach(member => {
            $gameParty.removeActor(member.actorId());
        });
        _selectedData.forEach(actorId => {
            $gameParty.addActor(actorId);
        });
        
        const _searchId = $gameStage.searchId();
        const _searchData = $gameSearch.getData(_searchId);



        let troop = new Game_Troop();
        this.makeEncounterTroopId(_searchData.enemyNum);
        troop.setup(_searchData.enemyNum,$gameParty.enemyRank(),$gameParty.enemyRank()+2);
        troop.setupBoss(6,_searchData.bossEnemy,$gameParty.enemyRank()+_searchData.bossLv);
        $gameTroop = troop;
    }

    makeEncounterTroopId(enemyNum) {
        let enemyList = []
        for (let i = 1;i < 21;i++){
            enemyList.push(i);
        }
        let troopData = $dataTroops[enemyNum];
        let enemyId = 0;
        for (let i = 0; i < enemyNum; i++) {
            enemyId = Math.floor(( Math.random() * enemyList.length));
            troopData.members[i].enemyId = enemyList[enemyId];
        }
    };

    magicRecovery(){
        const _command = this.currentCommand();
        const _selectedData = $gameStage.selectedData()[_command.key];
        let value = 0;
        _selectedData.forEach(select => {
            const a = $gameActors.actor( select );
            console.log(select)
            value += eval( $gameDefine.data().MagicRecover);
        });
        console.log($gameDefine.data().MagicRecover)
        $gameParty.gainGold(value);
    }

    magicRecoveryNameList(){
        const _command = this.currentCommand();
        const _selectedData = $gameStage.selectedData()[_command.key];
        return _selectedData.map(a => $gameActors.actor(a).name()).join(",");
    }

    turnend(){
        $gameStage._turns -= 1;
        $gameStage.clearSelect();
    }
}