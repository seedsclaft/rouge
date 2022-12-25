class PopupStatus_View  {
    constructor(){
    }

    static initialize(){
        this._listWindow = new PopupStatus_ActorList(584,48,344,400);
        this._listWindow.setHandler('pageup',     this.changeActor.bind(this,-1));
        this._listWindow.setHandler('pagedown',     this.changeActor.bind(this,1));
        this._listWindow.setHandler('shift',     this.changeSkill.bind(this));
        
        this._magicCategory = new Tactics_MagicCategory(200 - 160,128,72,264);
        
        this._magicCategory.setMagicCategory($gameElement.data());
        this._magicCategory.select(0);

        this._magicList = new PopupStatus_MagicList(264 - 160,128,480,320);
        this._magicList.select(0);
        
        
        this._magicList.setHandler("ok", this.commandMagicSelect.bind(this));
        this._magicList.setHandler("cancel", this.commandMagicCancel.bind(this));
        this._magicList.setHandler('shift',     this.changeResetSkill.bind(this,-1));
        this._magicList.setHandler("pageup", this.changeCategory.bind(this,1));
        this._magicList.setHandler("pagedown", this.changeCategory.bind(this,-1));
            
        this._spParam = new PopupStatus_SpParam(504 - 160,80,240,56);
        this._spParam.hide();
        /*
        this._listWindow.setHandler('ok',     this.selectActor.bind(this));
        this._listWindow.setHandler('index',     this.changeSelectIndex.bind(this));
        */
        //this._listWindow.setHandler('cancel',     SceneManager._scene.popScene.bind(this));
       
    }

    static resetUp(){
        if (this._listWindow.parent){
            this._listWindow.parent.removeChild(this._listWindow);
        }
        if (this._magicCategory.parent){
            this._magicCategory.parent.removeChild(this._magicCategory);
        }
        if (this._magicList.parent){
            this._magicList.parent.removeChild(this._magicList);
        }
        if (this._spParam.parent){
            this._spParam.parent.removeChild(this._spParam);
        }
        SceneManager._scene.addChild(this._listWindow);
        SceneManager._scene.addChild(this._magicCategory);
        SceneManager._scene.addChild(this._magicList);
        SceneManager._scene.addChild(this._spParam);
    }

    static setData(data,cancelCall){
        this._listWindow.setData(data);
        this._listWindow.show();
        this._listWindow.activate();
        this._listWindow.selectLast();
        this._listWindow.setHandler('cancel',     () => {if (cancelCall) cancelCall() });
    }

    static setLvupData(data,endCall){
        this._listWindow.setData(data);
        this._listWindow.stratLvup(endCall);
    }

    static setLvupAfter(data,endCall){
        this._listWindow.setLvupAfter(data);
        this._listWindow.setHandler('ok',     () => {if (endCall) endCall() });
    }

    static changeActor(value){
        if (value > 0){
            this._listWindow.cursorDown();
        } else{
            this._listWindow.cursorUp();
        }
        this._listWindow.refresh();
        this._listWindow.activate();
    }

    static changeCategory(value){
        if (value > 0){
            this._magicCategory.cursorUp();
        } else
        if (value < 0){
            this._magicCategory.cursorDown();
        }
        this.refreshCategoryIndex();
        this._magicList.activate();
    }
    
    static refreshCategoryIndex(){
        const _category = this._magicCategory.category();
        this._magicList.setCategory(_category);
    }

    static commandMagicSelect(){
        const _actor = this._listWindow.item();
        const _magic = this._magicList.item();
        if (_actor.isLearnedSkill(_magic.id)){
            _actor._useSp += _magic.mpCost;
            _actor.forgetSkill(_magic.id);
        } else
        if (_actor._useSp >= _magic.mpCost){
            _actor._useSp -= _magic.mpCost;
            _actor.learnSkill(_magic.id);
            this._magicList.setSelected(_magic.id);
        }
        this._magicList.refresh();
        this._magicList.activate();
        this._spParam.setData(_actor);
    }

    static commandMagicCancel(){
        this._magicList.hide();
        this._magicList.deactivate();
        this._magicCategory.hide();
        this._magicCategory.deactivate();
        this._spParam.hide();
        this._listWindow.activate();
    }

    static changeResetSkill(){        
        const _actor = this._listWindow.item();
        const mainText = TextManager.getText(12000).replace("/d",_actor.name());
        const text1 = TextManager.getDecideText();
        const text2 = TextManager.getCancelText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:null});
        _popup.setHandler(text1,'ok',() => {
            this._magicList.activate();
        });
        _popup.setHandler(text2,'cancel',() => {
            this._magicList.activate();
        });
        _popup.open();
    }

    static changeSkill(){
        const _actor = this._listWindow.item();
        this._magicList.setActor(_actor);
        const _magic = $gameParty._learnedSkills.map(a => $dataSkills[a]);
        this._magicList.setMagic(_magic);
        this._magicList.show();
        this._magicList.activate();
        //this._magicList.selectLast();
        this._magicCategory.show();
        this._spParam.setData(_actor);
        this._spParam.show();
        this.refreshCategoryIndex();
    }

    static close(){
        this._listWindow.hide();
        this._magicCategory.hide();
        this._magicList.hide();
    }
    

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('PopupStatus');
        }
    }

    createArrows(){
    }

    callPageArrow(plus){
        SoundManager.playCursor();
        if( plus > 0){
            this._statusWindow.cursorRight();
        } else{
            this._statusWindow.cursorLeft();
        }
        this._statusWindow.refresh();
        this.refreshArrows();
    }

    refreshArrows(){
        this._statusWindow.refresh();
        this._categoryRightButton.visible = (this._statusWindow.index() != 0) && (this._statusWindow._data.length != 1);
        this._categoryLeftButton.visible = (this._statusWindow.index() != (this._statusWindow._data.length-1)) && (this._statusWindow._data.length != 1);
    }

    start(){
        super.start();
        this.setCommand(PopupStatusCommand.Start);
    }

    setActorData(data){
        this._listWindow.setData(data);
        this._listWindow.activate();
        this._listWindow.selectLast();
    }

    changeSelectIndex(){
    }


    selectActor(){
        this.setCommand(PopupStatusCommand.Select);
        this.setCommand(PopupStatusCommand.Refresh);
        this._listWindow.activate();
    }

    currentActorId(){
        return this._listWindow.item().actorId();
    }

    update(){
        super.update();
    }

    swipHelp(moveX){
        this._statusWindow.swipHelp(moveX);
    }

    swipReset(){
        this._statusWindow.swipReset();
    }

    swipEndHelp(moveX){
        this._statusWindow.swipEndHelp(moveX);
    }

    commandNextHelpStatus(cursor){
        SoundManager.playCursor();
        if( cursor > 0){
            this._statusWindow.cursorRight();
        } else{
            this._statusWindow.cursorLeft();
        }
        this._statusWindow.refresh();
        this.refreshArrows();
    }

    refresh(param){
        this._listWindow.selectActorId(param.selectActorId);
    }
}

const PopupStatusCommand = {
    Start :0,
    Select :1,
    Refresh : 100
}