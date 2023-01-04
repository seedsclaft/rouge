//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.

//独自設計のため上書き
function Game_BattlerBase() {
    this.initialize(...arguments);
}

Game_BattlerBase.TRAIT_ELEMENT_RATE   = 11;
Game_BattlerBase.TRAIT_DEBUFF_RATE    = 12;
Game_BattlerBase.TRAIT_STATE_RATE     = 13;
Game_BattlerBase.TRAIT_STATE_RESIST   = 14;
Game_BattlerBase.TRAIT_PARAM          = 21;
Game_BattlerBase.TRAIT_XPARAM         = 22;
Game_BattlerBase.TRAIT_SPARAM         = 23;
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
Game_BattlerBase.TRAIT_ATTACK_STATE   = 32;
Game_BattlerBase.TRAIT_ATTACK_SPEED   = 33;
Game_BattlerBase.TRAIT_ATTACK_TIMES   = 34;
Game_BattlerBase.TRAIT_STYPE_ADD      = 41;
Game_BattlerBase.TRAIT_STYPE_SEAL     = 42;
Game_BattlerBase.TRAIT_SKILL_ADD      = 43;
Game_BattlerBase.TRAIT_SKILL_SEAL     = 44;
Game_BattlerBase.TRAIT_EQUIP_WTYPE    = 51;
Game_BattlerBase.TRAIT_EQUIP_ATYPE    = 52;
Game_BattlerBase.TRAIT_EQUIP_LOCK     = 53;
Game_BattlerBase.TRAIT_EQUIP_SEAL     = 54;
Game_BattlerBase.TRAIT_SLOT_TYPE      = 55;
Game_BattlerBase.TRAIT_ACTION_PLUS    = 61;
Game_BattlerBase.TRAIT_SPECIAL_FLAG   = 62;
Game_BattlerBase.TRAIT_COLLAPSE_TYPE  = 63;
Game_BattlerBase.TRAIT_PARTY_ABILITY  = 64;
Game_BattlerBase.FLAG_ID_AUTO_BATTLE  = 0;
Game_BattlerBase.FLAG_ID_GUARD        = 1;
Game_BattlerBase.FLAG_ID_SUBSTITUTE   = 2;
Game_BattlerBase.FLAG_ID_PRESERVE_TP  = 3;
Game_BattlerBase.ICON_BUFF_START      = 32;
Game_BattlerBase.ICON_DEBUFF_START    = 48;
// スキルタイプ
Game_BattlerBase.SKILL_TYPE_MAGIC       = 1; //魔法スキル
Game_BattlerBase.SKILL_TYPE_COMMON      = 0; //共通スキル
Game_BattlerBase.SKILL_TYPE_PASSIVE     = 2; //パッシブスキル
Game_BattlerBase.SKILL_TYPE_SPECIAL     = 3; //固有スキル

Object.defineProperties(Game_BattlerBase.prototype, {
    // Hit Points
    hp: { get: function() { return this._hp; }, configurable: true },
    // Magic Points
    mp: { get: function() { return this._mp; }, configurable: true },
    // Tactical Points
    tp: { get: function() { return this._tp; }, configurable: true },
    // Maximum Hit Points
    mhp: { get: function() { return this.param(0); }, configurable: true },
    // Maximum Magic Points
    mmp: { get: function() { return this.param(1); }, configurable: true },
    // ATtacK power
    atk: { get: function() { return this.param(2); }, configurable: true },
    // DEFense power
    def: { get: function() { return this.param(3); }, configurable: true },
    // Magic ATtack power
    mat: { get: function() { return this.param(4); }, configurable: true },
    // Magic DeFense power
    mdf: { get: function() { return this.param(5); }, configurable: true },
    // AGIlity
    agi: { get: function() { return this.param(6); }, configurable: true },
    // LUcK
    luk: { get: function() { return this.param(7); }, configurable: true },
    // HIT rate
    hit: { get: function() { return this.xparam(0); }, configurable: true },
    // EVAsion rate
    eva: { get: function() { return this.xparam(1); }, configurable: true },
    // CRItical rate
    cri: { get: function() { return this.xparam(2); }, configurable: true },
    // Critical EVasion rate
    cev: { get: function() { return this.xparam(3); }, configurable: true },
    // Magic EVasion rate
    mev: { get: function() { return this.xparam(4); }, configurable: true },
    // Magic ReFlection rate
    mrf: { get: function() { return this.xparam(5); }, configurable: true },
    // CouNTer attack rate
    cnt: { get: function() { return this.xparam(6); }, configurable: true },
    // Hp ReGeneration rate
    hrg: { get: function() { return this.xparam(7); }, configurable: true },
    // Mp ReGeneration rate
    mrg: { get: function() { return this.xparam(8); }, configurable: true },
    // Tp ReGeneration rate
    trg: { get: function() { return this.xparam(9); }, configurable: true },
    // TarGet Rate
    tgr: { get: function() { return this.sparam(0); }, configurable: true },
    // GuaRD effect rate
    grd: { get: function() { return this.sparam(1); }, configurable: true },
    // RECovery effect rate
    rec: { get: function() { return this.sparam(2); }, configurable: true },
    // PHArmacology
    pha: { get: function() { return this.sparam(3); }, configurable: true },
    // Mp Cost Rate
    mcr: { get: function() { return this.sparam(4); }, configurable: true },
    // Tp Charge Rate
    tcr: { get: function() { return this.sparam(5); }, configurable: true },
    // Physical Damage Rate
    pdr: { get: function() { return this.sparam(6); }, configurable: true },
    // Magical Damage Rate
    mdr: { get: function() { return this.sparam(7); }, configurable: true },
    // Floor Damage Rate
    fdr: { get: function() { return this.sparam(8); }, configurable: true },
    // EXperience Rate
    exr: { get: function() { return this.sparam(9); }, configurable: true }
});

Game_BattlerBase.prototype.initialize = function() {
    this.initMembers();
};

Game_BattlerBase.prototype.initMembers = function() {
    this._hp = 1;
    this._mp = 0;
    this._tp = 0;
    this._bindBatllers = [];
    this._hidden = false;
    this.clearParamPlus();
    this.clearStates();
};

Game_BattlerBase.prototype.clearParamPlus = function() {
    this._paramPlus = [0,0,0,0,0,0,0,0];
};

Game_BattlerBase.prototype.clearStates = function() {
    this._stateData = [];
};

Game_BattlerBase.prototype.eraseState = function(stateId,slotId = 0) {
    const stateDataIndex = _.findIndex(this._stateData,(data) => data.id == stateId && data.slotId == slotId);
    if (stateDataIndex >= 0){
        this._stateData.splice(stateDataIndex, 1);
    }
};

Game_BattlerBase.prototype.isStateAffected = function(stateId,battlerId,slotId) {
    return this.getStateData(stateId,battlerId,slotId) != null;
};

Game_BattlerBase.prototype.getStateData = function(stateId,battlerId = 0,slotId = 0) {
    let stateData;
    if (battlerId == 0){
        stateData = _.find(this._stateData,(data) => data.id == stateId);
    } else{
        stateData = _.find(this._stateData,(data) => data.id == stateId && data.battlerId == battlerId && data.slotId == slotId);
    }
    if (stateData){
        return stateData;
    }
    return null;
};

Game_BattlerBase.prototype.getStateDataAll = function(stateId) {
    let stateDataList = [];
    stateDataList = _.filter(this._stateData,(data) => {return data.id == stateId});
    return stateDataList;
};

Game_BattlerBase.prototype.getStateTurns = function(stateId) {
    let stateData = this.getStateData(stateId);
    if (stateData){
        return stateData.turns;
    }
    return 0;
};

Game_BattlerBase.prototype.getStateEffect = function(stateId) {
    const total = $gameStateInfo.isTotalStateId(stateId);
    if (total){
        return this.getStateEffectTotal(stateId);
    }
    const stateData = this.getStateData(stateId);
    if (stateData){
        return stateData.effect;
    }
    return 0;
};

Game_BattlerBase.prototype.getStateEffectTotal = function(stateId) {
    let stateData = _.filter(this._stateData,(state) => {
        return state.id == stateId;
    });
    let effect = 0;
    if (stateData.length > 0){
        stateData.forEach(state => {
            effect += state.effect;
        });
        return effect;
    }
    return effect;
};

Game_BattlerBase.prototype.addNewStateData = function(stateId,turns,effect,passive,battlerId,slotId) {
    let stateData = new Game_States();
    stateData.setup(stateId,turns,effect,passive,battlerId,slotId);
    this._stateData.push(stateData);
    this.sortStates();
};

Game_BattlerBase.prototype.updateStateData = function(stateId,turns,effect,passive,battlerId,slotId) {
    let stateData = this.getStateData(stateId,battlerId,slotId);
    if (stateData){
        // チャージの場合は効果値を加算
        if (stateId == $gameStateInfo.getStateId(StateType.CHARGE)){
            effect += stateData.effect;
            if (effect >= 200) effect = 200; 
        }
        stateData.setup(stateId,turns,effect,passive,battlerId,slotId);
        this.sortStates();
    }
};

Game_BattlerBase.prototype.isDeathStateAffected = function() {
    return this.isStateAffected(this.deathStateId());
};

Game_BattlerBase.prototype.deathStateId = function() {
    return $gameStateInfo.getStateId(StateType.DEATH);
};

Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
};

Game_BattlerBase.prototype.updateStateTurns = function() {
    this._stateData.forEach(stateData => {
        stateData.updateStateTurns();
    }, this);
};

Game_BattlerBase.prototype.updateStateTimes = function() {
    this._stateData.forEach(stateData => {
        stateData.updateStateTimes();
    }, this);
};

Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
    this.clearStates();
    this.resetAp();
};

Game_BattlerBase.prototype.revive = function() {
    if (this._hp === 0) {
        this._hp = 1;
    }
};

Game_BattlerBase.prototype.states = function() {
    return this._stateData.map(function(state) {
        return $dataStates[state.id];
    });
};

Game_BattlerBase.prototype.stateIcons = function() {
    return this.states()
        .map(state => state.iconIndex)
        .filter(iconIndex => iconIndex > 0);
};

Game_BattlerBase.prototype.allIcons = function() {
    return this.stateIcons();
};

Game_BattlerBase.prototype.traitObjects = function() {
    // Returns an array of the all objects having traits. States only here.
    return this.states();
};

Game_BattlerBase.prototype.allTraits = function() {
    return this.traitObjects().reduce(function(r, obj) {
        return r.concat(obj.traits);
    }, []);
};

Game_BattlerBase.prototype.traits = function(code) {
    return this.allTraits().filter(function(trait) {
        return trait.code === code;
    });
};

Game_BattlerBase.prototype.traitsWithId = function(code, id) {
    return this.allTraits().filter(function(trait) {
        return trait.code === code && trait.dataId === id;
    });
};

Game_BattlerBase.prototype.traitsPi = function(code, id) {
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        return r * trait.value;
    }, 1);
};

