//-----------------------------------------------------------------------------
// Model_Battle
//
class Model_Battle extends Model_Base {
    constructor(){
        super();
        this.initMembers();
    }

    initMembers(){
        this._battleTest = false;
        this._actionForcedBattler = null;
        this._battleMembers = [];
        this._actionBattler = null;

        this._actingBattlers = [];

        this._logWindow = null;
        this._turnForced = false;

        this._totalTurnCount = 1;

        this._lastDeadEnemyId = 0;

        this._eventBattleData = null;

        this._tempDyingData = [false,false,false];

        this._summonedIndex = 1000;
    }

    setup(troopId, troop){
        if (troop === undefined){
            troop = null;
        }
        this.initMembers();
        if (troop != null){
            $gameTroop = troop;
        } else{
            $gameTroop.setup(troopId,$gameVariables.value(1));
        }
        this._calledStartFlag = false;
        if (this.isLastBattle()){
            let actor = $gameActors.actor(5);
            actor.learnSkill(252);
            actor.learnSkill(253);
            $gameTroop.members()[0]._ap = actor._ap + 4;
            actor.changeSlotSkill(0,251);
            actor.changeSlotSkill(1,251);
            actor.changeSlotSkill(2,251);
            actor.changeSlotSkill(3,251);
            actor.changeSlotSkill(4,251);
        }
    }
/*
    resume(){
        this.initMembers();
    }
    */


    setBattleCalledMenu(flag){
        $gameSystem.setBattleCalledMenu(flag);
    }

    isBattleTest(){
        return this._battleTest;
    }

    setBattleTest(battleTest){
        this._battleTest = battleTest;
    }

    actionBattler(){
        return this._actionBattler ? this._actionBattler : null;
    }

    updateApGain(isPressed){
        this._battleMembers.forEach(battler => {
            battler.gainDefineAp(isPressed);
        });
        let actionBattler = _.find(this._battleMembers,(battler) => battler._ap <= 0);
        if (actionBattler != null){
            this._actionBattler = actionBattler;
        }
        this.sortActionBattlers();
        this.refreshOrder();
    }

    refreshOrder(){
        this._battleMembers.forEach((battler,index) => {
            battler.setBattleOrder(index+1);
        });
    }

    checkMpGainBattler(){
        const actionBattler = this.actionBattler();
        if (!actionBattler.isRestricted() && !actionBattler.isStateAffected($gameStateInfo.getStateId(StateType.CURSE))){
            if (actionBattler.mp != actionBattler.mmp){
                if (actionBattler.isActor()){
                    return actionBattler.needMpGain();
                } else{
                    return true;
                }
            }
        }
        return false;
    }

    gainNeedMp(){
        this.actionBattler().gainMp(1);
    }

    canInput(){
        return this._actionBattler.canInput();
    }

    makeActions(){
        this._actionBattler.makeActions();
    }

    needChargeAnimation(){
        return this._actionBattler.currentAction() && this._actionBattler.currentAction().item().mpCost > 0;
    }

    needMadnessAnimation(actionBattler){
        return !actionBattler.isActor() && actionBattler.currentAction() && actionBattler.currentAction()._madness == true && actionBattler.enemyId() > $gameDefine.bossEnemyId;
    }

