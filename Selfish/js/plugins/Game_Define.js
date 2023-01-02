//=============================================================================
// Game_Define.js
//=============================================================================
/*:
 * @plugindesc 固定のIDなどを管理する。
 * @author econa
 *
 * @param GameVersion
 * @desc ゲームのバージョン
 * @type string
 * 
 * @param AndroidVersionCode
 * @desc Android用バージョンコード
 * @type string 
 * 
 * @param iOSVersionCode
 * @desc ios用バージョンコード
 * @type string 
 * 
 * @param MobileMode
 * @desc 挙動をモバイル端末用にする
 * @default false
 * 
 * @param InitCurrency
 * @desc 初期pt所持数
 * @default 0
 * 
 * @param TrainCurrency
 * @desc 強化に必要なpt計算式
 * @default ""
 * 
 * @param WaitSkillId
 * @desc 待機のスキルID
 * @default 271
 * 
 * @param NoActionSkillId
 * @desc 何もしないのスキルID
 * @default 3
 * 
 * @param OnlyOneConditionSwitchId
 * @desc バトルスイッチ・生存が自身のみ
 * @default 21
 * 
 * @param NotOnlyOneConditionSwitchId
 * @desc バトルスイッチ・自身以外も生存がいる
 * @default 22
 * 
 * @param ContainsDieBattlerConditionSwitchId
 * @desc 戦闘不能がいる
 * @default 23
 * 
 * @param AnyOneSameStateIdSwitchId
 * @desc スキルで付与するステートが誰かにかかっている
 * @default 24
 * 
 * @param OneTimeSwitchId
 * @desc バトル中1度しか使用できない
 * @default 25
 * 
 * @param SummonSwitchId
 * @desc 召喚できる状態である
 * @default 26
 * 
 * @param FlozenStateIdSwitchId
 * @desc 攻撃対象に凍結がいる
 * @default 31
 * 
 * @param ChainSeaquenceSwitchId
 * @desc バトルでチェインが起きている管理フラグ
 * @default 32
 * 
 * @param SummonTroopId
 * @desc 召喚で参照するtroopのNo
 * @default 12
 * 
 * 
 * @help
 * プロジェクト特有の設定をするプラグイン
 * 
 * @param gainElementRate
 * @desc 有利倍率
 * @default 2.0
 * 
 * @param lessElementRate
 * @desc 不利倍率
 * @default 1.0
 * 
 * @param frozenDamageRate
 * @desc 凍結状態のダメージ増加率
 * @default 1.5
 * 
 * @param lastBattleTroopId
 * @desc ラストバトルのトループID
 * @type number
 * @default ""
 * 
 */

//-----------------------------------------------------------------------------
// Game_Define
//
// The game object class for an actor.

function Game_Define() {
  this.initialize.apply(this, arguments);
}

Game_Define.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Define');
    this._mobileMode = this._data.MobileMode == 1 ? true : false;
    if (Utils.isMobileDevice()){
      this._mobileMode = true;
    }
    this._platForm = PlatForm.None;
    // iPadはiOS13からnavigator.userAgentから「iPad」であることを判別できない
    this.setMobileModeHotfix();
};

Game_Define.prototype.data = function() {
  return this._data;
}

Game_Define.prototype.platForm = function() {
  return this._platForm;
}

Game_Define.prototype.gameVersionNumber = function() {
  let version = this.gameVersion.replace(/\./g,'');
  return Number(version);
}

Game_Define.prototype.frictionDamage = function(actor,item) {
  let array = actor.mp;
  if (array < 0) array = 0;
  let rate = Number( this.frictionDamageArray[array] );
  return rate;
}

Game_Define.prototype.setMobileModeHotfix = function() {
  if (this._platForm == PlatForm.iOS || this._platForm == PlatForm.Android){
    this._mobileMode = true;
  }
}

Object.defineProperties(Game_Define.prototype, {
  gameVersion:                { get: function() { return String(this._data.GameVersion); }, configurable: false },
  versionCode:                { get: function() { return String(this._data.VersionCode); }, configurable: false },
  androidVersionCode:                { get: function() { return String(this._data.AndroidVersionCode); }, configurable: false },
  iosVersionCode:                { get: function() { return String(this._data.iOSVersionCode); }, configurable: false },
  
  waitSkillId:                  { get: function() { return Number(this._data.WaitSkillId); },   configurable: false },
  noActionSkillId:              { get: function() { return Number(this._data.NoActionSkillId) }, configurable: false },

  onlyOneConditionSwitchId:     { get: function() { return Number(this._data.OnlyOneConditionSwitchId); }, configurable: false },
  notOnlyOneConditionSwitchId:  { get: function() { return Number(this._data.NotOnlyOneConditionSwitchId); }, configurable: false },
  containsDieBattlerConditionSwitchId:  { get: function() { return Number(this._data.ContainsDieBattlerConditionSwitchId); }, configurable: false },
  anyOneSameStateIdSwitchId:  { get: function() { return Number(this._data.AnyOneSameStateIdSwitchId); }, configurable: false },
  oneTimeSwitchId:  { get: function() { return Number(this._data.OneTimeSwitchId); }, configurable: false },
  summonSwitchId:  { get: function() { return Number(this._data.SummonSwitchId); }, configurable: false },
  flozenStateIdSwitchId:  { get: function() { return Number(this._data.FlozenStateIdSwitchId); }, configurable: false },
  chainSeaquenceSwitchId:  { get: function() { return Number(this._data.ChainSeaquenceSwitchId); }, configurable: false },
  
  summonTroopId:  { get: function() { return Number(this._data.SummonTroopId); }, configurable: false },
  mobileMode:                   { get: function() { return this._mobileMode; }, configurable: false },
  gainElementRate:              { get: function() { return Number(this._data.gainElementRate); }, configurable: false },
  lessElementRate:              { get: function() { return Number(this._data.lessElementRate); }, configurable: false },
  frozenDamageRate:             { get: function() { return Number(this._data.frozenDamageRate); }, configurable: false },

  lastBattleTroopId:             { get: function() { return Number(this._data.lastBattleTroopId); }, configurable: false },  
});

const ScopeType = {
  NONE : 0,
  ONE_ENEMY : 1,
  ALL_ENEMY : 2,
  RANDAM1 : 3,
  RANDAM2 : 4,
  RANDAM3 : 5,
  RANDAM4 : 6,
  ONE_PARTY : 7,
  ALL_PARTY : 8,
  ONE_DEADPARTY : 9,
  ALL_DEADPARTY : 10,
  SELF : 11,
};

const RemoveStateAutoType = {
  NONE : 0,       //なし
  ACT_END : 1,    //行動終了後
  TURN_END : 2,   //ターン終了後
};

const PlatForm = {
  None :0,     //None
  Android : 1,    //アンドロイド
  iOS : 2,        //iOS
  Steam : 3,      //Steam
  DlSite : 4,     //DlSite
  Other : 99,     //その他
};