Game_BattlerBase.prototype.traitsSum = function(code, id) {
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        return r + trait.value;
    }, 0);
};

Game_BattlerBase.prototype.traitsSumAll = function(code) {
    return this.traits(code).reduce(function(r, trait) {
        return r + trait.value;
    }, 0);
};

Game_BattlerBase.prototype.traitsSet = function(code) {
    return this.traits(code).reduce(function(r, trait) {
        return r.concat(trait.dataId);
    }, []);
};

Game_BattlerBase.prototype.paramBase = function(paramId) {
    return 0;
};

Game_BattlerBase.prototype.paramPlus = function(paramId) {
    return this._paramPlus[paramId];
};

Game_BattlerBase.prototype.paramMin = function(paramId) {
    if (paramId === 1) {
        return 0;   // MMP
    } else {
        return 1;
    }
};

Game_BattlerBase.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 999999;  // MHP
    } else {
        return 9999;
    }
};

Game_BattlerBase.prototype.paramRate = function(paramId) {
    let value = this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
    if (paramId == 2){
        let rate = this.getStateEffect($gameStateInfo.getStateId(StateType.ATK_BUFF_RATE));
        if (rate){ value *= rate};
    }
    if (paramId == 3){
        let rate = this.getStateEffect($gameStateInfo.getStateId(StateType.DEF_BUFF_RATE));
        if (rate){ value *= rate};
    }
    return value;
};

Game_BattlerBase.prototype.param = function(paramId) {
    let value = this.paramBase(paramId) + this.paramPlus(paramId);
    value *= this.paramRate(paramId);
    const maxValue = this.paramMax(paramId);
    const minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_BattlerBase.prototype.xparam = function(xparamId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
};

Game_BattlerBase.prototype.sparam = function(sparamId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
};

Game_BattlerBase.prototype.elementRate = function(elementId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
};

Game_BattlerBase.prototype.stateRate = function(stateId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
};

Game_BattlerBase.prototype.stateResistSet = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
};

Game_BattlerBase.prototype.isStateResist = function(stateId) {
    return this.stateResistSet().contains(stateId);
};

Game_BattlerBase.prototype.attackElements = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
};

Game_BattlerBase.prototype.attackStates = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
};

Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
};

Game_BattlerBase.prototype.attackSpeed = function() {
    return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
};

Game_BattlerBase.prototype.attackTimesAdd = function() {
    return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
};

Game_BattlerBase.prototype.addedSkillTypes = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
};

Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
};

Game_BattlerBase.prototype.addedSkills = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
};

Game_BattlerBase.prototype.isSkillSealed = function(skillId) {
    const sealskillId = $gameStateInfo.getStateId(StateType.SEAL_SKILL);
    if (this.isStateAffected(sealskillId)){
        const stateDataAll = this.getStateDataAll(sealskillId);
        const isSeal = _.find(stateDataAll,(stateData) => stateData.effect == skillId);
        return isSeal;
    }
    const silentId = $gameStateInfo.getStateId(StateType.SILENT);
    if (this.isStateAffected(silentId)){
        const skill = $dataSkills[skillId];
        if (skill){
            return this.skillMpCost( skill ) > 0;
        }
    }
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
};

Game_BattlerBase.prototype.isEquipWtypeOk = function(wtypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
};

Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
};

Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
};

Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
};

Game_BattlerBase.prototype.slotType = function() {
    const set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};

Game_BattlerBase.prototype.isDualWield = function() {
    return this.slotType() === 1;
};

Game_BattlerBase.prototype.actionPlusSet = function() {
    return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(function(trait) {
        return trait.value;
    });
};

Game_BattlerBase.prototype.specialFlag = function(flagId) {
    return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(function(trait) {
        return trait.dataId === flagId;
    });
};

Game_BattlerBase.prototype.collapseType = function() {
    const set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};

Game_BattlerBase.prototype.partyAbility = function(abilityId) {
    return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(function(trait) {
        return trait.dataId === abilityId;
    });
};

Game_BattlerBase.prototype.isAutoBattle = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
};

Game_BattlerBase.prototype.isGuard = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
};

Game_BattlerBase.prototype.isSubstitute = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
};

Game_BattlerBase.prototype.isPreserveTp = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
};

Game_BattlerBase.prototype.addParam = function(paramId, value) {
    this._paramPlus[paramId] += value;
    this.refresh();
};

Game_BattlerBase.prototype.setHp = function(hp) {
    this._hp = hp;
    this.refresh();
};

Game_BattlerBase.prototype.setMp = function(mp) {
    this._mp = mp;
    this.refresh();
};

Game_BattlerBase.prototype.setTp = function(tp) {
    this._tp = tp;
    this.refresh();
};

Game_BattlerBase.prototype.maxTp = function() {
    return 100;
};

Game_BattlerBase.prototype.refresh = function() {
    this.stateResistSet().forEach(function(stateId) {
        this.eraseState(stateId);
    }, this);
    this._hp = this._hp.clamp(0, this.mhp);
    this._mp = this._mp.clamp(0, this.mmp);
    this._tp = this._tp.clamp(0, this.maxTp());
};

Game_BattlerBase.prototype.recoverAll = function() {
    this.clearStates();
    this._hp = this.mhp;
    this._mp = this.mmp;
    this._tp = this.maxTp();
};

Game_BattlerBase.prototype.hpRate = function() {
    return this.hp / this.mhp;
};

Game_BattlerBase.prototype.mpRate = function() {
    return this.mmp > 0 ? this.mp / this.mmp : 0;
};

Game_BattlerBase.prototype.tpRate = function() {
    return this.tp / this.maxTp();
};

Game_BattlerBase.prototype.hide = function() {
    this._hidden = true;
};

Game_BattlerBase.prototype.appear = function() {
    this._hidden = false;
};

Game_BattlerBase.prototype.isHidden = function() {
    return this._hidden;
};

Game_BattlerBase.prototype.isAppeared = function() {
    return !this.isHidden();
};

Game_BattlerBase.prototype.isDead = function() {
    return this.isAppeared() && this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isAlive = function() {
    return this.isAppeared() && !this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isUnderHalf = function(current) {
    let hp = this._hp;
    if (current){
        hp = current;
    }
    return this.isAlive() && hp < this.mhp / 2;
};

Game_BattlerBase.prototype.isDying = function(current) {
    let hp = this._hp;
    if (current){
        hp = current;
    }
    return this.isAlive() && hp < this.mhp / 4;
};

Game_BattlerBase.prototype.isRestricted = function() {
    return this.isAppeared() && this.restriction() > 0;
};

Game_BattlerBase.prototype.canInput = function() {
    return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
};

Game_BattlerBase.prototype.canMove = function() {
    return this.isAppeared() && this.restriction() < 4;
};

Game_BattlerBase.prototype.isConfused = function() {
    return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
};

Game_BattlerBase.prototype.confusionLevel = function() {
    return this.isConfused() ? this.restriction() : 0;
};

Game_BattlerBase.prototype.isActor = function() {
    return false;
};

Game_BattlerBase.prototype.isEnemy = function() {
    return false;
};

Game_BattlerBase.prototype.sortStates = function() {
    this._stateData.sort(function(a, b) {
        const p1 = $dataStates[a.id].priority;
        const p2 = $dataStates[b.id].priority;
        if (p1 !== p2) {
            return p2 - p1;
        }
        return a - b;
    });
};

Game_BattlerBase.prototype.restriction = function() {
    return Math.max.apply(null, this.states().map(function(state) {
        return state.restriction;
    }).concat(0));
};

Game_BattlerBase.prototype.addNewState = function(stateId) {
    if (stateId === this.deathStateId()) {
        this.removeChainState();
        this.removeChainSelfState();
        this.die();
    }
    const restricted = this.isRestricted();
    if (!restricted && this.isRestricted()) {
        this.onRestrict();
    }
};

Game_BattlerBase.prototype.onRestrict = function() {
};

Game_BattlerBase.prototype.stateMotionIndex = function() {
    const states = this.states();
    if (states.length > 0) {
        return states[0].motion;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.stateOverlayIndex = function() {
    const states = this.states();
    if (states.length > 0) {
        return states[0].overlay;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.stateOverlayIndexList = function() {
    const states = this.states();
    let indexList = [];
    states.forEach(state => {
        if (state.overlay != 0 && indexList.indexOf(state.overlay) == -1){
            indexList.push(state.overlay);
        }
    });
    return indexList;
};

Game_BattlerBase.prototype.isSkillWtypeOk = function(skill) {
    return true;
};

Game_BattlerBase.prototype.skillMpCost = function(skill) {
    return Math.floor(skill.mpCost * this.mcr);
};

Game_BattlerBase.prototype.skillTpCost = function(skill) {
    return Math.floor(skill.tpCost * this.tcr);
};

Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
};

Game_BattlerBase.prototype.paySkillCost = function(skill,mpOnly = false) {
    this._mp -= this.skillMpCost(skill);
    if (!mpOnly){
        this._tp -= this.skillTpCost(skill);
    }
};

Game_BattlerBase.prototype.isOccasionOk = function(item) {
    if ($gameParty.inBattle()) {
        return item.occasion === 0 || item.occasion === 1;
    } else {
        return item.occasion === 0 || item.occasion === 2;
    }
};

Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
    return this.canMove() && this.isOccasionOk(item);
};

Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    return (
        this.meetsUsableItemConditions(skill) &&
        this.isSkillWtypeOk(skill) &&
        this.canPaySkillCost(skill) &&
        !this.isSkillSealed(skill.id) &&
        !this.isSkillTypeSealed(skill.stypeId)
    );
};

Game_BattlerBase.prototype.meetsSkillScopeConditions = function(skill) {
    if ($gameTroop.aliveMembers().length > 0){
        return true;
    }
    if (skill.scope == ScopeType.ONE_ENEMY || skill.scope == ScopeType.ALL_ENEMY){
        return false;
    }
    return true;
}

Game_BattlerBase.prototype.meetsItemConditions = function(item) {
    return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
};

Game_BattlerBase.prototype.canUse = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isSkill(item)) {
        return this.meetsSkillConditions(item);
    } else if (DataManager.isItem(item)) {
        return this.meetsItemConditions(item);
    } else {
        return false;
    }
};

Game_BattlerBase.prototype.canEquip = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isWeapon(item)) {
        return this.canEquipWeapon(item);
    } else if (DataManager.isArmor(item)) {
        return this.canEquipArmor(item);
    } else {
        return false;
    }
};

Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
};

Game_BattlerBase.prototype.canEquipArmor = function(item) {
    return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
};

Game_BattlerBase.prototype.attackSkillId = function() {
    return 1;
};

Game_BattlerBase.prototype.guardSkillId = function() {
    return 2;
};

Game_BattlerBase.prototype.canAttack = function() {
    return this.canUse($dataSkills[this.attackSkillId()]);
};

