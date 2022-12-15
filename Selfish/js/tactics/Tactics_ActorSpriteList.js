class Tactics_ActorSpriteList extends Sprite{
    constructor(x, y){
        super();
        this.x = x;
        this.y = y;
        this._data = null;
        this._actorSprites = [];
        this._arrowSprite = new Sprite();
        this._arrowSprite.bitmap = ImageManager.loadSystem("arrowA_2d");
        this.addChild(this._arrowSprite);
        this._arrowSprite.anchor.x = 0.5;
        this._arrowSprite.anchor.y = 0.5;
        this._arrowSprite.opacity = 0;
    }

    setData(data){
        this._data = data;
        this.createActorSprite();
        //this.refresh();
    }

    createActorSprite(data){
        this._data.forEach(d => {
            let position = d.position;
            let actor = d.actor;

            let sprite = new Sprite();
            sprite.bitmap = ImageManager.loadPicture(actor.faceName() + "_00_s");
            //sprite.bitmap = ImageManager.loadPicture("Actor0001_00_s");
            sprite.scale.x = sprite.scale.y = position.scale;
            sprite.x = position.x;
            sprite.y = position.y;
            sprite.anchor.y = 1;
            this.addChild(sprite);
            this._actorSprites.push(sprite);
        });
    }

    selectingIndex(selectIndex){
        this._arrowSprite.opacity = 255;
        const _position = this._data[selectIndex].position;
        this._arrowSprite.x = 0 + _position.x + (this._actorSprites[selectIndex].width * _position.scale * 0.5);
        this._arrowSprite.y = -24 + _position.y - (this._actorSprites[selectIndex].height * _position.scale);

        return
    }

    setSelectedIndex(selectIndex,isSelected){
        if (isSelected){
            this._actorSprites[selectIndex].setBlendColor([0, 0, 0, 0]);
        } else{
            this._actorSprites[selectIndex].setBlendColor([255, 255, 255, 64]);
        }
    }

    refresh(){

    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}