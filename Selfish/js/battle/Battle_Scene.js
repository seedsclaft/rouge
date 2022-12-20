//-----------------------------------------------------------------------------
// Battle_Scene
//
// The scene class of the battle screen.

class Battle_Scene extends Scene_Base{
    constructor(){
        super();
        this._resourcedata = null;
        this._resourceCount = 0;
        this._presenter = new Presenter_Battle(this);
        this._category = 0;
    
        this.changeStep(SceneBattleStep.NONE);
    }

    changeStep(step){
        this._step = step;
    }

    create(){
        BackGroundManager.resetup();
        this.enableWeather();
        super.create();
    }
    
    enableWeather(enable){
        BackGroundManager.enableWeather(enable);
        EventManager.enableWeather(enable);
    }

    setResourceData(resourceData){
        this._resourceData = resourceData;
    }

    isReady(){
        return true;
    }

    async start(){
        super.start();
        Presenter_Loading.open();
        if (SceneManager._previousClass.name && SceneManager._previousClass.name == "Terminal_Scene"){
            await this.loading(this.waitResourceLoad.bind(this));
        }
        if (SceneManager._previousClass.name && SceneManager._previousClass.name == "Load_Scene"){
            await this.loading(this.waitResourceLoad.bind(this));
        }
        Presenter_Loading.close();
    
        this.createLayerBattleTroop();
        this.createAllWindows();
        EventManager.resetup();
        if($gameDefine.mobileMode == true){
            this.createBattleDockButton();
        }
        this.setCommand({command:BattleCommand.Start});
    }

    recreateStartObject(){
        this.createGridLine();
        this.createGridSpriteset();
        this.removeChild(this._partyCommandWindow);
        this.addChild(this._partyCommandWindow);
        this.createLayerBattleParty();
        //this.createSkillItemWindow();
        this.createSkillWindow();
        this.createOtherSkillWindow();
        this.createStatusWindow();
    
        this.createMenuButton();
        this.createBackButton(this.callcommandMenu.bind(this));
        this.setBackSprite(TextManager.getMenuText());
        this.createMenuSprite();
        let battleTextId = 600500;
        this.setMenuSprite(TextManager.getText(battleTextId));
        this.createKeyMapWindow();
        this.createSpriteset();
        this.createFeatureWindow();
        this._elementSprite = new Sprite_Element(12,80);
        this.addChild(this._elementSprite);
        this._elementSprite.visible = false;
        this._gridSpriteset.ready();
        if($gameDefine.mobileMode == true){
            if (!this.isLastBattle()){
                this.removeChild(this._dockMenu);
                this.addChild(this._dockMenu);
            }
            this._dockMenu.show();
            this._dockMenu.showAnalyzeButton();
        }
    }

    waitResourceLoad(){
        return AudioManager.loadedBgmResource(this._resourceData.bgm) && AudioManager.loadedSeResource(this._resourceData.sound) && ImageManager.loadedAnimationResource(this._resourceData.animation);
    }

    async displayStartMessages(texts,waitMessage){
        this._recordWindow.addText("",false);
        this._recordWindow.addText("",false);
        this._recordWindow.addText("",false);
        texts.forEach(text => {
            this._recordWindow.addText(text);
        });
        if (waitMessage){
            await this.setWait(1000);
        }
        this.setCommand({command:BattleCommand.PreReady});
    }

    displayPartyCommand(){
        this.clearLog();
        this._partyCommandWindow.select(Window_PartyCommand._lastCommand);
        this._partyCommandWindow.show();
        this._partyCommandWindow.open();
        this._partyCommandWindow.activate();
    }

    clearLog(){
        this._logWindow.clear();
    }

    clearRecord(){
        this._recordWindow.clear();
    }

    recordCollapse(target){
        this._recordWindow.recordCollapse(target);
    }

    performCollapse(target,type){
        this._layerBattleParty.performCollapse(target,type);
        this._layerBattleTroop.performCollapse(target,type);
        SoundManager.playEnemyCollapse();
    }

    resetApMode(){
        this.clearLog();
        this._gridSpriteset.setPhase("ap");
    }

    startMpAnimation(battler, mp){
        this._layerBattleParty.startMpAnimation(battler,mp);
    }

    setDamagePopup(battler,type, damage,length,isRecored,recordDamage){
        if (isRecored === undefined){
            isRecored = true;
        }
        this._layerBattleParty.setDamagePopup(battler,type, damage,length);
        this._layerBattleTroop.setDamagePopup(battler,type, damage,length);
        if (isRecored){
            let recordDamageData = recordDamage != null ? recordDamage : damage;
            this._recordWindow.addDamageText(battler,type, recordDamageData);
        }
        if (type == "hpDamageWeak" || type == "hpDamage"){
            this._layerBattleParty.changeFace(battler,FaceType.Damage);
        }
    }

    changeFaceType(battler,faceType){
        this._layerBattleParty.changeFace(battler,faceType);
    }

    changeFaceTypeAll(faceType){
        this._layerBattleParty.changeFaceAll(faceType);
    }

    startAnimation(battler,id,mirror, delay,scale,nosound,nocheck){
        this._layerBattleParty.startAnimation(battler,id,mirror, delay,scale,nosound,nocheck);
        this._layerBattleTroop.startAnimation(battler,id,mirror, delay,scale,nosound,nocheck);
    }

    startAnimationEffect(battler,id,mirror, delay,scale,nosound,nocheck){
        this._layerBattleParty.startAnimationEffect(this._spriteset,battler,id,mirror, delay,scale,nosound,nocheck);
        this._layerBattleTroop.startAnimationEffect(this._spriteset,battler,id,mirror, delay,scale,nosound,nocheck);
    }

    setActionBattler(){
        this._gridSpriteset.setPhase("wait");
        this._gridSpriteset.refreshPosition();
    }

