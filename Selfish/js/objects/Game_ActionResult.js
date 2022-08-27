//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

//独自設計のため上書き
function Game_ActionResult() {
    this.initialize(...arguments);
}

Game_ActionResult.prototype.initialize = function() {
    //this.clear();
    this.initParam();
};

Game_ActionResult.prototype.initParam = function() {
    this.used = false;
    this.missed = false;
    this.critical = false;
    this.weakness = false;
    this.hpDamage = 0;
    this.mpDamage = 0;
    this.tpDamage = 0;
    this.addedStates = [];
    this.removedStates = [];
    this.resistStates = [];
    this.restrictStates = [];

    this.target = null;
    //この行動で戦闘不能になるかどうか
    this.isDead = false;
    this.guard = false;

    this.holdon = false;
    this.kishikaisei = false;
    this.invisible = false;
    this.damageBlock = false;
    this.apDamage = 0;

    this.substitutedTarget = null;

    this.length = 1; // 何回目の攻撃か

    this.vantageEffect = 0; // 待ち伏せ効果値
    this.vantageBlock = false;
    this.reDamage = 0;

    this.dischargeEffect = 0; // 暴発効果値
    this.penetrate = false;
    this.discharge = false;

    this.chargeAttack = false;
    this.barriered = false;
};

Game_ActionResult.prototype.addedStateObjects = function() {
    return this.addedStates.map(function(id) {
        return $dataStates[id];
    });
};

Game_ActionResult.prototype.removedStateObjects = function() {
    return this.removedStates.map(function(id) {
        return $dataStates[id];
    });
};

Game_ActionResult.prototype.resistStateObjects = function() {
    return this.resistStates.map(function(id) {
        return $dataStates[id];
    });
};

Game_ActionResult.prototype.restrictStateObjects = function() {
    return this.restrictStates.map(function(id) {
        return $dataStates[id];
    });
};

Game_ActionResult.prototype.isHit = function() {
    return this.used && !this.missed;
};

Game_ActionResult.prototype.isStateAdded = function(stateId) {
    return this.addedStates.contains(stateId);
};

Game_ActionResult.prototype.pushAddedState = function(stateId) {
    if (!this.isStateAdded(stateId)) {
        this.addedStates.push(stateId);
    }
};

Game_ActionResult.prototype.isStateRemoved = function(stateId) {
    return this.removedStates.contains(stateId);
};

Game_ActionResult.prototype.pushRemovedState = function(stateId) {
    if (!this.isStateRemoved(stateId)) {
        this.removedStates.push(stateId);
    }
};

Game_ActionResult.prototype.pushResistedState = function(stateId) {
    if (!this.isStateResisted(stateId)) {
        this.resistStates.push(stateId);
    }
};

Game_ActionResult.prototype.isStateResisted = function(stateId) {
    return this.resistStates.contains(stateId);
};

Game_ActionResult.prototype.pushRestrictedState = function(stateId) {
    if (!this.isStateResisted(stateId)) {
        this.restrictStates.push(stateId);
    }
};

Game_ActionResult.prototype.isStateRestricted = function(stateId) {
    return this.restrictStates.contains(stateId);
};