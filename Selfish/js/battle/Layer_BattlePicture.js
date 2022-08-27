class Layer_BattlePicture extends Sprite{
    constructor(members){
        super();
        this._pictureSprites = [];
        this.createPictures(members);
    }

    createPictures(members){
        members.forEach(battler => {
            let sprite = new Sprite_EventPicture();
            sprite.setup(battler.faceName(),96,0,0);
            sprite.opacity = 0;
            sprite.scale.x = sprite.scale.y = 0.9;
            this.addChild(sprite);
            this._pictureSprites.push(sprite);
        },this);
    }

    refreshBattlerPicture(battler){
        if (!battler.isActor()){
            return;
        }
        this._pictureSprites.forEach(sprite => {
            if (battler.faceName() == sprite._pictureLabel){
                this.showAnimation(sprite);
            } else{
                this.hideAnimation(sprite);
            }
        });
    }

    hideBattlerPicture(){
        this._pictureSprites.forEach(sprite => {
            this.hideAnimation(sprite);
        });
    }

    showAnimation(sprite){
        gsap.to(sprite, 0.2, {x:168 ,opacity:255});
    }

    hideAnimation(sprite){
        gsap.to(sprite, 0.2, {x:96 ,opacity:0});   
    }

    terminate(){
        for (let i = this._pictureSprites.length-1;i >= 0;i--){
            this._pictureSprites[i].terminate();
            this.removeChild(this._pictureSprites[i]);
        }
        this.destroy();
    }
}