    displaySelecting(battler,skills,otherSkills){
        SoundManager.playActorCommand();
        this._category = 0;
        this.layerBattlePicture().refreshBattlerPicture(battler);
        this._skillWindow.show();
        this._skillWindow.activate();
        this._skillWindow.setData(skills,battler);
        this._skillWindow.showAnimation();
        this._otherSkillWindow.setData(otherSkills,battler);
        this._otherSkillWindow.hide();
        this._otherSkillWindow.deactivate();
        this.showMenuPlate(this.onSkillCancel.bind(this),TextManager.getBackText(),TextManager.getText(600600));

        this.changeSkillIndex();
        this._keyMapWindow.show();
    
        this._elementSprite.visible = true;
        if (this._dockMenu){
            this._dockMenu.enableSkillChangeButton(true);
            this._dockMenu.enableLimitBreakButton(true);
            this._dockMenu.enableCategoryChangeButton(true);
            this._dockMenu.enableGuardButton(true);
            this._dockMenu.show();
            this._dockMenu.showTypeChange(true);
        }
        this.changeStep(SceneBattleStep.Selecting);
    }

    displaySkillName(battler){
        const skillName = TextManager.getSkillName( battler.currentAction().item().id );
        const text = battler.name() + TextManager.getText(610900).format(skillName);
        this._recordWindow.addText(text);
    }

    displayAwakeSkillName(battler){
        const skillName = TextManager.getSkillName( battler.currentAction().item().id );
        const text = battler.name() + TextManager.getText(611000).format(skillName);
        this._recordWindow.addText(text);
    }

    displaySkillLevelUp(battler){
        const skillName = TextManager.getSkillName( battler.currentAction().item().id );
        const text = TextManager.getText(611100).format(skillName);
        this._recordWindow.addText(text);
    }

    displayGuardSuccess(battler,action){
        const skillName = TextManager.getSkillName( action.item().id );
        const text = battler.name() + TextManager.getText(611200).format(skillName);
        this._recordWindow.addText(text);
    }

    displayTpMaxActor(battler){
        const actorName = TextManager.actorName(battler.actorId());
        const text = actorName + TextManager.getText(611300);
        this._recordWindow.addText(text);
    }

    displayChainBattler(battler){
        const text = TextManager.getText(611800).format(battler.name());
        this._recordWindow.addText(text);
    }

    displayWaitNextTurn(){
        this._logWindow.addText(TextManager.getText(611400));
        this.changeStep(SceneBattleStep.WAITNEXTTURN);
    }

    clearAnimation(){
        this._layerBattleParty.clearPlaying();
        this._layerBattleTroop.clearPlaying();
    }

    animationEnd(){
        return this._layerBattleTroop && this._layerBattleParty && !this._layerBattleTroop.isAnimationPlaying() && !this._layerBattleParty.isAnimationPlaying();
    }

    update(){
        if (Presenter_Loading.busy()){
            return;
        }
        if (this._presenter) this._presenter.update();
        super.update();
        if ($gamePause == true){
            return;
        }
        $gameScreen.update();
        this.updateSkillAddict();
        this.updateInputGuardMethod();
        this.updateAnimationSkipMethod();
    }

    setGuradEvent(command){
        this._gurardEvent = command;
    }

    updateInputGuardMethod(){
        if (this._gurardEvent){
            this._gurardEvent(this.isGuarding());
        }
    }

    setAnimationSkipEvent(command){
        this._animationSkipEvent = command;
    }

    updateAnimationSkipMethod(){
        if (this._animationSkipEvent){
            this._animationSkipEvent(this.isAnimationSkip());
        }
    }

    setKeyMapEvent(command){
        this._keyMapEvent = command;
    }

    createFeatureWindow(){
        this._featureWindow = new Window_FeatureList(80,96,640, 384);
        this.addChild(this._featureWindow);
    }

    setDragHandler(handler){
        this._layerBattleParty.setDragHandler(handler);
        this._layerBattleTroop.setDragHandler(handler);
    }

    commandFeature(feature,x,y){
        if (!this._featureWindow.isOpen()){
            this._featureWindow.show();
            this._featureWindow.open();
            this._featureWindow.refresh(feature,x,y);
        }
    }

    clearFeature(){
        if (TouchInput.isPressed()){
            return;
        }
        if (this._featureWindow.isOpen()){
            this._featureWindow.close();
        }
    }

    updateSkillAddict(){
        if (!this._enemyWindow.active){
            this._layerBattleTroop.stopSkillAddict();
            return;
        }
        this._layerBattleTroop.setSkillAddict(this._skillWindow.actor());
    }

    refreshStatus(){
        this._layerBattleTroop.refreshBattleStatus();
        if (this._layerBattleParty){
            this._layerBattleParty.refreshBattleStatus();
            this._layerBattleParty.clearMpAnimation();
        }
        this._enemyWindow.refresh();
        if (this._gridSpriteset){
            this._gridSpriteset.refresh();
        }
    }

    changeTpEffect(actors){
        if (this._layerBattleParty){
            this._layerBattleParty.changeTpEffect(actors);
        }
    }

    startTurn(){
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        this._keyMapWindow.hide();
        this._gridSpriteset.clearNextOrder();
        this._gridSpriteset.setPhase("action");
    }

    setWait(num){
        return new Promise(resolve => {
            const delayTime = num
            setTimeout(() => {
              return resolve()
            }, delayTime)
        });
    }

    selectActorSelection(battler,action){
        this.changeStep(SceneBattleStep.SELECTACTOR);

        this._actorWindow.show();
        this._actorWindow.activate();
        if (action.isForAll()){
            this._actorWindow.selectAll();
        } else{
            this._actorWindow.select(battler.index());
        }
        this._actorWindow.setCursorFixed(action.isForUser());
        this.showMenuPlate(this.onActorCancel.bind(this),TextManager.getBackText(),TextManager.getText(600700));
    }

