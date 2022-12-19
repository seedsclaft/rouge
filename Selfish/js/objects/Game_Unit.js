//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.

//独自設計のため上書き
function Game_Unit() {
    this.initialize(...arguments);
}

Game_Unit.prototype.initialize = function() {
    this._inBattle = false;
};

Game_Unit.prototype.inBattle = function() {
    return this._inBattle;
};

Game_Unit.prototype.members = function() {
    return [];
};

Game_Unit.prototype.aliveMembers = function() {
    return this.members().filter(function(member) {
        return member.isAlive();
    });
};

Game_Unit.prototype.deadMembers = function() {
    return this.members().filter(function(member) {
        return member.isDead();
    });
};

Game_Unit.prototype.movableMembers = function() {
    return this.members().filter(function(member) {
        return member.canMove();
    });
};

Game_Unit.prototype.clearActions = function() {
    return this.members().forEach(function(member) {
        return member.clearActions();
    });
};

Game_Unit.prototype.agility = function() {
    var members = this.members();
    if (members.length === 0) {
        return 1;
    }
    var sum = members.reduce(function(r, member) {
        return r + member.agi;
    }, 0);
    return sum / members.length;
};

Game_Unit.prototype.tgrSum = function() {
    return this.aliveMembers().reduce(function(r, member) {
        return r + member.realTgr();
    }, 0);
};

Game_Unit.prototype.randomTarget = function() {
    var tgrRand = Math.random() * this.tgrSum();
    var target = null;
    this.aliveMembers().forEach(function(member) {
        tgrRand -= member.realTgr();
        if (tgrRand <= 0 && !target) {
            target = member;
        }
    });
    return target;
};

Game_Unit.prototype.randomHpTarget = function() {
    let target = _.sortBy(this.aliveMembers(),(member) => member.hp)[0];
    return target;
};

Game_Unit.prototype.randomMpTarget = function() {
    let target = _.sortBy(this.aliveMembers(),(member) => (member.mp / member.mmp))[0];
    return target;
};

Game_Unit.prototype.randomMpDamageTarget = function() {
    let target = _.sortBy(this.aliveMembers(),(member) => -member.mp)[0];
    return target;
};



Game_Unit.prototype.randomDeadTarget = function() {
    var members = this.deadMembers();
    if (members.length === 0) {
        return null;
    }
    return members[Math.floor(Math.random() * members.length)];
};

Game_Unit.prototype.smoothTarget = function(index) {
    if (index < 0) {
        index = 0;
    }
    var member = this.members()[index];
    return (member && member.isAlive()) ? member : this.aliveMembers()[0];
};

Game_Unit.prototype.smoothDeadTarget = function(index) {
    if (index < 0) {
        index = 0;
    }
    var member = this.members()[index];
    return (member && member.isDead()) ? member : this.deadMembers()[0];
};

Game_Unit.prototype.onBattleStart = function() {
    this.members().forEach(function(member) {
        member.onBattleStart();
    });
    this._inBattle = true;
};

Game_Unit.prototype.onBattleEnd = function() {
    this._inBattle = false;
    this.members().forEach(function(member) {
        member.onBattleEnd();
    });
};

Game_Unit.prototype.makeActions = function() {
    this.members().forEach(function(member) {
        member.makeActions();
    });
};

Game_Unit.prototype.select = function(activeMember) {
    this.members().forEach(function(member) {
        if (member === activeMember) {
            member.select();
        } else {
            member.deselect();
        }
    });
};

Game_Unit.prototype.isAllDead = function() {
    return this.aliveMembers().length === 0;
};

//0823 一番HPの少ない対象Idxを取得
Game_Unit.prototype.getAutoTargetIndex = function() {
    return _.sortBy(this.aliveMembers(),(target) => target.hp)[0].index();
}

//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

function Game_Party() {
    this.initialize(...arguments);
}

Game_Party.prototype = Object.create(Game_Unit.prototype);
Game_Party.prototype.constructor = Game_Party;

Game_Party.ABILITY_ENCOUNTER_HALF    = 0;
Game_Party.ABILITY_ENCOUNTER_NONE    = 1;
Game_Party.ABILITY_CANCEL_SURPRISE   = 2;
Game_Party.ABILITY_RAISE_PREEMPTIVE  = 3;
Game_Party.ABILITY_GOLD_DOUBLE       = 4;
Game_Party.ABILITY_DROP_ITEM_DOUBLE  = 5;