    actionBattlers(){
        return this._battleMembers;
    }
    onBattleStart(){
        $gameParty.onBattleStart();
        $gameTroop.onBattleStart();
    }
    startBattle(){
        $gameSystem.onBattleStart();

        this.createActionBattlers();
        this.sortActionBattlers();
    }
    restartBattle(){
        this._battleMembers = [];
        this._actionBattler = null;
        this._actingBattlers = [];
        $gameSystem.onBattleStart();

        $gameTroop.aliveMembers().forEach(enemy => {
            this._battleMembers.push(enemy);
            enemy.refreshPassive();
            //初期MP
            //enemy.setMp(enemy.initMp());
            enemy.stratDashApParam();
        });
        $gameParty.aliveMembers().forEach(actor => {
            this._battleMembers.push(actor);
            actor.refreshPassive();
            actor.resetApParam();
            actor.stratDashApParam();
            //初期MP
            //actor.setMp(actor.initMp());
        });
        this.sortActionBattlers();
    }
    setActionBattler(battler){
        this._actionBattler = battler;
    }
    createActionBattlers(){
        if (this._battleMembers.length != 0){
            return;
        }
        $gameTroop.aliveMembers().forEach(enemy => {
            this._battleMembers.push(enemy);
            enemy.refreshPassive();
            //初期MP
            enemy.setMp(enemy.initMp());
            enemy.stratDashApParam();

            // アドベンチャーモード
            if ($dataOption.getUserData("battleSkipMode") === BattleSkipMode.Skip){
                enemy.setHp(Math.max(1, Math.floor( enemy.mhp / 100 )));
            }
        });
        $gameParty.aliveMembers().forEach(actor => {
            this._battleMembers.push(actor);
            actor.refreshPassive();
            actor.resetApParam();
            actor.stratDashApParam();
            //初期MP
            actor.setMp(actor.initMp());
        });
    }
    sortActionBattlers(){
        this._battleMembers = _.sortBy(this._battleMembers,(battler) => battler._ap);
    }
    setActingBattler(battler,flag){
        if (flag){
            this._actingBattlers.unshift(battler);
            return;
        }
        this._actingBattlers.push(battler);
    }
    getActingBattler(){
        return this._actingBattlers[0];
    }
    isActingBattler(){
        return this._actingBattlers.length > 0;
    }
    makeResult(){
        $gameTroop.increaseTurn();
        //結果を先に判定
        if (this.actionBattler().canMove()){
            let action = this.actionBattler().currentAction();
            if (action._item._itemId == $gameDefine.waitSkillId){
                this.actionBattler()._ap = this.waitSkillChangeAp(this.actionBattler());
            } else{
                this.actionBattler().resetApParam();
            }
        }
    
        // 行動者のリザルトを作成
        this.createActionData();
        // 割り込みのリザルトを作成
        this.createInterruptActionData();
    
        // カウンター生成
        this.createCounterActionData();
    
        // 行動後リザルト生成
        //this.createAfterActionData();
    
    
        // 複数回カウント設定
        this._attackTimesAdd = this.actionBattler().attackTimesAdd();
    }
    createActionData(){
        let action = this.actionBattler().currentAction();
        action.prepare();
        // Awakeポイント(派生) SkillAwakeManager._beforeActing
        const awake = SkillAwakeManager.checkSkillAwake(this.actionBattler(),1,action);
        if (awake && awake.length > 0){
            action._itemId = awake[0].skillId;
            action._item._itemId = awake[0].skillId;
            action.awaking = true;
        }
        action.makeActionResult();
        //行動者を追加
        this.setActingBattler(this.actionBattler(),false);
    }
    createAttackTimesAddActionData(){
        if (this._attackTimesAdd <= 0){
            return;
        }
        this._attackTimesAdd -= 1;
        this.actionBattler().makeActions();
        let action = this.actionBattler().currentAction();
        action.makeActionResult();
        //行動者を追加
        this.setActingBattler(this.actionBattler(),false);
    }
    createWaitActionData(){
        this.actionBattler().makeActions();
        let action = this.actionBattler().currentAction();
        action.setSkill($gameDefine.noActionSkillId);
        action.setTarget(this.actionBattler().index());
        action.makeActionResult();
        this.setActingBattler(this.actionBattler(),true);
    }
    createInterruptActionData(){
        // Awakeポイント(割り込み) SkillAwakeManager._interruptActing
        let awake = [];
        let battleactor = null;
        let actionBattler = this.actionBattler();
        let action = this.actionBattler().currentAction();
        $gameParty.battleMembers().some(actor => {
            awake = SkillAwakeManager.checkSkillAwake(actor,3,action,this.actionBattler());
            if (awake.length > 0){
                battleactor = actor;
                return true;
            }
        });
        $gameParty.battleMembers().some(actor => {
            SkillAwakeManager.checkSkillAwake(actor,5,action,this.actionBattler());
        });
        if (awake.length > 0){
            battleactor.makeActions();
            action = battleactor.currentAction();
            action.setSkill(awake[0].skillId);
            action.setTarget(SkillAwakeManager.checkMatchData(awake[0],battleactor,this.actionBattler().currentAction(),this.actionBattler()).index());
            action.prepare();
            action.makeActionResult();
            action.awaking = true;
            //行動者を先に追加
            this.setActingBattler(battleactor,true);

            //待ち伏せ用 前の行動者の結果を作り直す
            const skill = $dataSkills[ awake[0].skillId ];
            if (_.find(skill.effects, (effect) => effect.code == Game_Action.EFFECT_ADD_STATE && effect.dataId == $gameStateInfo.getStateId(StateType.VANTAGE))){
                actionBattler.currentAction().resetVantageResult(battleactor);
            }
            //暴発用 前の行動者の結果を作り直す
            if (_.find(skill.effects, (effect) => effect.code == Game_Action.EFFECT_ADD_STATE && effect.dataId == $gameStateInfo.getStateId(StateType.DISCHARGE))){
                actionBattler.currentAction().resetDischargeResult();
                const tips = $gameTips.getTipsDataByKey("discharge");
                TipsManager.setTips(tips);
            }
        }
    }
    createCounterActionData(){
        let action = this.actionBattler().currentAction();
        const counterId = $gameStateInfo.getStateId(StateType.COUNTER);
        const refrectId = $gameStateInfo.getStateId(StateType.REFRECT);
        //カウンター生成
        let counterTarget = [];
        if (action){
            action.results().forEach(result => {
                if (action.isDamage() && action.isHpEffect() && result.target.hp > result.hpDamage && result.target.isStateAffected(counterId)){   
                    if (!_.contains(counterTarget,result.target)){
                        if (this.actionBattler() != result.target){
                            result.target.makeActions();
                            let counterAction = result.target.currentAction();
                            counterAction.setSkill(result.target.getStateEffect(counterId));
                            counterAction.setTarget(this.actionBattler().index());
                            counterAction.prepare();
                            counterAction.makeActionResult();
                            counterAction.setCounter();
                            this.setActingBattler(result.target,false);
                            counterTarget.push(result.target);
                        }
                    }
                } else
                if (result.target.isStateAffected(refrectId)){   
                    if (!_.contains(counterTarget,result.target)){
                        if (this.actionBattler() != result.target){
                            result.target.makeActions();
                            let counterAction = result.target.currentAction();
                            counterAction.setSkill(action.item().id);
                            counterAction.setTarget(this.actionBattler().index());
                            counterAction.prepare();
                            counterAction.makeActionResult();
                            counterAction.setCounter();
                            this.setActingBattler(result.target,false);
                            counterTarget.push(result.target);
                        }
                    }
                }
            });
        }
    }
    createAfterActionData(){
        // Awakeポイント SkillAwakeManager._afterActing
        let awake = [];
        let battleactor = null;
        $gameParty.battleMembers().some(actor => {
            awake = SkillAwakeManager.checkSkillAwake(actor,2);
            if (awake.length > 0){
                battleactor = actor;
                return true;
            }
        });
        if (awake.length > 0){
            const afterTarget = SkillAwakeManager.checkMatchData(awake[0]);
            if (afterTarget){
                battleactor.makeActions();
                let action = battleactor.currentAction();
                action.setSkill(awake[0].skillId);
                action.setTarget(SkillAwakeManager.checkMatchData(awake[0]).index());
                action.prepare();
                action.makeActionResult();
                action.awaking = true;
                //行動者を追加
                this.setActingBattler(battleactor,false);
            }
        }
    }
    createMadnessActionData(){
        $gameTroop.aliveMembers().forEach(enemy => {
            if (enemy.tp > 0 && enemy.madness() == false){
                enemy._actionList.forEach(action => {
                    let skill = $dataSkills[action.skillId];
                    if (enemy.madness() == false && skill.tpCost > 0 && enemy.tp >= skill.tpCost && enemy.isActionValid(action)){
                        enemy.makeActions();
                        action = enemy.currentAction();
                        action.setSkill(skill.id);
                        action.setTarget(enemy.index());
                        action.prepare();
                        action.makeActionResult();
                        action.setMadness();
                        enemy.setMadness(true);
                        this.setActingBattler(enemy,false);
                    }
                });
            }
        });
    }

    applyResultsData(action,results){
        let justGuardTarget = [];
        results.forEach(result => {
            if (result.guard == false && result.target.isGuard()){
                if (result.hpDamage > 0){
                    result.hpDamage -= result.target.def;
                    const ironwillPlus = $gameParty.ironWillPlus();
                    if (ironwillPlus > 0){
                        result.hpDamage -= ironwillPlus;
                    }
                    if (result.hpDamage <= 0){
                        result.hpDamage = 1;
                    }
                    justGuardTarget.push(result.target);
                }
            }
            action.applyResult(result.target,result);
        });
        if (justGuardTarget.length > 0){
            // レミィが含まれている
            const isCountable = _.find(justGuardTarget,(target) => target.isActor() && target.actorId() == 3);
            if (isCountable) $gameSystem.gainJustGuard();
        }
        return justGuardTarget;
    }

