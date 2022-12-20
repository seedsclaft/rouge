class Layer_BattleParty extends Sprite {
    constructor(members){
        super();
        this._actorSprites = [];
        this._checkAnimation = [];
        this._mpAnimation = [];
        this.createActors(members);
    }

    createActors(members){
        members.forEach(actor => {
            let sprite = new Sprite_Actor();
            sprite.setBattler(actor,true);
            this.addChild(sprite);
            this._actorSprites.push(sprite);
        });
    }

    refreshBattleStatus(){
        if (this._actorSprites){
            this._actorSprites.forEach(actorSprite => {
                actorSprite.refreshStatus();
            });
        }
    }

    changeTpEffect(actors){
        if (this._actorSprites){
            this._actorSprites.forEach(actorSprite => {
                actorSprite.changeTpEffect(_.find(actors,(a) => a == actorSprite._battler));
            });
        }
    }

    startMpAnimation(battler,mpNumber){
    }

    setDamagePopup(target,type,value,length){
        if (!target.isActor()){
            return;
        }
        let sprite = _.find(this._actorSprites,(sprite) => sprite._battler == target);
        const damageSprite = sprite.setDamagePopup(type,value,length);
        sprite.addChild(damageSprite);
    }

    startStatePopup(target,type,value){
        if (!target.isActor()){
            return;
        }    
        let sprite = _.find(this._actorSprites,(sprite) => sprite._battler == target);
        let stateSprite = sprite.setupStatePopup(type,value);
        sprite.addChild(stateSprite);
    }

    startCounterAnimation(battler){
        if (!battler.isActor()){
            return;
        }
        let sprite = _.find(this._actorSprites,(sprite) => sprite._battler == battler);
        const counterSprite = sprite.setCounterPopup();
        sprite.addChild(counterSprite);
    }

    startChainAnimation(battler){
        if (!battler.isActor()){
            return;
        }
        let sprite = _.find(this._actorSprites,(sprite) => sprite._battler == battler);
        const chainSprite = sprite.setChainPopup();
        sprite.addChild(chainSprite);
    }

    startAnimation(battler,animationId, mirror, delay,scale,nosound,nocheck){
        if (!battler.isActor()){
            return;
        }
        if (!battler){
            Debug.log("対象がいない");
            return;
        }
        const target = _.find(this._actorSprites,(a) => a._battler == battler);
        if (target){
            const animation = $dataAnimations[animationId];
            delay = animation.position === 3 ? 0 : delay;
            scale = scale != 1 ? scale : 1;
            const result = target.startAnimation(animation, mirror, delay,scale,nosound);
            if (nocheck){
                return;
            }
            if (!this._checkAnimation){
                this._checkAnimation = [];
            }
            this._checkAnimation.push(result);
        }
    }

    startAnimationEffect(baseSprite,battler,animationId, mirror, delay,scale,nosound,nocheck){
        if (!battler.isActor()){
            return;
        }
        if (!battler){
            Debug.log("対象がいない");
            return;
        }
        let target = _.find(this._actorSprites,(a) => a._battler == battler);
        target._anchor.y = 0;
        if (target){
            const animation = $dataAnimations[animationId];
            delay = animation.position === 3 ? 0 : delay;
            scale = scale != 1 ? scale : 1;
            const result = baseSprite.createAnimationSprite([target],animation,mirror);
            
            if (nocheck){
                return;
            }
            if (!this._checkAnimation){
                this._checkAnimation = [];
            }
            this._checkAnimation.push(result);
        }
    }

    clearAnimation(){
        this._actorSprites.forEach(sprite => {
            if (sprite._animationSprites.length > 0){
                sprite._animationSprites.forEach(element => {
                    element.destroy();
                });
                sprite._animationSprites = [];
            }
        });
    }

    clearStatePopup(){
        this._actorSprites.forEach(sprite => {
            sprite.clearStatePopup(); 
        });
    }

    clearDamagePopup(){
        this._actorSprites.forEach(sprite => {
            sprite.clearDamagePopup(); 
        });
    }

    clearMpAnimation(){
        this._mpAnimation.forEach(sprite => {
            if (sprite){
                this.removeChild(sprite);
            }
        });
        this._mpAnimation = [];
    }

    isAnimationPlaying(){
        if (_.find(this._checkAnimation,(anim) => anim.isPlaying())){
            return true;
        }
        return false;
    }

    clearPlaying(){
        let destroyAnimations = [];
        this._checkAnimation.forEach(animation => {
            animation.terminate();
            destroyAnimations.push(animation);
        });
        for (let i = destroyAnimations.length-1;i >= 0;i--){
            if (destroyAnimations[i].parent != null){
                destroyAnimations[i].parent.removeChild(destroyAnimations[i]);
                destroyAnimations[i].destroy();
            }
        }
        this._checkAnimation = [];
    }

    performCollapse(target,type){
        if (!target.isActor()){
            return;
        }
        /*
        const sprite = _.find(this._actorSprites,(sprite) => sprite._battler == target);
        if (sprite){
            sprite.startEffect('collapse');
        }
        */
    }

    setDragHandler(handler){
        this._dragHandler = handler;
    }

    updateDraging () {
        if (this._dragHandler == null){
            return;
        }
        // モバイルでは敵の長押し操作を無効化。長押しで特徴を表示
        //if ($gameDefine.mobileMode){
            if (TouchInput.isPressed() == false){
                this._dragHandler(null);
                return;
            }
        //}
        let isDrag = false;
        this._actorSprites.forEach((sprite) => {
            if (sprite.isBeingTouched()){
                isDrag = true;
                this._dragHandler(sprite);
            }
        });
        if (isDrag == false){
            this._dragHandler(null);
        }
    }

    update(){ 
        super.update();
        this.updateDraging();
    }

    changeFace(battler,faceType){
        let sprite = _.find(this._actorSprites,(actorSprite) => actorSprite._battler == battler);
        if (sprite != null){
            sprite.changeFace(faceType);
        }
    }

    changeFaceAll(faceType){
        this._actorSprites.forEach(sprite => {
            sprite.changeFace(faceType);
        });
    }
    
    terminate(){
        for (let i = this._mpAnimation.length-1;i >= 0;i--){
            this._mpAnimation[i].terminate();
            this.removeChild(this._mpAnimation[i]);
        }
        this._mpAnimation = [];
        for (let i = this._actorSprites.length-1;i >= 0;i--){
            this._actorSprites[i].terminate();
            this.removeChild(this._actorSprites[i]);
        }
        this._actorSprites = [];
        this.destroy();
    }
}