Game_BattlerBase.prototype.canGuard = function() {
    return this.canUse($dataSkills[this.guardSkillId()]);
};

//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

function Game_Battler() {
    this.initialize.apply(this, arguments);
}

Game_Battler.prototype = Object.create(Game_BattlerBase.prototype);
Game_Battler.prototype.constructor = Game_Battler;

Game_Battler.prototype.initialize = function() {
    Game_BattlerBase.prototype.initialize.call(this);
};

Game_Battler.prototype.initMembers = function() {
    Game_BattlerBase.prototype.initMembers.call(this);
    this._actions = [];
    this._lastTargetIndex = null;
    this._animations = [];
    this._effectType = null;
    this._selected = false;
    

    this._battleOrder = 0;

    //ターン行動数
    this._turnCount = 1;
    this._elementId = null;

    // ダメージ総計
    this._addDamage = 0;
    this._bindDamage = 0;
};

Game_Battler.prototype.battlerId = function() {
    return this.isActor() == true ? this.actorId() : this.index() * -1;
}

Game_Battler.prototype.setBattleOrder = function(order) {
    this._battleOrder = order;
};

Game_Battler.prototype.resetBattleOrder = function() {
    this._battleOrder = 0;
};

Game_Battler.prototype.battleOrder = function() {
    return this._battleOrder;
};

Game_Battler.prototype.resetAp = function() {
    if (this.isStateAffected($gameStateInfo.getStateId(StateType.CHAIN_SELF))){
        this._ap = 1;
        return;
    }
    this._ap = 500 - this.agi * 4;
};

Game_Battler.prototype.gainAddDamage = function(value) {
    this._addDamage += value
}

Game_Battler.prototype.addDamage = function() {
    return this._addDamage;
}

Game_Battler.prototype.gainBindDamage = function(value) {
    this._bindDamage += value
}

Game_Battler.prototype.bindDamage = function() {
    return this._bindDamage;
}

Game_Battler.prototype.stratDashApParam = function() {

}

Game_Battler.prototype.lastTargetIndex = function() {
    return this._lastTargetIndex;
}

Game_Battler.prototype.clearAnimations = function() {
    this._animations = [];
};

Game_Battler.prototype.clearWeaponAnimation = function() {
};

Game_Battler.prototype.clearEffect = function() {
    this._effectType = null;
};

Game_Battler.prototype.clearMotion = function() {
};

Game_Battler.prototype.requestEffect = function(effectType) {
    this._effectType = effectType;
};

Game_Battler.prototype.requestMotion = function() {
};

Game_Battler.prototype.requestMotionRefresh = function() {
};

Game_Battler.prototype.select = function() {
    this._selected = true;
};

Game_Battler.prototype.deselect = function() {
    this._selected = false;
};

Game_Battler.prototype.isAnimationRequested = function() {
    return this._animations.length > 0;
};

Game_Battler.prototype.isEffectRequested = function() {
    return !!this._effectType;
};

Game_Battler.prototype.isMotionRequested = function() {
};

Game_Battler.prototype.isMotionRefreshRequested = function() {
};

Game_Battler.prototype.isSelected = function() {
    return this._selected;
};

Game_Battler.prototype.effectType = function() {
    return this._effectType;
};

Game_Battler.prototype.motionType = function() {
};

Game_Battler.prototype.shiftAnimation = function() {
    return this._animations.shift();
};

Game_Battler.prototype.startAnimation = function(animationId, mirror, delay,scale) {
    const data = { animationId: animationId, mirror: mirror, delay: delay ,scale: scale };
    this._animations.push(data);
};

Game_Battler.prototype.action = function(index) {
    return this._actions[index];
};

Game_Battler.prototype.setAction = function(index, action) {
    this._actions[index] = action;
};

Game_Battler.prototype.numActions = function() {
    return this._actions.length;
};

Game_Battler.prototype.clearActions = function() {
    this._actions = [];
};

Game_Battler.prototype.refresh = function() {
    Game_BattlerBase.prototype.refresh.call(this);
    if (this.hp === 0) {
        this.addState(this.deathStateId());
    } else {
        this.removeState(this.deathStateId());
    }
};

Game_Battler.prototype.refreshPassive = function() {
    const _passiveSkills = this.passiveSkills();
    if (_passiveSkills == null){
        return;
    }
    let popupData = [];
    
    const a = this;
    _passiveSkills.forEach(skill => {
        let flag = true;
        let stateEval = skill.stateEval;
        if (stateEval != null){
            flag = eval(stateEval);
        }
        if (flag){
            const addSkills = this.addPassive(skill);
            addSkills.forEach(skill => {
                for (const effect of skill.effects) {
                    if (effect.code == Game_Action.EFFECT_ADD_STATE){
                        popupData.push(new PopupTextData(this,PopupTextType.AddState,TextManager.getStateName(effect.dataId)));
                    }
                }
            });
        } else{
            const removeSkills = this.removePassive(skill);
            removeSkills.forEach(skill => {
                for (const effect of skill.effects) {
                    if (effect.code == Game_Action.EFFECT_ADD_STATE){
                        popupData.push(new PopupTextData(this,PopupTextType.RemoveState,TextManager.getStateName(effect.dataId)));
                    }
                }
            });
        }
    });
    return popupData;
};

Game_Battler.prototype.clearAllPassiveState = function() {
    let removeData = [];
    this._stateData.forEach(state => {
        removeData.push({stateId: state.id, slotId:state.slotId });
    });
    removeData.forEach(remove => {
        this.removeState(remove.stateId,this.battlerId(),remove.slotId);
    });
}

Game_Battler.prototype.addState = function(stateId,turns,effect,passive,battlerId,slotId) {
    if (this.isStateAddable(stateId)) {
        if (!this.isStateAffected(stateId,battlerId,slotId)) {
            this.addNewState(stateId);
            this.addNewStateData(stateId,turns,effect,passive,battlerId,slotId);
            this.refresh();
        } else{
            this.updateStateData(stateId,turns,effect,passive,battlerId,slotId);
            this.refresh();
        }
        this.resetStateCounts(stateId);
    }
};

Game_Battler.prototype.isStateAddable = function(stateId) {
    return (this.isAlive() && $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this.isStateRestrict(stateId));
};

Game_Battler.prototype.isStateRestrict = function(stateId) {
    return $dataStates[stateId].removeByRestriction && this.isRestricted();
};

Game_Battler.prototype.stateResistSet = function() {
    let resist = this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
    this.passiveSkills().forEach(skill => {
        let resistState = _.find(skill.effects,(e) => e.code == Game_Action.EFFECT_ADD_STATE && e.dataId == $gameStateInfo.getStateId(StateType.RESIST_STATE));
        if (resistState){
            resist.push(skill.stateEffect);
            // 抵抗が増えるスキルに解除についているステートを無効
            let resists = _.filter(skill.effects,(e) => {return e.code == Game_Action.EFFECT_REMOVE_STATE});
            resists.forEach(r => {
                resist.push(r.dataId);
            });
        }
        let banishState = _.find(skill.effects,(e) => e.code == Game_Action.EFFECT_ADD_STATE && e.dataId == $gameStateInfo.getStateId(StateType.BANISH));
        if (banishState && this.isStateAffected($gameStateInfo.getStateId( StateType.BANISH ))){
            resist.push(skill.stateEffect);
        }   
    });
    resist = _.uniq( resist );
    return resist;
};