    startAction(){
        let subject = this.getActingBattler();
        let action = subject.currentAction();
        
        subject.useItem(action.item());
        if (subject.isActor()){
            if (action.item().id != $gameDefine.waitSkillId){
                subject.setNeedMpGain(true);
            } else{
                subject.setNeedMpGain(false);
            }
        }
        action.applyGlobal();
    }
    needAfterHeal(){
        let subject = this.getActingBattler();
        let action = subject.currentAction();
        let isDrain = false;
        if (action && action.results()[0] && !action.results()[0].missed){
            if (action.isContainsState($gameStateInfo.getStateId(StateType.DRAIN_HEAL))){
                isDrain = true;
            }
            if (subject.isStateAffected($gameStateInfo.getStateId(StateType.DRAIN_HEALATK))){
                isDrain = true;
            }
            if (subject.isStateAffected($gameStateInfo.getStateId(StateType.REGENE_HP)) && action.counter() == false){
                isDrain = true;
            }
        }
        return isDrain;
    }
    attackAfterHeal(){
        let subject = this.getActingBattler();
        let action = subject.currentAction();
        let data = [];
        let unit = null;
        if (subject.isActor()){
            unit = $gameParty.aliveMembers();
        } else{
            unit = $gameTroop.aliveMembers();
        }
    
        let plusValue = 0;
        if (subject.isStateAffected($gameStateInfo.getStateId(StateType.DRAIN_HEALATK))){
            plusValue += Math.round(action.resultHpDamageValue() * subject.getStateEffect($gameStateInfo.getStateId(StateType.DRAIN_HEALATK)));
        }
        if (subject.isStateAffected($gameStateInfo.getStateId(StateType.REGENE_HP))){
            plusValue += Math.round(subject.getStateEffect($gameStateInfo.getStateId(StateType.REGENE_HP)));
        }
    
        unit.forEach(element => {
            var value = 0;
            if (action.resultHpDamageValue() > 0 && action.isContainsState($gameStateInfo.getStateId(StateType.DRAIN_HEAL))){
                if (subject.isActor()){
                    let effectValue = $dataSkills[action.item().id].stateEffect;//subject.getStateEffect($gameStateInfo.getStateId(StateType.DRAIN_HEAL));
                    if (effectValue){
                        value = 0.08 + effectValue * 0.01;
                    } else{
                        value = 0.08 + subject.skillLevel(action.item().id) * 0.02;
                    }
                } else {
                    value = 0.08 + subject.mdf * 0.02;
                }
                value *= $dataSkills[action.item().id].mpCost;
                value = Math.round(value * element.mhp) * element.rec;
            }
            if (element == subject){
                value += plusValue;
            }
            if (value > 0){
                element.setHp(element.hp + value);
                data.push({battler:element,value:value});
            }
        });
        return data;
    }
    clearDrainState(){
        const drainHealId = $gameStateInfo.getStateId(StateType.DRAIN_HEAL);
        const drainAttakHealId = $gameStateInfo.getStateId(StateType.DRAIN_HEALATK);
        this._battleMembers.forEach(battler => {
            battler.removeState(drainHealId);
            battler.removeState(drainAttakHealId);
        });
    }
    needSlipTurn(){
        // 毒が解除される予定ならスリップしない
        let flag = true;
        let action = this.actionBattler().currentAction();
        let results = action.results();
        results.forEach(result => {
            var removeStates = result.removedStateObjects();
            if (removeStates){
                removeStates.forEach(state => {
                    if (state.id == $gameStateInfo.getStateId(StateType.POISON)){
                        flag = false;
                    }
                });
            }
        });
        if (flag == false){
            return false;
        }
        return (this.actionBattler() && this.actionBattler().getStateEffectTotal($gameStateInfo.getStateId(StateType.POISON)) > 0);
    }

    slipTurn(){
        let value = 0;
        value = -1 * this.actionBattler().getStateEffectTotal($gameStateInfo.getStateId(StateType.POISON));
        this.actionBattler().gainHp(value);
        return value;
    }

    turnEnd(){
        let popup = this.getActingBattler().currentAction().popupData(this.getActingBattler());
        this.removeState();
        this.addState(popup);
        this.bindRemoveSelf();
        this.bindRemoveTarget();
        this.removeCharge();
        this.bindState();
        this.selfSkill();
        this.wavySkill();
        return popup;
    }

    removeState(){
        let action = this.getActingBattler().currentAction();
        let results = action.results();
        results.forEach(result => {
            const removeStates = result.removedStateObjects();
            if (removeStates){
                removeStates.forEach(state => {
                    result.target.removeState(state.id);
                });
            }
        });
    }

    addState(popup){
        let action = this.getActingBattler().currentAction();
        let results = action.results();
        let skill = $dataSkills[action.item().id];
        let turns = skill.stateTurns ? skill.stateTurns : 0;
        let stateEffect = skill.stateEffect ? skill.stateEffect : 0;
        if (turns){
            const addTurnEffectId = $gameStateInfo.getStateId(StateType.ADD_TURN_EFFECT);
            turns += this.getActingBattler().getStateEffect(addTurnEffectId);
        }
        const restrictionId = $gameStateInfo.getStateId(StateType.RESTRICTION);
        results.forEach(result => {
            let addStates = result.addedStateObjects();
            if (addStates){
                addStates.forEach(state => {
                    if (result.vantageEffect){
                        stateEffect = result.vantageEffect;
                    }
                    if (result.dischargeEffect){
                        stateEffect = result.dischargeEffect;
                    }
                    if (result.target.isStateAffected(restrictionId)){
                        result.target.removeState(restrictionId);
                        popup.push(new PopupTextData(result.target,PopupTextType.RemoveState,TextManager.getStateName(restrictionId)));
                    } else {
                        result.target.addState(state.id,turns,stateEffect,false,this.getActingBattler().battlerId());
                    }
                });
            }
        });
    }

    waitSkillChangeAp(target){
        let ap = 400;
        this._battleMembers.forEach(battler => {
            if (battler != target){
                if (battler._ap < ap){
                    ap = battler._ap;
                }
            }
        });
        return ap + 1;
    }

    removeCharge(){
        let battler = this.getActingBattler();
        const action = this.getActingBattler().currentAction();
        const results = action.results();
        const chargeId = $gameStateInfo.getStateId(StateType.CHARGE);
        results.forEach(result => {
            if (result.chargeAttack){
                battler.removeState(chargeId);
            }
        })
    }

    bindRemoveSelf(){
        //自身の行動で拘束解除
        let battler = this.getActingBattler();
        let action = battler.currentAction();
        const chainSelfId = $gameStateInfo.getStateId(StateType.CHAIN_SELF);
        const chainPlusId = $gameStateInfo.getStateId(StateType.CHAIN_PLUS);
        const isChainPlus = battler.isStateAffected(chainPlusId);
        if (action && battler.isStateAffected(chainSelfId)){
            battler.removeState(chainSelfId);
            battler._bindBatllers.forEach(target => {
                // 拘束プラス所持者のみ行動値を初期化する
                if (isChainPlus){
                    target.resetApParam();
                }
                target.removeState($gameStateInfo.getStateId(StateType.CHAIN_TARGET));
            });
            battler._bindBatllers = [];
        }
    }

