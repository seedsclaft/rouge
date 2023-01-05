//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

//独自設計のため上書き
function Game_Action() {
    this.initialize(...arguments);
}

Game_Action.EFFECT_RECOVER_HP       = 11;
Game_Action.EFFECT_RECOVER_MP       = 12;
Game_Action.EFFECT_GAIN_TP          = 13;
Game_Action.EFFECT_ADD_STATE        = 21;
Game_Action.EFFECT_REMOVE_STATE     = 22;
Game_Action.EFFECT_ADD_BUFF         = 31;
Game_Action.EFFECT_ADD_DEBUFF       = 32;
Game_Action.EFFECT_REMOVE_BUFF      = 33;
Game_Action.EFFECT_REMOVE_DEBUFF    = 34;
Game_Action.EFFECT_SPECIAL          = 41;
Game_Action.EFFECT_GROW             = 42;
Game_Action.EFFECT_LEARN_SKILL      = 43;
Game_Action.EFFECT_COMMON_EVENT     = 44;
Game_Action.SPECIAL_EFFECT_ESCAPE   = 0;
Game_Action.HITTYPE_CERTAIN         = 0;
Game_Action.HITTYPE_PHYSICAL        = 1;
Game_Action.HITTYPE_MAGICAL         = 2;

Game_Action.prototype.initialize = function(subject, forcing,type) {
    this._subject = subject;
    this._forcing = forcing || false;
    this._type = type;
    this.clear();
};

Game_Action.prototype.clear = function() {
    this._item = new Game_Item();
    this._results = [];
    this._targetIndex = -1;
    this._counter = false;
};

Game_Action.prototype.subject = function() {
    return this._subject;
};

Game_Action.prototype.friendsUnit = function() {
    return this.subject().friendsUnit();
};

Game_Action.prototype.opponentsUnit = function() {
    return this.subject().opponentsUnit();
};

Game_Action.prototype.setAttack = function() {
    this.setSkill(this.subject().attackSkillId());
};

Game_Action.prototype.setGuard = function() {
    this.setSkill(this.subject().guardSkillId());
};

Game_Action.prototype.setSkill = function(skillId) {
    this._item.setObject($dataSkills[skillId]);
};

Game_Action.prototype.setItem = function(itemId) {
    this._item.setObject($dataItems[itemId]);
};

Game_Action.prototype.setItemObject = function(object) {
    this._item.setObject(object);
};

Game_Action.prototype.setTarget = function(targetIndex) {
    this._targetIndex = targetIndex;
};

Game_Action.prototype.item = function() {
    return this._item.object();
};

Game_Action.prototype.isSkill = function() {
    return this._item.isSkill();
};

Game_Action.prototype.isItem = function() {
    return this._item.isItem();
};

Game_Action.prototype.numRepeats = function() {
    var repeats = this.item().repeats;
    if (this.isAttack()) {
        repeats += this.subject().attackTimesAdd();
    }
    return Math.floor(repeats);
};

Game_Action.prototype.checkItemScope = function(list) {
    return list.contains(this.item().scope);
};

Game_Action.prototype.isForOpponent = function() {
    return this.checkItemScope([1, 2, 3, 4, 5, 6]);
};
Game_Action.prototype.isForFriend = function() {
    return this.checkItemScope([7, 8, 9, 10, 11, 12, 13, 14]);
};

Game_Action.prototype.isForEveryone = function() {
    return this.checkItemScope([14]);
};

Game_Action.prototype.isForAliveFriend = function() {
    return this.checkItemScope([7, 8, 11, 14]);
};

Game_Action.prototype.isForDeadFriend = function() {
    return this.checkItemScope([9, 10]);
};

Game_Action.prototype.isForUser = function() {
    return this.checkItemScope([11]);
};

Game_Action.prototype.isForOne = function() {
    return this.checkItemScope([1, 3, 7, 9, 11]);
};

Game_Action.prototype.isForRandom = function() {
    return this.checkItemScope([3, 4, 5, 6]);
};

Game_Action.prototype.isForAll = function() {
    return this.checkItemScope([2, 8, 10]);
};

Game_Action.prototype.isLine = function() {
    return this.item().line;
};

Game_Action.prototype.needsSelection = function() {
    return this.checkItemScope([1, 7, 9]);
};

Game_Action.prototype.numTargets = function() {
    return this.isForRandom() ? this.item().scope - 2 : 0;
};

Game_Action.prototype.checkDamageType = function(list) {
    return list.contains(this.item().damage.type);
};

Game_Action.prototype.isHpEffect = function() {
    return this.checkDamageType([1, 3, 5]);
};

Game_Action.prototype.isMpEffect = function() {
    return this.checkDamageType([2, 4, 6]);
};

Game_Action.prototype.isDamage = function() {
    return this.checkDamageType([1, 2]);
};

Game_Action.prototype.isRecover = function() {
    return this.checkDamageType([3, 4]);
};

Game_Action.prototype.isDrain = function() {
    return this.checkDamageType([5, 6]);
};

Game_Action.prototype.isHpRecover = function() {
    return this.checkDamageType([3]);
};

Game_Action.prototype.isMpRecover = function() {
    return this.checkDamageType([4]);
};

Game_Action.prototype.isCertainHit = function() {
    return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
};

Game_Action.prototype.isPhysical = function() {
    return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
};

Game_Action.prototype.isMagical = function() {
    return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
};

Game_Action.prototype.isAttack = function() {
    return this.item() === $dataSkills[this.subject().attackSkillId()];
};

Game_Action.prototype.isGuard = function() {
    return this.item() === $dataSkills[this.subject().guardSkillId()];
};

Game_Action.prototype.isMagicSkill = function() {
    if (this.isSkill()) {
        return $dataSystem.magicSkills.contains(this.item().stypeId);
    } else {
        return false;
    }
};

