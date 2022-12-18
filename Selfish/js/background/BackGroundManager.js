//-----------------------------------------------------------------------------
// BackGroundManager
//
// The static class that manages battle progress.

function BackGroundManager() {
    throw new Error('This is a static class');
}

//シーンブートで作成
BackGroundManager.init = function() {
    this._backGroundView = new View_BackGround();
}

//シーンスタートの最後に呼ぶ
BackGroundManager.resetup = function() {
    this._backGroundView.resetup();
}

BackGroundManager.backSprite1 = function() {
    return this._backGroundView.backSprite1();
}

BackGroundManager.moveFront = function(rate) {
    this._backGroundView.moveFront(rate);
}

BackGroundManager.moveFrontStage = function(rate) {
    this._backGroundView.moveFrontStage(rate);
}

BackGroundManager.moveFrontStageRepeat = function(rate,repeatWait) {
    this._backGroundView.moveFrontStageRepeat(rate,repeatWait);
}

BackGroundManager.moveStop = function() {
    this._backGroundView.moveStop();
}

BackGroundManager.moveLeft = function(rate) {
    this._backGroundView.moveLeft(rate);
}

BackGroundManager.moveRight = function(rate) {
    this._backGroundView.moveRight(rate);
}

BackGroundManager.startTint = function(color,duration) {
    this._backGroundView.startTint(duration,color);
}

BackGroundManager.update = function() {
    if (this._backGroundView) this._backGroundView.update();
}

BackGroundManager.changeBackGround = function(name1,name2) {
    this._backGroundView.changeBackGround1(name1);
    this._backGroundView.changeBackGround2(name2);

}

BackGroundManager.autotileType = function(z) {
    return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
};

BackGroundManager.regionId = function() {
    const dir = $gamePlayer.direction();
    switch (dir){
        case 2:
        return $gameMap.regionId($gamePlayer.x, $gamePlayer.y+1);
        case 4:
        return $gameMap.regionId($gamePlayer.x-1, $gamePlayer.y);
        case 6:
        return $gameMap.regionId($gamePlayer.x+1, $gamePlayer.y);
        case 8:
        return $gameMap.regionId($gamePlayer.x, $gamePlayer.y-1);
    }
};

BackGroundManager.changeBackGroundByTile = function() {
    let changeBgName = "";
    if (this.regionId() == 0){
        changeBgName = $dataMap.battleback1Name;
    } else if ($gameMap.regionList() && $gameMap.regionList().length > 0){
        changeBgName = $gameMap.regionList()[this.regionId()-1];
    }
}

//
BackGroundManager.setStageMode = function() {

}
//背景をリセット
BackGroundManager.resetStageMode = function() {
    /*
    this._bgAnimSprite.forEach(node => {
        node.destroy();
    });
    this._bgAnimSprite = [];
    */
}

BackGroundManager.resetPosition = function() {
    //$gameScreen.setBackGroundPosition(0,0);
    //$gameScreen.setBackGroundSize(1024,576);
    this._backGroundView.resetPosition();
}

BackGroundManager.pause = function() {
    this._backGroundView.pause();
}

BackGroundManager.resume = function() {
    this._backGroundView.resume();
}

BackGroundManager.collapseBackGround = function() {
    this._backGroundView.collapseBackGround();
}

BackGroundManager.rooling = function(angle) {
    let r = 0;
    if (angle == 0){
        r = 0;
    }
    if (angle == 90){
        r = -1 *  Math.PI / 2;
    }
    if (angle == 180){
        r = -1 *  Math.PI;
    }
    this._backGroundView.setRotation(0.5,r);
}

BackGroundManager.setupEndingBlur = function() {
    this._backGroundView.setupEndingBlur();
}

BackGroundManager.stopEndingBlur = function() {
    this._backGroundView.stopEndingBlur();
}

//ジャンプする
BackGroundManager.jump = function() {
    SoundManager.playLanding();
}

BackGroundManager.setWeather = async function(type,x,y,start,noSave) {
    if (noSave === undefined){
        noSave = false;
    }
    if (type){
        if (!noSave){
            $gameScreen.changeBackGroundWeather(type);
        }
        if ($dataOption.getUserData("displayEffect") == true){
            this._backGroundView.setWeather(type,x,y,start);
        } else{
            this._backGroundView.clearWeather();
        }
    }
}

BackGroundManager.pauseWeather = function() {
    this._backGroundView.pauseWeather();
}

BackGroundManager.resumeWeather = function() {
    this._backGroundView.resumeWeather();
}

BackGroundManager.distinctWeather = function(flag) {
    this._backGroundView.distinctWeather(flag);
}

BackGroundManager.clearWeather = function() {
    $gameScreen.clearBackGroundWeather();
    this._backGroundView.clearWeather();
}

BackGroundManager.clearWeatherLoad = function() {
    this._backGroundView.clearWeather();
}

BackGroundManager.zoom = function(duration,zoomX,zoomY) {
    this._backGroundView.zoom(duration,zoomX,zoomY);
}

BackGroundManager.move = function(duration,x,y) {
    this._backGroundView.move(duration,x,y);
}

BackGroundManager.moveUV = function(duration,x,y,repeat) {
    //$gameScreen.setBackGroundPosition(x,y);
    //this._backGroundView.moveUV(duration,x,y,repeat);
}

BackGroundManager.bgFadeOut = function(duration) {
    this._backGroundView.bgFadeOut(duration);
};

BackGroundManager.bgFadeIn = function(duration) {
    this._backGroundView.bgFadeIn(duration);
};

BackGroundManager.setSize = function(width,height) {
    //$gameScreen.setBackGroundSize(width,height);
    this._backGroundView.setSize(width,height);
}

BackGroundManager.enableWeather = function(enable) {
    this._backGroundView.enableWeather(enable);
}

BackGroundManager.remove = function() {
    this._scene = SceneManager._scene;
    this._scene.removeChild(this._backGroundView.layer);
    this._scene = null;
}