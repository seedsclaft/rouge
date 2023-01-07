//-----------------------------------------------------------------------------
// Model_Battle
//
class Model_Battle extends Model_Base {
    constructor(){
        super();
        this.initMembers();
        this._makeActionData = [];
    }

    currentAction(){
        return this._makeActionData.length > 0 ? this._makeActionData[0] : null;
    }
    
    troop(){
        return $gameTroop;
    }

    battleBgm(){
        return $gameSystem.battleBgm();
    }

    backGround1(){
        if (DataManager.isBattleTest()){
            return $dataSystem.battleback1Name;
        }
        return $gameMap.battleback1Name();
    }

    backGround2(){
        if (DataManager.isBattleTest()){
            return $dataSystem.battleback2Name;
        }
        return $gameMap.battleback2Name();
    }

    enemyData(){
        return this.troop().members();
    }

    actorData(){
        return $gameParty.members();
    }

    battleSkill(battler){
        let data = [];
        if (battler.isActor()){
            const skills = battler.skills().filter(a => a.occasion == 1);
            skills.forEach(skill => {
                data.push({skill:skill,enable:battler.canUse(skill) && skill.stypeId == Game_BattlerBase.SKILL_TYPE_MAGIC,cost:battler.skillMpCost(skill) });
            });
        }
        return data;
    }

    initMembers(){
        if (DataManager.isBattleTest()){
            $gameTroop.setup($dataSystem.testTroopId,Number($dataTroops[$dataSystem.testTroopId].name),Number($dataTroops[$dataSystem.testTroopId].name) + 2);
            $gameTroop.setupBoss(6,$dataTroops[$dataSystem.testTroopId+1].members[0].enemyId,Number($dataTroops[$dataSystem.testTroopId+1].name));
        }
        this._actionForcedBattler = null;
        this._battleMembers = [];
        this._actionBattler = null;

        this._actingBattlers = [];

        this._logWindow = null;
        this._turnForced = false;

        this._totalTurnCount = 1;

        this._lastDeadEnemyId = 0;

        this._tempDyingData = [false,false,false];

        this._summonedIndex = 1000;
    }

    initBattle(){
        $gameSystem.onBattleStart();
        $gameParty.onBattleStart();
        $gameTroop.onBattleStart();
        this.createActionBattlers();
        this.sortActionBattlers();
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
    }
/*
    resume(){
        this.initMembers();
    }
    */


    setBattleCalledMenu(flag){
        $gameSystem.setBattleCalledMenu(flag);
    }


    actionBattler(){
        return this._actionBattler ? this._actionBattler : null;
    }

    updateApGain(isGuard){
        if (isGuard){
            this.addGuardState();
        } else{
            this.eraseGuardState();
        }
        this._battleMembers.forEach(battler => {
            if ((battler.isActor() && !isGuard) || battler.isEnemy()){
                battler.gainDefineAp();
                battler.updateStateTimes();
            }
        });
        let actionBattler = _.find(this._battleMembers,(battler) => battler._ap <= 0);
        if (actionBattler != null){
            this._actionBattler = actionBattler;
        }
        this.sortActionBattlers();
        this.refreshOrder();
        return this._actionBattler;
    }

    bindedBattlers(){
        const chainTargetId = $gameStateInfo.getStateId(StateType.CHAIN_TARGET);
        let bindBatllers = this._battleMembers.filter(battler => {
            return battler.isStateAffected(chainTargetId) && (battler.getStateTurns(chainTargetId) % 10 == 0);
        });
        bindBatllers.forEach(bindBatller => {
            bindBatller.gainHp(-1);
            bindBatller._bindBatllers.forEach(bind => {
                bind.gainBindDamage(1);
            });
        });
        return bindBatllers;
    }

    selectSkill(skillId){
        let action = new Game_Action(this._actionBattler);
        action.setSkill(skillId);
        this._actionBattler.setLastBattleSkillId(skillId);
        this._makeActionData.push(action);
        return action;
    }