    onActorOk(){
        if (this._featureWindow._openness > 0){
            this._actorWindow.activate();
            return;
        }
        this._actorWindow.deactivate();
        this._actorWindow.hide();
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        this._keyMapWindow.hide();
        this.hideMenuPlate();
        this.setCommand({command: BattleCommand.ACTION,isActor:true});
        if (this._dockMenu){
            this._dockMenu.hide();
        }
    }

    onActorCancel(){
        if ($gameDefine.mobileMode){
            SoundManager.playCancel();
        }
        this._actorWindow.deactivate();
        this._actorWindow.hide();
        if (this._category == 0){
            this._skillWindow.show();
            this._skillWindow.activate();
            this._skillWindow.showAnimation();
            this._skillWindow.selectLast();

            this._otherSkillWindow.hide();
            this._otherSkillWindow.deactivate();
            this.changeSkillIndex();
        } else
        if (this._category == 1){
            this._otherSkillWindow.show();
            this._otherSkillWindow.activate();
            this._otherSkillWindow.showAnimation();

            this._skillWindow.show();
            this._skillWindow.deactivate();
            this._keyMapWindow.refresh("battleOtherSkill");
        }
        this._keyMapWindow.show();
        this._gridSpriteset.clearNextOrder();
        var actor = this._skillWindow.actor();
        this.layerBattlePicture().refreshBattlerPicture(actor);
    
        this.showMenuPlate(null,TextManager.getBackText(),TextManager.getText(600600));
        if (this._dockMenu){
            this._dockMenu.show();
            this._dockMenu.showTypeChange(true);
        }
        this.changeStep(SceneBattleStep.Selecting);
    }

    selectEnemySelection(battler,action){
        this.changeStep(SceneBattleStep.SELECTENEMY);

        this._enemyWindow.show();
        this._enemyWindow.activate();
        if (action.isForAll()){
            this._enemyWindow.selectAll();
        } else{
            if (battler._lastTarget && battler._lastTarget.isAlive()){
                this._enemyWindow.selectTarget(battler._lastTarget);
            } else{
                this._enemyWindow.selectTarget(null);
            }
        }
        this.showMenuPlate(this.onEnemyCancel.bind(this),TextManager.getBackText(),TextManager.getText(600800));
    }

    onEnemyOk(){
        if (this._featureWindow._openness > 0){
            this._enemyWindow.activate();
            return;
        }
        this._enemyWindow.deactivate();
        this.hideMenuPlate();
        this.setCommand({command: BattleCommand.ACTION, isActor:false});
        this.changeStep(SceneBattleStep.NONE);
        if (this._dockMenu){
            this._dockMenu.hide();
        }
    }

    onEnemyCancel(){
        if ($gameDefine.mobileMode){
            SoundManager.playCancel();
        }
        this._enemyWindow.deactivate();
        const actor = this._skillWindow.actor();
        this.layerBattlePicture().refreshBattlerPicture(actor);
        this._skillWindow.show();
        this._skillWindow.activate();
        this._skillWindow.showAnimation();
        this._skillWindow.selectLast();
        this._keyMapWindow.show();
        this._gridSpriteset.clearNextOrder();
        
        this.showMenuPlate(null,TextManager.getBackText(),TextManager.getText(600600));
        if (this._dockMenu){
            this._dockMenu.show();
            this._dockMenu.showTypeChange(true);
        }
        this.changeStep(SceneBattleStep.Selecting);
    }

    onSkillOk(){
        TouchInput.clear();
        this.hideSkillCommandWindows();
        this._keyMapWindow.hide();
        this.layerBattlePicture().hideBattlerPicture();
        this.setCommand({command: BattleCommand.SkillOk});
        if (this._dockMenu){
            this._dockMenu.showTypeChange(false);
        }
    }

    onSkillChange(){
        this.setCommand({command: BattleCommand.SKILLCHANGE});
    }

    onLimitBreak(){
        this.setCommand({command: BattleCommand.LIMITBREAK});
    }

    onOtherSkillOk(){
        TouchInput.clear();
        this.hideSkillCommandWindows();
        this._keyMapWindow.hide();
        this.layerBattlePicture().hideBattlerPicture();
        this.setCommand({command: BattleCommand.OtherSkill});
        if (this._dockMenu){
            this._dockMenu.showTypeChange(false);
        }
    }

    hideSkillCommandWindows(){
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        this._otherSkillWindow.hide();
        this._otherSkillWindow.deactivate();
    }

    commandLimitBreak(skills,battler){
        this._skillWindow.activate();
        if (skills != null && battler != null){
            this._skillWindow.setData(skills,battler);
            this._skillWindow.showAnimation();
        }
    }

    showSkillItemOpen(actor,skills,selectSkill){
        SoundManager.playOk();
        const itemWindow = this.itemWindow();
        itemWindow.showAnimation();
        itemWindow.show();
        itemWindow.activate();
        itemWindow.setData(skills,actor,selectSkill);
        this._skillWindow.hide();
        //this._skillWindow.hideAnimation();
        this._skillWindow.deactivate();
        this.showMenuPlate(this.onSkillChangeCancelBack.bind(this),TextManager.getBackText(),TextManager.getText(600600))
        if (this._dockMenu){
            this._dockMenu.enableSkillChangeButton(false);
            this._dockMenu.enableLimitBreakButton(false);
            this._dockMenu.enableCategoryChangeButton(false);
            this._dockMenu.enableGuardButton(false);
        }
    }

    onSkillChangeOk(){
        this.setCommand({command: BattleCommand.SKILLCHANGEOK});
        var battler = this._skillWindow.actor();
        var skill = $dataSkills[$gameDefine.noActionSkillId];
        var action = battler.action(0);
        action.setSkill(skill.id);
        this.layerBattlePicture().hideBattlerPicture();
        this.onActorOk();
        if (this._dockMenu){
            this._dockMenu.hide();
        }
    }

    onSkillChangeCancelBack(){
        SoundManager.playCancel();
        this.onSkillChangeCancel();
    }

