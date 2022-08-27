//-----------------------------------------------------------------------------
// Window_LibraryCommand
//

class Window_LibraryCommand extends Window_Command{
    constructor(x, y,libraryCommand){
        super(x, y,libraryCommand);
    }

    initialize(x,y,libraryCommand){
        this._commandData = libraryCommand;
    
        super.initialize(new Rectangle( x, y ,260 ,48 * this._commandData.length));
        gsap.to(this._cursorSprite,0,{pixi:{skewX:-15}});
        this._cursorSprite.opacity = 0;
        this.opacity = 0;
        this._lastIndex = this.index();
        this.selectLast();
        this.refresh();
        if (Window_MenuListCommand._lastCommandSymbol == 'Library'){
            this.show();
            this.activate();
        } else{
            this.hide();
            this.deactivate();
        }
    }

    static initCommandPosition(){
        this._lastCommandSymbol = null;
    }

    itemHeight(){
        return 40;
    }

    makeCommandList(){
        this._commandData.forEach((data,index) => {
            let flag = true;
            this.addCommand(TextManager.getText( data.textId ), TextManager.getText( data.textId ), flag);
        });
    }

    drawItem(index){
        const rect = this.itemRect(index);
        this.resetTextColor();
        this.setFlatMode();
        if (this.index() == index){
            this.drawBackSkewX(rect.x + index * 10,rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
            this.resetTextColor();
        }
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x + 56, rect.y + 2, rect.width, "left");
    
        const isNew = this.newDispFlag(index);
        if (isNew){
            this.contents.fontSize = 12;
            this.changeTextColor(this.powerUpColor());
            this.drawText(TextManager.getNewText(), rect.x + 32, rect.y - 10, rect.width);        
            this.resetFontSettings();
        }
    }

    newDispFlag(index){
        if (index == 0){
            return $gameSwitches.value(1) && _.find($gameParty.getHelpKeyData() ,(helpkey) => !helpkey.isRead);
        }
        return false;
    }

    processOk(){
        Window_LibraryCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }

    selectLast(){
        this.selectSymbol(Window_LibraryCommand._lastCommandSymbol);
    }

    updateHelp(){
        const id = this._commandData[this.index()].helpTextId;
        this.setHelpWindowText(TextManager.getText(id));
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
Window_LibraryCommand._lastCommandSymbol = null;