Game_Action.prototype.decideRandomTarget = function() {
    var target;
    if (this.isForDeadFriend()) {
        target = this.friendsUnit().randomDeadTarget();
    } else if (this.isForFriend()) {
        target = this.friendsUnit().randomTarget();
    } else {
        target = this.opponentsUnit().randomTarget();
    }
    if (target) {
        this._targetIndex = target.index();
    } else {
        this.clear();
    }
};

Game_Action.prototype.setConfusion = function() {
    this.setAttack();
};

Game_Action.prototype.prepare = function() {
    if (this.subject().isConfused() && !this._forcing) {
        this.setConfusion();
    }
};

Game_Action.prototype.isValid = function() {
    return (this._forcing && this.item()) || this.subject().canUse(this.item());
};

Game_Action.prototype.makeTargets = function() {
    let targets = [];
    if (!this._forcing && this.subject().isConfused()) {
        targets.push(this.confusionTarget());
    } else if (this.isForEveryone()) {
        targets.push(...this.targetsForEveryone());
    } else if (this.isForOpponent()) {
        targets.push(...this.targetsForOpponents());
    } else if (this.isForFriend()) {
        targets.push(...this.targetsForFriends());
    }
    if (this.item() && this.isForOpponent()){
        const _range = this.item().range;
        if (this.subject().isActor()){
            targets = targets.filter(a => (a.line() - _range) <= 0);
        } else{
            targets = targets.filter(a => (this.subject().line() - _range) <= 0);
        }
    }
    return this.repeatTargets(targets);
};

Game_Action.prototype.repeatTargets = function(targets) {
    var repeatedTargets = [];
    var repeats = this.numRepeats();
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        if (target) {
            for (var j = 0; j < repeats; j++) {
                repeatedTargets.push(target);
            }
        }
    }
    return repeatedTargets;
};

Game_Action.prototype.confusionTarget = function() {
    switch (this.subject().confusionLevel()) {
    case 1:
        return this.opponentsUnit().randomTarget();
    case 2:
        if (Math.randomInt(2) === 0) {
            return this.opponentsUnit().randomTarget();
        }
        return this.friendsUnit().randomTarget();
    default:
        return this.friendsUnit().randomTarget();
    }
};

Game_Action.prototype.targetsForOpponents = function() {
    let targets = [];
    let unit = this.opponentsUnit();

    //対象全体化
    if (this.subject().isStateAffected($gameStateInfo.getStateId(StateType.ALL_ATTACK))){
        if (this.isForDeadFriend()){
            targets = unit.deadMembers();
        } else{
            targets = unit.aliveMembers();
        }
        return targets;
    }

    if (this.isForRandom()) {
        for (var i = 0; i < this.numTargets(); i++) {
            targets.push(unit.randomTarget());
        }
    } else if (this.item().line) {
        const _target = unit.smoothTarget(this._targetIndex);
        const _line = _target._line;
        unit.aliveMembers().forEach(member => {
            if (member._line == _line){
                targets.push(member);
            }
        });
    } else if (this.isForOne()) {
        if (this._targetIndex < 0) {
            const skill = this.item();
            let isMpDamageState = _.find(skill.effects,(a) => a.code == Game_Action.EFFECT_ADD_STATE && a.dataId == $gameStateInfo.getStateId(StateType.MP_DAMAGE));
            if (isMpDamageState){
                // 最もMP回復に効果がある対象を指定
                targets.push(unit.randomMpDamageTarget());
            }
            //ステートの重複を避ける
            while (targets.length == 0){
                targets.push(unit.randomTarget());
                let state = _.find(this._item.object().effects,(a) => a.code == Game_Action.EFFECT_ADD_STATE );
                if (state){
                    targets =_.filter(targets,function(t){
                        return !t.isStateAffected(state.dataId)
                    })
                }
            }
        } else {
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    } else {
        targets = unit.aliveMembers();
    }
    return targets;
};

Game_Action.prototype.targetsForFriends = function() {
    let targets = [];
    let unit = this.friendsUnit();

    //対象全体化
    if (this.subject().isStateAffected($gameStateInfo.getStateId(StateType.ALL_ATTACK))){
        if (this.isForDeadFriend()){
            targets = unit.deadMembers();
        } else{
            targets = unit.aliveMembers();
        }
        return targets;
    }
    
    if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        if (this.isForOne()) {
            targets.push(unit.smoothDeadTarget(this._targetIndex));
        } else {
            targets = unit.deadMembers();
        }
    } else if (this.isForOne()) {
        if (this._targetIndex < 0) {
            const skill = this.item();
            // 回復のターゲットに効果なしの場合を含めない
            if ([3].contains(skill.damage.type)) {
                targets.push(unit.randomHpTarget());
            } else if ([4].contains(skill.damage.type)) {
                // 最もMP回復に効果がある対象を指定
                targets.push(unit.randomMpTarget());
            } else{
                targets.push(unit.randomTarget());
            }
        } else {
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    } else {
        targets = unit.aliveMembers();
    }
    return targets;
};

Game_Action.prototype.evaluate = function() {
    var value = 0;
    this.itemTargetCandidates().forEach(function(target) {
        var targetValue = this.evaluateWithTarget(target);
        if (this.isForAll()) {
            value += targetValue;
        } else if (targetValue > value) {
            value = targetValue;
            this._targetIndex = target.index();
        }
    }, this);
    value *= this.numRepeats();
    if (value > 0) {
        value += Math.random();
    }
    return value;
};

Game_Action.prototype.itemTargetCandidates = function() {
    if (!this.isValid()) {
        return [];
    } else if (this.isForOpponent()) {
        return this.opponentsUnit().aliveMembers();
    } else if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        return this.friendsUnit().deadMembers();
    } else {
        return this.friendsUnit().aliveMembers();
    }
};

