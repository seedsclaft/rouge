class Battle_Presenter extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new Battle_Model();
    
        this.setEvent();
        this.setAnimationSkipEvent();
        this.setKeyMapEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    setAnimationSkipEvent(){
        this._view.setAnimationSkipEvent(this.updateAnimationSkip.bind(this));
    }

    setKeyMapEvent(){
        this._view.setKeyMapEvent(this.getKeyMapType.bind(this));
    }

    getKeyMapType(){
        const slotSkill = this._view._skillWindow.item();

        const limitBreakSkill = $dataSkills[slotSkill.skillId + 1000];
        let battler = this._view._skillWindow.actor();
        if (battler.isTpMax()){
            if (limitBreakSkill && limitBreakSkill.name != ""){
                return "battleSkillLimitBreak";
            }
        }
        return "battleSkill";
    }

    setActionType(type){
        this._actionType = type;
    }


    update(){
        //this.updateWaitNextTurn();
        //this.updateBattleEnd();
    }

    updateCommand(){
        super.updateCommand();
        const _currentCommand = this._view._command.pop();
        switch (_currentCommand.command){
            case BattleCommand.Start:
            return this.commandStart();
            case BattleCommand.Fight:
            return this.commandFight();
            case BattleCommand.Active:
            return this.commandActive();
            case BattleCommand.CheckActive:
            return this.commandCheckActive();
            case BattleCommand.SelectSkill:
            return this.commandSelectSkill();
            case BattleCommand.Action:
            return this.commandAction(_currentCommand.isEnemy);
            case BattleCommand.ActionEnd:
            return this.commandActionEnd();
            case BattleCommand.BattleEnd:
            return this.commandBattleEnd();
            /*
            case BattleCommand.MENU:
            return this.commandMenu();
            case BattleCommand.ACTION:
            return this.commandAction(this._view._command.isActor);
            case BattleCommand.SkillOk:
            return this.commandSkillOk();
            case BattleCommand.LIMITBREAK:
            return this.commandLimitBreak();
            case BattleCommand.Ready:
            return this.commandReady();
            case BattleCommand.ANALYZE:
            return this.commandAnalyze(this._view._command.index,this._view._command.battler);
            case BattleCommand.PreReady:
            return this.commandPreReady();
            */
        }
        this._view.clearCommand();
    }



    commandStart(){
        AudioManager.playBgm(this._model.battleBgm());
        this._model.initBattle();
        this._view.setBackGround(this._model.backGround1(),this._model.backGround2());
        
        this._view.createObjectAfter();
        this._view.setEnemy(this._model.enemyData());
        this._view.setActor(this._model.actorData());
        
        //this._view.displayStartMessages($gameTroop.enemiesNames(),false);

        this._view.commandStart();
    }

    commandFight(){
        //???????????????????????????????????????
        //if (DataManager.autoSaveGame(false)) {
        //    DataManager.autoSaveSuccess();
        //}
        //this._model.setBeforeMembers();

        this._view.commandFight();
    }


    updateGuardState(isGuarding){
        if (!this._isPressed){
            if (isGuarding){
                SoundManager.playGuard();
                this._model.addGuardState();
                this._isPressed = isGuarding;
            }
        }
        if (isGuarding) {
            if (!this._isPressed) {
                SoundManager.playGuard();
                this._model.addGuardState();
            }
        } else {
            this._model.eraseGuardState();
        }
        this._isPressed = isGuarding;
    }
    
    commandCheckActive(){
        const _isGuard = this._view.isGuard();
        const _actionBattler = this._model.updateApGain(_isGuard);
        this._view.commandCheckActive(_actionBattler);
        const _bindedBattler = this._model.bindedBattlers();
        this._view.bindDamage(_bindedBattler);
    }

    commandActive(){
        const _actionBattler = this._model.actionBattler();
        if (_actionBattler.isActor()){
            this._model.claerAction();
            if (!this._model.canInput()){
                // ????????????
                if (this._model.bindAttack()){
                    this._model.createBindActionData();
                    this.commandActionStart();
                } else{
                    this._model.selectSkill($gameDefine.noActionSkillId);
                    this.commandAction();
                } 
                return;
            }
            const _battleSkill = this._model.battleSkill(_actionBattler);
            this._view.commandActive(_actionBattler,_battleSkill);    
        } else{
            this._model.selectEnemySkill();
            this.commandAction();
        }
    }

    commandSelectSkill(){
        const _selectSkill = this._view.selectSkill();
        const action = this._model.selectSkill(_selectSkill.id);
        const _actionTargetData = this._model.actionTargetData(action);
        const _targetId = this._model.actionBattler().lastTargetIndex();
        const _skillTargetList = this._model.skillTargetList();
        this._view.commandSelectSkill(_skillTargetList,_targetId,_actionTargetData);
    }

    async commandAction(isEnemy){
        const _targetId = this._view.selectTargetIndex(isEnemy);
        this._model.makeResult(_targetId);
        this._view.commandAction();

        /*
        if (action && action.counter() == true){
            SoundManager.playCounter();
            this._view.startCounterAnimation(actionBattler);
            await this.setWait(750);
        }
        */
       /*
        if (this._model.needMadnessAnimation(actionBattler)){
            this._view.startAnimation(actionBattler,1328,false, 0,1, false,false);
            await this.setWait(1200);
        }
        */
        this.commandActionStart();
    }

    async commandActionStart(){
        this._view.clearStatePopup();
        //this._view.clearDamagePopup();
        const actionBattler = this._model.getActingBattler();
        const action = this._model.currentAction();
        console.log(actionBattler,action)
        this._model.applyGlobal();

        const results = this._model.currentAction().results();
        console.log(results)
        if (results.length == 0){
            this.endTurnAction();
            return;
        }
        
        if (action.item().id != $gameDefine.noActionSkillId){
            this._model.removeNewSkillId(action.item().id);
            const skillName = TextManager.getSkillName( action.item().id );
            const text = actionBattler.name() + TextManager.getText(610900).format(skillName);
            this._view.displaySkillName(text);
            await this.setWait(200);
        }
    
        if (!actionBattler.isActor() && action.isPhysical()){
            this._view.performActionStart(actionBattler);
        }
    
        let animResults = _.uniq(results,(r) => r.target);
        let noSoundFlag = false;
        const animationId = this._model.acnimationId(action);
        animResults.forEach(result => {
            let substituted = result.substitutedTarget;
            if (substituted && result.target != substituted){
                this._view.substituteMove(result.target,substituted);
            }
            // ??????????????????????????????????????????
            if (animationId != 0){
                this._view.startAnimation(result.target,animationId, false, 0,1, noSoundFlag);
            }
            noSoundFlag = true;
        });
        // ?????????????????????
        if (actionBattler.isActor()){
            this._view.changeFaceType(actionBattler,FaceType.Attack);
        }
        //this.setActionType(ActionType.DAMAGE);
    }

    async commandActionEnd(){
        let actionBattler = this._model.getActingBattler();
        let action = this._model.currentAction();
        console.log(actionBattler)
        console.log(action)
        let results = action.results();
        this._model.applyResultsData(action,results);
        this._view.refreshStatus();
        const isAll = this._model.isAllAttack(action,actionBattler);
        let death = [];
        let guradRecord = false;
        let damageRecordInfo = action.damageRecordInfo();
        for (let i = 0;i< results.length;i++){
            let target = results[i].target;
            let battlerId = target.battlerId();
            if (i > 0 && !isAll){
                await this.setWait(100);
            }
            let length = results[i].length - 1;
            if (results[i].weakness){
                //this._view.startStatePopup(target,"weakness","Weakness!");
            }
            if (results[i].isDead){
                Debug.log("????????????????????????????????????");
                //this._view.startStatePopup(target,"weakness","Weakness!");
            }
            if (results[i].hpDamage > 0){
                damageRecordInfo[battlerId].index -= 1;
                let logRecord = (damageRecordInfo[battlerId].index == 0);
                let logDamage = logRecord == true ? damageRecordInfo[battlerId].damage : results[i].hpDamage;
                if (!_.contains(death,target)){
                    target.performDamage();
                }
                if (results[i].guard && !guradRecord){
                    this._view.displayGuardSuccess(target,action);
                    guradRecord = true;
                }
                if (results[i].weakness || results[i].critical || results[i].chargeAttack){
                    this._view.setDamagePopup(target,'hpDamageWeak',results[i].hpDamage,length,logRecord,logDamage);
                } else{
                    this._view.setDamagePopup(target,'hpDamage',results[i].hpDamage,length,logRecord,logDamage);
                }
            } else
            if (results[i].hpDamage < 0){
                this._view.setDamagePopup(target,'hpHeal',results[i].hpDamage,length);
            } else
            if (results[i].mpDamage < 0){
                this._view.setDamagePopup(target,'mpHeal',results[i].mpDamage,length);
            } else
            if (results[i].missed){
                this._view.setDamagePopup(target,'missed',$dataSkills[action.item().id],length);
            } else
            if (results[i].invisible){
                this._view.setDamagePopup(target,'invisible',$dataSkills[action.item().id],length);
            } else
            if (results[i].damageBlock){
                this._view.setDamagePopup(target,'damageBlock',$dataSkills[action.item().id],length);
            } else
            if (results[i].vantageBlock){
                this._view.setDamagePopup(target,'vantageBlock',$dataSkills[action.item().id],length);
            }
            if (results[i].reDamage){
                this._view.setDamagePopup(actionBattler,'hpDamage',results[i].reDamage,length);
            }
            if (!target.isAlive()){
                //target.performCollapse();
                if (!_.contains(death,target)){
                    death.push(target);
                }
            }
            if (!actionBattler.isAlive()){
                //target.performCollapse();
                if (!_.contains(death,actionBattler)){
                    death.push(actionBattler);
                }
            }
    
            //$gameSystem.checkMaxDamage(results[i].hpDamage);
        }
        death.forEach(target => {
            this._model.setLastDeathEnemyIndex(target.index());
            let type = this._model.performCollapseType(target);
            this._view.performCollapse(target,type);
            this._view.recordCollapse(target);
            // ????????????????????????
            if (!target.isActor()){
                //$gameParty.addEnemyInfoData(target.enemyId());
            }
            // ?????????????????????
            let provocationPopup = this._model.removeProvocationState(target);
            if (provocationPopup){
                this._view.statePopup(provocationPopup);
            }
        });

        this.endTurnAction();
    }

    async endTurnAction(){
        this.afterHealAction();
        this.slipTurnAction();
        this.slipBurnAction();
        
        let actionBattler = this._model.getActingBattler();
        let action = this._model.currentAction();
        let repeats = $dataSkills[action.item().id].repeats;
        await this.setWait(repeats * 100);
        if (action && !action.counter() && !action.countered() && !action.madness()){
            // ??????????????????????????????????????????????????????
            this._view.startTurnStatePopup(this._model.turnStateData());
        }
        // ????????????????????????????????????
        const turnEnd = this._model.turnEnd();
        if (turnEnd != null){
            this._view.statePopup(turnEnd);
            if (actionBattler.isDead()){
                let type = this._model.performCollapseType(actionBattler);
                this._view.performCollapse(actionBattler,type);
            }
        }
        // ?????????????????????
        this._model.createAttackTimesAddActionData();
            
        const endTurnPopup = this._model.endTurn();
        this._view.statePopup(endTurnPopup);

        // ????????????
        if (this._model.isSummon()){
            const enemy = this._model.summonEnemy();
            this._view.addTroops([enemy]);
            const summonPopup = this._model.summonPopup(enemy);
            this._view.statePopup(summonPopup);
        }

        if (action._type == "interrupt"){
            this._model.interrupt();
        }
        this._model.createAfterActionData();
        this._model.createDeathActionData();
        this._model.actionClear();
        this._model.resetActionBattlers();

        this.refreshStatus();
        this._view.clearLog();

        // ???????????????
        this._model.changeTroopLine();
        //this._view.clearAnimation();


        if (this._model.checkDefeat()){
            this._model.processDefeat();
            this._view.processDefeat(this.loadAutoSave.bind(this));
            return;
        } else
        if (this._model.checkVictory()){
            $gameParty.onBattleEnd();

            if ($gameTroop.isAllDead() || $gameTroop.isBossDead()){
                if ($gameTroop.isBossDead()){
                    $gameTroop.aliveMembers().forEach(target => {
                        target.addNewState(1);
                        target.refresh();
                        this._view.performCollapse(target,0);
                    });
                }
                this.victoryAction();
                return;
            }
        }


        // ????????????
        if (!this._model.isActingBattler()){
            this._model.createMadnessActionData();
        }
        if (this._model.isActingBattler()){
            this.commandActionStart();
        } else{
            $gameSwitches.setValue($gameDefine.chainSeaquenceSwitchId,true);
            // ????????????
            const checkChainBattler = this._model.checkChainBattler();
            if (checkChainBattler){
                //TipsManager.setTips();
                SoundManager.playChain();
                this._model.setChainBattler();
                this._view.startChainAnimation(this._model.actionBattler());
                this.setActionBattler();
                this._view.displayChainBattler(this._model.actionBattler());
                const tips = $gameTips.getTipsDataByKey("chain");
                TipsManager.setTips(tips);
                await this.setWait(750);
                return;
            }
            // ????????????????????????
            this._model.gainTurnCount();
            TipsManager.setTips();
            this._model.clearActionBattler();


            TouchInput.clear();
    
            this._view.resetApMode();
            this._view.clearRecord();
            this._view.substituteMoveReset();


            this.commandCheckActive();

        }
    }

    commandBattleEnd(){
        if (DataManager.isBattleTest()){
            return;
        }
        this._view.clearLog();
        $gameParty.resetBattleParameter();
        $gameTroop.clear();

        SceneManager.push(Strategy_View);
    }
    
    commandPreReady(){
        const prereadyEvent = this._model.prereadyEvent();
        if (!prereadyEvent){
            this.commandReady();
        }
    }

    async commandReady(){
        this._view.recreateStartObject();
        this._view.setDragHandler((sprite) => {this.commandFeature(sprite)});
        this._view.passiveSkillsStatePopup(this._model.actionBattlers());
        this.refreshStatus();
        this._view.displayPartyCommand();
        TipsManager.setTips();

    }

    updateAnimationSkip(isAnimationSkip){
        switch (this._actionType){
            case ActionType.DAMAGE:
                if (isAnimationSkip){
                    this._view.clearAnimation();
                    this.afterHealAction();
                    if (Input.isRepeated('ok') || TouchInput.isLongPressed()){
                        this._inputFlag = true;
                    }
                }
                break;
            case ActionType.CHARGE:
                if (isAnimationSkip){
                    this._view.clearAnimation();
                    this._model.makeResult();
                    this.startTurn();
                }
                break;
            case ActionType.AFTERHEAL:
                if (isAnimationSkip){
                    this._view.clearAnimation();
                    this.slipTurnAction();
                }
                break;
            case ActionType.POISON:
                if (isAnimationSkip){
                    this._view.clearAnimation();
                    this.endTurnAction();
                    this._inputFlag = false;
                }
                break;
        }
    }

    async updateWaitNextTurn(){
        if (EventManager.busy()){
            return;
        }
        if (this._view._featureWindow._openness > 0){
            return;
        }
    }

    updateBattleEnd(){
        if (EventManager.busy()){
            return;
        }
        if (this._view._featureWindow._openness > 0){
            return;
        }
        if (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered()){

        }
    }

    afterHealAction(){
        if (this._model.needAfterHeal()){
            this._view.clearAnimation();
            const _attackAfterHealData = this._model.attackAfterHeal();
            this._view.attackAfterHeal(_attackAfterHealData);
            this.refreshStatus();            
            //this.setActionType(ActionType.AFTERHEAL);
            this._model.clearDrainState();
            //return;
        }
        //this.slipTurnAction();
    }

    slipTurnAction(){
        if (this._model.needSlipTurn()){
            this._view.clearAnimation();
            const _slipValue = this._model.slipTurn();
            this._view.slipTurn(this._model.actionBattler(),_slipValue);
            this.refreshStatus();
            //this.setActionType(ActionType.POISON);
            //return;
        }
        //this.endTurnAction();
    }

    slipBurnAction(){
        if (this._model.needSlipBurn()){
            this._view.clearAnimation();
            const _slipValue = this._model.slipBurn();
            this._view.slipBurn(this._model.actionBattler(),_slipValue);
            this.refreshStatus();
            //this.setActionType(ActionType.POISON);
            //return;
        }
        //this.endTurnAction();
    }


    async victoryAction(){
        this._model.processVictory();
        // ????????????
        this._view.processVictory();
        this.refreshStatus();
        this.processVictory();
    }


    setActionBattler(){
        let battler = this._model.actionBattler();
        this._view.setActionBattler();
        
        const popup = this._model.refreshPassive([battler]);
        this._view.statePopup(popup);
        this._view.clearRecord();
        this.refreshStatus();
        
        if (this._model.canInput()){
            this._model.makeActions();
            if (battler.isActor()){
            } else{
                if (this._model.needChargeAnimation()){
                    this._view.startAnimation(battler,1663,false, 0,1, false,false);
                    this.setActionType(ActionType.CHARGE);
                } else{
                    this._model.makeResult();
                    this.startTurn();
                }
            }
        } else{
            // ???????????????
            this._view.clearStatePopup();
//            this._view.clearDamagePopup();
            battler.resetAp();
            this._view.startTurn();
            if (this._model.needSlipTurn()){
                //???????????????
                var slipValue = this._model.slipTurn();
                this._view.slipTurn(this._model.actionBattler(),slipValue);
            }
            //battler.onTurnEnd();
            this.refreshStatus();
            this.endTurnAction();
        }
    }

    refreshStatus(){
        this._model.sortActionBattlers();
        this._model.refreshOrder();
        this._view.refreshStatus();
        const actorsList = this._model.tpMaxActors();
        this._view.changeTpEffect(actorsList[0]);
        actorsList[1].forEach(actor => {
            this._view.displayTpMaxActor(actor);
            this._view.startAnimationNoCheck(actor,40,false, 0,1, false,false);
            // ???????????????
            //SoundManager.playBattleVoice(actor.actorId(),BattleVoiceType.LimitBreak);
        });
    }

    /*
    commandAction(isActor){
        const battler = this._view._skillWindow.actor();
        const action = battler.action(0);
    
        if (isActor){
            action.setTarget(this._view._actorWindow.index());
        } else {
            const enemy = this._view._enemyWindow.enemy();
            const enemyIndex = this._view._enemyWindow.enemyIndex();
            action.setTarget(enemyIndex);
            battler.setLastTarget(enemy);
        }
    
        this._model.makeResult();
        this.startTurn();
    }
    */

    startTurn(){
        this._view.startTurn();
        this.startAction();
    }

    async processVictory(){
        // ?????????????????????
        this._view.changeFaceTypeAll(FaceType.Victory);

        if (this._model.performCollapseEnd()){
        }
    }

    setWait(num){
        return new Promise(resolve => {
            const delayTime = num
            setTimeout(() => {
              return resolve()
            }, delayTime)
          })
    }


    commandMenu(){
        SceneManager.snapForBackground();
        this._model.setBattleCalledMenu(true);
        SceneManager.push(Menu_View);
    }



    commandLimitBreak(){
        const slotSkill = this._view._skillWindow.item();
        const skill = $dataSkills[slotSkill.skillId];

        const limitBreakSkill = $dataSkills[slotSkill.skillId + 1000];
        const index = this._view._skillWindow.index();

        let battler = this._view._skillWindow.actor();
        const lv = battler.skillLevel(slotSkill.skillId);
        const max = skill.maxLevel;

        const baseSkill = skill.id > 1000 ? $dataSkills[slotSkill.skillId - 1000] : null;
        //if (battler.isTpMax() && lv >= max && limitBreakSkill){
        if (battler.isTpMax() && limitBreakSkill && limitBreakSkill.name != ""){
            this._model.changeSlotSkill(index,limitBreakSkill.id);
            const resources = ResourceLoadManager.getSkillResource(limitBreakSkill.id);
            resources.animation.forEach(name => {
                ImageManager.loadAnimation(name);
            });
        
            resources.sound.forEach(name => {
                AudioManager.loadSe(name);
            });
            this._view.refreshStatus();
            battler.setLastBattleSkillId(limitBreakSkill.id);
            const skills = this._model.selectbattlerSkills(battler);
            this._view.commandLimitBreak(skills,battler);
        } else
        if (baseSkill){
            this._model.changeSlotSkill(index,baseSkill.id);
            this._view.refreshStatus();
            battler.setLastBattleSkillId(baseSkill.id);
            const skills = this._model.selectbattlerSkills(battler);
            this._view.commandLimitBreak(skills,battler);
        } else{
            this._view.commandLimitBreak();
        }
    }

    commandAnalyze(index,battler){
        if (index == 'next'){
            index = this._model.findIndexBattler(this._view._statusWindow._actor);
            index += 1;
        }
        if (index == 'previous'){
            index = this._model.findIndexBattler(this._view._statusWindow._actor);
            index -= 1;
        }
        if (index == 'battler'){
            index = this._model.findIndexBattler(battler);
        }
        battler = this._model.analyseBattler(index);
        var actions = this._model.analyseBattlerActions(index);
        this._view.showAnalyze(battler,actions);
    }

    commandFeature(sprite){
        if (this._updateFrameCount != Graphics.frameCount){
            this._updateFrameCount = Graphics.frameCount;
            this._checker = [];
        }
        this._checker.push(sprite);
        if (_.every(this._checker,(sprite) => sprite == null)){
            this._view.clearFeature();
            return;
        }
        if (EventManager.busy()){
            return;
        }
        const dragSprite = _.find(this._checker,(sprite) => sprite != null);
        const feature = this._model.battlerFeature(dragSprite._battler);
        const x = dragSprite.x;
        const y = dragSprite.y - 12;
        this._view.commandFeature(feature,x,y);
    }


    loadAutoSave(){
        const result = this._model.loadAutoSaveFile();
        if (result){
            this.loadSuccess();
        }
    }
    
    loadSuccess(){
        // ???????????????????????????
        this._model.setSelectLastIndex(100);
        Graphics.frameCount = $gameSystem._framesOnSave;
        this.commandContinue();
    }
}

const BattleStep = {
    NONE : 0,
    READY : 1,
    START : 2,
    APGAIN : 4,
    ACTION : 6,
    //DAMAGE : 7,
    ENDTURN : 8,
    WAITNEXTTURN : 9,
    BATTLEEND : 40,
    EVENT : 60,
    SELECTING : 80,
    WAIT : 99
};

const ActionType = {
    DAMAGE : 1,
    CHARGE : 2,
    AFTERHEAL : 3,
    POISON : 4
 }