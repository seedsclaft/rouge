class Tactics_AlchemyMagicList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
        this._magicList = [];
        this._window = new Window_Base(new Rectangle(500,0,304,height ));
        //this.addChildAt(this._window,1)
    }

    setAlchemyMagic(data){
        this._data = data;
        this._magicList = data;
        super.refresh();
    }

    setCategory(category){
        this._magicList = this._data.filter(a => a.skill.damage.elementId == category.elementId);
        super.refresh();
    }

    maxItems() {
        return this._magicList != null ? this._magicList.length : 0;
    };

    itemHeight(){
        return 72;
    }

    drawItem(index){
        const _alchemy = this._magicList[index];
        if (_alchemy){
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.contents.fontSize = 21;
            this.drawText(TextManager.getSkillName(_alchemy.skill.id), rect.x, rect.y - 12,rect.width);
            const _textWidth = this.contents.measureTextWidth(TextManager.getSkillName(_alchemy.skill.id));
            this.contents.fontSize = 16;
            this.drawText("（" + _alchemy.skill.mpCost + "）", rect.x + _textWidth, rect.y - 12, rect.width, "left");
 
            //if (_alchemy.skill.stypeId == Game_BattlerBase.SKILL_TYPE_MAGIC){
            //    this.drawText(_alchemy.skill.mpCost, rect.x, rect.y - 12, rect.width - 296, "right");
            //}
            this.drawItemDescription(_alchemy.skill,rect.x,rect.y,rect.width - 104);
            this.contents.fontSize = 18;
            this.drawText("習得Cost", rect.width - 104 + 20, rect.y - 10,104,"center");
            this.drawText(_alchemy.cost + TextManager.currencyUnit, rect.width - 104 - 4, rect.y + 18,104,"right");
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

    item(){
        return this._magicList.length > this.index() ? this._magicList[this.index()] : null;
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}