Game_Battler.prototype.onRestrict = function() {
    Game_BattlerBase.prototype.onRestrict.call(this);
    this.clearActions();
    this.states().forEach(function(state) {
        if (state.removeByRestriction) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeState = function(stateId,battlerId,slotId) {
    if (this.isStateAffected(stateId,battlerId,slotId)) {
        if (stateId === this.deathStateId()) {
            this.revive();
        }
        if (stateId == $gameStateInfo.getStateId(StateType.FINITE)) {
            this.die();
        }
        this.eraseState(stateId,slotId);

        this.refresh();
    }
};

Game_Battler.prototype.passiveSkills = function() {
    return [];
}

Game_Battler.prototype.addPassive = function(skill) {
    let addStates = [];
    skill.effects.forEach(effect => {
        if (effect.code == Game_Action.EFFECT_ADD_STATE ){
            if (!this.isStateAffected(effect.dataId,this.battlerId())){
                addStates.push(skill);
            }
            let effectValue = skill.stateEffect;
            if (this._statePlus && this._statePlus[effect.dataId]){
                effectValue += this._statePlus[effect.dataId];
            }
            this.addState(effect.dataId,skill.stateTurns,effectValue,true,this.battlerId());
        } 
    });
    return addStates;
}

Game_Battler.prototype.removePassive = function(skill,slotId) {
    let removeStates = [];
    skill.effects.forEach(effect => {
        if (effect.code == Game_Action.EFFECT_ADD_STATE ){
            if (this.isStateAffected(effect.dataId,this.battlerId(),slotId)){
                removeStates.push(skill);
            }
            this.removeState(effect.dataId,this.battlerId(),slotId);
        }
    });
    return removeStates;
}

Game_Battler.prototype.escape = function() {
    if ($gameParty.inBattle()) {
        this.hide();
    }
    this.clearActions();
    this.clearStates();
    SoundManager.playEscape();
};

Game_Battler.prototype.removeBattleStates = function() {
    this.states().forEach(function(state) {
        if (state.removeAtBattleEnd) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeStatesAuto = function(timing) {
    let removeState = [];
    this._stateData.forEach(function(stateData) {
        const state = $dataStates[stateData.id];
        if (stateData.isStateExpired() && state.autoRemovalTiming === timing) {
            removeState.push({battler:this,stateId:state.id,battlerId:stateData.battlerId,slotId:stateData.slotId});    
        }
    }, this);
    removeState.forEach(removeData => {
        this.removeState(removeData.stateId,removeData.battlerId,removeData.slotId);
    });
    return removeState;
};

Game_Battler.prototype.addStatesAuto = function(removeState) {
    const etherId = $gameStateInfo.getStateId(StateType.ETHER);
    const stunId = $gameStateInfo.getStateId(StateType.STUN);
    let addState = [];
    removeState.forEach(removeData => {
        if (removeData.stateId == etherId){
            // エーテル解除時にスタン付与
            this.addState(stunId,2,removeData.battlerId);
            addState.push({battler:this,stateId:stunId,battlerId:removeData.battlerId,slotId:removeData.slotId});
        }
    });
    return addState;
}

Game_Battler.prototype.removeStatesByDamage = function() {
    let removeStateIds = [];
    this.states().forEach(function(state) {
        if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
            //this.removeState(state.id);
            removeStateIds.push(state.id);
        }
    }, this);
    return removeStateIds;
};

Game_Battler.prototype.removeChainState = function() {
    const chainTargetId = $gameStateInfo.getStateId(StateType.CHAIN_TARGET);
    if (this.isStateAffected(chainTargetId)){
        this.removeState(chainTargetId)
    }
}

Game_Battler.prototype.removeChainSelfState = function() {
    const chainSelfId = $gameStateInfo.getStateId(StateType.CHAIN_SELF);
    if (this.isStateAffected(chainSelfId)){
        this.removeState(chainSelfId);
        this.resetAp();
        this._bindBatllers.forEach(battler => {
            battler.removeState($gameStateInfo.getStateId(StateType.CHAIN_TARGET));
        });
        this._bindBatllers = [];
    }
}

Game_Battler.prototype.makeActionTimes = function() {
    return this.actionPlusSet().reduce(function(r, p) {
        return Math.random() < p ? r + 1 : r;
    }, 1);
};

Game_Battler.prototype.makeActions = function() {
    this.clearActions();
    if (this.canMove()) {
        const actionTimes = this.makeActionTimes();
        this._actions = [];
        for (let i = 0; i < actionTimes; i++) {
            this._actions.push(new Game_Action(this));
        }
    } else{
        this._actions = [];
        this._actions.push(new Game_Action(this));
    }
    return this._actions;
};

Game_Battler.prototype.currentAction = function() {
    return this._actions[0];
};

Game_Battler.prototype.removeCurrentAction = function() {
    this._actions.shift();
};

Game_Battler.prototype.setLastTarget = function(target) {
    this._lastTargetIndex = target ? target.index() : 0;
};

Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
    this.clearActions();
    let action = new Game_Action(this, true);
    action.setSkill(skillId);
    if (targetIndex === -2) {
        action.setTarget(this._lastTargetIndex);
    } else if (targetIndex === -1) {
        action.decideRandomTarget();
    } else {
        action.setTarget(targetIndex);
    }
    //this._actions.push(action);
    return action;
};

Game_Battler.prototype.useItem = function(item,mpOnly = false) {
    if (DataManager.isSkill(item)) {
        this.paySkillCost(item,mpOnly);
    } else if (DataManager.isItem(item)) {
        this.consumeItem(item);
    }
};

Game_Battler.prototype.consumeItem = function(item) {
    $gameParty.consumeItem(item);
};

Game_Battler.prototype.gainHp = function(value) {
    this.setHp(this.hp + value);
};

Game_Battler.prototype.gainMp = function(value) {
    this.setMp(this.mp + value);
};

Game_Battler.prototype.gainTp = function(value) {
    this.setTp(this.tp + value);
};

Game_Battler.prototype.gainSilentTp = function(value) {
    //this.setTp(this.tp + value);
};

Game_Battler.prototype.initTp = function() {
    this.setTp(100);
};

Game_Battler.prototype.clearTp = function() {
    this.setTp(0);
};

Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    const value = Math.floor(50 * damageRate * this.tcr);
    this.gainSilentTp(value);
};

Game_Battler.prototype.regenerateHp = function() {
};

Game_Battler.prototype.maxSlipDamage = function() {
    return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
};

Game_Battler.prototype.regenerateMp = function() {
    const value = Math.floor(this.mmp * this.mrg);
    if (value !== 0) {
        this.gainMp(value);
    }
};

Game_Battler.prototype.regenerateTp = function() {
    return;
};

Game_Battler.prototype.regenerateAll = function() {
    if (this.isAlive()) {
        this.regenerateHp();
        this.regenerateMp();
        this.regenerateTp();
    }
};

Game_Battler.prototype.onBattleStart = function() {
    this.initTp();
    this._addDamage = 0;
    this._bindDamage = 0;
};


Game_Battler.prototype.onAllActionsEnd = function() {
    this.removeStatesAuto(RemoveStateAutoType.ACT_END);
};

Game_Battler.prototype.onTurnEnd = function() {
    this.regenerateAll();
    this.updateStateTurns();
    const removeState = this.removeStatesAuto(RemoveStateAutoType.ACT_END);
    const addState = this.addStatesAuto(removeState);
    this._turnCount++;
    return {add:addState,remove: removeState};
};

Game_Battler.prototype.resetTurnCount = function() {
    this._turnCount = 1;
}

Game_Battler.prototype.onBattleEnd = function() {
    this.removeBattleStates();
    this.clearActions();
    if (!this.isPreserveTp()) {
        this.clearTp();
    }
    this.appear();
    this._battleOrder = -1;
    // bindBattlerを初期化
    this._bindBatllers = [];
    // 永続アップを初期化
    this.clearParamPlus();
};

Game_Battler.prototype.onDamage = function() {
    return this.removeStatesByDamage();
};

Game_Battler.prototype.setActionState = function() {
};

Game_Battler.prototype.isUndecided = function() {
};

Game_Battler.prototype.isInputting = function() {
};

Game_Battler.prototype.isWaiting = function() {
};

Game_Battler.prototype.isActing = function() {
};

Game_Battler.prototype.isChanting = function() {
};

Game_Battler.prototype.isGuardWaiting = function() {
};

Game_Battler.prototype.performActionStart = function(action) {
};

Game_Battler.prototype.performAction = function(action) {
};

Game_Battler.prototype.performActionEnd = function() {
};

Game_Battler.prototype.performDamage = function() {
};

Game_Battler.prototype.performMiss = function() {
    SoundManager.playMiss();
};

Game_Battler.prototype.performRecovery = function() {
    SoundManager.playRecovery();
};

Game_Battler.prototype.performEvasion = function() {
    SoundManager.playEvasion();
};

Game_Battler.prototype.performMagicEvasion = function() {
    SoundManager.playMagicEvasion();
};

Game_Battler.prototype.performCounter = function() {
    SoundManager.playEvasion();
};

Game_Battler.prototype.performReflection = function() {
    SoundManager.playReflection();
};

Game_Battler.prototype.performSubstitute = function(target) {
};

Game_Battler.prototype.performCollapse = function() {
};


Game_Battler.prototype.gainDefineAp = function() {
    //凍結
    if (this.isStateAffected($gameStateInfo.getStateId(StateType.FROZEN))){
        return;
    }
    //バインド制限
    if (this.isStateAffected($gameStateInfo.getStateId(StateType.CHAIN_TARGET))){
        this._ap -= 1.5;
        return;
    }
    //待ち伏せ
    if (this.isStateAffected($gameStateInfo.getStateId(StateType.VANTAGE))){
        return;
    }
    if (this.isStateAffected($gameStateInfo.getStateId(StateType.CHAIN_SELF))){
        this._ap += 1.5;
        return;
    }
    //鈍足
    if (this.isStateAffected($gameStateInfo.getStateId(StateType.SLOW))){
        this._ap -= 1.5;
        return;
    }
    this._ap -= 3;
}

Game_Battler.prototype.realTgr = function() {   
    let value = this.tgr;
    /*
    const provocation = this.getStateEffect($gameStateInfo.getStateId(StateType.PROVOCATION));
    if (provocation != 0){
        value *= provocation;
    }
    const shadowMethod = this.getStateEffect($gameStateInfo.getStateId(StateType.SHADOW));
    if (shadowMethod != 0){
        value *= shadowMethod;
    }
    */
    return value;
};

Game_Battler.prototype.initMp = function() {   
    let value = 0;
    // 初期ＭＰアップ
    value += this.getStateEffect($gameStateInfo.getStateId(StateType.BATTLE_MP_BUFF_ADD));
    return value;
};

Game_Battler.prototype.getSkillLvByCount = function(skillId,count) {
    const nextExp = $gameSkillExp.getData($dataSkills[skillId].nextExp);
    if (nextExp == null){
        return 1;
    }
    let lv = 1;
    if (nextExp){
        for (let i = 1;i < nextExp.length;i++){
            if (nextExp[i] <= count){
                lv += 1;
            }
        }
    }
    return lv;
}

Game_Battler.prototype.getSkillLvTotal = function(skillId) {
    const count = this.getSkillCountTotal(skillId);
    return this.getSkillLvByCount(skillId,count);
}

Game_Battler.prototype.getSkillLv = function(skillId) { 
    const count = this.getSkillCount(skillId);
    return this.getSkillLvByCount(skillId,count);
}

Game_Battler.prototype.getSkillCountTotal = function(id) { 
    return this.getSkillCount(id) + this.getSkillSpCount(id);
}

Game_Battler.prototype.getSkillCount = function(id) { 
    let count = 0;
    return count;
}

Game_Battler.prototype.getSkillSpCount = function(id) { 
    let count = 0;
    return count;
}

Game_Battler.prototype.getSkillExpPercent = function(skillId) { 
    return 0 / 1;
}

Game_Battler.prototype.getSkillExpPercentTotal = function(skillId) { 

    return 0 / 1;
}

Game_Battler.prototype.isEnablePasiveSkill = function(skillData) {
    let flag = false;
        switch (skillData.skill.passiveType){
            case 'dying':
                flag = this.isDying();
                break;
            case 'hpunderhalf':
                flag = this.isUnderHalf();
                break;
            case 'turnCount':
                flag = this._turnCount == 1;
                break;
            case 'mpover3':
                flag = this.mp >= 3;
                break;
            case 'losetype1':
                flag = false;
                break;
            case 'startOnly':
                flag = this._turnCount == 1;
                break;
            default:
                flag = true;
                break;
    }
    return flag;
}

Game_Battler.prototype.isStatusParamUp = function(paramId,current) {
    switch (paramId){
        case 0:
        return this.paramPlus(paramId) > 0 && current > this.paramBase(paramId) && this.getStateEffectTotal($gameStateInfo.getStateId(StateType.HP_BUFF_ADD) > 0);
    }
}

Game_Battler.prototype.isTpMax = function() {
    return false;
}

Game_Battler.prototype.isTpMaxed = function() {
    return this._isTpMaxed != null ? this._isTpMaxed : false;
}

Game_Battler.prototype.features = function() {
    let features = [];
    let resistFlag = false;
    const resistId = $gameStateInfo.getStateId(StateType.RESIST_STATE);
    this._stateData.forEach(stateData => {
        if (stateData.turns > 0){
            if (stateData.id == resistId){
                resistFlag = true;
            } else 
            if (stateData.id == $gameStateInfo.getStateId(StateType.PHARMACOLOGY)){
                const phaText = (Number(stateData.effect) * 100).toString();
                features.push(TextManager.getStateMessage1(stateData.id).format(phaText));
            } else
            if (stateData.id == $gameStateInfo.getStateId(StateType.ATK_BUFF_RATE)){
                const buffText = ((Number(stateData.effect) - 1) * 100).toString();
                features.push(TextManager.getStateMessage1(stateData.id).format(buffText));
            } else 
            if (stateData.id == $gameStateInfo.getStateId(StateType.GUARD)){
                features.push(TextManager.getStateMessage1(stateData.id).format(this.def));
            } else 
            if (stateData.id == $gameStateInfo.getStateId(StateType.COUNTER)){
                const counterText = TextManager.getSkillName(Number(stateData.effect));
                features.push(TextManager.getStateMessage1(stateData.id).format(counterText));
            } else 
            if (stateData.id == $gameStateInfo.getStateId(StateType.DAMAGE_CUT)){
                if (stateData.passive == true){
                    // オートガードで実装しているので呼ばれない。翻訳不要。
                    features.push(TextManager.getStateMessage2(stateData.id).format(stateData.effect));
                } else{
                    features.push(TextManager.getStateMessage1(stateData.id).format(stateData.effect));
                }
            } else 
            if (stateData.id == $gameStateInfo.getStateId(StateType.IRON_WILL)){
            } else 
            if (stateData.id == $gameStateInfo.getStateId(StateType.SEAL_SKILL)){
                features.push(TextManager.getStateMessage1(stateData.id).format(TextManager.getSkillName( stateData.effect )));
            } else{
                features.push(TextManager.getStateMessage1(stateData.id).format(stateData.effect));
            }
        }
    });
    if (resistFlag){
        this.stateResistSet().forEach(resistStateId => {
            features.push(TextManager.getStateMessage1(resistId).format(TextManager.getStateName(resistStateId)));
        });
    }
    const involvementPlus = $gameParty.involvementPlus();
    const involemenetId = $gameStateInfo.getStateId(StateType.INVOLVEMENT);
    if (this.isActor() && involvementPlus > 0 && !this.isStateAffected(involemenetId)){
        features.push(TextManager.getStateMessage1(involemenetId).format(involvementPlus));
    }
    const ironwillPlus = $gameParty.ironWillPlus();
    const ironwillId = $gameStateInfo.getStateId(StateType.IRON_WILL);
    if (this.isActor() && ironwillPlus > 0){
        features.push(TextManager.getStateMessage1(ironwillId).format(ironwillPlus));
    }
    return features;
}

Game_Battler.prototype.damageRate = function() {
    let value = 0;
    const damageRateStateId = $gameStateInfo.getStateId(StateType.DAMAGE_RATE);
    if (this.isStateAffected(damageRateStateId)){
        value += this.getStateEffect(damageRateStateId);
    }
    return value;
}


//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

function Game_Actor() {
    this.initialize.apply(this, arguments);
}

Game_Actor.prototype = Object.create(Game_Battler.prototype);
Game_Actor.prototype.constructor = Game_Actor;

Object.defineProperty(Game_Actor.prototype, 'level', {
    get: function() {
        return this._level;
    },
    configurable: true
});

Game_Actor.prototype.initialize = function(actorId) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(actorId);
};

Game_Actor.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._actorId = 0;
    this._name = '';
    this._nickname = '';
    this._classId = 0;
    this._level = 0;
    this._characterName = '';
    this._characterIndex = 0;
    this._faceName = '';
    this._faceIndex = 0;
    this._battlerName = '';
    this._exp = {};
    this._skills = [];
    this._equips = [];
    this._actionInputIndex = 0;
    this._lastBattleSkillId = 0;

    this._sp = 0;
    this._useSp = 0;
};

Game_Actor.prototype.setup = function(actorId) {
    const actor = $dataActors[actorId];
    this._actorId = actorId;
    this._name = actor.name;
    this._nickname = actor.nickname;
    this._profile = actor.profile;
    this._classId = actor.classId;
    this._level = actor.initialLevel;
    this.initImages();
    this.initExp();
    this.initEquips(actor.equips);
    this.clearParamPlus();
    this.recoverAll();

    this.initSkills();

    this.refreshPassive();


    this.resetAp();

    this._statePlus = {
    }
    
    this._elementId = actor.elementId;

    this._positionData = null;
    this._paramUpRate = actor.paramUpRate;
    this._alchemyParam = actor.alchemyParam;
};

Game_Actor.prototype.position = function() {
    return this._positionData;
}

Game_Actor.prototype.setPosition = function(position) {
    this._positionData = position;
}

Game_Actor.prototype.paramUpRate = function() {
    return this._paramUpRate;
}

Game_Actor.prototype.alchemyParam = function() {
    return this._alchemyParam;
}

Game_Actor.prototype.levelUpParam = function(paramId) {
    switch (paramId){
        case 0: return this.calcLevelUpParam(paramId);
        case 1: return this.calcLevelUpParam(paramId);
        case 2: return this.calcLevelUpParam(paramId);
        case 3: return this.calcLevelUpParam(paramId);
        case 6: return this.calcLevelUpParam(4);
    }
    return 0;
}

Game_Actor.prototype.calcLevelUpParam = function(paramId) {
    const rate = this._paramUpRate[paramId];
    if (rate == 0) return 0;
    const border = (this.level-1) * rate / 100;
    let upParam = 0;
    if ((Math.max(0, this._paramPlus[paramId]-2)) > border){
        upParam = Math.floor( rate / 100 ) + 1;
        this._paramPlus[paramId] += upParam;
        return upParam;
    }

    upParam = Math.floor( rate / 100 );
    upParam += rate >= Math.random() * 100 ? 1 : 0;
    this._paramPlus[paramId] += upParam;
    return upParam;
}

Game_Actor.prototype.addStatePlus = function(id,value) {
    if (this._statePlus[id] == null){
        this._statePlus[id] = 0;
    }
    this._statePlus[id] += value;
}

Game_Actor.prototype.actorId = function() {
    return this._actorId;
};

Game_Actor.prototype.actor = function() {
    return $dataActors[this._actorId];
};

Game_Actor.prototype.name = function() {
    if ($dataText != null){
        return TextManager.actorName(this._actorId);
    }
    return this._name;
};

Game_Actor.prototype.setName = function(name) {
    this._name = name;
};

Game_Actor.prototype.nickname = function() {
    if ($dataText != null){
        return $dataText['actorsNicname'][this._actorId];
    }
    return this._nickname;
};

Game_Actor.prototype.setNickname = function(nickname) {
    this._nickname = nickname;
};

Game_Actor.prototype.profile = function() {
    if ($dataText != null){
        return $dataText['actorsProfile'][this._actorId];
    }
    return this._profile;
};

Game_Actor.prototype.setProfile = function(profile) {
    this._profile = profile;
};

Game_Actor.prototype.characterName = function() {
    return this._characterName;
};

Game_Actor.prototype.characterIndex = function() {
    return this._characterIndex;
};

Game_Actor.prototype.faceName = function() {
    return this._faceName;
};

Game_Actor.prototype.faceIndex = function() {
    return this._faceIndex;
};

Game_Actor.prototype.battlerName = function() {
    return this._battlerName;
};

Game_Actor.prototype.clearStates = function() {
    Game_Battler.prototype.clearStates.call(this);
    //this._stateSteps = {};
};

Game_Actor.prototype.resetStateCounts = function(stateId) {
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
};

Game_Actor.prototype.initImages = function() {
    const actor = this.actor();
    this._characterName = actor.characterName;
    this._characterIndex = actor.characterIndex;
    this._faceName = actor.faceName;
    this._faceIndex = actor.faceIndex;
    this._battlerName = actor.battlerName;
};

Game_Actor.prototype.expForLevel = function(level) {
	return (level - 1) * 100;
};

Game_Actor.prototype.initExp = function() {
    this._exp[this._classId] = this.currentLevelExp();
};

Game_Actor.prototype.currentExp = function() {
    return this._exp[this._classId];
};

Game_Actor.prototype.currentLevelExp = function() {
    return this.expForLevel(this._level);
};

Game_Actor.prototype.nextLevelExp = function() {
    return this.expForLevel(this._level + 1);
};

Game_Actor.prototype.nextRequiredExp = function() {
    return this.nextLevelExp() - this.currentExp();
};

Game_Actor.prototype.maxLevel = function() {
    return this.actor().maxLevel;
};

Game_Actor.prototype.isMaxLevel = function() {
    return this._level >= this.maxLevel();
};

Game_Actor.prototype.initSkills = function() {
    Debug.error("init skills");
    this._skills = [];
    this.currentClass().learnings.forEach(function(learning) {
        if (learning.level <= this._level) {
            this.learnSkill(learning.skillId,true);
        }
    }, this);
};

Game_Actor.prototype.initEquips = function(equips) {
    const slots = this.equipSlots();
    const maxSlots = slots.length;
    this._equips = [];
    for (let i = 0; i < maxSlots; i++) {
        this._equips[i] = new Game_Item();
    }
    for (let j = 0; j < equips.length; j++) {
        if (j < maxSlots) {
            this._equips[j].setEquip(slots[j] === 1, equips[j]);
        }
    }
    this.releaseUnequippableItems(true);
    this.refresh();
};

Game_Actor.prototype.equipSlots = function() {
    const slots = [];
    for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
        slots.push(i);
    }
    if (slots.length >= 2 && this.isDualWield()) {
        slots[1] = 1;
    }
    const _bow = this.weapons().find(a => a && a.wtypeId == 3);
    if (slots.length >= 2 && _bow != null) {
        slots[1] = 1;
    }
    return slots;
};

