//-----------------------------------------------------------------------------
// Battle_View
//
// The scene class of the battle screen.

class Battle_View extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Battle_Presenter(this);
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

    isGuard(){
        return Input.isPressed("cancel");
    }

    start(){
        super.start();
        this.setCommand({command:BattleCommand.Start});
    }

    createObjectAfter(){
        this.createGridLine();
        this.createGridSpriteset();
        this.createKeyMapWindow();
        this.createAllWindows();
    }


    setBackGround(backGround1,backGround2){
        BackGroundManager.changeBackGround(backGround1,backGround2);
        BackGroundManager.resetPosition();
    }

    setEnemy(enemyList){
        if (this._layerBattleTroop == null){
            this._layerBattleTroop = new Layer_BattleTroop(enemyList);
            this.setEnemyHandlers();
            this.addChild(this._layerBattleTroop);
        }
        if (this._enemyWindow == null){
            this._enemyWindow = new Battle_EnemyStatus();
            this._enemyWindow.setHandler('ok',     this.setCommand.bind(this,{command:BattleCommand.Action,isEnemy:true}));
            this._enemyWindow.setHandler('cancel', this.setCommand.bind(this,{command:BattleCommand.Active}));
            this._enemyWindow.setHandler('index', this.changeEnemyIndex.bind(this));
            this._enemyWindow.setEnemy(enemyList);
            this.addChild(this._enemyWindow);
        }
        enemyList.forEach(enemy => {
            this._gridSpriteset.addMember(enemy);
        });
    }

    changeEnemyIndex(){
        const _selectedEnemy = this._enemyWindow.selectedEnemy();
        this._layerBattleTroop.showBattleStatus(_selectedEnemy);
    }

    resetPosition(){
        this._layerBattleTroop.resetPosition();
    }

    selectTargetIndex(isEnemy){
        if (isEnemy) return this._enemyWindow.enemyIndex();
        return this._actorWindow.index();
    }

    setActor(actorList){
        if (this._layerBattlePicture == null){
            this._layerBattlePicture = new Layer_BattlePicture(actorList);
            this.addChild(this._layerBattlePicture);
        }
        if (this._layerBattleParty == null){
            this._layerBattleParty = new Layer_BattleParty(actorList);
            this.addChild(this._layerBattleParty);
        }
        actorList.forEach(actor => {
            this._gridSpriteset.addMember(actor);
        });
    }

    setBattleSkill(data,index){
        if (this._skillWindow == null){
            this._skillWindow = new Battle_MagicList(200,80,540,320);
            this._skillWindow.setHandler("ok", this.setCommand.bind(this,{command:BattleCommand.SelectSkill}));
            this.addChild(this._skillWindow);
        }
        this._skillWindow.setBattleMagic(data);
        this._skillWindow.show();
        this._skillWindow.activate();
        this._skillWindow.selectLast(index);
    }

    selectSkill(){
        return this._skillWindow.item().skill;
    }

    commandStart(){
        this.createHelpWindow();
        this.createPartyCommandWindow();
        this.displayPartyCommand();
        this._gridSpriteset.refreshPosition();
    }

    commandAction(){
        if (this._skillWindow){
            this._skillWindow.hide();
            this._skillWindow.deactivate();
        }
        this._enemyWindow.hide();
        this._enemyWindow.deactivate();
        this._layerBattleTroop.hideBattleStatus();
        this._actorWindow.hide();
        this._actorWindow.deactivate();
        //this._keyMapWindow.hide();
        //this._gridSpriteset.clearNextOrder();
        //this._gridSpriteset.setPhase("action");
    }

    recreateStartObject(){
        this.createSpriteset();
        this.createFeatureWindow();
        this._elementSprite = new Sprite_Element(12,80);
        this.addChild(this._elementSprite);
        this._elementSprite.visible = false;
        this._gridSpriteset.ready();
        if($gameDefine.mobileMode == true){
            this.removeChild(this._dockMenu);
            this.addChild(this._dockMenu);
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

    bindDamage(bindBatllers){
        bindBatllers.forEach(bindBatller => {
            this._layerBattleParty.setDamagePopup(bindBatller,"hpDamage", 1,0);
            this._layerBattleTroop.setDamagePopup(bindBatller,"hpDamage", 1,0);
        });
        if (bindBatllers.length > 0){
            this.refreshStatus();
        }
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
        this._checkedAnimation = true;
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

    displaySkillName(text){
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
        if (this._checkedActive){
            this._checkedActive = false;
            this.setCommand({command: BattleCommand.CheckActive});
        }
        if (this._battleEnd && Input.isTriggered("ok")){
            this._battleEnd = false;
            this.setCommand({command: BattleCommand.BattleEnd});
        }
        super.update();
        if (this.animationEnd() && this._checkedAnimation){
            this._checkedAnimation = false;
            this.setCommand({command: BattleCommand.ActionEnd});

        }
        if ($gamePause == true){
            return;
        }
        $gameScreen.update();
        //this.updateSkillAddict();
        this.updateAnimationSkipMethod();
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
        /*
        if (this._enemyWindow && !this._enemyWindow.active){
            this._layerBattleTroop.stopSkillAddict();
            return;
        }
        if (this._layerBattleTroop){
            this._layerBattleTroop.setSkillAddict(this._skillWindow.actor());

        }
        */
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


    setWait(num){
        return new Promise(resolve => {
            const delayTime = num
            setTimeout(() => {
              return resolve()
            }, delayTime)
        });
    }

    selectActorSelection(targetId,actionTargetData){
        this._actorWindow.show();
        this._actorWindow.activate();
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        this._layerBattlePicture.hideBattlerPicture();
        if (actionTargetData.isForAll){
            this._actorWindow.selectAll();
        } else{
            this._actorWindow.select(targetId);
        }
        this._actorWindow.setCursorFixed(actionTargetData.isForUser);
    }

    onActorOk(){
        this._actorWindow.deactivate();
        this._actorWindow.hide();
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        //this._keyMapWindow.hide();
        this.setCommand({command: BattleCommand.Action,isActor:false});
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
        this._skillWindow.show();
        this._skillWindow.activate();
        this._skillWindow.selectLast();

        //this._keyMapWindow.show();
        this._gridSpriteset.clearNextOrder();
        var actor = this._skillWindow.actor();
        this.layerBattlePicture().refreshBattlerPicture(actor);
    
        if (this._dockMenu){
            this._dockMenu.show();
            this._dockMenu.showTypeChange(true);
        }
    }

    selectEnemySelection(targetId,actionTargetData){
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        this._layerBattlePicture.hideBattlerPicture();
        this._enemyWindow.show();
        this._enemyWindow.activate();
        if (actionTargetData.isForAll){
            this._enemyWindow.selectAll();
        } else
        if (actionTargetData.isLine){
            this._enemyWindow.selectLine();
        } else{
            if (targetId != null){
                this._enemyWindow.selectTarget(targetId);
            } else{
                this._enemyWindow.selectTarget(null);
            }
        }
        this.changeEnemyIndex();
    }

    onEnemyOk(){
        if (this._featureWindow._openness > 0){
            this._enemyWindow.activate();
            return;
        }
        this._enemyWindow.deactivate();
        this.setCommand({command: BattleCommand.ACTION, isActor:false});
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
        
        if (this._dockMenu){
            this._dockMenu.show();
            this._dockMenu.showTypeChange(true);
        }
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


    onLimitBreak(){
        this.setCommand({command: BattleCommand.LIMITBREAK});
    }

    hideSkillCommandWindows(){
        this._skillWindow.hide();
        this._skillWindow.deactivate();
    }

    commandLimitBreak(skills,battler){
        this._skillWindow.activate();
        if (skills != null && battler != null){
            this._skillWindow.setData(skills,battler);
            this._skillWindow.showAnimation();
        }
    }

    reShowSkillList(){
        this._skillWindow.refresh();
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        if (this._dockMenu){
            this._dockMenu.enableLimitBreakButton(true);
            this._dockMenu.enableCategoryChangeButton(true);
            this._dockMenu.enableGuardButton(true);
        }
    }


    commandSelectSkill(skillTargetList,targetId,actionTargetData){
        //this._gridSpriteset.showNextOrder(battler);
        if (actionTargetData.isForOpponent) {
            this._enemyWindow.setEnemy(skillTargetList);
            this.selectEnemySelection(targetId,actionTargetData);
        } else {
            this.selectActorSelection(targetId,actionTargetData);
        }
    }

    createGridLine(){
        this._gridLineSprite = new Sprite();
        this._gridLineSprite.bitmap = ImageManager.loadSystem('gridLine');
        this._gridLineSprite.x = 88;
        this._gridLineSprite.y = -48;
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
                //this.onEnemyOk();
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

    createAllWindows(){
        this.createRecordWindow();
        this.createLogWindow();
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
        this._partyCommandWindow.setHandler('fight',  this.setCommand.bind(this,{command:BattleCommand.Fight}));
        this._partyCommandWindow.setHandler('menu',   this.commandMenu.bind(this));
        this._partyCommandWindow.setHandler('cancel',   this.commandMenu.bind(this));
        this._partyCommandWindow.setHandler('pageup',     this.onAnalyseOpen.bind(this,'last'));
        this._partyCommandWindow.setHandler('pagedown',   this.onAnalyseOpen.bind(this,'start'));
        this.addChild(this._partyCommandWindow);
    }




    commandFight(){
        TouchInput.clear();

        this._partyCommandWindow.hide();
        this._partyCommandWindow.deactivate();
        Window_PartyCommand._lastCommand = 0;

        this._recordWindow.clear();
    
        this._keyMapWindow.hide();
        if (this._dockMenu){
            this._dockMenu.hide();
        }
    
        this.setCommand({command: BattleCommand.CheckActive});
    }


    commandCheckActive(_actionBattler){
        this._gridSpriteset.refreshPosition();
        if (_actionBattler == null){
            this._checkedActive = true;
        } else{
            this.setCommand({command: BattleCommand.Active});
        }
    }

    commandActive(_actionBattler,battleSkill){
        this._layerBattlePicture.refreshBattlerPicture(_actionBattler);
        this.setBattleSkill(battleSkill,_actionBattler.lastBattleSkillId());
        this._enemyWindow.hide();
        this._enemyWindow.deactivate();
        this._actorWindow.hide();
        this._actorWindow.deactivate();
        this._layerBattleTroop.hideBattleStatus();
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
            this._layerBattleTroop.startAnimation(data.battler,45,false, 0,0.75,noSound,false);
            this._layerBattleTroop.setDamagePopup(data.battler,'hpHeal',Math.round(data.value));
            this._layerBattleParty.startAnimation(data.battler,45, false, 0,0.75,noSound,false);
            this._layerBattleParty.setDamagePopup(data.battler,'hpHeal',Math.round(data.value));
            this._recordWindow.addDamageText(data.battler,'hpHeal',Math.round(data.value));
            noSound = true;
        },this);
    }

    slipTurn(battler,value){
        this._layerBattleTroop.startAnimation(battler,59, false, 0,1,false,false);
        this._layerBattleTroop.setDamagePopup(battler,'hpDamage',Math.round((-1*value)));
        this._layerBattleParty.startAnimation(battler,59, false, 0,1,false,false);
        this._layerBattleParty.setDamagePopup(battler,'hpDamage',Math.round((-1*value)));
        this._recordWindow.addDamageText(battler,'hpDamage',Math.round((-1*value)));
    }

    slipBurn(battler,value){
        this._layerBattleTroop.startAnimation(battler,3, false, 0,1,false,false);
        this._layerBattleTroop.setDamagePopup(battler,'hpDamage',Math.round((-1*value)));
        this._layerBattleParty.startAnimation(battler,3, false, 0,1,false,false);
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
    }

    processVictory(){
        this._battleEnd = true;
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
        this._actorWindow.deactivate();
        this._enemyWindow.deactivate();
        this._gridLineSprite.visible = false;
        this._gridSpriteset.visible = false;
        this._layerBattleParty.visible = false;
        this._layerBattleTroop.visible = false;
        this._keyMapWindow.hide();
        this._recordWindow.clear();
        this.layerBattlePicture().hideBattlerPicture();
    }

    eventEnd(){
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
            SceneManager.goto(Title_View);
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


    createBattleDockButton(){
        this._dockMenu = new Sprite_BattleDock();
        this._dockMenu.setClickHandler(BattleDockActionType.LimitBreak,this.onLimitBreak.bind(this));
        this._dockMenu.setClickHandler(BattleDockActionType.Analyze,this.onAnalyseOpen.bind(this,'start'));
        this._dockMenu.setClickHandler(BattleDockActionType.AnalyzeNext,this.onAnalyseOpen.bind(this,'next'));
        this._dockMenu.setClickHandler(BattleDockActionType.AnalyzePrevios,this.onAnalyseOpen.bind(this,'previous'));
        
        this.addChild(this._dockMenu);
        this._dockMenu.hide();
    }
/*
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
    */

    async newRecord(recordData){
        let levelup = new Sprite_Levelup();
        this.addChild(levelup);
        await levelup.setupNewRecord(LevelUpType.NewRecord,recordData);
    }
}

const SceneBattleStep = {
    NONE : 0,
    Selecting : 1,
    SELECTACTOR : 2,
    SELECTENEMY : 3,
    WAITNEXTTURN : 4
}

const BattleCommand = {
    NONE : 0,
    Start : 105,
    Fight : 107,
    Active : 108,
    CheckActive :109,
    SelectSkill : 110,
    Action : 111,
    ActionEnd: 112,
    BattleEnd : 200,
    MENU : 1,
    SkillOk : 7,
    Ready : 11,
    PreReady : 12,
}