Game_Party.prototype.initialize = function() {
    Game_Unit.prototype.initialize.call(this);
    this._gold = 0;
    this._steps = 0;
    this._menuActorId = 0;
    this._actors = [];
    this.initAllItems();
    this._learnedSkills = [];
    
    //スキルNew済みIDリスト
    this._newSkillIdList = [];

    // 撃破敵リスト
    this._enemyInfoData = [];
    
    //読んだTipsリスト
    this._readTipsId = [];

    //読んだチュートリアルリスト
    this._readTutorialKey = [];

    //ステージNew済みIDリスト
    this._newStageIdList = [];

    // ヘルプ情報
    this._helpKeyData = [];

    this._stageData = new Game_Stage();
    this.getHelpKeyData();
};

Game_Party.prototype.getHelpKeyData = function() {
    if (this._helpKeyData == null){
        this._helpKeyData = [];
        $gameHelp.refresh();
    }
    return this._helpKeyData;
}

Game_Party.prototype.openHelpKeyData = function(key) {
    let helpkeyData = this.getHelpKeyData();
    helpkeyData.push({key:key , isOpen:true, isRead : false});
}

Game_Party.prototype.readHelpKeyData = function(key) {
    let helpkeyData = this.getHelpKeyData();
    let helpData = _.find(helpkeyData,(help) => help.key == key);
    if (helpData){
        helpData.isRead = true;
    }
}

Game_Party.prototype.clearReadTips = function() {
    this._readTipsId = [];
}

Game_Party.prototype.gainReadTips = function(tipsId) {
    this._readTipsId.push(tipsId);
}

Game_Party.prototype.checkReadTips = function(tipsId) {
    if (!this._readTipsId){
        this._readTipsId = [];
    }
    return _.contains(this._readTipsId,tipsId);
}

Game_Party.prototype.gainReadTutorial = function(key) {
    if (!this._readTutorialKey){
        this._readTutorialKey = [];
    }
    this._readTutorialKey.push(key);
}

Game_Party.prototype.checkReadTutorial = function(key) {
    if (!this._readTutorialKey){
        this._readTutorialKey = [];
    }
    return _.contains(this._readTutorialKey,key);
}


Game_Party.prototype.enemyInfoData = function() {
    return this._enemyInfoData;
}

Game_Party.prototype.addEnemyInfoData = function(enemyId) {
    if (! _.find(this._enemyInfoData,(eId) => eId == enemyId)){
        this._enemyInfoData.push(enemyId);
    }
}

Game_Party.prototype.initAllItems = function() {
    this._items = {};
    this._weapons = {};
    this._armors = {};
};

Game_Party.prototype.exists = function() {
    return this._actors.length > 0;
};

Game_Party.prototype.size = function() {
    return this.members().length;
};

Game_Party.prototype.isEmpty = function() {
    return this.size() === 0;
};

Game_Party.prototype.members = function() {
    return this.inBattle() ? this.battleMembers() : this.allMembers();
};

Game_Party.prototype.allMembers = function() {
    return this._actors.map(function(id) {
        return $gameActors.actor(id);
    });
};

Game_Party.prototype.battleMembers = function() {
    return this.allMembers().slice(0, this.maxBattleMembers()).filter(function(actor) {
        return actor.isAppeared();
    });
};

Game_Party.prototype.maxBattleMembers = function() {
    return 3;
};

Game_Party.prototype.leader = function() {
    return this.battleMembers()[0];
};

Game_Party.prototype.reviveBattleMembers = function() {
    this.battleMembers().forEach(function(actor) {
        if (actor.isDead()) {
            actor.setHp(1);
        }
    });
};

Game_Party.prototype.items = function() {
    var list = [];
    for (var id in this._items) {
        list.push($dataItems[id]);
    }
    return list;
};

Game_Party.prototype.weapons = function() {
    return Object.keys(this._weapons).map(id => $dataWeapons[id]);
};

Game_Party.prototype.armors = function() {
    var list = [];
    for (var id in this._armors) {
        list.push($dataArmors[id]);
    }
    return list;
};


Game_Party.prototype.equipItems = function() {
    return this.weapons().concat(this.armors());
};

