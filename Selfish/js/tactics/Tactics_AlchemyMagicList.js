class Tactics_AlchemyMagicList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
        this._magicList = [];
        this._selected = [];
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
            
            const _element = $dataSystem.elements;
            if (_alchemy.needRank) {
                let needIndex = 0;
                _alchemy.needRank.forEach((rank,index) => {
                    if (rank == 0){
                        //rank = "－";
                        return;
                    }
                    this.drawText(_element[index+1] + rank, rect.x + 344 + 32 * needIndex, rect.y  - 12,80,"left");
                    needIndex++;
                });
            }
            this.drawText(_alchemy.cost + "pt", rect.x, rect.y  - 12,rect.width,"right");
        
            this.drawText(_alchemy.skill.mpCost, rect.x - 264, rect.y -12, rect.width, "right");
            this.contents.fontSize = 16;
            if (_alchemy.skill.range != null){
                let range = TextManager.getText(1510);
                if (_alchemy.skill.range == 1) range = TextManager.getText(1520);
                this.drawText(TextManager.getText(1500) + range, rect.x, rect.y + 16, rect.width);
            }
            let textWidth = this.contents.measureTextWidth(_alchemy.skill.description);
            this.drawTextEx(_alchemy.skill.description,rect.width - 264 - textWidth + 12,rect.y + 20,rect.width);
        
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