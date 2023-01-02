//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.

function Sprite_Battler() {
    this.initialize.apply(this, arguments);
}

Sprite_Battler.prototype = Object.create(Sprite.prototype);
Sprite_Battler.prototype.constructor = Sprite_Battler;

Sprite_Battler.prototype.initialize = function(battler) {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.setBattler(battler);
};

Sprite_Battler.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._battler = null;
    this._popupTexts = [];
    this._damagePopup = [];
    this._homeX = 0;
    this._homeY = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._selectionEffectCount = 0;
    this._animationSprites = [];
};

Sprite_Battler.prototype.setBattler = function(battler) {
    this._battler = battler;
};

Sprite_Battler.prototype.setHome = function(x, y) {
    this._homeX = x;
    this._homeY = y;
    this.updatePosition();
};

Sprite_Battler.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._battler) {
        this.updateMain();
        this.updateAnimation();
        this.updateSelectionEffect();
    } else {
        this.bitmap = null;
    }
};

Sprite_Battler.prototype.updateVisibility = function() {
    Sprite.prototype.updateVisibility.call(this);
    if (!this._battler || !this._battler.isSpriteVisible()) {
        this.visible = false;
    }
};

Sprite_Battler.prototype.updateMain = function() {
    if (this._battler.isSpriteVisible()) {
        this.updateBitmap();
        this.updateFrame();
    }
    this.updatePosition();
};

Sprite_Battler.prototype.updateBitmap = function() {
};

Sprite_Battler.prototype.updateFrame = function() {
};

Sprite_Battler.prototype.updateMove = function() {
};

Sprite_Battler.prototype.updatePosition = function() {
    this.x = this._homeX + this._offsetX;
    this.y = this._homeY + this._offsetY;
};

Sprite_Battler.prototype.updateAnimation = function() {
    this.setupAnimation();
};

Sprite_Battler.prototype.updateSelectionEffect = function() {
    var target = this._effectTarget;
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 30 < 15) {
            target.setBlendColor([255, 255, 255, 64]);
        } else {
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    }
};

Sprite_Battler.prototype.setupAnimation = function() {
    while (this._battler.isAnimationRequested()) {
        var data = this._battler.shiftAnimation();
        var animation = $dataAnimations[data.animationId];
        var mirror = data.mirror;
        var delay = animation.position === 3 ? 0 : data.delay;
        var scale = data && data.scale != 1 ? data.scale : 1;
        this.startAnimation(animation, mirror, delay, scale);
        for (var i = 0; i < this._animationSprites.length; i++) {
            var sprite = this._animationSprites[i];
            sprite.visible = this._battler.isSpriteVisible();
        }
    }
};

//構造変更 type=種類 value=数値
Sprite_Battler.prototype.setDamagePopup = function(type,value,length) {
    if (length === undefined){
        length = 0;
    }
    let sprite = new Sprite_Damage();
    sprite.x = this.damageOffsetX();
    sprite.y = this.damageOffsetY() - ((length%10) * 32);
    sprite.setup(type,value);
    this._damagePopup.push(sprite);
    return sprite;
};

//構造変更 type=種類 value=数値
Sprite_Battler.prototype.setupStatePopup = function(type,value) {
    let sprite = new Sprite_PopupText();
    sprite.x = this.damageOffsetX();
    sprite.y = this.damageOffsetY();
    sprite.setup(type,value,this._popupTexts.length);
    this._popupTexts.push(sprite);
    return sprite;
}

Sprite_Battler.prototype.clearStatePopup = function() {
    let destroySprites = [];
    this._popupTexts.forEach(sprite => {
        sprite.terminate();
        //sprite.destroy();
        destroySprites.push(sprite);
        //sprite = null;
    });
    for (let i = destroySprites.length-1 ;i >= 0 ; i--){
        if (destroySprites[i].parent != null){
            destroySprites[i].parent.removeChild(destroySprites[i]);
            destroySprites[i].destroy();
        }
    }
    this._popupTexts = [];
}

