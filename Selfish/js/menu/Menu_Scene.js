//-----------------------------------------------------------------------------
// Menu_Scene
//

class Menu_Scene extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Presenter_Menu(this);
        Menu_Scene._calledScene = SceneManager._scene;
        this._lastLanguage = null;
    }

    create(){
        super.create();
    
        this.createBackground();
        this.createSkillCategoryWindow();
        this.createSkillSelectWindow();
        this.createPlayerStatus();
        this.createStatusWindow();
        this.createRoleSkillSelectWindow();
        this.createBattleStatus();
        this.createHelpWindow();
    
    
        this.createKeyMapWindow();
    
        this.createFeatureWindow();

        if ($gameDefine.mobileMode){
            this.createMenuDockButton();
        }
        if (this._keyMapWindow && !$gameDefine.mobileMode){
            this.removeChild(this._keyMapWindow);
            this.addChild(this._keyMapWindow);
        }
    }

    createBackground(){
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        this._backgroundSprite.opacity = 192;
    }

    createPlayerStatus(){
        this._playerStatus = new Window_PlayerStatus(56 + 24,520);
        this._playerStatus.setup($gameParty.battleMembers()[0]);
        this.addChild(this._playerStatus);
    }

    createSkillCategoryWindow(){
        this._categoryWindow = new Window_SkillCategory(80,56,480,64);
        this.addChild(this._categoryWindow);
    }

    createSkillSelectWindow(){
        this._selectWindow = new Window_SkillSelect(80,120,480,400);
        this._selectWindow.setHandler('ok',this.okSelect.bind(this));
        this._selectWindow.setHandler('cancel',this.cancelSelect.bind(this));
        this._selectWindow.setHandler('shift',this.okSkillSet1.bind(this));
        this._selectWindow.setHandler('menu',this.okSkillSet2.bind(this));
        this._selectWindow.setHandler('pagedown',this.changeCategory.bind(this,1));
        this._selectWindow.setHandler('pageup',this.changeCategory.bind(this,-1));
        this._selectWindow.setHandler('index',this.changeSelect.bind(this,-1));
        this.addChild(this._selectWindow);
    }

    createRoleSkillSelectWindow(){
        this._roleSelectWindow = new Window_RoleSkillSelect(560 + 40,240,480,320);
        this._roleSelectWindow.setHandler('ok',this.okRoleSelect.bind(this));
        this._roleSelectWindow.setHandler('cancel',this.cancelRoleSelect.bind(this));
        this.addChild(this._roleSelectWindow);
    }

    createStatusWindow(){
        this._statusWindow = new Window_StatusDetail(480 + 80,56);
        this.addChild(this._statusWindow);
        const _player = $gameParty.battleMembers()[0];
        this._statusWindow.setup(_player);
    }

    createBattleStatus(){
        this._battleStatus = new Sprite_BattlerStatus();
        const _player = $gameParty.battleMembers()[0];
        this._battleStatus.setup(_player);
        this.addChild(this._battleStatus);
        this._battleStatus.x = 456 + 80;
        this._battleStatus.y = 40 + 64;
    }


    okSelect(){
        const _category = this._categoryWindow.category();
        const _item = this._selectWindow.item();
        if (_item != null){
            switch (_category){
                case SkillCategory.Item:
                    this.setCommand({command: MenuCommand.UseItem,select:_item});
                    break;
                case SkillCategory.Equip:
                    this.setCommand({command: MenuCommand.ChangeEquip,select:_item});
                    break;
                default:
                    this._selectWindow.activate();
                    break;
            }

        } else{
            this._selectWindow.activate();
        }
    }

    cancelSelect(){
        SceneManager.pop();
    }

    okSkillSet1(){
        const _item = this._selectWindow.item();
        this.setCommand({command: MenuCommand.ChangeSetSkill1,select:_item});
    }

    okSkillSet2(){
        SoundManager.playOk();
        const _item = this._selectWindow.item();
        this.setCommand({command: MenuCommand.ChangeSetSkill2,select:_item});
    }

    changeSelect(){
        const _category = this._categoryWindow.category();
        const _item = this._selectWindow.item();
        this._playerStatus.refresh(_category,_item);
        this.updateFeature();
    }

    changeCategory(plusIndex){
        SoundManager.playCursor();
        if (plusIndex > 0){
            this._categoryWindow.cursorRight();
        } else{
            this._categoryWindow.cursorLeft();
        }
        this._categoryWindow.refresh();
        const _category = this._categoryWindow.category();
        const _item = this._selectWindow.item();
        this._selectWindow.setCategory(_category);
        this._selectWindow.activate();
        this._selectWindow.select(-1);
        this._playerStatus.refresh(_category,_item);
        this.updateFeature();
    }

    callBackButton(){
        if (EventManager.busy()){
            return;
        }
        if (Popup_Help.busy()){
            return;
        }
        if (Presenter_Loading.busy()){
            return;
        }
        if (PopupInputManager.busy()){
            return;
        }
        SoundManager.playCancel();
        if (Scene_Option.busy()){
            Scene_Option.cancelOption();
            return;
        }
        this.callPopScene();
    }

    createHelpWindow(){
        this._helpWindow = new Window_Help();
        this.addChild(this._helpWindow);
    }

    start(){
        super.start();
        this.setCommand({command: MenuCommand.Start});
    }

    setRoleData(roleData){
        this._roleSelectWindow.setData(roleData);
        this._roleSelectWindow.refresh();
    }

    commandStart(_player){
        this._categoryWindow.show();
        const _category = this._categoryWindow.category();
        this._selectWindow.setCategory(_category);
        this._selectWindow.show();
        this._playerStatus.show();
        this.refreshWindow(_player);
        Input.clear();
    }

    okRoleSelect(){

    }

    cancelRoleSelect(){

    }

    createFeatureWindow(){
        this._featureWindow = new Window_FeatureList(80,96,640, 384);
        this.addChild(this._featureWindow);
    }

    setDragHandler(handler){
    }

    updateFeature(){
        const _item = this._selectWindow.item();
        if (_item != null && _item.item.description){
            console.log(_item.item)
            let feature = [_item.item.description];
            if (_item.item.damage && _item.item.damage.type == 1 && _item.item.damage.formula){
                feature.push("ダメージ値:x" + _item.item.damage.formula);
            }
            if (DataManager.isWeapon(_item.item)){
                feature.push("攻撃:" + _item.item.params[2]);
            }
            if (DataManager.isArmor(_item.item)){
                feature.push("防御:" + _item.item.params[3]);
            }
            this.commandFeature(feature,this._selectWindow.x + 160,this._selectWindow.index() * 40 + 192)
        } else{
            this.clearFeature();
        }
    }

    commandFeature(feature,x,y){
        this._featureWindow.show();
        //this._featureWindow.open();
        this._featureWindow.refresh(feature,x,y);
    }

    clearFeature(){
        this._featureWindow.hide();
    }


    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('menuCommand');
        }
    }

    createMenuDockButton(){
        this._dockMenu = new Sprite_MenuDock();
        this._dockMenu.setClickHandler(MenuDockActionType.SpPlus,this.onSkillSpGain.bind(this));
        this._dockMenu.setClickHandler(MenuDockActionType.SpMinus,this.onSkillSpLess.bind(this));
        this._dockMenu.setClickHandler(MenuDockActionType.ActorPlus,this.onNextActor.bind(this));
        this._dockMenu.setClickHandler(MenuDockActionType.ActorMinus,this.onPreviousActor.bind(this,'start'));
        this.addChild(this._dockMenu);
    }


    commandOptions(){
        this.refreshKeyHelpWindow("menuOption");
        this.setMenuSprite(this._commandWindow.currentSymbol());
        let index = _.findIndex(this.children,(child) => child instanceof Window_Help);
        
        this._lastLanguage = $dataOption.getUserData('language');
        Scene_Option.setPopup(this.cancelOption.bind(this),index-3);
        if (this._keyMapWindow){
            Scene_Option.setKeyHelpWindow(this._keyMapWindow);
        }
        Scene_Option.setHelpWindow(this._helpWindow);
    }

    cancelOption(){
        if (!$gameDefine.mobileMode){
            this._keyMapWindow.show();
        }
        this.refreshKeyHelpWindow("menuCommand");
        this.setMenuSprite(TextManager.getText(2000));
        this._commandWindow.activate();
        
        const lastLanguage = $dataOption.getUserData('language');
        if (lastLanguage != this._lastLanguage){
            SceneManager.goto(Menu_Scene);
        }
    }

    refresh(){
        const skillWindow = this.skillWindow();
        skillWindow.refresh();
        skillWindow.updateHelp();
    }

    update(){
        super.update();
        if (this._presenter) this._presenter.update();
    }

    refreshWindow(_player){
        const _category = this._categoryWindow.category();
        this._selectWindow.resetData();
        this._selectWindow.refresh();
        this._selectWindow.activate();
        if (this._selectWindow.item() == null){
            this._selectWindow.select(-1);
        }
        this._playerStatus.setup(_player);
        const _redrawitem = this._selectWindow.item();
        this._playerStatus.refresh(_category,_redrawitem);
        this._battleStatus.refreshStatus();
        this._statusWindow.setup(_player);
        this.updateFeature();
    }

    refreshKeyHelpWindow(key){
        if (this._keyMapWindow){
            this._keyMapWindow.refresh(key);
        }
    }

    swipChara(moveX){
        this._statusWindow.swipChara(moveX);
    }

    swipSkill(upper){
        if (upper){
            this.onSkillSpGain();
        } else{
            this.onSkillSpLess();
        }
    }

    swipReset(){
        this._statusWindow.swipReset();
    }

    swipEndChara(moveX){
        this._statusWindow.swipEndChara(moveX);
    }

    terminate(){
        super.terminate();
        if (this._skillWindow){
            this._skillWindow.terminate();
        }
        this._skillWindow = null;
        this._helpWindow = null;
        if (this._itemWindow){
            this._itemWindow.terminate();
        }
        this._itemWindow = null;
        if (this._actorInfoWindow){
            this._actorInfoWindow.terminate();
        }
        this._actorInfoWindow = null;
        if (this._statusWindow){
            this._statusWindow.destroy();
        }
        this._statusWindow = null;
        this._keyMapWindow.terminate();
        this._keyMapWindow = null;
        
        this._presenter = null;
        EventManager.remove();
        BackGroundManager.remove();
        TipsManager.remove();
        this.destroy();
    }

    callPopScene(){
        this.setCommand(MenuCommand.PopScene);
    }

    popScene(){
        Window_MenuListCommand._lastCommandSymbol = null;
        super.popScene();
    }
}

const MenuCommand = {
    SkillChange : 0,
    SkillSpGain : 1,
    SkillSpLess : 2,
    SwapOrder : 3,
    CallSave : 4,
    CallLoad : 5,
    CallEnemyInfo : 6,
    Debug : 7,
    Result : 8,
    Magic : 9,
    SkillItemOpen : 10,
    NextActor : 11,
    PreviousActor : 12,
    Status : 13,
    CallHelp : 14,
    Formation : 15,
    PopScene : 16,
    SwipChara : 21,
    CallMagicInfo : 31,
    ChangeEquip : 41,
    UseItem : 42,
    ChangeSetSkill1 : 51,
    ChangeSetSkill2 : 52,
    Start : 100,
}