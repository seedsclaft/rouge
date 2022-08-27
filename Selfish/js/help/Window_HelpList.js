//-----------------------------------------------------------------------------
// Window_HelpList
//
// The window for selecting a skill on the skill screen.

class Window_HelpList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height));
        this._data = [];
        this._cursorSprite.opacity = 0;
        this.opacity = 0;
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

    isCurrentItemEnabled(){
        return true;
    }

    selectLast(){
        this.select(this.index() >= 0 ? this.index() : 0);
        this.refresh();
    }

    drawItem(index){
        const help = this._data[index];
        if (help){
            var rect = this.itemRect(index);
            this.resetTextColor();
            this.setFlatMode();
            if (this.index() == index){
                this.drawBackSkewX(rect.x + 12 * (index - this.topIndex()),rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
                this.resetTextColor();
            }
            this.drawText(TextManager.getText(help.nameId),rect.x + 24, rect.y + 2, rect.width - 60);
            
            const isNew = this.newDispFlag(help);
            if (isNew){
                this.contents.fontSize = 12;
                this.changeTextColor(this.powerUpColor());
                this.drawText(TextManager.getNewText(), rect.x + 4, rect.y - 10, rect.width);        
                this.resetFontSettings();
            }
        }
    }

    newDispFlag(help){
        const keyData =_.find($gameParty.getHelpKeyData(),(helpKey) => helpKey.key == help.key);
        if (keyData){
            return !keyData.isRead;
        }
        return false;
    }

    refresh(){
        this.createContents();
        this.drawAllItems();
    }

    _updateCursor(){
    }
}