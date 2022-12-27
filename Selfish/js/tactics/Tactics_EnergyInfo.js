class Tactics_EnergyInfo extends Window_Base{
    constructor(x, y, width,height){
        super(x, y,width,height);
        this._sprite = new Sprite();
        this._sprite.x = 96;
        this._sprite.y = 12;
        this._sprite.bitmap = new Bitmap(200,40);
        this._sprite.bitmap.fontSize = 21;
        this.addChild(this._sprite);

        this._value = 0;
    }

    initialize(x, y, width,height){
        super.initialize(new Rectangle( x, y ,width , height));
    }

    setEnergy(value){
        this._value = value;
        this._sprite.bitmap.clear();
        this._sprite.bitmap.drawText(value + " pt",0,0,200,40,"right");
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
                this._sprite.bitmap.drawText(_value + " pt",0,0,200,40,"right");
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