Sprite_Battler.prototype.clearDamagePopup = function() {
    let destroySprites = [];
    this._damagePopup.forEach(sprite => {
        sprite.terminate();
        destroySprites.push(sprite);
        //sprite = null;
    });
    for (let i = destroySprites.length-1 ;i >= 0 ; i--){
        if (destroySprites[i].parent != null){
            destroySprites[i].parent.removeChild(destroySprites[i]);
            destroySprites[i].destroy();
        }
    }
    this._damagePopup = [];
}

Sprite_Battler.prototype.damageOffsetX = function() {
    return 0;
};

Sprite_Battler.prototype.damageOffsetY = function() {
    return 0;
};

Sprite_Battler.prototype.startMove = function(x, y, duration) {
    return;
};

Sprite_Battler.prototype.onMoveEnd = function() {
};

Sprite_Battler.prototype.isEffecting = function() {
    return false;
};

Sprite_Battler.prototype.inHomePosition = function() {
    return this._offsetX === 0 && this._offsetY === 0;
};

Sprite_Battler.prototype.setCounterPopup = function() {
    let sprite = new Sprite_Damage();
    sprite.x = this.damageOffsetX();
    sprite.y = this.damageOffsetY();
    sprite.setCounterPopup();
    this._damagePopup.push(sprite);
    return sprite;
}

Sprite_Battler.prototype.setChainPopup = function() {
    let sprite = new Sprite_Damage();
    sprite.x = this.damageOffsetX();
    sprite.y = this.damageOffsetY();
    sprite.setChainPopup();
    this._damagePopup.push(sprite);
    return sprite;
}


Sprite_Battler.prototype.startAnimation = function(animation, mirror, delay,scale,noSoundFlag) {
    if (noSoundFlag === undefined){
        noSoundFlag = false;
    }
    let sprite = new Sprite_Animation();
    sprite.targetObjects = this._effectTarget;
    sprite.setup([this._effectTarget], animation, mirror, delay,noSoundFlag);
    //0820 VXAce規格に合わせる
    if (scale == null){
        sprite.scale.x = 1.5;
        sprite.scale.y = 1.5;
    } else{ 
        sprite.scale.x = scale;
        sprite.scale.y = scale;
    }
    this.parent.addChild(sprite);
    this._animationSprites.push(sprite);
    return sprite;
}

Sprite_Battler.prototype.getCenterY = function() {
}

//-----------------------------------------------------------------------------
// Sprite_Actor
//
// The sprite for displaying an actor.

function Sprite_Actor() {
    this.initialize.apply(this, arguments);
}

Sprite_Actor.prototype = Object.create(Sprite_Battler.prototype);
Sprite_Actor.prototype.constructor = Sprite_Actor;

Sprite_Actor.MOTIONS = {
    walk:     { index: 0,  loop: true  },
    wait:     { index: 1,  loop: true  },
    chant:    { index: 2,  loop: true  },
    guard:    { index: 3,  loop: true  },
    damage:   { index: 4,  loop: false },
    evade:    { index: 5,  loop: false },
    thrust:   { index: 6,  loop: false },
    swing:    { index: 7,  loop: false },
    missile:  { index: 8,  loop: false },
    skill:    { index: 9,  loop: false },
    spell:    { index: 10, loop: false },
    item:     { index: 11, loop: false },
    escape:   { index: 12, loop: true  },
    victory:  { index: 13, loop: true  },
    dying:    { index: 14, loop: true  },
    abnormal: { index: 15, loop: true  },
    sleep:    { index: 16, loop: true  },
    dead:     { index: 17, loop: true  }
};

Sprite_Actor.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
};

Sprite_Actor.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._battlerName = '';
    this.createBackSprite();
    this.createMainSprite();
    this.createStateSprite();
    
    this.createBattlerStatusSprite();
};

