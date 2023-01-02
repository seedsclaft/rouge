//-----------------------------------------------------------------------------
// Game_States
//
// The game object class for an actor.

function Game_States() {
    this.initialize.apply(this, arguments);
}

Object.defineProperties(Game_States.prototype, {
    id: { get: function() { return this._stateId; }, configurable: true },
    turns: { get: function() { return this._turns; }, configurable: true },
    effect: { get: function() { return this._effect; }, configurable: true },
    passive: { get: function() { return this._passive; }, configurable: true },
    battlerId: { get: function() { return this._battlerId; }, configurable: true },
    slotId: { get: function() { return this._slotId; }, configurable: true },
});

Game_States.prototype.initialize = function() {
    this._stateId = 0;
    this._turns = 0;
    this._effect = 0;
    this._passive = false;
    this._battlerId = 0;
    this._slotId = 0;
    this._timing = 0;
};

Game_States.prototype.setup = function(stateId,turns,effect,passive,battlerId = 0,slotId = 0) {
    this._stateId = stateId;
    this._turns = turns;
    this._effect = effect;
    this._passive = passive;
    this._battlerId = battlerId;
    this._slotId = slotId;
    this._timing = $dataStates[stateId].autoRemovalTiming;
}

Game_States.prototype.clear = function() {
    this._stateId = 0;
    this._turns = 0;
    this._effect = 0;
    this._passive = false;
    this._battlerId = 0;
    this._slotId = 0;
}

Game_States.prototype.updateStateTurns = function() {
    if (this._turns < 0){
        return;
    }
    if (this._timing != RemoveStateAutoType.ACT_END){
        return;
    }
    this._turns -= 1;
}

Game_States.prototype.updateStateTimes = function() {
    if (this._turns < 0){
        return;
    }
    if (this._timing != RemoveStateAutoType.TURN_END){
        return;
    }
    this._turns -= 1;
}

Game_States.prototype.isStateExpired = function() {
    return this._turns <= 0;
}