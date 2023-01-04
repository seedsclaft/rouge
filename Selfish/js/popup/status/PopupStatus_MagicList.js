//-----------------------------------------------------------------------------
// PopupStatus_MagicList
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

            const _textWidth = this.contents.measureTextWidth(TextManager.getSkillName(_magic.id));
            this.contents.fontSize = 16;
            this.drawText("（" + _magic.mpCost + "）", rect.x + _textWidth, rect.y - 12, rect.width, "left");

            this.drawItemDescription(_magic,rect.x, rect.y, rect.width);
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