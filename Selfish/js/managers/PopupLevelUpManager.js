//-----------------------------------------------------------------------------
// PopupLevelUpManager
//

function PopupLevelUpManager() {
    throw new Error('This is a static class');
}

PopupLevelUpManager.init = function() {
    this._resultWindow = null;
    this._busy = false;
    this._endCall = null;
    this._beforeMembers = [];
}

PopupLevelUpManager.setBeforeMembers = function(members) {
    this._beforeMembers = [];
    members.forEach(actor => {
        let data = {exp:actor.currentExp(),actorId:actor.actorId(),level:actor.level,awakeInfo:SkillAwakeManager.getActorClassData(actor),exp:actor.currentExp()}
        this._beforeMembers.push(data);
    });
}

PopupLevelUpManager.getChangeMembers = function(members) {
    this._displayResultData = [];
    members.forEach(after => {
        let isLevelChange = false;
        let isAwakeChange = false;
        let before = _.find(this._beforeMembers,(b) => b.actorId == after.actorId());
        if (before.level != after.level){
            isLevelChange = true;
        }
        if (before.awakeInfo.length != SkillAwakeManager.getActorClassData(after).length){
            isAwakeChange = true;
        }
        let isPushedAwake = false;
        if (isAwakeChange){
            before.awakeInfo.forEach(awake => {
                let skill = _.find(SkillAwakeManager.getActorClassData(after),(a) => a.skillId == awake.skillId);
                if (!skill){
                    if (isPushedAwake == false){
                        if (isLevelChange){
                            this._displayResultData.push({actorId:after.actorId(),skill : awake ,level : after.level - before.level });
                            this._displayResultData.push({actorId:after.actorId(),skill : null,level : null });
                        } else{
                            this._displayResultData.push({actorId:after.actorId(),skill : awake });
                            this._displayResultData.push({actorId:after.actorId(),skill : null });
                        }
                        isPushedAwake = true;
                    }
                    let ownSkill = $gameActors.actor( after.actorId() )._ownSkills[awake.skillId];
                    if (ownSkill == null || ownSkill == 0 ){
                        $gameParty._newSkillIdList.push(awake.skillId);
                    }
                }
            });
        } else
        if (isLevelChange){
            this._displayResultData.push({actorId:after.actorId(),level : after.level - before.level });
            this._displayResultData.push({actorId:after.actorId(),level : null });
        }
    });
    return this._displayResultData;
}

PopupLevelUpManager.setPopup = async function(endCall) {
    if (this._busy){
        return;
    }
    const levelUpType = this.getLevelUpType();
    if (levelUpType != null){
        let levelup = new Sprite_Levelup();
        SceneManager._scene.addChild(levelup);
        await levelup.setup(levelUpType);
        SceneManager._scene.removeChild(levelup);
    }
    this._resultWindow = new Window_BattleResult(264,80,540);
    SceneManager._scene.addChild(this._resultWindow);
    this._resultWindow.setEndCall(this.onResultNext.bind(this));
    this._endCall = endCall;

    const result = this._displayResultData[0];
    this.openWindow(result);
}