Game_Actor.prototype.equips = function() {
    return this._equips.map(function(item) {
        return item.object();
    });
};

Game_Actor.prototype.weapons = function() {
    return this.equips().filter(function(item) {
        return item && DataManager.isWeapon(item);
    });
};

Game_Actor.prototype.armors = function() {
    return this.equips().filter(function(item) {
        return item && DataManager.isArmor(item);
    });
};

Game_Actor.prototype.hasWeapon = function(weapon) {
    return this.weapons().contains(weapon);
};

Game_Actor.prototype.hasArmor = function(armor) {
    return this.armors().contains(armor);
};

Game_Actor.prototype.isEquipChangeOk = function(slotId) {
    return (!this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId]));
};

Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)) {
        this._equips[slotId].setObject(item);
        this.refresh();
    }
};

Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
    this._equips[slotId].setObject(item);
    this.releaseUnequippableItems(true);
    this.refresh();
};

Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
    if (newItem && !$gameParty.hasItem(newItem)) {
        return false;
    } else {
        $gameParty.gainItem(oldItem, 1);
        $gameParty.loseItem(newItem, 1);
        return true;
    }
};

Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
    const slotId = etypeId - 1;
    if (this.equipSlots()[slotId] === 1) {
        this.changeEquip(slotId, $dataWeapons[itemId]);
    } else {
        this.changeEquip(slotId, $dataArmors[itemId]);
    }
};

Game_Actor.prototype.isEquipped = function(item) {
    return this.equips().contains(item);
};

Game_Actor.prototype.discardEquip = function(item) {
    const slotId = this.equips().indexOf(item);
    if (slotId >= 0) {
        this._equips[slotId].setObject(null);
    }
};

Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
    for (;;) {
        const slots = this.equipSlots();
        const equips = this.equips();
        let changed = false;
        for (let i = 0; i < equips.length; i++) {
            const item = equips[i];
            if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
                if (!forcing) {
                    this.tradeItemWithParty(null, item);
                }
                this._equips[i].setObject(null);
                changed = true;
            }
        }
        if (!changed) {
            break;
        }
    }
};

