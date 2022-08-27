//=============================================================================
// Game_StateInfo.js
//=============================================================================
/*:
 * @plugindesc ステートのキー・番号を指定する。
 * @author econa
 * 
 * @param StateInfoList
 * @desc ステート
 * @type struct<StateInfo>[]
 * 
 * @help
 * プロジェクト特有の設定をするプラグイン
 */

/*~struct~StateInfo:
 * @param key
 * @type string
 * @default 
 * 
 * @param id
 * @type state
 * @default 
 * 
 * @param total
 * @type boolean
 * @default false
 * 
 * @param textId
 * @type number
 * @default 0
 * 
 * */

//-----------------------------------------------------------------------------
// Game_StateInfo
//
// The game object class for an actor.

function Game_StateInfo() {
    this.initialize.apply(this, arguments);
}

Game_StateInfo.prototype.initialize = function() {
    this._data = {};
    $dataStates.forEach(element => {
      if (element && element.note != ''){
        var data = JSON.parse(element.note);
        this._data[data.type] = element.id;
      }
    });
    
    this._data = PluginManager.parameters('Game_StateInfo');
    var list = [];
    JSON.parse(this._data.StateInfoList).forEach(stateInfo => {
        var data = JSON.parse(stateInfo);
        data.id = Number(data.id);
        data.total = data.total == 'true' ? true : false;
        data.textId = Number(data.textId);
        list.push(data);
    });
    this._data = list;
};

