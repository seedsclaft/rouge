//=============================================================================
// rpg_sprites.js v1.6.1
//=============================================================================

//-----------------------------------------------------------------------------
// Sprite_Base
//
// The sprite class with a feature which displays animations.

function Sprite_Base() {
    this.initialize.apply(this, arguments);
}
Sprite_Base.prototype = Object.create(Sprite.prototype);
Sprite_Base.prototype.constructor = Sprite_Base;

Sprite_Base.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._animationSprites = [];
    this._effectTarget = this;
    this._hiding = false;
};

Sprite_Base.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updateAnimationSprites();
};

Sprite_Base.prototype.hide = function() {
    this._hiding = true;
    this.updateVisibility();
};

Sprite_Base.prototype.show = function() {
    this._hiding = false;
    this.updateVisibility();
};

Sprite_Base.prototype.updateVisibility = function() {
    this.visible = !this._hiding;
};

Sprite_Base.prototype.updateAnimationSprites = function() {
    if (this._animationSprites.length > 0) {
        let sprites = this._animationSprites.clone();
        this._animationSprites = [];
        for (let i = 0; i < sprites.length; i++) {
            let sprite = sprites[i];
            if (sprite.isPlaying()) {
                this._animationSprites.push(sprite);
            } else {
                sprite.remove();
                sprite.terminate();
            }
        }
    }
};

Sprite_Base.prototype.startAnimation = function(animation, mirror, delay,scale,noSoundFlag) {
    if (noSoundFlag === undefined){
        noSoundFlag = false;
    }
    let sprite = new Sprite_AnimationMV();
    sprite.setup(this._effectTarget, animation, mirror, delay,noSoundFlag);
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
};

Sprite_Base.prototype.isAnimationPlaying = function() {
    return this._animationSprites.length > 0;
};

//-----------------------------------------------------------------------------
// Sprite_StateOverlay
//
// The sprite for displaying an overlay image for a state.

function Sprite_StateOverlay() {
    this.initialize.apply(this, arguments);
}

Sprite_StateOverlay.prototype = Object.create(Sprite_Base.prototype);
Sprite_StateOverlay.prototype.constructor = Sprite_StateOverlay;

Sprite_StateOverlay.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
    this.opacity = 128;
};

Sprite_StateOverlay.prototype.initMembers = function() {
    this._battler = null;
    this._overlayIndex = 0;
    this._overlayIndexList = [];
    this._animationCount = 0;
    this._indexCount = 0;
    this._pattern = 0;
    this._patternCount = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.scale.x = 1.5;
    this.scale.y = 1.5;
};

Sprite_StateOverlay.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem('States');
    this.setFrame(0, 0, 0, 0);
};

Sprite_StateOverlay.prototype.setup = function(battler) {
    this._battler = battler;
};

Sprite_StateOverlay.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_StateOverlay.prototype.animationWait = function() {
    return 8;
};

Sprite_StateOverlay.prototype.updatePattern = function() {
    this._pattern++;
    this._pattern %= 8;
    if (this._battler) {
        this._overlayIndexList = this._battler.stateOverlayIndexList();
        this._overlayIndex = this._overlayIndexList[this._indexCount];
        this._patternCount += 1;
        if (this._patternCount > 16){
            if (this._overlayIndexList.length-1 > this._indexCount){
                this._indexCount += 1;
            } else{            
                this._indexCount = 0;
            }
            this._patternCount = 0;
        }
    }
};

Sprite_StateOverlay.prototype.updateFrame = function() {
    if (this._overlayIndex > 0) {
        const w = 96;
        const h = 96;
        const sx = this._pattern * w;
        const sy = (this._overlayIndex - 1) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

//-----------------------------------------------------------------------------
// Sprite_Timer
//
// The sprite for displaying the timer.

function Sprite_Timer() {
    this.initialize.apply(this, arguments);
}

Sprite_Timer.prototype = Object.create(Sprite.prototype);
Sprite_Timer.prototype.constructor = Sprite_Timer;

Sprite_Timer.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._seconds = 0;
    this.createBitmap();
    this.update();
};

Sprite_Timer.prototype.createBitmap = function() {
    this.bitmap = new Bitmap(96, 48);
    this.bitmap.fontSize = 32;
};

Sprite_Timer.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updatePosition();
    this.updateVisibility();
};

