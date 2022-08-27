class Model_EnemyInfo {
    constructor() {
    }

    enemyList (){
        const enemies = $gameParty.enemyInfoData().map((id) => $dataEnemies[id]);
        return _.sortBy(enemies,(d) => d.id);
    }

    actionList (enemy){
        let slotSkillData = [];
        enemy.actions.forEach((action ,index)=> {
            let skill = $dataSkills[action.skillId];
            let elementId = skill.damage.elementId == -1 ? enemy.elementId : skill.damage.elementId;
            slotSkillData.push(new Game_SlotSkill(
                action.skillId,
                {
                    mpCost:skill.mpCost,
                    elementId:[elementId,elementId,elementId],
                    helpData:new Game_SkillHelp(enemy,action.skillId)
                })
            );
        });
        return slotSkillData;
    }
}
