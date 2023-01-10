Window.prototype._createPauseSignSprites = function() {
    this._pauseSignSprite = new Sprite();
    //this.addChild(this._pauseSignSprite);
};

Window.prototype._refreshArrows = function() {
    const w = this._width;
    const h = this._height;
    const p = 24;
    const q = p / 2;
    const sx = 96 + p;
    const sy = 0 + p;
    this._downArrowSprite.bitmap = this._windowskin;
    this._downArrowSprite.anchor.x = 0.5;
    this._downArrowSprite.anchor.y = 0.5;
    this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
    this._downArrowSprite.move(w / 2, h - 4);
    this._upArrowSprite.bitmap = this._windowskin;
    this._upArrowSprite.anchor.x = 0.5;
    this._upArrowSprite.anchor.y = 0.5;
    this._upArrowSprite.setFrame(sx + q, sy, p, q);
    this._upArrowSprite.move(w / 2, 4);
};

//-----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

function Window_Help() {
    this.initialize.apply(this, arguments);
}

Window_Help.prototype = Object.create(Window_Base.prototype);
Window_Help.prototype.constructor = Window_Help;

Window_Help.prototype.initialize = function() {
    var x = 0;
    var y = Graphics.boxHeight - this.lineHeight() + 8;
    var width = Graphics.boxWidth+96;
    var height = this.fittingHeight(1);
    
    Window_Base.prototype.initialize.call(this, new Rectangle( x, y, width, height ));
    this._text = '';
    this.opacity = 0;
    this.padding = 0;
    this.refresh();
};

Window_Help.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_Help.prototype.clear = function() {
    this.setText('');
};

Window_Help.prototype.setItem = function(item) {
    if (item && DataManager.isSkill(item)){
        let id = item.id;
        if (item.helpTextId != 0){
            id = item.helpTextId;
        }
        this.setText(item ? TextManager.getSkillDescription(id) : '');
    } else{
        this.setText(item ? item.name() : '');
    }
};

Window_Help.prototype.refresh = function() {
    this.contents.clear();
    this.drawBack(0,0,this.width,this.height,0x000000,255);
    this.drawTextEx(this._text, 32, 0);
};

Window_Help.prototype.drawTextEx = function(text, x, y, width) {
    //this.resetFontSettings();
    this.contents.fontSize = 21;
    const textState = this.createTextState(text, x, y, width);
    this.processAllText(textState);
    return textState.outputWidth;
};


//-----------------------------------------------------------------------------
// Window_GameEnd
//
// The window for selecting "Go to Title" on the game end screen.

function Window_GameEnd() {
    this.initialize.apply(this, arguments);
}

Window_GameEnd.prototype = Object.create(Window_Command.prototype);
Window_GameEnd.prototype.constructor = Window_GameEnd;

Window_GameEnd.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
    this.open();
};

Window_GameEnd.prototype.windowWidth = function() {
    return 240;
};

Window_GameEnd.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

Window_GameEnd.prototype.makeCommandList = function() {
    this.addCommand(TextManager.toTitle, 'toTitle');
    this.addCommand(TextManager.cancel,  'cancel');
};

Window_Base.prototype.lineHeight = function() {
    return 40;
};

Window_Base.prototype.createContents = function() {
    const width = this.contentsWidth();
    const height = this.contentsHeight();
    this.destroyContents();
    this.contents = new Bitmap(width, height);
    this.contentsBack = new Bitmap(width, height);
    this.resetFontSettings();
};

Window_Base.prototype.destroyContents = function() {
    if (this.contents) {
        this.contents.destroy();
    }
    if (this.contentsBack) {
        this.contentsBack.destroy();
    }
};

Window_Base.prototype.drawBack = function(x, y, width, height, color, opacity) {
    this.contents.paintOpacity = opacity;
    this.contents.fillRect(x, y, width, height, color);
    this.contents.paintOpacity = 255;
};

