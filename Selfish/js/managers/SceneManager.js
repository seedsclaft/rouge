SceneManager.updateMain = function() {
    if ($gamePause == true){
    } else{
        this.updateFrameCount();
        this.updateEffekseer();
    }
    this.updateInputData();
    this.changeScene();
    this.updateScene();
    // 追加 内製マネージャの更新
    this.updateManagers();
};

SceneManager.onBeforeSceneStart = function() {
    if (this._previousScene) {
        // 変更 : destroyは各シーンのterminateで行う
        //this._previousScene.destroy();
        this._previousScene = null;
    }
    if (Graphics.effekseer) {
        Graphics.effekseer.stopAll();
    }
};

SceneManager.updateScene = async function() {
    if (this._scene) {
        if (this._scene.isStarted()) {
            // バックグラウンド動作を許容
            //if (this.isGameActive()) {
                this._scene.update();
            //}
        } else if (this._scene.isReady()) {
            this.onBeforeSceneStart();
            // 先にステージを戻す。Loadingはthis._sceneで出す
            this.onSceneStart();
            await this._scene.start();
        }
    }
};

SceneManager.updateManagers = function() {
    BackGroundManager.update();
    EventManager.update();
    FilterMzUtility.update();
    PopupInputManager.update();
    Scene_Option.update();
};

SceneManager.determineRepeatNumber = function(deltaTime) {
    if ($gameTemp && $gameTemp.isPlaytest()){
        if (TouchInput.wheelY > 0){
            let tempSpeed = this._smoothDeltaTime * 24;
            gsap.globalTimeline.timeScale(tempSpeed);
            return 24;
        }
    }
    // [Note] We consider environments where the refresh rate is higher than
    //   60Hz, but ignore sudden irregular deltaTime.
    this._smoothDeltaTime *= 0.8;
    this._smoothDeltaTime += Math.min(deltaTime, 2) * 0.2;
    if (this._smoothDeltaTime >= 0.9) {
        if (Utils.isMobileSafari()) {
            this._smoothDeltaTime = 1;
        }
        this._elapsedTime = 0;
        if ($gameTemp && $gameTemp.fastSpeed){
            let tempSpeed = this._smoothDeltaTime * $gameTemp.fastSpeed;
            gsap.globalTimeline.timeScale(tempSpeed);
            return Math.round(tempSpeed);
        }
        gsap.globalTimeline.timeScale(Math.round(this._smoothDeltaTime));
        return Math.round(this._smoothDeltaTime);
    } else {
        this._elapsedTime += deltaTime;
        if (this._elapsedTime >= 1) {
            this._elapsedTime -= 1;
            gsap.globalTimeline.timeScale(1);
            return 1;
        }
        gsap.globalTimeline.timeScale(0);
        return 0;
    }
};


SceneManager.catchException = function(e) {
    if (e instanceof Error) {
        this.catchNormalError(e);
    } else if (e instanceof Array && e[0] === "LoadError") {
        this.catchLoadError(e);
    } else {
        this.catchUnknownError(e);
    }
    //this.stop();
};