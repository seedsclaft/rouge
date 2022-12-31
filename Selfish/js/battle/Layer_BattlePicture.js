class Layer_BattlePicture extends Sprite{
    constructor(members){
        super();
        this._pictureSprites = [];
        this.createPictures(members);
    }

    createPictures(members){
        members.forEach(battler => {
            let sprite = new Sprite();
            sprite.opacity = 0;
            let _actorData = $dataActors[battler.actorId()];
            let _x = _actorData.x; 
            let _y = _actorData.y;
            let _scale = _actorData.scale;
            sprite.x = _x - 120;
            sprite.y = _y;
            sprite.scale.x = sprite.scale.y = _scale;
            sprite.bitmap = ImageManager.loadPicture(battler.faceName());
            sprite._pictureLabel = battler.faceName();
            this.addChild(sprite);
            this._pictureSprites.push(sprite);
        },this);
    }

    refreshBattlerPicture(battler){
        if (!battler.isActor()){
            return;
        }
        this._pictureSprites.forEach(sprite => {
            let _actorData = $dataActors[battler.actorId()];
            let _x = _actorData.x; 
            if (battler.faceName() == sprite._pictureLabel){
                this.showAnimation(sprite,_x);
            } else{
                this.hideAnimation(sprite,_x);
            }
        });
    }

    hideBattlerPicture(){
        this._pictureSprites.forEach(sprite => {
            this.hideAnimation(sprite);
        });
    }

    showAnimation(sprite,x){
        gsap.to(sprite, 0.2, {x:x-96,opacity:255});
    }

    hideAnimation(sprite,x){
        gsap.to(sprite, 0.2, {x:x-120 ,opacity:0});   
    }

    terminate(){
        for (let i = this._pictureSprites.length-1;i >= 0;i--){
            this._pictureSprites[i].terminate();
            this.removeChild(this._pictureSprites[i]);
        }
        this.destroy();
    }
}