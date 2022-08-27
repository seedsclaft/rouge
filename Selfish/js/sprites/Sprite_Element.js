// Sprite_Element
//
// The sprite for displaying a button.
class Sprite_Element extends Sprite{
    constructor(x,y){
        super();
        this._baseX = x;
        this.x = x;
        this.y = y;
        this.bitmap = ImageManager.loadSystem('elements');
    }

    baseX (){
        return this._baseX;
    }
    
    terminate(){
        gsap.killTweensOf(this);
        this.destroy();
    }
}