Sprite_Actor.prototype.createBackSprite = function() {
    this._backSprite = new Window_Base(new Rectangle( 0,0,240,80));
    /*
    this._backSprite = new Sprite(new Bitmap(216 + 24,88));
    this._backSprite.x = 0;
    this._backSprite.y = 0;
    this._backSprite.bitmap = ImageManager.loadSystem("roundbutton5");
    */
    //this._backSprite.bitmap.context.setTransform(1,0,-0.25,1,0,0);
    //this._backSprite.bitmap.fillRect(0,-16,216 + 24,96,'black');
    //this._backSprite.bitmap.context.setTransform(1,0,0,1,0,0);
    //this._backSprite.opacity = 64;
    this.addChild(this._backSprite);
};

Sprite_Actor.prototype.createMainSprite = function() {
    this._mainSprite = new Sprite();
    this._mainSprite.anchor.x = 0.5;
    this._mainSprite.anchor.y = 0.5;
    this._mainSprite.y = 0;
    this.addChild(this._mainSprite);
    this._effectTarget = this._mainSprite;
};

Sprite_Actor.prototype.createStateSprite = function() {
    this._stateSprite = new Sprite_StateOverlay();
    this._stateSprite.y = ImageManager.faceHeight / 2 + 16;
    this.addChild(this._stateSprite);
};

Sprite_Actor.prototype.createBattlerStatusSprite = function() {
    this._battlerStatusSprite = new Sprite_BattlerStatus();
    this.addChild(this._battlerStatusSprite);
    this._battlerStatusSprite.x = 88;
    this._battlerStatusSprite.y = 64;
};

Sprite_Actor.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    const changed = (battler !== this._actor);
    if (changed) {
        this._actor = battler;
        if (battler) {
            this.setActorHome(battler.index());
            this.setElementRect();
        }
        this._stateSprite.setup(battler);
        this._battlerStatusSprite.setup(battler);
    }
};

Sprite_Actor.prototype.setActorHome = function(index) {
    this.setHome(784, index * 92 + 40);
};

Sprite_Actor.prototype.setElementRect = function() {
}

Sprite_Actor.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
};

Sprite_Actor.prototype.setupMotion = function() {
};

Sprite_Actor.prototype.startMotion = function() {
};

Sprite_Actor.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    let name = this._actor.faceName();
    if (this._battlerName !== name) {
        this._battlerName = name;
        
        this._mainSprite.bitmap = ImageManager.loadFace(name);
        this._mainSprite.setFrame(48, 96, ImageManager.faceWidth + 122, ImageManager.faceHeight - 10);    
        this._mainSprite.scale.x = 0.5;
        this._mainSprite.scale.y = 0.5;
        this._mainSprite.anchor.y = 1;
        this._mainSprite.x = 74;
        this._mainSprite.y = 74;  
    }
};

Sprite_Actor.prototype.updateFrame = function() {
};

Sprite_Actor.prototype.updateMove = function() {
};

Sprite_Actor.prototype.updateMotion = function() {
};

Sprite_Actor.prototype.updateMotionCount = function() {
};

Sprite_Actor.prototype.motionSpeed = function() {
    return 60;
};

Sprite_Actor.prototype.refreshMotion = function() {
};

Sprite_Actor.prototype.onMoveEnd = function() {
    Sprite_Battler.prototype.onMoveEnd.call(this);
};

Sprite_Actor.prototype.updateSelectionEffect = function() {
    var target = this._effectTarget;
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 60 < 30) {
            target.setBlendColor([255, 255, 255, 64]);
        } else {
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    }
};

Sprite_Actor.prototype.damageOffsetX = function() {
    return 0;
};

Sprite_Actor.prototype.damageOffsetY = function() {
    return 104;
};

Sprite_Actor.prototype.refreshStatus = function() {
    this._battlerStatusSprite.changeHp();
    this._battlerStatusSprite.changeMp();
}

Sprite_Actor.prototype.changeTpEffect = function(isGrow) {
    this._battlerStatusSprite.changeTpEffect(isGrow);
}

Sprite_Actor.prototype.getCenterY = function() {
    if (this._mainSprite){
        return (Graphics.height/2) - this.y;
    }
    return 0;
}

