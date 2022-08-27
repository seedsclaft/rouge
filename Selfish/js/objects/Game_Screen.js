//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.

//独自設計のため上書き
function Game_Screen() {
    this.initialize.apply(this, arguments);
}

Game_Screen.prototype.initialize = function() {
    this.clear();
    this._screenVisible = true;
    this._filters = [];
};

Game_Screen.prototype.filters = function() {
    if (this._filters == null){
        this._filters = [];
    }
    return this._filters;
};

Game_Screen.prototype.setFilters = function(filters) {
    this._filters = [];
    for (let filter in filters){
        if (!_.contains(this._filters,(filter))){
            this._filters.push(Number( filter ));
        }
    }
};

Game_Screen.prototype.clear = function() {
    this.clearTone();
    this.clearShake();
    this.clearWeather();
    this.clearBackGround();
};

Game_Screen.prototype.tone = function() {
    return this._tone;
};

Game_Screen.prototype.shake = function() {
    return this._shake;
};

Game_Screen.prototype.backGroundWeather = function() {
    return this._backGroundWeather;
};

Game_Screen.prototype.eventWeather = function() {
    return this._eventWeather;
};

Game_Screen.prototype.backGroundPosition = function() {
    return this._backGroundPosition;
};

Game_Screen.prototype.backGroundSize = function() {
    return this._backGroundSize;
};

Game_Screen.prototype.screenVisible = function() {
    if (this._screenVisible == null){
        this._screenVisible = true;
    }
    return this._screenVisible;
};

Game_Screen.prototype.clearTone = function() {
    this._tone = [0, 0, 0, 0];
};

Game_Screen.prototype.clearShake = function() {
    this._shakePower = 0;
    this._shakeSpeed = 0;
    this._shakeDuration = 0;
    this._shakeDirection = 1;
    this._shake = 0;
};

Game_Screen.prototype.clearWeather = function() {
    this._backGroundWeather = null;
    this._eventWeather = null;
};

Game_Screen.prototype.clearBackGroundWeather = function() {
    this._backGroundWeather = null;
};

Game_Screen.prototype.clearEventWeather = function() {
    this._eventWeather = null;
};

Game_Screen.prototype.clearBackGround = function() {
    this._backGroundPosition = [0,0];
    this._backGroundSize = [Graphics.width,Graphics.height];
};

Game_Screen.prototype.startTint = function(tone, duration) {
    this._tone = tone.clone();
};

Game_Screen.prototype.startShake = function(power, speed, duration) {
    this._shakePower = power;
    this._shakeSpeed = speed;
    this._shakeDuration = duration;
};

Game_Screen.prototype.changeBackGroundWeather = function(type) {
    this._backGroundWeather = type;
};

Game_Screen.prototype.changeEventWeather = function(type) {
    this._eventWeather = type;
};

Game_Screen.prototype.setBackGroundPosition = function(x,y) {
    this._backGroundPosition = [x,y];
};

Game_Screen.prototype.setBackGroundSize = function(x,y) {
    //this._backGroundSize = [x,y];
};

Game_Screen.prototype.setScreenVisible = function(isVisible) {
    this._screenVisible = isVisible;
}

Game_Screen.prototype.update = function() {
    this.updateShake();
};

Game_Screen.prototype.updateShake = function() {
    if (this._shakeDuration > 0 || this._shake !== 0) {
        var delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
        if (this._shakeDuration <= 1) {
            this._shake = 0;
        } else {
            this._shake += delta;
        }
        if (this._shake > this._shakePower * 2) {
            this._shakeDirection = -1 * (this._shakeDuration * 0.25);
        }
        if (this._shake < - this._shakePower * 2) {
            this._shakeDirection = 1 * (this._shakeDuration * 0.25);
        }
        this._shakeDuration--;
    }
};