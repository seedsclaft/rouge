//=============================================================================
// Game_Stage.js
//=============================================================================
//
// The game object class for an stage.
/*:
 * @plugindesc ステージデータ。
 * @author econa
 *
 * @param StageList
 * @desc ステージ
 * @type struct<Stage>[]
 * */

/*~struct~Stage:
 * @param id
 * @type number
 * @default 1
 * 
 * @param nameId
 * @type number
 * @default 1
 * 
 * @param variableId
 * @type variable
 * @default 1
 * 
 * @param nextId
 * @type number
 * @default 1
 * 
 * @param level
 * @type number
 * @default 1
 * 
 * @param enemyCount
 * @type number
 * @default 1
 * 
 * @param bossId
 * @type troop
 * @default 1
 * 
 * @param length
 * @type number
 * @default 1
 * 
 * @param bgm
 * @type string
 * @default 
 * 
 * @param bgs
 * @type file
 * @dir audio/bgs
 * @default 1
 * 
 * @param bgsOptions
 * @type struct<BgsOption>[]
 * @default 
 * 
 * @param backGround
 * @type file
 * @dir img/battlebacks1
 * @default 1
 * 
 * @param troop
 * @type struct<StageEnemy>[]
 * @default 
 * 
 * @param loseType
 * @type number
 * @default 0
 * 
 * @param bossAnimation
 * @type string
 * @default ""
 * 
 * @param startEvent
 * @type string
 * @default ""
 * 
 * @param endEvent
 * @type string
 * @default ""
 * 
 * @param beforeBattleBgm
 * @type boolean
 * @default true
 * 
 * @param bossBattleBgm
 * @type boolean
 * @default true
 * 
 * @param version
 * @type number
 * @default 0
 * 
 * */

 /*~struct~StageEnemy:
 * @param enemy
 * @type enemy
 * 
 * @param weight
 * @type number
 * 
 * */

 /*~struct~BgsOption:
 * @param bgs
 * @dir audio/bgs
 * @type file
 * 
 * @param seeking
 * @type number
 * 
 * */
function Game_Stage() {
    this.initialize.apply(this, arguments);
}

Object.defineProperties(Game_Stage.prototype, {
    id: { get: function() { return this._stageId; }, configurable: true },
    phase: { get: function() { return this._phase; }, configurable: true },
});

class Game_StageList {
    constructor(){
        this._data = PluginManager.parameters('Game_Stage');
        var list = [];
        JSON.parse(this._data.StageList).forEach(stage => {
            let data = JSON.parse(stage);
            let troop = [];
            JSON.parse(data.troop).forEach(troopData => {
                var temp = JSON.parse(troopData);
                temp.enemy = Number(temp.enemy);
                temp.weigth = Number(temp.weight);
                troop.push(temp);
            });
            data.troop = troop;

            let bgsOption = [];
            if (data.bgsOptions){
                JSON.parse(data.bgsOptions).forEach(bgsOptionData => {
                    if (bgsOptionData){
                        var temp = JSON.parse(bgsOptionData);
                        temp.bgs = String(temp.bgs);
                        temp.seeking = Number(temp.seeking);
                        bgsOption.push(temp);

                    }
                });
            }
            data.bgsOptions = bgsOption;
            list.push(data);
        });
        var stages = [];
        list.forEach(data => {
            var stageData = {
                id : data.id ? Number(data.id) : 0,
                category : data.category ? Number(data.category) : 0,
                nameId : data.nameId ? Number(data.nameId) : 0,
                level : data.level ? Number(data.level) : 0,
                enemyCount : data.enemyCount ? Number(data.enemyCount) : 0,
                bossId : data.bossId ? Number(data.bossId) : 0,
                length : data.length ? Number(data.length) : 0,
                bgm : data.bgm ? String(data.bgm) : "",
                bgs : data.bgs ? String(data.bgs) : "",
                bgsOptions : data.bgsOptions ? data.bgsOptions : null,
                backGround : data.backGround ? String(data.backGround) : "",
                troop : data.troop ? data.troop : null,
                loseType : data.loseType ? Number(data.loseType) : 0,
                variableId : data.variableId ? Number(data.variableId) : 0,
                nextId : data.nextId ? Number(data.nextId) : 0,
                startEvent : data.startEvent ? data.startEvent : "",
                endEvent : data.endEvent ? data.endEvent : "",
                beforeBattleBgm : data.beforeBattleBgm == "true" ? true : false,
                bossBattleBgm : data.bossBattleBgm  == "true" ? true : false,
                bossAnimation : data.bossAnimation != "" ? String(data.bossAnimation) : "",
                version : data.version != null ? Number(data.version) : 100
            }  
            stages.push(stageData);
        })
        this._data = stages;
    }
}

