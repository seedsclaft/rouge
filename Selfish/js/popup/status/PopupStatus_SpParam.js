class PopupStatus_SpParam extends Window_Base{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
    }

    setData(actor){
        this.contents.clear();
        this.contents.fontSize = 18;
        const _y = -2;
        this.drawText(TextManager.getText(730),12,_y,104);
        this.drawText(actor._useSp,64,_y,80,"right");
        this.drawText(TextManager.getText(710),148,_y,240);
        this.drawText(actor._sp,124,_y,80,"right");
    }

    //_updateCursor(){

    //}


    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}