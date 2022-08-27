//-----------------------------------------------------------------------------
// Window_TerminalSelect
//

class Window_TerminalSelect extends Window_Selectable{
    constructor(x, y, width ,height){
        super(new Rectangle( x, y, width ,height ));
        this._lastIndex = null;
        this._cursorSprite.opacity = 0;
        this.opacity = 0;
    
        this.hide();
        this._lastX = x;
        this._selected = true;
    }

    setData(stageData){
        this._data = stageData;
        this.refresh();
        this.select(stageData.length-1);
    }

    setPositionIndex(){
        this.clearScrollStatus();
        this.smoothSelect(Math.round(this._scrollY / this.itemHeight()));
        this._selected = true;
    }

    update(){
        super.update();
        this.updateSprite();
    }

    updateSprite(){
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
        if (TouchInput.isReleased()){
            this._selected = false;
        }
        if (!TouchInput.isPressed() && this._selected == false){
            this.setPositionIndex();
        }
    }

    _updateCursor(){

    }

    showAnimation(){
        this.show();
        this.alpha = 0;
        gsap.to(this,0.25,{x:this._lastX+40,alpha:1.0});
    }

    hideAnimation(){
        this.alpha = 1;
        var self = this;
        gsap.to(this,0.25,{x:this._lastX-40,alpha:0.0, onComplete:function(){
            self.hide();
        }});
    }

    contentsHeight(){
        return 540;
    }

    itemHeight(){
        return 64;
    }

    maxItems(){
        return this._data ? this._data.length : 1;
    }

    item(){
        return this._data ? this._data[this.index()] : null;
    }

    selectLast(){
        this.select(this.index() >= 0 ? this.index() : 0);
    }

    drawItem(index){
        const album = this._data[index];
        const data = DataManager.getStageInfos(this._data[index].id);
        if (data) {
            const rect = this.itemRect(index);
            if (this.index() == index){
                this.drawBackSkewX(rect.x + (this.index() - this.topIndex()) * 18 ,rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
            }
            const isNew = _.find($gameParty._newStageIdList,(s) => s == data.id);
            if (isNew){
                this.contents.fontSize = 14;
                this.changeTextColor(this.powerUpColor());
                this.drawText(TextManager.getNewText(), rect.x + 40, rect.y , rect.width );
            }
            this.resetTextColor();
            var text;
            switch (data.category){
                case 0:
                    text = TextManager.getText(201000) + album.id;
                break;
                case 1:
                    text = 'Free';
                break;
            }
    
            this.contents.fontItalic = true;
            this.contents.fontSize = 16;
            this.drawText(text, rect.x + 68, rect.y , rect.width);
            this.contents.fontItalic = false;
            this.resetFontSettings();
            this.drawText(TextManager.getText( data.nameId ), rect.x + 96, rect.y + 22, rect.width);
            
        }
    }

    updateHelp(){

    }

    terminate(){
        gsap .killTweensOf(this);
        this.destroy();
    }
}