//-----------------------------------------------------------------------------
// Window_EnemyInfoList
//

class Window_EnemyInfoList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height ));
        this._data = [];
        this.opacity = 0;
        this._cursorSprite.opacity = 0;
    }

    setData(data){
        this._data = data;
        this.refresh();
    }

    contentsHeight(){
        return this.height;
    }

    itemHeight(){
        return 48;
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
        const enemy = this._data[index];
        if (enemy) {
            const rect = this.itemRect(index);
            this.setFlatMode();
            if (this.index() == index){
                this.drawBackSkewX(rect.x + 13 * (index - this.topIndex()),rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
                this.resetTextColor();
            }
            this.drawText(TextManager.getEnemyName(enemy.id), rect.x + 36, rect.y + 2, rect.width - 60);
        }
    }

    updateHelp(){
        if (this.item()){
            this.setHelpWindowItem(this.item().skill);
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