//-----------------------------------------------------------------------------
// Window_OptionKeyAssign
//

class Window_OptionKeyAssign extends Window_Selectable {
    constructor(x,y){
        super(new Rectangle(x,y,540, 320));
        this._data = [];
        this.hide();
        this.deactivate();
    }

    setData(keyAssign){
        this._data = keyAssign;
        this.refresh();
    }

    refresh(){
        this.createContents();
        this.drawAllItems();
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
    }

    setKeyHelpWindow(window){
        this._keyHelpWindow = window;
    }

    maxCols(){
        return 2;
    }

    drawItem(index){
        const keyData = this._data[index];
        let rect = this.itemRect(index);
        let statusWidth = this.statusWidth();
        let titleWidth = rect.width - statusWidth;
        this.resetTextColor();
        //this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(TextManager.getText(index * 10 + 800), rect.x + 4, rect.y + 4, titleWidth, 'left');
        this.statusText(keyData, rect.x + 208, rect.y + 12);
    }

    statusWidth(){
        return 80;
    }

    statusText(keyData,x,y){
        let width = 24;
        if (keyData == 68 || keyData == 70 || keyData == 72 || keyData == 74){
            width = 48;
            x -= 12;
        }
        const bitmap = ImageManager.loadSystem('keyMapIcons');
        const pw = width;
        const ph = 24;
        const sx = keyData % 16 * 24;
        const sy = Math.floor(keyData / 16) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
    }


    updateHelp(){
        this.setHelpWindowText(TextManager.getItemDescription(24));
    }
}