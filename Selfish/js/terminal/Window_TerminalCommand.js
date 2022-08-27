
//-----------------------------------------------------------------------------
// Window_TerminalCommand
//

class Window_TerminalCommand extends Window_Command {
    constructor(x, y){
        super(new Rectangle( x, y ,264 , 48 * 8));
        gsap.to(this._cursorSprite,0,{pixi:{skewX:-15}});
        this._cursorSprite.opacity = 0;
        this.opacity = 0;
        this.alpha = 0;
        this._lastY = y;
    }

    static initCommandPosition(){
        this._lastCommandSymbol = null;
    }

    setData(data){
        this._commandData = data;
        this._lastIndex = this.index();
        this.refresh();
        this.selectLast();
    }

    makeCommandList(){
        if (this._commandData){
            this._commandData.forEach((data,index) => {
                let flag = true;
                if (data.enable && !eval(data.enable)){
                    flag = false;
                }
                if (data.isOpen && !eval(data.isOpen)){
                } else{
                    this.addCommand(TextManager.getText( data.textId ), data.key, flag);
                }
            });
        }
        this.setPositionY();
    }

    setPositionY(){
        const length = this._list.length;
        if (length > 5){
            this.y = this._lastY - (length - 5) * 12;
        }
    }

    lineHeight(){
        return 36;
    }

    drawItem(index){
        const rect = this.itemLineRect(index);
        this.setFlatMode();
        if (this.index() == index){
            this.drawBackSkewX(rect.x + index * 10,rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
            this.resetTextColor();
        }
        this.changePaintOpacity(this.isCommandEnabled(index));
        const symbol = this.commandSymbol(index);
        if (symbol == "stage"){
            const isNewStage = $gameParty.hasNewStage();
            if (isNewStage){
                this.drawNewText(rect.x + 12,rect.y - 10,rect.width);
            }
        }
        if (symbol == "material"){
        }
        if (symbol == "gameend"){
        }
        if (this.index() == index){
            this.resetTextColor();
        }
        this.drawText(this.commandName(index), rect.x + 36, rect.y+3, rect.width, "left");
    }

    drawNewText(x,y,width){
        this.contents.fontSize = 14;
        this.changeTextColor(this.powerUpColor());
        this.drawText(TextManager.getNewText(), x, y, width );
        this.resetFontSettings();
        this.setFlatMode();
    }

    processOk(){
        Window_TerminalCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }

    selectLast(){
        this.selectSymbol(Window_TerminalCommand._lastCommandSymbol);
    }

    updateHelp(){
        const currentData = this.currentData();
        if (currentData){
            const commandData = _.find(this._commandData,(command) => command.key == currentData.symbol);
            let id = commandData.helpTextId;
            if (commandData.key == "gameend"){
            }
            this.setHelpWindowText(TextManager.getText(id));
        }
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

    showAnimation(){
        gsap.to(this, 0.25, {x:-24,alpha:1});
    }

    hideAnimation(){
        gsap.to(this, 0.25, {x:-120,alpha:0});
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        gsap.killTweensOf(this);
        if (this._helpWindow){
            this._helpWindow.destroy();
        }
        this._helpWindow = null;
        this.destroy();
    }
}
Window_TerminalCommand._lastCommandSymbol = null;