    onSkillChangeCancel(){
        this.itemWindow().deactivate();
        this.itemWindow().hideAnimation();
        
        this._skillWindow.show();
        this._skillWindow.showAnimation();
        this._skillWindow.selectLast();
        this._skillWindow.activate();
        if (this._dockMenu){
            this._dockMenu.enableSkillChangeButton(true);
            this._dockMenu.enableLimitBreakButton(true);
            this._dockMenu.enableCategoryChangeButton(true);
            this._dockMenu.enableGuardButton(true);
            this._dockMenu.show();
            this._dockMenu.showTypeChange(true);
        }
        this.showMenuPlate(null,TextManager.getBackText(),TextManager.getText(600600))
    }

    reShowSkillList(){
        this.itemWindow().deactivate();
        this.itemWindow().hideAnimation();
        this._skillWindow.refresh();
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        if (this._dockMenu){
            this._dockMenu.enableSkillChangeButton(true);
            this._dockMenu.enableLimitBreakButton(true);
            this._dockMenu.enableCategoryChangeButton(true);
            this._dockMenu.enableGuardButton(true);
        }
    }

    onSkillCancel(){
        if (this.isLastBattle()){
            return;
        }
        if (this._category != 0){
            this.resetCommandCategory();
            return;
        }
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        this._keyMapWindow.hide();
        this._enemyWindow.deactivate();
        this._actorWindow.deactivate();
        this._actorWindow.hide();
        this._gridSpriteset.setPhase("ap");
        this.layerBattlePicture().hideBattlerPicture();
        this.hideMenuPlate();
    
        if (this._dockMenu){
            this._dockMenu.hide();
        }
        this.setCommand({command: BattleCommand.SKILLCANCEL});
    }

    onSelectAction(battler,action,isForOpponent,nextap){
        this._gridSpriteset.showNextOrder(battler,nextap);
        if (isForOpponent) {
            this.selectEnemySelection(battler,action);
        } else {
            this.selectActorSelection(battler,action);
        }
    }

    createGridLine(){
        if ($gameBackGround.needGridLine(BackGroundManager.backSprite1())){
            this._gridLineSprite2 = new Sprite();
            var bitmap = new Bitmap(240,540);
            bitmap.gradientFillRect(0,0,240,540,"rgba(255,255,255,0)",'white');
            this._gridLineSprite2.bitmap = bitmap;
            this._gridLineSprite2.x = Graphics.boxWidth - 200;
            this._gridLineSprite2.opacity = 128;
            this.addChild(this._gridLineSprite2);
        }
    
        this._gridLineSprite = new Sprite();
        this._gridLineSprite.bitmap = ImageManager.loadSystem('gridLine');
        this._gridLineSprite.x = Graphics.boxWidth - 96;
        this._gridLineSprite.y = 24;
        this.addChild(this._gridLineSprite);
    }

    clickSelectEnemy(battler){
        if (this._statusWindow && this._statusWindow.active){
            return;
        }
        const _enemyWindow = this._enemyWindow;
        if (_enemyWindow && _enemyWindow.active){
            if (_enemyWindow.enemy() == battler || _enemyWindow.cursorAll()){
                SoundManager.playOk();
                this.onEnemyOk();
            } else{
                SoundManager.playCursor();
                _enemyWindow.selectTarget(battler);
            }
        }
    }

    clickPressEnemy(battler){
        if (this._step == SceneBattleStep.SELECTENEMY || this._step == SceneBattleStep.SELECTACTOR){
            this.setCommand({command:BattleCommand.ANALYZE,index:'battler',battler:battler});
        }
        if (this._step == SceneBattleStep.WAITNEXTTURN){
            this.setCommand({command:BattleCommand.ANALYZE,index:'battler',battler:battler});
            this.clearRecord();
            this.clearLog();
        }
    }

    createSpriteset(){
        this._spriteset = new Spriteset_Battle();
        this.addChild(this._spriteset);
    }

    createGridSpriteset(){
        this._gridSpriteset = new Spriteset_BattleGrid();
        this.addChild(this._gridSpriteset);
    }

    createLayerBattleParty(){
        this._layerBattleParty = new Layer_BattleParty($gameParty.battleMembers());
        this.addChild(this._layerBattleParty);
    }

    createLayerBattleTroop(){
        this._layerBattleTroop = new Layer_BattleTroop($gameTroop.members());
        this.setEnemyHandlers();
        this.addChild(this._layerBattleTroop);
    }

    setEnemyHandlers(){
        this._layerBattleTroop.setEnemyClickHandler(this.clickSelectEnemy.bind(this));
        if ($gameDefine.mobileMode){
            // モバイルでは敵の長押し操作を無効化。長押しで特徴を表示
            return;
        }
        this._layerBattleTroop.setEnemyPressHandler(this.clickPressEnemy.bind(this));
    }

    layerBattlePicture(){
        if (this._layerBattlePicture == null){
            this._layerBattlePicture = new Layer_BattlePicture($gameParty.battleMembers());
            this.addChildAt(this._layerBattlePicture,5);
        }
        return this._layerBattlePicture;
    }

    createAllWindows(){
        this.createRecordWindow();
        this.createLogWindow();
        this.createPartyCommandWindow();
        this.createActorWindow();
        this.createEnemyWindow();
    }

    createRecordWindow(){
        this._recordWindow = new Window_BattleRecord(0,8);
        this.addChild(this._recordWindow);
    }

    createLogWindow(){
        this._logWindow = new Window_BattleLog();
        this.addChild(this._logWindow);
    }

    createPartyCommandWindow(){
        this._partyCommandWindow = new Window_PartyCommand();
        this._partyCommandWindow.setHandler('fight',  this.commandFight.bind(this));
        this._partyCommandWindow.setHandler('menu',   this.commandMenu.bind(this));
        this._partyCommandWindow.setHandler('cancel',   this.commandMenu.bind(this));
        this._partyCommandWindow.setHandler('pageup',     this.onAnalyseOpen.bind(this,'last'));
        this._partyCommandWindow.setHandler('pagedown',   this.onAnalyseOpen.bind(this,'start'));
        this.addChild(this._partyCommandWindow);
    }