Game_Actor.prototype.clearEquipments = function() {
    let maxSlots = this.equipSlots().length;
    for (let i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, null);
        }
    }
};

Game_Actor.prototype.optimizeEquipments = function() {
    const maxSlots = this.equipSlots().length;
    this.clearEquipments();
    for (let i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, this.bestEquipItem(i));
        }
    }
};

Game_Actor.prototype.bestEquipItem = function(slotId) {
    const etypeId = this.equipSlots()[slotId];
    const items = $gameParty.equipItems().filter(function(item) {
        return item.etypeId === etypeId && this.canEquip(item);
    }, this);
    let bestItem = null;
    let bestPerformance = -1000;
    for (let i = 0; i < items.length; i++) {
        let performance = this.calcEquipItemPerformance(items[i]);
        if (performance > bestPerformance) {
            bestPerformance = performance;
            bestItem = items[i];
        }
    }
    return bestItem;
};

Game_Actor.prototype.calcEquipItemPerformance = function(item) {
    return item.params.reduce(function(a, b) {
        return a + b;
    });
};

Game_Actor.prototype.isSkillWtypeOk = function(skill) {
    const wtypeId1 = skill.requiredWtypeId1;
    const wtypeId2 = skill.requiredWtypeId2;
    if ((wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))) {
        return true;
    } else {
        return false;
    }
};

Game_Actor.prototype.isWtypeEquipped = function(wtypeId) {
    return this.weapons().some(function(weapon) {
        return weapon.wtypeId === wtypeId;
    });
};

Game_Actor.prototype.refresh = function() {
    this.releaseUnequippableItems(false);
    Game_Battler.prototype.refresh.call(this);
};

Game_Actor.prototype.isActor = function() {
    return true;
};

Game_Actor.prototype.friendsUnit = function() {
    return $gameParty;
};

Game_Actor.prototype.opponentsUnit = function() {
    return $gameTroop;
};

Game_Actor.prototype.index = function() {
    return $gameParty.members().indexOf(this);
};

Game_Actor.prototype.selectIndex = function() {
    return $gameParty.allMembers().indexOf(this);
};

Game_Actor.prototype.isBattleMember = function() {
    return $gameParty.battleMembers().contains(this);
};

Game_Actor.prototype.isFormationChangeOk = function() {
    return true;
};

Game_Actor.prototype.currentClass = function() {
    return $dataClasses[this._classId];
};

Game_Actor.prototype.isClass = function(gameClass) {
    return gameClass && this._classId === gameClass.id;
};

Game_Actor.prototype.skills = function() {
    const list = [];
    for (const id of this._skills.concat(this.addedSkills())) {
        if (!list.includes($dataSkills[id])) {
            list.push($dataSkills[id]);
        }
    }
    return list;
};

Game_Actor.prototype.usableSkills = function() {
    return this.skills().filter(function(skill) {
        return this.canUse(skill);
    }, this);
};

Game_Actor.prototype.traitObjects = function() {
    let objects = Game_Battler.prototype.traitObjects.call(this);
    objects = objects.concat([this.actor(), this.currentClass()]);
    const equips = this.equips();
    for (let i = 0; i < equips.length; i++) {
        let item = equips[i];
        if (item) {
            objects.push(item);
        }
    }
    return objects;
};

Game_Actor.prototype.attackElements = function() {
    let set = Game_Battler.prototype.attackElements.call(this);
    if (this.hasNoWeapons() && !set.contains(this.bareHandsElementId())) {
        set.push(this.bareHandsElementId());
    }
    return set;
};

Game_Actor.prototype.hasNoWeapons = function() {
    return this.weapons().length === 0;
};

Game_Actor.prototype.bareHandsElementId = function() {
    return 1;
};

Game_Actor.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 9999;    // MHP
    }
    return Game_Battler.prototype.paramMax.call(this, paramId);
};

Game_Actor.prototype.paramBase = function(paramId) {
    return this.currentClass().params[paramId][this._level];
};

Game_Actor.prototype.paramPlus = function(paramId) {
    let value = Game_Battler.prototype.paramPlus.call(this, paramId);
    const equips = this.equips();
    for (let i = 0; i < equips.length; i++) {
        let item = equips[i];
        if (item) {
            value += item.params[paramId];
        }
    }
    
    if (paramId == 0){
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.HP_BUFF_ADD));
        //value -= this.getStateEffectTotal($gameStateInfo.getStateId(StateType.SELFISH));
    }
    if (paramId == 1){
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.MP_BUFF_ADD));
        //value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.MP_BUFF_ADD_SPECIAL));
    }
    if (paramId == 2){
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.ATK_BUFF_ADD));
        value += $gameParty.involvementPlus();
        //value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.SELFISH));
    }
    if (paramId == 3){
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.DEF_BUFF_ADD));
    }
    if (paramId == 6){
        const agiBuffRId = $gameStateInfo.getStateId(StateType.AGI_BUFF_RATE);
        const total = this.getStateEffectTotal(agiBuffRId);
        if (total > 0){
            value = Math.floor(this.paramBase(paramId) * total);
            value -= this.paramBase(paramId);
        }
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.AGI_BUFF_ADD));
        // アクセル
        const accelId = $gameStateInfo.getStateId(StateType.ACCEL);
        if (this.isStateAffected(accelId)){
            let plusAccel = ((this._turnCount - 1) * this.getStateEffectTotal(accelId));
            if (plusAccel >= 10){
                plusAccel = 10;
            }
            value += plusAccel;
        }
    }

    return value;
};

Game_Actor.prototype.attackAnimationId1 = function() {
    if (this.hasNoWeapons()) {
        return this.bareHandsAnimationId();
    } else {
        const weapons = this.weapons();
        return weapons[0] ? weapons[0].animationId : 0;
    }
};

Game_Actor.prototype.attackAnimationId2 = function() {
    const weapons = this.weapons();
    return weapons[1] ? weapons[1].animationId : 0;
};

Game_Actor.prototype.bareHandsAnimationId = function() {
    return 1;
};

Game_Actor.prototype.changeExp = function(exp, show) {
    this._exp[this._classId] = Math.max(exp, 0);
    const lastLevel = this._level;
    const lastSkills = this.skills();
    while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
        this.levelUp();
    }
    while (this.currentExp() < this.currentLevelExp()) {
        this.levelDown();
    }
    if (show && this._level > lastLevel) {
        this.displayLevelUp(this.findNewSkills(lastSkills));
    }
    this.refresh();
};

Game_Actor.prototype.levelUp = function() {
    this._level++;
    this._sp++;
};

Game_Actor.prototype.levelDown = function() {
    this._level--;
    this._sp--;
};

Game_Actor.prototype.findNewSkills = function(lastSkills) {
    const newSkills = this.skills();
    for (let i = 0; i < lastSkills.length; i++) {
        let index = newSkills.indexOf(lastSkills[i]);
        if (index >= 0) {
            newSkills.splice(index, 1);
        }
    }
    return newSkills;
};

Game_Actor.prototype.displayLevelUp = function(newSkills) {
    const text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
    $gameMessage.newPage();
    $gameMessage.add(text);
    newSkills.forEach(function(skill) {
        $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    });
};

Game_Actor.prototype.gainExp = function(exp) {
    const newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
    this.changeExp(newExp, this.shouldDisplayLevelUp());
};

Game_Actor.prototype.finalExpRate = function() {
    return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
};

Game_Actor.prototype.benchMembersExpRate = function() {
    return $dataSystem.optExtraExp ? 1 : 0;
};

Game_Actor.prototype.shouldDisplayLevelUp = function() {
    return false;
};

Game_Actor.prototype.changeLevel = function(level, show) {
    level = level.clamp(1, this.maxLevel());
    this.changeExp(this.expForLevel(level), show);
};

Game_Actor.prototype.learnSkill = function(skillId,isParty = true) {
    //0819 習得履歴追加
    if (!this.isLearnedSkill(skillId)) {
        if (isParty){
            $gameParty.addLearnSkill(skillId);
        }
        this._skills.push(skillId);
        this._skills.sort(function(a, b) {
            return a - b;
        });
    }
};

Game_Actor.prototype.forgetSkill = function(skillId) {
    const index = this._skills.indexOf(skillId);
    if (index >= 0) {
        this._skills.splice(index, 1);
    }
};

Game_Actor.prototype.isLearnedSkill = function(skillId) {
    return this._skills.contains(skillId);
};

Game_Actor.prototype.hasSkill = function(skillId) {
    return this.skills().contains($dataSkills[skillId]);
};

Game_Actor.prototype.changeClass = function(classId, keepExp) {
    if (keepExp) {
        this._exp[classId] = this.currentExp();
    }
    this._classId = classId;
    this.changeExp(this._exp[this._classId] || 0, false);
    this.refresh();
};

Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
    this._characterName = characterName;
    this._characterIndex = characterIndex;
};

Game_Actor.prototype.setFaceImage = function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
};

Game_Actor.prototype.setBattlerImage = function(battlerName) {
    this._battlerName = battlerName;
};

Game_Actor.prototype.isSpriteVisible = function() {
    return true;
};

Game_Actor.prototype.startAnimation = function(animationId, mirror, delay,scale) {
    mirror = !mirror;
    Game_Battler.prototype.startAnimation.call(this, animationId, mirror, delay,scale);
};

Game_Actor.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
};

Game_Actor.prototype.performAction = function(action) {
};

Game_Actor.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

Game_Actor.prototype.performAttack = function() {
};

Game_Actor.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    SoundManager.playActorDamage();
    $gameScreen.startShake(5, 5, 10);
    SoundManager.playActorDamage();
};

Game_Actor.prototype.performEvasion = function() {
    Game_Battler.prototype.performEvasion.call(this);
};

Game_Actor.prototype.performMagicEvasion = function() {
    Game_Battler.prototype.performMagicEvasion.call(this);
};

Game_Actor.prototype.performCounter = function() {
    Game_Battler.prototype.performCounter.call(this);
    this.performAttack();
};

Game_Actor.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    if ($gameParty.inBattle()) {
        SoundManager.playActorCollapse();
    }
};

Game_Actor.prototype.performVictory = function() {
};

Game_Actor.prototype.performEscape = function() {
};

Game_Actor.prototype.makeActionList = function() {
    let list = [];
    let action = new Game_Action(this);
    action.setAttack();
    list.push(action);
    this.usableSkills().forEach(function(skill) {
        action = new Game_Action(this);
        action.setSkill(skill.id);
        list.push(action);
    }, this);
    return list;
};

Game_Actor.prototype.makeAutoBattleActions = function() {
    for (let i = 0; i < this.numActions(); i++) {
        let list = this.makeActionList();
        let maxValue = Number.MIN_VALUE;
        for (let j = 0; j < list.length; j++) {
            let value = list[j].evaluate();
            if (value > maxValue) {
                maxValue = value;
                this.setAction(i, list[j]);
            }
        }
    }
};

