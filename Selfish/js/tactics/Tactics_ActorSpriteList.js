class Tactics_ActorSpriteList extends Sprite{
    constructor(x, y){
        super();
        this.x = x;
        this.y = y;
        this._data = null;
        this._actorSprites = [];
        this._infoSprites = [];
        this._arrowSprite = new Sprite();
        this._arrowSprite.bitmap = ImageManager.loadSystem("arrowA_2d");
        this.addChild(this._arrowSprite);
        this._arrowSprite.anchor.x = 0.5;
        this._arrowSprite.anchor.y = 0.5;
        this.deactivate();
    }

    setData(data){
        this._data = data;
        this.createActorSprite();
        //this.refresh();
    }

    createActorSprite(data){
        this._data.forEach(d => {
            let position = d.position();
            let actor = d;

            let sprite = new Sprite();
            if (position.scale > 0.5){
                sprite.bitmap = ImageManager.loadPicture(actor.faceName() + "_00_l");
                sprite.scale.x = sprite.scale.y = position.scale;
            } else{
                sprite.bitmap = ImageManager.loadPicture(actor.faceName() + "_00_s");
                sprite.scale.x = sprite.scale.y = position.scale * 2;
            }
            sprite.x = position.x;
            sprite.y = position.y;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1;
            this.addChild(sprite);
            this._actorSprites.push(sprite);

            let info = new Sprite();
            info.anchor.x = 0.5;
            info.bitmap = new Bitmap(200,80);
            this._infoSprites.push(info);
        });
        this._infoSprites.forEach(info => {
            this.addChild(info);
            
        });
    }

    setInfoSprite(data){
        this._infoSprites.forEach(sprite => {
            sprite.hide();
        });
        if (!data){
            return;
        }
        data.forEach((d,index) => {
            let info = this._infoSprites[index];
            
            info.show();
            info.bitmap.clear();
            info.bitmap.fontSize = 18;
            let text = d.split("\n");
            text.forEach((t,index) => {
                info.bitmap.drawText(t,0,index * 20,200,40,"center");
            });

            let _position = this._data[index].position();
            info.x = _position.x;
            let posScale = 1;
            if (_position < 0.5){
                posScale = 0.5;
            }
            info.y = _position.y - (400 * _position.scale * posScale);
        });
    }

    actorSprites(selectIndex){
        return this._actorSprites.filter(a => a.opacity != 0)[selectIndex];
    }

    selectingIndex(selectIndex){
        this.activate();
        const _index = this._actorSprites.findIndex(a => a == this.actorSprites(selectIndex));
        const _position = this._data[_index].position();
        this._arrowSprite.x = 0 + _position.x// + (this.actorSprites(selectIndex).width * _position.scale * 0.5);
        let posScale = 1;
        if (_position < 0.5){
            posScale = 0.5;
        }
        this._arrowSprite.y = (-24 * (1-_position.scale)) + _position.y - (640 * (_position.scale * posScale));
    }

    setSelectedIndex(selectIndex,isSelected){
        if (isSelected){
            this._actorSprites[selectIndex].setBlendColor([0, 0, 0, 0]);
        } else{
            this._actorSprites[selectIndex].setBlendColor([255, 255, 255, 64]);
        }
    }

    addActorList(actorIdList){
        for (let i = 0;i < actorIdList.length;i++){
            let index = this._data.findIndex(a => a.actorId() == actorIdList[i]);
            this._actorSprites[index].opacity = 255;
            this._actorSprites[index].setBlendColor([0, 0, 0, 0]);
        }
        this.refresh();
    }

    removeActorList(actorIdList){
        for (let i = 0;i < actorIdList.length;i++){
            let index = this._data.findIndex(a => a.actorId() == actorIdList[i]);
            this._actorSprites[index].opacity = 0;
        }
        this.refresh();
    }

    activate(){
        this._arrowSprite.visible = true;
    }

    deactivate(){
        this._arrowSprite.visible = false;
    }
    
    refresh(){
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}