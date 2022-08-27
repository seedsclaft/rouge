//-----------------------------------------------------------------------------
// Window_MenuListCommand
//

class Window_MenuListCommand extends Window_Command{
    constructor(x, y,menuCommand){
        super(x, y,menuCommand);
    }

    initialize(x, y,menuCommand){
        this._commandData = menuCommand;
        super.initialize(new Rectangle( x, y ,264 , 48 * this._commandData.length));
        gsap.to(this._cursorSprite,0,{pixi:{skewX:-15}});
        this._cursorSprite.opacity = 0;
        this.opacity = 0;
        this._lastIndex = this.index();
        this.selectLast();
        if (Window_MenuListCommand._lastCommandSymbol == 'Library'){
            this._isSub = true;
        }
        this.refresh();
        if (Window_MenuListCommand._lastCommandSymbol == 'Library'){
            this.deselect();
            this.deactivate();
        }
    }

    static initCommandPosition(){
        this._lastCommandSymbol = null;
    }

    makeCommandList(){
        let flag;
        this._commandData.forEach((data,index) => {
            flag = true;
            if (index == 2){
                flag = $gameParty.allMembers().length > 1;
            }
            if (index == 3){
                flag = $gameSwitches.value(1);
            }
            if (index == 7){
                flag = $gameParty.hasStage(2);
            }
            this.addCommand(TextManager.getText( data.textId ), TextManager.getText( data.textId ), flag);
        });
    }

    lineHeight(){
        return 36;
    }

    drawItem(index){
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.setFlatMode();
        if (this.index() == index){
            this.drawBackSkewX(rect.x + index * 10,rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
            this.resetTextColor();
        }
        this.changePaintOpacity(this.isCommandEnabled(index));
        const text = this.commandName(index);
        if (this._isSub && index > 3){
            this.drawText(text, rect.x + 36, rect.y+2 + (index-4) * 40 + 156, rect.width, "left");
        } else{
            this.drawText(text, rect.x + 36, rect.y+2, rect.width, "left");
        }
        const isNew = this.newDispFlag(index);
        if (isNew){
            this.contents.fontSize = 12;
            this.changeTextColor(this.powerUpColor());
            this.drawText(TextManager.getNewText(), rect.x + 12, rect.y - 10, rect.width);        
            this.resetFontSettings();
        }
    }

    newDispFlag(index){
        if (index == 1){
            for (let i = 0; i < $gameParty.members().length ; i++){
                let actor = $gameParty.members()[i];
                if ( _.find($gameParty._newSkillIdList,(s) => _.find(actor._skills,(skillId) => skillId == s) )){
                    return true;
                }
            }
        }
        if (index == 3){
            return $gameSwitches.value(1) && _.find($gameParty.getHelpKeyData() ,(helpkey) => !helpkey.isRead);
        }
        return false;
    }

    isFormationEnabled(){
        return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
    }

    isSaveEnabled(){
        return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
    }

    processOk(){
        if (EventManager.busy()){
            return;
        }
        Window_MenuListCommand._lastCommandSymbol = this.currentSymbol();
        Window_Command.prototype.processOk.call(this);
    }

    updateHelp(){
        if (this._commandData[this.index()]){
            const id = this._commandData[this.index()].helpTextId;
            this.setHelpWindowText(TextManager.getText(id));
        }
    }

    selectLast(){
        this.selectSymbol(Window_MenuListCommand._lastCommandSymbol);
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

    subCommmandMode(isSub){
        this._isSub = isSub;
        this.refresh();
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}
Window_MenuListCommand._lastCommandSymbol = null;