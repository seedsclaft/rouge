//-----------------------------------------------------------------------------
// Game_CharacterBase
//
// The superclass of Game_Character. It handles basic information, such as
// coordinates and images, shared by all characters.

Game_CharacterBase.prototype.initMembers = function() {
    this._x = 0;
    this._y = 0;
    this._realX = 0;
    this._realY = 0;
    this._tempX = 0;
    this._moveSpeed = 4;
    //0820 基本的に上が正面
    this._direction = 8;
    this._priorityType = 1;
    this._tileId = 0;
    this._characterName = '';
    this._characterIndex = 0;
    this._isObjectCharacter = false;
    this._directionFix = false;
    this._through = false;
    this._animationId = 0;
    this._animationPlaying = false;
    this._jumpCount = 0;
    this._jumpPeak = 0;
    this._movementSuccess = true;
    this._lastInputDir = 0;
    this._inputingDir = 0;
    this._stopCount = 0;
};

Game_CharacterBase.prototype.isMoving = function() {
    return this._realX !== this._x || this._realY !== this._y || this._tempX !== this._x;
};

Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
    return this.isCollidedWithEvents(x, y);
};

Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
    var events = $gameMap.eventsXyNt(x, y);
    return events.some(function(event) {
        return event.isNormalPriority();
    });
};

Game_CharacterBase.prototype.setPosition = function(x, y) {
    this._x = Math.round(x);
    this._y = Math.round(y);
    this._realX = x;
    this._tempX = x;
    this._realY = y;
};

Game_CharacterBase.prototype.copyPosition = function(character) {
    this._x = character._x;
    this._y = character._y;
    this._realX = character._realX;
    this._realY = character._realY;
    this._tempX = character._tempX;
    this._direction = character._direction;
};

Game_CharacterBase.prototype.locate = function(x, y) {
    this.setPosition(x, y);
};

Game_CharacterBase.prototype.setDirection = function(d) {
    if (!this.isDirectionFixed() && d) {
        this._direction = d;
    }
    this.resetStopCount();
};

Game_CharacterBase.prototype.update = function() {
    if (this.isStopping()) {
        //this.updateStop();
    }
    if (this.isJumping()) {
        this.updateJump();
    } else if (this.isMoving()) {
        this.updateMove();
    }
};

Game_CharacterBase.prototype.updateStop = function() {
    //this._stopCount++;
};

Game_CharacterBase.prototype.updateJump = function() {
    this._jumpCount--;
    this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
    this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
    if (this._jumpCount === 0) {
        this._realX = this._x = $gameMap.roundX(this._x);
        this._realY = this._y = $gameMap.roundY(this._y);
    }
};

Game_CharacterBase.prototype.updateMove = function() {
    if (this._x < this._realX) {
        this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
    }
    if (this._x > this._realX) {
        this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
    }
    if (this._x < this._tempX) {
        this._tempX = Math.max(this._tempX - this.distancePerFrame(), this._x);
    }
    if (this._x > this._tempX) {
        this._tempX = Math.min(this._tempX + this.distancePerFrame(), this._x);
    }
    if (this._y < this._realY) {
        this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
    }
    if (this._y > this._realY) {
        this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
    }
};

Game_CharacterBase.prototype.increaseSteps = function() {
    if (this.isOnLadder()) {
        this.setDirection(8);
    }
};

Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
    if (Math.abs(xPlus) > Math.abs(yPlus)) {
        if (xPlus !== 0) {
            this.setDirection(xPlus < 0 ? 4 : 6);
        }
    } else {
        if (yPlus !== 0) {
            this.setDirection(yPlus < 0 ? 8 : 2);
        }
    }
    this._x += xPlus;
    this._y += yPlus;
    var distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
    this._jumpPeak = 10 + distance - this._moveSpeed;
    this._jumpCount = this._jumpPeak * 2;
};

Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
};

Game_Character.prototype.setMoveRoute = function(moveRoute) {
    this._moveRoute = moveRoute;
    this._moveRouteIndex = 0;
    this._moveRouteForcing = false;
};

Game_CharacterBase.prototype.checkStop = function(threshold) {
    return this._stopCount >= 8;
};