    bindRemoveTarget(){
        let action = this.getActingBattler().currentAction();
        const chainSelfId = $gameStateInfo.getStateId(StateType.CHAIN_SELF);
        //相手の行動で拘束解除
        if (action){
            action.results().forEach(result => {
                if (result.target.isStateAffected(chainSelfId) && result.hpDamage > 0){
                    result.target.removeState(chainSelfId);
                    result.target.resetApParam();
                    result.target._bindBatllers.forEach(target => {
                        target.removeState($gameStateInfo.getStateId(StateType.CHAIN_TARGET));
                        //popup.push({battler:target});
                    });
                    result.target._bindBatllers = [];
                }
            });
        }
    }

    bindState(){
        let battler = this.getActingBattler();
        let action = battler.currentAction();
    
        const chainTargetId = $gameStateInfo.getStateId(StateType.CHAIN_TARGET);
        if (action && action.isContainsState(chainTargetId)){
            const effects = _.every(action.results(),(r) => r.target.isStateResist(chainTargetId))
            
            if (!effects){
                const data = $dataSkills[action.item().id];
                battler.addState($gameStateInfo.getStateId(StateType.CHAIN_SELF), data.stateTurns,data.stateEffect,false,battler.battlerId());
                battler._bindBatllers = [];
                action.results().forEach(result => {
                    battler._bindBatllers.push(result.target);
                });
            }
        }
    }

    selfSkill(){
        let actor = this.getActingBattler();
        let action = this.getActingBattler().currentAction();
        if (action){
            const skill = $dataSkills[action.item().id];
            if (skill.selfSkill){
                this.selfSkillEffect(skill.selfSkill,actor,action);
            }
        }
    }

    wavySkill(){
        let actor = this.getActingBattler();
        let action = this.getActingBattler().currentAction();
        if (action){
            const skill = $dataSkills[action.item().id];
            const waveId = $gameStateInfo.getStateId(StateType.WAVY);
            if (actor.isStateAffected(waveId)){
                let wavyList = actor.getStateDataAll(waveId);
                wavyList.forEach(wavyData => {
                    if (wavyData.effect == skill.id){
                        let wavySkill = $dataSkills[wavyData.slotId];
                        this.selfSkillEffect(wavySkill.selfSkill,actor,action);
                    }
                });
            }
        }
    }

    selfSkillEffect(skillId,actor,action){
        if (skillId == 0) return;
        const selfSkill = $dataSkills[skillId];
        const passive = (selfSkill.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE || selfSkill.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE_SELF);
        
        let targets = [actor];
        if (selfSkill.scope == ScopeType.ALL_PARTY){
            targets = $gameParty.members();
        }
        selfSkill.effects.forEach(effect => {
            targets.forEach(target => {
                if (effect.code == Game_Action.EFFECT_ADD_STATE){
                    target.addState(effect.dataId,selfSkill.stateTurns,selfSkill.stateEffect,passive,actor.battlerId());
                }
                if (effect.code == Game_Action.EFFECT_GROW){
                    //target.addParam(effect.dataId, Math.floor(effect.value1));
                    // ステートに返還して付与
                    let stateId = $gameStateInfo.convertStateIdFromBuffId(effect.dataId);
                    if (stateId > 0){
                        let effectValue = target.getStateEffectTotal(stateId);
                        target.addState(stateId,999,effectValue + Math.floor(effect.value1),false,target.battlerId());
                    }
                }
                if (effect.code == Game_Action.EFFECT_RECOVER_HP){
                    action.itemEffectRecoverHp(target,effect);
                }
            });
        });
        if (selfSkill.selfSkill){
            this.selfSkillEffect(selfSkill.selfSkill,actor,action);
        }
    }

    isSummon(){
        let isSummon = false;
        const action = this.getActingBattler().currentAction();
        const results = action.results();
        const summonId = $gameStateInfo.getStateId(StateType.SUMMON);
        results.forEach(result => {
            let addStates = result.addedStateObjects();
            if (addStates){
                addStates.forEach(state => {   
                    if (state.id == summonId){
                        isSummon = true;
                    }         
                });
            }
        });
        return isSummon;
    }

    summonEnemy(){
        let enemyId = Math.randomInt(20) + 1;
        const summonId = $gameStateInfo.getStateId(StateType.SUMMON);
        const enemyLevel = this.getActingBattler().getStateEffect(summonId);
        const summonTroopNo = $gameDefine.summonTroopId;
        let summonIndexs = [];
        $dataTroops[summonTroopNo].members.forEach((member,index) => {
            if (!_.find($gameTroop.aliveMembers(),(enemy) => enemy.screenX() == member.x && enemy.screenY() == member.y)){
                summonIndexs.push(index);
            }
        });
        const summonNo = summonIndexs[Math.randomInt(summonIndexs.length-1)];
        const position = $dataTroops[summonTroopNo].members[summonNo];
        this.getActingBattler().removeState(summonId);
        let enemy = new Game_Enemy(enemyId, position.x, position.y, enemyLevel);
        if (summonNo >= 2){
            $gameTroop.members().push( enemy ) ;
        } else{
            const insertIdx = (summonNo > $gameTroop.members().length-1) ? $gameTroop.members().length-1 : summonNo;
            $gameTroop.members().splice( insertIdx, 0, enemy ) ;
        }
        this._battleMembers.push(enemy);
        enemy.refreshPassive();
        //初期MP
        enemy.setMp(enemy.initMp());
        enemy.stratDashApParam();
        // 召喚用インデックスを設定
        enemy.setSummonedIndex(this._summonedIndex);
        this._summonedIndex += 1;
        return enemy;
    }

    summonPopup(enemy){
        let popupData = [];
        const summonId = $gameStateInfo.getStateId(StateType.SUMMON);
        popupData = [new PopupTextData(enemy,PopupTextType.Summon, TextManager.getEnemyName(enemy.enemyId()) + TextManager.getStateName(summonId))]
        return popupData;
    }

    removeProvocationState (target) {
        let removeTarget = null;
        let popup = null;
        const provocationId = $gameStateInfo.getStateId(StateType.PROVOCATION);
        let party;
        if (target.isActor()){
            party = $gameTroop.members();
        } else{
            party = $gameParty.members();
        }
        party.forEach(battler => {
            if (battler.isStateAffected(provocationId,target.battlerId())){
                battler.removeState(provocationId);
                removeTarget = battler;
            }
        });
        if (removeTarget){
            popup = [new PopupTextData(removeTarget,PopupTextType.RemoveState,TextManager.getStateName(provocationId))]
        }
        return popup;
    }

