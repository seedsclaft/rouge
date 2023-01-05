class Menu_StageList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
        this.opacity = 0;
        this._cursorSprite.opacity = 0;
        this._window = [];
    }

    itemHeight(){
        return 128;
    }

    setStageData(data){
        this._data = data;
        if (this._window.length < this._data.length){
            const _count = this._data.length - this._window.length;
            for (let i = 0;i < _count;i++){
                let sprite = new Window_Base(new Rectangle( 0,0,400,this.itemHeight() - 32));
                this.addChildAt(sprite,i);
                this._window.push(sprite);
                sprite.updateTone = () => {};
            }
        }
        super.refresh();
    }

    item(){
        return this._data != null ? this._data[this.index()] : 0;
    }

    maxItems() {
        return this._data != null ? this._data.length : 0;
    };

    drawItem(index){
        const _stage = this._data[index];
        if (_stage){
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(index == this.index());
            this._window[index].y = rect.y;
            this.resetTextColor();
            this.contents.fontSize = 21;
            this.drawText(TextManager.getText( _stage.titleTextId ), rect.x, rect.y,rect.width);
            this.contents.fontSize = 18;
            this.drawText(TextManager.getText( 14000 ) + " : " + _stage.turns, rect.x, rect.y + 32,rect.width);
            this.drawText(TextManager.getText( 14010 ) + " : " + "0", rect.x + 240, rect.y + 32,rect.width);
            
            const tone = $gameSystem.windowTone();
            if (index == this.index()){
                this.drawTextEx(_stage.description , 424, 32,560);
                this._window[index].setTone(tone[0], tone[1], tone[2]);
            } else{
                this._window[index].setTone(tone[0]-120, tone[1]-120, tone[2]-120);
            }
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

    _updateCursor(){

    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}