    showMenuPlate(backCommand,backMenu,menuSprite){
        gsap.to(this._menuPlate,0.2,{opacity:128,y:0});
        gsap.to(this._backButton,0.2,{opacity:255,x:0});
        this._backButton.setup(backMenu);
        this._backButton.setClickHandler(backCommand);
        gsap.to(this._menuSprite,0.2,{opacity:255,y:-8});
        this.setMenuSprite(menuSprite);
        gsap.to(this._elementSprite,0.2,{opacity:255,x:this._elementSprite.baseX()});
    }

    hideMenuPlate(){
        gsap.to(this._menuPlate,0.2,{opacity:0,y:this._menuPlate.y - 64});
        gsap.to(this._backButton,0.2,{opacity:0,x:this._backButton.x - 80});
        gsap.to(this._menuSprite,0.2,{opacity:0,y:this._menuSprite.y - 64});
        gsap.to(this._elementSprite,0.2,{opacity:0,x:this._elementSprite.x - 80});
    }

    hideMenuPlateFast(){
        gsap.to(this._menuPlate,0,{opacity:0,y:this._menuPlate.y - 64});
        gsap.to(this._backButton,0,{opacity:0,x:this._backButton.x - 80});
        gsap.to(this._menuSprite,0,{opacity:0,y:this._menuSprite.y - 64});
        gsap.to(this._elementSprite,0,{opacity:0,x:this._elementSprite.x - 80});
    }

    commandFight(){
        TouchInput.clear();

        this._partyCommandWindow.hide();
        this._partyCommandWindow.deactivate();
        this.removeChild(this._partyCommandWindow);
        this._partyCommandWindow.destroy();
        Window_PartyCommand._lastCommand = 0;
        this._recordWindow.clear();
    
        this.hideMenuPlate();
        this._keyMapWindow.hide();
        this.setCommand({command: BattleCommand.FIGHT});
        if (this._dockMenu){
            this._dockMenu.hide();
        }
    
        this.changeStep(SceneBattleStep.Selecting);
    }

    commandMenu(){
        AudioManager.stopSe();
        this.setCommand({command: BattleCommand.MENU});
    }

    callcommandMenu(){
        AudioManager.stopSe();
        if ($gameDefine.mobileMode){
            SoundManager.playCancel();
        }
        this.setCommand({command: BattleCommand.MENU});
    }

    attackAfterHeal(dataList){
        // 複数音声を同時にならさない
        let noSound = false;
        dataList.forEach(data => {   
            this._layerBattleTroop.startAnimation(data.battler,1664,false, 0,0.75,noSound,false);
            this._layerBattleTroop.setDamagePopup(data.battler,'hpHeal',Math.round(data.value));
            this._layerBattleParty.startAnimation(data.battler,1664, false, 0,0.75,noSound,false);
            this._layerBattleParty.setDamagePopup(data.battler,'hpHeal',Math.round(data.value));
            this._recordWindow.addDamageText(data.battler,'hpHeal',Math.round(data.value));
            noSound = true;
        },this);
    }

    slipTurn(battler,value){
        this._layerBattleTroop.startAnimation(battler,1346, false, 0,1,false,false);
        this._layerBattleTroop.setDamagePopup(battler,'hpDamage',Math.round((-1*value)));
        this._layerBattleParty.startAnimation(battler,1346, false, 0,1,false,false);
        this._layerBattleParty.setDamagePopup(battler,'hpDamage',Math.round((-1*value)));
        this._recordWindow.addDamageText(battler,'hpDamage',Math.round((-1*value)));
    }

    startTurnStatePopup(turnStateData){
        turnStateData.add.forEach(data => {   
            this._recordWindow.addStateText(data.battler,PopupTextType.AddState,TextManager.getStateName(data.stateId));
            this.startStatePopup(data.battler,PopupTextType.AddState,TextManager.getStateName(data.stateId));
        },this);
        turnStateData.remove.forEach(data => {   
            this._recordWindow.addStateText(data.battler,PopupTextType.RemoveState,TextManager.getStateName(data.stateId));
            this.startStatePopup(data.battler,PopupTextType.RemoveState,TextManager.getStateName(data.stateId));
        },this);
    }

    statePopup(popupData){
        popupData.forEach(data => {   
            if (data.type == PopupTextType.Damage){
                data.battler.performDamage();
                this._layerBattleTroop.setDamagePopup(data.battler,'hpDamage',Math.round((-1*data.value)));
                this._layerBattleParty.setDamagePopup(data.battler,'hpDamage',Math.round((-1*data.value)));
                this._recordWindow.addDamageText(data.battler,'hpDamage',Math.round((-1*data.value)));
                return;
            }
            this._recordWindow.addStateText(data.battler,data.type,data.value);
            if (data.type == PopupTextType.ResistState){
                data.value = TextManager.getText(611500);
            }
            this.startStatePopup(data.battler,data.type,data.value);
            if (data.animationId){
                this._layerBattleTroop.startAnimation(data.battler,data.animationId, false, 0,1,false,true);
                this._layerBattleParty.startAnimation(data.battler,data.animationId, false, 0,1,false,true);
            }
        },this);
    }

    createSkillWindow(){
        this._skillWindow = new Window_BattleSlotSkill(264,36,584,400);
        this._skillWindow.setHandler('ok',        this.onSkillOk.bind(this));
        if (!this.isLastBattle()){
            this._skillWindow.setHandler('cancel',    this.onSkillCancel.bind(this));
        }
        this._skillWindow.setHandler('pageup',    this.onAnalyseOpen.bind(this,'last'));
        this._skillWindow.setHandler('pagedown',  this.onAnalyseOpen.bind(this,'start'));
        
        if (!this.isLastBattle()){
            this._skillWindow.setHandler('menu',     this.onSkillChange.bind(this));
            this._skillWindow.setHandler('shift',     this.onLimitBreak.bind(this));
            this._skillWindow.setHandler('left',     this.changeCommandCategory.bind(this,1));
            this._skillWindow.setHandler('right',     this.changeCommandCategory.bind(this,1));
        }
        this._skillWindow.setHandler('index',     this.changeSkillIndex.bind(this));
        //this._skillWindow.setHandler('menu',     this.onSkillChangeCategory.bind(this));
        this.addChild(this._skillWindow);
    }