Game_Actor.prototype.makeConfusionActions = function() {
    for (let i = 0; i < this.numActions(); i++) {
        this.action(i).setConfusion();
    }
};

Game_Actor.prototype.updateStateSteps = function(state) {
    /*
    if (state.removeByWalking) {
        if (this._stateSteps[state.id] > 0) {
            if (--this._stateSteps[state.id] === 0) {
                this.removeState(state.id);
            }
        }
    }
    */
};

Game_Actor.prototype.clearActions = function() {
    Game_Battler.prototype.clearActions.call(this);
    this._actionInputIndex = 0;
};

Game_Actor.prototype.currentAction = function() {
    return this.action(this._actionInputIndex);
};

Game_Actor.prototype.selectNextCommand = function() {
    if (this._actionInputIndex < this.numActions() - 1) {
        this._actionInputIndex++;
        return true;
    } else {
        return false;
    }
};

Game_Actor.prototype.selectPreviousCommand = function() {
    if (this._actionInputIndex > 0) {
        this._actionInputIndex--;
        return true;
    } else {
        return false;
    }
};

Game_Actor.prototype.lastBattleSkillId = function() {
    return this._lastBattleSkillId;
};

Game_Actor.prototype.setLastBattleSkillId = function(skillId) {
    this._lastBattleSkillId = skillId;
};

Game_Actor.prototype.testEscape = function(item) {
    return item.effects.some(function(effect, index, ar) {
        return effect && effect.code === Game_Action.EFFECT_SPECIAL;
    });
};

Game_Actor.prototype.meetsUsableItemConditions = function(item) {
    if ($gameParty.inBattle() && this.testEscape(item)) {
            return false;
    }
    return Game_BattlerBase.prototype.meetsUsableItemConditions.call(this, item);
};

Game_Actor.prototype.passiveSkills = function() {
    // パッシブは自動で発動
    let skills = [];
    this.skills().forEach(skill => {
        if (skill.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE){
            skills.push(skill);
        }
    });
    return skills;
}

Game_Actor.prototype.getReserveSkillData = function(elementId) {
    if (elementId == 6){
        return _.filter($gameParty._learnedSkills,(s) => (s != 0 && ($dataSkills[s].damage.elementId == elementId)));
    }
    const list = _.filter($gameParty._learnedSkills,(s) => {
        if (s != 0 && (($dataSkills[s].damage.elementId == elementId))){
            if ($dataSkills[s].stypeId == Game_BattlerBase.SKILL_TYPE_SPECIAL){
                return false;
            }
            return true;
        }
        return false;
    });
    return list;
}

// 必要なアニメーションファイル
Game_Actor.prototype.animationFiles = function() {
    let animations = [];
    let sounds = [];
    animations = _.uniq(animations);
    return {animations:animations,sounds:sounds};
};

Game_Actor.prototype.getSkillData = function(skillId,skillLv) {
    const nextLevel = $dataSkills[skillId].nextLevel;
    if (nextLevel && nextLevel.length > 0){
        let level = 0;
        nextLevel.forEach(lv => {
            if (skillLv > lv){
                level += 1;
            }
        });
        return $dataSkills[skillId+level];
    }
    return skillId > 0 ? $dataSkills[skillId] : null;
}


//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

function Game_Enemy() {
    this.initialize.apply(this, arguments);
}

Game_Enemy.prototype = Object.create(Game_Battler.prototype);
Game_Enemy.prototype.constructor = Game_Enemy;

Game_Enemy.prototype.initialize = function(enemyId, x, y,enemyLevel,line) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(enemyId, x, y,enemyLevel,line);
};

Game_Enemy.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._enemyId = 0;
    this._letter = '';
    this._plural = false;
    this._screenX = 0;
    this._screenY = 0;
    this._actionList = [];
    this._summonedIndex = 0;
    this._line = 0;
};

Game_Enemy.prototype.setup = function(enemyId, x, y,enemylevel,line) {
    this._enemyId = enemyId;
    this._screenX = x;
    this._screenY = y;
    this._enemylevel = enemylevel;
    const data = $dataEnemies[enemyId];
    this._level = enemylevel;
    this._madness = false;
    this._line = line;

    this.clearParamPlus();
    if (this._enemyId < 100){
        const hp = data.params[0] - this.applyVariance(data.params[0],10);
        const atk = data.params[2] - this.applyVariance(data.params[2],10);
        const agi = data.params[6] - this.applyVariance(data.params[6],10);
        this._paramPlus[0] = hp;
        this._paramPlus[2] = atk;
        this._paramPlus[6] = agi;
        this._paramPlus[0] += Math.floor((enemylevel-1) * 0.05 * data.params[0]);
        this._paramPlus[2] += Math.floor(enemylevel / 4);
        this._paramPlus[6] += Math.floor(enemylevel / 2);
        if (enemylevel >= 4){
            this._paramPlus[0] += Math.floor(enemylevel / 4);
            this._paramPlus[2] += Math.floor(enemylevel / 10);
            this._paramPlus[6] += Math.floor(enemylevel / 5);
        }
    }
    this.recoverAll();
    this.enemy().actions.forEach(action => {
        // レベル制限
        if (action.conditionType == ActionConditionType.PartyLv){ // enemyLv
            if (enemylevel >= action.conditionParam1){
                this._actionList.push(action);
            }
        } else{
            this._actionList.push(action);
        }
    });
    this.resetAp();
};

Game_Enemy.prototype.line = function() {
    return this._line;
};

Game_Enemy.prototype.applyVariance = function(value, variance) {
    const amp = Math.floor(Math.max(Math.abs(value) * variance / 100, 0));
    const v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    return value >= 0 ? value + v : value - v;
};

Game_Enemy.prototype.paramPlus = function(paramId) {
    let value = Game_Battler.prototype.paramPlus.call(this, paramId);
    if (paramId == 0){
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.HP_BUFF_ADD));
        //value -= this.getStateEffectTotal($gameStateInfo.getStateId(StateType.SELFISH));
    }
    if (paramId == 1){
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.MP_BUFF_ADD));
    }
    if (paramId == 2){
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.ATK_BUFF_ADD));
        //value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.SELFISH));
    }
    if (paramId == 3){
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.DEF_BUFF_ADD));
    }
    
    if (paramId == 6){
        const agiBuffRId = $gameStateInfo.getStateId(StateType.AGI_BUFF_RATE);
        const total = this.getStateEffectTotal(agiBuffRId);
        if (total > 0){
            value = Math.floor(this.paramBase(paramId) * total);
            value -= this.paramBase(paramId);
        }
        value += this.getStateEffectTotal($gameStateInfo.getStateId(StateType.AGI_BUFF_ADD));
    }
    return value;
};

Game_Enemy.prototype.level = function() {
    return this._level;
};

Game_Enemy.prototype.isEnemy = function() {
    return true;
};

Game_Enemy.prototype.friendsUnit = function() {
    return $gameTroop;
};

Game_Enemy.prototype.opponentsUnit = function() {
    return $gameParty;
};

Game_Enemy.prototype.index = function() {
    return $gameTroop.members().indexOf(this);
};

Game_Enemy.prototype.isBattleMember = function() {
    return this.index() >= 0;
};

Game_Enemy.prototype.enemyId = function() {
    return this._enemyId;
};

Game_Enemy.prototype.enemy = function() {
    return $dataEnemies[this._enemyId];
};

Game_Enemy.prototype.traitObjects = function() {
    return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
};

Game_Enemy.prototype.paramBase = function(paramId) {
    return this.enemy().params[paramId];
};

Game_Enemy.prototype.passiveSkills = function() {
    let list = [];
    this._actionList.forEach(action => {
        let skill = $dataSkills[action.skillId];
        if (skill){
            if (skill.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE){
                list.push(skill);
            }
        }
    });
    return list;
}

Game_Enemy.prototype.exp = function() {
    return this.enemy().exp;
};

Game_Enemy.prototype.gold = function() {
    return this.enemy().gold;
};

Game_Enemy.prototype.makeDropItems = function() {
    return this.enemy().dropItems.reduce(function(r, di) {
        if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
            return r.concat(this.itemObject(di.kind, di.dataId));
        } else {
            return r;
        }
    }.bind(this), []);
};

Game_Enemy.prototype.dropItemRate = function() {
    return $gameParty.hasDropItemDouble() ? 2 : 1;
};

Game_Enemy.prototype.itemObject = function(kind, dataId) {
    if (kind === 1) {
        return $dataItems[dataId];
    } else if (kind === 2) {
        return $dataWeapons[dataId];
    } else if (kind === 3) {
        return $dataArmors[dataId];
    } else {
        return null;
    }
};

Game_Enemy.prototype.isSpriteVisible = function() {
    return true;
};

Game_Enemy.prototype.screenX = function() {
    return this._screenX;
};

Game_Enemy.prototype.screenY = function() {
    return this._screenY;
};

Game_Enemy.prototype.battlerName = function() {
    return this.enemy().battlerName;
};

Game_Enemy.prototype.battlerHue = function() {
    return this.enemy().battlerHue;
};

Game_Enemy.prototype.originalName = function() {
    return this.enemy().name;
};

Game_Enemy.prototype.name = function() {
    if ($dataText != null){
        return TextManager.getEnemyName(this._enemyId) + (this._plural ? this._letter : '');
    }
    return this.originalName() + (this._plural ? this._letter : '');
};

Game_Enemy.prototype.isLetterEmpty = function() {
    return this._letter === '';
};

Game_Enemy.prototype.setLetter = function(letter) {
    this._letter = letter;
};

Game_Enemy.prototype.setPlural = function(plural) {
    this._plural = plural;
};

Game_Enemy.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
    this.requestEffect('whiten');
};

Game_Enemy.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
};

Game_Enemy.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

Game_Enemy.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    SoundManager.playEnemyDamage();
    this.requestEffect('blink');
};

Game_Enemy.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    switch (this.collapseType()) {
    case 0:
        if ($gameTroop.aliveMembers().length == 0){
            this.requestEffect('bossCollapse');
            //SoundManager.playBossCollapse1();
        } else{
            this.requestEffect('collapse');
            SoundManager.playEnemyCollapse();

        }
        break;
    case 1:
        this.requestEffect('bossCollapse');
        //SoundManager.playBossCollapse1();
        break;
    case 2:
        this.requestEffect('instantCollapse');
        break;
    }
};

Game_Enemy.prototype.transform = function(enemyId) {
    const name = this.originalName();
    this._enemyId = enemyId;
    if (this.originalName() !== name) {
        this._letter = '';
        this._plural = false;
    }
    this.refresh();
    if (this.numActions() > 0) {
        this.makeActions();
    }
};

