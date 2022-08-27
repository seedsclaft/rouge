//=============================================================================
// Game_EventBattle.js
//=============================================================================
/*:
 * @plugindesc イベントバトル管理
 * @author econa
 * 
 * @param EventBattleDataList
 * @type struct<EventBattleData>[]
 */

/*~struct~EventBattleData:
 * @param troop
 * @type troop
 * @default 
 * 
 * @param eventPage
 * @type struct<EventPageData>[]
 * 
 * 
 * */

/*~struct~EventPageData:
 * @param event
 * @type string
 * @default 
 * 
 * @param endEvent
 * @type note
 * 
 * @param statement
 * @type note
 * 
 * @param preready
 * @type boolean
 * 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_EventBattle
//
// The game object class for an actor.

function Game_EventBattle() {
  this.initialize.apply(this, arguments);
}

Game_EventBattle.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_EventBattle');
    
    let list = [];
    JSON.parse(this._data.EventBattleDataList).forEach(eventBattle => {
        let data = JSON.parse(eventBattle);
        data.troop = Number(data.troop);
        data.eventPage = JSON.parse(data.eventPage);
        let pageData = [];
        data.eventPage.forEach(page => {
            let p = JSON.parse(page);
            if (p.endEvent){
                p.endEvent = JSON.parse(p.endEvent);
            }
            if (p.statement){
                p.statement = JSON.parse(p.statement);
            }
            if (p.preready){
                p.preready = JSON.parse(p.preready);
            }
            pageData.push(p);
        });
        data.eventPage = pageData;
        list.push(data);
    });

    this._data = list;
};

Game_EventBattle.prototype.getEventBattle = function(troopId) {
    return _.find(this._data,(d) => d.troop == troopId);
};

Game_EventBattle.prototype.startEventBattle = function(troopId) {
    this.initMembers();
    this._eventData = this.getEventBattle(troopId);
};

Game_EventBattle.prototype.initMembers = function() {
    this._eventData = null;
    this._eventIndex = 0;
    this._step = null;
}

Game_EventBattle.prototype.update = function() {
    const eventData = this._eventData;
    if (!eventData){
        return;
    }
    if (eventData.eventPage.length > this._eventIndex){
        const statement = this.event().statement;
        if (statement){
            if (!eval(statement)){
                return;
            }
        }
        this._step = "event";
    }
}

Game_EventBattle.prototype.clearStep = function() {
    this._step = null;
}

Game_EventBattle.prototype.event = function() {
    const eventData = this._eventData;
    return eventData.eventPage[this._eventIndex];
}

Game_EventBattle.prototype.plusEventIndex = function() {
    this._eventIndex += 1;
}

Game_EventBattle.prototype.eventIndex = function() {
    return this._eventIndex;
}

Game_EventBattle.prototype.eventData = function() {
    return this._eventData;
}

Game_EventBattle.prototype.prereadyEvent = function() {
    if (this._eventData){
        for (let event of this._eventData.eventPage){
            if (event.prereadyEvent == true && eval(event.statement)){
                return event.prereadyEvent;
            }
        }
    }
    return null;
}