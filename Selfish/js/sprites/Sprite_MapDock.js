//-----------------------------------------------------------------------------
// Sprite_MapDock
//

class Sprite_MapDock extends Sprite{
    constructor(mapSprite,skipCallBack){
        super();
        this._mapSprite = mapSprite;
        this._skipCallBack = skipCallBack;
        this.createButtons();
        this.createSprites();
    }

    callSkip(){
        if (this._skipCallBack){
            this._skipCallBack();
        }
    }

    createButtons(){
        this.createMapScalePlus();
        this.createMapScaleMinus();
        this.createStageSkip();
    }
    
    createMapScalePlus(){
        this._mapScalePlus = new Sprite_Button();
        this._mapScalePlus.bitmap = new Bitmap(28,28);
        this._mapScalePlus.bitmap.fontSize = 21;
        this._mapScalePlus.bitmap.drawText(TextManager.getText(5000030),0,0,28,28);
        //this.addChild(this._mapScalePlus);
        this._mapScalePlus.x = 824;
        this._mapScalePlus.y = 6;
        this._mapScalePlus.setClickHandler((isScaleUp) => this.mapScaleChange(true));
    }

    createMapScaleMinus(){
        this._mapScaleMinus = new Sprite_Button();
        this._mapScaleMinus.bitmap = new Bitmap(28,28);
        this._mapScaleMinus.bitmap.fontSize = 21;
        this._mapScaleMinus.bitmap.drawText(TextManager.getText(5000040),0,0,28,28);
        //this.addChild(this._mapScaleMinus);
        this._mapScaleMinus.x = 720;
        this._mapScaleMinus.y = 6;
        this._mapScaleMinus.setClickHandler((isScaleUp) => this.mapScaleChange(false));
    }

    createStageSkip(){
        this._skipButton = new Sprite_KeyMapButton();
        if ($gameSystem.isMenuEnabled()){
            this.addChild(this._skipButton);
        }
        this._skipButton.x = 864;
        this._skipButton.y = 4;
        this._skipButton.setClickHandler(this.callSkip.bind(this));
        this._skipButton.setText(TextManager.getText(5000020));
    }

    mapScaleChange(isScaleUp){
        //if (isScaleUp == $gameSystem._minimapMode){
            this._mapSprite.mapModeChange();
        //}
    }

    createSprites(){
        this.createMapScaleSprite();
    }

    createMapScaleSprite(){
        this._mapScaleSprite = new Sprite_KeyMapButton();
        this.addChild(this._mapScaleSprite);
        this._mapScaleSprite.x = 736;
        if (!$gameSystem.isMenuEnabled()){
            this._mapScaleSprite.x = 824;
        }
        this._mapScaleSprite.y = 4;
        this._mapScaleSprite.setClickHandler(this.mapScaleChange.bind(this));
        this._mapScaleSprite.setText(TextManager.getText(5000010));
    }
}