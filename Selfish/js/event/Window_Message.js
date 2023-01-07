//-----------------------------------------------------------------------------
// Window_Message
//
// The window for displaying text messages.

function Window_Message() {
    this.initialize(...arguments);
}

Window_Message.prototype = Object.create(Window_Base.prototype);
Window_Message.prototype.constructor = Window_Message;

Window_Message.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.initMembers();
};

Window_Message.prototype.initMembers = function() {
    this.x = 0;
    this.y = 400;
    this.width = 960;
    this.height = 128;
    this.opacity = 0;
    this._background = 0;
    this._positionType = 2;
    this._waitCount = 0;
    this._faceBitmap = null;
    this._faceSprite = new Sprite_EventPicture();
    this.addChild(this._faceSprite);

    this._textState = null;
    this._choiceListWindow = null;
    this._numberInputWindow = null;
    this.clearFlags();
    this.createSubWindows();
};

Window_Message.prototype.lineHeight = function() {
    return 36;
};

Window_Message.prototype.createSubWindows = function() {
    this._choiceListWindow = new Window_ChoiceList(this);
    this._numberInputWindow = new Window_NumberInput(this);
    this.addChildAt(this._choiceListWindow,1);
    this.addChild(this._numberInputWindow);
};

Window_Message.prototype.clearFlags = function() {
    this._showFast = false;
    this._lineShowFast = false;
    this._pauseSkip = false;
    this._skipBusy = false;
};

Window_Message.prototype.update = function() {
    if (this._skipBusy){
        return;
    }
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);
    while (!this.isOpening() && !this.isClosing()) { 
        if (this.updateAutoMessage()) {
            return;
        } else if (this.updateWait()) {
            return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
            return;
        } else if (this.updateMessage()) {
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
            this.startInput();
            return;
        }
    }
};

Window_Message.prototype.checkToNotClose = function() {
    if (this.isOpen() && this.isClosing() && this.doesContinue()) {
        this.open();
    }
};

Window_Message.prototype.canStart = function() {
    return $gameMessage.hasText() && !$gameMessage.scrollMode();
};

Window_Message.prototype.startMessage = function() {
    const text = $gameMessage.allText();
    const textState = this.createTextState(text, 0, 0, 0);
    // バックログ登録
    const faceExists = $gameMessage.faceName() !== "";
    if (faceExists){
        let actor = $gameMessage.faceName().substring(5,9);
        var logname = TextManager.actorName(+actor);
        if (EventManager._messageName[$gameMessage.faceName()]){
            logname = EventManager._messageName[$gameMessage.faceName()];
        }
    }
    const logText = textState.text.split('\n');
    TextManager.convertLogtext(logText,logname);

    textState.x = this.newLineX(textState);
    textState.startX = textState.x;
    this._textState = textState;
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
};

Window_Message.prototype.newLineX = function(textState) {
    const faceExists = $gameMessage.faceName() !== "";
    const faceWidth = ImageManager.faceWidth;
    const spacing = 160;
    const margin = faceExists ? faceWidth + spacing : spacing;
    return textState.rtl ? this.innerWidth - margin : margin;
};

Window_Message.prototype.updatePlacement = function() {
    this._positionType = $gameMessage.positionType();
    let textState = this._textState;

    textState.y = 20;
    textState.left = 16;
    textState.height = this.calcTextHeight(textState, false) + 12;

    const language = $dataOption.getUserData('language');
    // 中央寄せ
    if ($gameMessage.background() == 1 && this._positionType == 1){
        textState.x = (this.width / 2);
        let lines = textState.text.slice(textState.index).split('\n');
        let line = 0;
        lines.forEach(text => {
            text = text.replace(/(\^|\\\.|\..|\|.|\n|)/g, '');
            text = text.replace(/\\/g, '\x1b');
            text = text.replace(/\x1b\x1b/g, '\\');
            text = text.replace(/\x1b{/g, '');
            text = text.replace(/\x1b}/g, '');
            if (text.length > line){
                if (language == LanguageType.English){
                    // 英語小文字の大きさに合わせる
                    line = text.length / 2;
                } else{
                    line = text.length;
                }
            }
        });
        textState.x -= line * 11;
        textState.x -= 8;
    }
};

