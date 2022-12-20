//-----------------------------------------------------------------------------
// Window_PartyCommand
//

function Window_PartyCommand() {
    this.initialize.apply(this, arguments);
}

Window_PartyCommand.prototype = Object.create(Window_Command.prototype);
Window_PartyCommand.prototype.constructor = Window_PartyCommand;

Window_PartyCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, new Rectangle( -40, 184 ,1080, 160));
    this.openness = 0;
    this._canRepeat = false;
    this.hide();
    this.deactivate();
    this._cursorSprite.opacity = 0;
};

Window_PartyCommand.prototype.itemWidth = function() {
    return 200;
}

Window_PartyCommand.prototype.itemHeight = function() {
    return 40;
}

Window_PartyCommand.prototype.itemRect = function(index) {
    let rect = new Rectangle();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = 280 * index + 280;
    rect.y = 80;
    return rect;
}

Window_PartyCommand.prototype.refresh = function() {
    this.createContents();
    Window_Command.prototype.refresh.call(this);
    this.drawText(TextManager.getText(601110),40,20,960,'center');
}

Window_PartyCommand.prototype.maxCols = function() {
    return 2;
};

Window_PartyCommand.prototype.itemTextAlign = function() {
    return 'center';
};

Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.getText(601000),  'fight');
    this.addCommand(TextManager.getText(601100), 'menu', true);
};

Window_PartyCommand.prototype.setup = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.refresh();
    this.select(Window_PartyCommand._lastCommand);
    this.activate();
    this.open();
};
Window_PartyCommand.prototype._updatePauseSign = function() {
}
Window_PartyCommand.prototype._updateArrows = function() {
}
Window_PartyCommand.prototype._updateContentsBack = function() {
}
Window_PartyCommand.prototype._updateCursor = function() {
}
Window_PartyCommand.prototype.drawItem = function(index) {
    const rect = this.itemRect(index);
    const align = this.itemTextAlign();
    if (index == this.index()){
        this.resetTextColor();
        this.drawBack(rect.x, rect.y , rect.width,rect.height ,"rgba(216,96,132,255)",164);
        Window_PartyCommand._lastCommand = index;
    }
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
}
Window_PartyCommand.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    if (this._lastIndex != this.index()){
        this._lastIndex = this.index();
        this.refresh();
    }
}

Window_PartyCommand._lastCommand = 0;