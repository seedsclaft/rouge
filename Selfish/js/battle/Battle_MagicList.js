class Battle_MagicList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
    }

    setBattleMagic(data){
        this._data = data;
        super.refresh();
    }

    maxItems() {
        return this._data != null ? this._data.length : 0;
    };

    itemHeight(){
        return 72;
    }

    drawItem(index){
        const _magic = this._data[index];
        if (_magic){
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.changePaintOpacity(_magic.enable);
            this.contents.fontSize = 21;
            this.drawItemName(_magic.skill, rect.x, rect.y - 12,rect.width);
            if (_magic.skill.stypeId == Game_BattlerBase.SKILL_TYPE_MAGIC){
                this.drawText(_magic.cost, rect.x, rect.y -12, rect.width, "right");
            }
            this.contents.fontSize = 16;
            if (_magic.skill.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE) {
                this.drawText(TextManager.getText(1560), rect.x, rect.y + 16, rect.width);
                if (_magic.skill.damage.formula){
                    this.drawText(TextManager.getText(1540) + " " + TextManager.getText(1550), rect.x + 80, rect.y + 16, rect.width);
                    this.drawText(_magic.skill.damage.formula, rect.x + 136, rect.y + 16, 120, "rigth");
                }
            } else
            if (_magic.skill.range != null){
                let range = TextManager.getText(1510);
                if (_magic.skill.range == 1) range = TextManager.getText(1520);
                this.drawText(TextManager.getText(1500) + range, rect.x, rect.y + 16, rect.width);
            
                if (_magic.skill.damage && _magic.skill.damage.formula != ""){
                    this.drawText(TextManager.getText(1540) + " " + TextManager.getText(1550), rect.x + 80, rect.y + 16, rect.width);
                    this.drawText("x" + (Number(_magic.skill.damage.formula) * 0.01).toFixed(2), rect.x + 136, rect.y + 16, 120, "rigth");
                }
            } else
            if (_magic.skill.scope >= 7 && _magic.skill.scope <= 14){
                if (_magic.skill.scope == 7){
                    this.drawText(TextManager.getText(1580), rect.x, rect.y + 16, rect.width);
                } else
                if (_magic.skill.scope == 8){
                    this.drawText(TextManager.getText(1570), rect.x, rect.y + 16, rect.width);
                } else
                if (_magic.skill.scope == 11){
                    this.drawText(TextManager.getText(1590), rect.x, rect.y + 16, rect.width);
                }
                
                if (_magic.skill.damage && _magic.skill.damage.formula != ""){
                    this.drawText(TextManager.getText(1540) + " " + TextManager.getText(1550), rect.x + 80, rect.y + 16, rect.width);
                    this.drawText(_magic.skill.damage.formula, rect.x + 136, rect.y + 16, 120, "rigth");
                }
            }
            const _textLine = _magic.skill.description.split("\n");
            _textLine.forEach((text,index) => {
                let textWidth = this.contents.measureTextWidth(text);
                this.drawTextEx(text,rect.width - textWidth + 12,rect.y + 20 + index * 26 - (_textLine.length-1) * 26,rect.width);
            });
        }
    }

    drawTextEx(text, x, y, width){
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);
        return textState.outputWidth;
    }

    isCurrentItemEnabled () {
        return this.item().enable;
    };

    updateHelp(){
    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
    }

    //_updateCursor(){

    //}

    item(){
        return this._data.length > this.index() ? this._data[this.index()] : null;
    }

    selectLast(skillId){
        const _findIndex = this._data.findIndex(a => a.skill.id == skillId);
        if (_findIndex > -1){
            this.smoothSelect(_findIndex);
        } else{
            this.smoothSelect(0);
        }
    }

    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}