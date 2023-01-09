class Tactics_CommandList extends Window_HorzCommand{
    constructor(x, y, width,commandData){
        super(x, y,width,commandData);
    }

    initialize(x, y, width, commandData){
        this._commandData = commandData;
        this._iconSprites = [];
        super.initialize(new Rectangle( x, y ,width , commandData.length * 40));
        this._cursorSprite.opacity = 0;
        this.opacity = 0;
        this._lastIndex = this.index();
        this.selectLast();
        this.refresh();
        
        let commandListBack = new Sprite();
        commandListBack.bitmap = ImageManager.loadSystem("textplateC");
        commandListBack.x = 52 - x;
        commandListBack.y = 32;
        commandListBack.scale.x = 1.2;
        commandListBack.scale.y = 1.2;
        this.addChildAt(commandListBack,1);
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

    lineHeight(){
        return 88;
    }

    drawItem(index){
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.contents.fontSize = 21;
        if (this.index() == index){
            //this.drawBackSkewX(rect.x + index * 10,rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
            //this.resetTextColor();
        }
        this.changePaintOpacity(this.isCommandEnabled(index));
        const iconPath = this._commandData[index].iconPath;
        if (this._iconSprites.length-1 < index){
            let sprite = new Sprite();
            sprite.anchor.x = sprite.anchor.y = 0.5;
            this.addChild(sprite);
            this._iconSprites.push(sprite);
        }
        this._iconSprites[index].bitmap = ImageManager.loadIcon(iconPath);
        this._iconSprites[index].x = rect.x + 48;
        this._iconSprites[index].y = rect.y + 40;
        /*
        if (iconPath){
            const bitmap = ImageManager.loadIcon(iconPath);
            const pw = 64;
            const ph = 64;
            this.contents.blt(bitmap, 0, 0, pw, ph, rect.x, rect.y);
        }
        */
        const text = this.commandName(index);
        
        this.contents.drawText(text, rect.x, rect.y + 28, rect.width, this.lineHeight(), "center",true);
        /*
        const isNew = this.newDispFlag(index);
        if (isNew){
            this.contents.fontSize = 12;
            this.changeTextColor(this.powerUpColor());
            this.drawText(TextManager.getNewText(), rect.x + 12, rect.y - 10, rect.width);        
            this.resetFontSettings();
        }
        */
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
            this.updateIcons();
        }
    }

    refresh(){
        super.refresh();
        this.updateIcons();
    }

    updateIcons(){
        this._iconSprites.forEach(sprite => {
            gsap.killTweensOf(sprite.scale);
            sprite.scale.x = sprite.scale.y = 1;
        });
        if (this._iconSprites[this.index()]){
            gsap.to(this._iconSprites[this.index()].scale,0.4,{x:1.1,y:1.1,repeat:-1,yoyo:true});
        }
    }

    _updateCursor(){

    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}