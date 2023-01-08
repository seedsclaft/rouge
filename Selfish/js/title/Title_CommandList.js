//-----------------------------------------------------------------------------
// Title_CommandList
//

class Title_CommandList extends Window_Command {
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
        return 'left';
    }

    lineHeight(){
        return 48;
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

    drawItem(index){
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        if (this.currentData() && this.currentData().symbol == this.commandSymbol(index)){
            this.drawBackFadeRight(rect.x ,rect.y + 4 ,96 ,40,this.cursorColor(),128);
            this.drawBack(rect.x + 96 ,rect.y + 4 ,rect.width -96 ,40,this.cursorColor(),128);
            this.resetTextColor();
        }
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x + 64, rect.y, rect.width, align);
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

    updateHelp() {
        if (this.currentData().symbol) {
            this.setHelpWindowText(TextManager.getText( 5010 + 10 * this._index ));
        }
    };
}
Window_TitleCommand._lastCommandSymbol = null;