class Strategy_Model {
    constructor() {
        this._commandIndex = 0;
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
            hp:actor.levelUpParam(0),
            mp:actor.levelUpParam(1),
            atk:actor.levelUpParam(2),
            spd:actor.levelUpParam(6),
            def:actor.levelUpParam(3)
        };
        console.log(lvUpData)
        return lvUpData;
    }

    alchemy(){
        $gameStage.alchemyData().forEach(alchemyId => {
            $gameParty.addLearnSkill(alchemyId);
        });
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
        troop.setup(_searchData.enemy,_searchData.lvMin,_searchData.lvMax);
        troop.setupBoss([_searchData.bossEnemy],_searchData.bossLv,_searchData.bossLv);
        $gameTroop = troop;
    }

    magicRecovery(){
        const _command = this.currentCommand();
        const _selectedData = $gameStage.selectedData()[_command.key];
        $gameParty.gainGold(_selectedData.length * 200);
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