    createOtherSkillWindow(){
        this._otherSkillWindow = new Window_BattleSlotSkill(264,36,584,400);
        this._otherSkillWindow.setHandler('ok',        this.onOtherSkillOk.bind(this));
        this._otherSkillWindow.setHandler('left',     this.changeCommandCategory.bind(this,-1));
        this._otherSkillWindow.setHandler('right',     this.changeCommandCategory.bind(this,-1));
        this._otherSkillWindow.setHandler('cancel',     this.resetCommandCategory.bind(this));
        this._otherSkillWindow.hide();
        this._otherSkillWindow.deactivate();
        this.addChild(this._otherSkillWindow);
    }

    resetCommandCategory(){
        this._category = 0;
        this.refreshSkillCommands();
    }

    changeCommandCategory(value){
        if (value == 0){
            value = this._category > 0 ? -1 : 1;
        }
        this._category += value;
        if (this._category < -1) {this._category = -1};
        if (this._category > 1) {this._category = 1};
        this.refreshSkillCommands();
    }

    refreshSkillCommands(){
        SoundManager.playCursor();
        switch (this._category){
            case 0:
                this._otherSkillWindow.hide();
                this._otherSkillWindow.deactivate();
                this._skillWindow.reShowAnimation();
                this._skillWindow.activate();
                
                this.changeSkillIndex();
                if (this._dockMenu){
                    this._dockMenu.enableSkillChangeButton(true);
                    this._dockMenu.enableLimitBreakButton(true);
                }
                break;
            case 1:
                this._skillWindow.deactivate();
                this._skillWindow.hideAnimation();
                const lastIndex = this._otherSkillWindow.index();
                this._otherSkillWindow.show();
                this._otherSkillWindow.activate();
                this._otherSkillWindow.showAnimation();
                if (lastIndex == 0 || lastIndex == 1){
                    this._otherSkillWindow.selectLastOther(lastIndex);
                }
                
                this._keyMapWindow.refresh("battleOtherSkill");
                if (this._dockMenu){
                    this._dockMenu.enableSkillChangeButton(false);
                    this._dockMenu.enableLimitBreakButton(false);
                }
                break;
        }

    }

    createSkillItemWindow(){
        this._itemWindow = new Window_SkillItemList(264,36,584,384);
        this._itemWindow.setHandler('ok',     this.onSkillChangeOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onSkillChangeCancel.bind(this));
        this.addChild(this._itemWindow);
    }

    itemWindow(){
        if (this._itemWindow == null){
            this.createSkillItemWindow();
        }
        return this._itemWindow;
    }

    createStatusWindow(){
        this._statusWindow = new Window_StatusInfo(264,36,624, 384);
        this._statusWindow.setHandler('pageup',    this.onAnalyseOpen.bind(this,'previous'));
        this._statusWindow.setHandler('pagedown',  this.onAnalyseOpen.bind(this,'next'));
        this._statusWindow.setHandler('cancel',    this.onAnalyseCancel.bind(this));
        this.addChild(this._statusWindow);
        this._statusWindow.hide();
        this._statusWindow.deactivate();
    }

    onAnalyseOpen(selectIndex){
        this.setCommand({command: BattleCommand.ANALYZE, index : selectIndex});
    }

    showAnalyze(battler,actions){
        if (this._partyCommandWindow){
            this._partyCommandWindow.hide();
            this._partyCommandWindow.deactivate();
        }
        this._skillWindow.deactivate();
        this._skillWindow.deleteAnimation();
        this._enemyWindow.deactivate();
        this._actorWindow.deactivate();
        this._actorWindow.hide();
    
        this.showMenuPlate(this.callAnalyseCancel.bind(this),TextManager.getBackText(),TextManager.getText(600900));
        this._keyMapWindow.refresh("battleAnalyse");
        this._keyMapWindow.show();
    
        if (battler.isActor()){
            this.layerBattlePicture().refreshBattlerPicture(battler);
        } else{
            this.layerBattlePicture().hideBattlerPicture();
        }
        this._layerBattleTroop.analyseSelectMove(battler);
    
        this._statusWindow.setData(battler,actions);
        this._statusWindow.show();
        this._statusWindow.activate();
        this._statusWindow.showAnimation();
        this._statusWindow.selectLast();
    }

    callAnalyseCancel(){
        SoundManager.playCancel();
        this.onAnalyseCancel();
    }