Game_Party.prototype.allItems = function() {
    return this.items().concat(this.equipItems());
};

Game_Party.prototype.itemContainer = function(item) {
    if (!item) {
        return null;
    } else if (DataManager.isItem(item)) {
        return this._items;
    } else if (DataManager.isWeapon(item)) {
        return this._weapons;
    } else if (DataManager.isArmor(item)) {
        return this._armors;
    } else {
        return null;
    }
};

Game_Party.prototype.setupStartingMembers = function() {
    this._actors = [];
    $dataSystem.partyMembers.forEach(function(actorId) {
        if ($gameActors.actor(actorId)) {
            this._actors.push(actorId);
        }
    }, this);
};

Game_Party.prototype.name = function() {
    var numBattleMembers = this.battleMembers().length;
    if (numBattleMembers === 0) {
        return '';
    } else if (numBattleMembers === 1) {
        return this.leader().name();
    } else {
        return TextManager.partyName.format(this.leader().name());
    }
};

Game_Party.prototype.setupBattleTest = function() {
    this.setupBattleTestMembers();
    this.setupBattleTestItems();
    this.setupBattleTestStage();
};

Game_Party.prototype.setupBattleTestMembers = function() {
    $dataSystem.testBattlers.forEach(function(battler) {
        var actor = $gameActors.actor(battler.actorId);
        if (actor) {
            actor.changeLevel(battler.level, false);
            actor.initEquips(battler.equips);
            actor.recoverAll();
            this.addActor(battler.actorId);
        }
    }, this);
};

Game_Party.prototype.setupBattleTestItems = function() {
    $dataItems.forEach(function(item) {
        //if (item && item.name.length > 0) {
            this.gainItem(item, this.maxItems(item));
        //}
    }, this);
    $dataSkills.forEach(function(skill) {
        if (skill && skill.name.length > 0) {
            //this.members()[0].learnSkill(skill.id)
        }
    }, this);
};

Game_Party.prototype.highestLevel = function() {
    return Math.max.apply(null, this.members().map(function(actor) {
        return actor.level;
    }));
};

Game_Party.prototype.addActor = function(actorId) {
    if (!this._actors.contains(actorId)) {
        $gameActors.actor(actorId).skills().forEach(skill => {
            $gameParty.addLearnSkill(skill.id);
        });
        this._actors.push(actorId);
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
        $gameActors.actor(actorId).exChangeslotData();
    }
};

Game_Party.prototype.removeActor = function(actorId) {
    if (this._actors.contains(actorId)) {
        this._actors.splice(this._actors.indexOf(actorId), 1);
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
    }
};

Game_Party.prototype.gold = function() {
    return this._gold;
};

Game_Party.prototype.gainGold = function(amount) {
    this._gold = (this._gold + amount).clamp(0, this.maxGold());
};

Game_Party.prototype.loseGold = function(amount) {
    this.gainGold(-amount);
};

Game_Party.prototype.maxGold = function() {
    return 99999999;
};

Game_Party.prototype.steps = function() {
    return this._steps;
};

Game_Party.prototype.increaseSteps = function() {
    this._steps++;
};

Game_Party.prototype.numItems = function(item) {
    var container = this.itemContainer(item);
    return container ? container[item.id] || 0 : 0;
};

Game_Party.prototype.maxItems = function(item) {
    return 99;
};

Game_Party.prototype.hasMaxItems = function(item) {
    return this.numItems(item) >= this.maxItems(item);
};

Game_Party.prototype.hasItem = function(item, includeEquip) {
    if (includeEquip === undefined) {
        includeEquip = false;
    }
    if (this.numItems(item) > 0) {
        return true;
    } else if (includeEquip && this.isAnyMemberEquipped(item)) {
        return true;
    } else {
        return false;
    }
};

Game_Party.prototype.isAnyMemberEquipped = function(item) {
    return this.members().some(function(actor) {
        return actor.equips().contains(item);
    });
};

Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    var container = this.itemContainer(item);
    if (container) {
        var lastNumber = this.numItems(item);
        var newNumber = lastNumber + amount;
        container[item.id] = newNumber.clamp(0, this.maxItems(item));
        if (container[item.id] === 0) {
            delete container[item.id];
        }
        if (includeEquip && newNumber < 0) {
            this.discardMembersEquip(item, -newNumber);
        }
    }
};


