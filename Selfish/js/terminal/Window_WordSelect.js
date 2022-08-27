//-----------------------------------------------------------------------------
// Window_WordSelect
//

class Window_WordSelect extends Window_Selectable {
    constructor( x, y, width,height){
        super(new Rectangle( x, y, width,height));
        this._lastIndex = null;
        this._cursorSprite.opacity = 0;
        this.opacity = 0;
        this.hide();
        this.deactivate();
    }

    setData(wordData){
        this._data = wordData;
        this.selectLast();
        this.refresh();
    }

    update(){
        super.update();
        if (this._data){
            if (this._lastIndex != this.index()){
                this._lastIndex = this.index();
                this.refresh();
            }
        }
    }

    _updateCursor(){

    }

    showAnimation(){
        this.show();
        this.openness = 255;
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

    contentsHeight(){
        return this.height;
    }

    itemHeight(){
        return 48;
    }

    maxItems(){
        return this._data ? this._data.length : 1;
    }

    item(){
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    }

    selectLast(){
        this.select(this.index() >= 0 ? this.index() : 0);
    }

    drawItem(index){
        const data = this._data[index];
        if (data) {
            const rect = this.itemRect(index);
            if (this.index() == index){
                this.drawBackSkewX(rect.x - (this.index() - this.topIndex()) * 14 ,rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128,0.27);
            }
            if (this.index() == index){
                this.resetTextColor();
            } else{
                this.setFlatMode();
            }
            this.drawText(data.title,rect.x + 48,rect.y+2,rect.width -80,40);   
        }
    }

    drawNewText(x,y,width){
        this.contents.fontSize = 14;
        this.changeTextColor(this.powerUpColor());
        this.drawText(TextManager.getNewText(),x, y , width );
        this.resetFontSettings();
    }

    updateHelp(){

    }
}