//-----------------------------------------------------------------------------
// Window_WebView
//
// The window for selecting a skill on the skill screen.

function Window_WebView() {
    this.initialize.apply(this, arguments);
}

Window_WebView.prototype = Object.create(Window_Selectable.prototype);
Window_WebView.prototype.constructor = Window_WebView;

Window_WebView.prototype.initialize = function(x, y, width,height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width,height);
};

Window_WebView.prototype.setDataList = function(data) {
    this._data = data;
    this.refresh();
};

Window_WebView.prototype.contentsHeight = function() {
    return this.height;
};

Window_WebView.prototype.itemHeight = function() {
    return 48;
};

Window_WebView.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_WebView.prototype.item = function() {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

Window_WebView.prototype.isCurrentItemEnabled = function() {
    return true;
};

Window_WebView.prototype.selectLast = function() {
    this.select(this.index() >= 0 ? this.index() : 0);
    this.refresh();
};

Window_WebView.prototype.drawItem = function(index) {
    var record = this._data[index];
    if (record){
        var rect = this.itemRect(index);
        this.resetTextColor();
        this.setFlatMode();
        if (this.index() == index){
            this.drawBackSkewX(rect.x + 10 * (index - this.topIndex()),rect.y+1,rect.width-2,this.itemHeight()-2,this.cursorColor(),128);
            this.resetTextColor();
        }
        this.drawText(record._text,rect.x + 36, rect.y + 2, rect.width - 60);
        //this.drawText(this.commandName(index), rect.x + 36, rect.y+2, rect.width, "left");
    }
};

Window_WebView.prototype.refresh = function() {
    this.createContents();
    this.drawLine();
    this.drawAllItems();
};

Window_WebView.prototype.drawLine = function() {
    var y = 2;
    var width = 160;
}

Window_WebView.prototype.actorName = function() {
    if (this.item() == null){
        return null;
    }
    if (this.item()._type == Game_ResultType.Base){
        return this.item().actor().faceName;
    }
    if (this.item()._type == Game_ResultType.Battle){
        return this.item().actor().faceName;
    }
    return null;
};

Window_WebView.prototype._updateCursor = function() {
};

Window_WebView.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
};