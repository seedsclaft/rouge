class Tactics_AlchemyMagicList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
        this._magicList = [];
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

    drawItem(index){
        const _alchemy = this._magicList[index];
        if (_alchemy){
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.contents.fontSize = 21;
            this.drawText(TextManager.getSkillName(_alchemy.skill.id), rect.x, rect.y,rect.width);
            if (_alchemy.needRank) {
                _alchemy.needRank.forEach((rank,index) => {
                    if (rank == 0){
                        rank = "－";
                    }
                    this.drawText(rank, rect.x + 264 + 40 * index, rect.y,40,"center");
                });
            }
            this.drawText(_alchemy.cost + "pt", rect.x, rect.y,rect.width,"right");
        
        }
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


    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}