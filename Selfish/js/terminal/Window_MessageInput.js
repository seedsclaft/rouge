//-----------------------------------------------------------------------------
// Window_MessageInput
//

class Window_MessageInput extends Window_Command{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height));
        this._commandText = {};
        this.initHandlers();
        this.hide();
        this.deactivate();
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
            const text = this.convertEscapeCharacters(this._mainText);
            if (this._subText){
                this.drawText(text,40,4,960,'center');
                const text2 = this.convertEscapeCharacters(this._subText);
                this.drawText(text2,40,36,960,'center');
            } else{
                this.drawText(text,0,20,this.width,'center');
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
        return 160;
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
        rect.x = 272 * index + 80;
        if (Object.keys(this._handlers).length == 1){
            rect.x += 148;
        }
        rect.y = this.height - 120;
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
            this.drawBack(rect.x, rect.y , rect.width,rect.height ,"rgba(200,24,24,196)",128);
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
}

