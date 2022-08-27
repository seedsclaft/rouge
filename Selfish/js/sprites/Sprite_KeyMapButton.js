
//-----------------------------------------------------------------------------
// Sprite_KeyMapButton
//

class Sprite_KeyMapButton extends Sprite_Button {
    constructor(){
        super();
        this._marginX = 0;
        this._height = 30;
        this._baseWidth = 120 * (1/0.85);
        this._baseHeight = 30;
    }

    setText(text){
        this._buttonSprite = new Sprite();
        this._buttonSprite.bitmap = ImageManager.loadSystem("sabwindowF");
        //this._buttonSprite.anchor.x = 0.5;
        this.addChild(this._buttonSprite);
        this._textSprite = new Sprite();
        this._textSprite.bitmap = new Bitmap(0,this._height);
        const textWidth = this._textSprite.bitmap.measureTextWidth(text) + this._marginX * 2;

        this._buttonSprite.scale.x = textWidth / this._baseWidth;
        this._buttonSprite.scale.y = this._height / this._baseHeight;
        
        const textHeight = this._height * (1/0.85);

        this._textSprite.bitmap = new Bitmap(textWidth,textHeight);
        //this._textSprite.anchor.x = 0.5;
        this._textSprite.bitmap.fontSize = 21;
        this._textSprite.bitmap.drawText(text,0,0,textWidth,textHeight,'center');
        this._textSprite.scale.x = this._textSprite.scale.y = 0.85;
        this.addChild(this._textSprite);
        this.width = textWidth * 0.85;
        this.height = this._height;
    }
}