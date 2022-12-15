Graphics._onTick = function(deltaTime) {
    this._fpsCounter.startTick();
    if (this._tickHandler) {
        this._tickHandler(deltaTime);
    }
    if (this._canRender()) {
        if ($dataOption && $dataOption.getUserData("refreshRate") == 1){
            if (this.frameCount % 2 > 0){
                return;
            }
        }
        this._app.render();
        this._fpsCounter.endTick();
    }
};

Graphics._switchFullScreen = function() {
    if (this._isFullScreen()) {
        this._cancelFullScreen();
    } else {
        this._requestFullScreen();
    }
    if (Utils.isNwjs()){
        if ($dataOption){   
            $dataOption.setUserData("screenMode",this._isFullScreen() ? 0 : 1);
            ConfigManager.save();
        }
    }
};

(function() {
    const _initialize = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function(width, height) {
        _initialize.call(this,width, height);
        this.fontFace = "sans-GameFont";
    
        this.fontSize = 28;
        this.outlineWidth = 4;
    };
})();

Bitmap.prototype.gradientFillRectHalf = function(x, y, width, height, color1, color2, vertical) {
    var context = this._context;
    var grad;
    if (vertical) {
    grad = context.createLinearGradient(x, y, x, y + height);
    } else {
    grad = context.createLinearGradient(x, y, x + width, y);
    }
    grad.addColorStop(0, color1);
    grad.addColorStop(0.5, color1);
    grad.addColorStop(1, color2);
    context.save();
    context.fillStyle = grad;
    context.fillRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
};

Bitmap.prototype.drawUpperTriangle = function(x,y,w,h,color) {
    var context = this._context;
    //context.save();
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x     , y);
    context.lineTo(x     , y+h);
    context.lineTo(x+w       , y+h);
    context.closePath();
    //context.stroke();
    context.fill();
    //this._setDirty();
};

Bitmap.prototype.drawLowerTriangle = function(x,y,w,h,color) {
    var context = this._context;
    //context.save();
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x , y);
    context.lineTo(x+w     , y);
    context.lineTo(x+w       , y+h);
    context.closePath();
    //context.stroke();
    context.fill();
    //this._setDirty();
};
/*
Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align,outline,hotOutline) {
    // [Note] Different browser makes different rendering with
    //   textBaseline == 'top'. So we use 'alphabetic' here.
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;
    let tx = x;
    let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
    if (align === "center") {
        tx += maxWidth / 2;
    }
    if (align === "right") {
        tx += maxWidth;
    }
    context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align;
    context.textBaseline = "alphabetic";
    context.globalAlpha = 1;
    if (outline){
        this._drawTextOutline(text, tx, ty, maxWidth);
    }
    if (hotOutline){
        this._drawTextHotOutline(text, tx, ty, maxWidth);
    }
    context.globalAlpha = alpha;
    this._drawTextBody(text, tx, ty, maxWidth);
    context.restore();
    this._baseTexture.update();
};
*/

Bitmap.prototype._makeFontNameText = function() {
    const italic = this.fontItalic ? "Italic " : "";
    const bold = this.fontBold ? "Bold " : "";
    return italic + bold + this.fontSize + "px " + $gameSystem.mainFontFace();//this.fontFace;
};

/**
 * @method _drawTextHotOutline
 * @param {String} text
 * @param {Number} tx
 * @param {Number} ty
 * @param {Number} maxWidth
 * @private
 */
Bitmap.prototype._drawTextHotOutline = function(text, tx, ty, maxWidth) {
    var context = this._context;
    context.shadowBlur = 10;
    // 影を色
    context.shadowColor = "black";
    // 影をX.Y偏移
    //context.shadowOffsetX = 10;
    //context.shadowOffsetY = -2;
    context.strokeStyle = 'rgba(0, 0, 0, 0.75)';
    context.lineWidth = this.outlineWidth + 2;
    context.lineJoin = 'round';
    context.strokeText(text, tx, ty, maxWidth);
};

/**
 * Sets the blend color for the sprite.
 *
 * @param {array} color - The blend color [r, g, b, a].
 */
Sprite.prototype.setBlendColor = function(color) {
    if ($dataOption.getUserData("displayEffect") == false){
        return;
    }
    if (!(color instanceof Array)) {
        throw new Error("Argument must be an array");
    }
    if (!this._blendColor.equals(color)) {
        this._blendColor = color.clone();
        this._updateColorFilter();
    }
};

Sprite.prototype._createColorFilter = function() {
    const platform = $gameDefine.platForm();
    if (platform == PlatForm.iOS){
        this._colorFilter = new PIXI.filters.AdjustmentFilter();
        this._hueFilter = new PIXI.filters.ColorMatrixFilter();
    } else{
        this._colorFilter = new ColorFilter();
    }
    if (!this.filters) {
        this.filters = [];
    }
    this.filters.push(this._colorFilter);
    if (platform == PlatForm.iOS){
        this.filters.push(this._hueFilter);
    }
};