Sprite_Actor.prototype.isBeingTouched = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.hitTest(localPos.x, localPos.y) && touchPos.x != 0 && touchPos.y != 0;
};

Sprite_Actor.prototype.hitTest = function(x, y) {
    let anchorX = 0;
    const anchorY = 0;
    let width = 280;
    let height = 78;
    let rect;
    if ($gameDefine.mobileMode){
        anchorX = 156;
        width = 64;
        height = 48;
        rect = new Rectangle(
            anchorX + width - 40,
            anchorY * height,
            width,
            height
        );
    } else{
        /*
        rect = new Rectangle(
            anchorX * width - 40,
            anchorY * height,
            width,
            height
        );
        */
        anchorX = 156;
        width = 64;
        height = 48;
        rect = new Rectangle(
            anchorX + width - 40,
            anchorY * height,
            width,
            height
        );
    }
    return rect.contains(x, y);
};

Sprite_Actor.prototype.changeFace = function(faceType) {
}

Sprite_Actor.prototype.terminate = function() {
    if (this._animationSprites){
        for (let i = this._animationSprites.length-1; i >= 0; i--){
            this._animationSprites[i].terminate();
            this.removeChild(this._animationSprites[i]);
        }
    }
    if (this._battlerStatusSprite){
        this._battlerStatusSprite.terminate();
        this.removeChild(this._battlerStatusSprite);
    }
    this._battlerStatusSprite = null;
    this._stateSprite = null;
    if (this._backSprite){
        this._backSprite.destroy();
        this.removeChild(this._backSprite);
    }
    this._backSprite = null;
    this._battler = null;
    this._effectTarget = null;
    if (this._mainSprite){
        this._mainSprite.destroy();
        this.removeChild(this._mainSprite);
    }
    this._mainSprite = null;
    this._actor = null;
    this.destroy();
}

//-----------------------------------------------------------------------------
// Sprite_Enemy
//
// The sprite for displaying an enemy.

function Sprite_Enemy() {
    this.initialize.apply(this, arguments);
}

Sprite_Enemy.prototype = Object.create(Sprite_Battler.prototype);
Sprite_Enemy.prototype.constructor = Sprite_Enemy;

Sprite_Enemy.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
    this._button = new Sprite_Button();
    
    this._button.setClickHandler(this.selectButton.bind(this));
    this._button.setPressHandler(this.pressButton.bind(this));
    this.addChild(this._button);
};

Sprite_Enemy.prototype.selectButton = function() {
    if (this._clickHandler){
        this._clickHandler(this._battler);
    }
}

Sprite_Enemy.prototype.pressButton = function() {
    if (this._pressHandler){
        this._pressHandler(this._battler);
    }
}

Sprite_Enemy.prototype.setEnemyClickHandler = function(handler) {
    this._clickHandler = handler;
}

Sprite_Enemy.prototype.setEnemyPressHandler = function(handler) {
    this._pressHandler = handler;
}

Sprite_Enemy.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._enemy = null;
    this._appeared = false;
    this._battlerName = '';
    this._battlerHue = 0;
    this._effectType = null;
    this._effectDuration = 0;
    this._shake = 0;
    
    this._setPosition = false;

    this._targetSprite = null;

    this._setStateOverlay = false;
    this.createTargetSprite();
    this.createMainSprite();
    this.createStateSprite();
};

Sprite_Enemy.prototype.createMainSprite = function() {
    this._mainSprite = new Sprite();
    this._mainSprite.anchor.x = 0.5;
    this._mainSprite.anchor.y = 1;
    this.addChild(this._mainSprite);
    this._effectTarget = this._mainSprite;
};

Sprite_Enemy.prototype.createTargetSprite = function() {
    this._targetSprite = new Sprite_BattleTarget();
    this._targetSprite.anchor.x = 0.5;
    this._targetSprite.anchor.y = 0.5;
    this._targetSprite.y = 16;
    this.addChild(this._targetSprite);
}

Sprite_Enemy.prototype.createBattlerStatusSprite = function() {
};

