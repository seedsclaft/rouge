//-----------------------------------------------------------------------------
// PopupStatus_StatusItem
//
// The window for selecting a skill on the skill screen.

class PopupStatus_ActorListItem extends Window_Base{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height));
        this._cursorSprite.opacity = 0;
        this._actor = null;
        //this.opacity = 0;
    }

    setActor(actor,lvUpdate){
        this._actor = actor;
        this.refresh(lvUpdate);
    }
    

    lineHeight(){
        return 36;
    }



    refresh(lvUpdate = null){
        this.createContents();
        this.updateFace(16,0);
        this.updateName(160,0);
        this.updateElement(160,this.lineHeight());
        this.updateLvExp(160,this.lineHeight() * 2,lvUpdate);
        this.updateElementStatus(24,168);
        this.updateStatus(24,224,lvUpdate);
    }

    updateFace(x,y){
        this.drawFace(this._actor.faceName(),0,x,y);
    }

    updateName(x,y){
        this.drawText(this._actor.name(),x,y,240);
    }

    updateElement(x,y){
        this.drawText(TextManager.getText(600),x,y,240);
        this.drawText($dataSystem.elements[this._actor._elementId],x + 64,y,120,"right");
    }

    updateLvExp(x,y,lvUpdate){
        const _normalColor = ColorManager.normalColor();
        const _powerUpColor = ColorManager.powerUpColor();
        this.drawText(TextManager.getText(700)+".",x,y,240);

        const _levelColor = lvUpdate && lvUpdate.lv ? _powerUpColor : _normalColor;
        this.changeTextColor(_levelColor);
        this.drawText(this._actor.level,x + this.lineHeight(),y,240);
        this.changeTextColor(_normalColor);

        this.drawText(TextManager.getText(720),x,y + this.lineHeight(),240);
        this.drawText(this._actor.currentLevelExp(),x + 8,y + this.lineHeight(),104,"right");
        this.drawText(TextManager.getText(710),x + 120,y + this.lineHeight(),240);
        this.drawText(this._actor.nextLevelExp(),x + 80,y + this.lineHeight(),104,"right");
    }

    updateStatus(x,y,lvUpdate){
        const _normalColor = ColorManager.normalColor();
        const _powerUpColor = ColorManager.powerUpColor();

        const _lineHeight = this.lineHeight();
        const _statusTextId = [500,510,520,530,540];
        const _statusParamId = [0,1,2,6,3];

        let _textColor = _normalColor;
        for (let i = 0;i < _statusTextId.length;i++){
            this.changeTextColor(_normalColor);
            this.drawText(TextManager.getText(_statusTextId[i]),x,y + _lineHeight * i,120);
            if (i == 0){
                _textColor = lvUpdate && lvUpdate.hp ? _powerUpColor : _normalColor;
                this.changeTextColor(_textColor);
                this.drawText(this._actor.hp + " / " + this._actor.param(_statusParamId[i]),x + 80,y + _lineHeight * i,120,"right");
                this.changeTextColor(_normalColor);
            } else{
                if (i == 1) _textColor = lvUpdate && lvUpdate.mp ? _powerUpColor : _normalColor;
                else if (i == 2) _textColor = lvUpdate && lvUpdate.atk ? _powerUpColor : _normalColor;
                else if (i == 3) _textColor = lvUpdate && lvUpdate.spd ? _powerUpColor : _normalColor;
                else if (i == 4) _textColor = lvUpdate && lvUpdate.def ? _powerUpColor : _normalColor;
                this.changeTextColor(_textColor);
                this.drawText(this._actor.param(_statusParamId[i]),x + 80,y + _lineHeight * i,120,"right");
                this.changeTextColor(_normalColor);
            }
        }
        let paramUpRate = this._actor.paramUpRate();
        paramUpRate.forEach((rate,index) => {
            this.drawText("(+" + rate + "%)",x + 200,y + _lineHeight * index,120,"right");
        });
    }

    updateElementStatus(x,y){
        const _element = $dataSystem.elements;
        const _elementId = [1,2,3,4,5];
        const _elementStatusType = [
            StateType.FIRE_STATUS,StateType.THUNDER_STATUS,StateType.ICE_STATUS,StateType.WHITE_STATUS,StateType.BLACK_STATUS
        ]
        for (let i = 0;i < _elementId.length;i++){
            this.drawText(_element[_elementId[i]],x + 68 * i,y,120);
            this.drawElementStatus(this._actor,_elementStatusType[i],i,x + 68 * i + 32,y,120);
        }

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

    _updateCursor(){
    }
}