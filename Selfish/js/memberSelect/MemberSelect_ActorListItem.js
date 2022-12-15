//-----------------------------------------------------------------------------
// MemberSelect_StatusItem
//
// The window for selecting a skill on the skill screen.

class MemberSelect_ActorListItem extends Window_Base{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height));
        this._cursorSprite.opacity = 0;
        this._actor = null;
        //this.opacity = 0;
    }

    setActor(actor){
        this._actor = actor;
        this.refresh();
    }
    

    lineHeight(){
        return 36;
    }



    refresh(){
        this.createContents();
        this.updateFace(16,0);
        this.updateName(160 +24,0);
        this.updateElement(160 +24,this.lineHeight());
        this.updateLvExp(160 +24,this.lineHeight() * 2);
        this.updateElementStatus(24,184);
        this.updateStatus(24,240);
    }

    updateFace(x,y){
        this.drawFace(this._actor.faceName(),0,x,y);
    }

    updateName(x,y){
        this.drawText(this._actor.name(),x,y,240);
    }

    updateElement(x,y){
        this.drawText(TextManager.getText(600),x,y,240);
        this.drawText($dataSystem.elements[this._actor._elementId],x + 80,y,120,"right");
    }

    updateLvExp(x,y){
        this.drawText(TextManager.getText(700)+".",x,y,240);
        this.drawText(this._actor.level,x + this.lineHeight(),y,240);
        this.drawText(TextManager.getText(720),x,y + this.lineHeight(),240);
        this.drawText(this._actor.currentLevelExp(),x + 8,y + this.lineHeight(),120,"right");
        this.drawText(TextManager.getText(710),x + 136,y + this.lineHeight(),240);
        this.drawText(this._actor.nextLevelExp(),x + 80,y + this.lineHeight(),120,"right");
    }

    updateStatus(x,y){
        const _lineHeight = this.lineHeight();
        const _statusTextId = [500,510,520,530,540];
        const _statusParamId = [0,1,2,6,3];
        const _upperStatusType = [
            StateType.HP_UPPER_STATUS,StateType.MP_UPPER_STATUS,StateType.ATK_UPPER_STATUS,StateType.SPD_UPPER_STATUS,StateType.GRD_UPPER_STATUS
        ]
        for (let i = 0;i < _statusTextId.length;i++){
            this.drawText(TextManager.getText(_statusTextId[i]),x,y + _lineHeight * i,120);
            this.drawText(this._actor.param(_statusParamId[i]),x + 80,y + _lineHeight * i,120,"right");
            let upper = this._actor.getStateEffectTotal($gameStateInfo.getStateId(_upperStatusType[i]));
            if (upper != null && upper > 0){
                this.drawText("(+" + upper + "%)",x + 184,y + _lineHeight * i,120,"right");
            }
        }
    }

    updateElementStatus(x,y){
        const _element = $dataSystem.elements;
        const _elementId = [1,2,3,4,5];
        const _elementStatusType = [
            StateType.FIRE_STATUS,StateType.THUNDER_STATUS,StateType.ICE_STATUS,StateType.WHITE_STATUS,StateType.BLACK_STATUS
        ]
        for (let i = 0;i < _elementId.length;i++){
            this.drawText(_element[_elementId[i]],x + 80 * i,y,120);
            this.drawElementStatus(this._actor,_elementStatusType[i],x + 80 * i + 32,y,120);
        }

    }

    drawElementStatus(actor,elementStatusType,x,y){
        const _elementStatus = actor.getStateEffectTotal($gameStateInfo.getStateId(elementStatusType));
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