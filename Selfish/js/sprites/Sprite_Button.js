//-----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.

function Sprite_Button() {
    this.initialize.apply(this, arguments);
}

Sprite_Button.prototype = Object.create(Sprite.prototype);
Sprite_Button.prototype.constructor = Sprite_Button;

Sprite_Button.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._touching = false;
    this._coldFrame = null;
    this._hotFrame = null;
    this._clickHandler = null;
    this._pressHandler = null;
    this._clickCallTriggered = false;
    this._clickCallReleased = true;
    this._pressFrame = 0;
};

Sprite_Button.prototype.clickCallTypeChange = function() {
    this._clickCallTriggered = true;
    this._clickCallReleased = false;
};

Sprite_Button.prototype.pressFrame = function() {
    return this._pressFrame;
};

Sprite_Button.prototype.setPressFrame = function(frame) {
    this._pressFrame = frame;
};

Sprite_Button.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateFrame();
    this.processTouch();
};

Sprite_Button.prototype.updateFrame = function() {
    let frame;
    if (this._touching) {
        frame = this._hotFrame;
    } else {
        frame = this._coldFrame;
    }
    if (frame) {
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};

Sprite_Button.prototype.setColdFrame = function(x, y, width, height) {
    this._coldFrame = new Rectangle(x, y, width, height);
};

Sprite_Button.prototype.setHotFrame = function(x, y, width, height) {
    this._hotFrame = new Rectangle(x, y, width, height);
};

Sprite_Button.prototype.setClickHandler = function(method) {
    this._clickHandler = method;
};

Sprite_Button.prototype.setPressHandler = function(method) {
    this._pressHandler = method;
};

Sprite_Button.prototype.callClickHandler = function() {
    if (this._clickHandler) {
        this._clickHandler();
    }
};

Sprite_Button.prototype.callPressHandler = function() {
    if (this._pressHandler) {
        this._pressHandler();
    }
}

Sprite_Button.prototype.setMoveHandler = function(method) {
    if (this._moveHandler){
        return;
    }
    this._moveHandler = method;
};

Sprite_Button.prototype.callMoveHandler = function(x,y) {
    if (this._moveHandler) {
        this._moveHandler(x,y);
    }
};
Sprite_Button.prototype.setMoveReleaseHandler = function(method) {
    if (this._moveReleaseHandler){
        return;
    }
    this._moveReleaseHandler = method;
};

Sprite_Button.prototype.callMoveReleaseHandler = function(num) {
    if (this._moveReleaseHandler) {
        this._moveReleaseHandler();
    }
};

Sprite_Button.prototype.processTouch = function() {
    if (this.isActive()) {
        if (TouchInput.isTriggered() && this.isButtonTouched()) {
            this._touching = true;
            this._pressFrame = 0;
            if (this._moveHandler){
                this._moving = true;
            }
            this._lastPositionX = TouchInput.x;
            this._lastPositionY = TouchInput.y;
        }
        if (this._touching) {
            this._pressFrame += 1;
            if (this._pressFrame > 36){
                this.callPressHandler();
                this._touching = false;
            } else
            if (TouchInput.isReleased() || !this.isButtonTouched()) {
                this._touching = false;
                if (this._clickCallReleased == true && TouchInput.isReleased()) {
                    this.callClickHandler();
                }
            } else
            if (TouchInput.isPressed() || !this.isButtonTouched()) {
                if (this._clickCallTriggered == true && TouchInput.isPressed()) {
                    this.callClickHandler();
                }
            }
        }

        //0901 ムーブハンドラ
        if (this._moveHandler && this._moving == true) {
            const x = TouchInput.x;
            const y = TouchInput.y;
            if (this._lastPositionY != y || (this._lastPositionX != x)){
                this.callMoveHandler(this._lastPositionX - x, this._lastPositionY - y);
                this._lastPositionY = y;
                this._lastPositionX = x;
            }
            if (TouchInput.isReleased()) {
                this.callMoveReleaseHandler();
                this._moving = false;
            }
        }
    } else {
        this._touching = false;
    }
};

Sprite_Button.prototype.isActive = function() {
    let node = this;
    while (node) {
        if (!node.visible) {
            return false;
        }
        node = node.parent;
    }
    return true;
};

Sprite_Button.prototype.isButtonTouched = function() {
    const x = this.canvasToLocalX(TouchInput.x);
    const y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width * this.scale.x && y < this.height * this.scale.y;
};

Sprite_Button.prototype.canvasToLocalX = function(x) {
    let node = this;
    while (node) {
        x -= node.x ;
        node = node.parent;
    }
    return x;
};

Sprite_Button.prototype.canvasToLocalY = function(y) {
    let node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};

//-----------------------------------------------------------------------------
// Sprite_MZButton
//
// The sprite for displaying a button.

function Sprite_MZButton() {
    this.initialize(...arguments);
}

Sprite_MZButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_MZButton.prototype.constructor = Sprite_MZButton;

Sprite_MZButton.prototype.initialize = function(buttonType) {
    Sprite_Clickable.prototype.initialize.call(this);
    this._buttonType = buttonType;
    this._clickHandler = null;
    this._coldFrame = null;
    this._hotFrame = null;
    this.setupFrames();
};

Sprite_MZButton.prototype.setupFrames = function() {
    const data = this.buttonData();
    const x = data.x * this.blockWidth();
    const width = data.w * this.blockWidth();
    const height = this.blockHeight();
    this.loadButtonImage();
    this.setColdFrame(x, 0, width, height);
    this.setHotFrame(x, height, width, height);
    this.updateFrame();
    this.updateOpacity();
};

Sprite_MZButton.prototype.blockWidth = function() {
    return 48;
};

Sprite_MZButton.prototype.blockHeight = function() {
    return 48;
};

Sprite_MZButton.prototype.loadButtonImage = function() {
    this.bitmap = ImageManager.loadSystem("ButtonSet");
};

Sprite_MZButton.prototype.buttonData = function() {
    const buttonTable = {
        cancel: { x: 0, w: 2 },
        pageup: { x: 2, w: 1 },
        pagedown: { x: 3, w: 1 },
        down: { x: 4, w: 1 },
        up: { x: 5, w: 1 },
        down2: { x: 6, w: 1 },
        up2: { x: 7, w: 1 },
        ok: { x: 8, w: 2 },
        menu: { x: 10, w: 1 }
    };
    return buttonTable[this._buttonType];
};

Sprite_MZButton.prototype.update = function() {
    Sprite_Clickable.prototype.update.call(this);
    this.checkBitmap();
    this.updateFrame();
    this.updateOpacity();
    this.processTouch();
};

Sprite_MZButton.prototype.checkBitmap = function() {
    if (this.bitmap.isReady() && this.bitmap.width < this.blockWidth() * 11) {
        // Probably MV image is used
        throw new Error("ButtonSet image is too small");
    }
};

Sprite_MZButton.prototype.updateFrame = function() {
    const frame = this.isPressed() ? this._hotFrame : this._coldFrame;
    if (frame) {
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};

Sprite_MZButton.prototype.updateOpacity = function() {
    this.opacity = this._pressed ? 255 : 192;
};

Sprite_MZButton.prototype.setColdFrame = function(x, y, width, height) {
    this._coldFrame = new Rectangle(x, y, width, height);
};

Sprite_MZButton.prototype.setHotFrame = function(x, y, width, height) {
    this._hotFrame = new Rectangle(x, y, width, height);
};

Sprite_MZButton.prototype.setClickHandler = function(method) {
    this._clickHandler = method;
};

Sprite_MZButton.prototype.onClick = function() {
    if (this._clickHandler) {
        this._clickHandler();
    } else {
        Input.virtualClick(this._buttonType);
    }
};