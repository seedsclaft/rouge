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
        console.error($gameStage.selectedData())
        return $gameStage.selectedData()[category];
    }

    commandList(){
        return $gameCommand.menuCommand();
    }

    selectedMember(){
        const _command = this.currentCommand();
        const _selected = this.selectedData(_command.key);
        console.log(_command)
        console.log(_selected)
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
            hp:actor.mhp,
            mp:actor.mmp,
            atk:actor.atk,
            spd:actor.agi,
            def:actor.def
        };

        actor.changeExp(100);
        const _command = this.currentCommand();
        $gameStage.selectedData()[_command.key] = _.without(actor.actorId(),$gameStage.selectedData()[_command.key]);
     
        lvUpData = {
            lv:lvUpData.lv - actor.level,
            hp:lvUpData.hp - actor.mhp,
            mp:lvUpData.mp - actor.mmp,
            atk:lvUpData.atk - actor.atk,
            spd:lvUpData.spd - actor.agi,
            def:lvUpData.def - actor.def
        };
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
        troop.setup(_searchData.bossEnemy,_searchData.bossLv);
        $gameTroop = troop;
    }
}