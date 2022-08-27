
class Game_SlotSkill{
    constructor(skillId,option){
        this._skillId = skillId;
        
        let useOpt = { ...slotSkillOption, ...option };

        this._mpCost = useOpt.mpCost;
        this._enable = useOpt.enable;
        this._selected = useOpt.selected;
        this._hideFlag = useOpt.hideFlag;
        this._level = useOpt.level;
        this._lessLevel = useOpt.lessLevel;
        this._expRate = useOpt.expRate;
        this._expRateTotal = useOpt.expRateTotal;
        this._elementId = useOpt.elementId;
        this._helpData = useOpt.helpData;
    }

    get skillId(){
        return this._skillId;
    }

    get enable(){
        return this._enable;
    }

    get hideFlag(){
        return this._hideFlag;
    }

    get selected(){
        return this._selected;
    }

    get level(){
        return this._level;
    }

    get lessLevel(){
        return this._lessLevel;
    }

    get expRate(){
        return this._expRate;
    }

    get expRateTotal(){
        return this._expRateTotal;
    }

    get elementId(){
        return this._elementId;
    }
    
    get helpData (){
        return this._helpData;
    }
}

const slotSkillOption = {
    mpCost : 0,
    enable : true,
    selected : false,
    hideFlag : false,
    level : 0,
    lessLevel : 0,
    expRate : 0,
    expRateTotal : 0
};