//-----------------------------------------------------------------------------
// Window_MenuActorStatus
//

class Window_MenuActorStatus extends Window_Selectable{
    constructor(x, y, width , height){
        super(new Rectangle( x,y ,width , height));
        this.deactivate();
        this._pendingIndex = -1;
        this._selectionEffectCount = 0;
        this.createActor();
        this.createStatus();
        this._animation = [];
    
        this.opacity = 0;
        this._cursorSprite.opacity = 0;
    }

    spacingBase(){
        return 240;
    }

    offsetRightX(){
        return 296;
    }

    createActor(){
        this._actorSprites = [];
        this._actorStatusSprites = [];
        $gameParty.allMembers().forEach((actor,index) => {
            let sprite = new Sprite_EventPicture();
            sprite.setup(actor.faceName());
            sprite.setAnimation('wait',true);
            if (index < 3){
                sprite.x = this._actorSprites.length * this.spacingBase() + this.offsetRightX();
            } else{
                sprite.x = this._actorSprites.length * this.spacingBase() + this.offsetRightX() * 2;
            }
            this._actorSprites.push(sprite);
            this.addChild(sprite);
            sprite.scale.x = sprite.scale.y = 0.9;
            sprite.y -= 120;
        });
    }

    createStatus(){
        this._actorStatusSprites = [];
        $gameParty.allMembers().forEach(actor => {
            actor.setHp(1);
        });
        $gameParty.allMembers().forEach((actor,index) => {
            var status = new Sprite_MenuStatus();
            status.setup(actor);
            if (index < 3){
                status.x = this._actorStatusSprites.length * this.spacingBase() + this.offsetRightX() - 160;
            } else{
                status.x = this._actorStatusSprites.length * this.spacingBase() + this.offsetRightX() * 2 - 160;
            }
            status.y = 320;
            this._actorStatusSprites.push(status);
            this.addChild(status);
        });
        $gameParty.allMembers().forEach(actor => {
            actor.setHp(actor.mhp);
        });
        this._actorStatusSprites.forEach(status => {
            status.changeHp();
        });
    }

    showAllMembers(){
        this.resetAnim();
        this._actorSprites.forEach((sprite,index) => {
            gsap.to(sprite, 0.25, {x:this.positionX(index)});
            gsap.to(this._actorStatusSprites[index], 0.25, {x:this.positionX(index) - 168});
        });
    }

    showBattleMembers(){
        this.resetAnim();
        this._actorSprites.forEach((sprite,index) => {
            if (index < 3){
                gsap.to(sprite, 0.25, {x:index * this.spacingBase() + this.offsetRightX(),});
                gsap.to(this._actorStatusSprites[index], 0.25, {x:index * this.spacingBase() + this.offsetRightX() - 160,});
            } else{
                gsap.to(sprite, 0.25, {x:index * this.spacingBase() + this.offsetRightX() * 2,});
                gsap.to(this._actorStatusSprites[index], 0.25, {x:index * this.spacingBase() + this.offsetRightX() * 2 - 160,});
            
            }
        });
    }

    positionX(index){
        return (976/$gameParty.allMembers().length) * index + 36 + (5 - $gameParty.allMembers().length) * 16;
    }

    selectPersonal(selectIndex){
        this._actorSprites.forEach((sprite,index) => {
            if (index == selectIndex){
                gsap.to(sprite, 0.25, {x:160});
                gsap.to(this._actorStatusSprites[index], 0.25, {x:-24});
            } else{
                gsap.to(sprite, 0.25, {x:Graphics.boxWidth + 320});
                gsap.to(this._actorStatusSprites[index], 0.25, {x:Graphics.boxWidth,});

            }
        });
    }

