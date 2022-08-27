//-----------------------------------------------------------------------------
// Spriteset_Stage
//

function Spriteset_Stage() {
    this.initialize.apply(this, arguments);
}

Spriteset_Stage.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Stage.prototype.constructor = Spriteset_Stage;

Spriteset_Stage.prototype.initialize = function() {
    Spriteset_Base.prototype.initialize.call(this);
};

Spriteset_Stage.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createActors();
};

Spriteset_Stage.prototype.createActors = function() {
    this._actorSprites = [];
    for (var i = 0; i < $gameParty.battleMembers().length; i++) {
        this._actorSprites[i] = new Sprite_Actor();
        this.addChild(this._actorSprites[i]);
    }
    this.updateActors()
};

Spriteset_Stage.prototype.updateActors = function() {
    var members = $gameParty.battleMembers();
    for (var i = 0; i < this._actorSprites.length; i++) {
        this._actorSprites[i].setBattler(members[i],true);
    }
};

Spriteset_Stage.prototype.showActorSprites = function() {
    for (var i = 0; i < this._actorSprites.length; i++) {
        this._actorSprites[i].opacity = 255;
    }
};

Spriteset_Stage.prototype.hideActorSprites = function() {
    for (var i = 0; i < this._actorSprites.length; i++) {
        this._actorSprites[i].opacity = 0;
    }
};

Spriteset_Stage.prototype.setDragHandler = function(handler) {
    this._dragHandler = handler;
}

Spriteset_Stage.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateDraging();
}

Spriteset_Stage.prototype.updateDraging = function() {
    if (this._dragHandler == null){
        return;
    }
    // モバイルでは長押し操作時のみ表示
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

Spriteset_Stage.prototype.terminate = function() {
    Spriteset_Base.prototype.terminate.call(this);
    if (this._actorSprites){
        for (let i = this._actorSprites.length-1;i >= 0;i--){
            this._actorSprites[i].terminate();
            this.removeChild(this._actorSprites[i]);
        }
    }
    this._actorSprites = null;
    this.destroy();
};
