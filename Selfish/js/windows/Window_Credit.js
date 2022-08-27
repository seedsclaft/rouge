//-----------------------------------------------------------------------------
// Window_Credit
//

class Window_Credit extends Window_Selectable{
    constructor(x, y, width, height){
        super(new Rectangle( x, y, width * 4/3,height* 4/3 ));
        this._cursorSprite.opacity = 0;
        this._data = null;
        this.scale.x = this.scale.y = 0.75;
        
        const spacing = 13;
        this._upArrowSprite.move(this._width - spacing, spacing - 4);
        this._downArrowSprite.move(this._width - spacing, this._height - 8);
        this._sideBarBack = new Sprite(new Bitmap(12,this.height - spacing * 3));
        this._sideBarBack.bitmap.fillRect(0,0,6,this.height - spacing * 3,"black");
        this._sideBarBack.x = this._width - spacing + 3;
        this._sideBarBack.y = spacing * 2 - 6;
        this._sideBarBack.anchor.x = 0.5;
        this._sideBarBack.alpha = 0.5;
        this.addChild(this._sideBarBack);
    }

    itemWidth(){
        return this.width - this.padding * 2;
    }

    itemHeight(){
        return 32;
    }

    maxItems(){
        return this._data ? this._data.length : null;
    }

    item(){
        return this._data ? this._data[this.index()] : null;
    }

    setData(data){
        this._data = data;
        this.refresh();
    }

    selectLast(){
        this.select(0);
    }

    drawItem(index){
        const text = this._data[index];
        if (text){
            const rect = this.itemRect(index);
            this.resetFontSettings();
            this.drawText(text, rect.x,rect.y,rect.width);
        }
    }

    update(){
        super.update();
        this.updateSideBarBack();
    }

    updateSideBarBack(){
        if (this._sideBarBack){
            this._sideBarBack.alpha = (this._upArrowSprite.visible || this._downArrowSprite.visible) ? 0.5 : 0;
        }
        if (this._scrollBar){
            this._scrollBar.alpha = (this._upArrowSprite.visible || this._downArrowSprite.visible) ? 1 : 0;
        }
    }

    updateHelp(){

    }

    refresh(){
        this.createContents();
        this.drawAllItems();
        if (this._scrollBar == null){
            this._scrollBar = new ScrollBar(this);
        }
    }

    _updateCursor(){

    }

    ensureCursorVisible(smooth) {
        if (this._cursorAll) {
            this.scrollTo(0, 0);
        } else if (this.innerHeight > 0 && this.row() >= 0) {
            const itemTop = this.row() * this.itemHeight();
            const itemBottom = itemTop + this.itemHeight();
            const scrollMin = itemBottom - this.innerHeight;
            
            if (smooth) {
                this.smoothScrollTo(0, scrollMin);
            } else {
                this.scrollTo(0, scrollMin);
            }
        }
    };
}