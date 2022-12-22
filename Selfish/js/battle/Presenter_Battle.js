class Presenter_Battle extends Presenter_Base{
    constructor(view) {
        super();
        this._view = view;
        this._model = new Model_Battle();
    
        this.setEvent();
        this.setGuradEvent();
        this.setAnimationSkipEvent();
        this.setKeyMapEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    setGuradEvent(){
        this._view.setGuradEvent(this.updateGuardState.bind(this));
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

    changeStep(step){
        this._step = step;     
    }

    update(){
        this.updateWaitNextTurn();
        this.updateBattleEnd();
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
            return this.commandAction();
            /*
            case BattleCommand.MENU:
            return this.commandMenu();
            case BattleCommand.ACTION:
            return this.commandAction(this._view._command.isActor);
            case BattleCommand.SkillOk:
            return this.commandSkillOk();
            case BattleCommand.SKILLCANCEL:
            return this.commandSkillCancel();
            case BattleCommand.SKILLCHANGE:
            return this.commandSkillChange();
            case BattleCommand.LIMITBREAK:
            return this.commandLimitBreak();
            case BattleCommand.SKILLCHANGEOK:
            return this.commandSkillChangeOk();
            case BattleCommand.Ready:
            return this.commandReady();
            case BattleCommand.ANALYZE:
            return this.commandAnalyze(this._view._command.index,this._view._command.battler);
            case BattleCommand.PreReady:
            return this.commandPreReady();
            case BattleCommand.OtherSkill:
            return this.commandOtherSkill();
            */
        }
        this._view.clearCommand();
    }

    updateGuardState(isGuarding){
    }

    commandStart(){
        this._model.initBattle();
        //AudioManager.playBgm($gameSystem.battleBgm(),null,0.7);
        this._view.setBackGround(this._model.backGround1(),this._model.backGround2());
        
        this._view.createObjectAfter();
        this._view.setEnemy(this._model.enemyData());
        this._view.setActor(this._model.actorData());
        
        //this._view.displayStartMessages($gameTroop.enemiesNames(),false);

        this._view.commandStart();
    }

    commandFight(){
        //戦闘前のパーティ状態を保存
        //if (DataManager.autoSaveGame(false)) {
        //    DataManager.autoSaveSuccess();
        //}
        //this._model.setBeforeMembers();

        //this.changeStep(BattleStep.APGAIN);
        this._view.commandFight();
    }


    commandCheckActive(){
        const _actionBattler = this._model.updateApGain();
        this._view.commandCheckActive(_actionBattler);
    }

    commandActive(){
        const _actionBattler = this._model.actionBattler();
        let battleSkill = this._model.battleSkill(_actionBattler);
        this._view.commandActive(_actionBattler,_actionBattler.isActor(),battleSkill);
    }

    commandSelectSkill(){
        const _selectSkill = this._view.selectSkill();
        const action = this._model.selectSkill(_selectSkill.id);
        const _actionTargetData = this._model.actionTargetData(action);
        const _targetId = this._model.actionBattler().lastTargetIndex();
        const _skillTargetList = this._model.skillTargetList();
        this._view.commandSelectSkill(_skillTargetList,_targetId,_actionTargetData);
    }

    commandAction(){
        const _targetId = this._view.selectEnemyIndex();
        this._model.makeResult(_targetId);
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
        if ($gameTemp._needDisPlayEffectChange){
            BackGroundManager.setWeather($gameScreen.backGroundWeather());
            EventManager.setWeather($gameScreen.eventWeather());
            $gameTemp._needDisPlayEffectChange = false;
        }

    }

    updateAnimationSkip(isAnimationSkip){
        if (this._step != BattleStep.ACTION){
            return;
        }
        switch (this._actionType){
            case ActionType.DAMAGE:
                if (isAnimationSkip){
                    this._view.clearAnimation();
                    this.startDamage();
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
                    this.changeStep(BattleStep.WAIT);
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
                    this.changeStep(BattleStep.WAIT);
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
        if (this._step != BattleStep.WAITNEXTTURN){
            return;
        }
        if (this._view._featureWindow._openness > 0){
            return;
        }
        if (!this._view.isGuarding()){
            this._model.eraseGuardState();
        }
        if (this._waitCount >= 0){
            this._waitCount += 1;
        }
        if ($dataOption.getUserData("battleTurnCheck") === true && this._waitCount > 60){
            TouchInput.clear();
    
            this._view.resetApMode();
            this._view.clearRecord();
            this._view.substituteMoveReset();
            this.changeStep(BattleStep.APGAIN);
            return;
        }
        if (this._waitCount > 60 && this._waitCount > 0){
            this._view.displayWaitNextTurn();
            this._waitCount = -1;
            this._view.substituteMoveReset();
        }
        if (this._waitCount == -1){
            if (Input.isTriggered('pageup') || Input.isTriggered('pagedown')){
                if (!this._view._statusWindow.active){
                    this._view.clearRecord();
                    this._view.clearLog();
                    this.commandAnalyze("next");
                    return;
                }
            }
        }
        if (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isReleased()){
            if (this._view._statusWindow.active){
                return;
            }
            TouchInput.clear();
    
            //TipsManager.close();
            //押しっぱなし回避
            if ($gameDefine.mobileMode){
                await this.setWait(50);
            }
            this._view.resetApMode();
            this._view.clearRecord();
            this._view.substituteMoveReset();
            this.changeStep(BattleStep.APGAIN);
            // アクターの顔を戻す
            $gameParty.members().forEach(actor => {
                if (actor.isDying() || actor.isDead() || actor.stateMotionIndex() > 0){
                    this._view.changeFaceType(actor,FaceType.Damage);
                } else{
                    this._view.changeFaceType(actor,FaceType.Normal);
                }
            });
        }
    }

    updateBattleEnd(){
        if (this._step != BattleStep.BATTLEEND){
            return;
        }
        if (EventManager.busy()){
            return;
        }
        if (this._view._featureWindow._openness > 0){
            return;
        }
        if (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered()){
            this._view.clearLog();
            $gameParty.resetBattleParameter();
            var troopId = $gameTroop.troopId();
            $gameTroop.clear();

            SceneManager.push(Stage_Scene);
        }
    }

    afterHealAction(){
        if (this._model.needAfterHeal()){
            this._view.clearAnimation();
            var attackAfterHealData = this._model.attackAfterHeal();
            this._view.attackAfterHeal(attackAfterHealData);
            this.refreshStatus();            
            this.setActionType(ActionType.AFTERHEAL);
            this._model.clearDrainState();
            this.changeStep(BattleStep.ACTION);
            return;
        }
        this.slipTurnAction();
    }

    slipTurnAction(){
        if (this._model.needSlipTurn()){
            this._view.clearAnimation();
            var slipValue = this._model.slipTurn();
            this._view.slipTurn(this._model.actionBattler(),slipValue);
            this.refreshStatus();
            this.setActionType(ActionType.POISON);
            this.changeStep(BattleStep.ACTION);
            return;
        }
        this.changeStep(BattleStep.WAIT);
        this.endTurnAction();
    }

    async endTurnAction(){
        var actionBattler = this._model.getActingBattler();
        var action = actionBattler.currentAction();
        var repeats = $dataSkills[action.item().id].repeats;
        await this.setWait(repeats * 100);
        if (action && !action.counter() && !action.countered() && !action.madness()){
            // 行動者のターンオート解除ポップアップ
            this._view.startTurnStatePopup(this._model.turnStateData());
        }
        // ターン終了後ポップアップ
        const turnEnd = this._model.turnEnd();
        if (turnEnd != null){
            this._view.statePopup(turnEnd);
            if (actionBattler.isDead()){
                let type = this._model.performCollapseType(actionBattler);
                this._view.performCollapse(actionBattler,type);
            }
        }
        // 複数回攻撃判定
        this._model.createAttackTimesAddActionData();
            
        const endTurnPopup = this._model.endTurn();
        this._view.statePopup(endTurnPopup);

        // 召喚判定
        if (this._model.isSummon()){
            const enemy = this._model.summonEnemy();
            this._view.addTroops([enemy]);
            const summonPopup = this._model.summonPopup(enemy);
            this._view.statePopup(summonPopup);
        }

        this._model.actionClear();

        this.refreshStatus();
        this._view.clearLog();

        //this._view.clearAnimation();

        if (this._model.checkDefeat()){
            this._model.processDefeat();
            const stageevent = $gameParty.stageEvent();
            if (stageevent && stageevent._type == "mapBattle"){            
                this._view.processChallengeDefeat(() => { 
                    this._model.processChallengeDefeat();
                    SceneManager.push(RushBattle_View);
                });
            } else{
                this._view.processDefeat(this.loadAutoSave.bind(this));
            }
            // 敗北ボイス
            const voiceData = this._model.defeatVoice();
            if (voiceData){
                SoundManager.playBattleVoice(voiceData.actorId,voiceData.type);
            }
            return;
        } else
        if (this._model.checkVictory()){
            $gameParty.onBattleEnd();
            var loseType = this._model.stageData().loseType;
            const type = this._model.performCollapseType(this._model.lastDeathEnemy());
            if (type == 1){
                this._view.performCollapse(this._model.lastDeathEnemy(),type);
                this.changeStep(BattleStep.WAIT);

                // クリアリザルトデータ作成
                this._model.createResultData();

                this._view.startBossCollapseAnimation(this._model.lastDeathEnemy(),() => {  
                    AudioManager.fadeOutBgm(1);
                    this._model.processVictory();
                    this.processVictory();
                    $gameParty.resetBattleParameter();
                    this._view.clearLog();
                    //EventManager.endStage();
                });
                return;
            } else
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
            } else
            if (loseType == GameStageLoseType.TROOPMEMBERLOST){
                this.victoryAction();
                return;
            }
        }

        // 行動後覚醒
        this._model.createAfterActionData();

        // 怒り行動
        if (!this._model.isActingBattler()){
            this._model.createMadnessActionData();
        }

        if (this._model.isActingBattler()){
            this.startAction();
        } else{
            $gameSwitches.setValue($gameDefine.chainSeaquenceSwitchId,true);
            // チェイン
            const checkChainBattler = this._model.checkChainBattler();
            if (checkChainBattler){
                //TipsManager.setTips();
                SoundManager.playChain();
                this._model.setChainBattler();
                this._view.startChainAnimation(this._model.actionBattler());
                this.setActionBattler();
                this._view.displayChainBattler(this._model.actionBattler());
                this._waitCount = 0;
                const tips = $gameTips.getTipsDataByKey("chain");
                TipsManager.setTips(tips);
                await this.setWait(750);
                return;
            }
            // 合計ターン数加算
            this._model.gainTurnCount();
            this._waitCount = 0;
            TipsManager.setTips();
            this._model.clearActionBattler();
            this.changeStep(BattleStep.WAITNEXTTURN);

            // 瀕死ボイス
            const voiceData = this._model.dyingVoice();
            if (voiceData){
                SoundManager.playBattleVoice(voiceData.actorId,voiceData.type);
            }
        }
    }

    async victoryAction(){

        // ラッシュバトルでレコードを更新
        const isNewRecordData = this._model.createResultDataRushBattle();
        if (isNewRecordData != null && isNewRecordData.isNew == true){
            await this._view.newRecord(isNewRecordData);
        }

        this._model.processVictory();
        // 勝利演出
        await this._view.processVictory();
        this.refreshStatus();
        this.processVictory();
    }


    setActionBattler(){
        let battler = this._model.actionBattler();
        this._view.setActionBattler();
        
        const mpGainBattler = this._model.checkMpGainBattler();
        if (mpGainBattler == true){
            if (battler.isActor()){
                this._view.startMpAnimation(battler,battler.mp+1);
            }
            this._model.gainNeedMp(battler);
            this._view.setDamagePopup(battler,'mpHeal',1,0,false);
            // パッシブ更新
            const popup = this._model.refreshPassive([battler]);
            this._view.statePopup(popup);
            this._view.clearRecord();
        } else{
            this.refreshStatus();
        }
        
        if (this._model.canInput()){
            this._model.makeActions();
            if (battler.isActor()){
                const slotskills = this._model.selectbattlerSkills(battler);
                const otherSkills = this._model.otherSkills(battler);
                this._view.displaySelecting(battler,slotskills,otherSkills);
                this.changeStep(BattleStep.WAIT);
            } else{
                if (this._model.needChargeAnimation()){
                    this._view.startAnimation(battler,1663,false, 0,1, false,false);
                    this.setActionType(ActionType.CHARGE);
                    this.changeStep(BattleStep.ACTION);
                } else{
                    this._model.makeResult();
                    this.startTurn();
                    this.changeStep(BattleStep.WAIT);
                }
            }
        } else{
            // 何もしない
            this._model.createWaitActionData();
            this._view.clearStatePopup();
            this._view.clearDamagePopup();
            battler.resetApParam();
            this._view.startTurn();
            if (this._model.needSlipTurn()){
                //毒ダメージ
                var slipValue = this._model.slipTurn();
                this._view.slipTurn(this._model.actionBattler(),slipValue);
            }
            //battler.onTurnEnd();
            this.refreshStatus();
            this.changeStep(BattleStep.WAIT);
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
            this._view.startAnimation(actor,1315,false, 0,1, false,false);
            // 覚醒ボイス
            SoundManager.playBattleVoice(actor.actorId(),BattleVoiceType.LimitBreak);
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

    async startAction(){
        var actionBattler = this._model.getActingBattler();
        var action = actionBattler.currentAction();
        if (!actionBattler.isAlive() || (!actionBattler.canMove() && !action.madness())){
            let isCountered = action.counter();
            action.clear();
            action.setSkill($gameDefine.noActionSkillId);
            action.setTarget(actionBattler.index());
            action.makeActionResult();
            if (isCountered) action.setCountered();
        }
        if (action && action.awaking == true){
            this._view.startAwakeAnimation(action.item().id,actionBattler);
            this._view.displayAwakeSkillName(actionBattler);
            await this.setWait(1200);
            await this._model.checkAwakeHelp();
        }
        /*
        if (action && actionBattler.isActor() && $dataSkills[action.item().id].tpCost > 0){
            this._view.startCutinAnimation(actionBattler);
            await this.setWait(2400);
        }
        */
        if (action && action.counter() == true){
            SoundManager.playCounter();
            this._view.startCounterAnimation(actionBattler);
            await this.setWait(750);
        }
        if (this._model.needMadnessAnimation(actionBattler)){
            this._view.startAnimation(actionBattler,1328,false, 0,1, false,false);
            await this.setWait(1200);
        }
        this._model.startAction();
        
        var animationId = actionBattler.currentAction().item().animationId;
        if (animationId < 0 && !actionBattler.isActor()){
            animationId = actionBattler.attackId();
        }
        if (action.item().id != $gameDefine.noActionSkillId){
            if (action && action.awaking == true){
    
            } else{
                this._model.removeNewSkillId(action.item().id);
            }
            this._view.displaySkillName(actionBattler);
            await this.setWait(200);
        }
    
        if (!actionBattler.isActor() && action.isPhysical()){
            this._view.performActionStart(actionBattler);
        }
    
        var results = actionBattler.currentAction().results();
        if (this._model.checkVictoryBefore()){
            // ボス撃破ボイス
            SoundManager.playBattleVoice($gameParty.battleMembers()[0].actorId(),BattleVoiceType.DefeatBoss);
            await this._view.startLastAttack($gameParty.battleMembers());
        }
        var animResults = _.uniq(results,(r) => r.target);
        var noSoundFlag = false;
        var lastSkillLv = actionBattler.skillLevel(actionBattler.currentAction().item().id);
        animResults.forEach(result => {
            var substituted = result.substitutedTarget;
            if (substituted && result.target != substituted){
                this._view.substituteMove(result.target,substituted);
            }
            // フラグでアニメーションを変更
            const skillData = $dataSkills[action.item().id];
            if (skillData.effect > 0){
                this._view.startAnimationEffect(result.target,skillData.effect, false, 0,1, noSoundFlag);
            } else {
                if (skillData.animation > 0){
                    animationId = skillData.animation;
                }
                if (animationId != 0){
                    this._view.startAnimation(result.target,animationId, false, 0,1, noSoundFlag);
                }
            }
            if (actionBattler.isActor() && this._view._skillWindow.index() < 4 && !action.awaking){
                actionBattler.gainSkillCountBySlotIndex(this._view._skillWindow.index(),1);
            }
            // 覚醒スキルの装備を元に戻す
            if (skillData.id > 1000){
                this._model.changeBaseSkills(skillData.id - 1000);
            }
            noSoundFlag = true;
        });
        var skillLv = actionBattler.skillLevel(actionBattler.currentAction().item().id);
        if (skillLv > lastSkillLv){
            SoundManager.playLevelUp();
            this._view.startStatePopup(actionBattler,PopupTextType.UpText,TextManager.getText(600100));
            this._view.displaySkillLevelUp(actionBattler);
        }
        // 味方顔チェンジ
        if (actionBattler.isActor()){
            this._view.changeFaceType(actionBattler,FaceType.Attack);
        }
        this.setActionType(ActionType.DAMAGE);
        this.changeStep(BattleStep.ACTION);

        if (actionBattler.isActor()){
            if (!this._model.checkVictoryBefore()){
                // 魔法ボイス
                // 何もしないなどの時はボイス無し
                if (actionBattler.currentAction().item().id != $gameDefine.waitSkillId && actionBattler.currentAction().item().id != $gameDefine.noActionSkillId){
                    const voiceData = this._model.magicVoice(actionBattler);
                    if (voiceData){
                        SoundManager.playBattleVoice(voiceData.actorId,voiceData.type);
                    }
                }
            }
        }
    }

    startDamage(){
        const actionBattler = this._model.getActingBattler();
        const action = actionBattler.currentAction();
        if (action == null){
            return;
        }
        this._view.clearStatePopup();
        this._view.clearDamagePopup();
        this.startDamageAnimation();
    }

    async startDamageAnimation(){
        var actionBattler = this._model.getActingBattler();
        var action = actionBattler.currentAction();
        var results = action.results();
        var justGuardTarget = this._model.applyResultsData(action,results);
        if (justGuardTarget.length > 0){
            SoundManager.playJustGuard();
            justGuardTarget.forEach(target => {
                this._view.displayGuardSuccess(target,action);
                this._view.startStatePopup(target,PopupTextType.UpText,TextManager.getText(600200));
            });
        }
    
        this._view.refreshStatus();
        const isAll = this._model.isAllAttack(action,actionBattler);
        let death = [];
        let guradRecord = false;
        const damageRecordInfo = action.damageRecordInfo();
        for (let i = 0;i< results.length;i++){
            var target = results[i].target;
            let battlerId = target.battlerId();
            if (i > 0 && !isAll){
                await this.setWait(100);
            }
            var length = results[i].length - 1;
            if (results[i].weakness){
                //this._view.startStatePopup(target,"weakness","Weakness!");
            }
            if (results[i].isDead){
                Debug.log("この行動で戦闘不能になる");
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
                if (results[i].reDamage){
                    this._view.setDamagePopup(actionBattler,'hpDamage',results[i].reDamage,length,logRecord,logDamage);
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
    
            $gameSystem.checkMaxDamage(results[i].hpDamage);
        }
        death.forEach(target => {
            this._model.setLastDeathEnemyIndex(target.index());
            let type = this._model.performCollapseType(target);
            this._view.performCollapse(target,type);
            this._view.recordCollapse(target);
            // 撃破敵リスト追加
            if (!target.isActor()){
                $gameParty.addEnemyInfoData(target.enemyId());
            }
            // 挑発を解除する
            let provocationPopup = this._model.removeProvocationState(target);
            if (provocationPopup){
                this._view.statePopup(provocationPopup);
            }
        });

        // ダメージボイス
        const voiceDataList = this._model.damageVoice(results);
        voiceDataList.forEach(voiceData => {
            SoundManager.playBattleVoice(voiceData.actorId,voiceData.type); 
        });
    }

    async processVictory(){
        // 味方を勝利顔に
        this._view.changeFaceTypeAll(FaceType.Victory);
        $gameParty.battleMembers().forEach(actor => {
            //基本値
            var add = 0;
            var level = actor.level;
            // アドベンチャーモード
            if ($dataOption.getUserData("battleSkipMode") !== BattleSkipMode.Skip){
                $gameTroop.deadMembers().forEach(enemy => {
                    var value = 20;
                    if (enemy.enemyId() > 100){
                        return;
                    }
                    value += (enemy.level() - level) * 2;
                    if (value <= 0){
                        value = 1;
                    }
                    add = Math.floor(value * actor.finalExpRate());
                });
            }
            actor.gainExp(add);
            SkillAwakeManager.levelUpLearnSkill(actor);
            Debug.log(actor.name() + "加算値=" + add);
                
            var afterLevel = actor.level;
            if (afterLevel > level){
                this._view.statePopup([new PopupTextData(actor,PopupTextType.Text,TextManager.getText(600300))]);
            }
            this._view.statePopup([new PopupTextData(actor,PopupTextType.UpText,TextManager.getText(400) + " +" + add.toString())]);
        });

    
        const members = this._model.getChangeMembers();
        if (members.length > 0){
            SoundManager.playLevelUp();
            $gameParty.resetBattleParameter();
            
            await this.setWait(1500);
            PopupLevelUpManager.setPopup(() => {
                if (this._model.performCollapseEnd()){
                    EventManager.endStage();
                } else{
                    this.changeStep(BattleStep.BATTLEEND);
                }
            });
            //PopupLevelUpManager.open();
            this._view.clearLog();
        } else{
            if (this._model.performCollapseEnd()){
                EventManager.endStage();
            } else{
                this.changeStep(BattleStep.BATTLEEND);
            }
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
        SceneManager.push(Menu_Scene);
    }

    commandSkillOk(){
        let battler = this._view._skillWindow.actor();
        const item = this._view._skillWindow.item();
        const skill = battler.getSkillData(item.skillId,battler.skillLevel(item.skillId));
        let action = battler.action(0);
        action.setSkill(skill.id);
        battler.setLastBattleSkillId(item.skillId);
        const isForOpponent = action.isForOpponent();
        const nextAp = this._model.nextAp();
    
        this._view.onSelectAction(battler,action,isForOpponent,nextAp);
    }

    commandSkillCancel(){
        this._model.onSkillCancel();
        this.changeStep(BattleStep.APGAIN);
    }

    commandSkillChange(){
        const selectSkill = this._view._skillWindow.item();
        if (selectSkill < 10){
            selectSkill = null;
        }
        const selectIndex = this._view._skillWindow.index();
        if (selectIndex > 4){
            this._view._skillWindow.activate();
            return;
        }
        const actor = this._model.actionBattler();
        
        const item = this._view._skillWindow.item();
        actor.setLastBattleSkillId(item.skillId);
        let skills = this._model.selectActorSkillItems(selectIndex);
        skills = _.without(skills,selectSkill);
        
        this._view.showSkillItemOpen(actor,skills,selectSkill);
    }

    commandSkillChangeOk(){
        /*
        const skill = this._view._skillWindow.item();
        const item = this._view._itemWindow.item();
        const index = this._view._skillWindow.index();
    
        this._model.removeNewSkillId(item);
        if (skill != item){
            this._model.changeSlotSkill(index,item.skillId);
            const resources = ResourceLoadManager.getSkillResource(item.skillId);
            resources.animation.forEach(name => {
                ImageManager.loadAnimation(name);
            });
        
            resources.sound.forEach(name => {
                AudioManager.loadSe(name);
            });
        }
        this._view.refreshStatus();
    
        this._view.reShowSkillList();
        */
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

    commandOtherSkill(){
        let battler = this._model.actionBattler();
        const item = this._view._otherSkillWindow.item();
        const skill = battler.getSkillData(item.skillId,battler.skillLevel(item.skillId));
        let action = battler.action(0);
        action.setSkill(skill.id);
        battler.setLastBattleSkillId(item.skillId);
        const isForOpponent = action.isForOpponent();
        const nextAp = this._model.nextAp();
    
        this._view.onSelectAction(battler,action,isForOpponent,nextAp);
    }

    loadAutoSave(){
        const result = this._model.loadAutoSaveFile();
        if (result){
            this.loadSuccess();
        }
    }
    
    loadSuccess(){
        // 最終アクセスを更新
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