Sprite_Enemy.prototype.setBattlerStatus = function(battlerStatusSprite) {
    this._battlerStatusSprite = battlerStatusSprite;
};

Sprite_Enemy.prototype.createStateSprite = function() {
    this._stateSprite = new Sprite_StateOverlay();
    this._stateSprite.y = ImageManager.faceHeight / 3;
    this.addChild(this._stateSprite);
};

Sprite_Enemy.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.setHome(battler.screenX(), battler.screenY() + 64);
    this._setPosition = true;
    this._targetSprite.setEnemy(battler);
    let upscale = 1;
    const scale = $dataEnemies[this._enemy.enemyId()].scale;
    if (scale != 1){
        upscale = scale;
    }
    this._mainSprite.scale.x = upscale;
    this._mainSprite.scale.y = upscale;
    this._stateSprite.setup(battler);
};

Sprite_Enemy.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
    if (this._enemy) {
        this.updateEffect();
        this.updateStateSprite();
    }
};

Sprite_Enemy.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._enemy.battlerName();
    var hue = this._enemy.battlerHue();
    if (this._battlerName !== name || this._battlerHue !== hue) {
        this._battlerName = name;
        this._battlerHue = hue;
        this.loadBitmap(name, hue);
        this.initVisibility();
    }
    if (this._button.y == 0 && this._mainSprite.bitmap && this._mainSprite.bitmap.height != 0){
        this._button.y -= this._mainSprite.bitmap.height;
        this._button.x -= this._mainSprite.bitmap.width / 2;
        this._button.opacity = 0;
    }
};

Sprite_Enemy.prototype.loadBitmap = function(name, hue) {
    this._mainSprite.bitmap = ImageManager.loadEnemy(name, hue);
    this._battlerHue = hue;
    this._mainSprite.setHue(hue);

    this._button.bitmap = this._mainSprite.bitmap;
    this.anchor.y = 1;
    const margin = 344;
    if (this._button.width > margin){
        const marzinX = (this._button.width - margin) / 2;
        this._button.width = margin;
        this._button.x += marzinX;
    }
    if (!$gameDefine.mobileMode){
        gsap.to(this._mainSprite, 4, {pixi:{scaleX:this._mainSprite.scale.x+0.01},y:this._mainSprite.y,repeat:-1,yoyo:true,ease: Circ.easeInOut, });
        gsap.to(this._mainSprite, 16, {pixi:{scaleY:this._mainSprite.scale.y+0.1},y:this._mainSprite.y,repeat:-1,yoyo:true,ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 1, points: 20, taper: "none", randomize: true, clamp: false}), });
    }
};

Sprite_Enemy.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    let frameHeight = this._mainSprite.bitmap.height;
    if (this._effectType === 'bossCollapse') {
        frameHeight = this._effectDuration;
    }
    this.setFrame(0, 0, this._mainSprite.bitmap.width, frameHeight);
};

Sprite_Enemy.prototype.updatePosition = function() {
    if (this._setPosition == true){
        return;
    }
    Sprite_Battler.prototype.updatePosition.call(this);
};

Sprite_Enemy.prototype.updateStateSprite = function() {
    if (this._enemy == null) return;
    if (this._mainSprite && this._mainSprite.width == 0) return;
    if (this._setStateOverlay == true) return;
    const masterEnemy = $dataEnemies[this._enemy.enemyId()];
    if (this._mainSprite.width != 0 && this._mainSprite.height != 0){
            let scale = masterEnemy.scale != null ? masterEnemy.scale : 1;
            const marginX = (48 - this._mainSprite.width / 2) * scale;
            this._stateSprite.x += marginX;
            const marginY = (72 - this._mainSprite.height) * scale;
            this._stateSprite.y += marginY;
            this._setStateOverlay = true;
    }
};

Sprite_Enemy.prototype.initVisibility = function() {
    this._appeared = this._enemy.isAlive();
    if (!this._appeared) {
        this.opacity = 0;
    }
};

