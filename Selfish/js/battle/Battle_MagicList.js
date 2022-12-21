class Battle_MagicList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
    }

    setBattleMagic(data){
        this._data = data;
        super.refresh();
    }

    maxItems() {
        return this._data != null ? this._data.length : 0;
    };

    itemHeight(){
        return 72;
    }

    drawItem(index){
        const _magic = this._data[index];
        if (_magic){
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.changePaintOpacity(_magic.enable);
            this.contents.fontSize = 21;
            this.drawItemName(_magic.skill, rect.x, rect.y - 12,rect.width);
            this.drawText(_magic.cost, rect.x, rect.y -12, rect.width, "right");
            this.contents.fontSize = 16;
            this.drawTextEx(_magic.skill.description,rect.x,rect.y + 20,rect.width);
        }
    }

    drawTextEx(text, x, y, width){
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);
        return textState.outputWidth;
    }

    isCurrentItemEnabled () {
        return this.item().enable;
    };

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

    item(){
        return this._data.length > this.index() ? this._data[this.index()] : null;
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}