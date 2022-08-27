//-----------------------------------------------------------------------------
// Window_MagicInfoList
//

class Window_MagicInfoList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height ));
        this._data = [];
        this.opacity = 0;
        //this._cursorSprite.opacity = 0;
        gsap.to(this._cursorSprite,0,{pixi:{ skewX:-15}});
    }

    setData(data){
        this._data = data;
        this.refresh();
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
        if (this.index() >= this._data.length){
            this.select(this._data.length - 1);
            this.refresh();
        } else{
            this.select(this.index() >= 0 ? this.index() : 0);
        }
    }

    drawItem(index){
        const magicId = this._data[index];
        if (magicId) {
            const skill = $dataSkills[magicId];
            const rect = this.itemRect(index);
            //this.setFlatMode();
            let elementCoror = $gameColor.skillElementColor(skill.damage.elementId);
            if (this.index() == index){
                this.drawBackSkewX(rect.x + 13 * (index - this.topIndex()),rect.y+2,rect.width-2,this.itemHeight()-8,elementCoror,128);
            } else{
                this.drawBackFadeLeftSkewX(rect.x + 13 * (index - this.topIndex()),rect.y+2,rect.width-2,this.itemHeight()-8,"rgba(0,0,0,96)","rgba(0,0,0,0)",128);
            }
            this.resetTextColor();
            
            this.drawBack(rect.x , rect.y+2 , 12 , this.itemHeight()-8, elementCoror , 200);
            this.drawSkillIcon(skill.iconIndex,rect.x + 16, rect.y + 6);
            this.drawText(TextManager.getSkillName(skill.id), rect.x + 52, rect.y + 2, rect.width - 60);
            
            if (index == this.index()){
                if (this._cursorSprite){
                    this._cursorSprite.x = rect.x + 0;
                    this._cursorSprite.y = rect.y + 0;
                    this._cursorSprite.alpha = (skill.id > 1000) ? 0.9 : 0;
                }
            }
        }
    }

    updateHelp(){
        if (this.item()){
            this.setHelpWindowItem($dataSkills[this.item()]);
        }
    }

    refresh(){
        this.createContents();
        this.drawAllItems();
    }

    _updateCursor(){

    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
    }
}