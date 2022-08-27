//-----------------------------------------------------------------------------
// Sprite_TransFade
//

class Sprite_TransFade extends Sprite{
    constructor(){
        super();
        this._animation = null;
    }

    transLeft(speedRate){
        if (this._animation){
            this._animation.kill();
        }
        this.x = -2000;
        this._animation = gsap.to(this, 0.8 * speedRate, {pixi:{x:this.x+3000},onComplete: function(){
            this.x = 2560;
        }.bind(this)});
    }

    transRight(speedRate){
        if (this._animation){
            this._animation.kill();
        }
        this.x = 480;
        this._animation = gsap.to(this, 0.8 * speedRate, {pixi:{x:this.x-3000},onComplete: function(){
            this.x = -2560;
        }.bind(this)}); 
    }
}