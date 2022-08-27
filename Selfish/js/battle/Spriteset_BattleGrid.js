//-----------------------------------------------------------------------------
// Spriteset_BattleGrid
//
// The sprite for displaying a button.

function Spriteset_BattleGrid() {
    this.initialize.apply(this, arguments);
}

Spriteset_BattleGrid.prototype = Object.create(Sprite.prototype);
Spriteset_BattleGrid.prototype.constructor = Spriteset_BattleGrid;

Spriteset_BattleGrid.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._phase = "init";

    this._battlerLayer = new Sprite();
    this.addChild(this._battlerLayer);
    $gameParty.battleMembers().forEach(actor => {
        var order = new Sprite_BattleOrder();
        order.initialize();
        order.setBattler(actor);
        order.x = Graphics.boxWidth - 168;
        this._battlerLayer.addChild(order);
    });
    $gameTroop.members().forEach(enemy => {
        var order = new Sprite_BattleOrder();
        order.initialize();
        order.setBattler(enemy);
        order.x = Graphics.boxWidth - 88;
        this._battlerLayer.addChild(order);
    });
    var sprite = new Sprite()
    this._nextOrder = new Sprite_BattleOrder();
    this._nextOrder.initialize();
    this._nextOrder.setBattler($gameParty.battleMembers()[0]);
    this._nextOrder.setNextText()
    this._nextOrder.x = Graphics.boxWidth - 168;
    this._nextOrderAnimation = gsap.to(sprite,0.75,{alpha:0.75,repeat:-1,yoyo:true});
    this._nextOrder.opacity = 0;
    this.addChild(sprite);
    sprite.addChild(this._nextOrder);

    this.refresh();
};

Spriteset_BattleGrid.prototype.ready = function() {
    gsap.to(this, 0.5, {pixi:{},onComplete: function(){
        this._phase = "ap";
    }.bind(this)});
}

Spriteset_BattleGrid.prototype.setPhase = function(phase) {
    this._phase = phase;
}

Spriteset_BattleGrid.prototype.refresh = function() {
    this._battlerLayer.children = _.sortBy(this._battlerLayer.children, (sprite) => sprite.battler()._ap);
    this._battlerLayer.children = this._battlerLayer.children.reverse();
    this._battlerLayer.children.forEach(sprite => {
        if (!sprite.battler().isAlive()){
            sprite.alpha = 0;
        } else{
            sprite.alpha = 1;
        }
    });
}

Spriteset_BattleGrid.prototype.refreshPosition = function() {
    this._battlerLayer.children.forEach(sprite => {
        sprite.refreshPosition();
    });
}

Spriteset_BattleGrid.prototype.update = function() {
    switch (this._phase){
        case 'init':
        this._battlerLayer.children.forEach(sprite => {
            sprite.setInitAnim();
        });
        break;
        case 'ap':
        this._battlerLayer.children.forEach(sprite => {
            sprite.setApAnim();
        });
        break;
        case 'wait':
        this._battlerLayer.children.forEach(sprite => {
            sprite.setWaitAnim();
        });
        break;
        case 'action':
        this._battlerLayer.children.forEach(sprite => {
            sprite.setActionAnim();
        });
        break;
    }
}

Spriteset_BattleGrid.prototype.showNextOrder = function(battler,nextap) {
    if (battler && battler.isActor()){
        this._nextOrder.opacity = 255;
        this._nextOrder.changeBattler(battler);
        this._nextOrder.changeFace(battler.characterName());
        this._nextOrder.y = Sprite_BattleOrder._basePositionY - (nextap);
    }
}

Spriteset_BattleGrid.prototype.clearNextOrder = function() {
    this._nextOrder.opacity = 0;
}

Spriteset_BattleGrid.prototype.addTroops = function(troops) {
    troops.forEach(enemy => {
        var order = new Sprite_BattleOrder();
        order.initialize();
        order.setBattler(enemy);
        order.x = Graphics.boxWidth - 88;
        this._battlerLayer.addChild(order);
    });
}

Spriteset_BattleGrid.prototype.terminate = function() {
    this._nextOrderAnimation.kill();
    this._nextOrderAnimation = null;
    for (let i = this._battlerLayer.children.length-1; i >= 0; i--){
        this._battlerLayer.children[i].terminate(); 
    }
    this._nextOrder.terminate();

    this._battlerLayer = null;
    this._nextOrder = null;
    this.destroy();
}

//-----------------------------------------------------------------------------
// Sprite_BattleOrder
//
// The sprite for displaying a button.

function Sprite_BattleOrder() {
    this.initialize.apply(this, arguments);
}
Sprite_BattleOrder.prototype = Object.create(Sprite.prototype);
Sprite_BattleOrder.prototype.constructor = Sprite_BattleOrder;
Sprite_BattleOrder._basePositionY = 320;

Sprite_BattleOrder.prototype.initialize = function() {
    this._baseSize = 144;
    Sprite.prototype.initialize.call(this);
    this._destroySprites = [];
    this._faceSprite = null;
    this._battler = null;
    this._faceLayer = new Sprite();
    this._gridLayer = new Sprite();
    this.addChild(this._gridLayer);
    this.addChild(this._faceLayer);

    this._animation = null;
    this.alpha = 0;
    this._selected = false;
    this._state = 'init';
};

Sprite_BattleOrder.prototype.battler = function() {
    return this._battler;
};

Sprite_BattleOrder.prototype.setBattler = function(battler) {
    this._battler = battler;
    this.setBack();
    this.setFace();
    this.setSquare();
    if (!battler.isActor()){
        this.setEnemyNumber();
    }
    //this.setMask();
};