PopupLevelUpManager.openWindow = function(result) {
    let actor = $gameActors.actor(result.actorId);
    let lastExp = actor.currentExp();
    let paramsFlagData = [];
    if (result.level){
        paramsFlagData.push("lv");
        let params = {
            mhp:actor.mhp,
            mmp:actor.mmp,
            atk:actor.atk,
            def:actor.def,
            agi:actor.agi,
        }; 
        const exp = _.find(this._beforeMembers,(b) => b.actorId == result.actorId).exp;
        actor.changeExp(exp);

        if (params.mhp != actor.mhp){paramsFlagData.push("hp")};
        if (params.mmp != actor.mmp){paramsFlagData.push("mp")};
        if (params.atk != actor.atk){paramsFlagData.push("atk")};
        if (params.def != actor.def){paramsFlagData.push("def")};
        if (params.agi != actor.agi){paramsFlagData.push("spd")};

        this._displayResultData[1].flagList = paramsFlagData;
    }
    let skills = this.selectActorStatusSkills(actor);
    let statusSkillData = [];
    skills.forEach(skill => {
        let skillId = skill.id;
        statusSkillData.push(new Game_SlotSkill(
            skillId,
            {
                mpCost:actor.skillMpCost(skill),
                hideFlag:(!actor.isLearnedSkill(skillId) || (result.skill && result.skill.skillId == skillId)),
                elementId:[skill.damage.elementId,skill.damage.elementId,skill.damage.elementId],
                helpData:new Game_SkillHelp(actor,skillId,true)
            })
        )
    })

    skills = statusSkillData;

    let flagList = [];
    if (result.flagList){
        flagList = result.flagList;
    }

    if (result.skill && result.skill.skillId){
        this._displayResultData[1].forceSelectSkillId = result.skill.skillId;
    }
    let forceSelectSkillId = null;
    if (result.forceSelectSkillId){
        forceSelectSkillId = result.forceSelectSkillId;
    }

    this._resultWindow.setResultData(actor,skills,flagList,forceSelectSkillId);
    if (result.level){
        actor.changeExp(lastExp);
    } else if (result.skill){
    }
    this._displayResultData.shift();
}

PopupLevelUpManager.selectActorStatusSkills = function(actor) {
    let data = [];
    actor.currentClass().learnings.forEach(function(learning) {
        let skill = $dataSkills[learning.skillId];
        let awakeInfo = _.find(SkillAwakeManager.getActorClassData(actor),(a) => a.skillId == learning.skillId);
        let flag = true;
        if (awakeInfo && awakeInfo.type == 4 && awakeInfo.skill && awakeInfo.skill.length > 0){
            awakeInfo.skill.forEach(skill => {
                if (!actor.isLearnedSkill(skill.id)){
                    flag = false;
                }
            });
        }
        if (flag){
            data.push(skill);
        }
    }, this);
    // 習得>ID順にソート
    let self = this;
    data = data.sort(function(a,b){
        if(actor.isLearnedSkill(a.id) && !actor.isLearnedSkill(b.id)) return -1;
        if(!actor.isLearnedSkill(a.id) && actor.isLearnedSkill(b.id)) return 1;
        if(a.id<b.id) return -1;
        if(a.id>b.id) return 1;
    },this);
    return data;
}

PopupLevelUpManager.open = function() {
    if (this._busy){
        Debug.log("PopupLevelUpManager busy error");
        return;
    }
    this._busy = true;
}


PopupLevelUpManager.close = function() {
    this._busy = false;
}

PopupLevelUpManager.onResultNext = function() {
    SoundManager.playOk();
    if (this._displayResultData.length > 0){
        const result = this._displayResultData[0];
        this.openWindow(result);
    } else{
        this._resultWindow.hide();
        this._resultWindow.deactivate();
        this.close();
        this._resultWindow.terminate();
        if (this._endCall){
            this._endCall();
            this._endCall = null;
        }
    }
}

PopupLevelUpManager.setWait = function(num) {
    return new Promise(resolve => {
        const delayTime = num
        setTimeout(() => {
          return resolve()
        }, delayTime)
      })
}

PopupLevelUpManager.getLevelUpType = function (){
    let isLevelUp = false;
    let isSkillAwake = false;
    this._displayResultData.forEach(data => {
        if (!isLevelUp && data.level != null){
            isLevelUp = true;
        }
        if (!isSkillAwake && data.skill != null){
            isSkillAwake = true;
        }
    });
    if (isLevelUp && isSkillAwake) return LevelUpType.Both;
    if (isLevelUp) return LevelUpType.Level;
    if (isSkillAwake) return LevelUpType.SkillAwake;
    return null;
}