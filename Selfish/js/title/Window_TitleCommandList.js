//-----------------------------------------------------------------------------
// Window_TitleCommandList
//

class Window_TitleCommandList extends Window_Command {
    constructor(x,y,width,height){
        super(new Rectangle( x,y,width,height ));
        this.x = x;
        this.y = y;
        this.openness = 0;
        this.opacity = 0;
        this._lastIndex = null;
        this._cursorSprite.opacity = 0;
        this.selectLast();
    }

    static initCommandPosition(){
        Window_TitleCommand._lastCommandSymbol = null;
    }

    itemTextAlign(){
        return 'center';
    }

    makeCommandList(){
        this.addCommand(TextManager.getText(100100),   'newGame');
        this.addCommand(TextManager.getText(100200),   'continue', this.isContinueEnabled());
        this.addCommand(TextManager.getText(100400),   'option');
    }

    isContinueEnabled(){
        return DataManager.isAnySavefileExists();
    }

    processOk(){
        Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }

    selectLast(){
        if (Window_TitleCommand._lastCommandSymbol) {
            this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
        } else if (this.isContinueEnabled()) {
            this.selectSymbol('continue');
        }
    }

    itemTextAlign(){
        return 'left';
    }

    itemLineRect(index){
        const rect = this.itemRectWithPadding(index);
        const padding = (rect.height - this.lineHeight()) / 2;
        rect.x += padding * 12;
        rect.y += padding;
        rect.height -= padding * 2;
        return rect;
    }

    drawItem(index){
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        //this.setFlatMode();
        if (this.currentData() && this.currentData().symbol == this.commandSymbol(index)){
            this.drawBackSkewX(rect.x ,rect.y ,rect.width ,rect.height,this.cursorColor(),128);
            this.resetTextColor();
        }
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x + 24 + index * -12, rect.y, rect.width, align);
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
}
Window_TitleCommand._lastCommandSymbol = null;