    actionClear(){
        if (this.getActingBattler()){
            this._actingBattlers.shift();
        }
    }

    turnStateData(){
        /*
        if (this._actingBattlers.length > 1){
            return {add:[],remove:[]};
        }
        */
        let turnStateData = {add:[],remove:[]};
        if (this.getActingBattler()){
            turnStateData = this.getActingBattler().onTurnEnd();
        }
        return turnStateData;
    }

    endTurn(){
        let subject = this.getActingBattler();
        const action = subject.currentAction();
        if (subject){
            const waitStateId = $gameStateInfo.getStateId(StateType.WAIT);
            if (subject.isStateAffected(waitStateId)){
                subject.removeState(waitStateId);
                subject._ap = this.waitSkillChangeAp(subject);
            } else
            if (subject.canMove() && !action.madness() && !action.counter()){
                const reactStateId = $gameStateInfo.getStateId(StateType.REACT);
                if (subject.isStateAffected(reactStateId)){
                    subject._ap = 0.1; // チェインは0, リアクトは0.1
                } else{
                    subject.resetApParam();
                }
            }
        }
        if (action){
            const saltTargetId = $gameStateInfo.getStateId(StateType.SALT_TARGET);
            //塩対応
            if (action && action.isContainsState(saltTargetId)){
                if (action.isContainsState(saltTargetId)){
                    action.results().forEach(result => {
                        result.target._saltTarget = subject;
                    });
                }
            }
        }
    
        const popupData = this.refreshPassive(this._battleMembers);
        this.sortActionBattlers();
        
        //イベントチェック
        //this.updateEventMain()
        
        if (this.isForcedTurn()) {
            this._turnForced = false;
        }
        
        this._battleMembers = _.filter($gameParty.battleMembers().concat($gameTroop.members()),(battler) => battler.isAlive());
        return popupData;
    }

    refreshPassive(members){
        let popupData = [];
        //パッシブ付与
        members.forEach(battler => {
            if (battler.isAlive()){
                const popupList = battler.refreshPassive();
                popupList.forEach(popup => {
                    popupData.push(popup);
                });
            }
        });
        return popupData;
    }

    isForcedTurn(){
        return this._turnForced;
    }

    isActionForced(){
        return !!this._actionForcedBattler;
    }

    forceAction(battler){
        this._actionForcedBattler = battler;
        const index = this._battleMembers.indexOf(battler);
        if (index >= 0) {
            this._battleMembers.splice(index, 1);
        }
    }

    processForcedAction(){
        if (this._actionForcedBattler) {
            this._turnForced = true;
            this._actionBattler = this._actionForcedBattler;
            this._actionForcedBattler = null;
            this.startAction();
            this._actionBattler.removeCurrentAction();
        }
    }

    checkAbort(){
        if ($gameParty.isEmpty()) {
            SoundManager.playEscape();
            this.processAbort();
        }
        return false;
    }
    checkDefeat(){
        const loseType = this.getLoseType();
        if (loseType == GameStageLoseType.TROOPMEMBERLOST){
            if ($gameTroop.deadMembers().length > 0){
                return true;
            }
        }
        if ($gameParty.deadMembers().length > 0){
            return true;
        }
        return false;
    }

    checkVictory(){
        const loseType = this.getLoseType();
        if (loseType == GameStageLoseType.TROOPMEMBERLOST){
            return _.every($gameTroop.members(),(enemy) => enemy.isDying() && !enemy.isDead());
        }
        if ($gameTroop.isBossDead() || $gameTroop.isAllDead()){
            if (this.isLastBattle()){
                let actor = $gameActors.actor(5);
                actor.forgetSkill(252);
                actor.forgetSkill(253);
                actor.changeSlotSkill(0,211);
                actor.changeSlotSkill(1,5);
                actor.changeSlotSkill(2,3);
                actor.changeSlotSkill(3,1);
                actor.changeSlotSkill(4,6);
            }
            return true;
        }
        return false;
    }

    checkVictoryBefore(){
        const results = this.getActingBattler().currentAction().results();
        let deadTarget = [];
        results.forEach(result => {
            if (result.isDead){
                deadTarget.push(result.target);
            }
        });
        let tempTroop = $gameTroop.aliveMembers();
        tempTroop = _.difference(tempTroop,deadTarget);

        const loseType = this.getLoseType();
        if (loseType == GameStageLoseType.TROOPMEMBERLOST){
            return false;
        }
        let isBoss = false;
        if (_.find($gameTroop.aliveMembers(),(e) => e.enemyId() > $gameDefine.bossTroopId)){
            isBoss = true;
        }
        let bossEnemy = (_.find($gameTroop.aliveMembers(),(e) => e.isBoss()));
        if (bossEnemy != null){
            const type = this.performCollapseType(bossEnemy);
            if (type == 1){
                let isBossDead = false;
                if (isBoss && bossEnemy != null){
                    if (_.contains(deadTarget,bossEnemy)){
                        isBossDead = true;
                    }
                }
                if (isBossDead){
                    return true;
                }
            }
        } else{
            if (tempTroop.length == 0){
                return true;
            }
        }
    
        return false;
    }

    processVictory(){
        $gameParty.battleMembers().forEach(actor => {
            SkillAwakeManager.checkSkillAwake(actor,4);
        });
        $gameParty.removeBattleStates();
        //0818 戦闘後回復
        $gameParty.resetBattleParameter();
        $gameParty.members().forEach(actor => {
            actor.resetBattleOrder();
        });
        $gameParty.performVictory();
        this.endBattle(0);
        // 敵の遭遇情報を登録
        $gameTroop.members().forEach(enemy => {
            $gameParty.addEnemyInfoData(enemy.enemyId());
        });
    }

    processChallengeDefeat(){
        $gameParty.onBattleEnd();
        $gameParty.removeBattleStates();
        //0818 戦闘後回復
        $gameParty.resetBattleParameter();
        $gameParty.members().forEach(actor => {
            actor.resetBattleOrder();
        });
        // 敗北時に敵情報を消去
        $gameTroop.clear();
    }

    processAbort(){
        $gameParty.removeBattleStates();
        this.endBattle(1);
    }

    processDefeat(){
        $gameSystem.gainLoseCount(1);
        AudioManager.stopBgm();
    }

    endBattle(result){
        $gameParty.battleMembers().forEach(battler => {
            $gameSystem.gainUseActorCount(battler.actorId());
        });
        if (result === 0) {
            $gameSystem.gainEnemyDefeatCount($gameTroop.deadMembers().length);
            $gameSystem.onBattleWin();
        }
    }

