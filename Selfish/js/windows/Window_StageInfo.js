//-----------------------------------------------------------------------------
// Window_StageInfo
//

class Window_StageInfo extends Window_Selectable{
    constructor(x, y, width, height){
        super(new Rectangle( x, y, width,height ));
        this._bitmap = ImageManager.loadSystem('plateA');
        this._stage = null;
        this._cursorSprite.opacity = 0;
        this._canRepeat = false;
    }

    itemWidth(){
        return this.width - this.padding * 2;
    }

    itemHeight(){
        return this.height - this.padding * 2;
    }

    maxItems(){
        return 1;
    }

    item(){
        return this._stage ? this._stage : null;
    }

    selectLast(){
        this.select(0);
    }

    itemRect(index){
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    }

    drawStage(){
        const marginX = $dataOption.getUserData('language') == LanguageType.English ? 240 : 160;
        if (this._stage){
            const padding = 12;
            const spacing = 12;
            this.contents.blt(this._bitmap, 0, 0, 96, 30, padding + 26, spacing + 6);
            let text = TextManager.getText(201000) + this._stage.id;
    
            this.contents.fontItalic = true;
            this.contents.fontSize = 21;
            this.drawText(text, padding - 4, spacing  + 1, 160,'center');
            this.resetFontSettings();
            this.contents.fontItalic = false;
            this.drawText(TextManager.getText(DataManager.getStageInfos(this._stage.id).nameId), padding*2 + marginX, spacing, 400);
            
            let line = 0;
            this.drawText(TextManager.getText(1000100),padding*2,this.lineHeight() + spacing*2,240,100);
            if (this._stage.loseType == 0){
                this.drawText(TextManager.getText(1000300),padding*2 + marginX,this.lineHeight() + spacing*2,320,100);
            } else{
                this.drawText(TextManager.getText(1000400),padding*2 + marginX,this.lineHeight() + spacing*2,320,100);
            }
            this.drawText(TextManager.getText(1000200),padding*2,this.lineHeight() * 2 + spacing*3,240,100);
            $gameParty.members().forEach(member => {
                this.drawText(member.name() + TextManager.getText(1000500),padding*2 + marginX,this.lineHeight() *(2+line) + spacing*3,320,100);
                line += 1;
            });
            if (this._stage.loseType == 1){
                this.changeTextColor(this.crisisColor());
                this.drawText(TextManager.getText(1000600),padding*2 + marginX,this.lineHeight() * (2+line) + spacing*3,320,100);
                this.resetFontSettings();
            }
        }
    }

    updateHelp(){

    }

    refresh(stageData){
        this._stage = stageData;
        this.createContents();
        this.drawStage();
    }

    _updateCursor(){

    }
}