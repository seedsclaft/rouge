//-----------------------------------------------------------------------------
// Window_Loading
//

class Window_Loading extends Window_Base{
    constructor(x,y,width,height){
        super(new Rectangle( x, y, width, height ));
        this._tween = [];
        this.hide();
        this.opacity = 0;
        
        this._window = new ScreenSprite();
        this._window.setColor(0,0,0);
        this._window.opacity = 128;
        this.addChild(this._window);
    
        this._loading = new Sprite();
        this._loading.bitmap = ImageManager.loadSystem('Loading');
        this._loading.x = 560;
        this._loading.y = 440;
        this.addChild(this._loading);

        this._gaugeSprite = new Sprite(new Bitmap(250,6));
        this._gaugeSprite.bitmap.gradientFillRect(0, 0, 360, 6,$gameColor.getColor('hpgauge2'),$gameColor.getColor('hpgauge1'));
        this._gaugeSprite.pivot.x = 0;
        this._gaugeSprite.x = 640;
        this._gaugeSprite.y = 512;
        this._gaugeSprite.scale.x = 0;
        this.addChild(this._gaugeSprite);
        this._lastValue = null;
    }

    open(){
        if (this._tween && this._tween.length){
            this._tween.forEach(tween => {
                tween.kill();
            });
        }
        this.show();
        this.activate();
        this._window.alpha = 0;
        this._loading.alpha = 0;
        var loading = gsap.to(this._loading,0.5,{alpha:1,delay:0.1,repeat:-1,yoyo:true});
        var window = gsap.to(this._window,0,{alpha:0.5,delay:0});
        this._tween.push(loading);
        this._tween.push(window);
    }

    close(){
        if (this._tween && this._tween.length){
            this._tween.forEach(tween => {
                tween.kill();
            });
        }
        this.hide();
        this.deactivate();
        this._window.alpha = 0;
        this._loading.alpha = 0;
    }

    refreshProgress(value){
        if (this._gaugeSprite){
            this._gaugeSprite.scale.x = value;
        }
    }
}