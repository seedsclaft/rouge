class Tactics_EnergyInfo extends Window_Base{
    constructor(x, y, width,height){
        super(x, y,width,height);
    }

    initialize(x, y, width,height){
        super.initialize(new Rectangle( x, y ,width , height));
    }

    setEnergy(value){
        this.contents.clear();
        this.drawText(value,0,0,this._width - this.padding * 2 - 32,"right",true);
        this.contents.fontSize = 16;
        this.drawText("pt",0,4,this._width - this.padding * 2 - 8,"right",true);
    }

    _updateCursor(){
    }


    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}