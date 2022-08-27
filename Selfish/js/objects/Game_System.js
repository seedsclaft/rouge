Object.defineProperties(Game_System.prototype, {
    backLog: { get: function() { return this._backLog; }, configurable: true }
});

(function() {
    const _initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _initialize.call(this);
        // 敗北回数
        this._loseCount = 0;
        // 撃破数
        this._enemyDefeatCount;
        // 最大ダメージ
        this._maxDamage = 0;
        // アクター別戦闘回数情報
        this._useActorCount = {};
        //this._bgmOnSave = null;
        //this._bgsOnSave = null;
        
        // マップ専用のBgmを保存
        this._mapBgm = null;
        this._mapBgs = null;
        // ターミナルシーン遷移先
        this._resume = "Map_Scene";
    
        //バックログ
        this._backLog = [];
    
        // ミニマップ大きさ
        this._minimapMode = true;

        // オートモード
        this._autoMode = false;
    
        // バトルでメニューを呼んだ
        this._battleCalledMenu = false;
    
        // ターミナルでコンティニューを表示するか
        this._continue = true;
    
        // 連携ツイッター情報
        this._twitter = null;

        // ジャストガード回数
        this._justGuradCount = 0;
    };
})();

Game_System.prototype.initJustGuard = function() {
    if ($gameSystem._justGuradCount == null){
        $gameSystem._justGuradCount = 0;
    }
};

Game_System.prototype.getJustGuard = function() {
    this.initJustGuard();
    return this._justGuradCount;
};

Game_System.prototype.gainJustGuard = function() {
    this.initJustGuard();
    this._justGuradCount += 1;
};

Game_System.prototype.battleCalledMenu = function() {
    return this._battleCalledMenu;
};

Game_System.prototype.setBattleCalledMenu = function(isCalled) {
    this._battleCalledMenu = isCalled;
};

Game_System.prototype.onBeforeSave = function() {
    this._saveCount++;
    this._versionId = $dataSystem.versionId;
    this._framesOnSave = Graphics.frameCount;
};

Game_System.prototype.onAfterLoad = function() {
    Graphics.frameCount = this._framesOnSave;
};

Game_System.prototype.setResume = function(name) {
	this._resume = name;
};

Game_System.prototype.clearResume = function() {
    this._resume = null;
}

Game_System.prototype.resume = function() {
	return this._resume;
};

Game_System.prototype.gainLoseCount = function(value) {
    this._loseCount += value;
};

Game_System.prototype.loseCount = function() {
    if (this._loseCount){
        return this._loseCount;
    }
    return 0;
};

Game_System.prototype.gainEnemyDefeatCount = function(value) {
    if (!this._enemyDefeatCount){
        this._enemyDefeatCount = 0;
    }
    this._enemyDefeatCount += value;
}

Game_System.prototype.enemyDefeatCount = function() {
    return this._enemyDefeatCount;
}

Game_System.prototype.maxDamage = function() {
    return this._maxDamage;
};

Game_System.prototype.checkMaxDamage = function(damage) {
    if (damage > this._maxDamage){
        this._maxDamage = damage;
    }
};

Game_System.prototype.gainUseActorCount = function(actorId) {
    if (!this._useActorCount){
        this._useActorCount = {};
    }
    if (!this._useActorCount[actorId]){
        this._useActorCount[actorId] = 0;
    }
    this._useActorCount[actorId] += 1;
}

Game_System.prototype.useActorCount = function(actorId) {
    return this._useActorCount[actorId];
}

Game_System.prototype.windowPadding = function() {
    return 12;
};