Window_Base.prototype.drawBackFadeRight = function(x, y, width, height, color, opacity) {
    this.contents.paintOpacity = opacity;
    this.contents.gradientFillRect(x, y, width / 2, height, 'rgba(0, 0, 0, 0)', color);
    this.contents.fillRect(x + width / 2, y, width / 2, height, color);
    this.contents.paintOpacity = 255;
};

Window_Base.prototype.drawBackFadeLeft = function(x, y, width, height, color, opacity) {
    this.contents.paintOpacity = opacity;
    this.contents.fillRect(x, y, width / 2, height, color);
    this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color, "rgba(0,0,0,0)");
    this.contents.paintOpacity = 255;
};

Window_Base.prototype.drawBackSkewX = function(x, y, width, height, color, opacity,skewX) {
    if (skewX === undefined){
        skewX = -0.27;
    }
    this.contents.paintOpacity = opacity;
    this.contents.context.setTransform(1,0,skewX,1,0,0);
    this.contents.fillRect(x, y, width, height, color);
    this.contents.paintOpacity = 255;
    this.contents.context.setTransform(1,0,0,1,0,0);
};

Window_Base.prototype.drawUpperTriangle = function(x, y, width, height, color, opacity,skewX) {
    if (skewX === undefined){
        skewX = -0.27;
    }
    this.contents.paintOpacity = opacity;
    this.contents.context.setTransform(1,0,skewX,1,0,0);
    this.contents.drawUpperTriangle(x , y, width, height,color);
    this.contents.paintOpacity = 255;
    this.contents.context.setTransform(1,0,0,1,0,0);
};

Window_Base.prototype.drawLowerTriangle = function(x, y, width, height, color, opacity,skewX) {
    if (skewX === undefined){
        skewX = -0.25;
    }
    this.contents.paintOpacity = opacity;
    this.contents.context.setTransform(1,0,skewX,1,0,0);
    this.contents.drawLowerTriangle(x, y, width, height,color);
    this.contents.paintOpacity = 255;
    this.contents.context.setTransform(1,0,0,1,0,0);
}

Window_Base.prototype.drawBackFadeLeftSkewX = function(x, y, width, height, color ,color2, opacity) {
    this.contents.paintOpacity = opacity;
    this.contents.context.setTransform(1,0,-0.27,1,0,0);
    this.contents.gradientFillRectHalf(x , y, width, height, color, color2);
    this.contents.paintOpacity = 255;
    this.contents.context.setTransform(1,0,0,1,0,0);
};

Window_Base.prototype.drawLineText = function(str,x,y,width) {
    this.contents.fontSize = 21;
    this.drawText(str, x, y, width,"left");
    this.resetFontSettings();
};

Window_Base.prototype.setFlatMode = function(flag) {
    this.changeTextColor('rgba(40, 40, 40, 1)');
};

Window_Base.prototype.makeFontBigger = function() {
    this.contents.fontSize = 25;
};

Window_Base.prototype.makeFontSmaller = function() {
    this.contents.fontSize = 21;
};

Window_Base.prototype.textPadding = function() {
    return 6;
};

Window_Base.prototype.normalColor = function() {
    return $gameColor.getColor('text');
};

Window_Base.prototype.systemColor = function() {
    return $gameColor.getColor('system');
};

Window_Base.prototype.equipedColor = function() {
    return $gameColor.getColor('equiped');
}

Window_Base.prototype.crisisColor = function() {
    return $gameColor.getColor('crisis');
};

Window_Base.prototype.deathColor = function() {
    return this.textColor(18);
};

Window_Base.prototype.gaugeBackColor = function() {
    return $gameColor.getColor('gaugeback');
};

Window_Base.prototype.hpGaugeColor1 = function() {
    return $gameColor.getColor('hpgauge1');
};

Window_Base.prototype.hpGaugeColor2 = function() {
    return $gameColor.getColor('hpgauge2');
};

Window_Base.prototype.mpGaugeColor1 = function() {
    return this.textColor(22);
};

Window_Base.prototype.mpGaugeColor2 = function() {
    return this.textColor(23);
};

