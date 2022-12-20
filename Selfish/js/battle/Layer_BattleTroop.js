class Layer_BattleTroop extends Sprite{
    constructor(enemies){
        super();
        this._enemySprites = null;
        this._moveTarget = null;
        this._checkAnimation = [];
        this.createEnemies(enemies);
    }

    createEnemies(enemies){
        if (!enemies){
            return;
        }
        let sprites = [];
        for (let i = 0; i < enemies.length; i++) {
            sprites[i] = new Sprite_Enemy(enemies[i]);
        }
        sprites.sort(this.compareEnemySprite.bind(this));
        for (let j = 0; j < sprites.length; j++) {
            this.addChild(sprites[j]);
        }
        this._enemySprites = sprites;
    }

    compareEnemySprite (a, b) {
        if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return b.spriteId - a.spriteId;
        }
    }

    setEnemyClickHandler (handler) {
        this._enemySprites.forEach(sprite => {
            sprite.setEnemyClickHandler(handler);
        });
    }
    
    setEnemyPressHandler (handler) {
        this._enemySprites.forEach(sprite => {
            sprite.setEnemyPressHandler(handler);
        });
    }

    startAnimation(battler,animationId, mirror, delay,scale,nosound,nocheck){
        if (battler.isActor()){
            return;
        }
        if (!battler){
            Debug.log("対象がいない");
            return;
        }
        const target = _.find(this._enemySprites,(a) => a._battler == battler);
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
        if (battler.isActor()){
            return;
        }
        if (!battler){
            Debug.log("対象がいない");
            return;
        }
        const target = _.find(this._enemySprites,(a) => a._battler == battler);
        
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
            return result;
        }
    }

    easeStop(){
        this._enemySprites.forEach(element => {
            element.easeStop();
        });
    }

    performActionStart(battler){
        const sprite = _.find(this._enemySprites,(sprite) => sprite._battler == battler);
        sprite.performActionStart();
    }

    setDamagePopup(target,type,value,length){
        if (target.isActor()){
            return;
        }
        let sprite = _.find(this._enemySprites,(sprite) => sprite._battler == target);
        const damageSprite = sprite.setDamagePopup(type,value,length);
        sprite.addChild(damageSprite);
    }

    startStatePopup(target,type,value){
        if (target.isActor()){
            return;
        }    
        const sprite = _.find(this._enemySprites,(sprite) => sprite._battler == target);
        let stateSprite = sprite.setupStatePopup(type,value);
        sprite.addChild(stateSprite);
    }

    startCounterAnimation(battler){
        if (battler.isActor()){
            return;
        }
        let sprite = _.find(this._enemySprites,(sprite) => sprite._battler == battler);
        const counterSprite = sprite.setCounterPopup();
        sprite.addChild(counterSprite);
    }

    startChainAnimation(battler){
        if (battler.isActor()){
            return;
        }
        let sprite = _.find(this._enemySprites,(sprite) => sprite._battler == battler);
        const chainSprite = sprite.setChainPopup();
        sprite.addChild(chainSprite);
    }

    setSkillAddict(battler){
        const enemies = _.filter($gameTroop.aliveMembers(),(e) => e.isSelected());
        const damageCutId = $gameStateInfo.getStateId(StateType.DAMAGE_CUT);
        const guardId = $gameStateInfo.getStateId(StateType.GUARD);
        const penetrateId = $gameStateInfo.getStateId(StateType.PENETRATE);
                    
        this._enemySprites.forEach(sprite => {
            if (_.contains(enemies,sprite._battler)){
                let action = battler.currentAction();
                if (action.isHpEffect()){
                    let value = action.makeDamageValue(sprite._battler, false,false);
                    let repeats = action.numRepeats();
                    if (repeats > 1){
                        value *= repeats;
                    }
                    
                    let max = value + (action.item().damage.variance * 0.01 * value);
                    let min = value - (action.item().damage.variance * 0.01 * value);

                    const chargeId = $gameStateInfo.getStateId(StateType.CHARGE);
                    if (battler.isStateAffected(chargeId)){
                        max += battler.getStateEffectTotal(chargeId);
                        min += battler.getStateEffectTotal(chargeId);
                    }
                    if (sprite._battler.isStateAffected(damageCutId)){
                        max -= sprite._battler.getStateEffectTotal(damageCutId) * repeats;
                        min -= sprite._battler.getStateEffectTotal(damageCutId) * repeats;
                    }
                    if (sprite._battler.isStateAffected(guardId)){
                        if (!battler.isStateAffected(penetrateId)){
                            //max -= sprite._battler.def * repeats;
                            //min -= sprite._battler.def * repeats;
                        }
                    }
                    if (max < 0){
                        max = 1 * repeats;
                    }
                    if (min < 0){
                        min = 1 * repeats;
                    }
                    sprite.changeHpAddict(max,min);
    
                    const elementValue = action.calcElementRate(sprite._battler);
                    sprite.changeWeakAddict((elementValue > 1));
                }
            } else{
                sprite.stopAddict();
            }
        });
    }

    stopSkillAddict(){
        this._enemySprites.forEach(sprite => {
            sprite.stopAddict();
        });
    }

    resetEnemyOpacity(){
        this._enemySprites.forEach(enemy => {
            if (enemy._battler.isAlive()){
                gsap.killTweensOf(enemy);
                gsap.to(enemy, 0.2, {opacity:255});
            }
            enemy.resetPosition();
        });
    }

    refreshBattleStatus(){
        if (this._enemySprites){
            this._enemySprites.forEach(enemySprite => {
                enemySprite.refreshStatus();
            });
        }
    }

    analyseSelectMove(select){
        let sprite = null;
        this._enemySprites.forEach(enemy => {
            if (select == enemy._battler){
                gsap.to(enemy, 0.2, {x:144,y:360});
                enemy.opacity = 255;
                sprite = enemy;
            } else{
                if (enemy._battler.isAlive()){
                    enemy.opacity = 128;
                }
                enemy.resetPosition();
            }
        });
        if (sprite){
            this.removeChild(sprite);
            this.addChild(sprite);
        }
    }

    substituteMove(battler,target){
        if (battler.isActor() || target.isActor()){
            return;
        }
        this._moveTarget = _.find(this._enemySprites,(e) => e._enemy == battler);
        var realtarget = _.find(this._enemySprites,(e) => e._enemy == target);
        this.removeChild(this._moveTarget);
        this.addChild(this._moveTarget);
        this._moveTarget.x = realtarget.x;
        this._moveTarget.y = realtarget.y + 40;
    }

    substituteMoveReset(){
        if (this._moveTarget){
            this._moveTarget.resetPosition();
            this._moveTarget = null;
        }
    }

    clearAnimation(){
        this._enemySprites.forEach(sprite => {
            if (sprite._animationSprites.length > 0){
                sprite._animationSprites.forEach(element => {
                    element.destroy();
                });
                sprite._animationSprites = [];
            }
        });
    }

    clearStatePopup(){
        this._enemySprites.forEach(sprite => {
            sprite.clearStatePopup(); 
        });
    }

    clearDamagePopup(){
        this._enemySprites.forEach(sprite => {
            sprite.clearDamagePopup(); 
        });
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
        if (target.isActor()){
            return;
        }
        const sprite = _.find(this._enemySprites,(sprite) => sprite._battler == target);
        if (sprite){
            switch (type){
                case 0:
                    sprite.startEffect('collapse');
                    break;
                case 1:
                    //sprite.startEffect('bossCollapse');
                    break;
            }
        }
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
        this._enemySprites.forEach((sprite) => {
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

    terminate(){
        if (this._enemySprites){
            for (let i = this._enemySprites.length-1;i >= 0;i--){
                this._enemySprites[i].terminate();
                this.removeChild(this._enemySprites[i]);
            }
            this._enemySprites = null;
        }
        this.destroy();
    }

    addTroops(troops){
        if (!troops){
            return;
        }
        var sprites = [];
        for (var i = 0; i < troops.length; i++) {
            sprites[i] = new Sprite_Enemy(troops[i]);
        }
        sprites.sort(this.compareEnemySprite.bind(this));
        for (var j = 0; j < sprites.length; j++) {
            this.addChild(sprites[j]);
            this._enemySprites.push(sprites[j]);
            sprites[j].alpha = 0;
            gsap.to(sprites[j],0.5,{alpha:1});
        }
    }

    approacheTroops(troops){
        if (!troops){
            return;
        }
        this._enemySprites.forEach(sprite => {
            troops.forEach(enemy => {
                if (enemy === sprite._battler){
                    gsap.to(sprite,0.25,{alpha:0});
                    gsap.to(sprite,0.25,{y:sprite.y + 100,alpha:1,delay:0.25});
                }
            });
        });
    }

    clear(){
        if (this._enemySprites){
            this._enemySprites.forEach(element => {
                element.terminate();
                this.removeChild(element);
            });
            this._enemySprites = null;
        }
    }
}