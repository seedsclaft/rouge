class Tactics_EnergyInfo extends Window_Base{
    constructor(x, y, width,height){
        super(x, y,width,height);
        this.opacity = 0;
        let ptBack = new Sprite();
        ptBack.bitmap = ImageManager.loadSystem("gold");
        ptBack.x = 8;
        ptBack.y = 4;
        ptBack.opacity = 164;
        this.addChild(ptBack);
        this._sprite = new Sprite();
        this._sprite.x = 16;
        this._sprite.y = 4;
        this._sprite.bitmap = new Bitmap(160,40);
        this._sprite.bitmap.fontSize = 19;
        this.addChild(this._sprite);

        this._value = 0;
    }

    initialize(x, y, width,height){
        super.initialize(new Rectangle( x, y ,width , height));
    }

    setEnergy(value){
        this._value = value;
        this._sprite.bitmap.clear();
        this._sprite.bitmap.drawText(value + " " + TextManager.currencyUnit,0,0,160,40,"right");
    }

    changeEnergy(value){
        this._duration = 0;
        const _current = this._value;
        if (this._anim) this._anim.kill();
        this._anim = gsap.to(this._sprite,1,{
            onUpdate : () => {
                this._duration += 3 / 60;
                if (this._duration >= 1){
                    this._duration = 1;
                }
                let _value = Math.floor(_current + (value * this._duration));
                this._sprite.bitmap.clear();
                this._sprite.bitmap.drawText(_value + " " + TextManager.currencyUnit,0,0,160,40,"right");
            }
        })
        this._value += value;
    }

    _updateCursor(){
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}