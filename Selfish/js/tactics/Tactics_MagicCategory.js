class Tactics_MagicCategory extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
    }

    category(){
        return this._data[this.index()];
    }
    
    setMagicCategory(data){
        this._data = data;
        this.refresh();
    }

    itemHeight() {
        return 40;
    };

    maxCols() {
        return this._data != null ? this._data.length : 0;
    };

    maxItems() {
        return this._data.length;
    };

    drawItem(index){
        const _category = this._data[index];
        if (_category){
            const rect = this.itemLineRect(index);
            this.drawIcon(_category.iconIndex,rect.x , rect.y + 2);
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