Game_CharacterBase.prototype.resetStopCount = function() {
    if (this._stopCount >= 8){
        this._stopCount -= 8;
    }
};

Game_CharacterBase.prototype.setStopCount = function(value) {
    this._stopCount = value;
};

Game_Player.prototype.initMembers = function() {
    Game_Character.prototype.initMembers.call(this);
    this._dashing = false;
    this._needsMapReload = false;
    this._transferring = false;
    this._newMapId = 0;
    this._newX = 0;
    this._newY = 0;
    this._newDirection = 0;
    this._fadeType = 0;


    this._lastMapId = -1;
    this._lastMapBG1 = "";
    this._lastMapBG2 = "";

    //足音データ
    this.resetStepSound();

    this._destinationEvent = [];

    this._battleState = false;
};

Game_Player.prototype.setStepSound = function(name,volume,pitch,pan) {
    this._stepSound  = {
        name: name,
        volume: volume,
        pitch: pitch,
        pan: pan,
    };
};

Game_Player.prototype.resetStepSound = function() {
    this._stepSound = {name:"Foot1",volume:80,pitch:100,pan:0};
};

Game_Player.prototype.refresh = function() {
    var actor = $gameParty.leader();
    var characterName = actor ? actor.characterName() : '';
    var characterIndex = actor ? actor.characterIndex() : 0;
    this.setImage(characterName, characterIndex);
};

Game_Player.prototype.isNormal = function() {
    return !this.isMoveRouteForcing();
};

Game_Player.prototype.locate = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this.center(x, y);
    //this.makeEncounterCount();
};

Game_Player.prototype.startMapEventPlayer = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
        var x = $gameMap.roundXWithDirection(this._x, this.direction());
        var y = $gameMap.roundYWithDirection(this._y, this.direction());
        $gameMap.eventsXy(x, y).forEach(function(event) {
            //if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
            if (event.isTriggerIn(triggers)) {
                event.start();
            }
        });
    }
};
// 移動を2Dダンジョン風に
Game_Player.prototype.moveStraight = function(d) {
    if (Input.dir4 == 0){
        return;
    }
    if (this.direction() == DirectionType.Right){
        d = Direction.getRight(d);
    } else
    if (this.direction() == DirectionType.Left){
        d = Direction.getLeft(d);
    } else
    if (this.direction() == DirectionType.Down){
        d = Direction.getBack(d);
    }
    if (Input.dir4 == DirectionType.Up){
        this.setMovementSuccess(this.canPass(this._x, this._y, d));
    } else{
        this.setMovementSuccess(true);
    }
    if (this.isMovementSucceeded()) {
        this.setDirection(d);
        if (Input.dir4 == DirectionType.Up){
            this._x = $gameMap.roundXWithDirection(this._x, d);
            this._y = $gameMap.roundYWithDirection(this._y, d);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
        }
        EventManager.moveActors(Input.dir4);
        AudioManager.playSe($gamePlayer._stepSound);
        BackGroundManager.changeBackGroundByTile();

        this._tempX += 1;
        this.increaseSteps();
    }
};

Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
        const direction = Input.dir4;
        if (direction != 8) {
            this.moveStraight(direction);
        }
    }
};

Game_Player.prototype.checkMoveStraightPlayer = function() {
    if (!this.isMoving() && this.canMove()) {
        const direction = Input.dir4;
        if (direction == 8) {
            return true;
        }
    }
    return false;
};


Game_Player.prototype.canMove = function() {
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        return false;
    }
    if (this.isMoveRouteForcing()) {
        return false;
    }
    return true;
};

Game_Player.prototype.update = function(sceneActive) {
    const lastScrolledX = this.scrolledX();
    const lastScrolledY = this.scrolledY();
    const wasMoving = this.isMoving();
    this.updateDashing();
    if (sceneActive) {
        this.moveByInput();
    }
    Game_Character.prototype.update.call(this);
    this.updateScroll(lastScrolledX, lastScrolledY);
    //this.updateVehicle();
    if (!this.isMoving()) {
        this.updateNonmoving(wasMoving, sceneActive);
    }
    //this._followers.update();
};