Window_Base.prototype.mpCostColor = function() {
    return $gameColor.getColor('mpcost');
};

Window_Base.prototype.powerUpColor = function() {
    return $gameColor.getColor('powerup');
};

Window_Base.prototype.powerDownColor = function() {
    return $gameColor.getColor('powerdown');
};

Window_Base.prototype.tpGaugeColor1 = function() {
    return this.textColor(28);
};

Window_Base.prototype.tpGaugeColor2 = function() {
    return this.textColor(29);
};

Window_Base.prototype.tpCostColor = function() {
    return $gameColor.getColor('tpcost');
};

Window_Base.prototype.cursorColor = function() {
    return $gameColor.getColor('cursor');
};

Window_Base.prototype.pendingColor = function() {
    return this.windowskin.getPixel(120, 120);
};

Window_Base.prototype.drawItemName = function(item, x, y, width,isSelect) {
    if (!item) return;
    const iconBoxWidth = ImageManager.iconWidth;
    this.drawElementIcon(item.damage.elementId - 1,x, y + 3);
    const isNew = _.find($gameParty._newSkillIdList,(s) => s == item.id);
    if (isNew){
        this.contents.fontSize = 12;
        this.changeTextColor(this.powerUpColor());
        this.drawText(TextManager.getNewText(), x + iconBoxWidth + 8, y - 18, width - iconBoxWidth);
    } else{
        this.resetTextColor();
    }
    this.contents.fontSize = 21;
    this.drawText(TextManager.getSkillName(item.id), x + iconBoxWidth + 4, y, width - iconBoxWidth);
    
    if (isSelect){
        this.contents.fontSize = 16;
        this.changeTextColor(this.equipedColor());
        this.drawText(TextManager.getText(350), x + 16, y - 14, width - iconBoxWidth,"left",true);
    }
    this.resetFontSettings();
};

Window_Base.prototype.drawItemDescription = function(item, x, y, width) {
    if (!item) return;
    this.contents.fontSize = 16;
    if (item.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE) {
        this.drawText(TextManager.getText(1560), x, y + 16, width);
    } else{
        if (item.range != null){
            let range = TextManager.getText(1510);
            if (item.range == 1) range = TextManager.getText(1520);
            this.drawText(TextManager.getText(1500) + range, x, y + 16, width);
        }
        if (item.damage.formula){
            this.drawText(TextManager.getText(1540) + " " + TextManager.getText(1550), x + 80, y + 16, width);
            if (item.damage){
                this.drawText("x" + (Number(item.damage.formula) * 0.01).toFixed(2), x + 136, y + 16, 120, "rigth");
            } else{
                this.drawText(item.damage.formula, x + 136, y + 16, 120, "rigth");
            }
        }
    }
        
    /*
    if (item.scope >= 7 && item.scope <= 14){
        let scopeText = 0;
        if (item.scope == 7){
            scopeText = 1580;
        } else
        if (item.scope == 8){
            scopeText = 1570;
        } else
        if (item.scope == 11){
            scopeText = 1590;
        }
        this.drawText(TextManager.getText(scopeText), x, y + 16, width);
    }
    */

    const _textLine = item.description.split("\n");
    _textLine.forEach((text,index) => {
        let textWidth = this.contents.measureTextWidth(text);
        this.drawTextEx(text,width - textWidth + 12,y + 20 + index * 26 - (_textLine.length-1) * 26,width);
    });
    this.resetFontSettings();
};

Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2,needBack) {
    if (needBack === undefined){
        needBack = true;
    }
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    if (needBack){
        this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    }
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

Window_Base.prototype.refreshDimmerBitmap = function() {
    if (this._dimmerSprite) {
        var bitmap = this._dimmerSprite.bitmap;
        var w = Graphics.width;
        var h = 240;
        var m = this.padding;
        var c1 = ColorManager.dimColor1 ();
        bitmap.resize(w, h);
        //bitmap.gradientFillRect(0, 0, 120, h, c2, c1, false);
        bitmap.fillRect(0, 0, Graphics.width + 168, h, c1);
        //bitmap.gradientFillRect(620, 0, 120, h, c1, c2, false);
        this._dimmerSprite.setFrame(0, 0, w, h);
        this._dimmerSprite.x = -160;
    }
};

Window_Base.prototype.drawElementIcon = function(elementId, x, y) {
    const bitmap = ImageManager.loadSystem("ElementIcon");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (elementId % 5) * pw;
    const sy = 0;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};

Window_Base.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
        case "C":
            this.processColorChange(this.obtainEscapeParam(textState));
            break;
        case "I":
            this.processDrawIcon(this.obtainEscapeParam(textState), textState);
            break;
        case "PX":
            textState.x = this.obtainEscapeParam(textState);
            break;
        case "PY":
            textState.y = this.obtainEscapeParam(textState);
            break;
        case "FS":
            this.contents.fontSize = this.obtainEscapeParam(textState);
            break;
        case "{":
            this.makeFontBigger();
            break;
        case "}":
            this.makeFontSmaller();
            break;
        case "K":
            this.processDrawKeyIcon(this.obtainEscapeParam(textState), textState);
            break;
    }
};

