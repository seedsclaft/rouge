//-----------------------------------------------------------------------------
// Window_Confirm
//

class Window_Confirm extends Window_Command{
    constructor(){
        const _marginX = 40;
        const _height = 184;
        super(new Rectangle (-1 * _marginX,Graphics.height / 2 - _height / 2,Graphics.width + _marginX * 2,_height));
        //this.openness = 0;
        this._commandText = {};
        this._lastIndex = this.index();
        this._canRepeat = false;
        this._cursorSprite.opacity = 0;
    }

    setTextData(mainText,subText){
        this._mainText = mainText;
        this._subText = subText;
    }


    setCommandText(key,text){
        this._commandText[key] = text;
    }

    refresh(){
        this.createContents();
        super.refresh();
        if (this._mainText){
            if (this._subText){
                const text = this.convertEscapeCharacters(this._mainText);
                this.drawText(text,40,8,Graphics.width,'center');
                const text2 = this.convertEscapeCharacters(this._subText);
                this.drawText(text2,40,40,Graphics.width,'center');
            } else{
                const text = this.convertEscapeCharacters(this._mainText);
                this.drawText(text,40,24,Graphics.width,'center');
            }
        }
    }

    maxCols(){
        if (this._commandText){
            return Object.keys(this._commandText).length;
        }
        return 1;
    }

    topRow(){
        return 0;
    }

    itemWidth(){
        return 200;
    }

    itemHeight(){
        return 40;
    }

    makeCommandList(){
        if (this._handlers){
            Object.keys(this._handlers).forEach(key => {
                this.addCommand(this._commandText[key],  key);
            });
        }
    }

    itemRect(index){
        let rect = new Rectangle();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        const offsetX = (Graphics.width) - Object.keys(this._handlers).length * this.itemWidth();
        rect.x = this.itemWidth() * index + 20 + offsetX / 2;
        rect.y = this._height - 88;
        return rect;
    }

    itemTextAlign(){
        return 'center';
    }

    drawItem(index){
        const rect = this.itemRect(index);
        const align = this.itemTextAlign();
        if (index == this.index()){
            this.resetTextColor();
            this.drawBack(rect.x, rect.y , rect.width,rect.height ,"rgba(216,96,132,255)",164);
        }
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
    }

    initHandlers(){
        this._handlers = {};
    }

    updateOpen(){
        if (this._opening) {
            this.openness += 64;
            if (this.isOpen()) {
                this._opening = false;
            }
        }
    }

    _refreshCursor(){

    }
}

