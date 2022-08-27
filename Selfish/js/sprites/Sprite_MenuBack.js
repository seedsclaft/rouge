//-----------------------------------------------------------------------------
// Sprite_MenuBack
//

class Sprite_MenuBack extends Sprite{
    constructor(){
        super();
        this._window2 = new ScreenSprite();
        this._window2.setColor(255,255,255);
        this.addChild(this._window2);
        this._window2.opacity = 224;
        this._window = new ScreenSprite();

        this._window.setColor(255,255,255);
        this._window.opacity = 200;
        this.addChild(this._window);
        let menuBackFilter = new PIXI.filters.MenuBackFilter();
        this._window.filters = [menuBackFilter];

        this._weather = new PIXI.Graphics();
        this._weather.x = Graphics.width / 2;
        this._weather.y = Graphics.height / 2;
        this.addChild(this._weather);
        this._partcle = new Sprite_Particle();
        this.addChild(this._partcle);
        this._partcle.setup(this._weather,"menu");
    }

    update(){
        super.update();
        if (this._window && this._window.filters.length > 0){
            this._window.filters[0].uniforms.time = Graphics.frameCount * 0.01;
        }
    }

    terminate(){
        this._window.destroy();
        this._window = null;
        this._window2.destroy();
        this._window2 = null;
        this._partcle.destroy();
        this._partcle = null;
        this._weather.destroy();
        this._weather = null;
        this.destroy();
    }
}