Game_Player.prototype.updateDashing = function() {
    if ($gameDefine.mobileMode){
        return;
    }
    if (this._moveRouteForcing){
        return;
    }
    // 長押しでダッシュ
    if (Input._pressedUpTime > 60){
        //this.setMoveSpeed(5);
    } else{
        this.setMoveSpeed(4);
    }
};


Game_Player.prototype.updateNonmoving = function(wasMoving) {
    if (!$gameMap.isEventRunning()) {
        if (wasMoving) {
            //$gameParty.onPlayerWalk();
            this.checkEventTriggerHere([1,2]);
            if ($gameMap.setupStartingEvent()) {
                return;
            }
        }
        if (this.triggerAction()) {
            return;
        }
        $gameTemp.clearDestination();
    }
};

Game_Player.prototype.triggerButtonAction = function() {
    if (Input.isTriggered('ok')) {
        if ($gameDefine.mobileMode){
            return true;
        }
        this.checkEventTriggerMapHere([0]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
    }
    return false;
};


Game_Player.prototype.triggerTouchActionD1 = function(x1, y1) {
    this.checkEventTriggerHere([0]);
    return $gameMap.setupStartingEvent();
};

Game_Player.prototype.triggerTouchActionD2 = function(x2, y2) {
    this.checkEventTriggerThere([0,1,2]);
    return $gameMap.setupStartingEvent();
};

Game_Player.prototype.triggerTouchActionD3 = function(x2, y2) {
    if ($gameMap.isCounter(x2, y2)) {
        this.checkEventTriggerThere([0,1,2]);
    }
    return $gameMap.setupStartingEvent();
};

Game_Player.prototype.canEncounter = function() {
    return (!$gameParty.hasEncounterNone() && $gameSystem.isEncounterEnabled() &&
            !this.isMoveRouteForcing() && !this.isDebugThrough());
};

Game_Player.prototype.checkFrontEvent = function() {
    let data = null;
    const x = $gameMap.roundXWithDirection(this._x, this.direction());
    const y = $gameMap.roundYWithDirection(this._y, this.direction());
    $gameMap.eventsXy(x, y).forEach(function(event) {
        if (event.isTriggerIn([0,1,2])) {
            data = event;
        }
    });
    return data;
};

Game_Player.prototype.checkNearEvents = function() {
    let data = [];
    [2,4,6,8].forEach(dir => {
        if (dir == this.direction()){
            return;
        }
        let x = $gameMap.roundXWithDirection(this._x, dir);
        let y = $gameMap.roundYWithDirection(this._y, dir);
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if (event.isTriggerIn([0,1,2]) && event.isNormalPriority() === true) {
                data.push(event);
            }
        });
    });
    return data;
};

Game_Player.prototype.checkEventTriggerMapHere = function(triggers) {
    if (this.canStartLocalEvents()) {
        this.startMapEventPlayer(this.x, this.y, triggers, true);
    }
};

Game_Player.prototype.checkEventTriggerTouch = function(x, y) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(x, y, [1,2], true);
    }
};

Game_Player.prototype.canStartLocalEvents = function() {
    return true;
};

Game_Player.prototype.forceMoveForward = function() {
    this.setThrough(true);
    this.moveForward();
    this.setThrough(false);
};

Game_Player.prototype.isOnDamageFloor = function() {
    return $gameMap.isDamageFloor(this.x, this.y);
};

Game_Player.prototype.moveDiagonally = function(horz, vert) {
    Game_Character.prototype.moveDiagonally.call(this, horz, vert);
};

Game_Player.prototype.jump = function(xPlus, yPlus) {
    Game_Character.prototype.jump.call(this, xPlus, yPlus);
    BackGroundManager.jump();
};

Game_Player.prototype.vehicle = function() {
    return null;
};

Game_Player.prototype.isCollided = function(x, y) {
    if (this.isThrough()) {
        return false;
    } else {
        return this.pos(x, y);
    }
};