Sprite_Timer.prototype.updateBitmap = function() {
    if (this._seconds !== $gameTimer.seconds()) {
        this._seconds = $gameTimer.seconds();
        this.redraw();
    }
};

Sprite_Timer.prototype.redraw = function() {
    const text = this.timerText();
    const width = this.bitmap.width;
    const height = this.bitmap.height;
    this.bitmap.clear();
    this.bitmap.drawText(text, 0, 0, width, height, 'center');
};

Sprite_Timer.prototype.timerText = function() {
    const min = Math.floor(this._seconds / 60) % 60;
    const sec = this._seconds % 60;
    return min.padZero(2) + ':' + sec.padZero(2);
};

Sprite_Timer.prototype.updatePosition = function() {
    this.x = Graphics.width - this.bitmap.width;
    this.y = 0;
};

Sprite_Timer.prototype.updateVisibility = function() {
    this.visible = $gameTimer.isWorking();
};

//-----------------------------------------------------------------------------
// Sprite_BGAnimSprite
//
// The sprite for displaying a picture.
function Sprite_BGAnimSprite() {
    this.initialize.apply(this, arguments);
}

Sprite_BGAnimSprite.prototype = Object.create(Sprite.prototype);
Sprite_BGAnimSprite.prototype.constructor = Sprite_BGAnimSprite;

Sprite_BGAnimSprite.prototype.initialize = function(fileName,x,y,scaleX,scaleY,opacity) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = ImageManager.loadPicture(fileName);
    this.x = x;
    this.y = y;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.scale.x = scaleX;
    this.scale.y = scaleY;
    this.opacity = opacity;
};


(function() {
    const _initMembers = Sprite_Animation.prototype.initMembers;
    Sprite_Animation.prototype.initMembers = function() {
        _initMembers.call(this);
        this._event = {};
    };
})();


Sprite_Animation.prototype.updateMain = function() {
    this.processSoundTimings();
    this.processFlashTimings();
    this._frameIndex++;
    this.checkEvent();
    this.checkEnd();
};

Sprite_Animation.prototype.processFlashTimings = function() {
};

Sprite_Animation.prototype.checkEnd = function() {
    if (
        this._frameIndex > this._maxTimingFrames &&
        !(this._handle && this._handle.exists)
    ) {
        this._playing = false;
    }
};

Sprite_Animation.prototype.updateFlash = function() {
};

// 指定のフレームタイミングでアクションを起こす
Sprite_Animation.prototype.setFrameIndexEvent = function(frame,event) {
    this._event[frame] = event;
}

Sprite_Animation.prototype.checkEvent = function() {
    if (this._event[this._frameIndex]){
        this._event[this._frameIndex]();
    }
}

Sprite_Animation.prototype.terminate = function() {
    this.destroy();
}

Sprite_Animation.prototype.targetSpritePosition = function(sprite) {
    const point = new Point(0, -sprite.height / 2);
    if (this._animation.alignBottom) {
        point.y = 0;
    }
    point.y = sprite.getCenterY();
    sprite.updateTransform();
    return sprite.worldTransform.apply(point);
};

Spriteset_Base.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.setFrame(0, 0, Graphics.width, Graphics.height);
    this.loadSystemImages();
    this.createLowerLayer();
    this.createUpperLayer();
    this._animationSprites = [];
};

Spriteset_Base.prototype.destroy = function(options) {
    //this.removeAllAnimations();
    Sprite.prototype.destroy.call(this, options);
};

