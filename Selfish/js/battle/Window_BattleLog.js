//-----------------------------------------------------------------------------
// Window_BattleLog
//

function Window_BattleLog() {
    this.initialize(...arguments);
}

Window_BattleLog.prototype = Object.create(Window_Selectable.prototype);
Window_BattleLog.prototype.constructor = Window_BattleLog;

Window_BattleLog.prototype.initialize = function() {
    const width = this.windowWidth();
    const height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, new Rectangle( -120, 352, width, height ));
    this.opacity = 0;
    this._lines = [];
    this._waitCount = 0;
    //this.createBackBitmap();
    //this.createBackSprite();
    this.refresh();
};

Window_BattleLog.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_BattleLog.prototype.windowHeight = function() {
    return this.fittingHeight(this.maxLines());
};

Window_BattleLog.prototype.maxLines = function() {
    return 2;
};

Window_BattleLog.prototype.createBackBitmap = function() {
    this._backBitmap = new Bitmap(this.width, this.height);
};

Window_BattleLog.prototype.createBackSprite = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = this._backBitmap;
    //this._backSprite.y = this.y - 74;
    this.addChildToBack(this._backSprite);
};

Window_BattleLog.prototype.numLines = function() {
    return this._lines.length;
};

Window_BattleLog.prototype.messageSpeed = function() {
    return 2;
};

Window_BattleLog.prototype.isBusy = function() {
    return this._waitCount > 0 || this._waitMode;
};

Window_BattleLog.prototype.update = function() {
};

Window_BattleLog.prototype.updateWait = function() {
    return this.updateWaitCount();
};

Window_BattleLog.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount -= this.isFastForward() ? 3 : 1;
        if (this._waitCount < 0) {
            this._waitCount = 0;
        }
        return true;
    }
    return false;
};

Window_BattleLog.prototype.isFastForward = function() {
    return (Input.isLongPressed('ok') || Input.isPressed('shift') ||
            TouchInput.isLongPressed());
};

Window_BattleLog.prototype.clear = function() {
    this._lines = [];
    this.refresh();
};

Window_BattleLog.prototype.wait = function() {
    this._waitCount = this.messageSpeed();
};

Window_BattleLog.prototype.setWait = function(duration) {
    this._waitCount = duration;
};

Window_BattleLog.prototype.addText = function(text) {
    this._lines.push(text);
    this.refresh();
    this.wait();
};

Window_BattleLog.prototype.refresh = function() {
    //this.drawBackground();
    this.contents.clear();
    for (var i = 0; i < this._lines.length; i++) {
        this.drawLineText(i);
    }
};

Window_BattleLog.prototype.drawBackground = function() {
    var rect = this.backRect();
    var color = this.backColor();
    this._backBitmap.clear();
    this._backBitmap.paintOpacity = 168;
    this._backBitmap.gradientFillRect(rect.x + 160, rect.y, 80, rect.height, ColorManager.dimColor2(),color);
    this._backBitmap.fillRect(rect.x + 240, rect.y, 560, rect.height, color);
    this._backBitmap.gradientFillRect(rect.x + 800, rect.y, 80, rect.height, color, ColorManager.dimColor2());
    this._backBitmap.paintOpacity = 255;
};

Window_BattleLog.prototype.backRect = function() {
    return {
        x: 0,
        y: this.padding-4,
        width: this.width - 480,
        height: this.numLines() * this.lineHeight()
    };
};

Window_BattleLog.prototype.backColor = function() {
    return '#000000';
};

Window_BattleLog.prototype.drawLineText = function(index) {
    const rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    const measureWidth = this.contents.measureTextWidth(this._lines[index]);
    const x = (this.windowWidth() - measureWidth) / 2 + 60 - this.padding/2;
    this.drawText(this._lines[index], x, rect.y - 4, rect.width);
};
