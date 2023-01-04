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
            const _textWidth = this.contents.measureTextWidth(TextManager.getSkillName(_magic.skill.id));
            this.contents.fontSize = 16;
            this.drawText("（" + _magic.cost + "）", rect.x + _textWidth + 16, rect.y - 12, rect.width, "left");
 
            if (_magic.skill.stypeId == Game_BattlerBase.SKILL_TYPE_MAGIC){
                //this.drawText(_magic.cost, rect.x, rect.y - 12, rect.width, "right");
            }
            this.drawItemDescription(_magic.skill,rect.x,rect.y,rect.width);
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

    selectLast(skillId){
        const _findIndex = this._data.findIndex(a => a.skill.id == skillId);
        if (_findIndex > -1){
            this.smoothSelect(_findIndex);
        } else{
            this.smoothSelect(0);
        }
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}