Spriteset_Base.prototype.loadSystemImages = function() {
    //
};

Spriteset_Base.prototype.createLowerLayer = function() {
    this.createBaseSprite();
};

Spriteset_Base.prototype.createUpperLayer = function() {
};

Spriteset_Base.prototype.update = function() {
    Sprite.prototype.update.call(this);
    //this.updateBaseFilters();
    //this.updateOverallFilters();
    this.updatePosition();
    this.updateAnimations();
};

Spriteset_Base.prototype.createBaseSprite = function() {
    this._baseSprite = new Sprite();
    //this._blackScreen = new ScreenSprite();
    //this._blackScreen.opacity = 0;
    this.addChild(this._baseSprite);
    //this._baseSprite.addChild(this._blackScreen);
};

Spriteset_Base.prototype.createBaseFilters = function() {
};

Spriteset_Base.prototype.createPictures = function() {
};

Spriteset_Base.prototype.createTimer = function() {
    this._timerSprite = new Sprite_Timer();
    this.addChild(this._timerSprite);
};

Spriteset_Base.prototype.createOverallFilters = function() {
};

Spriteset_Base.prototype.updateBaseFilters = function() {
};

Spriteset_Base.prototype.updateOverallFilters = function() {
};

Spriteset_Base.prototype.updatePosition = function() {
};

Spriteset_Base.prototype.findTargetSprite = function(/*target*/) {
    return null;
};

Spriteset_Base.prototype.updateAnimations = function() {
    for (const sprite of this._animationSprites) {
        if (!sprite.isPlaying()) {
            this.removeAnimation(sprite);
        }
    }
    this.processAnimationRequests();
};

Spriteset_Base.prototype.removeAnimation = function(sprite) {
    this._animationSprites.remove(sprite);
    this._effectsContainer.removeChild(sprite);
    for (const target of sprite.targetObjects) {
        if (target.endAnimation) {
            target.endAnimation();
        }
    }
    sprite.terminate();
    sprite.destroy();
};

// prettier-ignore
Spriteset_Base.prototype.createAnimationSprite = function(
    targets, animation, mirror, delay
) {
    const mv = this.isMVAnimation(animation);
    const sprite = new (mv ? Sprite_AnimationMV : Sprite_Animation)();
    const targetSprites = this.makeTargetSprites(targets);
    const baseDelay = this.animationBaseDelay();
    const previous = delay > baseDelay ? this.lastAnimationSprite() : null;
    if (this.animationShouldMirror(targets[0])) {
        mirror = !mirror;
    }
    sprite.targetObjects = targets;
    sprite.setup(targetSprites, animation, mirror, delay, previous);
    this._effectsContainer.addChild(sprite);
    //this._animationSprites.push(sprite);
    return sprite;
};

Spriteset_Base.prototype.makeTargetSprites = function(targets) {
    return targets;
};

Spriteset_Base.prototype.terminate = function() {
};

Spriteset_Battle.prototype.loadSystemImages = function() {
    Spriteset_Base.prototype.loadSystemImages.call(this);
};

Spriteset_Battle.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBattleField();
};

Spriteset_Battle.prototype.createBattleField = function() {
    const width = Graphics.boxWidth;
    const height = Graphics.boxHeight;
    const x = (Graphics.width - width) / 2;
    const y = (Graphics.height - height) / 2;
    this._battleField = new Sprite();
    this._battleField.setFrame(0, 0, width, height);
    this._battleField.x = x;
    this._battleField.y = y - this.battleFieldOffsetY();
    this.addChild(this._battleField);
    this._effectsContainer = this._battleField;
};

Spriteset_Battle.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
};

Spriteset_Battle.prototype.battlerSprites = function() {
    return this._battlerSprites;
};

Spriteset_Battle.prototype.setBattlerSprites = function(_battlerSprites) {
    this._battlerSprites = _battlerSprites;
};