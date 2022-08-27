//=============================================================================
// Game_SE.js
//=============================================================================
/*:
 * @plugindesc SEの項目を拡張する。
 * @author econa
 *
 * @param SeDataList
 * @type struct<SeData>[]
 */

/*~struct~SeData:
 * @param key
 * @type string
 * @default 
 * 
 * @param se
 * @type file
 * @dir audio/se
 * @default 
 * 
 * @param option
 * @type string
 * @default 
 * 
 * @param memo
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_SE
//
// The game object class for an actor.

function Game_SE() {
  this.initialize.apply(this, arguments);
}

Game_SE.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_SE');
    var list = [];
    JSON.parse(this._data.SeDataList).forEach(se => {
        var data = JSON.parse(se);
        if (data.option){
            data.option = JSON.parse(data.option);
        }
        $dataSystem.sounds.push((this.convertSeData(data.se,data.option)));
        list.push(data);
    });
    this._data = list;
};

Game_SE.prototype.convertSeData = function(se,option) {
    let volume = 90;
    let pitch = 100;
    let pan = 0;
    if (option){
        let opt = option;
        if (opt.volume != null){
            volume = Number(opt.volume);
        }
        if (opt.pitch != null){
            pitch = Number(opt.pitch);
        }
        if (opt.pan != null){
            pan = Number(opt.pan);
        }
    }
    return {
        name: se,
        volume : volume,
        pitch : pitch,
        pan : pan,
    }
}

Object.defineProperties(Game_SE.prototype, {
  guard:          { get: function() { return 'guard'; }, configurable: false },
  justGuard:      { get: function() { return 'justguard'; }, configurable: false },
  messageType1:   { get: function() { return 'messagetype1'; }, configurable: false },
  messageType2:   { get: function() { return 'messagetype2'; }, configurable: false },
  actorCommand:   { get: function() { return 'actorcommand'; }, configurable: false },
  levelUp:        { get: function() { return 'levelup'; }, configurable: false },
  cutIn:          { get: function() { return 'cutin'; }, configurable: false },
  landing:        { get: function() { return 'landing'; }, configurable: false },
  counter:        { get: function() { return 'counter'; }, configurable: false },
  chain:          { get: function() { return 'chain'; }, configurable: false },
  eyecatch:       { get: function() { return 'eyecatch'; }, configurable: false },
  answerquiz:     { get: function() { return 'answerquiz'; }, configurable: false },
  missquiz:       { get: function() { return 'missquiz'; }, configurable: false },
  footSound1:     { get: function() { return 'footsound1'; }, configurable: false },
  footSound2:     { get: function() { return 'footsound2'; }, configurable: false },
  footSound3:     { get: function() { return 'footsound3'; }, configurable: false },
  unlock:         { get: function() { return 'unlock'; }, configurable: false },
  jingle:         { get: function() { return 'jingle'; }, configurable: false },
});
