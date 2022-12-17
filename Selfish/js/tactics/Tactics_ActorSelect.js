class Tactics_ActorSelect extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
    }

    setData(data){
        this._data = data;
        this.refresh();
    }

    maxItems(){
        return this._data.length;
    }

    drawItem(index){
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.contents.fontSize = 21;
        this.contents.drawText("text", rect.x, rect.y + 28, rect.width, this.lineHeight(), "center",true);
    }

    processOk(){
        if (EventManager.busy()){
            return;
        }
        super.processOk();
    }

    updateHelp(){
        if (this._commandData[this.index()]){
            const id = this._commandData[this.index()].helpTextId;
            this.setHelpWindowText(TextManager.getText(id));
        }
    }

    selectLast(){
        this.selectSymbol(Window_MenuListCommand._lastCommandSymbol);
    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
    }

    cursorRight(wrap){
        super.cursorDown(wrap);
    }

    cursorLeft(wrap){
        super.cursorUp(wrap);
    }

    cursorUp(wrap){
    }

    cursorDown(wrap){
    }

    actor(){
        return this._data[this.index()].actor;
    }
    //_updateCursor(){

    //}

    removeActorList(actorIdList){
        for (let i = 0;i < actorIdList.length;i++){
            let data = this._data.find(a => a.actor.actorId() == actorIdList[i]);
            this._data = _.without(this._data,data);
        }
        this.refresh();
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}