Game_Enemy.prototype.meetsCondition = function(action) {
    const param1 = action.conditionParam1;
    const param2 = action.conditionParam2;
    switch (action.conditionType) {
    case 1:
        return this.meetsTurnCondition(param1, param2);
    case 2:
        return this.meetsHpCondition(param1, param2,action);
    case 3:
        return this.meetsMpCondition(param1, param2);
    case 4:
        return this.meetsStateCondition(param1);
    case 5:
        return this.meetsPartyLevelCondition(param1);
    case 6:
        return this.meetsSwitchCondition(param1,action);
    default:
        return true;
    }
};

Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    let n = this._turnCount;
    if (param2 === 0) {
        return n === param1;
    } else {
        return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};

Game_Enemy.prototype.meetsHpCondition = function(param1, param2 ,action) {
    const skill = $dataSkills[action.skillId];
    const isHeal = [3, 4].contains(skill.damage.type);
    // 回復は誰かが効果の対象になるかどうかで判定
    if (isHeal){
        return _.find($gameTroop.aliveMembers(),(enemy) => enemy.hpRate() >= param1 && enemy.hpRate() <= param2);
    }
    return this.hpRate() >= param1 && this.hpRate() <= param2;
};

Game_Enemy.prototype.meetsMpCondition = function(param1, param2) {
    return this.mpRate() >= param1 && this.mpRate() <= param2;
};

Game_Enemy.prototype.meetsStateCondition = function(param) {
    return this.isStateAffected(param);
};

Game_Enemy.prototype.meetsPartyLevelCondition = function(param) {
    return $gameParty.highestLevel() >= param;
};

Game_Enemy.prototype.meetsSwitchCondition = function(param,action) {
    //スイッチで判定をする
    //自身のみ生存
    if (param == $gameDefine.onlyOneConditionSwitchId){
        return ($gameTroop.aliveMembers().length == 1 && $gameTroop.members().length > 1);
    }
    //自身以外も生存
    if (param == $gameDefine.notOnlyOneConditionSwitchId){
        return ($gameTroop.aliveMembers().length != 1);
    }
    //戦闘不能が存在する
    if (param == $gameDefine.containsDieBattlerConditionSwitchId){
        return ($gameTroop.deadMembers().length > 1);
    }
    //生存敵総数が3以下召喚できる状態である
    if (param == $gameDefine.summonSwitchId){
        return ($gameTroop.aliveMembers().length < 5);
    }
    //スキルで付与するステートが誰かにかかっている
    if (param == $gameDefine.anyOneSameStateIdSwitchId){
        let isSame = true;
        const filterStates = _.filter($dataSkills[action.skillId].effects,(e) => e.code == Game_Action.EFFECT_ADD_STATE);
        filterStates.forEach(condition => {
            this.opponentsUnit().aliveMembers().forEach(battler => {
                if (battler.isStateAffected(condition.dataId)){
                    isSame = false;
                }
            });
        });
        return isSame;
    }
    // 攻撃対象に凍結がいる
    if (param == $gameDefine.flozenStateIdSwitchId){
        let flozen = false;
        const flozenStateId = $gameStateInfo.getStateId(StateType.FROZEN);
        this.opponentsUnit().aliveMembers().forEach(battler => {
            if (battler.isStateAffected(flozenStateId)){
                flozen = true;
            }
        });
        return flozen;
    }
    return $gameSwitches.value(param);
};

Game_Enemy.prototype.isActionValid = function(action) {
    return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]) && this.meetsConditionPlus($dataSkills[action.skillId]) && this.meetsConditionMix(action);
};

Game_Enemy.prototype.selectAction = function(actionList, ratingZero) {
    let sum = actionList.reduce(function(r, a) {
        return r + a.rating - ratingZero;
    }, 0);
    if (sum > 0) {
        let value = Math.randomInt(sum);
        for (let i = 0; i < actionList.length; i++) {
            let action = actionList[i];
            value -= action.rating - ratingZero;
            if (value < 0) {
                return action;
            }
        }
    } else {
        return null;
    }
};

Game_Enemy.prototype.selectAllActions = function(actionList) {
    const ratingMax = Math.max.apply(null, actionList.map(function(a) {
        return a.rating;
    }));
    const ratingZero = ratingMax - 3;
    actionList = actionList.filter(function(a) {
        return a.rating > ratingZero;
    });
    for (let i = 0; i < this.numActions(); i++) {
        this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
    }
};

Game_Enemy.prototype.setAction = function(action) {
    let actionList = this._actionList.filter(function(a) {
        return this.isActionValid(a);
    }, this);
    if (action) {
        const ratingMax = Math.max.apply(null, actionList.map(function(a) {
            return a.rating;
        }));
        const ratingZero = ratingMax - 3;
        actionList = actionList.filter(function(a) {
            return a.rating > ratingZero;
        });
        const _select = this.selectAction(actionList, ratingZero);
        if (_select){
            action.setSkill(_select.skillId);
        } else{        
            action.setSkill($gameDefine.noActionSkillId);
        }
    }
}

// 行動パターンををシフトする
Game_Enemy.prototype.changeActions = function(id) {
    this.clearActions();
    this._actionList = [];
    let actionData = $dataEnemies[id].actions;
    actionData.forEach(element => {
        this._actionList.push(element);
    });
};

Game_Enemy.prototype.attackId = function() {
    return this.enemy().attackId;
}

Game_Enemy.prototype.attackElements = function() {
    let set = Game_Battler.prototype.attackElements.call(this);
    // 自己属性に変換
    return set;
};

Game_Enemy.prototype.setSummonedIndex = function(index) {
    this._summonedIndex = index;
};

Game_Enemy.prototype.battlerId = function() {
    return this._summonedIndex != 0 ? this._summonedIndex : this.index() * -1;
}


//-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.

function Game_Actors() {
    this.initialize.apply(this, arguments);
}

Game_Actors.prototype.initialize = function() {
    this._data = [];
};

Game_Actors.prototype.actor = function(actorId) {
    if ($dataActors[actorId]) {
        if (!this._data[actorId]) {
            this._data[actorId] = new Game_Actor(actorId);
        }
        return this._data[actorId];
    }
    return null;
};

Game_Enemy.prototype.meetsConditionPlus = function(skill) {
    // 全員MPがフルの時は打たない
    if (skill.damage.type == 4){
        let isFull = _.every($gameTroop.aliveMembers(), function(enemy) { return enemy.mp == enemy.mmp; });
        if (isFull){
            return false;
        }
    }
    //有効なステート付与対象がいない時は打たない
    const item = skill.effects;
    const state = _.find(item,(a) => a.code == Game_Action.EFFECT_ADD_STATE);
    let isStateFull;
    if (state && skill.scope == ScopeType.ONE_ENEMY){
        isStateFull = _.every(this.opponentsUnit().aliveMembers(), function(enemy) { return enemy.isStateAffected(state.dataId); });
        if (isStateFull){
            return false;
        }
    }
    if (state && skill.scope == ScopeType.ALL_ENEMY){
        isStateFull = _.every(this.opponentsUnit().aliveMembers(), function(enemy) { return enemy.isStateAffected(state.dataId); });
        if (isStateFull){
            return false;
        }
    }
    if (state && skill.scope == ScopeType.ONE_PARTY){
        isStateFull = _.every(this.friendsUnit().aliveMembers(), function(enemy) { return enemy.isStateAffected(state.dataId); });
        if (isStateFull){
            return false;
        }
    }
    if (state && skill.scope == ScopeType.ALL_PARTY){
        isStateFull = _.every(this.friendsUnit().aliveMembers(), function(enemy) { return enemy.isStateAffected(state.dataId); });
        if (isStateFull){
            return false;
        }
    }
    // 使用者がそのステートの状態の時は選択肢から外す
    if (state && skill.scope == ScopeType.SELF){
        // 効果重複ステートは選択肢から外さない
        const total = $gameStateInfo.isTotalStateId(state.dataId);
        if (this.isStateAffected(state.dataId) && !total){
            return false;
        }
    }
    //解除できるステート付与対象がいるときは打つ
    const remove = _.filter(item,(a) => a.code == Game_Action.EFFECT_REMOVE_STATE);
    if (remove.length > 0){
        let isRemoval = false;
        remove.forEach(rem => {
            let unit;
            if (skill.scope == ScopeType.ONE_DEADPARTY || skill.scope == ScopeType.ALL_DEADPARTY){
                unit = this.friendsUnit().deadMembers();
                //isRemoval = _.find(this.friendsUnit().deadMembers(),(enemy) => enemy.isStateAffected(rem.dataId))
            } else{
                unit = this.opponentsUnit().aliveMembers();
                //isRemoval = _.find(this.opponentsUnit().aliveMembers(),(enemy) => enemy.isStateAffected(rem.dataId))
            }
            unit.forEach(enemy => {
                if (enemy.isStateAffected(rem.dataId)){
                    let stateList = enemy.getStateDataAll(rem.dataId);
                    let isAllPassive = true;
                    stateList.forEach(state => {
                        if (!state.passive){
                            isAllPassive = false;
                        }
                    });
                    if (isAllPassive == false){
                        isRemoval = true;
                    }
                }
            });
        });
        return isRemoval;
    }
    // MPDAMAGE判定
    let isMpDamageState = _.find(item,(a) => a.code == Game_Action.EFFECT_ADD_STATE && a.dataId == $gameStateInfo.getStateId(StateType.MP_DAMAGE));
    if (isMpDamageState){
        return _.find(this.opponentsUnit().aliveMembers(),(enemy) => enemy.mp > 0);
    }
    return true;
};

//条件を複数指定する
Game_Enemy.prototype.meetsConditionMix = function(action) {
    // 同じスキルIDがあるか
    let sameActions = _.filter(this._actionList,(a) => {
        return a.skillId == action.skillId;
    })
    if (sameActions.length <= 1){
        return true;
    }
    let meet = true;
    sameActions.forEach(a => {
        if (!this.meetsCondition(a)){
            meet = false;
        }
    });
    return meet;
}

Game_Enemy.prototype.isBoss = function() {
    return this.collapseType() == 1;
}

// 必要なアニメーションファイル
Game_Enemy.prototype.animationFiles = function() {
    let animations = [];
    let sounds = [];
    this.enemy().actions.forEach(action => {
        let animId = $dataSkills[action.skillId].animationId;
        if (animId == -1){
            animId = this.enemy().params[4];
        }
        if (animId == 0){
            return;
        }
        let animation = $dataAnimations[animId];
        animation.timings.forEach(timing => {
            sounds.push(timing.se);
        });
        if (animation.animation1Name){
            animations.push(animation.animation1Name);
        }
        if (animation.animation2Name){
            animations.push(animation.animation2Name);
        }
    });
    animations = _.uniq(animations);
    return {animations:animations,sounds:sounds};
};

Game_Enemy.prototype.setMadness = function(isMadness) {
    this._madness = isMadness;
}

Game_Enemy.prototype.madness = function() {
    return this._madness;
}

const ActionConditionType = {
    Always : 0,
    TurnCount : 1,
    HPRate : 2,
    MPRate : 3,
    State : 4,
    PartyLv : 5, // EnemyLv
    Switch : 6
}