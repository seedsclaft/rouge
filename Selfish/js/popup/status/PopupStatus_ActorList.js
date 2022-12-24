//-----------------------------------------------------------------------------
// PopupStatus_ActorList
//

class PopupStatus_ActorList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle(0,0,0,0));
        this._data = [];
        this._selectId = [];
        this._cursorSprite.opacity = 0;
        this.opacity = 0;
        this._actorSprite = new Sprite();
        this._actorSprite.scale.x = this._actorSprite.scale.y = 1;
        this._actorSprite.x = -120;
        this._actorSprite.y = 0;
        this.addChild(this._actorSprite);
        this._actorListItem = new PopupStatus_ActorListItem(x,y,width,height);
        this.addChild(this._actorListItem);

        this._lvUpData = null;
    }

    setData(data){
        this._lvUpData = null;
        this._data = data;
        this.refresh();
    }

    selectActorId(actorId){
        this._selectId = actorId;
        this.refresh();
    }

    contentsHeight(){
        return this.height;
    }

    itemHeight(){
        return 48;
    }

    maxItems(){
        return this._data ? this._data.length : 1;
    }

    item(){
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    }

    isCurrentItemEnabled(){
        return true;
    }

    selectLast(){
        this.select(this.index() >= 0 ? this.index() : 0);
        this.refresh();
    }

    drawItem(index){
        const actor = this._data[index];
        if (actor){
            this._actorSprite.bitmap = ImageManager.loadPicture(actor.faceName().replace("yhmv","yh"));
            this._actorListItem.setActor(actor,this._lvUpData);
        }
    }

    newDispFlag(help){
        const keyData =_.find($gameParty.getHelpKeyData(),(helpKey) => helpKey.key == help.key);
        if (keyData){
            return !keyData.isRead;
        }
        return false;
    }

    refresh(){
        this.createContents();
        this.drawItem(this.index());
    }

    _updateCursor(){
    }

    stratLvup(endCall){
        let listX = this._actorListItem.x;
        this._actorListItem.x = 960;
        gsap.to(this._actorListItem,0.5,{x:listX});
        let speiteX = this._actorSprite.x;
        this._actorSprite.x = -240;
        gsap.to(this._actorSprite,0.5,{x:speiteX,onComplete:function(){
            if (endCall) endCall();
        }});
    }

    setLvupAfter(lvUpData){
        this._lvUpData = lvUpData;
        this.refresh();
    }
}