Game_Stage.prototype.initialize = function() {
    this._stageId = 0;
    this._phase = "init";
};

Game_Stage.prototype.setup = async function(stageId) {
    if (!stageId){
        return;
    }
    if (this._stageId == stageId){
        return;
    }
    var data = await this.loadStageSequenceData();
    var event = _.find(data.events,(e) => e && e.name == "Stage" + stageId);
    var stageSeaquence = event.pages;

    this._stageSeaquence = {};

    this._stageId = stageId;
    var stageData = DataManager.getStageInfos(stageId);


    this._stageLength = stageData.length;

    //0-10%を埋める
    var noneIds = [0];
    var min = Math.round(stageData.length * 0.1);
    for (var i = 0;i < min;i++){
        noneIds.push(i);
    }

    //90-100%を埋める
    var max = Math.ceil((stageData.length+1) * 0.9);
    for (var i = stageData.length-1;i > max;i--){
        noneIds.push(i);
    }

    //BossBeforeを置く
    var bossBefore = new Game_StageEvent();
    bossBefore.setBossBefore();
    this._stageSeaquence[max] = bossBefore;
    noneIds.push(max);

    //Bossを置く
    var boss = new Game_StageEvent();
    boss.setBoss();
    this._stageSeaquence[stageData.length-1] = boss;
    noneIds.push(max);

    var eventList = _.filter(stageSeaquence,(sea) => sea && (sea.conditions.variableValue != -1 || sea.conditions.variableValue != -2));
    
    if (eventList.length > 0){
        eventList.forEach(ev => {
            if (ev.conditions.variableValue == 0){
                return;
            }
            var per = Math.floor(stageData.length * (ev.conditions.variableValue / 100));
            if (_.contains(noneIds,per)){
                Debug.error("置いてはいけない場所にイベントを置こうとしている! per = " + per)
            }
            var event = new Game_StageEvent();
            event.setup(ev.conditions.variableValue);
            this._stageSeaquence[per] = event;
            noneIds.push(per);
        });
    }
    

    var stageLv = stageData.level;
    var randParam = [];
    while ( randParam.length < stageData.enemyCount){
        var rand = Math.randomInt(stageData.length);
        if (!_.contains(noneIds,rand)){
            if (!_.contains(randParam,rand)){
                randParam.push(rand);
            }
        }
    }
    randParam = _.sortBy(randParam);

    randParam.forEach(param => {
        var troop = new Game_Troop();
        var troopId = this.makeEncounterTroopId();
        troop.setup(troopId,stageLv);
        var battle = new Game_StageEvent();
        battle.setBattle(troop);
        stageLv += 1;
        this._stageSeaquence[param] = battle;
    });


    this._readFlag = false;
    Debug.log(this);
}

Game_Stage.prototype.loadStageSequenceData = function() {
    return new Promise(resolve => {
        return DataManager.loadStageSequenceData(resolve);
    });
}

Game_Stage.prototype.stageLength = function() {
    return this._stageLength;
};


//0817 ランダムエンカウント
Game_Stage.prototype.makeEncounterTroopId = function() {
    var weightSum = 0;
    var encounterList = [];
    var enemyId = 0;
    var stageData = DataManager.getStageInfos($gameParty._stageNo);
	for (var i = 0; i < 3; i++) {
		enemyId = Math.floor(( Math.random() * stageData.troop.length));
		weightSum += +stageData.troop[enemyId].weight;
		if (weightSum > 30) {
			break;
		}
		encounterList[i] = stageData.troop[enemyId].enemy;
	}
	
	troop = $dataTroops[encounterList.length];
	for (var i = 0; i < encounterList.length; i++) {
		troop.members[i].enemyId = encounterList[i];
	}
	return encounterList.length;
};

Game_Stage.prototype.clear =  function() {
    this._stageId = 0;
    this._phase = "init";
    this._stageSeaquence = {};
    this._stageLength = 0;
    this._readFlag = false;
}

const GameStageLoseType = {
    PARTYMEMBERLOST : 0,
    TROOPMEMBERLOST : 1,
}

//-----------------------------------------------------------------------------
// Game_StageEvent
//
// The game object class for an actor.

function Game_StageEvent() {
    this.initialize.apply(this, arguments);
}

Game_StageEvent.prototype.initialize = function() {
    this._eventId = null;
    this._type = "";
};

Game_StageEvent.prototype.setup = function(eventId) {
    this._type = "event";
    this._eventId = eventId;
}

Game_StageEvent.prototype.setBattle = function(eventId) {
    this._type = "battle";
    this._eventId = eventId;
}

Game_StageEvent.prototype.setBossBefore = function() {
    this._type = "bossBefore";
}

Game_StageEvent.prototype.setBoss = function() {
    this._type = "boss";
}