Window_Base.prototype.drawKeyIcon = function(iconIndex, x,y,width) {
    var bitmap = ImageManager.loadSystem("keyMapIcons");
    var pw = 24;
    var ph = 24;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw * width, ph, x, y);
}

Window_Base.prototype.processDrawKeyIcon = function(iconIndex, textState) {
    var width = 1;
    const controlType = $dataOption.getUserData("controlType");
    if (controlType === 0){
        iconIndex = this.changeKeyIcon(iconIndex);
    } else if (controlType === 1){
        iconIndex = this.changePadIcon(iconIndex);
    }
    if (iconIndex == 68 || iconIndex == 70){
        width = 2;
    }
    this.drawKeyIcon(iconIndex, textState.x + 2, textState.y + 6,width);
    if (iconIndex == 68 || iconIndex == 70){
        textState.x += 24;
    }
    textState.x += 28;
};

Window_Base.prototype.changeKeyIcon = function(index) {
    var iconIndex = index;
    var value = _.values($dataOption.keyControl());
    var data = value[iconIndex].toUpperCase();
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var idx = _.findIndex(alphabet,(a) => data == a);
    if (idx == -1){
        var arrows = ['ARROWLEFT','ARROWRIGHT','ARROWUP','ARROWDOWN']
        var idx = _.findIndex(arrows,(a) => data == a)
        if (idx != -1){
            idx += 32;
        } else{
            if (data == "SHIFT"){
                idx = 48;
            }
            if (data == "CONTROL"){
                idx = 50;
            }
            if (!isNaN(+data)){
                idx = 36 + +data;
            }
        }
    }
    return idx;
};

Window_Base.prototype.changePadIcon = function(index) {
    var idx = 0;
    var iconIndex = index;
    var value = _.values($dataOption.xpadControl());
    var key = value[iconIndex];
    switch (key){
        case 0:
        idx = 64;
        break;
        case 1:
        idx = 65;
        break;
        case 2:
        idx = 66;
        break;
        case 3:
        idx = 67;
        break;
        case 4:
        idx = 68;
        break;
        case 5:
        idx = 70;
        break;
        case 6:
        idx = 68;
        break;
        case 7:
        idx = 69;
        break;
        case 12:
        idx = 34;
        break;
        case 13:
        idx = 35;
        break;
        case 14:
        idx = 32;
        break;
        case 15:
        idx = 33;
        break;
    }
    return idx;
};

Window_Base.prototype.changePadIcon2 = function(index) {
    var idx = 0;
    var iconIndex = index;
    var value = _.values($dataOption.xpadControl());
    var key = value[iconIndex];
    switch (key){
        case 0:
        idx = 64 + 16;
        break;
        case 1:
        idx = 65 + 16;
        break;
        case 2:
        idx = 66 + 16;
        break;
        case 3:
        idx = 67 + 16;
        break;
        case 4:
        idx = 68;
        break;
        case 5:
        idx = 70;
        break;
        case 6:
        idx = 68;
        break;
        case 7:
        idx = 69;
        break;
        case 12:
        idx = 34;
        break;
        case 13:
        idx = 35;
        break;
        case 14:
        idx = 32;
        break;
        case 15:
        idx = 33;
        break;
    }
    return idx;
};

