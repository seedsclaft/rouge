//-----------------------------------------------------------------------------
// Window_SkillHelp
//
// The window for displaying the description of the selected item.

function Window_SkillHelp() {
    this.initialize.apply(this, arguments);
}

Window_SkillHelp.prototype = Object.create(Window_Base.prototype);
Window_SkillHelp.prototype.constructor = Window_SkillHelp;

Window_SkillHelp.prototype.initialize = function(x,y,width,height,backGroundType) {
    Window_Base.prototype.initialize.call(this,new Rectangle( x, y, width, height ));
    this.opacity = 0;
    this._battler = null;
    this._textContent = new Sprite();
    this._textContent.x = 24 * 2;
    this._textContent.y = 12 * 1.5;
    this._textContent.scale.x = 0.5;
    this._textContent.scale.y = 0.5;
    this._textContent.bitmap = new Bitmap(this.width*2,96*2);
    this._backGroundType = true;
    if (backGroundType != null){
        this._backGroundType = backGroundType;
    }
    this.addChild(this._textContent);
    //this.padding = 0;
    this.refresh();
};

Window_SkillHelp.prototype.setData = function(data) {
    this._data = data;
    this.refresh();
};

Window_SkillHelp.prototype.clear = function() {
};

Window_SkillHelp.prototype.refresh = function() {
    this.contents.clear();
    this._textContent.bitmap.clear();
    this.contents.fontSize = 38;
    this._textContent.bitmap.fontSize = 38;
    if (this._backGroundType)
    this.drawBackSkewX(52,0,this.width - 104,96,0x000000,128,-0.27);
    this.drawTextEx(this._data, 56, 6);
};


Window_SkillHelp.prototype.drawTextEx = function(helpData, x, y) {
    if (helpData && helpData.baseText != "") {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(helpData.baseText);
        textState.height = this.calcTextHeight(textState, false);

        var damage = (helpData.power * 0.01).toFixed(2);
        var repeat = helpData.hit;

        if (damage && helpData.power){
            if (repeat >= 1){
                this._textContent.bitmap.drawText(TextManager.getText(710200),720,7,200,40);
                this._textContent.bitmap.drawText(repeat,760,7,120,40,'right');
            }
            this._textContent.bitmap.drawText(TextManager.getText(710100),360,7,200,40,'right');
            if (helpData.damageRateUp){
                this._textContent.bitmap.textColor = $gameColor.getColor('powerup');
            }
            this._textContent.bitmap.drawText("x" + damage,560,7,120,40,'right');
            this._textContent.bitmap.textColor = $gameColor.getColor('text');
        }
        let desplayText = textState.text.split("\n");
        if (desplayText.length == 4){
            
        }
        let lineHeight = 2;
        desplayText.forEach((text,index) => {
            text = text.replace(/\x1b/gi,"");
            let textWidth = this.width * 1.5 - 24;
            if (index == 0){
                let measureTextWidth = this._textContent.bitmap.measureTextWidth(text);
                if (measureTextWidth > 360){
                    textWidth = 360;
                }
            }
            this._textContent.bitmap.drawText(text,textState.x,lineHeight,textWidth,textState.height);
            
            if (desplayText.length >= 4){
                if (index == 0){
                    this.contents.fontSize = 36;
                    this._textContent.bitmap.fontSize = 36;
                }
            }
            if (desplayText.length >= 4){
                if (index >= 1){
                    lineHeight += textState.height - 20;
                } else{
                    lineHeight += textState.height - 8;
                }
            } else{
                lineHeight += textState.height;
            }
        });
        
        return textState.x - x;
    } else {
        return 0;
    }
};

Window_SkillHelp.prototype.loadWindowskin = function() {
};
Window_SkillHelp.prototype._updateCursor = function() {
};
Window_SkillHelp.prototype._updateFrame = function() {
}
Window_SkillHelp.prototype._updateContentsBack = function() {
}
Window_SkillHelp.prototype._updatePauseSign = function() {
}
Window_SkillHelp.prototype._updateArrows = function() {
}
Window_SkillHelp.prototype.updateBackOpacity = function() {
};
Window_SkillHelp.prototype.loadWindowskin = function() {
};

Window_SkillHelp.prototype._createAllParts = function() {
    this._createContainer();
    /*
    this._createBackSprite();
    this._createFrameSprite();
    this._createContentsBackSprite();
    this._createPauseSignSprites();
    this._createCursorSprite();
    this._createArrowSprites();
    */
    this._createClientArea();
    this._createContentsSprite();
};

Window_SkillHelp.prototype._refreshAllParts = function() {
    /*
    this._refreshBack();
    this._refreshFrame();
    this._refreshCursor();
    this._refreshPauseSign();
    this._refreshArrows();
    */
};