class Window_SkillCategory extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height ));
        this._data = [
            SkillCategory.Skill,
            SkillCategory.Magic,
            SkillCategory.Equip,
            SkillCategory.Item,
            SkillCategory.Special,
            SkillCategory.Passive,
        ];
        this.padding = 8;
        //this.refresh();
        this.select(0);
        this.hide();
    }

    maxPageRows(){
        return this._data.length;
    }

    contentsHeight(){
        return this.height;
    }

    maxCols(){
        return this._data ? this._data.length : 1;
    }

    itemHeight(){
        return 48;
    }

    maxItems(){
        return this._data ? this._data.length : 1;
    }

    category(){
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    }

    selectLast(){
        this.select(this.index() >= 0 ? this.index() : 0);
    }

    drawItem(index){
        const category = this._data[index];
        this.contents.fontSize = 14;
        if (category != null) {
            const rect = this.itemRect(index);
            if (this.index() == index){
                this.drawBack(rect.x + 1,rect.y + 1,rect.width - 2,this.itemHeight()-2,this.cursorColor(),128);
                //this.resetTextColor();
            }
            this.drawSkillIcon(this.getIconData(category), rect.x + 4, rect.y + 2, rect.width);
            const _text = TextManager.getText( this.getTextData(category) );
            this.drawText(_text, rect.x + 2, rect.y + 18, rect.width,"center");
        }
    }

    updateHelp(){
        if (this.item()){
            //this.setHelpWindowItem(this.item().skill);
        }
    }

    refresh(){
        this.createContents();
        this.drawAllItems();
    }

    //_updateCursor(){

    //}

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
    }

    getIconData(category){
        switch (category){
            case SkillCategory.All:
            return 209;
            case SkillCategory.Skill:
            return 76;
            case SkillCategory.Magic:
            return 79;
            case SkillCategory.Equip:
            return 132;
            case SkillCategory.Item:
            return 228;
            case SkillCategory.Special:
            return 186;
            case SkillCategory.Passive:
            return 82;
        }
    }

    getTextData(category){
        switch (category){
            case SkillCategory.All:
            return 1400;
            case SkillCategory.Skill:
            return 1410;
            case SkillCategory.Magic:
            return 1420;
            case SkillCategory.Equip:
            return 1430;
            case SkillCategory.Item:
            return 1440;
            case SkillCategory.Special:
            return 1450;
            case SkillCategory.Passive:
            return 1460;
        }
    }
}

var SkillCategory ={
    All : 0,
    Skill: 1,
    Magic : 2,
    Equip : 3,
    Item : 4,
    Special : 5,
    Passive : 6,
}