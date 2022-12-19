class Strategy_Model {
    constructor() {
        this._commandIndex = 0;
    }

    currentCommand(){
        return this.commandList()[this._commandIndex];
    }

    energy(){
        return $gameParty.gold();
    }

    turnInfo(){
        return $gameParty._stageData._turns;
    }

    selectedData(category){
        return $gameParty._stageData._selectedData[category];
    }

    commandList(){
        return $gameCommand.menuCommand();
    }

    selectedMember(){
        const _command = this.currentCommand();
        const _selected = this.selectedData(_command.key)
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
        $gameParty._stageData._selectedData[_command.key] = _.without(actor.actorId(),$gameParty._stageData._selectedData[_command.key]);
     
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
}