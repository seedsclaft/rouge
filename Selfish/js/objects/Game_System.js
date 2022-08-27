Object.defineProperties(Game_System.prototype, {
    backLog: { get: function() { return this._backLog; }, configurable: true }
});

(function() {
    const _initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _initialize.call(this);
        // 敗北回数
        //this._bgmOnSave = null;
        //this._bgsOnSave = null;
        
        // マップ専用のBgmを保存
        this._mapBgm = null;
        this._mapBgs = null;
    
        //バックログ
        this._backLog = [];
    
        // ミニマップ大きさ
        this._minimapMode = true;

    };
})();

Game_System.prototype.onBeforeSave = function() {
    this._saveCount++;
    this._versionId = $dataSystem.versionId;
    this._framesOnSave = Graphics.frameCount;
};

Game_System.prototype.onAfterLoad = function() {
    Graphics.frameCount = this._framesOnSave;
};

Game_System.prototype.windowPadding = function() {
    return 12;
};