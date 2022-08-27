//-----------------------------------------------------------------------------
// Window_BattleResult
//

class Window_BattleResult extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height ));
        this._statusWindow = new Window_StatusSkill(0,-40,640,384);
        this._statusWindow.setNoRemoveNewSkillId();
        this._sprite = new Sprite_EventPicture(null,0,0,1);
        this.addChild(this._sprite);
        this.addChild(this._statusWindow);
        this.deactivate();
        this.hide();
        this.opacity = 0;
        this._downArrowSprite.opacity = 0;
        this._upArrowSprite.opacity = 0;
        this._waitDuration = 0;
        var func = function() {
        };
        this._statusWindow._skillList.onTouchSelect = func;
        this._statusWindow._skillList.processTouchScroll = func;
        this._statusWindow._skillList.updateSmoothScroll = func;
        this._statusWindow._skillList.isTouchScrollEnabled = function() {
            return false;
        };
        
    }

    setResultData(actor,skills,flagList,forceSelectSkillId){
        if (actor.faceName() != this._sprite._pictureLabel){
            const posData = DataManager.getFacePositionData(actor.faceName());
            this._sprite.y = posData.y - 80;
            this._sprite.x = -480;
            gsap.to(this._sprite,0.5,{x:-120});
        }
        
        this.show();
        this._statusWindow.setParameterFlag(flagList);
    
        this._statusWindow.show();
        this._statusWindow.activate();
        this._statusWindow.setData(skills,actor);
        if (forceSelectSkillId){
            this._statusWindow.selectSkill(forceSelectSkillId);
        } else{
            this._statusWindow.selectLast();
        }
        this._statusWindow.showAnimation();
        this._waitDuration = 60;
    }

    setEndCall(endCall){
        this._endCall = endCall;
    }

    update(){
        super.update();
        if (this._waitDuration > 0){
            this._waitDuration -= 1;
            return;
        }
        if (Input.isTriggered("ok") || TouchInput.isReleased()){
            if (this._endCall != null){
                this._endCall();
            }
        }
    }

    terminate(){
        if (this._sprite){
            this._sprite.terminate();
            this.removeChild(this._sprite);
        }
        if (this._statusWindow){
            this._statusWindow.terminate();
            this.removeChild(this._statusWindow);
        }
        this.parent.removeChild(this);
        this.destroy();
    }
}