//-----------------------------------------------------------------------------
// Sprite_AnimationMV
//
// The sprite for displaying an animation.

function Sprite_AnimationMV() {
    this.initialize.apply(this, arguments);
}

Sprite_AnimationMV.prototype = Object.create(Sprite.prototype);
Sprite_AnimationMV.prototype.constructor = Sprite_AnimationMV;

Sprite_AnimationMV._checker1 = {};
Sprite_AnimationMV._checker2 = {};

Sprite_AnimationMV.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._reduceArtifacts = true;
    this.initMembers();
};

Sprite_AnimationMV.prototype.initMembers = function() {
    this._target = null;
    this._animation = null;
    this._mirror = false;
    this._noSoundFlag = false;
    this._delay = 0;
    this._rate = 4;
    this._duration = 0;
    this._hidingDuration = 0;
    this._bitmap1 = null;
    this._bitmap2 = null;
    this._cellSprites = [];
    this._duplicated = false;
    this.z = 8;
};

Sprite_AnimationMV.prototype.setup = function(target, animation, mirror, delay,noSoundFlag) {
    this._target = target;
    this._animation = animation;
    this._mirror = mirror;
    this._delay = delay;
    this._noSoundFlag = noSoundFlag;
    if (this._animation) {
        this.remove();
        this.setupRate();
        this.setupDuration();
        this.loadBitmaps();
        this.createSprites();
    }
};

Sprite_AnimationMV.prototype.remove = function() {
    if (this.parent && this.parent.removeChild(this)) {
        this._target.setBlendColor([0, 0, 0, 0]);
        this._target.show();
    }
};

Sprite_AnimationMV.prototype.terminate = function() {
    if (this._cellSprites){
        for (let i = this._cellSprites.length-1;i >= 0; i-- ){
            if (this._cellSprites[i]){
                this._cellSprites[i].destroy();
            }
        }
    }
    this._cellSprites = [];
    this._bitmap1 = null;
    this._bitmap2 = null;
    this._target = null;
    this._animation = null;
    this._mirror = null;
    this._delay = null;
    this._noSoundFlag = null;
    //this.destroy();
}

Sprite_AnimationMV.prototype.setupRate = function() {
    this._rate = 4;
};

Sprite_AnimationMV.prototype.setupDuration = function() {
    this._duration = this._animation.frames.length * this._rate + 1;
};

Sprite_AnimationMV.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateMain();
    this.updateHiding();
    Sprite_AnimationMV._checker1 = {};
    Sprite_AnimationMV._checker2 = {};
};

Sprite_AnimationMV.prototype.updateFlash = function() {
};

Sprite_AnimationMV.prototype.updateScreenFlash = function() {
};

Sprite_AnimationMV.prototype.absoluteX = function() {
    let x = 0;
    let object = this;
    while (object) {
        x += object.x;
        object = object.parent;
    }
    return x;
};

Sprite_AnimationMV.prototype.absoluteY = function() {
    let y = 0;
    let object = this;
    while (object) {
        y += object.y;
        object = object.parent;
    }
    return y;
};

Sprite_AnimationMV.prototype.updateHiding = function() {
    if (this._hidingDuration > 0) {
        this._hidingDuration--;
        if (this._hidingDuration === 0) {
            this._target.show();
        }
    }
};

Sprite_AnimationMV.prototype.isPlaying = function() {
    return this._duration > 0;
};

Sprite_AnimationMV.prototype.loadBitmaps = function() {
    const name1 = this._animation.animation1Name;
    const name2 = this._animation.animation2Name;
    this._bitmap1 = ImageManager.loadAnimation(name1);
    this._bitmap2 = ImageManager.loadAnimation(name2);
};

Sprite_AnimationMV.prototype.isReady = function() {
    return this._bitmap1 && this._bitmap1.isReady() && this._bitmap2 && this._bitmap2.isReady();
};

Sprite_AnimationMV.prototype.createSprites = function() {
    if (!Sprite_AnimationMV._checker2[this._animation]) {
        this.createCellSprites();
        if (this._animation.position === 3) {
            Sprite_AnimationMV._checker2[this._animation] = true;
        }
        //this.createScreenFlashSprite();
    }
    if (Sprite_AnimationMV._checker1[this._animation]) {
        this._duplicated = true;
    } else {
        this._duplicated = false;
        if (this._animation.position === 3) {
            Sprite_AnimationMV._checker1[this._animation] = true;
        }
    }
};

