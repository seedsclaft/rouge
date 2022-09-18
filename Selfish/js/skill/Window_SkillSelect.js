class Window_SkillSelect extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height ));
        this._category = SkillCategory.Learning;
        this.resetData();
        this.refresh();
        this.hide();
        this.deactivate();
    }

    resetData(){
        this._allData = [];
        const _learning = $gameParty.battleMembers()[0].skills();
        _learning.forEach(learn => {
            this._allData.push({type:SkillSelectType.Learning, item:learn});
        });
        const _myequip = $gameParty.battleMembers()[0].equips();
        _myequip.forEach(item => {
            if (item != null){
                this._allData.push({type:SkillSelectType.MyEquip, item:item});
            }
        });
        const _item = $gameParty.allItems();
        _item.forEach(item => {
            if (item.wtypeId && item.wtypeId == 3 && this._allData.find(a => a.item.id == item.id) != null){
                return;
            } else{
                this._allData.push({type:SkillSelectType.Item, item:item});
            }
        });
        /*
        const _equip = $gameParty.equipItems();
        _equip.forEach(item => {
            //this._allData.push({type:SkillSelectType.Equipment, item:item});
        });
        */
        console.log(this._allData)
    }

    setData(data){
        this._data = data;
        this.refresh();
    }

    setCategory(category){
        this._category = category;
        this.refresh();
    }

    contentsHeight(){
        return this.height;
    }

    maxCols(){
        return 1;
    }

    itemHeight(){
        return 40;
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
        if (!this._data || this._data.length == 0){
            return;
        }
        const _type = this._data[index].type;
        const item = this._data[index].item;
        const _player = $gameParty.battleMembers()[0];
        this.contents.fontSize = 21;
        if (item != null) {
            const rect = this.itemRect(index);
            if (this.index() == index){
                this.drawBack(rect.x +1,rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
                this.resetTextColor();
            }
            this.drawSkillIcon(item.iconIndex, rect.x + 2 + 28, rect.y + 4, rect.width);
            let name = item.name;
            if (_type == SkillSelectType.Item && $gameParty.numItems(item) > 1){
                name += "("+$gameParty.numItems(item)+")";
            }
            if (_type == SkillSelectType.MyEquip && item.wtypeId && item.wtypeId == 3 && $gameParty.numItems(item) > 1){
                name += "("+Number( $gameParty.numItems(item) + 1)+")";
            }
            this.drawText(name, rect.x + 36 + 28, rect.y + 1, rect.width,"left");

            if (_type == SkillSelectType.MyEquip && _player.equips().find(a => a == item) ){
                this.drawText("▷", rect.x + 6, rect.y + 1, rect.width,"left",true);
                this.contents.fontSize = 16;
            }
            if ((_type == SkillSelectType.Learning || _type == SkillSelectType.Item)
                && (item == _player.skillSet1() || item == _player.skillSet2()) ){
                    if (item == _player.skillSet1() && item == _player.skillSet2()){
                        this.drawText("LR", rect.x + 2, rect.y + 1, 32,"center",true);
                    } else if (item == _player.skillSet1()){
                        this.drawText("R", rect.x + 2, rect.y + 1, 32,"center",true);
                    } else{
                        this.drawText("L", rect.x + 2, rect.y + 1, 32,"center",true);
                    }
                this.contents.fontSize = 16;
            }
        }
    }

    updateHelp(){
        if (this.item()){
            //this.setHelpWindowItem(this.item().skill);
        }
    }

    refresh(){
        this.createContents();
        this._data = this.getData();
        this.drawAllItems();
    }

    getData(){
        const _category = this._category;
        switch (_category){
            case SkillCategory.All:
            return this._allData;
            case SkillCategory.Skill:
            return this._allData.filter(a => DataManager.isSkill(a.item) && a.item.stypeId == 1);
            case SkillCategory.Magic:
            return this._allData.filter(a => DataManager.isSkill(a.item) && a.item.stypeId == 2);
            case SkillCategory.Equip:
            return this._allData.filter(a => DataManager.isWeapon(a.item) || DataManager.isArmor(a.item));
            case SkillCategory.Item:
            return this._allData.filter(a => DataManager.isItem(a.item));
            case SkillCategory.Special:
            return this._allData.filter(a => DataManager.isSkill(a.item) && a.item.stypeId == 3);
            case SkillCategory.Passive:
            return this._allData.filter(a => DataManager.isSkill(a.item) && a.item.stypeId == 4);
        }
    }

    //_updateCursor(){

    //}

    _makeCursorAlpha(){
        return 255;
    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
    }
    
    processCancel(){
        this.updateInputData();
        this.deactivate();
        this.callCancelHandler();
    }
}

var SkillSelectType = {
    None:0,
    Learning:1,
    Item:2,
    Equipment:3,
    MyEquip:4,
    Skill:5,

}