Window_Message.prototype.updateBackground = function() {
    this._background = $gameMessage.background();
    if (this._background === 0 || this._background === 1) {
        this.showBackgroundDimmer();
    } else {
        this.hideBackgroundDimmer();
    }
};

Window_Message.prototype.terminateMessage = function() {
    const nextEvent = EventManager.nowEvent();
    if (nextEvent && nextEvent.code == 101 && nextEvent.parameters[2] == 2 && nextEvent.parameters[3] == 2){
        this.close();
        this._faceSprite.opacity = 0;
        //this._choiceWindow.close();
    }
    if (!nextEvent || nextEvent.code != 101){
        this.close();
        this._faceSprite.opacity = 0;
        //this._choiceWindow.close();
    }
    $gameMessage.clear();
};

Window_Message.prototype.updateWait = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    } else {
        return false;
    }
};

Window_Message.prototype.updateLoading = function() {
    if (this._faceBitmap) {
        if (this._faceBitmap.isReady()) {
            this.drawMessageFace();
            this._faceBitmap = null;
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

Window_Message.prototype.updateInput = function() {
    if (this.isAnySubWindowActive()) {
        return true;
    }
    if (this.pause) {
        if (this.isTriggered()) {
            Input.update();
            this.pause = false;
            EventManager.hideMessageCursor();
            if (!this._textState) {
                this.terminateMessage();
            }
        }
        if (EventManager._autoMode){
            this.pause = false;
            this._waitCount = 60;
            this._autoMode = true;
            EventManager.hideMessageCursor();
        }
        return true;
    }
    return false;
};

Window_Message.prototype.isAnySubWindowActive = function() {
    return (
        this._choiceListWindow && this._choiceListWindow.active ||
        this._numberInputWindow && this._numberInputWindow.active
    );
};

Window_Message.prototype.updateMessage = function() {
    const textState = this._textState;
    if (textState) {
        while (!this.isEndOfText(textState)) {
            if (this.needsNewPage(textState)) {
                this.newPage(textState);
            }
            this.updateShowFast();
            if (this._background == 2 || this._background == 0){
                const messageSpeed = $dataOption.getUserData("messageSpeed");
                this._waitCount = 4 - messageSpeed;
                if (messageSpeed == 4){
                    this._showFast = true;
                }
                if (this.isTriggered() || TouchInput.isPressed() || Input.isPressed('ok')){
                    this._waitCount = 0;
                }
                if (this.openness == 255){
                    if (this._textState.y < 40){
                        SoundManager.playMessageType2();
                    } else{
                        SoundManager.playMessageType1();
                    }
                }
            }
            this.processCharacter(textState);
            if (this.shouldBreakHere(textState)) {
                break;
            }
        }
        this.flushTextState(textState);
        if (this.isEndOfText(textState) && !this.pause) {
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};

Window_Message.prototype.shouldBreakHere = function(textState) {
    if (this.canBreakHere(textState)) {
        if (!this._showFast && !this._lineShowFast) {
            return true;
        }
        if (this.pause || this._waitCount > 0) {
            return true;
        }
    }
    return false;
};

Window_Message.prototype.canBreakHere = function(textState) {
    if (!this.isEndOfText(textState)) {
        const c = textState.text[textState.index];
        if (c.charCodeAt(0) >= 0xdc00 && c.charCodeAt(0) <= 0xdfff) {
            // surrogate pair
            return false;
        }
        if (textState.rtl && c.charCodeAt(0) > 0x20) {
            return false;
        }
    }
    return true;
};

Window_Message.prototype.updateAutoMessage = function() {
    if (this._autoMode){
        this._waitCount -= 1;
        if (this.isTriggered()) {
            Input.update();
            this._waitCount = 0;
        }
        if (this._waitCount == 0){
            if (!this._textState) {
                this.terminateMessage();
            }
            this._autoMode = false;
            return false;
        }
        return true;
    } else{
        return false;
    }
}

Window_Message.prototype.onEndOfText = function() {
    if (!this.startInput()) {
        if (!this._pauseSkip) {
            this.startPause();
        } else {
            this.terminateMessage();
        }
    }
    this._textState = null;
};

Window_Message.prototype.startInput = function() {
    if ($gameMessage.isChoice()) {
        this._choiceListWindow.start();
        return true;
    } else if ($gameMessage.isNumberInput()) {
        this._numberInputWindow.start();
        return true;
    } else if ($gameMessage.isItemChoice()) {
        return true;
    } else {
        return false;
    }
};

Window_Message.prototype.isTriggered = function() {
    return (
        Input.isRepeated("ok") ||
        Input.isRepeated("cancel") ||
        (TouchInput.isRepeated() && TouchInput.y > 120)
    );
};

Window_Message.prototype.doesContinue = function() {
    return (
        $gameMessage.hasText() &&
        !$gameMessage.scrollMode() &&
        !this.areSettingsChanged()
    );
};

Window_Message.prototype.areSettingsChanged = function() {
    return (
        this._background !== $gameMessage.background() ||
        this._positionType !== $gameMessage.positionType()
    );
};

Window_Message.prototype.updateShowFast = function() {
    if (this.isTriggered()) {
        this._showFast = true;
    }
};

Window_Message.prototype.newPage = function(textState) {
    this.contents.clear();
    this.resetFontSettings();
    this.clearFlags();
    this.loadMessageFace();
    textState.x = textState.startX;
    textState.y = 0;
    textState.height = this.calcTextHeight(textState);
};

Window_Message.prototype.loadMessageFace = function() {
    this._faceBitmap = ImageManager.loadFace($gameMessage.faceName());
};

Window_Message.prototype.drawMessageFace = function() {
    const faceName = $gameMessage.faceName();
    const faceIndex = $gameMessage.faceIndex();
    const rtl = $gameMessage.isRTL();
    const width = ImageManager.faceWidth;
    const height = this.innerHeight;
    const x = rtl ? this.innerWidth - width - 4 : 4;

    this._faceSprite.opacity = 0;
    
    if (faceName == ""){
        return;
    }
    if (this._background == 0){
        this._faceSprite.setup(faceName,200,0,0);
        this._faceSprite.setBattleSpine();
        this._faceSprite.setFace(faceIndex);
        this._faceSprite.scale.x = -0.66;
        this._faceSprite.scale.y = 0.66;
        this._faceSprite.y += 80;
        this._faceSprite.opacity = 255;
    } else{
        EventManager.changePictureFace(faceName,faceIndex);
    }
};

Window_Message.prototype.processControlCharacter = function(textState, c) {
    Window_Base.prototype.processControlCharacter.call(this, textState, c);
    if (c === "\f") {
        this.processNewPage(textState);
    }
};

Window_Message.prototype.processNewLine = function(textState) {
    this._lineShowFast = false;
    Window_Base.prototype.processNewLine.call(this, textState);
    if (this.needsNewPage(textState)) {
        this.startPause();
    }
};

Window_Message.prototype.processNewPage = function(textState) {
    if (textState.text[textState.index] === "\n") {
        textState.index++;
    }
    textState.y = this.contents.height;
    this.startPause();
};

Window_Message.prototype.isEndOfText = function(textState) {
    return textState.index >= textState.text.length;
};

Window_Message.prototype.needsNewPage = function(textState) {
    return (
        !this.isEndOfText(textState) &&
        textState.y + textState.height > this.contents.height
    );
};

Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
        case "$":
            break;
        case ".":
            this.startWait(15);
            break;
        case "|":
            this.startWait(60);
            break;
        case "!":
            this.startPause();
            break;
        case ">":
            this._lineShowFast = true;
            break;
        case "<":
            this._lineShowFast = false;
            break;
        case "^":
            this._pauseSkip = true;
            break;
        default:
            Window_Base.prototype.processEscapeCharacter.call(
                this,
                code,
                textState
            );
            break;
    }
};

Window_Message.prototype.startWait = function(count) {
    this._waitCount = count;
};

Window_Message.prototype.startPause = function() {
    this.startWait(10);
    this.pause = true;
    EventManager.showMessageCursor();
};

Window_Message.prototype.pauseStop = function() {
    this.pause = false;
    this._waitCount = 0;
    this.openness = 0;
    this._opening = false;
    this._closing = false;
    EventManager.hideMessageCursor();
};

Window_Message.prototype.setSkipBusyMode = function(isBusy) {
    this._skipBusy = isBusy;
}

Window_Message.prototype.closeChioceWindow = function() {
    if (this._choiceListWindow){
        this._choiceListWindow.close();
    }
}

Window_Message.prototype.refreshDimmerBitmap = function() {
    if (this._dimmerSprite) {
        const bitmap = this._dimmerSprite.bitmap;
        const w = this.width > 0 ? this.width + 8 : 0;
        const h = this.height + 0;
        const m = this.padding;
        const c1 = ColorManager.dimColor1();
        const c2 = ColorManager.dimColor2();
        bitmap.resize(w, h);
        bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        bitmap.fillRect(0, m, w, h - m * 2, c1);
        bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        this._dimmerSprite.setFrame(0, 0, w, h);
        this._dimmerSprite.y = 12;
    }
};


Window_NumberInput.prototype.setup = function(maxDigits,initNum = 0,decideAction = null) {
    this._maxDigits = maxDigits;
    this._numberText = [];
    for (let i = 0;i < maxDigits;i++){
        this._numberText.push(0);
    }
    this._number = initNum;
    this._decideAction = decideAction;
    this.updatePlacement();
    this.placeButtons();
    this.createContents();
    this.refresh();
    this.open();
    this.activate();
    this.select(0);
}

Window_NumberInput.prototype.updatePlacement = function() {
    const messageY = 320;
    const spacing = 8;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = messageY;
};

Window_NumberInput.prototype.createButtons = function() {
    this._buttons = [];
    //if (ConfigManager.touchUI) {
        for (const type of ["down", "up"]) {
            const button = new Sprite_MZButton(type);
            this._buttons.push(button);
            this.addInnerChild(button);
        }
        this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
        this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
        //this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
    //}
};

Window_NumberInput.prototype.changeDigit = function(up) {
    const index = this.index();
    const place = Math.pow(10, this._maxDigits - 1 - index);
    let n = this._numberText[index] % 16;
    if (up) {
        n = (n + 1) % 16;
    } else {
        n = (n + 15) % 16;
    }
    this._numberText[index] = n;
    this.refresh();
    this.playCursorSound();
};

Window_NumberInput.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const align = "center";
    const s = this._number.padZero(this._maxDigits);
    const c = s.slice(index, index + 1);
    this.resetTextColor();
    let text = this._numberText[index];
    this.drawText(text.toString(16), rect.x, rect.y, rect.width, align);
};

Window_NumberInput.prototype.processOk = function() {
    this.playOkSound();
    //$gameVariables.setValue($gameMessage.numInputVariableId(), this._numberText);
    //this._messageWindow.terminateMessage();
    if (this._decideAction){
        this._decideAction(this._numberText);
    }
    this.updateInputData();
    this.deactivate();
    this.close();
};
Window_NumberInput.prototype.itemWidth = function() {
    return 36;
};