Game_Action.prototype.evaluateWithTarget = function(target) {
    if (this.isHpEffect()) {
        var value = this.makeDamageValue(target, false);
        if (this.isForOpponent()) {
            return value / Math.max(target.hp, 1);
        } else {
            var recovery = Math.min(-value, target.mhp - target.hp);
            return recovery / target.mhp;
        }
    }
};

Game_Action.prototype.testApply = function(target) {
    return true;
    return (this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() || this.isForOpponent() ||
            (this.isHpRecover() && target.hp < target.mhp) ||
            (this.isMpRecover() && target.mp < target.mmp) ||
            (this.hasItemAnyValidEffects(target))));
};

Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    return this.item().effects.some(function(effect) {
        return this.testItemEffect(target, effect);
    }, this);
};

Game_Action.prototype.testItemEffect = function(target, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_RECOVER_HP:
        return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
    case Game_Action.EFFECT_RECOVER_MP:
        return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
    case Game_Action.EFFECT_ADD_STATE:
        return !target.isStateAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_STATE:
        return target.isStateAffected(effect.dataId);
    case Game_Action.EFFECT_LEARN_SKILL:
        return !target.isLearnedSkill(effect.dataId); //target.isActor() && !target.isLearnedSkill(effect.dataId);
    default:
        return true;
    }
};

