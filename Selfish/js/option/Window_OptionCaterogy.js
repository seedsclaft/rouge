//-----------------------------------------------------------------------------
// Window_OptionCaterogy
//

class Window_OptionCaterogy extends Window_Command {
    constructor(x,y){
        super(new Rectangle( x, y, 240, 540 ));
    }

    itemHeight(){
        return 40;
    }

    setData(category){
        this.clearCommandList();
        this.createContents();
        this._data = category;
        category.forEach((nameId ,index) => {
            this.addCommand(TextManager.getText(Number( nameId )), index);
        });
        this.updatePlacement();
        this.drawAllItems();
    }

    refresh(){
        this.clearCommandList();
        this.createContents();
        super.refresh();
    }

    updatePlacement(){
        this.height = this._data.length * this.itemHeight() + 24;
    }

    updateHelp(){
        const helpTextId = Number( this._data[this.index()] ) + 1;
        this.setHelpWindowText(TextManager.getText(helpTextId));
    }

    drawItem(index){
        let category = this._list[index];
        let rect = this.itemRect(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(category.name, rect.x + 4, rect.y, rect.width, 'left');
    }

}