Sprite_BattleOrder.prototype.setBack = function() {
    this._backSprite = new PIXI.Graphics();
    this._backSprite.beginFill(0x000000);

    this._backSprite.drawRect(0, 0, 80, 64);
    this._backSprite.alpha = 0;
    this._faceLayer.addChild(this._backSprite);
};

Sprite_BattleOrder.prototype.setFace = function() {
    this._faceSprite = new Sprite();
    this._faceSprite.scale.x = 0.5;
    this._faceSprite.scale.y = 0.5;
    this._faceSprite.x += 8;
    if (this._battler.isActor()){
        this._faceSprite.bitmap = ImageManager.loadFace(this._battler.characterName());
        this._faceSprite.setFrame(0, 0, this._baseSize - 16, this._baseSize - 20);
    } else{        
        this._faceSprite.bitmap = ImageManager.loadEnemy(this._battler.battlerName());
        
        this._faceSprite.x += 2;
        this._faceSprite.scale.x = 0.75;
        this._faceSprite.scale.y = 0.75;
        const enemyData = $dataEnemies[this._battler.enemyId()];
        if (enemyData){
            const hue = enemyData.battlerHue;
            if (hue){
                this._faceSprite.setHue(hue);
            }
            this._faceSprite.setFrame(0, 0, this._baseSize -64, this._baseSize - 60);
        } else{
            this._faceSprite.setFrame(0, 0, this._baseSize -64, this._baseSize - 60);    
        }
    }
    this._faceLayer.addChild(this._faceSprite);
};

Sprite_BattleOrder.prototype.setSquare = function() {
    this._squareSprite = new Sprite();
    if (this._battler.isActor()){
        this._squareSprite.bitmap = ImageManager.loadSystem('gridSquare');
        this._squareSprite.x += 8;
        this._squareSprite.y -= 1;
    } else{
        this._squareSprite.bitmap = ImageManager.loadSystem('gridSquare2');
    }
    this.addChild(this._squareSprite);
};

Sprite_BattleOrder.prototype.setEnemyNumber = function() {
    if (!this._battler._plural){
        return;
    }
    var sprite = new Sprite();
    var bitmap = new Bitmap(64,64);
    bitmap.drawText(this._battler._letter,0,0,64,64,'center',true);
    sprite.bitmap = bitmap;
    sprite.x = 36;
    sprite.y = 28;
    sprite.scale.x = 0.75;
    sprite.scale.y = 0.75;
    this.addChild(sprite);
    this._destroySprites.push(sprite);
};

Sprite_BattleOrder.prototype.setNextText = function() {
    var sprite = new Sprite();
    var bitmap = new Bitmap(64,64);
    sprite.scale.x = sprite.scale.y = 0.75
    bitmap.drawText("Next",0,0,64,64,'right',true);
    sprite.bitmap = bitmap;
    sprite.x = 22;
    sprite.y = 36;
    this.addChild(sprite);
    this._destroySprites.push(sprite);
};


Sprite_BattleOrder.prototype.changeBattler = function(battler) {
    this._battler = battler;
};

Sprite_BattleOrder.prototype.changeFace = function(fileName) {
    this._faceSprite.bitmap = ImageManager.loadFace(fileName);
    this._faceSprite.setFrame(0, 0, this._baseSize-16, this._baseSize - 20);
};

/*
Sprite_BattleOrder.prototype.setMask = function() {
    this._maskGraphic = new PIXI.Graphics();
    this._maskGraphic.beginFill(0x000000);
    this._maskGraphic.drawRect(8, 0, 80, 80);
    this._maskGraphic.endFill();
    this._faceLayer.addChild(this._maskGraphic);
    this._faceLayer.mask = this._maskGraphic;
}
*/

Sprite_BattleOrder.prototype.ap = function() {
    return this._ap;
}

Sprite_BattleOrder.prototype.setInitAnim = function() {
    if (this._animation){
        this._animation.kill();
    }
    this._animation = gsap.to(this,0.25,{alpha:1,y:Sprite_BattleOrder._basePositionY - this.battler()._ap})
}

Sprite_BattleOrder.prototype.refreshPosition = function() {
    this.y = Sprite_BattleOrder._basePositionY - this.battler()._ap;
}

Sprite_BattleOrder.prototype.setApAnim = function() {
    if (this._animation){
        this._animation.kill();
    }
    this.y = Sprite_BattleOrder._basePositionY - this.battler()._ap;
}

Sprite_BattleOrder.prototype.setWaitAnim = function() {
    var enemy =_.filter($gameTroop.members(),(enemy) => enemy.isSelected())
    if (_.find(enemy,(e) => e == this.battler())){
        if (this._selected){
            return
        }
        this._selected = true;
        if (this._animation){
            this._animation.kill();
        }
        this._animation = gsap.to(this,0.4,{alpha:0.75,repeat:-1,yoyo:true});
    } else{
        if (this._animation){
            this._animation.kill();
        }
        if (this._battler.isAlive()){
            this.alpha = 1;
        }
        this._selected = false;
    }
}

Sprite_BattleOrder.prototype.setActionAnim = function() {
    this._state = 'action';
    if (this._animation){
        this._animation.kill();
    }
    this._animation = gsap.to(this,0.25,{y:Sprite_BattleOrder._basePositionY - this.battler()._ap});
}

Sprite_BattleOrder.prototype.terminate = function() {
    this._faceSprite.destroy();
    this._faceSprite = null;
    this._maskGraphic = null;
    this._gridLayer = null;
    this._squareSprite.destroy();
    this._squareSprite = null;
    
    this._backSprite = null;
    this._battler = null;
    this._faceLayer = null;
    this._destroySprites.forEach(sprite => {
        sprite.destroy();
        sprite = null;
    });
    if (this._animation){
        this._animation.kill();
    }
    this._animation = null;
    this._destroySprites = null;
    //this.destroy();
}
