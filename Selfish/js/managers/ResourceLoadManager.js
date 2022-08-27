class ResourceLoadManager {
    constructor(){
    }

    static getBattleResource(){
        let animations = [];
        let sounds = [];
        let enemies = [];


        let animation = $dataAnimationsMv[3];
        this.gainMvAnimationSound(animation,animations,sounds);

        $gameTroop.members().forEach(enemy => {
            const enemyData = $dataEnemies[enemy.enemyId()];
            enemies.push(enemyData);
            enemyData.actions.forEach(action => {
                let animId = $dataSkills[action.skillId].animationId;
                if (animId == -1){
                    animId = enemyData.attackId;
                }
                if (!animId){
                    return;
                }
                let animation = $dataAnimationsMv[animId];
                this.gainMvAnimationSound(animation,animations,sounds);
            });
        });

        const stageId = $gameParty.stageNo();
        const stage = DataManager.getStageInfos(stageId);
        const needBgm = [stage.bgm];

        animations = _.uniq(animations);
        enemies = _.uniq(enemies);
        sounds = _.uniq(sounds,(s) => s.name);


        return {animation:animations,sound:sounds,bgm:needBgm,enemy:enemies};
    }

    static getStageResource(stageId){
        let stage = DataManager.getStageInfos(stageId);
        if (!stage){
            return null;
        }
        let animations = [];
        let sounds = [];
        let enemies = [];
        let enemyIds = [];
        if (stage.troop){
            stage.troop.forEach(troops => {
                enemyIds.push(troops.enemy);
            });
        }
        if (stage.bossId){
            let troop = $dataTroops[stage.bossId];
            troop.members.forEach(member => {
                enemyIds.push(member.enemyId);
            });
        }
    
        enemyIds.forEach(enemyId => {
            let enemy = $dataEnemies[enemyId];
            if (enemy){
                enemies.push(enemy.battlerName);
                enemy.actions.forEach(action => {
                    let animId = $dataSkills[action.skillId].animationId;
                    if (animId == -1){
                        animId = enemy.attackId;
                    }
                    if (!animId){
                        return;
                    }
                    let animation = $dataAnimationsMv[animId];
                    this.gainMvAnimationSound(animation,animations,sounds);
                });
            }
        })
    
        
        animations = _.uniq(animations);
        enemies = _.uniq(enemies);
        sounds = _.uniq(sounds,(s) => s.name);
    
    
        const needBgm = [stage.bgm];
        return {animation:animations,sound:sounds,bgm:needBgm,enemy:enemies};
    }

    static getSkillResource(skillId){
        let animations = [];
        let sounds = [];
        let animId = $dataSkills[skillId].animationId;
        if (!animId){
            return {animation:animations,sound:sounds};
        }
        let animation = $dataAnimationsMv[animId];
        this.gainMvAnimationSound(animation,animations,sounds);
        return {animation:animations,sound:sounds};
    }

    static getBossResource(){
        let animations = [];
        let sounds = [];
        let enemies = [];


        let animation = $dataAnimationsMv[3];
        this.gainMvAnimationSound(animation,animations,sounds);
        
        const troopId = DataManager.getStageInfos($gameParty.stageNo()).bossId;
        let testTroop = new Game_Troop();
        testTroop.setup(troopId);
        Debug.log(testTroop)
        testTroop.members().forEach(enemy => {
            const enemyData = $dataEnemies[enemy.enemyId()];
            enemies.push(enemyData);
            enemyData.actions.forEach(action => {
                let animationId = $dataSkills[action.skillId].animation;
                if (animationId == -1){
                    animationId = enemyData.attackId;
                }
                if (!animationId){
                    return;
                }
                let animation = $dataAnimationsMv[animationId];
                this.gainMvAnimationSound(animation,animations,sounds);
            });
        });

        const stageId = $gameParty.stageNo();
        const stage = DataManager.getStageInfos(stageId);
        const needBgm = [stage.bgm];

        animations = _.uniq(animations);
        enemies = _.uniq(enemies);
        sounds = _.uniq(sounds,(s) => s.name);

        return {animation:animations,sound:sounds,bgm:needBgm,enemy:enemies};
    }
    
    static gainMvAnimationSound(mvAnimation,animations,sounds){
        mvAnimation.timings.forEach(timing => {
            if (timing.se){
                sounds.push(timing.se);
            }
        });
        if (mvAnimation.animation1Name){
            animations.push(mvAnimation.animation1Name);
        }
        if (mvAnimation.animation2Name){
            animations.push(mvAnimation.animation2Name);
        }
    }

    static releaseBattleResource(stageId){
        const resources = this.getStageResource(stageId);

        if (resources){
            // アニメーションを解放
            resources.animation.forEach(anim => {
                ImageManager.clearImageAnimation(anim);
            });
            // 敵グラフィックを解放
            resources.enemy.forEach(en => {
                ImageManager.clearImageEnemy(en.battlerName);
            });
            // サウンドを解放
            resources.sound.forEach(se => {
                AudioManager.purgeSe(se);
            });        
            resources.bgm.forEach(bgm => {
                AudioManager.purgeBgm(bgm);
            });
        }
        //ステージBGM情報削除
        AudioManager.purgeBgm($gameBGM.getBgm('stagemenu'));
        if ($dataMap){
            AudioManager.purgeBgm($dataMap.bgm);
        }
        AudioManager.purgeBgm($gameBGM.getBgm('boss'));
    }
}