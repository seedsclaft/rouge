//-----------------------------------------------------------------------------
// PopupStatus_ActorList
//

class PopupStatus_MagicList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
        this._magicList = [];
        this._selected = [];
        this._actor = null;
    }

    setMagic(data){
        this._data = data;
        this._magicList = data;
        super.refresh();
    }

    setCategory(category){
        this._magicList = this._data.filter(a => a.damage.elementId == category.elementId);
        super.refresh();
    }

    setActor(actor){
        console.log(actor)
        this._actor = actor;
    }

    maxItems() {
        return this._magicList != null ? this._magicList.length : 0;
    };

    itemHeight(){
        return 72;
    }

    drawItem(index){
        const _magic = this._magicList[index];
        if (_magic){
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.contents.fontSize = 21;
            this.changePaintOpacity(this._actor.isLearnedSkill(_magic.id));
            this.drawText(TextManager.getSkillName(_magic.id), rect.x, rect.y - 12,rect.width);

            this.drawText(_magic.mpCost, rect.x, rect.y -12, rect.width, "right");
            this.contents.fontSize = 16;
            if (_magic.range != null){
                let range = TextManager.getText(1510);
                if (_magic.range == 1) range = TextManager.getText(1520);
                else if (_magic.range == 2) range = TextManager.getText(1530);
                this.drawText(TextManager.getText(1500) + range, rect.x, rect.y + 16, rect.width);
            }
            this.drawTextEx(_magic.description,rect.width - _magic.description.length * 16 + 12,rect.y + 20,rect.width);
        
        }
    }

    drawTextEx(text, x, y, width){
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);
        return textState.outputWidth;
    }

    updateHelp(){
    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
    }

    //_updateCursor(){

    //}
    setSelected(id){
        this._selected.push(id);
    }

    item(){
        return this._magicList.length > this.index() ? this._magicList[this.index()] : null;
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}