//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

function Sprite_Damage() {
    this.initialize.apply(this, arguments);
}

Sprite_Damage.prototype = Object.create(Sprite.prototype);
Sprite_Damage.prototype.constructor = Sprite_Damage;

Sprite_Damage.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._damageBitmap = ImageManager.loadSystem('Damage');
};

Sprite_Damage.prototype.reset = function() {
    this.children = [];
    this.opacity = 255;
}

Sprite_Damage.prototype.setup = function(type,value) {
    switch (type){
        case 'hpDamage':
        this.createDigits(2, value);
        return
        case 'hpDamageWeak':
        this.createDigits(0, value);
        return
        case 'hpHeal':
        this.createDigitsHeal(1, value);
        return
        case 'mpHeal':
        this.createDigitsHeal(3, value);
        return
        case 'missed':
        this.createMiss();
        return
        case 'invisible':
        case 'damageBlock':
        case 'vantageBlock':
        this.createInvisible();
        return
    }
};

Sprite_Damage.prototype.digitWidth = function() {
    return this._damageBitmap ? this._damageBitmap.width / 10 : 0;
};

Sprite_Damage.prototype.digitHeight = function() {
    return this._damageBitmap ? this._damageBitmap.height / 8 : 0;
};

Sprite_Damage.prototype.createMiss = function() {
    var w = this.digitWidth();
    var h = this.digitHeight();
    var sprite = this.createChildSprite();
    sprite.setFrame(0, 4 * h, 10 * w, h);
    sprite.dy = 0;	
    sprite.x = (3 * w) / 2 + 8;
    sprite.y = -13;
    sprite.scale.x = sprite.scale.y = 0.5
    this.setZoomEffectHeal(sprite);
};

Sprite_Damage.prototype.createInvisible = function() {
    var sprite = new Sprite();
    this.setBaseData(sprite);
    var bitmap      = new Bitmap(240, 40);
    bitmap.fontSize = 20;
    bitmap.textColor = '#ffffff';
    bitmap.drawText(TextManager.getStateName($gameStateInfo.getStateId( StateType.INVISIBLE )), 0, 0, bitmap.width, bitmap.height, 'center',true);
    sprite.bitmap = bitmap;
    sprite.dy = 0;	
    sprite.scale.x = sprite.scale.y = 1.0;
    this.setZoomEffect(sprite);
};

Sprite_Damage.prototype.setCounterPopup = function() {
    var w = this.digitWidth();
    var h = this.digitHeight();
    var sprite = this.createChildSprite();
    sprite.setFrame(0, 6 * h, 10 * w, h);
    sprite.x = 48;
    sprite.y = -56;
    this.setZoomEffectHeal(sprite);
}

Sprite_Damage.prototype.setChainPopup = function() {
    var sprite = new Sprite();
    this.setBaseData(sprite);
    var bitmap      = new Bitmap(240, 40);
    bitmap.fontSize = 24;
    bitmap.textColor = $gameColor.getColor("chain");
    bitmap.drawText(TextManager.getText(611900), 0, 0, bitmap.width, bitmap.height, 'center',true);
    sprite.bitmap = bitmap;
    sprite.dy = 0;	
    sprite.scale.x = sprite.scale.y = 1.0;
    sprite.y = -72;
    this.setZoomEffectHeal(sprite);
}

Sprite_Damage.prototype.createDigits = function(baseRow, value,delay) {
    var string = Math.abs(value).toString();
    var row = baseRow;
    var w = this.digitWidth();
    var h = this.digitHeight();
    var index = 0;
    for (var i = string.length-1; i >= 0; i--) {
        var sprite = this.createChildSprite();
        var n = Number(string[i]);
        sprite.setFrame(n * w, row * h, w, h);
        sprite.x = (i - (string.length - 1) / 2) * w / 2;		 
        sprite.dy = -i;
        this.setZoomEffect(sprite,string.length * 2,index);
        index += 1;
        if (delay > 0){
            sprite.zt += delay * 5;
        }
    };
};

Sprite_Damage.prototype.createDigitsHeal = function(baseRow, value,delay) {
    var string = Math.abs(value).toString();
    var row = baseRow;
    var w = this.digitWidth();
    var h = this.digitHeight();
    for (var i = string.length-1; i >= 0; i--) {
        var sprite = this.createChildSprite();
        var n = Number(string[i]);
        sprite.setFrame(n * w, row * h, w, h);
        sprite.x = (i - (string.length - 1) / 2) * w / 2;		 
        sprite.dy = -i;
        this.setZoomEffectHeal(sprite);
        if (delay > 0){
            sprite.zt += delay * 5;
        }
    };
};

Sprite_Damage.prototype.createChildSprite = function() {
    var sprite = new Sprite();
    sprite.bitmap = this._damageBitmap;
    this.setBaseData(sprite);
	return sprite;
};

Sprite_Damage.prototype.setBaseData = function(sprite) {
	sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.scale.x = 0.5;
    sprite.scale.y = 0.5;
    sprite.opacity = 0;
    sprite.y = -40;	
	sprite.zt = 0;
    sprite.ry = sprite.y;
	sprite.yf = 0;
	sprite.yf2 = 0;
	sprite.yf3 = 0;
	sprite.ex = false;
    this.addChild(sprite);
};

Sprite_Damage.prototype.setZoomEffect = function(sprite,d,i) {
	   if (!d) {d = 0};
       if (!i) {i = 0};
       var delay = i * 0.05;
       gsap.to(sprite,0.1,{opacity:255,delay:0.00 + delay});
       gsap.to(sprite,0.2,{opacity:0,delay:0.8});
       gsap.to(sprite,0.1,{y:sprite.y - 16,delay:delay,ease: Power2.easeInOut},);
       gsap.to(sprite,0.2,{y:sprite.y,delay:0.1 + delay,ease: Power2.easeInOut});
       gsap.to(sprite,0.05,{y:sprite.y - 4,delay:0.25 + delay,ease: Power2.easeInOut},);
       gsap.to(sprite,0.05,{y:sprite.y,delay:0.3 + delay,ease: Power2.easeInOut});
};

Sprite_Damage.prototype.setZoomEffectHeal = function(sprite) {
    gsap.to(sprite,0.1,{opacity:255,delay:0.00});
    gsap.to(sprite,0.1,{opacity:0,delay:0.9});
    gsap.to(sprite,1,{y:sprite.y - 24});
}

Sprite_Damage.prototype.terminate = function() {
    for (let i = this.children.length-1; i >= 0; i--){
        gsap.killTweensOf(this.children[i]);
        this.children[i].destroy();
    }
    this.children = [];
    gsap.killTweensOf(this);
    //this.destroy();
}