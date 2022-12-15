//-----------------------------------------------------------------------------
// Window_KeyMap
//

class Window_KeyMap extends Window_Base{
    constructor(){
        super();
    }

    initialize(){
        this._keyMapIcon = ImageManager.loadSystem("keyMapIcons");
        this._textWidth = 24;
        super.initialize(new Rectangle( 0, -9, Graphics.width, this.fittingHeight(1) ));
        this.opacity = 0;
        this.show();
        this._lastNo = 0;
        this.scale.x = this.scale.y = 0.9;
    }

    refresh(key){
        this._text = $gameKeyMap.getKeyMap(key);
        this.contents.clear();
        this._addX = 0;
        let x = this.drawTextEx(this._text, 0, 0);
        this.x = 924 - ((x + this._addX)*0.9);

        let scale = 0.9;
        if (this.x < 240){
            scale *= (( 1440 - this.x) / 1440);
        }
        this.scale.x = this.scale.y = scale;
        if (scale < 0.9){
            this.x = this.x + ((0.9 - scale) * 880);
            this.y = 492 + ((0.9 - scale) * 24);
        } else{
            this.y = 492;
        }
        if (this._lastNo != key){
            this._lastNo = key;
            this.alpha = 0;
            this.x += 48;
            gsap.to(this,0.25,{alpha:1,x:this.x - 48});
        }
    }

    showAnimation(){
        this.show();
        this.alpha = 0;
        gsap.to(this,0.1,{alpha:1,x:this.x});
    }

    drawKeyIcon(iconIndex, x, y ,width){
        const bitmap = this._keyMapIcon;
        const pw = 24;
        const ph = 24;
        const sx = iconIndex % 16 * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        this.contents.blt(bitmap, sx, sy, pw * width, ph, x, y);
    }

    processEscapeCharacter(code, textState){
        switch (code) {
            case 'C':
                this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
                break;
            case 'I':
                this.processDrawIcon(this.obtainEscapeParam(textState), textState);
                break;
            case 'H':
                this.processDrawIcon(this.obtainEscapeParam(textState), textState);
                break;
            case '{':
                this.makeFontBigger();
                break;
            case '}':
                this.makeFontSmaller();
                break;
            }
    }

    convertEscapeCharacters(text){
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            return this.actorName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bT\[(\d+)\]/gi, function() {
            return TextManager.getText(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    }

    processDrawIcon(iconIndex, textState){
        let width = 1;
        const controlType = $dataOption.getUserData("controlType");
        if (controlType === 0){
            iconIndex = this.changeKeyIcon(iconIndex);
        } else if (controlType === 1){
            iconIndex = this.changePadIcon(iconIndex);
        } else if (controlType === 2){
            iconIndex = this.changePadIcon2(iconIndex);
        }
        if (iconIndex == 68 || iconIndex == 70){
            width = 2;
        }
        this.drawKeyIcon(iconIndex, textState.x + 2, textState.y + 8,width);
        if (iconIndex == 68 || iconIndex == 70){
            textState.x += 24;
            this._addX += 24;
        }
        textState.x += 28;
    }

    terminate(){
        gsap.killTweensOf(this);
        this.destroy();
    }
}