Game_Action.prototype.itemCnt = function(target) {
    if (this.isPhysical() && target.canMove()) {
        return target.cnt;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemMrf = function(target) {
    if (this.isMagical()) {
        return target.mrf;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemHit = function(target) {
    const successRate = this.item().successRate;
    // 暗闇計算
    const subject = this.subject();
    const blindId = $gameStateInfo.getStateId(StateType.BLIND);
    let hitRate = subject.hit;
    if (subject.isStateAffected(blindId)){
        hitRate -= subject.getStateEffect(blindId) * 0.01;
    }
    // 回避計算
    const evaId = $gameStateInfo.getStateId(StateType.EVA_BUFF_RATE);
    let evaRate = subject.eva;
    if (target && target.isStateAffected(evaId)){
        evaRate += target.getStateEffect(evaId) * 0.01;
    }
    return (1 + (hitRate) - (evaRate)) * successRate * 0.01;
};

Game_Action.prototype.itemEva = function(target) {
    if (this.isPhysical()) {
        return target.eva;
    } else if (this.isMagical()) {
        return target.mev;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemCri = function(target) {
    var value = 0;
    var critcalStateId = $gameStateInfo.getStateId(StateType.CRITICAL_BUFF_ADD);
    if (this.subject().isStateAffected(critcalStateId)){
        value += this.subject().getStateEffect(critcalStateId) * 0.01;
    }
    let _targetCev = 1;
    if (target){
        _targetCev -= target.cev;
    }
    return this.item().damage.critical ? (this.subject().cri + value) * _targetCev : 0;
};

Game_Action.prototype.results = function() {
    return this._results;
};

Game_Action.prototype.makeActionResult = function() {
    const _targets = this.makeTargets();
    _targets.forEach((target,index) => {
        this.makeResult(target,_targets.length-1 == index);
    });
}

/**
 * 行動結果を生成
 */
Game_Action.prototype.makeResult = function(target,lastTarget) {
    let result = new Game_ActionResult();
    // 有効判定
    result.used = this.testApply(target);
    // 命中判定
    result.missed = result.used && (Math.random() >= this.itemHit(target));
    if (this.isCertainHit()){
        result.missed = false;
    }

    // 攻撃対象設定
    this.makeResultTarget(result,target);
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = (Math.random() < this.itemCri(result.target));
            let value = this.makeDamageValue(result.target, result.critical);
            if (this.isHpEffect()) {
                this.makeHpDamage(result,result.target,value,lastTarget);
                // 属性判定
                var elementValue = this.calcElementRate(result.target);
                if (elementValue > 1 && result.hpDamage > 0){
                    result.weakness = true;
                }
                // ダメージシールド
                let damageShieldId = $gameStateInfo.getStateId(StateType.SHIELD);
                let shieldValue = target.getStateEffectTotal(damageShieldId);
                if (shieldValue > 0){
                    let state = target.getStateData(damageShieldId);
                    state._effect -= result.hpDamage;
                    result.hpDamage -= shieldValue;
                    result.hpDamage = Math.max(0,result.hpDamage);
                    if (state._effect <= 0){
                        result.target.removeState(damageShieldId);
                    }
                }
                // 手加減
                this.makeResultHoldOn(result);
                // 起死回生
                this.makeResultKishikaisei(result);
                // バニッシュ
                this.makeResultBanish(result);
                // インビジブル
                this.makeResultInvisible(result);

                let tempHpDamage = 0;
                this._results.forEach(res => {
                    if (res.target == result.target){
                        tempHpDamage += res.hpDamage;
                    }
                });
                if (result.target){
                    if (result.target.hp <= (result.hpDamage + tempHpDamage)){
                        result.isDead = true;
                    }
    
                    if (result.target.isGuard() && result.hpDamage > 0){
                        result.guard = true;
                    }

                }
            }
            if (this.isMpEffect()) {
                this.makeMpDamage(result,result.target, value);
            }
        }
    }
    let number = _.filter(this._results,(r) => r.target == target);
    if (number.length >= 1){
        result.length = number.length + 1;
    }
    this._results.push(result);
    // 反ダメージ判定
    this.makeResultReDamage(result);
};

Game_Action.prototype.makeResultReDamage = function(result) {
    const redamageId = $gameStateInfo.getStateId(StateType.REDAMAGE);
    if (result.target.isStateAffected(redamageId)){
        if (result.isDead == false && result.hpDamage > 0 && result.isHit()){
            const effect = result.target.getStateEffect(redamageId);
            const damage = Math.round( result.hpDamage * effect );
            if (damage > 0){
                result.reDamage = damage;
            }
        }
    }
}

Game_Action.prototype.makeResultTarget = function(result,target) {
    result.target = target;

    // かばう人がいる
    var unit = this.opponentsUnit().aliveMembers();
    unit.forEach(member => {
        if (member != target){
            if (member.isStateAffected($gameStateInfo.getStateId(StateType.SUBSTITUTE))){
                if (this.isHpEffect() && this.isForOne() && this.isDamage()){
                    result.target = member;
                    result.substitutedTarget = target;
                }
            }
        }
    });
}

Game_Action.prototype.makeResultHoldOn = function(result) {
    let isHoldOn = false;
    const holdOnId = $gameStateInfo.getStateId(StateType.HOLD_ON);
    if (this.subject().isStateAffected(holdOnId)){
        isHoldOn = true;
    }

    if (isHoldOn){
        // 累計ダメージ
        var tempHpDamage = 0;
        this._results.forEach(res => {
            if (res.target == result.target){
                tempHpDamage += res.hpDamage;
            }
        });

        if (result.target.hp <= (result.hpDamage + tempHpDamage)){
            result.hpDamage = (result.target.hp - tempHpDamage) - 1;
            result.holdon = true;
        }
    }
}

Game_Action.prototype.makeResultKishikaisei = function(result) {
    let isKishikaisei = false;
    const kishikaiseiId = $gameStateInfo.getStateId(StateType.KISHIKAISEI);
    if (result.target && result.target.isStateAffected(kishikaiseiId)){
        isKishikaisei = true;
    }

    if (isKishikaisei){
        // 累計ダメージ
        var tempHpDamage = 0;
        this._results.forEach(res => {
            if (res.target == result.target){
                tempHpDamage += res.hpDamage;
            }
        });

        if (result.target.hp <= (result.hpDamage + tempHpDamage)){
            result.hpDamage = (result.target.hp - tempHpDamage) - 1;
            result.kishikaisei = true;
            result.pushRemovedState($gameStateInfo.getStateId(StateType.KISHIKAISEI));
        }
    }
}

Game_Action.prototype.makeResultBanish = function(result) {
    const banishId = $gameStateInfo.getStateId(StateType.BANISH);
    if (result.target && result.target.isStateAffected(banishId)){
        let stateData = result.target.getStateData(banishId);
        // 累計ダメージ
        let tempHpDamage = 0;
        this._results.forEach(res => {
            if (res.target == result.target){
                tempHpDamage += res.hpDamage;
            }
        });

        if (result.target.hp <= (result.hpDamage + tempHpDamage) && stateData){
            result.hpDamage = (result.target.hp - tempHpDamage) - 1;
            result.banish = true;
            result.target.removeState(banishId,result.target.battlerId(),-1);
        }
    }
}

Game_Action.prototype.makeResultInvisible = function(result) {
    const invisibleId = $gameStateInfo.getStateId(StateType.INVISIBLE);
    if (result.target && result.target.isStateAffected(invisibleId) && result.hpDamage > 0){ 
        if (result.target.getStateEffect(invisibleId) > 0){
            let stateData = result.target.getStateData(invisibleId);
            if (stateData){
                stateData._effect -= 1;
            }
            if (stateData.effect <= 0){
                result.target.removeState(invisibleId);
            }        
            result.hpDamage = 0;
            result.invisible = true;
        }
    }
}

Game_Action.prototype.makeHpDamage = function(result, target, value,lastTarget) {
    const subject = this.subject();
    //チャージダメージ
    const chargeId = $gameStateInfo.getStateId(StateType.CHARGE);
    const isForAll = this.isForAll();
    if (value > 0 && subject.isStateAffected(chargeId)){
        value += subject.getStateEffectTotal(chargeId);
        if (isForAll){
            if (lastTarget){
                subject.removeState(chargeId);
                result.chargeAttack = true;
            }
        } else{
            subject.removeState(chargeId);
            result.chargeAttack = true;
        }
    }

    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    result.hpDamage = value;
    //フロストウォール
    const damageCutId = $gameStateInfo.getStateId(StateType.DAMAGE_CUT);
    if (value > 0 && target && target.isStateAffected(damageCutId)){
        result.hpDamage -= target.getStateEffectTotal(damageCutId);
        if (result.hpDamage < 1){
            result.hpDamage = 1;
            result.damageBlock = true;
        }
        const stateDataList = target.getStateDataAll(damageCutId);
        stateDataList.forEach(stateData => {
            if (!stateData.passive){
                result.pushRemovedState(damageCutId);
            }
        });
    }
    // 凍結1.5倍ダメージ
    if (value > 0 && target && target.isStateAffected($gameStateInfo.getStateId(StateType.FROZEN))){
        result.hpDamage = Math.round( result.hpDamage * $gameDefine.frozenDamageRate );
        result.pushRemovedState($gameStateInfo.getStateId(StateType.FROZEN));
    }
    // 状態異常特攻
    const _antiVaccinationId = $gameStateInfo.getStateId(StateType.ANTI_VACCINATION);
    if (value > 0 && this.subject().isStateAffected(_antiVaccinationId)){
        for (let i = 4;i <= 11;i++){
            if (target.isStateAffected(i)){
                result.hpDamage = Math.round( result.hpDamage * this.subject().getStateEffectTotal(_antiVaccinationId) );
                break;
            }
        }
    }
    // Hp消費
    const _hpConsumeId = $gameStateInfo.getStateId(StateType.HP_CONSUME);
    if (value > 0 && this.isContainsState(_hpConsumeId)){
        const consume = this.item().stateEffect;
        if (this.subject().hp > consume){
            this.subject().gainHp(consume * -1);
            result.hpDamage += consume;
        }
    }
};

Game_Action.prototype.makeMpDamage = function(result,target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    
    result.mpDamage = value;
    result.mpAffected = true;
    //呪い
    if (target && target.isStateAffected($gameStateInfo.getStateId(StateType.CURSE))){
        result.mpDamage = 0;
        result.mpAffected = false;
    }
};

Game_Action.prototype.apply = function(target) {
    var result = target.result();
    if (!result.missed) {
        if (this.item().damage.type > 0) {
            this.executeDamage(target);
        }
        this.item().effects.forEach(function(effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};

Game_Action.prototype.applyResult = function(target,result) {
    if (result.missed) {
        return;
    }
    if (this.item().damage.type > 0) {
        this.executeDamage(result);
    }
    this.item().effects.forEach(function(effect) {
        this.applyItemEffect(result, effect);
    }, this);
    this.applyItemUserEffect(target);
};

Game_Action.prototype.makeDamageValue = function(target, critical,isVariable = true) {
    const item = this.item();
    const subject = this.subject();
    //baseValueはGUI上の数値
    let baseValue = this.evalDamageFormula(target);
    if (baseValue < 0) {
        if (this.isHpRecover()){
            const phaId = $gameStateInfo.getStateId(StateType.PHARMACOLOGY);
            let phaEffect = 1;
            if (subject.isStateAffected(phaId)){
                phaEffect += subject.getStateEffectTotal(phaId);
            }
            baseValue = Math.floor(target.mhp * baseValue * phaEffect * 0.01);
            //回復効果量
            baseValue *= target.rec;
        }
        if (this.isMpRecover()){

        }
        return baseValue;
    }
    
    baseValue += subject.damageRate();
    let defValue = target.def;
    const berserkId = $gameStateInfo.getStateId(StateType.BERSERK);
    if (target.isStateAffected(berserkId)){
        defValue = 0;
    }
    const penetrateId = $gameStateInfo.getStateId(StateType.PENETRATE);
    if (this.subject().isStateAffected(penetrateId)){
        defValue = 0;
    }
    baseValue = Math.max(0, baseValue * 0.01 * subject.atk - defValue);
    let elementValue = this.calcElementRate(target);
    let value = baseValue * elementValue;
    if (this.isMagical()) {
        value *= target.pdr;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    if (isVariable){
        value = this.applyVariance(value, item.damage.variance);
    }
    value = this.applyGuard(value, target);
    value = Math.round(value);
    if (value == 0){
        value = 1;
    }
    return value;
};

Game_Action.prototype.evalDamageFormula = function(target) {
    try {
        const item = this.item();
        const a = this.subject(); // eslint-disable-line no-unused-vars
        const b = target; // eslint-disable-line no-unused-vars
        const v = $gameVariables._data; // eslint-disable-line no-unused-vars
        const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
        const value = Math.max(eval(item.damage.formula), 0) * sign;
        return isNaN(value) ? 0 : value;
    } catch (e) {
        return 0;
    }
};

Game_Action.prototype.calcElementRate = function(target) {
    if (target == null) return 1;
    const _elementId = this.item().damage.elementId;
    if (_elementId < 0) {
        return this.elementsMaxRate(target, this.subject().attackElements());
    } else {
        if (this.subject().isActor()){
            const _alchemyParam = this.subject().alchemyParam();
            return target.elementRate(_elementId) * (_alchemyParam[_elementId-1] * 0.01);
        }
        return target.elementRate(_elementId);
    }
};

Game_Action.prototype.elementsMaxRate = function(target, elements) {
    if (elements.length > 0) {
        return Math.max.apply(null, elements.map(function(elementId) {
            return target.elementRate(elementId);
        }, this));
    } else {
        return 1;
    }
};

Game_Action.prototype.applyCritical = function(damage) {
    return damage * 1.5;
};

Game_Action.prototype.applyVariance = function(damage, variance) {
    var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
    var v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    return damage >= 0 ? damage + v : damage - v;
};

Game_Action.prototype.applyGuard = function(damage, target) {
    /*
    const penetrateId = $gameStateInfo.getStateId(StateType.PENETRATE);
    if (damage > 0 && target.isGuard() && !this.subject().isStateAffected(penetrateId)){
        const ironwillId = $gameStateInfo.getStateId(StateType.IRON_WILL);
        if (target && target.isStateAffected(ironwillId)){
            damage -= target.getStateEffectTotal(ironwillId);
        }
        return Math.max(damage - target.def,1);
    }
    */
    return damage;
};

Game_Action.prototype.executeDamage = function(result) {
    if (this.isHpEffect()) {
        this.executeHpDamage(result);
        this.executeRpDamage(this.subject(), result.reDamage);
    } else
    if (this.isMpEffect()) {
        this.executeMpDamage(result.target, result.mpDamage);
    }
};

Game_Action.prototype.executeHpDamage = function(result) {
    if (result.target == null) return;
    let target = result.target;
    let value = result.hpDamage;
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    target.gainHp(-value);
    this.subject().gainAddDamage(value);
    if (value > 0) {
        let removeStateIds = target.onDamage();
        removeStateIds.forEach(removeStateId => {
            result.pushRemovedState(removeStateId);
        });
    }
    this.gainDrainedHp(target.hp,value);
};

Game_Action.prototype.executeMpDamage = function(target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    if (value !== 0) {
    }
    target.gainMp(-value);
    this.gainDrainedMp(value);
};

Game_Action.prototype.executeRpDamage = function(target, value) {
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    target.gainHp(-value);
    this.subject().gainAddDamage(value);
    this.gainDrainedHp(target.hp,value);
};

Game_Action.prototype.gainDrainedHp = function(targetHp,value) {
    let drainValue = Math.min(targetHp,value);
    const _damageDrainId = $gameStateInfo.getStateId(StateType.DAMAGE_DRAIN);
    if (this.subject().isStateAffected(_damageDrainId)){
        const _effect = this.subject().getStateEffectTotal(_damageDrainId);
        this.subject().gainHp(Math.floor(drainValue * 0.01 * _effect * (this.subject().hrg + 1.0)));
    }
    
    /*
    const _drainHealId = $gameStateInfo.getStateId(StateType.DRAIN_HEAL);
    if (this.isContainsState(_drainHealId)){
        const _effect = this.item().stateEffect;
        this.subject().gainHp(Math.floor(drainValue * 0.01 * _effect * (this.subject().hrg + 1.0)));
    }
    */
    //if (this.isDrain()) {

        /*
        var value = this.item().mpCost * 10;
        $gameParty.members().forEach(actor => {
            if (actor.isAlive()){
                actor.gainHp(Math.floor(value * 0.01 * actor.mhp * (actor.hrg + 1.0)));
            }
        });
        */
       //var gainTarget = this.subject();
       //if (this._reflectionTarget !== undefined) {
            //gainTarget = this._reflectionTarget;
        //}
       //gainTarget.gainHp(value);
    //}
};

Game_Action.prototype.gainDrainedMp = function(value) {
    if (this.isDrain()) {
       var gainTarget = this.subject();
       if (this._reflectionTarget !== undefined) {
           gainTarget = this._reflectionTarget;
       }
       gainTarget.gainMp(value);
    }
};

Game_Action.prototype.applyItemEffect = function(result, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_RECOVER_HP:
        this.itemEffectRecoverHp(result.target, effect);
        break;
    case Game_Action.EFFECT_RECOVER_MP:
        this.itemEffectRecoverMp(result, effect);
        break;
    case Game_Action.EFFECT_GAIN_TP:
        this.itemEffectGainTp(result, effect);
        break;
    case Game_Action.EFFECT_ADD_STATE:
        this.itemEffectAddState(result, effect);
        break;
    case Game_Action.EFFECT_REMOVE_STATE:
        this.itemEffectRemoveState(result, effect);
        break;
    case Game_Action.EFFECT_SPECIAL:
        this.itemEffectSpecial(result, effect);
        break;
    case Game_Action.EFFECT_GROW:
        this.itemEffectGrow(result, effect);
        break;
    case Game_Action.EFFECT_LEARN_SKILL:
        this.itemEffectLearnSkill(result, effect);
        break;
    case Game_Action.EFFECT_COMMON_EVENT:
        this.itemEffectCommonEvent(result, effect);
        break;
    }
};

Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
    var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        if (target.hp + value <= 0){
            value = (target.hp - 1) * -1;
        }
        target.gainHp(value);
    }
};

Game_Action.prototype.itemEffectRecoverMp = function(result, effect) {
    var value = (result.target.mmp * effect.value1 + effect.value2) * result.target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        result.target.gainMp(value);
    }
};

Game_Action.prototype.itemEffectGainTp = function(target, effect) {
    var value = Math.floor(effect.value1);
    if (value !== 0) {
        target.gainTp(value);
    }
};

Game_Action.prototype.itemEffectAddState = function(result, effect) {
    if (effect.dataId === 0) {
        this.itemEffectAddAttackState(result, effect);
    } else {
        this.itemEffectAddNormalState(result, effect);
    }
};

Game_Action.prototype.itemEffectAddAttackState = function(target, effect) {
    this.subject().attackStates().forEach(function(stateId) {
        var chance = effect.value1;
        chance *= target.stateRate(stateId);
        chance *= this.subject().attackStatesRate(stateId);
        if (Math.random() < chance) {
            target.addState(stateId);
        }
    }.bind(this), target);
};

Game_Action.prototype.itemEffectAddNormalState = function(result, effect) {
    // 状態異常カウンター判定
    const restrictionId = $gameStateInfo.getStateId(StateType.RESTRICTION);
    if (result.target && result.target.isStateAffected(restrictionId)){
        if (!this.subject().isStateResist(effect.dataId)){
            this.subject().addState(effect.dataId,this.item().stateTurns,this.item().stateEffect,false,this.subject().battlerId());
            result.pushRestrictedState(effect.dataId);
        }
    }
    if (result.target && result.target.isStateResist(effect.dataId)){
        // バリア判定
        const barrierId = $gameStateInfo.getStateId(StateType.BARRIER);
        if (result.target.isStateAffected(barrierId)){
            result.barriered = true;
        }
        result.pushResistedState(effect.dataId);
        return;
    }
    // 即死判定
    if (this.isStateInstantDeathResist(result,effect)){
        result.pushAddedState(effect.dataId);
        return;
    }
    let chance = effect.value1;
    if (!this.isCertainHit()) {
        chance *= result.target.stateRate(effect.dataId);
    }
    if (Math.random() < chance) {
        result.pushAddedState(effect.dataId);
    } else{
        result.pushResistedState(effect.dataId);
    }
};

Game_Action.prototype.isStateInstantDeathResist = function(result, effect) {
    const instantDeathId = $gameStateInfo.getStateId(StateType.INSTANT_DEATH);
    if (instantDeathId == effect.dataId){
        const deathId = $gameStateInfo.getStateId(StateType.DEATH);
        result.pushAddedState(deathId);
        return true;
    }
    return false;
}

Game_Action.prototype.itemEffectRemoveState = function(result, effect) {
    var chance = effect.value1;
    if (Math.random() < chance) {
        if (result.target && result.target.isStateAffected(effect.dataId)) {
            result.pushRemovedState(effect.dataId);
        }
    }
};

Game_Action.prototype.itemEffectSpecial = function(target, effect) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        target.escape();
    }
};

Game_Action.prototype.itemEffectGrow = function(result, effect) {
    result.target.addParam(effect.dataId, Math.floor(effect.value1));
};

Game_Action.prototype.itemEffectLearnSkill = function(result, effect) {
    if (result.target.isActor()) {
        result.target.learnSkill(effect.dataId);
    } else{
        if (!_.find(result.target._actionList,(action) => action.skillId == effect.dataId)){
            result.target._actionList.push(
                { 
                    conditionParam1: 0,
                    conditionParam2: 0,
                    conditionType: 0,
                    rating:1,
                    skillId:effect.dataId
                }
            );
        }
    }
};

Game_Action.prototype.itemEffectCommonEvent = function(target, effect) {
};

Game_Action.prototype.applyItemUserEffect = function(target) {
    var value = Math.floor(this.item().tpGain * this.subject().tcr);
    this.subject().gainSilentTp(value);
};

Game_Action.prototype.applyGlobal = function() {
    this.item().effects.forEach(function(effect) {
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    }, this);
};
Game_Action.prototype.isContainsState = function(stateId) {
    const item = this._item.object().effects;
    return _.find(item,(a) => a.code == Game_Action.EFFECT_ADD_STATE && a.dataId == stateId);
}

Game_Action.prototype.isContainsEffects = function(effectId) {
    return _.find(this.item().effects,(e) => e.code == effectId);
}

Game_Action.prototype.isAddState = function(stateId) {
    return _.find(this._result.addedStates,(s) => s == stateId);
}

// リザルトをカウンターにする
Game_Action.prototype.setCounter = function() {
    this._counter = true;
}
// リザルトをカウンターにする
Game_Action.prototype.counter = function() {
    return this._counter;
}

// リザルトがカウンターだった
Game_Action.prototype.setCountered = function() {
    this._countered = true;
}

Game_Action.prototype.countered = function() {
    return this._countered;
}

// リザルトをカウンターにする
Game_Action.prototype.setMadness = function() {
    this._madness = true;
}
// リザルトをカウンターにする
Game_Action.prototype.madness = function() {
    return this._madness;
}

Game_Action.prototype.popupData = function(actor) {
    if (this._results == null){
        return null;
    }
    if (this._results.length == 0){
        return null;
    }
    let popup = [];
    let results = this.results();
    let data = $dataSkills[this.item().id];
    results.forEach(result => {
        // ステート解除
        const removeStates = result.removedStateObjects();
        if (removeStates){
            removeStates.forEach(state => {
                if (state.iconIndex > 0 && result.target && result.target.isStateAffected(state.id)){
                    popup.push(new PopupTextData(result.target,PopupTextType.RemoveState,TextManager.getStateName(state.id)));
                }
            });
        }
        const chargeId = $gameStateInfo.getStateId(StateType.CHARGE);
        // ステート付与
        var addStates = result.addedStateObjects();
        if (addStates){
            addStates.forEach(state => {
                if (state.iconIndex > 0 && state.id != chargeId){
                    popup.push(new PopupTextData(result.target,PopupTextType.AddState,TextManager.getStateName(state.id)));
                }
                if (state.id == chargeId){
                    popup.push(new PopupTextData(result.target,PopupTextType.Charge,TextManager.getStateName(state.id) + "+" + data.stateEffect));
                }
            });
        }
        // ステート無効
        var resitStates = result.resistStateObjects();
        if (resitStates){
            resitStates.forEach(state => {
                if (state.iconIndex > 0 && state.id != $gameStateInfo.getStateId(StateType.CHARGE)){
                    popup.push(new PopupTextData(result.target,PopupTextType.ResistState,TextManager.getStateName(state.id)));
                }
            });
        }
        // 状態異常カウンター
        var restrictStates = result.restrictStateObjects();
        if (restrictStates){
            restrictStates.forEach(state => {
                if (state.iconIndex > 0 && state.id != $gameStateInfo.getStateId(StateType.CHARGE)){
                    popup.push(new PopupTextData(this.subject(),PopupTextType.AddState,TextManager.getStateName(state.id)));
                }
            });
        }
        // MPダメージ
        const _mpDamageId = $gameStateInfo.getStateId(StateType.MP_DAMAGE);
        if (this.isContainsState(_mpDamageId)){
            popup.push(new PopupTextData(result.target,PopupTextType.Text,TextManager.getStateName(_mpDamageId) + ' ' + data.stateEffect + TextManager.getStateMessage3(_mpDamageId)));
            
        }
        // 手加減発動
        if (result.holdon){
            popup.push(new PopupTextData(result.target,PopupTextType.Text,TextManager.getStateName($gameStateInfo.getStateId(StateType.HOLD_ON))));
        }
        // 起死回生発動
        if (result.kishikaisei){
            popup.push(new PopupTextData(result.target,PopupTextType.Text,TextManager.getStateName($gameStateInfo.getStateId(StateType.KISHIKAISEI))));
        }
        // バニッシュ発動
        if (result.banish){
            popup.push(new PopupTextData(result.target,PopupTextType.RemoveState,TextManager.getStateName($gameStateInfo.getStateId(StateType.BANISH))));
        }
        // 貫通発動
        if (result.penetrate){
            popup.push(new PopupTextData(result.target,PopupTextType.Text,TextManager.getStateName($gameStateInfo.getStateId(StateType.PENETRATE))));
        }
        // チャージ攻撃発動
        if (result.chargeAttack){
            popup.push(new PopupTextData(actor,PopupTextType.RemoveState,TextManager.getStateName($gameStateInfo.getStateId(StateType.CHARGE))));
        }
        // 拘束自動解除
        var chainSelfId = $gameStateInfo.getStateId(StateType.CHAIN_SELF);
        var chainTargetId = $gameStateInfo.getStateId(StateType.CHAIN_TARGET);
        if (actor.isStateAffected(chainSelfId)){
            actor._bindBatllers.forEach(target => {
                popup.push(new PopupTextData(target,PopupTextType.RemoveState,TextManager.getStateName(chainTargetId)));
            });
        }
        // 拘束対象解除
        if (result.target.isStateAffected(chainSelfId) && result.hpDamage > 0){
            result.target._bindBatllers.forEach(target => {
                popup.push(new PopupTextData(target,PopupTextType.RemoveState,TextManager.getStateName(chainSelfId)));
            });
        }
        // 拘束を使用した本人に拘束付与
        if (this.isContainsState(chainTargetId)){
            var effects = _.every(this.results(),(r) => r.target.isStateResist(chainTargetId))
            if (!effects){
                popup.push(new PopupTextData(actor,PopupTextType.AddState,TextManager.getStateName(chainSelfId)));
            }
        }
        // 無敵発動で無敵が外れている
        if (result.invisible){
            if (!result.target.isStateAffected($gameStateInfo.getStateId(StateType.INVISIBLE))){
                popup.push(new PopupTextData(result.target,PopupTextType.RemoveState,TextManager.getStateName($gameStateInfo.getStateId(StateType.INVISIBLE))));
            }
        }
        // バリア解除
        if (result.barriered){
            result.target.removeState($gameStateInfo.getStateId(StateType.BARRIER));
            popup.push(new PopupTextData(result.target,PopupTextType.RemoveState,TextManager.getStateName($gameStateInfo.getStateId(StateType.BARRIER))));
        }
    });

    // スキル付与
    if (this.isContainsEffects(Game_Action.EFFECT_LEARN_SKILL)){
        //var effects = this.isContainsEffects(Game_Action.EFFECT_LEARN_SKILL);
        //popup.push(new PopupTextData(actor,PopupTextType.AddState,TextManager.getSkillName(effects.dataId)));
    }
    // 永続成長
    const effectGrow = Game_Action.EFFECT_GROW;
    if (this.isContainsEffects(effectGrow)){
        if (data){
            data.effects.forEach(effect => {
                if (effect.code == effectGrow){
                    popup.push(new PopupTextData(actor,PopupTextType.Grow,TextManager.param(effect.dataId)));
                }
            });
        }
    }
    
    if (data && data.selfSkill){
        this.popupSelfSkill(popup,actor,data.selfSkill);
    }


    return popup;
}

Game_Action.prototype.popupSelfSkill = function(popup,actor,skillId) {
    if (skillId == 0){
        return;
    }
    const selfSkill = $dataSkills[skillId];
    let animationId = selfSkill.animationId;
    if (selfSkill.animation > 0){
        animationId = selfSkill.animation;
    }
    let targets = [actor];
    if (selfSkill.scope == ScopeType.ALL_PARTY){
        targets = $gameParty.members();
    }
    selfSkill.effects.forEach(effect => {
        targets.forEach(target => {   
            if (effect.code == Game_Action.EFFECT_ADD_STATE){
                popup.push(new PopupTextData(target,PopupTextType.AddState,TextManager.getStateName(effect.dataId),animationId));
            }    
            if (effect.code == Game_Action.EFFECT_GROW){
                popup.push(new PopupTextData(target,PopupTextType.Grow,TextManager.param(effect.dataId),animationId));
            }
            if (effect.code == Game_Action.EFFECT_RECOVER_HP){
                if (target.hp + effect.value2 <= 0){
                    effect.value2 = (target.hp - 1) * -1;
                }
                popup.push(new PopupTextData(target,PopupTextType.Damage,effect.value2,animationId));
            }
        });
    });

}

Game_Action.prototype.resultHpDamageValue = function() {
    var value = 0;
    this._results.forEach(reselt => {
        if (reselt.hpDamage){
            value += reselt.hpDamage;
        }
    });
    return value;
}

Game_Action.prototype.damageRecordInfo = function() {
    const result = this.results();
    let targetInfo = {};
    result.forEach(res => {
        let battlerId = res.target.battlerId();
        if (!targetInfo[battlerId]){
            targetInfo[battlerId] = {index:0,damage:0};
        }

        if (res.hpDamage > 0){
            targetInfo[battlerId].index += 1;
            targetInfo[battlerId].damage += res.hpDamage;
        }
    });
    return targetInfo;
}

Game_Action.prototype.resetVantageResult = function(target) {
    const vantageId = $gameStateInfo.getStateId(StateType.VANTAGE);
    this._results.forEach(result => {
        if (result.target == target){
            if (this.item().mpCost <= target.mp){
                result.missed = false;
                result.vantageBlock = true;
                result.hpDamage = 0;
                result.weakness = false;
                result.pushRemovedState(vantageId);
            }
        }
    });
}

Game_Action.prototype.resetDischargeResult = function() {
    const dischargeId = $gameStateInfo.getStateId(StateType.DISCHARGE);
    this._results.forEach(result => {
        result.target = this.subject();
        result.pushRemovedState(dischargeId);
    });
    let tempHpDamage = 0;
    this._results.forEach(res => {
        tempHpDamage += res.hpDamage;
        res.isDead = (res.target.hp <= tempHpDamage);
    });
}

Game_Action.prototype.chargeTurn = function() {
    if (this.item() == null) return 0;
    if (this.isSkill()){
        return $dataSkills[this.item().id].chargeTurn;
    }
    return 0;
}

Game_Action.prototype.setAgi = function(agi) {
    this._agi = agi;
    if (this.item() && this.item().speed){
        this._agi += this.item().speed;
    }
}

Game_Action.prototype.agi = function() {
    return this._agi;
}