Game_Party.prototype.discardMembersEquip = function(item, amount) {
    var n = amount;
    this.members().forEach(function(actor) {
        while (n > 0 && actor.isEquipped(item)) {
            actor.discardEquip(item);
            n--;
        }
    });
};

Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
    this.gainItem(item, -amount, includeEquip);
};

Game_Party.prototype.consumeItem = function(item) {
    if (DataManager.isItem(item) && item.consumable) {
        this.loseItem(item, 1);
    }
};

Game_Party.prototype.consumeArrow = function(item) {
    this.loseItem(item, 1);
};

Game_Party.prototype.canUse = function(item) {
    return this.members().some(function(actor) {
        return actor.canUse(item);
    });
};

Game_Party.prototype.canInput = function() {
    return this.members().some(function(actor) {
        return actor.canInput();
    });
};

Game_Party.prototype.isAllDead = function() {
    if (Game_Unit.prototype.isAllDead.call(this)) {
        return this.inBattle() || !this.isEmpty();
    } else {
        return false;
    }
};

Game_Party.prototype.menuActor = function() {
    var actor = $gameActors.actor(this._menuActorId);
    if (!this.allMembers().contains(actor)) {
        actor = this.allMembers()[0];
    }
    return actor;
};

Game_Party.prototype.setMenuActor = function(actor) {
    this._menuActorId = actor.actorId();
};

Game_Party.prototype.makeMenuActorNext = function() {
    var index = this.allMembers().indexOf(this.menuActor());
    if (index >= 0) {
        index = (index + 1) % this.allMembers().length;
        this.setMenuActor(this.allMembers()[index]);
    } else {
        this.setMenuActor(this.allMembers()[0]);
    }
};

Game_Party.prototype.makeMenuActorPrevious = function() {
    var index = this.allMembers().indexOf(this.menuActor());
    if (index >= 0) {
        index = (index + this.allMembers().length - 1) % this.allMembers().length;
        this.setMenuActor(this.allMembers()[index]);
    } else {
        this.setMenuActor(this.allMembers()[0]);
    }
};

Game_Party.prototype.swapOrder = function(index1, index2) {
    var temp = this._actors[index1];
    this._actors[index1] = this._actors[index2];
    this._actors[index2] = temp;
    $gamePlayer.refresh();
};

Game_Party.prototype.partyAbility = function(abilityId) {
    return this.battleMembers().some(function(actor) {
        return actor.partyAbility(abilityId);
    });
};

Game_Party.prototype.hasEncounterHalf = function() {
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
};

Game_Party.prototype.hasEncounterNone = function() {
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
};

Game_Party.prototype.hasCancelSurprise = function() {
    return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
};

Game_Party.prototype.hasRaisePreemptive = function() {
    return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
};

Game_Party.prototype.hasGoldDouble = function() {
    return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
};

Game_Party.prototype.hasDropItemDouble = function() {
    return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
};

Game_Party.prototype.performVictory = function() {
    this.members().forEach(function(actor) {
        actor.performVictory();
    });
};

Game_Party.prototype.performEscape = function() {
    this.members().forEach(function(actor) {
        actor.performEscape();
    });
};

Game_Party.prototype.removeBattleStates = function() {
    this.members().forEach(function(actor) {
        actor.removeBattleStates();
    });
};

Game_Party.prototype.requestMotionRefresh = function() {
};

Game_Party.prototype.addLearnSkill = function(skillId) {
    if (skillId < $gameDefine.defaultSlotId){
        return;
    }
    if (!this._learnedSkills.includes(skillId)){
        this._learnedSkills.push(skillId);
    }
};

// バトル終了時のステータスにする
Game_Party.prototype.resetBattleParameter = function() {
    this.allMembers().forEach(actor => {
        actor.refreshPassive();
        actor.gainHp(999);
        actor.gainMp(-999);
        actor.setLastTarget(null);
        actor.resetTurnCount();
    });
};


// 全員攻撃アップ
Game_Party.prototype.involvementPlus = function() {
    let plus = 0;
    const involemenetId = $gameStateInfo.getStateId(StateType.INVOLVEMENT);
    this.battleMembers().forEach(member => {
        if (member.isStateAffected(involemenetId)){
            plus += member.getStateEffect(involemenetId);
        }
    });
    return plus;
};

