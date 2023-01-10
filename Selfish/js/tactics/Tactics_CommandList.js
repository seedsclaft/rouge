class Tactics_CommandList extends Window_HorzCommand{
    constructor(x, y, width,commandData){
        super(x, y,width,commandData);
    }

    initialize(x, y, width, commandData){
        this._commandData = commandData;
        this._iconSprites = [];
        this._padding = 0;
        super.initialize(new Rectangle( x, y ,width , 48));
        this._cursorSprite.opacity = 0;
        this._padding = 0;
        //this.opacity = 0;
        this._lastIndex = this.index();
        this.selectLast();
        this.refresh();
    }

    currentCommand() {
        return this._commandData[this.index()];
    };

    maxCols() {
        return 7;
    };

    static initCommandPosition(){
        this._lastCommandSymbol = null;
    }

    makeCommandList(){
        this._commandData.forEach(data => {
            this.addCommand(TextManager.getText( data.textId ), data.key, true);
        });
    }

    contentsWidth(){
        return 1040;
    }

    lineHeight(){
        return 40;
    }

    ensureCursorVisible(){}

    itemRect (index) {
        const maxCols = this.maxCols();
        const itemWidth = this.itemWidth();
        const itemHeight = this.itemHeight();
        const colSpacing = this.colSpacing();
        const rowSpacing = this.rowSpacing();
        const col = index % maxCols;
        const row = Math.floor(index / maxCols);
        let x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
        const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
        const width = itemWidth - colSpacing;
        const height = itemHeight - rowSpacing;
        if (index < 4){
            x += (4-index) * 8;
        } else
        if (index > 4){
            x -= (index-4) * 8;
        }
        return new Rectangle(x, y, width, height);
    };

    drawItem(index){
        let rect = this.itemLineRect(index);
        this.resetTextColor();
        this.contents.fontSize = 21;
        if (this.index() == index){
            this.drawBack(rect.x - 8 ,rect.y,rect.width + 16,this.itemHeight() - 8,this.cursorColor(),128);
            this.resetTextColor();
        }
        this.changePaintOpacity(this.isCommandEnabled(index));
        const text = this.commandName(index);
        
        this.contents.drawText(text, rect.x, rect.y , rect.width, this.lineHeight(), "center",false);

    }

    activate(){
        super.activate();
        this.visible = true;
    }

    processOk(){
        if (EventManager.busy()){
            return;
        }
        this.visible = false;
        super.processOk();
    }

    updateHelp(){
        if (this._commandData[this.index()]){
            const id = this._commandData[this.index()].helpTextId;
            this.setHelpWindowText(TextManager.getText(id));
        }
    }

    selectLast(){
    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
            this.updateHelp();
            //this.updateIcons();
        }
    }

    refresh(){
        super.refresh();
    }
    _updateCursor(){

    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}