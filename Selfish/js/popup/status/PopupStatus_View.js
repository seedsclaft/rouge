class PopupStatus_View  {
    constructor(){
    }

    static initialize(){
        this._listWindow = new PopupStatus_ActorList(584,56,344,416);
        
        this._magicCategory = new Tactics_MagicCategory(40,102,272,64);
        
        this._magicCategory.setMagicCategory($gameElement.data());
        this._magicCategory.select(0);

        this._magicList = new PopupStatus_MagicList(40,152,540,320);
        this._magicList.select(0);
        
        this._magicList.setHandler("cancel", this.commandMagicCancel.bind(this));
        this._magicList.setHandler("pageup", this.changeCategory.bind(this,1));
        this._magicList.setHandler("pagedown", this.changeCategory.bind(this,-1));
        
            
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
        SceneManager._scene.addChild(this._listWindow);
        SceneManager._scene.addChild(this._magicCategory);
        SceneManager._scene.addChild(this._magicList);
    }

    static setData(data,cancelCall){
        this._listWindow.setData(data);
        this._listWindow.show();
        this._listWindow.activate();
        this._listWindow.selectLast();
        this._listWindow._handlers = {};
        this._listWindow.setHandler('shift',     this.changeParam.bind(this));
        this._listWindow.setHandler('menu',     this.changeSkill.bind(this));
        this._listWindow.setHandler('pageup',     this.changeActor.bind(this,-1));
        this._listWindow.setHandler('pagedown',     this.changeActor.bind(this,1));
        this._listWindow.setHandler('cancel',     () => {if (cancelCall) cancelCall() });
        
        SceneManager._scene._keyMapWindow.refresh("actorInfo");
    }

    static setLvupData(data,endCall){
        this._listWindow.setData(data);
        this._listWindow.stratLvup(endCall);
    }

    static setLvupAfter(data,endCall){
        this._listWindow.setLvupAfter(data);
        this._listWindow._handlers = {};
        this._listWindow.setHandler('cancel',     () => {if (endCall) endCall() });
        this._listWindow.setHandler('shift',     this.changeParam.bind(this));
        this._listWindow.setHandler('menu',     this.changeSkill.bind(this));
    }

    static setSelectData(data,okCall,cancelCall){
        this._listWindow.setData(data);
        this._listWindow.show();
        this._listWindow.activate();
        this._listWindow.selectLast();
        this._listWindow._handlers = {};
        this._listWindow.setHandler('ok',     () => {if (okCall) okCall(this.selectedData()) });
        this._listWindow.setHandler('cancel',     () => {if (cancelCall) cancelCall() });
    
    }

    static selectedData(){
        return this._listWindow.item();
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
            this._magicCategory.cursorLeft();
        } else
        if (value < 0){
            this._magicCategory.cursorRight();
        }
        this.refreshCategoryIndex();
        this._magicList.activate();
    }
    
    static refreshCategoryIndex(){
        const _category = this._magicCategory.category();
        this._magicList.setCategory(_category);
    }


    static commandMagicCancel(){
        this._magicList.hide();
        this._magicList.deactivate();
        this._magicCategory.hide();
        this._magicCategory.deactivate();
        this._listWindow.activate();
    }


    static changeParam(){
        this._listWindow.changeStatus();
        SceneManager._scene._keyMapWindow.refresh("paramUp");
    }

    static changeSkill(){
        const _actor = this._listWindow.item();
        this._magicList.setActor(_actor);
        this._magicList.setMagic(_actor.skills());
        this._magicList.show();
        this._magicList.activate();
        //this._magicList.selectLast();
        this._magicCategory.show();
        this.refreshCategoryIndex();
    }

    static close(){
        this._listWindow.hide();
        this._magicCategory.hide();
        this._magicList.hide();
    }

    static remove() {
        const _scene = SceneManager._scene;
        _scene.removeChild(this._listWindow);
        _scene.removeChild(this._magicCategory);
        _scene.removeChild(this._magicList);
    }

    static busy(){
        return this._listWindow.active || this._magicCategory.active || this._magicList.active;
    }
}

const PopupStatusCommand = {
    Start :0,
    Select :1,
    Refresh : 100
}