    onAnalyseCancel(){
        this._statusWindow.deleteAnimation();
        this._statusWindow.deactivate();
    
        if (this._step == SceneBattleStep.NONE){
            this.displayPartyCommand();
            this._keyMapWindow.refresh("battleStart");
            this._keyMapWindow.show();
            let battleTextId = 600500;
            this.showMenuPlate(this.callcommandMenu.bind(this),TextManager.getMenuText(),TextManager.getText(battleTextId));    
            this.layerBattlePicture().hideBattlerPicture();
        } else {
            if (this._step == SceneBattleStep.SELECTENEMY || this._step == SceneBattleStep.SELECTACTOR){
                this._keyMapWindow.hide();
                var action = this._skillWindow.actor().currentAction();
                this.onSelectAction(this._skillWindow.actor(),action,action.isForOpponent());
                this.layerBattlePicture().hideBattlerPicture();
            } else
            if (this._step == SceneBattleStep.WAITNEXTTURN){
                this.layerBattlePicture().hideBattlerPicture();
                this.hideMenuPlate();
                this.displayWaitNextTurn();
            } else{
                this._gridSpriteset.setPhase("ap");
                this._skillWindow.show();
                this._skillWindow.activate();
                this._skillWindow.showAnimation();
                this._skillWindow.selectLast();
                this.changeSkillIndex();
                this.layerBattlePicture().refreshBattlerPicture(this._skillWindow.actor());
            }
        }
        this._layerBattleTroop.resetEnemyOpacity();
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.show();
            this._keyMapWindow.refresh("battleStart");
        }
    }

    createActorWindow(){
        this._actorWindow = new Window_BattleActor(40,424);
        this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
        this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
        this.addChild(this._actorWindow);
    }

    createEnemyWindow(){
        this._enemyWindow = new Window_BattleEnemy();
        this._enemyWindow.setHandler('ok',     this.onEnemyOk.bind(this));
        this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
        this.addChild(this._enemyWindow);
    }

    async processVictory(){
        let levelup = new Sprite_Levelup();
        this.addChild(levelup);
        await levelup.setup(LevelUpType.Victory);
    }

    passiveSkillsStatePopup(battlers){
        battlers.forEach(battler => {
            battler.passiveSkills().forEach(passiveData => {
                if (battler.isEnablePasiveSkill(passiveData)){
                    this.startStatePopup(battler,PopupTextType.AddState,TextManager.getSkillName(passiveData.skill.id));
                }
            });
        });
    }

    startStatePopup(target,type,value){
        this._layerBattleParty.startStatePopup(target,type,value);
        this._layerBattleTroop.startStatePopup(target,type,value);
    }

    clearStatePopup(){
        this._layerBattleParty.clearStatePopup();
        this._layerBattleTroop.clearStatePopup();
    }

    clearDamagePopup(){
        this._layerBattleParty.clearDamagePopup();
        this._layerBattleTroop.clearDamagePopup();
    }

    performActionStart(battler){
        this._layerBattleTroop.performActionStart(battler);
    }

    startCounterAnimation(battler){
        this._layerBattleParty.startCounterAnimation(battler);
        this._layerBattleTroop.startCounterAnimation(battler);
    }

    startChainAnimation(battler){
        this._layerBattleParty.startChainAnimation(battler);
        this._layerBattleTroop.startChainAnimation(battler);
    }

    startBossCollapseAnimation(enemy,endAction){
        let sprite = _.find(this._layerBattleTroop._enemySprites,(sprite) => sprite._battler == enemy);
        sprite.startEffect('bossCollapse');
        // フレームレートを1/4にする
        Graphics._onTickSkipFlag = true;
        this._snap = SceneManager.snap();
        //this.startAnimation(enemy,9,false,0,1,true,true);
        //var sprite = _.find(this._layerBattleTroop._enemySprites,(sprite) => sprite._battler == enemy);
        //this.startAnimationEffect(enemy,130,false);
        let resultAnim = this._layerBattleTroop.startAnimationEffect(this._spriteset,enemy,1,false);
        resultAnim._animation.speed = 200;
        let self = this;
        resultAnim.setFrameIndexEvent(110,() => {
            self.startBreakAnimation(enemy);
            SoundManager.playBossCollapse1();
        });
        resultAnim.setFrameIndexEvent(130,() => {
            resultAnim._animation.speed = 20;
        });
        resultAnim.setFrameIndexEvent(360,() => {
            AudioManager.fadeOutBgm(2);
        });
        resultAnim.setFrameIndexEvent(480,() => {
            EventManager.startFadeOut(0.5);
        });
        resultAnim.setFrameIndexEvent(500,() => {
            if (endAction){
                endAction();
            }
            resultAnim._animation.speed = 0;
        });
        gsap.to(this, 9, {opacity:255,onComplete:function(){
            Graphics._onTickSkipFlag = false;
        }});
    }

    startBreakAnimation(enemy){
        this.layerBattlePicture().visible = false;
        this._gridLineSprite.visible = false;
        this._gridSpriteset.visible = false;
        this._recordWindow.visible = false;
        if (enemy){
            const sprite = _.find(this._layerBattleTroop._enemySprites,(sprite) => sprite._battler == enemy);
            const rect = sprite._mainSprite.bitmap.rect;
        } else{
        }
        this._layerBattleParty.visible = false;
        this._layerBattleTroop.visible = false;
        BackGroundManager.clearWeather();
        EventManager.clearWeather();
        BackGroundManager.collapseBackGround();
    }

    isGuarding(){
        return TouchInput.isPressed() || Input.isPressed("cancel");
    }

    isAnimationSkip(){
        return Input.isRepeated('ok') || this.animationEnd();
    }

    substituteMove(target,substituted){
        this._layerBattleTroop.substituteMove(target,substituted);
    }

    substituteMoveReset(){
        this._layerBattleTroop.substituteMoveReset();
    }

    addTroops(troops){
        this._layerBattleTroop.addTroops(troops);
        this.setEnemyHandlers();
        this._recordWindow.addText(TextManager.getText(611600));
        this._gridSpriteset.addTroops(troops);
    }

    approacheTroops(troops){
        this._layerBattleTroop.approacheTroops(troops);
    }

    eventStart(){
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        this.itemWindow().hide();
        this.itemWindow().deactivate();
        this._actorWindow.deactivate();
        this._enemyWindow.deactivate();
        this._gridLineSprite.visible = false;
        this._gridSpriteset.visible = false;
        this._layerBattleParty.visible = false;
        this._layerBattleTroop.visible = false;
        this.hideMenuPlate();
        this._keyMapWindow.hide();
        this._recordWindow.clear();
        this.layerBattlePicture().hideBattlerPicture();
    }

    eventEnd(){
        /*
        if (this._gridSpriteset){
            var index = _.findIndex(this.children,(child) => child == this._gridSpriteset);
            this._gridSpriteset.terminate();
            this.removeChild(this._gridSpriteset);
            this._gridSpriteset = new Spriteset_BattleGrid();
            this.addChildAt(this._gridSpriteset,index);
        }
    
        if (this._layerBattleParty){
            var index = _.findIndex(this.children,(child) => child == this._layerBattleParty);
            this._layerBattleParty.terminate();
            this.removeChild(this._layerBattleParty);
            this._layerBattleParty = new Layer_BattleParty($gameParty.battleMembers());
            this.addChildAt(this._layerBattleParty,index);
        }
    
        if (this._layerBattleTroop) this._layerBattleTroop.visible = true;
        if (this._gridLineSprite) this._gridLineSprite.visible = true;
        this.setCommand({command: BattleCommand.SKILLCANCEL});
        */
    }

    async startLastAttack(battlers){
        return new Promise(resolve => {
            this.startLastAttackAnimation(battlers,() => {
                resolve();
            } );
        });
    }

    async processDefeat(okhundler){
        let levelup = new Sprite_Levelup();
        this.addChild(levelup);
        await levelup.setup(LevelUpType.Lose);
        PopupManager.openBattleLose(() => {
            if (okhundler) okhundler();
        },() => {
            SceneManager.goto(Title_Scene);
        });
    }

    async processChallengeDefeat(okhundler){
        let levelup = new Sprite_Levelup();
        this.addChild(levelup);
        await levelup.setup(LevelUpType.Lose);
        PopupManager.openChallengeLose(() => {
            if (okhundler) okhundler();
        });
    }

    changeSkillIndex(){
        if (this._keyMapEvent){
            const keyMapType = this._keyMapEvent();
            this._keyMapWindow.refresh(keyMapType);
            if (this._dockMenu){
                if (keyMapType == "battleSkillLimitBreak"){
                    this._dockMenu.showLimitBreakButton();
                } else{
                    this._dockMenu.hideLimitBreakButton();
                }
            }
        }
    }

    createBattleDockButton(){
        this._dockMenu = new Sprite_BattleDock();
        this._dockMenu.setClickHandler(BattleDockActionType.SkillChange,this.onSkillChange.bind(this));
        this._dockMenu.setClickHandler(BattleDockActionType.LimitBreak,this.onLimitBreak.bind(this));
        this._dockMenu.setClickHandler(BattleDockActionType.Guard,this.onSkillCancel.bind(this));
        this._dockMenu.setClickHandler(BattleDockActionType.Analyze,this.onAnalyseOpen.bind(this,'start'));
        this._dockMenu.setClickHandler(BattleDockActionType.AnalyzeNext,this.onAnalyseOpen.bind(this,'next'));
        this._dockMenu.setClickHandler(BattleDockActionType.AnalyzePrevios,this.onAnalyseOpen.bind(this,'previous'));
        this._dockMenu.setClickHandler(BattleDockActionType.CategoryChange,this.changeCommandCategory.bind(this,0));
        
        if (!this.isLastBattle()){
            this.addChild(this._dockMenu);
        }
        this._dockMenu.hide();
    }

    terminate(){
        super.terminate();
        this.clearAnimation();
        this.clearStatePopup();
        this.clearDamagePopup();
        if (this._layerBattleParty){
            this._layerBattleParty.terminate();
        }
        this._layerBattleParty = null;
        if (this._layerBattlePicture){
            this._layerBattlePicture.terminate();
        }
        this._layerBattlePicture = null;
        if (this._layerBattleTroop){
            this._layerBattleTroop.terminate();
        }
        this._layerBattleTroop = null;
        if (this._itemWindow){
            this._itemWindow.terminate();
        }
        this._itemWindow = null;
        this._actorWindow = null;
        this._enemyWindow = null;
        if (this._logWindow){
            this._logWindow.destroy();
        }
        this._logWindow = null;
        this._partyCommandWindow = null;
        if (this._skillWindow){
            this._skillWindow.terminate();
        }
        this._skillWindow = null;
        if (this._statusWindow){
            this._statusWindow.terminate();
        }
        this._statusWindow = null;
        if (this._gridSpriteset){
            this._gridSpriteset.terminate();
        }
        this._gridSpriteset = null;
        if (this._elementSprite){
            this._elementSprite.terminate();
        }
        this._keyMapWindow.terminate();
        this._keyMapWindow = null;
    
        this._recordWindow.terminate();
        this._recordWindow = null;
        //this._effect.terminate();
        
        EventManager.remove();
        BackGroundManager.remove();
        TipsManager.remove();
        this.destroy();
    }

    isLastBattle(){
        return $gameTroop.troopId() == $gameDefine.lastBattleTroopId;
    }

    async newRecord(recordData){
        let levelup = new Sprite_Levelup();
        this.addChild(levelup);
        await levelup.setupNewRecord(LevelUpType.NewRecord,recordData);
    }
}

/*
Scene_Battle.prototype.onSkillChangeCategory = function() {
    this.setCommand({command: BattleCommand.SKILLCHANGECATEGORY});
}
*/

/*
Scene_Battle.prototype.commandSkillChangeCategory = function(battler,skills) {
    SoundManager.playCancel();
    this._skillWindow.show();
    this._skillWindow.activate();
    this._skillWindow.setData(battler,skills);
    this._skillWindow.selectLast();
    this._skillWindow.showAnimation();
}
*/

const SceneBattleStep = {
    NONE : 0,
    Selecting : 1,
    SELECTACTOR : 2,
    SELECTENEMY : 3,
    WAITNEXTTURN : 4
}

const BattleCommand = {
    NONE : 0,
    MENU : 1,
    FIGHT : 2,
    ACTION : 3,
    SKILLCANCEL : 4,
    Start : 5,
    GUARDING : 6,
    SkillOk : 7,
    ANALYZE : 8,
    SKILLCHANGE : 9,
    LIMITBREAK : 10,
    Ready : 11,
    PreReady : 12,
    OtherSkill : 13,
}