    onSkillCancel(){
        const battler = this.actionBattler();
        if (battler){
            battler._ap += 12;
            battler.removeCurrentAction();
            battler.setNeedMpGain(false);
            this.clearActionBattler();
        }
    }

    clearActionBattler(){
        this._actionBattler = null;
    }
    
    nextBattler(){
        if (this._battleMembers.length > 1){
            this._battleMembers = _.sortBy(this._battleMembers,(battler) => battler._ap);
            return this._battleMembers[0];
        }
        return this._battleMembers[0];
    }

    checkChainBattler(){
        return this.actionBattler() && this.actionBattler().isStateAffected($gameStateInfo.getStateId(StateType.CHAIN));
    }
    
    setChainBattler(){
        const baseBattler = this.actionBattler();
        const isActor = this.actionBattler().isActor();
        this.sortActionBattlers();
        let actionBattler = _.find(this._battleMembers,(battler) => battler.isActor() == isActor && battler.canInput());
        if (actionBattler != null){
            actionBattler._ap = 0; // チェインは0, リアクトは0.1
            let atkBuffStateId = $gameStateInfo.getStateId(StateType.ATK_BUFF_ADD);
            let buffSkill = baseBattler.getStateData($gameStateInfo.getStateId(StateType.CHAIN));
            actionBattler.addState(atkBuffStateId,buffSkill.turns,buffSkill.effect,false,actionBattler.battlerId());
            this._actionBattler = actionBattler;
            baseBattler.removeState($gameStateInfo.getStateId(StateType.CHAIN));
            // チェイン発生中フラグ
            $gameSwitches.setValue($gameDefine.chainSeaquenceSwitchId,false);
        }
        this.sortActionBattlers();
        this.refreshOrder();
    }

    chainPopup(){
        let popupData = [];
        const chainId = $gameStateInfo.getStateId(StateType.CHAIN);
        popupData = [new PopupTextData(this._actionBattler,PopupTextType.CHAIN, TextManager.getStateName(chainId))]
        return popupData;
    }

    getStageTroopData(){
        return null;
    }

    loadResourceData(){
        const resources = ResourceLoadManager.getBattleResource();

        resources.animation.forEach(name => {
            ImageManager.loadAnimation(name);
        });

        resources.enemy.forEach(e => {
            ImageManager.loadEnemy(e.battlerName);
        });
    
        resources.sound.forEach(name => {
            if (!AudioManager.loadedSeResource([name])){
                AudioManager.loadSe(name);
            }
        });

        let needBgm = [];

        return {animation:resources.animation,sound:resources.sound,bgm:needBgm};
    }

    gainTurnCount(){
        this._totalTurnCount += 1;
    }

    setLastDeathEnemyIndex(index){
        this._lastDeadEnemyId = index;
    }

    lastDeathEnemy(){
        const loseType = this.getLoseType();
        if (loseType == GameStageLoseType.TROOPMEMBERLOST){
            return $gameTroop.members()[($gameTroop.members().length-1) / 2];
        }
        return $gameTroop.members()[this._lastDeadEnemyId];
    }
    createResultData(){
        if (this.isLastBattle()){
            return;
        }
        // バトルスキップしたときはターンカウントを9999にする 
        if ($dataOption.getUserData("battleSkipMode") === BattleSkipMode.Skip){
            this._totalTurnCount = 9999;
        }
        let battler = this.actionBattler() != null && this.actionBattler().isActor() ? this.actionBattler() : $gameParty.members()[0];
        let params = {
            id : 0,
            time : Date.now(),
            turnCount : this._totalTurnCount,
            partyMemberId : $gameParty.battleMembers().map(battler => battler.actorId()),
            finishActorId : battler.actorId(),
            finishSkillId : battler._lastBattleSkillId,
            bossId : $gameTroop.members()[this._lastDeadEnemyId].enemyId(),
            sended : false
        };
        let result = new Game_ResultData(Game_ResultType.Battle,params);
        $gameParty.recordData().gainRecordData(result);
        // ランキングデータ送信
        //FireBaseUtility.sendRankingData(params);
    }
    
    createResultDataRushBattle(){
        const stageevent = $gameParty.stageEvent();
        if (stageevent && stageevent._type == "mapBattle"){
            // トループIDからchallengeIdを検索
            const troopId = $gameTroop.troopId();
            const challengeId = $gameChallenge.getChallengeIdByTroopId(troopId);

            if (challengeId > 0){
                // バトルスキップしたときはターンカウントを9999にする 
                if ($dataOption.getUserData("battleSkipMode") === BattleSkipMode.Skip){
                    this._totalTurnCount = 9999;
                }
                let battler = this.actionBattler() != null && this.actionBattler().isActor() ? this.actionBattler() : $gameParty.members()[0];
                let params = {
                    id : challengeId,
                    time : Date.now(),
                    turnCount : this._totalTurnCount,
                    partyMemberId : $gameParty.battleMembers().map(battler => battler.actorId()),
                    finishActorId : battler.actorId(),
                    finishSkillId : battler._lastBattleSkillId,
                    bossId : $gameTroop.members()[this._lastDeadEnemyId].enemyId()
                };
                let result = new Game_ResultData(Game_ResultType.Battle,params);
                const isNewRecord = $gameParty.recordData().gainRecordData(result);
                return isNewRecord;
            }
        }
        return null;
    }

    selectbattlerSkills(battler){
        let slotSkills = battler.slotSkillIds();
        let others = battler.otherSkillIds();
        if (this.isLastBattle()){
            others = [];
        }
        
        const actor = battler;
        const isTpMax = actor.isTpMax();
        let selectbattlerSkills = [];
        slotSkills.forEach((skillId ,index)=> {
            if (isTpMax == false && skillId > 1000){
                skillId -= 1000;
            }
            let skill = $dataSkills[skillId];
            selectbattlerSkills.push(new Game_SlotSkill(
                skillId,
                {
                    mpCost:actor.skillMpCost(skill),
                    level:actor.skillLevel(skillId),
                    lessLevel:actor.skillLevelWithoutSP(skillId),
                    expRate:actor.getSkillExpPercent(skillId),
                    expRateTotal:actor.getSkillExpPercentTotal(skillId),
                    enable:(actor && actor.canUse(skill) && skill.id > $gameDefine.defaultSlotId),
                    elementId:[skill.damage.elementId,actor._selfElement,actor.slotElement(index)],
                    helpData:new Game_SkillHelp(actor,skillId)
                })
            )
        });
        /*
        others.forEach((skillId ,index)=> {
            let skill = $dataSkills[skillId];
            selectbattlerSkills.push(new Game_SlotSkill(
                skillId,
                {
                    mpCost:actor.skillMpCost(skill),
                    level:actor.skillLevel(skillId),
                    lessLevel:actor.skillLevelWithoutSP(skillId),
                    expRate:actor.getSkillExpPercent(skillId),
                    expRateTotal:actor.getSkillExpPercentTotal(skillId),
                    enable:(actor && actor.canUse(skill) && skill.id > $gameDefine.defaultSlotId),
                    elementId:[skill.damage.elementId,skill.damage.elementId,skill.damage.elementId],
                    helpData:new Game_SkillHelp(actor,skillId)
                })
            )
        });
        */
        return selectbattlerSkills;
    }

