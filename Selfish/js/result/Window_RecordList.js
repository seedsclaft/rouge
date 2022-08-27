//-----------------------------------------------------------------------------
// Window_RecordList
//

class Window_RecordList extends Window_Selectable {
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height));
        this._data = [];
        this._lastIndex = -1;
        //this.hide();
        //this._sideBarSprite.x = this.width - 9;
        this._cursorSprite.opacity = 0;
    
        this.opacity = 0;
    }

    setDataList(data){
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

    isCurrentItemEnabled(){
        return true;
    }

    selectLast(){
        this.select(this.index() >= 0 ? this.index() : 0);
        this.refresh();
    }

    drawItem(index){
        const record = this._data[index];
        if (record){
            var rect = this.itemRect(index);
            this.resetTextColor();
            this.setFlatMode();
            if (this.index() == index){
                this.drawBackSkewX(rect.x + 13 * (index - this.topIndex()),rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
                this.resetTextColor();
            }
            let text = record._text;
            if (record._id > 100){
                text += TextManager.getText(5000030);
            }
            if (record._id == 0){
                text = TextManager.getText(2110);
            }
            this.drawText(text,rect.x + 36, rect.y + 2, rect.width - 60);
            //this.drawText(this.commandName(index), rect.x + 36, rect.y+2, rect.width, "left");
        }
    }

    refresh(){
        this.createContents();
        this.drawAllItems();
    }

    actorName(){
        if (this.item() == null){
            return null;
        }
        if (this.item()._type == Game_ResultType.Base){
            return this.item().actor().faceName;
        }
        if (this.item()._type == Game_ResultType.Battle){
            return this.item().actor().faceName;
        }
        return null;
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