Sprite_Enemy.prototype.setupEffect = function() {
    if (this._appeared && this._enemy.isEffectRequested()) {
        this.startEffect(this._enemy.effectType());
        this._enemy.clearEffect();
    }
    if (!this._appeared && this._enemy.isAlive()) {
        this.startEffect('appear');
    } else if (this._appeared && this._enemy.isHidden()) {
        this.startEffect('disappear');
    }
};

Sprite_Enemy.prototype.startEffect = function(effectType) {
    this._effectType = effectType;
    switch (this._effectType) {
    case 'appear':
        this.startAppear();
        break;
    case 'disappear':
        this.startDisappear();
        break;
    case 'whiten':
        this.startWhiten();
        break;
    case 'blink':
        this.startBlink();
        break;
    case 'collapse':
        this.startCollapse();
        break;
    case 'bossCollapse':
        this.startBossCollapse();
        break;
    case 'instantCollapse':
        this.startInstantCollapse();
        break;
    }
    this.revertToNormal();
};

Sprite_Enemy.prototype.startAppear = function() {
    this._effectDuration = 16;
    this._appeared = true;
};

Sprite_Enemy.prototype.startDisappear = function() {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_Enemy.prototype.startWhiten = function() {
    this._effectDuration = 16;
    /*
    gsap.to(this,0.15,{y:this.y - 16});
    gsap.to(this,0.3,{y:this.y + 32,ease: Elastic.easeOut.config(1, 0.3),delay:0.15});
    gsap.to(this,0.4,{y:this.y ,delay:0.5});
    */
};

Sprite_Enemy.prototype.performActionStart = function() {
    this._effectDuration = 16;
    const homeY = 0;
    let t1 = new TimelineMax();
    t1.to(this._mainSprite,0.15,{y : homeY - 16 })
    .to(this._mainSprite,0.3,{y:homeY + 32 ,ease :Elastic.easeOut.config(1, 0.3) })
    .to(this._mainSprite,{y:homeY ,ease :Elastic.easeOut.config(1, 0.3) })
};

Sprite_Enemy.prototype.startBlink = function() {
    this._effectDuration = 20;
};

Sprite_Enemy.prototype.startCollapse = function() {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_Enemy.prototype.startBossCollapse = function() {
    this._effectDuration = 120;//this._mainSprite.bitmap.height;
    this._appeared = false;
};

Sprite_Enemy.prototype.startInstantCollapse = function() {
    this._effectDuration = 16;
    this._appeared = false;
};

Sprite_Enemy.prototype.updateEffect = function() {
    this.setupEffect();
    if (this._effectDuration > 0) {
        this._effectDuration--;
        switch (this._effectType) {
        case 'whiten':
            this.updateWhiten();
            break;
        case 'blink':
            this.updateBlink();
            break;
        case 'appear':
            this.updateAppear();
            break;
        case 'disappear':
            this.updateDisappear();
            break;
        case 'collapse':
            this.updateCollapse();
            break;
        case 'bossCollapse':
            this.updateBossCollapse();
            break;
        case 'instantCollapse':
            this.updateInstantCollapse();
            break;
        }
        if (this._effectDuration === 0) {
            this._effectType = null;
        }
    }
};

Sprite_Enemy.prototype.isEffecting = function() {
    return this._effectType !== null;
};

Sprite_Enemy.prototype.revertToNormal = function() {
    this._shake = 0;
    this.blendMode = 0;
    this.opacity = 255;
    this.setBlendColor([0, 0, 0, 0]);
};

Sprite_Enemy.prototype.updateWhiten = function() {
    if (Utils.isMobileDevice()) {
        var alpha = 128 - Math.ceil((16 - this._effectDuration) / 4) * 40;
    } else{
        var alpha = 128 - (16 - this._effectDuration) * 10;
    }
    this._mainSprite.setBlendColor([255, 255, 255, alpha]);
};

Sprite_Enemy.prototype.updateBlink = function() {
    this._mainSprite.opacity = (this._effectDuration % 10 < 5) ? 255 : 0;
};

Sprite_Enemy.prototype.updateAppear = function() {
    this._mainSprite.opacity = (16 - this._effectDuration) * 16;
};

Sprite_Enemy.prototype.updateDisappear = function() {
    this.opacity = 256 - (32 - this._effectDuration) * 10;
};

Sprite_Enemy.prototype.updateCollapse = function() {
    this.blendMode = PIXI.BLEND_MODES.ADD;// Graphics.BLEND_ADD;
    this._mainSprite.opacity *= this._effectDuration / (this._effectDuration + 1);
};

Sprite_Enemy.prototype.updateBossCollapse = function() {
    if (this._effectDuration % 20 === 19) {
        SoundManager.playBossCollapse2();
    }
};

Sprite_Enemy.prototype.updateInstantCollapse = function() {
    this.opacity = 0;
};

Sprite_Enemy.prototype.damageOffsetX = function() {
    return 0;
};

Sprite_Enemy.prototype.damageOffsetY = function() {
    return 8;
};

Sprite_Enemy.prototype.refreshStatus = function() {
    this._battlerStatusSprite.changeHp();
    //this._battlerStatusSprite.changeMp();
}

Sprite_Enemy.prototype.resetPosition = function(line) {
    this.x = this._homeX + this._offsetX;
    this.y = this._homeY + this._offsetY;
    if (line != null){
        this.y += line * -80;
        this.scale.x = this.scale.y = 1.0 - line * 0.15;
        if (line > 0 && this._homeX > 480){
            this.x -= (this._homeX-480) * line * 0.2;
        } else{
            this.x += (480-this._homeX) * line * 0.2;
        }
    }
}

Sprite_Enemy.prototype.stopAddict = function() {
    this._battlerStatusSprite.stopAddict();
}

Sprite_Enemy.prototype.changeHpAddict = function(max,min) {
    this._battlerStatusSprite.changeHpAddict(max,min);
}

Sprite_Enemy.prototype.changeWeakAddict = function(weak) {
    this._battlerStatusSprite.changeWeakAddict(weak);
}

Sprite_Enemy.prototype.isBeingTouched = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.hitTest(localPos.x, localPos.y) && touchPos.x != 0 && touchPos.y != 0;
};

Sprite_Enemy.prototype.hitTest = function(x, y) {
    let anchorX = -0.5;
    const anchorY = -1;
    let width = this._mainSprite.width;
    let height = this._mainSprite.height;
    let rect;
    if ($gameDefine.mobileMode){
        rect = new Rectangle(
            64,
            -48,
            64,
            48
        );
    } else{
        /*
        rect = new Rectangle(
            anchorX * width,
            anchorY * height,
            width,
            height
        );
        */
        rect = new Rectangle(
            64,
            -48,
            64,
            48
        );
    }
    return rect.contains(x, y);
};

Sprite_Enemy.prototype.terminate = function() {
    if (this._animationSprites){
        for (let i = this._animationSprites.length-1;i >= 0; i--){
            this._animationSprites[i].terminate();
        }
        this._animationSprites = null;
    }
    if (this._battlerStatusSprite){
        this._battlerStatusSprite.terminate();
    }
    this._battlerStatusSprite = null;
    if (this._targetSprite){
        this._targetSprite.destroy();
    }
    this._targetSprite = null;
    this._enemy = null;
    this._battler = null;
    this._effectTarget = null;
    if (this._mainSprite){
        this._mainSprite.destroy();
    }
    this._mainSprite = null;
    this._targetSprite = null;
    this._stateSprite = null;
    if (this._button){
        this._button.destroy();
    }
    this._button = null;
    //this.destroy();
}

Sprite_Enemy.prototype.getCenterY = function() {
    if (this._mainSprite){
        // 0が中央
        return -(Graphics.height/2) - 48 + this._battler.screenY() - this._mainSprite.height / 2;
        //return (Graphics.height/2) - this.y + (this._mainSprite.height / 2);//頭上
        return -(Graphics.height/2) + this.y - this._mainSprite.height / 2;//中央
        //return (Graphics.height/2) - this.y - (this._mainSprite.height / 2);//足元
    }
    return 0;
}
