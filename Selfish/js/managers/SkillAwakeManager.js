class SkillAwakeManager {
    constructor(){
    }

    static checkSkillAwake (actor,timing,action,actionBattler) {
        let awakeList = [];
        if (!actor.isActor()){
            return awakeList;
        }
        const matchData = _.filter(this.getActorClassData(actor),(skillInfo) => {
            return skillInfo.awake && (timing == skillInfo.awake.timing);
        })
        if (matchData.length == 0){
            return awakeList;
        }
        matchData.forEach(data => {
            if (this.checkMatchData(data,actor,action,actionBattler)){
                awakeList.push(data);
            }
        });
        if (awakeList.length > 0){
            awakeList.forEach(awake => {
                actor.learnSkill(awake.skillId);
                this.learnSkillIndex(actor,awake.skillId,awake);
            });
        }
        return awakeList;
    }

    static levelUpLearnSkill(actor) {
        this.getActorClassData(actor).forEach(function(awake) {
            if (actor._level >= awake.level && !actor.isLearnedSkill(awake.skillId)) {
                actor.learnSkill(awake.skillId);
                this.learnSkillIndex(actor,awake.skillId);
            }
        }, this);
    }

    static learnSkillIndex(actor,skillId,awakeData){
        if ($dataSkills[skillId].stypeId == Game_BattlerBase.SKILL_TYPE_MAGIC){
            let learnSkillIndex = -1;   
            // 上位互換の場合は上書きする
            if (awakeData && awakeData.awake.type == 4){
                awakeData.awake.skill.forEach(skillData => {
                    if (learnSkillIndex == -1){
                    }
                });
            }
            //装備可能なら装備する
            if (learnSkillIndex == -1){
                learnSkillIndex = actor.learnSkillIndex($dataSkills[skillId].damage.elementId);
            }
            if (learnSkillIndex > -1){
                actor.changeSlotSkill(learnSkillIndex,skillId);
                // newフラグをつける
                $gameParty._newSkillIdList.push(skillId);
            }
        }
    }

    static checkMatchData(data,actor,action,actionBattler) {
        switch (data.awake.type){
            case 1: // 味方全員のHPが最大HPに満たない
            return this.checkType1(action);
            case 2: // 味方一人が暗闇か毒になる
            return this.checkType2(actor);
            case 3: // 敵のスキルに凍結付与がある
            return this.checkType3(actor,action,actionBattler);
            case 4: // 該当スキル複数のLvが～以上
            return this.checkType4(actor,action,data);
            case 5: // 自身が瀕死の状態
            return this.checkType5(actor);
            case 6: // 敵のターン数が１
            return this.checkType6();
            case 7: // 該当スキルを使用する敵を撃破
            return this.checkType7(data);
            case 8: // イベント取得
            return false;
            case 9: // 該当スキル複数のLvが～以上
            return this.checkType9(actor,data);
            case 10: // 誰かがチェインを使用する
            return this.checkType10(action);
            case 11: // ハイアンドローを発動している状態で攻撃を受ける
            return this.checkType11(actor,action,data);
            case 12: // 生還後(stage15クリア)、自身が瀕死になる攻撃を受けた時
            return this.checkType12(actor,action,actionBattler);
            case 13: // ダメージカットしている敵に攻撃をした時
            return this.checkType13(actor);
            case 14: // ジャストガードを累計でn回成功した時
            return this.checkType14(data.awake.value);
        }
    }

    static checkType1(action) {
        const skill = $dataSkills[action.item().id];
        if (skill.damage.type <= 0){
            return false;
        }
        const member = $gameParty.battleMembers();
        return _.every(member,(m) =>  m.hp < m.mhp);
    }

    static checkType2(actor) {
        if (actor && !actor.canMove()){
            return null;
        }
        const member = $gameParty.battleMembers();
        const aFlag = _.find(member,(m) => m.isStateAffected($gameStateInfo.getStateId(StateType.BLIND)) || m.isStateAffected($gameStateInfo.getStateId(StateType.POISON)));
        if (aFlag){
            return aFlag;
        }
        const bFlag = _.find(member,(m) => m.isStateAffected($gameStateInfo.getStateId(StateType.STUN)));
        if (bFlag){
            if (actor != bFlag){
                return bFlag;
            }
        }
        return null;
    }

    static checkType3(actor,action,actionBattler) {
        if (action != null && actor != null && !actionBattler.isActor()){
            if (action.isContainsState($gameStateInfo.getStateId(StateType.FROZEN))){
                return actor;
            }
        }
        
        return null;
    }

    static checkType4(actor,action,data) {
        if (!action){
            return false;
        }
        let flag = true;
        data.awake.skill.forEach(skillData => {
            if (action.item().id == skillData.id){
                if (actor.skillLevelWithoutSPAwake(skillData.id) < skillData.lv){
                    flag = false;
                }
            } else{
                if (actor.skillLevelWithoutSP(skillData.id) < skillData.lv){
                    flag = false;
                }
            }
        });
        if (action.item().damage.type != $dataSkills[data.awake.skillId].damage.type){
            //flag = false;
        }
        return flag;
    }

    static checkType5(actor) {
        return actor.isDying();
    }

    static checkType6() {
        const member = $gameTroop.members();
        return _.every(member,(m) =>  m._turnCount < 3);
    }

    static checkType7(data) {
        let flag = false;
        const member = $gameTroop.members();
        let skillIdList = [];
        member.forEach(m => {
            m._actionList.forEach(action => {
                skillIdList.push(action.skillId);
            });
        });
        data.awake.skill.forEach(skillData => {
            if (_.contains(skillIdList,skillData.id)){
                flag = true;
            }
        });
        return flag;
    }

    static checkType9(actor,data) {
        let flag = true;
        data.awake.skill.forEach(skillData => {
            if (actor.skillLevelWithoutSP(skillData.id) < skillData.lv){
                flag = false;
            }
        });
        return flag;
    }

    static checkType10(action) {
        if (!action){
            return false;
        }
        const chainStateId = $gameStateInfo.getStateId(StateType.CHAIN);
        return action.isContainsState(chainStateId);
    }

    static checkType11(actor,action,data) {
        if (action == null){
            return false;
        }
        if (!actor.isActor()){
            return false;
        }
        let flag = false;
        const target = _.find(actor._stateData,(state) => state.slotId == data.awake.skill[0].id);
        if (target != null){
            const results = action.results();
            results.forEach(result => {
                if (result.target == actor && result.hpDamage > 0){
                    flag = true;
                }
            });
            if (flag == true){
                return actor;
            }
        }
        return false;
    }
    
    static checkType12(actor,action,actionBattler){
        if (!$gameParty.hasStage(15)){
            return null;
        }
        if (action != null && actor != null && !actionBattler.isActor()){
            const results = action.results();
            let tempDamage = 0;
            let isTarget = false;
            results.forEach(result => {
                if (result.target == actor){
                    isTarget = true;
                }
                if (result.hpDamage > 0){
                    tempDamage += result.hpDamage;
                }
                if (result.discharge){
                    isTarget = true; 
                }
            });
            if (isTarget){
                if (0.25 >= ((actor.hp - tempDamage) / actor.mhp)){
                    results.forEach(result => {
                        if (result.discharge == false){
                            result.target = actionBattler;
                        }
                        result.discharge = true; // target判定用
                    });
                    return actionBattler;
                }
            }
        }
        return null;
    }

    static checkType13(actor){
        if (!actor){
            return false;
        }
        if (!actor.isActor()){
            return false;
        }
        let flag = false;
        const action = actor.currentAction();
        if (!action){
            return false;
        }
        const results = action.results();
        const guardId = $gameStateInfo.getStateId(StateType.GUARD);
        results.forEach(result => {
            if (!result.target.isActor() && result.target.isStateAffected(guardId) && result.hpDamage > 0){
                flag = true;
            }
        });
        return flag;
    }

    static checkType14(value){
        return $gameSystem.getJustGuard() >= Number(value);
    }

    static getActorClassData(actor){
        return _.filter(actor.currentClass().learnings,(lerning) => !actor.isLearnedSkill(lerning.skillId));
    }

    static isComplete(){
        let compeleted = true;
        [1,2,3,4,5].forEach(actorId => {
            let actor = $gameActors.actor(actorId);
            if (actor == null){
                compeleted = false;
            }
            if (actor && this.getActorClassData(actor).length != 0){
                compeleted = false;
            }
        });
        return compeleted;
    }
}