Game_Event.prototype.setupEvent = function(eventData) {
    if (eventData.name.includes('Enemy')){
        const args = eventData.name.split(",");
        this._enemy = new Game_Enemy(Number( args[1] ),0,0,Number ( args[2]) );
        this._enemyState = EnemyState.Wait;
        this._distTurn = 0;
        this._eventType = EventType.Enemy;
    } else
    if (eventData.name.includes('Box')){
        this._eventType = EventType.Box;
    } else
    if (eventData.name.includes('Event')){
        this._eventType = EventType.Event;
    }
};

Game_Event.prototype.eventType = function() {
    return this._eventType;
}

Game_Event.prototype.checkMoveType = function() {
    if (this._enemy == null){
        return false;
    }
    if (this._enemy.isDead()){
        this.changeState(EnemyState.Dead);
        return 0;
    }
    const sight = this._enemy.mat;
    const x1 = this.x;
    const y1 = this.y;
    const x2 = $gamePlayer.x;
    const y2 = $gamePlayer.y;
    let diff = 0;
    if (x1 >= x2) diff += x1 - x2;
    if (x1 < x2) diff += x2 - x1;
    if (y1 >= y2) diff += y1 - y2;
    if (y1 < y2) diff += y2 - y1;
    if (sight < diff){
        this._distTurn += 1;
        if (this._distTurn > 8){
            this.changeState(EnemyState.None);
        }
    } else
    if (sight == diff){
        this.changeState(EnemyState.Caution);
    } else
    if (sight > diff){
        this.changeState(EnemyState.Battle);
    }
    return this._moveType;
}

Game_Event.prototype.setMoveType = function(moveType) {
    this._moveType = moveType;
};

Game_Event.prototype.changeState = function(state) {
    this._enemyState = state;
    switch (state){
        case EnemyState.Battle:
            this.setMoveType(2);
            break;
    }
}

Game_Event.prototype.setupPage = function() {
    if (this._pageIndex >= 0) {
        this.setupPageSettings();
    } else {
        this.clearPageSettings();
    }
    this.clearStartingFlag();
    this.checkEventTriggerAuto();
};


Game_Event.prototype.stopCountThreshold = function() {
    return 8;
};

Game_Event.prototype.plusStopCount = function() {
    if (this._moveType == 0){
        return;
    }
    switch (this.moveFrequency()){
        case 1: // 1/4倍    
            this._stopCount += 2;
            break;
        case 2:
            this._stopCount += 4;
            break;
        case 3: // 等倍
            this._stopCount += 8;
            break;
        case 4:
            this._stopCount += 16;
            break;
        case 5: // 4倍
            this._stopCount += 32;
            break;
    }
};

Game_Event.prototype.moveTypeTowardPlayer = function() {
    if (this.isNearThePlayer()) {
        switch (Math.randomInt(6)) {
            case 0:
            case 1:
            case 2:
            case 3:
                this.moveTowardPlayer();
                break;
            case 4:
                this.moveTowardPlayer();
                break;
            case 5:
                this.moveTowardPlayer();
                break;
        }
    } else {
        this.moveRandom();
    }
};

class Direction {
    static getLeft(d){
        switch (d){
            case DirectionType.Down:
            return DirectionType.Right;
            case DirectionType.Left:
            return DirectionType.Down;
            case DirectionType.Right:
            return DirectionType.Up;
            case DirectionType.Up:
            return DirectionType.Left;
        }
    }
    static getRight(d){
        switch (d){
            case DirectionType.Down:
            return DirectionType.Left;
            case DirectionType.Left:
            return DirectionType.Up;
            case DirectionType.Right:
            return DirectionType.Down;
            case DirectionType.Up:
            return DirectionType.Right;
        }
    }
    static getBack(d){
        switch (d){
            case DirectionType.Down:
            return DirectionType.Up;
            case DirectionType.Left:
            return DirectionType.Right;
            case DirectionType.Right:
            return DirectionType.Left;
            case DirectionType.Up:
            return DirectionType.Down;
        }
    }
}

var DirectionType = {
    Down : 2,
    Left : 4,
    Right : 6,
    Up : 8
}

var EventType = {
    None : 0,
    Enemy : 1,
    Box : 2,
    Event : 3
}

var EnemyState = {
    None : 0,
    Wait : 1,
    Caution : 2,
    Battle : 3,
    Dead: 4
}