//-----------------------------------------------------------------------------
// Window_Caution
//

class Window_Caution extends Window_Base {
    constructor(text,x,y,width,height){
        super(new Rectangle( x, y, width, height ));
        this._tween = null;
        this.hide();
        this.close();
        this.contents.drawText(text,0,-16,this.width,this.height,"center");
    }
}