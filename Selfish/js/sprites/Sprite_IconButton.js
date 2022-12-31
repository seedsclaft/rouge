// Sprite_IconButton
//

class Sprite_IconButton extends Sprite_Button{
    constructor (){
        super();
        this.bitmap = new Bitmap(104,104);
    
        this._backSprite = new Sprite();
        this._backSprite.bitmap = new Bitmap(120,80);
        this._backSprite.bitmap.fillRect(0,0,120,80,'black');
        this._backSprite.x = 0;
        this._backSprite.y = 0;
        this._backSprite.skew.x = -0.25;
        this._backSprite.opacity = 128;
        this.addChild(this._backSprite);
    
        this._iconSprite = new Sprite();
        this._iconSprite.bitmap = ImageManager.loadSystem('IconSet');
        const iconIndex  = 156;
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = iconIndex % 16 * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        this._iconSprite.x = 24;
        this._iconSprite.y = 4;
        this._iconSprite.setFrame(sx, sy, pw*2, ph*2);
        this.addChild(this._iconSprite);
    
        this._textButton = new Sprite();
        this._textButton.x = 24;
        this._textButton.y = 20;
        this._textButton.bitmap = new Bitmap(62,62);
        this.addChild(this._textButton);
    }

    setup(text){
        this._textButton.bitmap.clear();
        this._textButton.bitmap.fontSize = 21;
        this._textButton.bitmap.drawText(text,0,20,64,40,'center');
    }

    callClickHandler(){
        if (PopupManager.busy()){
            return;
        }
        super.callClickHandler();
    }

    terminate(){
        gsap.killTweensOf(this._backSprite);
        gsap.killTweensOf(this._textButton);
        gsap.killTweensOf(this._iconSprite);
        this._backSprite.destroy();
        this._textButton.destroy();
        this._iconSprite.destroy();
        this.destroy();
    }
}