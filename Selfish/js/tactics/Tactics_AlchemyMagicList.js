class Tactics_AlchemyMagicList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
        this._magicList = [];
        this._selected = [];
        this._window = new Window_Base(new Rectangle(500,0,304,height ));
        this.addChildAt(this._window,1)
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
            if (this._selected.contains(_alchemy.skill.id)){
                this.drawBack(rect.x,rect.y-12,rect.width,this.itemHeight(),0xFFFFFF,64);
            }
            this.drawText(TextManager.getSkillName(_alchemy.skill.id), rect.x, rect.y - 12,rect.width);
            const _textWidth = this.contents.measureTextWidth(TextManager.getSkillName(_alchemy.skill.id));
            this.contents.fontSize = 16;
            this.drawText("（" + _alchemy.skill.mpCost + "）", rect.x + _textWidth, rect.y - 12, rect.width, "left");
 
            //if (_alchemy.skill.stypeId == Game_BattlerBase.SKILL_TYPE_MAGIC){
            //    this.drawText(_alchemy.skill.mpCost, rect.x, rect.y - 12, rect.width - 296, "right");
            //}
            this.drawItemDescription(_alchemy.skill,rect.x,rect.y,rect.width - 296);

            this.contents.fontSize = 18;
            const _element = $dataSystem.elements;
            if (_alchemy.needRank) {
                let needIndex = 0;
                _alchemy.needRank.forEach((rank,index) => {
                    if (rank == 0){
                        rank = "－";
                        return;
                    }
                    this.drawIconMini($gameElement.data()[index].iconIndex,rect.x + 500 + 32 * needIndex , rect.y - 8);
                    this.drawText(rank,28 + rect.x + 500 + 32 * needIndex, rect.y - 16,80,"left");
                    needIndex++;
                });
            }
            this.contents.fontSize = 16;
            this.drawText(TextManager.getText(750) + " : " + _alchemy.skill.mpCost,500 + rect.x, rect.y + 14,rect.width,"left");
            this.drawText(_alchemy.cost + TextManager.currencyUnit, rect.x, rect.y + 14,rect.width,"right");
        
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
        this.refresh();
    }

    setRemove(id){
        this._selected = _.without(this._selected,id);
        this.refresh();
    }

    clearSelect(){
        this._selected = [];
    }

    item(){
        return this._magicList.length > this.index() ? this._magicList[this.index()] : null;
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}