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
        this._actorSprite.x = 0;
        this._actorSprite.y = 0;
        this.addChild(this._actorSprite);
        this._actorListItem = new PopupStatus_ActorListItem(x,y,width,height);
        this.addChild(this._actorListItem);
        this._actorListItem.setHandler('right',     this.statusUp.bind(this));
        this._actorListItem.setHandler('left',     this.statusDown.bind(this));
        this._actorListItem.setHandler('ok',     this.decideParam.bind(this));
        this._actorListItem.setHandler('cancel',     this.cancelParam.bind(this));

        this._lvUpData = null;
    }

    changeStatus(){
        this._actorListItem.select(0);
        this._actorListItem.activate();
    }

    statusUp(){
        this._actorListItem.activate();
        let actor = this._data[this.index()];
        if (actor){
            const index = this._actorListItem.index();
            const sp = actor._sp;
            if (sp >= actor.paramUpCost()[index]){
                actor._tempParamPlus[index] += 1;
                actor._sp -= actor.paramUpCost()[index];
                actor._useSp += actor.paramUpCost()[index];
                let lvUpData = {
                    lv:0,
                    hp:actor._tempParamPlus[0],
                    mp:actor._tempParamPlus[1],
                    atk:actor._tempParamPlus[2],
                    spd:actor._tempParamPlus[3],
                    def:actor._tempParamPlus[4]
                };
                this._actorListItem.refresh(lvUpData);
            }

        }
    }

    statusDown(){
        this._actorListItem.activate();
        let actor = this._data[this.index()];
        if (actor){
            const index = this._actorListItem.index();
            if (actor._tempParamPlus[index] > 0){
                actor._tempParamPlus[index] -= 1;
                actor._sp += actor.paramUpCost()[index];
                actor._useSp -= actor.paramUpCost()[index];
                let lvUpData = {
                    lv:0,
                    hp:actor._tempParamPlus[0],
                    mp:actor._tempParamPlus[1],
                    atk:actor._tempParamPlus[2],
                    spd:actor._tempParamPlus[3],
                    def:actor._tempParamPlus[4]
                };
                this._actorListItem.refresh(lvUpData);
            }
        }

    }

    decideParam(){
        let actor = this._data[this.index()];
        const mainText = TextManager.getText(12000).replace("/d",actor.name());
        const subText = TextManager.getText(12010);
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:subText});
        _popup.setHandler(text1,'ok',() => {
            actor._paramPlus[0] += actor._tempParamPlus[0];
            actor._paramPlus[1] += actor._tempParamPlus[1];
            actor._paramPlus[2] += actor._tempParamPlus[2];
            actor._paramPlus[3] += actor._tempParamPlus[3];
            actor._paramPlus[6] += actor._tempParamPlus[4];
            actor._tempParamPlus = [0,0,0,0,0];
            this._actorListItem.refresh();
            this._actorListItem.select(-1);
        });
        _popup.setHandler(text2,'cancel',() => {
            this._actorListItem.activate();
        });
        _popup.open();
    }

    cancelParam(){
        let actor = this._data[this.index()];
        actor._sp += actor._useSp;
        actor._useSp = 0;
        actor._tempParamPlus = [0,0,0,0,0];
        this._actorListItem.refresh();
        this._actorListItem.select(-1);
        this.activate();
        SceneManager._scene._keyMapWindow.refresh("actorInfo");
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
            const _actorData = $dataActors[actor.actorId()];
            const _x = _actorData.x; 
            const _y = _actorData.y; 
            const _scale = _actorData.scale; 
            this._actorSprite.scale.x = this._actorSprite.scale.y = _scale;
            this._actorSprite.x = _x;
            this._actorSprite.y = _y;
            this._actorSprite.bitmap = ImageManager.loadPicture(actor.faceName());
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