class Window_RoleSkillSelect extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height ));
        this.opacity = 0;
    }

    setData(data){
        this._data = data;
        this.refresh();
    }

    contentsHeight(){
        return this.height;
    }

    maxCols(){
        return 2;
    }

    itemHeight(){
        return 40;
    }

    maxItems(){
        return this._data ? this._data.length : 1;
    }

    item(){
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    }

    selectLast(){
        this.select(this.index() >= 0 ? this.index() : 0);
    }

    drawItem(index){
        if (!this._data || this._data.length == 0){
            return;
        }
        const item = this._data[index];
        this.contents.fontSize = 21;
        if (item != null) {
            const rect = this.itemRect(index);
            this.resetTextColor();
            if (this.index() == index){
                this.drawBack(rect.x ,rect.y,rect.width,this.itemHeight()-2,this.cursorColor(),128);
                
            }
            //let name = item.name;
        
            this.drawText(TextManager.getStateName(item.state.id), rect.x + 8, rect.y + 1, rect.width,"left");
            
            if (item.up){
                this.changeTextColor(this.powerUpColor());
            }
            this.drawText(item.level, rect.x - 8, rect.y + 1, rect.width,"right");
        }
    }

    updateHelp(){
        if (this.item()){
            //this.setHelpWindowItem(this.item().skill);
        }
    }

    refresh(){
        this.createContents();
        this.drawAllItems();
    }

    _updateCursor(){

    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
    }
}

var SkillSelectType = {
    None:0,
    Learning:1,
    Item:2,
    Equipment:3,
    MyEquip:4,
    Skill:5,

}