Window_Selectable.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        var lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        if (Input.isRepeated('left')) {
            this.cursorLeft(Input.isTriggered('left'));
        }
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
            this.callHandler('index');
        }
    }
};

Window_Selectable.prototype.processHandling = function() {
    if (this.isOpenAndActive()) {
		if (this.isOkEnabled() && this.isOkTriggered()) {
            this.processOk();
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();
        } else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.processPagedown();
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        } else if (this.isHandled('menu') && Input.isTriggered('menu')) {
            this.processMenu();
        } else if (this.isHandled('shift') && Input.isTriggered('shift')) {
            this.processShift();
        } else if (this.isHandled('pause') && Input.isTriggered('pause')) {
            this.processPause();
        } else if (this.isHandled('left') && Input.isTriggered('left')) {
            this.processLeft();
        } else if (this.isHandled('down') && Input.isTriggered('down')) {
            this.processDown();
        } else if (this.isHandled('right') && Input.isTriggered('right')) {
            this.processRight();
        } else if (this.isHandled('up') && Input.isTriggered('up')) {
            this.processUp();
        }
    }
};

Window_Selectable.prototype.onTouchSelect = function(trigger) {
    this._doubleTouch = false;
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        const hitIndex = this.hitIndex();
        if (hitIndex >= 0) {
            if (hitIndex === this.index()) {
                this._doubleTouch = true;
            }
            this.select(hitIndex);
        }
        if (trigger && this.index() !== lastIndex) {
            this.playCursorSound();
        }
        if (this.index() !== lastIndex) {
            this.callHandler('index');
        }
    }
};

Window_Selectable.prototype.processShift = function() {
    SoundManager.playOk();
    this.updateInputData();
    this.deactivate();
    this.callHandler('shift');
};

Window_Selectable.prototype.processPause = function() {
    //SoundManager.playOk();
    this.updateInputData();
    this.deactivate();
    this.callHandler('pause');
};

Window_Selectable.prototype.processMenu = function() {
    //SoundManager.playOk();
    this.updateInputData();
    this.deactivate();
    this.callHandler('menu');
};

Window_Selectable.prototype.processLeft = function() {
    //SoundManager.playOk();
    this.updateInputData();
    this.deactivate();
    this.callHandler('left');
};

Window_Selectable.prototype.processRight = function() {
    //SoundManager.playOk();
    this.updateInputData();
    this.deactivate();
    this.callHandler('right');
};

Window_Selectable.prototype.processDown = function() {
    //SoundManager.playOk();
    this.updateInputData();
    this.deactivate();
    this.callHandler('down');
};

Window_Selectable.prototype.processUp = function() {
    //SoundManager.playOk();
    this.updateInputData();
    this.deactivate();
    this.callHandler('up');
};

Window_Selectable.prototype.rowSpacing = function() {
    return 0;
};

Window_Selectable.prototype.spacing = function() {
    return 12;
};

Window_Selectable.prototype.drawBackgroundRect = function(rect) {
};

Window_Selectable.prototype.paint = function() {
    if (this.contents) {
        this.contents.clear();
        //this.contentsBack.clear();
        this.drawAllItems();
    }
};

Window_Selectable.prototype.setHelpWindowText = function(text) {
    if (this._helpWindow) {
        this._helpWindow.setText(text);
    }
};

Window_Selectable.prototype.clearItem = function(index) {
    const rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};

Window_Selectable.prototype.setHelpWindowData = function(data) {
    if (this._helpWindow) {
        this._helpWindow.setData(data);
    }
};

Window_Selectable.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
        this.callDisableHandler();
    }
};

Window_Selectable.prototype.callDisableHandler = function() {
    this.callHandler("disable");
};