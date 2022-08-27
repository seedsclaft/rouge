//=============================================================================
// Game_BGM.js
//=============================================================================
/*:
 * @plugindesc BGMに種別をつける。
 * @author econa
 *
 * @param BgmDataList
 * @type struct<BgmData>[]
 * 
 */

/*~struct~BgmData:
 * @param key
 * @type string
 * @default 
 * 
 * @param bgm
 * @type file
 * @dir audio/bgm
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
// Game_BGM
//
// The game object class for an actor.

function Game_BGM() {
  this.initialize.apply(this, arguments);
}

Game_BGM.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_BGM');
    let list = [];
    JSON.parse(this._data.BgmDataList).forEach(bgm => {
        let data = JSON.parse(bgm);
        let option = data.option.length != 0 ? JSON.parse(data.option) : null;
        data.option = option;
        list.push(data);
    });
    this._data = list;
};

Game_BGM.prototype.getBgm = function(key) {
  let bgmData = _.find(this._data,(data) => data.key == key);
  let pitchData = 100;
  let volumeData = 90;
  let panData = 0;
  if (bgmData && bgmData.option){
    if (bgmData.option.pitch){
      pitchData = bgmData.option.pitch;
    }
    if (bgmData.option.volume){
      volumeData = bgmData.option.volume;
    }
    if (bgmData.option.pan){
      panData = bgmData.option.pan;
    }
  }
  if (bgmData){
    return {
      name:bgmData.bgm,
      volume : volumeData,
      pitch : pitchData,
      pan : panData,
    }
  }
  return null;
}

Game_BGM.prototype.getBgmUrl = function(name) {
  return AudioManager._path + "bgm/" + Utils.encodeURI(name) + ".ogg";
}

Object.defineProperties(Game_BGM.prototype, {
  title:     { get: function() { return this.getBgm(String('title')); }, configurable: false },
  field:     { get: function() { return this.getBgm(String('field')); }, configurable: false },
  boss:      { get: function() { return this.getBgm(String('boss')); }, configurable: false },
  event:          { get: function() { return this.getBgm(String('event')); }, configurable: false },
  stagemenu:          { get: function() { return this.getBgm(String('stagemenu')); }, configurable: false },
  nightschool:          { get: function() { return this.getBgm(String('nightschool')); }, configurable: false },
  mountain:          { get: function() { return this.getBgm(String('mountain')); }, configurable: false },
  sad:          { get: function() { return this.getBgm(String('sad')); }, configurable: false },
  tower:          { get: function() { return this.getBgm(String('tower')); }, configurable: false },
  morning:          { get: function() { return this.getBgm(String('morning')); }, configurable: false },
  chapter:          { get: function() { return this.getBgm(String('chapter')); }, configurable: false },
  enjoy:          { get: function() { return this.getBgm(String('enjoy')); }, configurable: false },
  cafe:          { get: function() { return this.getBgm(String('cafe')); }, configurable: false },
  search:          { get: function() { return this.getBgm(String('search')); }, configurable: false },
  memory:          { get: function() { return this.getBgm(String('memory')); }, configurable: false },
  stage1:          { get: function() { return this.getBgm(String('stage1')); }, configurable: false },
  stage2:          { get: function() { return this.getBgm(String('stage2')); }, configurable: false },
  stage3:          { get: function() { return this.getBgm(String('stage3')); }, configurable: false },
  stage4:          { get: function() { return this.getBgm(String('stage4')); }, configurable: false },
  stage5:          { get: function() { return this.getBgm(String('stage5')); }, configurable: false },
  stage6:          { get: function() { return this.getBgm(String('stage6')); }, configurable: false },
  stage7:          { get: function() { return this.getBgm(String('stage7')); }, configurable: false },
  stage8:          { get: function() { return this.getBgm(String('stage8')); }, configurable: false },
  stage9:          { get: function() { return this.getBgm(String('stage9')); }, configurable: false },
  stage11:          { get: function() { return this.getBgm(String('stage11')); }, configurable: false },
  stage12:          { get: function() { return this.getBgm(String('stage12')); }, configurable: false },
  stage13:          { get: function() { return this.getBgm(String('stage13')); }, configurable: false },
  stage14:          { get: function() { return this.getBgm(String('stage14')); }, configurable: false },
  stage15:          { get: function() { return this.getBgm(String('stage15')); }, configurable: false },
  stage16:          { get: function() { return this.getBgm(String('stage16')); }, configurable: false },
  stage17:          { get: function() { return this.getBgm(String('stage17')); }, configurable: false },
  stage18:          { get: function() { return this.getBgm(String('stage18')); }, configurable: false },
  stage19:          { get: function() { return this.getBgm(String('stage19')); }, configurable: false },
  lastbattle:          { get: function() { return this.getBgm(String('lastbattle')); }, configurable: false },
  lastbattle2:          { get: function() { return this.getBgm(String('lastbattle2')); }, configurable: false },
  ending:          { get: function() { return this.getBgm(String('ending')); }, configurable: false },
});