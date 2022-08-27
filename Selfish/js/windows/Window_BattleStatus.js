//-----------------------------------------------------------------------------
// Window_BattleStatus
//
// The window for displaying the status of party members on the battle screen.

function Window_BattleStatus() {
    this.initialize.apply(this, arguments);
}

Window_BattleStatus.prototype = Object.create(Window_Selectable.prototype);
Window_BattleStatus.prototype.constructor = Window_BattleStatus;

Window_BattleStatus.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = Graphics.boxWidth - (width/2);
    var y = Graphics.boxHeight - height;
    Window_Selectable.prototype.initialize.call(this,new Rectangle( x, y, width, height ));
    this.opacity = 0;
    this.deactivate();
};

Window_BattleStatus.prototype.maxCols = function() {
    return this.maxItems();
};

Window_BattleStatus.prototype.itemHeight = function() {
    return 64;
};

Window_BattleStatus.prototype.windowWidth = function() {
    return 840;
};

Window_BattleStatus.prototype.windowHeight = function() {
    return 96;
};

Window_BattleStatus.prototype.maxItems = function() {
    return $gameParty.battleMembers().length;
};

Window_BattleStatus.prototype.refresh = function() {
};

Window_BattleStatus.prototype.drawItem = function(index) {
};

//-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.

function Window_BattleActor() {
    this.initialize.apply(this, arguments);
}

Window_BattleActor.prototype = Object.create(Window_BattleStatus.prototype);
Window_BattleActor.prototype.constructor = Window_BattleActor;

Window_BattleActor.prototype.initialize = function(x, y) {
    Window_BattleStatus.prototype.initialize.call(this);
    this.x = x;
    this.y = y;
    this.width = $gameParty.battleMembers().length * 296;
};

Window_BattleActor.prototype.drawItem = function() {
}

Window_BattleActor.prototype.show = function() {
    Window_BattleStatus.prototype.show.call(this);
};

Window_BattleActor.prototype.hide = function() {
    Window_BattleStatus.prototype.hide.call(this);
    $gameParty.aliveMembers().forEach(actor => {
        actor.deselect();
    });
};

Window_BattleActor.prototype.select = function(index) {
    Window_BattleStatus.prototype.select.call(this, index);
    this._cursorAll = false;
    $gameParty.select(this.actor());
};

Window_BattleActor.prototype.selectAll = function() {
    $gameParty.aliveMembers().forEach(actor => {
        actor.select();
    });
    this._cursorAll = true;
};

Window_BattleActor.prototype.actor = function() {
    return $gameParty.battleMembers()[this.index()];
};

Window_BattleActor.prototype.commandSelect = function(index) {
    if (index == 1){
        if (this._index == 1){
            this.cursorRight();
        }
    }
    //SoundManager.playCursor();
    $gameParty.select($gameParty.battleMembers()[index]);
    //this._index = index;
    //this.reselect();
};

Window_BattleActor.prototype.updateHelp = function() {
    //Window_Selectable.prototype.updateHelp.call(this);
    if (this.actor()) {
    	this.setHelpWindowItem(this.actor());
    }
};

Window_BattleActor.prototype._updateCursor = function() {
};
Window_BattleActor.prototype._refreshCursor = function() {
}


//-----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.

function Window_BattleEnemy() {
    this.initialize.apply(this, arguments);
}

Window_BattleEnemy.prototype = Object.create(Window_Selectable.prototype);
Window_BattleEnemy.prototype.constructor = Window_BattleEnemy;

Window_BattleEnemy.prototype.initialize = function() {
    this._enemies = [];
    this._battlerStatusSprite = [];
    Window_Selectable.prototype.initialize.call(this, new Rectangle( 0, 0, 0, 0 ));
    this.opacity = 0;
    this.refresh();
};

Window_BattleEnemy.prototype.maxCols = function() {
    return $gameTroop.aliveMembers().length;
};

Window_BattleEnemy.prototype.maxItems = function() {
    return this._enemies.length;
};

Window_BattleEnemy.prototype.enemy = function() {
    return this._enemies[this.index()];
};

Window_BattleEnemy.prototype.enemyIndex = function() {
    var enemy = this.enemy();
    return enemy ? enemy.index() : -1;
};

Window_BattleEnemy.prototype.show = function() {
    Window_Selectable.prototype.show.call(this);
};

Window_BattleEnemy.prototype.deactivate = function() {
    Window_Selectable.prototype.deactivate.call(this);
    $gameTroop.select(null);
};

Window_BattleEnemy.prototype.refresh = function() {
    this._enemies = $gameTroop.aliveMembers();
    Window_Selectable.prototype.refresh.call(this);
    this._battlerStatusSprite.forEach((sprite,index) => {
        sprite.changeHp();
        sprite.changeMp();
        if (this._enemies && !this._enemies[index].isAlive()){
            sprite.opacity = 0;
        }
    });
};

Window_BattleEnemy.prototype.select = function(index) {
    Window_Selectable.prototype.select.call(this, index);
    this._cursorAll = false;
    $gameTroop.select(this.enemy());
};

Window_BattleEnemy.prototype.selectTarget = function(target) {
    this._cursorAll = false;
    var index = -1;
    if (target){
        index = _.findIndex(this._enemies,target);
    }
    if (index < 0){
        Window_Selectable.prototype.select.call(this, 0);
        $gameTroop.select(this._enemies[0]);
        return
    }
    Window_Selectable.prototype.select.call(this, index);
    $gameTroop.select(target);
};

Window_BattleEnemy.prototype.updateCursor = function() {
    return;
};
Window_BattleEnemy.prototype._refreshCursor = function() {
}

Window_BattleEnemy.prototype.updateHelp = function() {
    //Window_Selectable.prototype.updateHelp.call(this);
    if (this.enemy()) {
    	this.setHelpWindowItem(this.enemy());
    }
};

Window_BattleEnemy.prototype.selectAll = function() {
    $gameTroop.aliveMembers().forEach(enemy => {
        enemy.select();
    });
    this._cursorAll = true;
};
Window_BattleEnemy.prototype.loadWindowskin = function() {
};
Window_BattleEnemy.prototype._updateCursor = function() {
};
Window_BattleEnemy.prototype._updateFrame = function() {
}
Window_BattleEnemy.prototype._updateContentsBack = function() {
}
Window_BattleEnemy.prototype._updatePauseSign = function() {
}
Window_BattleEnemy.prototype._updateArrows = function() {
}
Window_BattleEnemy.prototype.updateBackOpacity = function() {
};
Window_BattleEnemy.prototype.loadWindowskin = function() {
};

Window_BattleEnemy.prototype._createAllParts = function() {
    this._createContainer();
    /*
    this._createBackSprite();
    this._createFrameSprite();
    this._createContentsBackSprite();
    this._createPauseSignSprites();
    this._createCursorSprite();
    this._createArrowSprites();
    */
    this._createClientArea();
    this._createContentsSprite();
};

Window_BattleEnemy.prototype._refreshAllParts = function() {
    /*
    this._refreshBack();
    this._refreshFrame();
    this._refreshCursor();
    this._refreshPauseSign();
    this._refreshArrows();
    */
};