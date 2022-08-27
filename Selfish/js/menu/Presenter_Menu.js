class Presenter_Menu extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new Model_Menu();
        this.setEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    commandStart(){
        this._view.setRoleData(this._model.roleData());
        this._view.commandStart(this._model.player());
        this._view.setDragHandler((sprite) => {this.commandFeature(sprite)});
    }

    commandPopScene(){
        if (EventManager.busy()){
            return;
        }
        $gameTemp._needDisPlayEffectChange = this._model.needDisPlayEffectChange();
        this._view.popScene();
    }

    updateCommand(){
        super.updateCommand();
        switch (this._view._command.command){
            case MenuCommand.ChangeEquip:
            return this.commandChangeEquip(this._view._command.select);
            case MenuCommand.UseItem:
            return this.commandUseItem(this._view._command.select);
            case MenuCommand.ChangeSetSkill1:
            return this.commandChangeSetSkill(1,this._view._command.select);
            case MenuCommand.ChangeSetSkill2:
            return this.commandChangeSetSkill(2,this._view._command.select);
            case MenuCommand.Debug:
            return this.commandDebug();
            case MenuCommand.Start:
            return this.commandStart();
            case MenuCommand.PopScene:
            return this.commandPopScene();
        }
        this._view.clearCommand();
    }

    commandChangeEquip(select){
        const _player = this._model.player();
        const _index = _player.equips().findIndex(a => a == select.item);
        if (_index >= 0){
            _player.changeEquip(_index,null);
        } else{
            if (_player.canEquip(select.item)){
                const _slotIndex = _player.equipSlots().findIndex((a) => a == select.item.etypeId);
                _player.changeEquip(_slotIndex,select.item);
            }
        }
        this._view.refreshWindow(_player);
    }

    commandUseItem(select){
        const _player = this._model.player();
        SoundManager.playUseItem();
        _player.useItem(select.item);
        
        const action = new Game_Action(_player);
        action.setItem(select.item.id);
        action.makeActionResult();
        const results = action.results();
        results.forEach(result => {
            action.applyResult(result.target,result);
        });
        this._view.refreshWindow(_player);
    }

    commandChangeSetSkill(slot,select){
        const _player = this._model.player();
        if (select != null){
            const _skillSet = (slot == 1) ? _player._skillSet1 : _player._skillSet2;
            const _type = select.type;
            switch (_type){
                case SkillSelectType.Learning:
                    if (select.item == _skillSet){
                        _player.setSlotSkill(slot,null);
                    } else{
                        _player.setSlotSkill(slot,select.item);
                    }
                break;
            }
        }
        this._view.refreshWindow(_player);
    }

    commandDebug(){
        Debug.log('debug')
        EventManager.exit();
        EventManager.setup('debug');
        this._view.popScene();
    }


    commandFeature(sprite){
        if (sprite == null){
            this._view.clearFeature();
            return;
        }
        const feature = this._model.battlerFeature(sprite._battler);
        const x = sprite.x + 112;
        const y = sprite.y + 80;
        this._view.commandFeature(feature,x,y);
    }

    update(){
        if (Input.isTriggered('pageup') && $gameTemp.isPlaytest()){
            //this.commandDebug();
        }
    }
}