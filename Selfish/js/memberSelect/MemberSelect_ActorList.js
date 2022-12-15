//-----------------------------------------------------------------------------
// MemberSelect_StatusItem
//
// The window for selecting a skill on the skill screen.

class MemberSelect_ActorList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height));
        this._data = [];
        this._selectId = [];
        this._cursorSprite.opacity = 0;
        //this.opacity = 0;
        this._actorSprite = new Sprite();
        this._actorSprite.scale.x = this._actorSprite.scale.y = 1.25;
        this._actorSprite.x = 40;
        this._actorSprite.y = 64;
        this.addChild(this._actorSprite);
        this._actorListItem = new MemberSelect_ActorListItem(x + width / 2 + 40,y + 40,width / 2,height);
        this.addChild(this._actorListItem);
    }

    setData(data){
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
            this._actorListItem.setActor(actor);
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
}