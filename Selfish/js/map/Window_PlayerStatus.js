class Window_PlayerStatus extends Window_Base{
    constructor(x,y){
        super(x,y);
        this.hide();
    }

    setup(battler){
        this._battler = battler;
        this.refresh();
    }

    initialize(x,y){
        const width = this.windowWidth();
        const height = this.windowHeight();
        super.initialize(new Rectangle( x, y, width, height ));
        Window_Base.prototype.initialize.call(this, new Rectangle( x, y, width, height ));
    }

    windowWidth(){
        return 480;
    }

    windowHeight(){
        return 64;
    }

    refresh(category,selectItem){
        if (this._battler == null){
            return;
        }
        this.createContents();
        const x = 36;
        if (category == SkillCategory.Equip){
            if (selectItem && selectItem.item){
                const _isWeapon = DataManager.isWeapon(selectItem.item);
                const _title = _isWeapon ? "攻撃" : "防御";
                this.drawText(_title, x, 0, 80,"left");
                if (selectItem.type == SkillSelectType.MyEquip){
                    const _find = this._battler.equips().find((a) => a == selectItem.item);
                    if (_find != null){
                        let value = 0;
                        value -= _isWeapon ? selectItem.item.params[2] : selectItem.item.params[3];                    
                        let _text = _isWeapon ? this._battler.atk : this._battler.def;
                        if (value > 0){
                            _text += "(+";
                        } else{
                            _text += "(";
                        }
                        _text += value +")";
                        this.drawText(_text, x + 104, 0, 160,"left");
                    }                    
                } else {
                    if (!DataManager.isItem(selectItem.item)){
                        
                        const _index = this._battler.equips().findIndex((a,index) => a == null && this._battler.canEquip(selectItem.item) && selectItem.item.etypeId === this._battler.equipSlots()[index]);
                        let _changeItem = null;
                        if (_index < 0){
                            _changeItem = this._battler.equips().find((a,index) => this._battler.canEquip(selectItem.item) && selectItem.item.etypeId === this._battler.equipSlots()[index]);
                        }
                        let _text = _isWeapon ? this._battler.atk : this._battler.def;
                        let value = 0;
                        if (_changeItem != null){
                            value -= _isWeapon ? _changeItem.params[2] : _changeItem.params[3];
                        }
                        value += _isWeapon ? selectItem.item.params[2] : selectItem.item.params[3];
                        if (value > 0){
                            _text += "(+";
                        } else{
                            _text += "(";
                        }
                        _text += value +")";
                        this.drawText(_text, x + 104, 0, 160,"left");
                    }
                }
                
            }
        }
        //this.drawText("防御", 0, 0, 80,"left");

    }
}