// 全員Grdアップ
Game_Party.prototype.ironWillPlus = function() {
    let plus = 0;
    const ironWillId = $gameStateInfo.getStateId(StateType.IRON_WILL);
    this.battleMembers().forEach(member => {
        if (member.isStateAffected(ironWillId)){
            plus += member.getStateEffect(ironWillId);
        }
    });
    return plus;
};

Game_Party.prototype.totalMp = function() {
    return this.battleMembers().reduce(function(r, actor) {
        return r + actor.mp;
    }, 0);
}

Game_Party.prototype.avarageLevel = function() {
    return this.aliveMembers().reduce(function(r, member) {
        return r + member.level;
    }, 0)
    / this.aliveMembers().length;
};

Game_Party.prototype.charactersForSavefile = function() {
    return this.battleMembers().map(actor => [
        actor.characterName(),
        actor.characterIndex()
    ]);
};

Game_Party.prototype.facesForSavefile = function() {
    return this.battleMembers().map(actor => [
        actor.faceName(),
        actor.faceIndex()
    ]);
};

Game_Party.prototype.removeInvalidMembers = function() {
    for (const actorId of this._actors) {
        if (!$dataActors[actorId]) {
            this._actors.remove(actorId);
        }
    }
};
//-----------------------------------------------------------------------------
// Game_Troop
//
// The game object class for a troop and the battle-related data.

function Game_Troop() {
    this.initialize(...arguments);
}

Game_Troop.prototype = Object.create(Game_Unit.prototype);
Game_Troop.prototype.constructor = Game_Troop;

Game_Troop.LETTER_TABLE_HALF = [
    ' A',' B',' C',' D',' E',' F',' G',' H',' I',' J',' K',' L',' M',
    ' N',' O',' P',' Q',' R',' S',' T',' U',' V',' W',' X',' Y',' Z'
];
Game_Troop.LETTER_TABLE_FULL = [
    'Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ',
    'Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ'
];

Game_Troop.prototype.initialize = function() {
    Game_Unit.prototype.initialize.call(this);
    this._interpreter = new Game_Interpreter();
    this.clear();
};

Game_Troop.prototype.isEventRunning = function() {
    return this._interpreter.isRunning();
};

Game_Troop.prototype.updateInterpreter = function() {
    this._interpreter.update();
};

Game_Troop.prototype.turnCount = function() {
    return this._turnCount;
};

Game_Troop.prototype.members = function() {
    return this._enemies;
};

Game_Troop.prototype.clear = function() {
    this._interpreter.clear();
    this._troopId = 0;
    this._eventFlags = {};
    this._enemies = [];
    this._turnCount = 0;
    this._namesCount = {};
};

Game_Troop.prototype.troop = function() {
    return $dataTroops[this._troopId];
};

Game_Troop.prototype.troopId = function() {
    return this._troopId;
};

Game_Troop.prototype.setup = function(troopId,enemyLevel) {
    this.clear();
    this._troopId = troopId;
    this._enemies = [];
    this.troop().members.forEach(function(member) {
        if ($dataEnemies[member.enemyId]) {
            var enemyId = member.enemyId;
            var x = member.x;
            var y = member.y;
            var enemy = new Game_Enemy(enemyId, x, y,enemyLevel);
            if (member.hidden) {
                enemy.hide();
            }
            this._enemies.push(enemy);
        }
    }, this);
    this.makeUniqueNames();
};

Game_Troop.prototype.makeUniqueNames = function() {
    var table = this.letterTable();
    this.members().forEach(function(enemy) {
        if (enemy.isAlive() && enemy.isLetterEmpty()) {
            var name = enemy.originalName();
            var n = this._namesCount[name] || 0;
            enemy.setLetter(table[n % table.length]);
            this._namesCount[name] = n + 1;
        }
    }, this);
    this.members().forEach(function(enemy) {
        var name = enemy.originalName();
        if (this._namesCount[name] >= 2) {
            enemy.setPlural(true);
        }
    }, this);
};

Game_Troop.prototype.letterTable = function() {
    return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL :
            Game_Troop.LETTER_TABLE_HALF;
};