    swapFormationActor(index){
        this.resetAnim();
        var pending = this._actorSprites[this._pendingIndex];
        var swap = this._actorSprites[index];
        gsap.to(pending, 0.25, {x:swap.x});
        gsap.to(swap, 0.25, {x:pending.x});
        
        var pending2 = this._actorStatusSprites[this._pendingIndex];
        var swap2 = this._actorStatusSprites[index];
    
        gsap.to(pending2, 0.25, {x:swap2.x});
        gsap.to(swap2, 0.25, {x:pending2.x});
        
        var list = [];
        this._actorSprites.forEach((sprite,idx) => {
            var j = idx;
            if (this._pendingIndex == idx){
                j = index;
            } else
            if (index == idx){
                j = this._pendingIndex;
            }
            list.push({index: j , sprite : sprite, status : this._actorStatusSprites[idx]});
        });
        list = _.sortBy(list,(l) => l.index);
    
        this._actorSprites = [];
        this._actorStatusSprites = [];
        list.forEach(element => {
            this._actorSprites.push(element.sprite);
            this._actorStatusSprites.push(element.status);
        });
        this.cancelFormationActor();
    }

    cancelFormationActor(){
        this._actorSprites.forEach(sprite => {
            sprite.setSelected(false);
        });
    }

    refreshStatus(){
        this._actorStatusSprites.forEach(sprite => {
            sprite.changeHp();
            sprite.changeMp();
        });
    }

    maxItems(){
        return $gameParty.allMembers().length;
    }

    maxCols(){
        return this.maxItems();
    }

    itemHeight(){
        return 296;
    }

    isCurrentItemEnabled(){
        const actor = $gameParty.allMembers()[this.index()];
        return actor && actor.isFormationChangeOk();
    }

    selectLast(){
        this.select($gameParty.menuActor().index() || 0);
    }

    pendingIndex(){
        return this._pendingIndex;
    }

    setPendingIndex(index){
        const lastPendingIndex = this._pendingIndex;
        this._pendingIndex = index;
        this.redrawItem(this._pendingIndex);
        this.redrawItem(lastPendingIndex);
        if (index >= 0){
            this._actorSprites[index].setSelected(true);
        }
    }

    update(){
        super.update();
        this.updateSelecting();
        this.updateDraging();
    }

    updateSelecting(){
        this._selectionEffectCount += 1;
        this._actorSprites.forEach((sprite,index) => {
            sprite.setSelecting(index == this.index() && this._selectionEffectCount % 60 < 30);
        });
    }

    updateDraging(){
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
        this._actorStatusSprites.forEach((sprite) => {
            if (sprite.isBeingTouched()){
                isDrag = true;
                this._dragHandler(sprite);
            }
        });
        if (isDrag == false){
            this._dragHandler(null);
        }
    }

    changeSelecting(){
        this._selectionEffectCount = 0;
        this._actorSprites.forEach((sprite,idx) => {
        });
        if (this._actorSprites && this.index() > -1){
        }
    }

    updateCursor(){

    }

    resetAnim(){
        this._animation.forEach(anim => {
            anim.seek(anim.endTime());
        });
        gsap.killTweensOf(this);
    }

    swipChara(moveX){
        if (moveX != 0){
            this._movedX = moveX;
            this._actorSprites.forEach((sprite,index) => {
                if (index == $gameParty.menuActor().selectIndex()){
                    sprite.x = 160 + moveX;
                }
            });
        }
    }

    swipReset(){
        this._movedX = 0;
    }

    swipEndChara(){
        if (this._movedX != 0){
            this._actorSprites.forEach((sprite,index) => {
                if (index == $gameParty.menuActor().index()){
                    gsap.to(sprite,0.25,{x : 160});
                }
            });
        }
    }

    setDragHandler(handler){
        this._dragHandler = handler;
    }

    _updateCursor(){

    }

    terminate(){
        for (let i = this._actorSprites.length-1;i >= 0;i--){
            this._actorSprites[i].terminate();
            this.removeChild(this._actorSprites[i]);
        }
        this._actorSprites = null;
        for (let i = this._actorStatusSprites.length-1;i >= 0;i--){
            gsap.killTweensOf(this._actorStatusSprites[i]);
            this._actorStatusSprites[i].terminate();
            this.removeChild(this._actorStatusSprites[i]);
        }
        this._actorStatusSprites = null;
        this.destroy();
    }
}