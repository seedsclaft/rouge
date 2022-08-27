(function() {
    const _clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _clear.call(this);

        // キャラセリフのビジーを管理
        this._eventMessageBusy = false;
    };
})();

Game_Message.prototype.isBusy = function() {
    return (this.hasText() || this.isChoice() ||
            this.isNumberInput() || this.isItemChoice() || this._eventMessageBusy);
};

Game_Message.prototype.setBusy = function(isBusy) {
    this._eventMessageBusy = isBusy;
};