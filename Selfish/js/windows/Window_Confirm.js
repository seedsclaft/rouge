//-----------------------------------------------------------------------------
// Window_Confirm
//

class Window_Confirm extends Window_Command{
    constructor(){
        super(new Rectangle (-40,240,1280 + 120,200));
        this.openness = 0;
        this._commandText = {};
        this._lastIndex = this.index();
        this._canRepeat = false;
        this._cursorSprite.opacity = 0;
    }

    setMainText(mainText){
        this._mainText = mainText;
    }

    setSubText(subText){
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
                var text = this.convertEscapeCharacters(this._mainText);
                this.drawText(text,40,8,1280,'center');
                var text2 = this.convertEscapeCharacters(this._subText);
                this.drawText(text2,40,40,1280,'center');
            } else{
                var text = this.convertEscapeCharacters(this._mainText);
                this.drawText(text,40,24,1280,'center');
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
        return 280;
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
        rect.x = 360 * index + 360;
        if (Object.keys(this._handlers).length == 1){
            rect.x += 360 / 2;
        }
        rect.y = 112;
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