    otherSkills(battler){
        let others = battler.otherSkillIds();
        if (this.isLastBattle()){
            others = [];
        }
        
        const actor = battler;
        let selectbattlerSkills = [];
        others.forEach((skillId ,index)=> {
            let skill = $dataSkills[skillId];
            selectbattlerSkills.push(new Game_SlotSkill(
                skillId,
                {
                    mpCost:actor.skillMpCost(skill),
                    level:actor.skillLevel(skillId),
                    lessLevel:actor.skillLevelWithoutSP(skillId),
                    expRate:actor.getSkillExpPercent(skillId),
                    expRateTotal:actor.getSkillExpPercentTotal(skillId),
                    enable:(actor && actor.canUse(skill) && skill.id > $gameDefine.defaultSlotId),
                    elementId:[skill.damage.elementId,skill.damage.elementId,skill.damage.elementId],
                    helpData:new Game_SkillHelp(actor,skillId)
                })
            )
        });
        return selectbattlerSkills;
    }

    selectbattlerSkillOthers(battler){
        return battler.otherSkillIds();
    }

    analyseBattler(index){
        const members = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
        if (index == 'last'){
            return members[members.length-1];
        }
        if (index == 'start'){
            return members[0];
        }
        if (index > members.length-1){
            index = 0;
        }
        if (index < 0){
            index = members.length-1;
        }
        return members[index];
    }

    analyseBattlerActions(index){
        const battler = this.analyseBattler(index);
        let slotSkillData = [];
        if (battler.isActor()){
            const actor = battler;
            
            actor.slotSkillIds().forEach((skillId ,index)=> {
                let skill = $dataSkills[skillId];
                slotSkillData.push(new Game_SlotSkill(
                    skillId,
                    {
                        mpCost:actor.skillMpCost(skill),
                        elementId:[skill.damage.elementId,actor._selfElement,actor.slotElement(index)],
                        helpData:new Game_SkillHelp(actor,skillId)
                    })
                )
            });
            return slotSkillData;
        } else{
            const enemy = battler;
            enemy._actionList.forEach((action ,index)=> {
                let skill = $dataSkills[action.skillId];
                let elementId = skill.damage.elementId == -1 ? enemy._selfElement : skill.damage.elementId;
            
                slotSkillData.push(new Game_SlotSkill(
                    action.skillId,
                    {
                        mpCost:enemy.skillMpCost(skill),
                        elementId:[elementId,elementId, elementId],
                        helpData:new Game_SkillHelp(enemy,action.skillId)
                    })
                )
            });
            return slotSkillData;
        }
    }

    findIndexBattler(battler){
        const members = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
        return _.findIndex(members,battler);
    }

    addGuardState(){
        $gameParty.aliveMembers().forEach(member => {
            if (member.canMove()){
                member.addState($gameStateInfo.getStateId(StateType.GUARD));
            }
        });
    }

    eraseGuardState(){
        $gameParty.aliveMembers().forEach(member => {
            member.eraseState($gameStateInfo.getStateId(StateType.GUARD));
        });
    }

    selectActorSkillItems(index){
        const element = this.actionBattler().slotElement(index);
        let skills = this.actionBattler().getReserveSkillData(element);
        //return _.chain(data).sortBy((d) => d).sortBy((d) => $dataSkills[d] && $dataSkills[d].damage.elementId == element).value();
        
        const actor = this.actionBattler();
        let skillItemData = [];
        skills.forEach(skillId => {
            let skill = $dataSkills[skillId];
            skillItemData.push(new Game_SlotSkill(
                skillId,
                {
                    mpCost:actor.skillMpCost(skill),
                    level:actor.skillLevel(skillId),
                    lessLevel:actor.skillLevelWithoutSP(skillId),
                    expRate:actor.getSkillExpPercent(skillId),
                    expRateTotal:actor.getSkillExpPercentTotal(skillId),
                    selected:_.find(actor.slotSkillIds(), (slotSkillId) => slotSkillId == skillId),
                    elementId:[skill.damage.elementId,skill.damage.elementId,skill.damage.elementId],
                    helpData:new Game_SkillHelp(actor,skillId)
                })
            )
        });
        skillItemData.push(new Game_SlotSkill(
            $gameDefine.removeSkillId,
            {
                mpCost:-1,
                elementId:[6,6,6],
                helpData:new Game_SkillHelp(actor,$gameDefine.removeSkillId)
            })
        );
        return skillItemData;
    }

    removeNewSkillId(item){
        if (item){
            $gameParty._newSkillIdList = _.without($gameParty._newSkillIdList,item);
        }
    }

    changeSlotSkill(index,skillId){
        this.actionBattler().changeSlotSkill(index,skillId);
    }

    performCollapseType(battler){
        if (this.isLastBattle()){
            return 1;
        }

        return 0;
    }

    performCollapseEnd(){
        return this.performCollapseType(this.lastDeathEnemy()) == 1;
    }

    tpMaxActors(){
        if ($gameTroop.aliveMembers().length == 0){
            return[[],[]];
        }
        let list = [];
        let list2 = [];
        this._battleMembers.forEach(battler => {
            if (battler.isActor() && battler.isTpMax()){
                list.push(battler);
                if (!battler.isTpMaxed()){
                    list2.push(battler);
                }
                battler._isTpMaxed = true;
            } else{
                battler._isTpMaxed = false;
            }
        });
        return [list,list2];
    }

    isAllAttack(action,actionBattler){
        if (action.isForAll()){
            return true;
        }
        const allAttackId = $gameStateInfo.getStateId(StateType.ALL_ATTACK);
        if (actionBattler.isStateAffected(allAttackId)){
            return true;
        }
    }

    setBeforeMembers(){
        PopupLevelUpManager.setBeforeMembers($gameParty.battleMembers());
    }
    getChangeMembers(){
        return PopupLevelUpManager.getChangeMembers($gameParty.battleMembers());
    }

    nextAp(){
        let ap;
        let action = this.actionBattler().currentAction();
        if (action._item._itemId == $gameDefine.waitSkillId){
            ap = this.waitSkillChangeAp(this.actionBattler());
        } else{
            ap = 400 - this.actionBattler().agi * 4;
        }
        return ap;
    }

