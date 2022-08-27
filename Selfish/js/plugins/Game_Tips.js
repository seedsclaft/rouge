//=============================================================================
// Game_Tips.js
//=============================================================================
/*:
 * @plugindesc Tipsデータ。
 * @author econa
 *
 * @param TipsList
 * @desc Tips
 * @type struct<Tips>[]
 * @default []
 * 
 * */

/*~struct~Tips:
 * @param key
 * @type string
 * @default 
 * 
 * @param id
 * @type number
 * @default 
 * 
 * @param text
 * @type string[]
 * @default 
 * 
 * @param helpText
 * @type note[]
 * @default 
 * 
 * @param mobileMode
 * @type boolean
 * @default false
 * 
 * @param memo
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_Tips
//

function Game_Tips() {
  this.initialize.apply(this, arguments);
}

Game_Tips.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Tips');
    let list = [];
    JSON.parse(this._data.TipsList).forEach(tips => {
        let data = JSON.parse(tips);
        data.key = data.key;
        data.id = Number(data.id);
        data.nameId = Number(data.nameId);
        data.text = JSON.parse(data.text);
        let helpTextList = [];
        data.helpText = JSON.parse(data.helpText);
        data.helpText.forEach(helpData => {
            helpTextList.push(JSON.parse(helpData));
        });
        data.helpText = helpTextList;
        data.mobileMode = data.mobileMode != null ? JSON.parse(data.mobileMode) : false;
        if ($gameDefine.mobileMode == true){
            if (data.mobileMode){
                list[list.length-1] = list;
            } else{
                list.push(data);
            }
        } else{
            if (!data.mobileMode){
                list.push(data);
            }
        }
    });

    this._data = list;
    var tipsText = [];
    var tipsHelpText = [];
};

Game_Tips.prototype.findTips = function() {
    return _.find(this._data,(data) => this.checkTips(data.id) && !$gameParty.checkReadTips(data.id));
}

Game_Tips.prototype.checkTips = function(tipsId) {
    switch (tipsId){
        case 1: // ステージが２・味方の誰か毒状態
        return $gameParty.stageNo() == 2 && _.find($gameParty.members(),(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.POISON)));
        case 2: // ステージが２・味方・敵が拘束状態
        var members = $gameParty.members().concat($gameTroop.members());
        return $gameParty.stageNo() == 2 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.CHAIN_TARGET)));
        case 3: // ステージが４・味方・敵がスタン状態
        var members = $gameParty.members().concat($gameTroop.members());
        return $gameParty.stageNo() == 4 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.STUN)));
        case 4: // ステージが５・味方・敵が挑発状態
        var members = $gameParty.members().concat($gameTroop.members());
        return $gameParty.stageNo() == 5 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.SALT_TARGET)));
        case 5: // ステージが６・敵がカウンター状態
        var members = $gameTroop.members();
        return $gameParty.stageNo() == 6 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.COUNTER)));
        case 6: // ステージが６・味方・敵が鈍足状態
        var members = $gameParty.members().concat($gameTroop.members());
        return $gameParty.stageNo() == 6 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.SLOW)));
        case 7: // ステージが６・味方・敵が凍結状態
        var members = $gameParty.members().concat($gameTroop.members());
        return $gameParty.stageNo() == 6 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.FROZEN)));
        case 8: // ステージが７・味方が炎症状態
        var members = $gameParty.members();
        return $gameParty.stageNo() == 7 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.SICK)));
        case 9: // ステージが８・敵がかばう状態
        var members = $gameTroop.members();
        return $gameParty.stageNo() == 8 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.SUBSTITUTE)));
        case 10: // ステージが９・敵が抵抗状態
        var members = $gameTroop.members();
        return $gameParty.stageNo() == 9 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.RESIST_STATE)));
        case 11: // ステージが９・ボスバトル・敵が成長状態
        var members = $gameTroop.members();
        return $gameParty.stageNo() == 9 && $gameParty.stageData().phase == 'save' && _.find(members,(member) => member.paramPlus(2) > 0);
        case 12: // ステージが１１・味方が呪い状態
        var members = $gameParty.members();
        return $gameParty.stageNo() == 11 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.CURSE)));
        case 13: // ステージが１１・敵がノーコスト状態
        var members = $gameTroop.members();
        return $gameParty.stageNo() == 11 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.NO_COST)));
        case 14: // ステージが１２・味方が集中攻撃状態
        var members = $gameParty.members();
        return $gameParty.stageNo() == 12 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.PROVOCATION)));
        case 15: // ステージが１２・敵が障壁状態
        var members = $gameTroop.members();
        return $gameParty.stageNo() == 12 && _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.DAMAGE_BLOCK)));
        case 16: // 敵がチェイン状態
        // Battleで指定
        return false;
        case 17: // 味方が宣告状態
        var members = $gameParty.members();
        return _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.FINITE)));
        case 18: // 暴発を発動
        // Battleで指定
        return false;
        case 19: // 味方が破砕状態
        var members = $gameParty.members();
        return _.find(members,(member) => member.isStateAffected($gameStateInfo.getStateId(StateType.SHIELD_BREAK)));
        case 41: // シーンがステージでステージが１をクリアしていない・カイトがドレインエナジーを習得済み
        return (SceneManager._scene instanceof Stage_Scene) && $gameParty.stageNo() == 1 && $gameActors.actor(5).hasSkill(231) && !_.find($gameParty.stages(),(stage) => stage.id == 2);
        case 61: // シーンがステージでステージが２をクリアしていない・カイトがリンケージを習得済み
        return (SceneManager._scene instanceof Stage_Scene) && $gameParty.stageNo() == 2 && !_.find($gameParty.stages(),(stage) => stage.id == 3) && $gameActors.actor(5).hasSkill(277);
        case 62: // シーンがステージでステージが５をクリアしていない・戦闘を一回行っている・進捗が５％を超える
        return (SceneManager._scene instanceof Stage_Scene) && $gameParty.stageNo() == 5 && !_.find($gameParty.stages(),(stage) => stage.id == 6) && $gameSystem.useActorCount(3) > 0 && $gameParty.stageProgress() > 0.05;
        case 63: // シーンがステージでステージが５をクリアしていない・戦闘を一回行っている
        return false;//(SceneManager._scene instanceof Stage_Scene) && $gameParty.stageNo() == 5 && !_.find($gameParty.stages(),(stage) => stage.id == 6) && $gameSystem.useActorCount(3) > 1;
        case 81: // シーンがバトルでステージが１・ボスバトルの敵の攻撃後
        return (SceneManager._scene instanceof Battle_Scene) && $gameParty.stageNo() == 1 && $gameTroop.isBoss() && $gameTroop.members()[0]._turnCount == 2;
        case 82: // シーンがバトルでステージが２・ボスバトルの敵のMpが５
        return (SceneManager._scene instanceof Battle_Scene) && $gameParty.stageNo() == 2 && $gameTroop.isBoss() && $gameTroop.members()[1].mp >= 5;
        case 83: // シーンがバトルでステージが３・進捗が５％を超える
        return (SceneManager._scene instanceof Stage_Scene) && $gameParty.stageNo() == 3 && $gameParty.stageProgress() > 0.01;
        case 84: // シーンがステージでステージが８・進捗が５％を超える
        return (SceneManager._scene instanceof Stage_Scene) && $gameParty.stageNo() == 8 && $gameParty.stageProgress() > 0.01;
        case 85: // シーンがバトルでステージが２をクリアしていない・進捗が１０％を超える
        return (SceneManager._scene instanceof Battle_Scene) && $gameParty.stageNo() == 2 && $gameParty.stageProgress() > 0.1;
    }
    return false;
}

Game_Tips.prototype.getTipsData = function(id) {
    const tips = _.find(this._data,(data) => data.id == id);
    if (tips){
        return tips;
    }
    return null;
}

Game_Tips.prototype.getTipsDataByKey = function(key) {
    const tips = _.find(this._data,(data) => data.key == key);
    if (tips){
        return tips;
    }
    return null;
}

Game_Tips.prototype.getTipsText = function(id) {
    return TextManager.getTipsText(id);
}

Game_Tips.prototype.getTipsHelpText = function(id) {
    return TextManager.getTipsHelpText(id);
}