const StateType = {
    DEATH :         "death",     //戦闘不能
    GUARD :         "guard",     //防御
    
    SHIELD_BREAK :        "shieldbreak",    //毒
    POISON :        "poison",    //毒
    STUN :          "stun",      //スタン
    CURSE :         "curse",     //呪い
    BLIND :         "blind",     //暗闇
    SICK :          "sick",      //炎症
    SILENT :        "silent",    //封印
    SLOW :          "slow",      //鈍足
    FROZEN :        "frozen",    //凍結
    INSTANT_DEATH :        "instantdeath",    //即死

    WAIT :          "wait",      //次の順番に
    LIMIT_BREAK :          "limitbreak",      //覚醒スキル


    HP_BUFF_ADD :       "hpbuffA",       //HPアップ(加算)
    HP_BUFF_RATE :      "hpbuffR",       //HPアップ(倍率)
    MP_BUFF_ADD :       "mpbuffA",       //HPアップ(加算)
    MP_BUFF_RATE :      "mpbuffR",       //HPアップ(倍率)

    ATK_BUFF_ADD :      "atkbuffA",       //攻撃アップ(加算)
    ATK_BUFF_RATE :     "atkbuffR",       //攻撃アップ(倍率)
    DEF_BUFF_ADD :      "defbuffA",       //防御アップ(加算)
    DEF_BUFF_RATE :     "defbuffR",       //防御アップ(倍率)
    AGI_BUFF_ADD :      "agibuffA",       //すばやさアップ(加算)
    AGI_BUFF_RATE :     "agibuffR",       //すばやさアップ(倍率)

    EVA_BUFF_RATE :     "evabuffR",       //回避アップ(倍率)

    CRITICAL_BUFF_ADD :       "cribuffA",       //クリティカルアップ(倍率)
    CRITICAL_BUFF_RATE :      "cribuffR",       //クリティカルアップ(倍率)

    BATTLE_MP_BUFF_ADD :      "battlempbuffA",  //初期MPアップ
    START_DASH :              "startdash",      //1ターン目最速

    DAMAGE_RATE :             "damageR",        //ダメージ倍率

    PHARMACOLOGY :            "PHArmacology",   //回復効果

    

    DRAIN_HEAL :              "drainheal",      //ドレインヒール
    CHAIN_SELF :              "chainself",      //拘束（する方）
    CHAIN_TARGET :            "chaintarget",    //拘束（される方）
    PROVOCATION :             "provocation",    //狙われ率(増加)
    SHADOW :                  "shadow",         //狙われ率(減少)
    SALT_TARGET :             "salttarget",     //挑発
    DAMAGE_CUT :              "damagecut",      //ダメージ減算
    MP_DAMAGE :               "mpdamage",       //追加MPダメージ
    INVISIBLE :               "invisible",      //無敵

    BARRIER :                 "barrier",        //ステートバリア
    CHARGE :                  "charge",         //チャージ

    ATTACK_LENGHT :           "attacklength",   //攻撃回数加算
    SKILL_EXP :               "skillexp",       //スキル経験値アップ(未使用)
    COUNTER :                 "counter",        //カウンター
    ALL_ATTACK :              "allattack",      //攻撃全体化

    DAMAGE_BLOCK :            "damageblock",    //ダメージブロック
    DRAIN_HEALATK :           "drainhealatk",   //ドレインヒール(攻撃付与)
    HOLD_ON :                 "holdon",         //手加減
    SUBSTITUTE :              "substitute",     //かばう
    RESIST_STATE :            "resiststate",    //ステート無効
    CHAIN :                   "chain",          //チェイン
    NO_COST :                 "nocost",         //ノーコスト
    REGENE_HP :               "regenehp",       //リジェネHp
    ETHER :                   "ether",          //エーテル
    ADD_TURN_EFFECT :         "addTurnEffect",  //効果ターン数増加
    ACCEL :                   "accel",          //アクセル
    COST_DOWN :               "costdown",       //コストダウン
    GENUINE:                  "genuine",        //先天属性以外コストダウン
    BANISH:                   "banish",         //一度だけ戦闘不能を回避
    AP_DAMAGE:                "apdamage",       //APダメージ
    
    INVOLVEMENT:              "involvement",    //味方全員が攻撃アップ
    SUPERIOR :                "superior",       //味方と敵MP総計分攻撃アップ

    MP_BUFF_ADD_SPECIAL :     "mpbuffASprecial",//MPアップ(特殊)
    SELF_HOLD_ON :            "selfholdon",     //手加減(セルフル)
    CHAIN_PLUS :              "chainplus",      //拘束プラス
    SUMMON :                  "summon",         //召喚
    SEAL_SKILL :              "sealskill",      //特定スキル封印
    MPCOST_MAX :              "mpcostmax",      //最大MPコスト消費
    WAVY :                    "wavy",           //スキル波状
    VANTAGE :                 "vantage",        //待ち伏せ
    FINITE :                  "finite",         //宣告
    REACT :                   "react",          //リアクト
    CONSCIOUS :               "conscious",      //レベル以下即死
    REFRECT :                 "refrect",        //スキルカウンター
    REDAMAGE :                "redamage",       //反ダメージ
    DISCHARGE :               "discharge",      //暴発 
    PENETRATE :               "penetrate",      //貫通 
    IRON_WILL :               "ironwill",       //アイアンウィル
    KISHIKAISEI:              "kishikaisei",    //起死回生
    SELFISH:                  "selfish",    　　//セルフィッシュ
    RESTRICTION:              "restriction",    //状態異常カウンター

    ONE_HANDED:                "Onehanded",      //片手武器
}

Game_StateInfo.prototype.getStateId = function(key) {
  const state = _.find(this._data,(data) => data.key == key);
  if (state == null){
    console.error(key);
  }
  return state.id;
}

Game_StateInfo.prototype.isTotalStateId = function(id) {
    return _.find(this._data,(data) => data.id == id).total;
}

Game_StateInfo.prototype.convertStateIdFromBuffId = function(buffId) {
  let stateId = 0;
  if (buffId == 0){ //HP
    stateId = this.getStateId(StateType.HP_BUFF_ADD);
  } else
  if (buffId == 1){ //MP
    stateId = this.getStateId(StateType.MP_BUFF_ADD);
  } else
  if (buffId == 2){ //ATK
    stateId = this.getStateId(StateType.ATK_BUFF_ADD);
  } else
  if (buffId == 3){ //GUA
    stateId = this.getStateId(StateType.DEF_BUFF_ADD);
  } else
  if (buffId == 6){ //AGI
    stateId = this.getStateId(StateType.AGI_BUFF_ADD);
  }
  return stateId;
}
