//-----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.

function Sprite_StateIcon() {
    this.initialize.apply(this, arguments);
}

Sprite_StateIcon.prototype = Object.create(Sprite.prototype);
Sprite_StateIcon.prototype.constructor = Sprite_StateIcon;

Sprite_StateIcon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.scale.x = this.scale.y = 0.75;
    this.initMembers();
    this.loadBitmap();
};

Sprite_StateIcon._iconWidth  = 32;
Sprite_StateIcon._iconHeight = 32;

Sprite_StateIcon.prototype.initMembers = function() {
    this._battler = null;
    this._iconIndex = 0;
    this._animationCount = 0;
    this._animationIndex = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._lastLength = 0;
};

Sprite_StateIcon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem('IconSet');
    this.setFrame(0, 0, 0, 0);
    this._sprite = new Sprite();
    this._sprite.x = 2;
    this._sprite.y = -24;
	this.addChild(this._sprite);
};

Sprite_StateIcon.prototype.setup = function(battler) {
    this._battler = battler;
    this._animationCount = 0;
};

Sprite_StateIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    const states = this.states();
    if (states.length != this._lastLength){
        this._lastLength = states.length;
        this._animationCount = 0;
    }
    if (this._animationCount == 0) {
        this.updateIcon(states);
        this.updateFrame();    
    }
    this._animationCount++;
    if (this._animationCount >= this.animationWait()){
        this._animationCount = 0;
    }
};

Sprite_StateIcon.prototype.animationWait = function() {
    return 60;
};

Sprite_StateIcon.prototype.updateIcon = function(states) {
    if (states.length > 0) {
        this._animationIndex++;
        if (this._animationIndex >= states.length) {
            this._animationIndex = 0;
        }
        this._iconIndex = $dataStates[ states[this._animationIndex].id ].iconIndex;
        this.createIconBadge(states[this._animationIndex]);
    } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
        if (this._sprite.bitmap) {
        	this._sprite.bitmap.clear();
        }
    }
};

Sprite_StateIcon.prototype.updateFrame = function() {
    var pw = Sprite_StateIcon._iconWidth;
    var ph = Sprite_StateIcon._iconHeight;
    var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

Sprite_StateIcon.prototype.createIconBadge = function(state) {
    this._sprite.bitmap = new Bitmap(24,24);
    const stateData = this._battler.getStateData(state.id);
    if (stateData == null){
        return;
    }
    /*
    if (stateData.turns > 900 || stateData.turns < 0){
        return;
    }
    if ($dataStates[state.id].autoRemovalTiming == 0){
        return;
    }
    */
    let badge = null;

    switch (state.id) {
    	case $gameStateInfo.getStateId(StateType.CHAIN_TARGET):
        case $gameStateInfo.getStateId(StateType.CHAIN_SELF):
            return;
    }
    let bitmap = new Bitmap(24,24);
    bitmap.fontSize = 18;
    bitmap.textColor = "#ff3810";
    bitmap.drawText("●", 0, 0, 24,24);
    bitmap.fontSize = 14;
    bitmap.textColor = "White";
    switch (state.id) {
    	case $gameStateInfo.getStateId(StateType.SHIELD):
            badge = this._battler.getStateEffectTotal($gameStateInfo.getStateId(StateType.SHIELD));
            break;
    	case $gameStateInfo.getStateId(StateType.CHARGE):
            badge = this._battler.getStateEffectTotal($gameStateInfo.getStateId(StateType.CHARGE));
            break;
        case $gameStateInfo.getStateId(StateType.VANTAGE):
        case $gameStateInfo.getStateId(StateType.DISCHARGE):
        case $gameStateInfo.getStateId(StateType.INVISIBLE):
            badge = stateData.effect;
            break;
        default:
            if (stateData){
                badge = stateData.turns;
            }
            break;
    }
	bitmap.drawText(badge, 5, 1, 20,20);
    this._sprite.bitmap = bitmap;
};

Sprite_StateIcon.prototype.states = function() {
    let states = [];
    if (this._battler && this._battler.isAlive()) {
        states = this._battler._stateData;
        states = _.filter(states,(state) => $dataStates[state.id].priority != 0 && $dataStates[state.id].iconIndex != 0);
    }
    return states;
}