    selectEnemySkill(){
        let action = new Game_Action(this._actionBattler);
        this._actionBattler.setAction(action);
        this._makeActionData.push(action);
    }

    actionTargetData(action){
        return {
            isForOpponent: action.isForOpponent(),
            isForAll: action.isForAll(),
            isForUser: action.isForUser(),
            isLine: action.isLine()
        };
    }

    skillTargetList(){
        let candidate = this.currentAction().itemTargetCandidates();
        if (candidate && !candidate[0].isActor()){
            candidate = candidate.filter(a => a.line() <= this.currentAction().item().range);
        }
        return candidate;
    }

    makeResult(targetId){
        this.currentAction().setTarget(targetId);
        $gameTroop.increaseTurn();
        //結果を先に判定
        if (this.actionBattler().canMove()){
            let action = this.currentAction();
            if (action.item().id == $gameDefine.waitSkillId){
                this.actionBattler()._ap = this.waitSkillChangeAp(this.actionBattler());
            } else{
                //this.actionBattler().resetAp();
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
        const _attackLengthId = $gameStateInfo.getStateId(StateType.ATTACK_LENGHT);
        if (this.actionBattler().isStateAffected(_attackLengthId)){
            //const _count = this.actionBattler().attackTimesAdd();
            this._attackTimesAdd = this.actionBattler().getStateEffectTotal(_attackLengthId);
        }
    }

    acnimationId(action){
        let animationId = action.item().animationId;
        if (animationId < 0 && !this.getActingBattler().isActor()){
            animationId = this.getActingBattler().attackId();
        }
        return animationId;
    }

    changeTroopLine(){
        const troop = this.troop();
        let lineData = [
            [],[]
        ];
        troop.enemiesLine().forEach((line,index) => {
            if (troop.members()[index].isAlive()){
                lineData[line].push(troop.members()[index]);
            }
        });
        let changed = false;
        lineData.forEach((line,index) => {
            if (index == 0) return;
            for (let j = 0;j <= index;j++){
                if (lineData[index - j].length == 0){
                    line.forEach(member => {
                        member._line = index - 1;
                    });
                    changed = true;
                } else{
                    line.forEach(member => {
                        member._line = index;
                    });
                }
            }
        });
        return changed;
    }

    refreshOrder(){
        this._battleMembers.forEach((battler,index) => {
            battler.setBattleOrder(index+1);
        });
    }

    canInput(){
        return this._actionBattler.canInput();
    }

    needChargeAnimation(){
        return this._actionBattler.currentAction() && this._actionBattler.currentAction().item().mpCost > 0;
    }

    needMadnessAnimation(actionBattler){
        return !actionBattler.isActor() && actionBattler.currentAction() && actionBattler.currentAction()._madness == true;
    }

    actionBattlers(){
        return this._battleMembers;
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
            enemy.stratDashApParam();

        });
        $gameParty.aliveMembers().forEach(actor => {
            this._battleMembers.push(actor);
            actor.refreshPassive();
            actor.resetAp();
            actor.stratDashApParam();
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
    createActionData(){
        let action = this.currentAction();
        action.prepare();
        action.makeActionResult();
        this.setActingBattler(this.actionBattler(),false);
    }

    createAttackTimesAddActionData(){
        if (this._attackTimesAdd <= 0){
            return;
        }
        const _attackLengthId = $gameStateInfo.getStateId(StateType.ATTACK_LENGHT);
        const _battler = this.actionBattler();
        if (_battler.isStateAffected(_attackLengthId)){
            const _costMp = _battler.getStateEffectTotal(_attackLengthId);
            if (_battler.mp >= _costMp){
                _battler.gainMp(_costMp * -1);
                this._attackTimesAdd -= 1;
                let action = new Game_Action(_battler);
                _battler.setAction(action);
                action.makeActionResult();
                this._makeActionData.push(action);
                this.setActingBattler(_battler,false);
            }
        }
    }

    createInterruptActionData(){
        const _battler = this.actionBattler();
        const chainTargetId = $gameStateInfo.getStateId(StateType.CHAIN_TARGET);
        if (_battler.isStateAffected(chainTargetId)){
            const _bindBatllers = _battler._bindBatllers;
            if (_bindBatllers.length > 0){
                _bindBatllers.forEach(bindBatllers => {
                    let action = new Game_Action(bindBatllers);
                    action.setSkill(56);
                    action.setTarget(_battler.index());
                    action.makeActionResult();
                    this._makeActionData.push(action);
                    this.setActingBattler(bindBatllers,false);
                });
            }
        }

        
        const _battlers = this.actionBattlers();
        let action = this.currentAction();
        // timingがInterruptの固有を発動
        _battlers.forEach(battler => {
            let data = [];
            if (battler.isActor()){
                let skills = battler.skills().filter(a => a.occasion == 1);
                skills.forEach(skill => {
                    data.push({skill:skill,enable:battler.canUse(skill) ,cost:battler.skillMpCost(skill) });
                });
            }
            data.forEach(skill => {
                if (skill.enable && skill.skill.timing == "interrupt"){
                    let flag = true;
                    let stateEval = skill.skill.stateEval;
                    if (stateEval != null){
                        let a = battler;
                        let pam = $gameParty.aliveMembers();
                        let r = action.results();
                        console.log(skill)
                        flag = eval(stateEval);
                    }
                    if (flag){
                        let action = new Game_Action(battler,false,"interrupt");
                        action.setSkill(skill.skill.id);
                        action.makeActionResult();
                        this._makeActionData.unshift(action);
                        this.setActingBattler(battler,true);
                        battler.paySkillCost(skill.skill);
                    }
                }
            });
        });
        // Awakeポイント(割り込み) SkillAwakeManager._interruptActing
        /*
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
        */
    }

    interrupt(){
        this._makeActionData[1]._results = [];
        this._makeActionData[1].makeActionResult();
    }

    createCounterActionData(){
        let action = this.currentAction();
        const counterId = $gameStateInfo.getStateId(StateType.COUNTER);
        const refrectId = $gameStateInfo.getStateId(StateType.REFRECT);
        //カウンター生成
        let counterTarget = [];
        if (action){
            action.results().forEach(result => {
                if (action.isDamage() && action.isHpEffect() && result.target.hp > result.hpDamage && result.target.isStateAffected(counterId)){   
                    if (!_.contains(counterTarget,result.target)){
                        if (this.actionBattler() != result.target){
                            let counterAction = new Game_Action(result.target);
                            counterAction.setSkill(result.target.getStateEffect(counterId));
                            counterAction.setTarget(this.actionBattler().index());
                            counterAction.makeActionResult();
                            counterAction.setCounter();
                            this._makeActionData.push(counterAction);
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
        // timingがafterの固有を発動
        const _battler = this.actionBattlers();
        _battler.forEach(battler => {
            let data = [];
            if (battler.isActor()){
                let skills = battler.skills().filter(a => a.occasion == 1);
                skills.forEach(skill => {
                    data.push({skill:skill,enable:battler.canUse(skill) ,cost:battler.skillMpCost(skill) });
                });
            }
            data.forEach(skill => {
                if (skill.enable && skill.skill.timing == "after"){
                    let flag = true;
                    let stateEval = skill.skill.stateEval;
                    if (stateEval != null){
                        let a = battler;
                        let p = $gameParty;
                        flag = eval(stateEval);
                    }
                    if (flag){
                        let action = new Game_Action(battler);
                        action.setSkill(skill.skill.id);
                        action.makeActionResult();
                        this._makeActionData.push(action);
                        this.setActingBattler(battler,false);
                        battler.paySkillCost(skill.skill);
                    }
                }
            });
        });
    }
    createDeathActionData(){
        // timingがafterの固有を発動
        const _battler = this.actionBattlers();
        _battler.forEach(battler => {
            let data = [];
            if (battler.isActor()){
                let skills = battler.skills().filter(a => a.occasion == 1);
                skills.forEach(skill => {
                    data.push({skill:skill,enable:battler._tp == 100 ,cost:battler.skillMpCost(skill) });
                });
            }
            data.forEach(skill => {
                if (skill.enable && skill.skill.timing == "death"){
                    let flag = true;
                    let stateEval = skill.skill.stateEval;
                    if (stateEval != null){
                        let a = battler;
                        let p = $gameParty;
                        flag = eval(stateEval);
                    }
                    if (flag){
                        let action = new Game_Action(battler,false,"death");
                        action.setSkill(skill.skill.id);
                        action.makeActionResult();
                        this._makeActionData.push(action);
                        this.setActingBattler(battler,false);
                        battler.paySkillCost(skill.skill);
                        battler.removeState(1);
                    }
                }
            });
        });
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
                }
            }
            action.applyResult(result.target,result);
        });
    }

    applyGlobal(){
        const _subject = this.getActingBattler();
        const _action = this.currentAction();
        
        _subject.useItem(_action.item(),true);
        _action.applyGlobal();
    }
    needAfterHeal(){
        const subject = this.getActingBattler();
        const action = this.currentAction();
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
        const subject = this.getActingBattler();
        const action = this.currentAction();
    
        let plusValue = 0;
        if (action.isContainsState($gameStateInfo.getStateId(StateType.DRAIN_HEAL))){
            plusValue += Math.round(action.resultHpDamageValue() * action.item().stateEffect * 0.01);
        }
        if (subject.isStateAffected($gameStateInfo.getStateId(StateType.REGENE_HP))){
            plusValue += Math.round(subject.getStateEffect($gameStateInfo.getStateId(StateType.REGENE_HP)));
        }
    
        let data = [];
        if (plusValue > 0){
            subject.setHp(subject.hp + plusValue);
            data.push({battler:subject,value:plusValue});
        }
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
        const _action = this.currentAction();
        if (!_action){
            return false;
        }
        const results = this.currentAction().results();
        if (results){
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
        }
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
        let popup = this.currentAction().popupData(this.getActingBattler());
        this.removeState();
        this.addState(popup);
        this.bindRemoveSelf();
        this.bindRemoveTarget();
        this.removeCharge();
        this.bindState();
        this.selfSkill();
        this.wavySkill();
        this.actionBattler().resetAp();
        return popup;
    }

    removeState(){
        let action = this.currentAction();
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
        let action = this.currentAction();
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
        const action = this.currentAction();
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
        const _battler = this.getActingBattler();
        let action = this.currentAction();
        const chainSelfId = $gameStateInfo.getStateId(StateType.CHAIN_SELF);
        //const chainPlusId = $gameStateInfo.getStateId(StateType.CHAIN_PLUS);
        //const isChainPlus = _battler.isStateAffected(chainPlusId);
        if (action && _battler.isStateAffected(chainSelfId)){
            _battler.removeState(chainSelfId);
            /*
            _battler._bindBatllers.forEach(target => {
                // 拘束プラス所持者のみ行動値を初期化する
                //if (isChainPlus){
                    //target.resetAp();
                //}
                target.removeState($gameStateInfo.getStateId(StateType.CHAIN_TARGET));
                
            });
            battler._bindBatllers = [];
            */
        }
    }

    bindRemoveTarget(){
        const _battler = this.getActingBattler();
        const chainTargetId = $gameStateInfo.getStateId(StateType.CHAIN_TARGET);
        if (_battler.isStateAffected(chainTargetId)){
            _battler.removeState(chainTargetId);
            _battler._bindBatllers = [];
        }
        /*
        //相手の行動で拘束解除
        if (action){
            action.results().forEach(result => {
                if (result.target.isStateAffected(chainSelfId) && result.hpDamage > 0){
                    result.target.removeState(chainSelfId);
                    result.target.resetAp();
                    result.target._bindBatllers.forEach(target => {
                        target.removeState($gameStateInfo.getStateId(StateType.CHAIN_TARGET));
                        //popup.push({battler:target});
                    });
                    result.target._bindBatllers = [];
                }
            });
        }
        */
    }

    bindState(){
        const _battler = this.getActingBattler();
        let action = this.currentAction();
    
        const chainTargetId = $gameStateInfo.getStateId(StateType.CHAIN_TARGET);
        if (action && action.isContainsState(chainTargetId)){
            const effects = _.every(action.results(),(r) => r.target.isStateResist(chainTargetId))
            
            if (!effects){
                const data = $dataSkills[action.item().id];
                _battler.addState($gameStateInfo.getStateId(StateType.CHAIN_SELF), data.stateTurns,data.stateEffect,false,_battler.battlerId());
                action.results().forEach(result => {
                    result.target._bindBatllers = [];
                });
                action.results().forEach(result => {
                    result.target._bindBatllers.push(_battler);
                });
            }
        }
    }

    selfSkill(){
        let actor = this.getActingBattler();
        let action = this.currentAction();
        if (action){
            const skill = $dataSkills[action.item().id];
            if (skill.selfSkill){
                this.selfSkillEffect(skill.selfSkill,actor,action);
            }
        }
    }

    wavySkill(){
        /*
        let actor = this.getActingBattler();
        let action = this.currentAction();
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
        */
    }

    selfSkillEffect(skillId,actor,action){
        if (skillId == 0) return;
        const selfSkill = $dataSkills[skillId];
        const passive = (selfSkill.stypeId == Game_BattlerBase.SKILL_TYPE_PASSIVE);
        
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
        const action = this.currentAction();
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
        let popup = null;
        /*
        let removeTarget = null;
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
        */
        return popup;
    }

    claerAction(){
        this._makeActionData = [];
    }

    actionClear(){
        if (this.getActingBattler()){
            this._actingBattlers.shift();
            this._makeActionData.shift();
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
        const action = this.currentAction();
        if (subject){
            /*
            const waitStateId = $gameStateInfo.getStateId(StateType.WAIT);
            if (subject.isStateAffected(waitStateId)){
                subject.removeState(waitStateId);
                subject._ap = this.waitSkillChangeAp(subject);
            } else
            */
            if (subject.canMove() && !action.madness() && !action.counter()){
                const reactStateId = $gameStateInfo.getStateId(StateType.REACT);
                if (subject.isStateAffected(reactStateId)){
                    subject._ap = 0.1; // チェインは0, リアクトは0.1
                } else{
                    subject.resetAp();
                }
            }
        }
        if (action){
            /*
            const saltTargetId = $gameStateInfo.getStateId(StateType.SALT_TARGET);
            //塩対応
            if (action && action.isContainsState(saltTargetId)){
                if (action.isContainsState(saltTargetId)){
                    action.results().forEach(result => {
                        result.target._saltTarget = subject;
                    });
                }
            }
            */
        }
    
        const popupData = this.refreshPassive(this._battleMembers);
        this.sortActionBattlers();
        
        //イベントチェック
        //this.updateEventMain()
        
        if (this.isForcedTurn()) {
            this._turnForced = false;
        }
        
        return popupData;
    }

    resetActionBattlers(){
        this._battleMembers = _.filter($gameParty.battleMembers().concat($gameTroop.members()),(battler) => battler.isAlive());
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
        if ($gameParty.deadMembers().length == $gameParty.members().length){
            return true;
        }
        return false;
    }

    checkVictory(){
        if ($gameTroop.isBossDead() || $gameTroop.isAllDead()){
            return true;
        }
        return false;
    }

    checkVictoryBefore(){
        const results = this.currentAction().results();
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
        /*
        $gameParty.battleMembers().forEach(actor => {
            SkillAwakeManager.checkSkillAwake(actor,4);
        });
        */
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
        AudioManager.stopBgm();
    }

    endBattle(result){
        if (result === 0) {
           //$gameSystem.gainEnemyDefeatCount($gameTroop.deadMembers().length);
            $gameSystem.onBattleWin();
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
        return false;
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
        return $gameTroop.members()[this._lastDeadEnemyId];
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
            ap = 500 - this.actionBattler().agi * 4;
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

    getLoseType(){
        return null;
    }
}