Sprite.prototype._updateColorFilter = function() {
    const platform = $gameDefine.platForm();
    if (!this._colorFilter) {
        this._createColorFilter();
    }
    if (platform == PlatForm.iOS){
        this._hueFilter.hue(this._hue,false);
        this._colorFilter.red = 1 + this._blendColor[0] / 255.0;
        this._colorFilter.green = 1 + this._blendColor[1] / 255.0;
        this._colorFilter.blue = 1 + this._blendColor[2] / 255.0;
        this._colorFilter.brightness = 1 + this._blendColor[3] / 255.0;
    } else{
        this._colorFilter.setHue(this._hue);
        this._colorFilter.setBlendColor(this._blendColor);
        this._colorFilter.setColorTone(this._colorTone);
    }
};


/**
 * Renders the object using the WebGL renderer.
 *
 * @param {PIXI.Renderer} renderer - The renderer.
 */
WindowLayer.prototype.render = function render(renderer) {
    if (!this.visible) {
        return;
    }

    const graphics = new PIXI.Graphics();
    const gl = renderer.gl;
    const children = this.children.clone();

    renderer.framebuffer.forceStencil();
    graphics.transform = this.transform;
    renderer.batch.flush();
    gl.enable(gl.STENCIL_TEST);

    while (children.length > 0) {
        const win = children.pop();
        if (win._isWindow && win.visible && win.openness > 254) {
            gl.stencilFunc(gl.EQUAL, 0, ~0);
            // 透過マスクを無効化
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            win.render(renderer);
            renderer.batch.flush();
            graphics.clear();
            win.drawShape(graphics);

            gl.stencilFunc(gl.ALWAYS, 1, ~0);
            // 透過マスクを無効化
            gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
            gl.blendFunc(gl.ZERO, gl.ONE);

            graphics.render(renderer);
            renderer.batch.flush();

            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    gl.disable(gl.STENCIL_TEST);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.clearStencil(0);
    renderer.batch.flush();

    for (const child of this.children) {
        if (!child._isWindow && child.visible) {
            child.render(renderer);
        }
    }

    renderer.batch.flush();
};

/**
 * Clears all the input data.
 *
 * @static
 * @method clear
 */
Input.clear = function() {
    this._currentState = {};
    this._previousState = {};
    this._gamepadStates = [];
    this._latestButton = null;
    this._latestKey = null;
    this._latestKeyWait = false;
    this._pressedTime = 0;
    this._dir4 = 0;
    this._dir8 = 0;
    this._preferredAxis = '';
    this._date = 0;
};

/**
 * Updates the input data.
 */
Input.update = function() {
    this._pollGamepads();
    if (this._currentState[this._latestButton]) {
        this._pressedTime++;
    } else {
        this._latestButton = null;
    }
    // 長押し判定用
    if (this._currentState['up']){
        this._pressedUpTime += 1;
    } else{
        this._pressedUpTime = 0;
    }
    for (const name in this._currentState) {
        if (this._currentState[name] && !this._previousState[name]) {
            this._latestButton = name;
            this._pressedTime = 0;
            this._date = Date.now();
        }
        this._previousState[name] = this._currentState[name];
    }
    if (this._virtualButton) {
        this._latestButton = this._virtualButton;
        console.error(this._virtualButton)
        this._pressedTime = 0;
        this._virtualButton = null;
    }
    this._updateDirection();
};


Input._shouldPreventDefault = function(keyCode) {
    // テキスト入力中は止めない
    if (PopupInputManager.busy()){
        return false;
    }
    switch (keyCode) {
        case 8: // backspace
        case 9: // tab
        case 33: // pageup
        case 34: // pagedown
        case 37: // left arrow
        case 38: // up arrow
        case 39: // right arrow
        case 40: // down arrow
            return true;
    }
    return false;
};

Input._shouldPreventInput = function(key) {
    if (PopupInputManager.busy()){
        if (key === "Enter"){
            return true;
        }
        if ($dataOption.keyControl()["ok"] === key){
            return true;
        }
        if ($dataOption.keyControl()["left"] === key){
            return true;
        }
        if ($dataOption.keyControl()["right"] === key){
            return true;
        }
        if ($dataOption.keyControl()["up"] === key){
            return true;
        }
        if ($dataOption.keyControl()["down"] === key){
            return true;
        }
        return false;
    }
}

Input._onKeyDown = function(event) {
    if (this._shouldPreventDefault(event.keyCode)) {
        event.preventDefault();
    }
    if (this._shouldPreventInput(event.key)) {
        return;
    }
    if (event.keyCode === 144) {
        // Numlock
        this.clear();
    }
    const buttonName = this.keyMapper[event.keyCode];
    let button = null;
    if ($dataOption && $dataOption.keyControl()){
        button = Object.keys($dataOption.keyControl()).filter( (key) => { 
             return $dataOption.keyControl()[key] === event.key;
        });
        switch (event.key){
            case 'Enter':
            button = 'ok';
            break;
            case 'Escape':
            button = 'cancel';
            break;
        }
    }
    this._latestKey = event.key;
    if (button != null) {
        this._currentState[button] = true;
    } else 
    if (buttonName) {
        this._currentState[buttonName] = true;
    }
};


Input._onKeyUp = function(event) {
    const buttonName = this.keyMapper[event.keyCode];
    if ($dataOption && $dataOption.keyControl()){
        let button = Object.keys($dataOption.keyControl()).filter( (key) => { 
            return $dataOption.keyControl()[key] === event.key;
        });
        switch (event.key){
            case 'Enter':
            button = 'ok'
            break;
            case 'Escape':
            button = 'cancel'
            break;
        }
        if (button) {
            this._currentState[button] = false;
        }
    }
    if (event.keyCode === 0) {  // For QtWebEngine on OS X
        this.clear();
    }
    //if (buttonName) {
    //    this._currentState[buttonName] = false;
    //}
};

TouchInput.isCancelled = function() {
    if (PopupInputManager.busy()){
        PopupInputManager.setFocus();
    }
    return this._currentState.cancelled;
};

TouchInput.isReleased = function() {
    if (PopupInputManager.busy()){
        PopupInputManager.setFocus();
    }
    return this._currentState.released;
};

TouchInput._onTouchStart = function(event) {
    for (const touch of event.changedTouches) {
        const x = Graphics.pageToCanvasX(touch.pageX);
        const y = Graphics.pageToCanvasY(touch.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._screenPressed = true;
            this._pressedTime = 0;
            // ダブルタップ無効
            if (event.touches.length >= 2) {
                //this._onCancel(x, y);
            } else {
                this._onTrigger(x, y);
            }
            event.preventDefault();
        }
    }
    if (window.cordova || window.navigator.standalone) {
        event.preventDefault();
    }
};

// メソッド変更
WebAudio._onHide = function() {
    const context = this._context;
    if (context){
        context.suspend();
    }
};

WebAudio._onShow = function() {
    if ($gamePause == true){
        return;
    }
    const context = this._context;
    if (context){
        context.resume();
    }
};

WebAudio._onUserGesture = function() {
    if ($gamePause == true){
        return;
    }
    const context = this._context;
    if (context && context.state === "suspended") {
        context.resume();
    }
};

WebAudio._onVisibilityChange = function() {
    if ($gamePause == true){
        return;
    }
    if (document.visibilityState === "hidden") {
        this._onHide();
    } else {
        this._onShow();
    }
};

WebAudio.prototype.fadeTo = function(duration,volume) {
    if (this._gainNode) {
        const gain = this._gainNode.gain;
        const currentTime = WebAudio._currentTime();
        gain.setValueAtTime(this._volume, currentTime);
        gain.linearRampToValueAtTime(volume, currentTime + duration);
    }
};

Utils._supportPassiveEvent = null;
/**
 * Test this browser support passive event feature
 * 
 * @static
 * @method isSupportPassiveEvent
 * @return {Boolean} this browser support passive event or not
 */

Utils.isSupportPassiveEvent = function() {
    if (typeof Utils._supportPassiveEvent === "boolean") {
        return Utils._supportPassiveEvent;
    }
    // test support passive event
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
    var passive = false;
    var options = Object.defineProperty({}, "passive", {
        get: function() { passive = true; }
    });
    window.addEventListener("test", null, options);
    Utils._supportPassiveEvent = passive;
    return passive;
}

Utils._shouldUseDecoder = function() {
    return !Utils.canPlayOgg() && typeof VorbisDecoder === "function";
};


Window.prototype._createFrameSprite = function() {
    this._frameSprite = new Sprite();
    for (let i = 0; i < 8; i++) {
        this._frameSprite.addChild(new Sprite());
    }
    //Windowフレームを削除
    //this._frameSprite.alpha = 0;
    this._container.addChild(this._frameSprite);
};

/**
 * Checks whether the platform is a mobile device.
 *
 * @returns {boolean} True if the platform is a mobile device.
 */
Utils.isMobileDevice = function() {
    // iPad判別
    const isiPad = /iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document
    if (isiPad){
        return true;
    }
    const r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i;
    return !!navigator.userAgent.match(r);
};