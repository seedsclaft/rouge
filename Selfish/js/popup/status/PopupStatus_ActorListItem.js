//-----------------------------------------------------------------------------
// PopupStatus_ActorListItem
//

class PopupStatus_ActorListItem extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height));
        //this._cursorSprite.opacity = 0;
        this._actor = null;
        this._faceSprite = new Sprite();
        this._faceSprite.x = 16;
        this._faceSprite.y = 12;
        this._faceSprite.scale.x = this._faceSprite.scale.y = 0.75;
        this.addChild(this._faceSprite);
        //this.opacity = 0;
    }

    setActor(actor,lvUpdate){
        this._actor = actor;
        this.refresh(lvUpdate);
    }
    

    itemHeight(){
        return 32;
    }

    maxItems() {
        return 5;
    };

    itemRect(index) {
        const maxCols = this.maxCols();
        const itemWidth = this.itemWidth();
        const itemHeight = this.itemHeight();
        const colSpacing = this.colSpacing();
        const rowSpacing = this.rowSpacing();
        const col = index % maxCols;
        const row = Math.floor(index / maxCols);
        const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
        const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
        const width = itemWidth - colSpacing;
        const height = itemHeight - rowSpacing;
        return new Rectangle(x, y + 168, width, height);
    };

    lineHeight(){
        return 32;
    }

    refresh(lvUpdate = null){
        this.createContents();
        this.updateFace(16,16);
        this.updateName(160,16);
        this.updateElement(160,(this.lineHeight()) + 16);
        this.updateLvExp(160,(this.lineHeight()) * 2 + 16,lvUpdate);
        this.updateStatus(24,216 - 24 - 24,lvUpdate);
        this.updateElementStatus(24,168 + 216 - 32);
    }

    updateFace(x,y){
        this._faceSprite.bitmap = ImageManager.loadFace(this._actor.faceName());
        this._faceSprite.setFrame(40,40,188,188);
        //const bitmap = ImageManager.loadFace(this._actor.faceName());
        //this.contents.blt(bitmap, 72, 72, 120, 120, x, y);
    }

    updateName(x,y){
        this.drawText(this._actor.name(),x,y,240);
    }

    updateElement(x,y){
        this.contents.fontSize = 20;
        this.drawText(TextManager.getText(600),x,y,240);
        this.drawText($dataSystem.elements[this._actor._elementId],x,y,128,"right");
        this.resetFontSettings();
    }

    updateLvExp(x,y,lvUpdate){
        this.contents.fontSize = 20;
        const _normalColor = ColorManager.normalColor();
        const _powerUpColor = ColorManager.powerUpColor();
        this.drawText(TextManager.getText(700)+".",x,y,240);
        this.drawText(TextManager.getText(730),x,y + this.lineHeight(),240);

        const _levelColor = lvUpdate && lvUpdate.lv ? _powerUpColor : _normalColor;
        this.changeTextColor(_levelColor);
        this.drawText(this._actor.level,x + this.lineHeight(),y,240);
        this.drawText(this._actor._sp,x + 48,y + this.lineHeight(),80,"right");
        this.changeTextColor(_normalColor);

        //this.drawText(this._actor._useSp,x + 8,y + this.lineHeight(),64,"right");
        //this.drawText(TextManager.getText(710),x + 80,y + this.lineHeight(),240);
        this.resetFontSettings();
    }

    updateStatus(x,y,lvUpdate){
        const _normalColor = ColorManager.normalColor();
        const _powerUpColor = ColorManager.powerUpColor();

        const _lineHeight = this.lineHeight();
        const _statusTextId = [500,510,520,540,530];
        const _statusParamId = [0,1,2,3,6];
        this.contents.fontSize = 14;

        this.drawText(TextManager.getText(760),x,y - 24,120);
        this.drawText(TextManager.getText(770),x + 144,y - 24,120,"right");
        this.contents.fontSize = 20;
        let _textColor = _normalColor;
        for (let i = 0;i < _statusTextId.length;i++){
            this.changeTextColor(_normalColor);
            this.drawText(TextManager.getText(_statusTextId[i]),x,y + _lineHeight * i,120);
            if (i == 0){
                _textColor = lvUpdate && lvUpdate.hp ? _powerUpColor : _normalColor;
                this.changeTextColor(_textColor);
                this.drawText(this._actor.hp + " / " + this._actor.param(_statusParamId[i]),x + 48,y + _lineHeight * i,120,"right");
                this.changeTextColor(_normalColor);
            } else{
                if (i == 1) _textColor = lvUpdate && lvUpdate.mp ? _powerUpColor : _normalColor;
                else if (i == 2) _textColor = lvUpdate && lvUpdate.atk ? _powerUpColor : _normalColor;
                else if (i == 3) _textColor = lvUpdate && lvUpdate.spd ? _powerUpColor : _normalColor;
                else if (i == 4) _textColor = lvUpdate && lvUpdate.def ? _powerUpColor : _normalColor;
                this.changeTextColor(_textColor);
                this.drawText(this._actor.param(_statusParamId[i]),x + 48,y + _lineHeight * i,120,"right");
                this.changeTextColor(_normalColor);
            }
        }
        for (let i = 0;i < 5;i++){
            this.drawText(this._actor.calcParamUpCost(i),x + 144,y + _lineHeight * i,120,"right");
        }
        this.resetFontSettings();
    }

    updateElementStatus(x,y){
        this.contents.fontSize = 14;
        this.drawText(TextManager.getText(780),x,y - 24,240);
        const _element = $dataSystem.elements;
        const _elementId = [1,2,3,4,5];
        const _elementStatusType = [
            StateType.FIRE_STATUS,StateType.THUNDER_STATUS,StateType.ICE_STATUS,StateType.WHITE_STATUS,StateType.BLACK_STATUS
        ]
        this.contents.fontSize = 20;
        for (let i = 0;i < _elementId.length;i++){
            this.drawText(_element[_elementId[i]],x + 56 * i,y,120);
            this.drawElementStatus(this._actor,_elementStatusType[i],i,x + 24 + 56 * i,y,120);
        }
        this.resetFontSettings();

    }

    drawElementStatus(actor,elementStatusType,index,x,y){
        let _elementStatus = actor.getStateEffectTotal($gameStateInfo.getStateId(elementStatusType));
        _elementStatus += actor.alchemyParam()[index];
        let status = "G";
        if (_elementStatus > 100){
            status = "S";
        } else
        if (_elementStatus > 80){
            status = "A";
        } else
        if (_elementStatus > 60){
            status = "B";
        } else
        if (_elementStatus > 40){
            status = "C";
        } else
        if (_elementStatus > 20){
            status = "D";
        } else
        if (_elementStatus > 10){
            status = "E";
        } else
        if (_elementStatus > 0){
            status = "F";
        }
        this.drawText(status,x,y,120);
    }

    //_updateCursor(){
    //}
}