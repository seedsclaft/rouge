//-----------------------------------------------------------------------------
// Window_Pause
//

class Window_Pause extends Window_Base{
    constructor(x,y,width,height){
        super(new Rectangle( x, y, width, height ));
        this.hide();
        this.opacity = 0;
        
        this._window = new ScreenSprite();
        this._window.setColor(0,0,0);
        this._window.opacity = 128;
        this.addChild(this._window);
    
        this._loading = new Sprite();
        this._loading.bitmap = new Bitmap(960,80);
        this._loading.bitmap.drawText("Pause",0,0,960,80,'center');
        this._loading.x = 0;
        this._loading.y = 240;
        this.addChild(this._loading);
    }

    open(){
        this.show();
        this.activate();
    }

    close(){
        this.hide();
        this.deactivate();
        this._window.alpha = 0;
        this._loading.alpha = 0;
    }
}