Game_Troop.prototype.troopName = function() {
    var enemy = this.members()[0];
    if (this.members().length == 1){
        return enemy.originalName();
    }
    var boss = _.find(this.members(),(m) => m.collapseType() == 1);
    if (boss){
        enemy = boss;
    }
    return TextManager.partyName.format(enemy.originalName());
};

Game_Troop.prototype.meetsConditions = function(page) {
    var c = page.conditions;
    if (!c.turnEnding && !c.turnValid && !c.enemyValid &&
            !c.actorValid && !c.switchValid) {
        return false;  // Conditions not set
    }
    if (c.turnEnding) {
            return false;
    }
    if (c.turnValid) {
        var n = this._turnCount;
        var a = c.turnA;
        var b = c.turnB;
        if ((b === 0 && n !== a)) {
            return false;
        }
        if ((b > 0 && (n < 1 || n < a || n % b !== a % b))) {
            return false;
        }
    }
    if (c.enemyValid) {
        var enemy = $gameTroop.members()[c.enemyIndex];
        if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
            return false;
        }
    }
    if (c.actorValid) {
        var actor = $gameActors.actor(c.actorId);
        if (!actor || actor.hpRate() * 100 > c.actorHp) {
            return false;
        }
    }
    if (c.switchValid) {
        if (!$gameSwitches.value(c.switchId)) {
            return false;
        }
    }
    return true;
};

Game_Troop.prototype.setupBattleEvent = function() {
    if (!this._interpreter.isRunning()) {
        if (this._interpreter.setupReservedCommonEvent()) {
            return;
        }
        var pages = this.troop().pages;
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            if (this.meetsConditions(page) && !this._eventFlags[i]) {
                this._interpreter.setup(page.list);
                if (page.span <= 1) {
                    this._eventFlags[i] = true;
                }
                break;
            }
        }
    }
};

Game_Troop.prototype.increaseTurn = function() {
    var pages = this.troop().pages;
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        if (page.span === 1) {
            this._eventFlags[i] = false;
        }
    }
    this._turnCount++;
};

Game_Troop.prototype.expTotal = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r + enemy.exp();
    }, 0);
};

Game_Troop.prototype.goldTotal = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r + enemy.gold();
    }, 0) * this.goldRate();
};

Game_Troop.prototype.goldRate = function() {
    return $gameParty.hasGoldDouble() ? 2 : 1;
};

Game_Troop.prototype.makeDropItems = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r.concat(enemy.makeDropItems());
    }, []);
};

Game_Troop.prototype.isBoss = function() {
    if (_.find(this._enemies,(e) => e.enemyId() > $gameDefine.bossTroopId)){
        return true;
    }
    return false;
};

Game_Troop.prototype.bossEnemy = function() {
    return _.find(this._enemies,(e) => e.isBoss());
};

Game_Troop.prototype.isBossDead = function() {
    if (this.isBoss() && this.bossEnemy() != null && !this.bossEnemy().isAlive()){
        return true;
    }
    return false;
};

Game_Troop.prototype.enemiesNames = function() {
    let texts = [];
    const lang = $dataOption.getUserData('language');
    let checkEnemyData = [];
    this._enemies.forEach(enemyData => {
        if (checkEnemyData.indexOf(enemyData.enemyId()) != -1){
            return;
        }
        let enemyName = TextManager.getEnemyName(enemyData.enemyId());
        let name = "　" + enemyName;
        let margin = (lang == LanguageType.English) ? 18 : 9;
        let number = margin - enemyName.length;
        for (let i = 0 ;i < number ; i++){
            if (lang == LanguageType.English){
                name += " ";
            } else{
                name += "　";
            }
        }
        let enemyNumber = _.filter(this._enemies,(enemy) => { return enemy.enemyId() == enemyData.enemyId()});
        name += enemyNumber.length;
        texts.push(name);
        checkEnemyData.push(enemyData.enemyId());
    });
    /*
    for (const names in this._namesCount){
        let name = "　" + names;
        let number = 9 - names.length;
        for (var i = 0 ;i < number ; i++){
            name += "　";
        }
        name += this._namesCount[names];
        texts.push(name);
    }
    */
    return texts;
};


Game_Troop.prototype.avarageLevel = function() {
    return this.aliveMembers().reduce(function(r, member) {
        return r + member.level();
    }, 0)
    / this.aliveMembers().length;
};