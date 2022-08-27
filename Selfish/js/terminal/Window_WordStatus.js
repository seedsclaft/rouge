//-----------------------------------------------------------------------------
// Window_WordStatus
//

class Window_WordStatus extends Window_Selectable {
    constructor(x, y, width, height){
        super(new Rectangle( x, y, width, height ));
        this._cursorSprite.opacity = 0;
        
        this._lastIndex = this.index();
        this.opacity = 0;
        this.padding = 24;
        this.hide();

        const spacing = 13;
        this._upArrowSprite.move(this._width - spacing, spacing);
        this._downArrowSprite.move(this._width - spacing, this._height - 12);
        this._sideBarBack = new Sprite(new Bitmap(12,this.height - spacing * 3));
        this._sideBarBack.bitmap.fillRect(0,0,6,this.height - spacing * 3,"black");
        this._sideBarBack.x = this._width - spacing + 3;
        this._sideBarBack.y = spacing * 2 - 6;
        this._sideBarBack.anchor.x = 0.5;
        this._sideBarBack.alpha = 0.5;
        this.addChild(this._sideBarBack);
    }

    setData(worditems){
        this._data = [];
        this._listHeigth = [];
        this._wordData = [];
        let textState;
        let lines;
        worditems = _.sortBy(worditems,(w) => w.id);
        worditems.forEach((word,index) => {
            textState = this.createTextState( word.text ,0,0,0);
            lines = textState.text.slice(textState.index).split("\n");
            if (word.eventName){
                lines.push(TextManager.getText(500200));
            }
            if (index != worditems.length-1){
                lines.push("");
            }
    
            lines.forEach(text => {
                this._data.push(text);
                this._listHeigth.push(index);
                this._wordData.push(word);
            });
        });
        this.refresh();
        this.select(0);
        if (this._scrollBar){
            this._scrollBar._onScrollNoActive();
        }
    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
        this.updateSideBarBack();
    }

    refresh(){
        super.refresh();
    }

    updateSideBarBack(){
        if (this._sideBarBack){
            this._sideBarBack.alpha = (this._upArrowSprite.visible || this._downArrowSprite.visible) ? 0.5 : 0;
        }
    }

    _updateCursor(){

    }

    maxItems(){
        return this._data ? this._data.length : 1;
    }

    item(){
        return this._data[this.index()];
    }

    selectLast(){
        this.select(this.index() >= 0 ? this.index() : 0);
    }

    itemHeight(){
        return 32;
    }

    backY(){
        let y = 0;
        this._listHeigth.forEach(heightIndex => {
            if (heightIndex < this._listHeigth[this.index()]){
                y += 1;
            }
        });
        return y * this.itemHeight();
    }

    backHeight(){
        let h = 0;
        this._listHeigth.forEach(heightIndex => {
            if (heightIndex === this._listHeigth[this.index()]){
                h += 1;
            }
        });
        return h - this._scrollY / this.itemHeight();
    }

    backDraw(i){
        return this.index() >= 0 && this._listHeigth[this.index()] == this._listHeigth[i];
    }

    drawItem(index){
        if (this._data[index]){
            var rect = this.itemRect(index);
            //this.setFlatMode();
            if (this.backDraw(index)){
                this.drawBack(rect.x - 8, rect.y, rect.width + 16,this.itemHeight() ,this.cursorColor(),128);
            }
            this.drawTextEx(this._data[index],rect.x,rect.y -4,rect.width,index);
        }
    }

    drawTextEx(text, x, y, width,index){
        this.resetFontSettings(index);
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);
        return textState.outputWidth;
    }

    resetFontSettings(index){
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = 21;//$gameSystem.mainFontSize();
        if (this.backDraw(index)){
            this.resetTextColor();
        } else{
            this.changeTextColor('rgba(40, 40, 40, 1)');
        }
    }

    cursorDown(wrap){
        const index = this.index(); // 移動前
        const itemIndex = this._listHeigth[index];
        let next = index;
        this._listHeigth.forEach((height,i) => {
            if (height == (itemIndex + 1)){
                next = i - 1;
            }
        });
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((next + maxCols) % maxItems);
        }
    }

    cursorUp(wrap){
        const index = Math.max(0, this.index());
        const itemIndex = this._listHeigth[index];
        let next = index;
        this._listHeigth.forEach((height,i) => {
            if (height == (itemIndex - 1) && next == index){
                next = i + 1;
            }
        });
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index >= maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((next - maxCols + maxItems) % maxItems);
        }
    }

    showAnimation(){
        this.show();
        this.openness = 255;
        //this._cursorSprite.alpha = 1;
        this.alpha = 0;
        gsap.to(this,0.25,{alpha:1.0});
    }

    hideAnimation(){
        this.alpha = 1;
        this.close();
        let self = this;
        gsap.to(this,0.25,{alpha:0.0, onComplete:function(){
            self.hide();
        }});
    }

    isCurrentItemEnabled(){
        const word = this._wordData[this.index()];
        return word && word.eventName;
    }

    wordItem(){
        const itemId = this._wordData[this.index()];
        return itemId;
    }
}