    loadAutoSaveFile(){
        if (DataManager.loadGame(100)) {
            return true;
        } else {
            return false;
        }
    }
    
    setSelectLastIndex(id){
        if (id < DataManager.autoSaveGameId()){
            $dataOption.setUserData("lastAccessSaveId",id + 1);
            ConfigManager.save();
        }
    }

    async checkAwakeHelp(){
        if ($gameParty._readCheckAwakeHelp){
            return;
        }
        return new Promise(resolve => {
            Popup_Help.open('battle5',() => {
                $gameParty._readCheckAwakeHelp = true;
                resolve();
            })
        });
    }

    //覚醒状態ならそのまま、覚醒でない場合は覚醒スキルをベーススキルに戻す
    changeBaseSkills(baseSkillId){
        const battler = this._actionBattler;
        if (battler.isActor() && !battler.isTpMax()){
            battler.changeBaseSkills();
            battler.setLastBattleSkillId(baseSkillId);
        }
    }

    isLastBattle(){
        return $gameTroop.troopId() == $gameDefine.lastBattleTroopId;
    }

    prereadyEvent(){
        return null;
    }

    startVoice(){
        const actorIdx = Math.randomInt($gameParty.battleMembers().length);
        const actorId = $gameParty.battleMembers()[actorIdx].actorId();

        const loseType = 1;
        const enemyLv = $gameTroop.avarageLevel();
        const partyLv = $gameParty.avarageLevel();
        if (partyLv > (enemyLv + 3)){
            // 敵が人間の時ニナの「このマモノだったら…」は言わない
            if (actorId == 2 && loseType == GameStageLoseType.TROOPMEMBERLOST){
                return {actorId:actorId,type:BattleVoiceType.Start2};
            }
            return {actorId:actorId,type:BattleVoiceType.Start1};
        } else
        if (partyLv < (enemyLv - 3)){
            return {actorId:actorId,type:BattleVoiceType.Start3};
        }
        // 敵が人間の時レミィの「マモノだわ」は言わない
        if (actorId == 3 && loseType == GameStageLoseType.TROOPMEMBERLOST){
            return {actorId:actorId,type:BattleVoiceType.Start1};
        }
        return {actorId:actorId,type:BattleVoiceType.Start2};
    }

    victoryVoice(){
        const actorIdx = Math.randomInt($gameParty.battleMembers().length);
        const actorId = $gameParty.battleMembers()[actorIdx].actorId();
        const isDying = _.find( $gameParty.battleMembers(), (member) => member.isDying());
        if (isDying){
            return {actorId:actorId,type:BattleVoiceType.Victory2};
        }
        return {actorId:actorId,type:BattleVoiceType.Victory1};
    }

    damageVoice(results){
        const battler = this.getActingBattler();
        let voiceData = [];
        for (let i = 0;i< results.length;i++){
            let target = results[i].target;
            if (target.isActor()){
                
                if (results[i].hpDamage > 0){
                    if (!_.find(voiceData,(data) => data.actorId == target.actorId())){
                        let rate = results[i].hpDamage / target.hp;
                        if (rate > 0.5){
                            voiceData.push({actorId:target.actorId(),type:BattleVoiceType.Damage1});
                        } else if (rate > 0.25 && rate < 0.5){
                            voiceData.push({actorId:target.actorId(),type:BattleVoiceType.Damage2});
                        } else{
                            voiceData.push({actorId:target.actorId(),type:BattleVoiceType.Damage3});
                        }
                    }
                } else
                if (results[i].hpDamage < 0 && target.isActor()){
                    if (!_.find(voiceData,(data) => data.actorId == target.actorId())){
                        // 使用者と対象者が違う場合のみ
                        if (battler == null || battler != target){
                            voiceData.push({actorId:target.actorId(),type:BattleVoiceType.BeHealed});
                        }
                    }
                }
            }
        }
        return voiceData;
    }

    defeatVoice(){
        const loseType = this.getLoseType();
        if (loseType == GameStageLoseType.TROOPMEMBERLOST){
            return null;
        }
        const actor = _.find($gameParty.battleMembers() ,(member) => member.isDead());
        return {actorId:actor.actorId(),type:BattleVoiceType.Defeat};
    }

    dyingVoice(){
        let voiceData = [];
        $gameParty.battleMembers().forEach((member,index) => {
            if (this._tempDyingData[index] == false && member.isDying()){
                voiceData.push({actorId:member.actorId(),type:BattleVoiceType.Dying});
                this._tempDyingData[index] = true;
            } else if (this._tempDyingData[index] == true && !member.isDying()){
                this._tempDyingData[index] = false;
            }
        });
        if (voiceData.length > 0){
            const idx = Math.randomInt(voiceData.length);
            return voiceData[idx];
        }
        return null;
    }

    magicVoice(actionBattler){
        const idx = Math.randomInt(6);
        // エレクトロチェーン
        if (actionBattler.actorId() == 2 && actionBattler.currentAction() && actionBattler.currentAction().item().id == 81){
            return {actorId:actionBattler.actorId(),type:BattleVoiceType.Magic3};
        }
        // レミィの回復
        if (actionBattler.actorId() == 3 && actionBattler.currentAction() && actionBattler.currentAction().isRecover() == true){
            return {actorId:actionBattler.actorId(),type:BattleVoiceType.Magic2};
        }
        // レミィの挑発
        if (actionBattler.actorId() == 3 && actionBattler.currentAction() && (actionBattler.currentAction().item().id >= 141 && actionBattler.currentAction().item().id <= 145)){
            return {actorId:actionBattler.actorId(),type:BattleVoiceType.Magic3};
        }
        // レミィのその他
        if (actionBattler.actorId() == 3 && actionBattler.currentAction()){
            return {actorId:actionBattler.actorId(),type:BattleVoiceType.Magic1};
        }
        if (idx == 0){
            return {actorId:actionBattler.actorId(),type:BattleVoiceType.Magic1};
        } else
        if (idx == 1){
            return {actorId:actionBattler.actorId(),type:BattleVoiceType.Magic2};
        } else
        if (idx == 2){
            if (actionBattler.actorId() == 2){
                return {actorId:actionBattler.actorId(),type:BattleVoiceType.Magic2};
            } else{
                return {actorId:actionBattler.actorId(),type:BattleVoiceType.Magic3};
            }
        }
        return null;
    }

    getLoseType(){
        let loseType = this.stageData().loseType;
        const stageevent = $gameParty.stageEvent();
        if (stageevent && stageevent._type == "mapBattle"){
            loseType = $gameParty.stageData().loseType;
        }
        return loseType;
    }
}