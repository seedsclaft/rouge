//-----------------------------------------------------------------------------
// Window_BackLog
//

class Window_BackLog extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height ));
        this._data = [];
        this.hide();
        this.deactivate();
        this._cursorSprite.visible = false;
    }

    makeItemList(){
        this._data = Window_BackLog._logData;
    }

    selectLast(){
        this.forceSelect(this._data ? this._data.length-1 : 0);
    }

    drawItem(index){
        const logData = this._data[index];
        if (logData) {
            const rect = this.itemRect(index);
            this.changeTextColor(this.normalColor());

            // 現在⇒
            if (this._data.length-1 == index){
                this.drawBack(rect.x, rect.y , rect.width,rect.height ,"rgba(216,96,132,255)",164);
                this.drawText("▶", rect.x + 36, rect.y , rect.width, 'left');  
            }
            //本文
            let marginX = logData.name ? 24 : 96;
            this.drawText(logData.logText, rect.x + marginX, rect.y , rect.width, 'left');       
        }
    }

    maxItems(){
        return this._data ? this._data.length : 0;
    }

    itemHeight(){
        return 40;
    }

    refresh(){
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    }

    _updateCursor(){

    }
}
Window_BackLog._logData = [];
Window_BackLog._lastActorName = "";