Sprite_AnimationMV.prototype.createCellSprites = function() {
    this._cellSprites = [];
    for (let i = 0; i < 16; i++) {
        let sprite = new Sprite();
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        this._cellSprites.push(sprite);
        this.addChild(sprite);
    }
};

Sprite_AnimationMV.prototype.createScreenFlashSprite = function() {
};

Sprite_AnimationMV.prototype.updateMain = function() {
    if (this.isPlaying() && this.isReady()) {
        if (this._delay > 0) {
            this._delay--;
        } else {
            this._duration--;
            this.updatePosition();
            if (this._duration % this._rate === 0) {
                this.updateFrame();
            }
        }
    } else{
        if (this.isReady()){
            this.terminate();
        }
    }
};

Sprite_AnimationMV.prototype.updatePosition = function() {
    if (this._animation.position === 3) {
        this.x = Graphics.width / 2;
        this.y = Graphics.height / 2;
    } else {
        const parent = this._target.parent;
        const grandparent = parent ? parent.parent : null;
        this.x = this._target.x;
        this.y = this._target.y;
        if (this.parent === grandparent) {
            this.x += parent.x;
            this.y += parent.y;
        }
        if (this._animation.position === 0) {
            this.y -= this._target.height;
        } else if (this._animation.position === 1) {
            this.y -= this._target.height / 2;
        }
    }
};

Sprite_AnimationMV.prototype.updateFrame = function() {
    if (this._duration > 0) {
        const frameIndex = this.currentFrameIndex();
        this.updateAllCellSprites(this._animation.frames[frameIndex]);
        this._animation.timings.forEach(function(timing) {
            if (timing.frame === frameIndex) {
                this.processTimingData(timing);
            }
        }, this);
    }
};

Sprite_AnimationMV.prototype.currentFrameIndex = function() {
    return (this._animation.frames.length -
            Math.floor((this._duration + this._rate - 1) / this._rate));
};

Sprite_AnimationMV.prototype.updateAllCellSprites = function(frame) {
    for (let i = 0; i < this._cellSprites.length; i++) {
        const sprite = this._cellSprites[i];
        if (i < frame.length) {
            this.updateCellSprite(sprite, frame[i]);
        } else {
            sprite.visible = false;
        }
    }
};

Sprite_AnimationMV.prototype.updateCellSprite = function(sprite, cell) {
    const pattern = cell[0];
    if (pattern >= 0) {
        const sx = (pattern % 5) * 192;
        const sy = Math.floor((pattern % 100) / 5) * 192;
        const mirror = this._mirror;
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        //sprite.setHue(pattern < 100 ? this._hue1 : this._hue2);
        sprite.setFrame(sx, sy, 192, 192);
        sprite.x = cell[1];
        sprite.y = cell[2];
        sprite.rotation = (cell[4] * Math.PI) / 180;
        sprite.scale.x = cell[3] / 100;

        if (cell[5]) {
            sprite.scale.x *= -1;
        }
        if (mirror) {
            sprite.x *= -1;
            sprite.rotation *= -1;
            sprite.scale.x *= -1;
        }

        sprite.scale.y = cell[3] / 100;
        sprite.opacity = cell[6];
        sprite.blendMode = cell[7];
        sprite.visible = true;
    } else {
        sprite.visible = false;
    }
};

Sprite_AnimationMV.prototype.processTimingData = function(timing) {
    const duration = timing.flashDuration * this._rate;
    switch (timing.flashScope) {
    case 1:
        this.startFlash(timing.flashColor, duration);
        break;
    case 2:
        this.startScreenFlash(timing.flashColor, duration);
        break;
    case 3:
        this.startHiding(duration);
        break;
    }
    if (!this._duplicated && timing.se && !this._noSoundFlag) {
        let soundData = {
            name: timing.se.name,
            volume : timing.se.volume * 0.7,
            pitch : timing.se.pitch,
            pan : timing.se.pan,
        }
        AudioManager.playSe(soundData);
    }
};

Sprite_AnimationMV.prototype.startFlash = function(color, duration) {
};

Sprite_AnimationMV.prototype.startScreenFlash = function(color, duration) {
    if ($dataOption.getUserData("displayEffect") == true){
        EventManager.startFlash(color,duration);
    }
};

Sprite_AnimationMV.prototype.startHiding = function(duration) {
    this._hidingDuration = duration;
    this._target.hide();
};
