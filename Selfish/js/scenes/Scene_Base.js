// 追加のメソッドを記載
Scene_Base.prototype.initialize = function() {
    Stage.prototype.initialize.call(this);
    this._active = false;
    this.createColorFilter();
};

Scene_Base.prototype.update = function() {
    if ($gamePause == false){
        this.updateFade();
        this.updateChildren();
        //this.updateTouchEvent();
        this.updateSwip();
    }
    this.updatePause();
};

Scene_Base.prototype.convertRect = function(x,y,width,height) {
    const scaleX = Graphics.width / width;
    const scaleY = Graphics.height / height;
    const marginX = (Graphics.width - width) / 2;
    const marginY = (Graphics.height - height) / 2;
    return {
        x: Graphics.width * x,
        y: Graphics.height * y,
    }
};

Scene_Base.prototype.setSwipEvent = function(swipEvent) {
    this._swipEvent = swipEvent;
}

Scene_Base.prototype.setSwipEndEvent = function(swipEndEvent) {
    this._swipEndEvent = swipEndEvent;
}

Scene_Base.prototype.updateSwip = function() {
    if (TouchInput.isReleased()) {
        var moveX = TouchInput.x - this._lastTouchInputX;
        var moveY = TouchInput.y - this._lastTouchInputY;
        if (this._swipEndEvent){
            this._swipEndEvent(moveX,moveY,this._lastTouchInputX,this._lastTouchInputY);
        }
        this._lastTouchInputX = 0;
        this._lastTouchInputY = 0;
    } else
    if (TouchInput.isMoved()){
        var moveX = TouchInput.x - this._lastTouchInputX;
        var moveY = TouchInput.y - this._lastTouchInputY;
        if ((moveX != 0 || moveY != 0) && this._swipEvent){
            this._swipEvent(moveX,moveY,this._lastTouchInputX,this._lastTouchInputY);
        }
    } else
    if (TouchInput.isTriggered()) {
        this._lastTouchInputX = TouchInput.x;
        this._lastTouchInputY = TouchInput.y;
    }
}

Scene_Base.prototype.updatePause = function() {
    if (PopupInputManager.busy()){
        return;
    }
    if (Input.isTriggered("pause")){
        if ($gamePause == false){
            gsap.globalTimeline.pause();
            $gamePause = true;
            WebAudio._onHide();
            Presenter_Pause.open();
        } else{
            gsap.globalTimeline.play();
            $gamePause = false;
            WebAudio._onShow();
            Presenter_Pause.close();
        }
    }
}

Scene_Base.prototype.isBusy = function() {
    return false;
};

Scene_Base.prototype.showMenuPlate = function(duration,backCommand,backMenu,menuSprite) {
    gsap.to(this._backButton._iconSprite,duration,{opacity:255,x:24});
    gsap.to(this._backButton._textButton,duration,{opacity:255,x:24});
    this._backButton.setup(backMenu);
    this._backButton.setClickHandler(backCommand);
    gsap.to(this._menuSprite,duration,{opacity:255,y:-8});
    this.setMenuSprite(menuSprite);
}

Scene_Base.prototype.hideMenuPlate = function(duration) {
    gsap.to(this._backButton._iconSprite,duration,{opacity:0,x:this._backButton._iconSprite.x + 24});
    gsap.to(this._backButton._textButton,duration,{opacity:0,x:this._backButton._textButton.x + 24});
    gsap.to(this._menuSprite,duration,{opacity:0,y:this._menuSprite.y + 12});
}
/**
 * Terminate the scene before switching to a another scene.
 * 
 * @method terminate
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.terminate = function() {
    gsap.globalTimeline.clear();
    if (this._windowLayer){
        this._windowLayer.destroy();
    }
    this._windowLayer = null;
    if (this._touchSpriteLayer){
        this._touchSpriteLayer.destroy();
        this._touchSpriteLayer = null;
    }
    if (this._menuPlate){
        this._menuPlate.destroy();
    }
    if (this._backButton){
        this._backButton.terminate();
    }
    if (this._menuSprite){
        this._menuSprite.destroy();
    }
    if (this._menuBack){
        this._menuBack.terminate();
        this._menuBack = null;
    }
    this._menuPlate = null;
    this._menuSprite = null;
    this._backButton = null;
    if (this._presenter){
        this._presenter.terminate();
    }
};

Scene_Base.prototype.startFadeIn = function(duration, white) {
    EventManager.startFadeIn(30);
};

Scene_Base.prototype.startFadeOut = function(duration, white) {
    EventManager.startFadeOut(30);
};

Scene_Base.prototype.createFadeSprite = function(white) {
};

Scene_Base.prototype.updateFade = function() {
};

Scene_Base.prototype.createMenuButton = function() {
    this._menuPlate = new Sprite();
    this._menuPlate.bitmap = new Bitmap(960,40);
    this._menuPlate.bitmap.fillRect(0,0,960,40,'black');
    this._menuPlate.x = 120;
    this._menuPlate.y = 0;
    this._menuPlate.skew.x = -0.25;
    this._menuPlate.opacity = 128;
    this.addChild(this._menuPlate);
}

Scene_Base.prototype.createBackButton = function(handler) {
    this._backButton = new Sprite_IconButton();
    this.addChild(this._backButton);
    this._backButton.setup(TextManager.getBackText());
    this._backButton.setClickHandler(() => {
        if (handler) {handler()}
    })
}

Scene_Base.prototype.setBackSprite = function(text) {
    this._backButton.setup(text);
}

Scene_Base.prototype.createMenuSprite = function() {
    this._menuSprite = new Sprite(new Bitmap(240,64));
    this.addChild(this._menuSprite);
    this._menuSprite.x = 128;
    this._menuSprite.y = -8;
    this._menuSprite.opacity = 255;
}

Scene_Base.prototype.setMenuSprite = function(text,fontSize) {
    if (fontSize === undefined){
        fontSize = 26;
    }
    var bitmap = new Bitmap(240,64);
    bitmap.fontSize = fontSize;
    bitmap.drawText(text,0,0,240,60,"left");
    this._menuSprite.bitmap = bitmap;
    this._menuSprite.visible = true;
}

Scene_Base.prototype.showReadyAnimation = function(okAction,index) {
    let sprite = new Sprite_Ready();
    sprite.setup(okAction);
    this.addChildAt(sprite,index);
}

Scene_Base.prototype.setEvent = function(command) {
    this._commandUpdate = command;
}

Scene_Base.prototype.setCommand = function(command) {
    if (this._command == null){
        this._command = [command];
    } else{
        this._command.push(command);
    }
    this._commandUpdate();
}

Scene_Base.prototype.clearCommand = function() {
    this._command = null;
    TouchInput.clear();
}

Scene_Base.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addChild(this._helpWindow);
};

Scene_Base.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = Graphics.boxHeight - 40;
    const ww = Graphics.boxWidth;
    const wh = 40;
    return new Rectangle(wx, wy, ww, wh);
};

// ローディング待ち
Scene_Base.prototype.loading = async function(callback) {
    //　読み込みチェック
    return new Promise(function(res, rej) {
        // ループ処理（再帰的に呼び出し）
        let loop = () => {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve();
                }, 100);
            })
            .then(function(count) {
                // ループを抜けるかどうかの判定
                if ( callback() ) {
                    // 抜ける（外側のPromiseのresolve判定を実行）
                    res();
                } else {
                    // 再帰的に実行
                    loop();
                }
            });
        }
        
        // 初回実行
        loop();
      }.bind(this)).then(function() {
    });
}

Scene_Base.prototype.createScreenSprite = function() {
    this._menuBack = new Sprite_MenuBack();
    this.addChild(this._menuBack);
}

Scene_Boot.prototype.loadSystemImages = function() {
    ColorManager.loadWindowskin();
    ImageManager.loadSystem("IconSet");
    ImageManager.loadSystem('Damage');
    ImageManager.loadSystem('States');
    ImageManager.loadSystem('keyMapIcons');
};

Scene_Boot.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    DataManager.loadDatabase();
    StorageManager.updateForageKeys();
};

Scene_Boot.prototype.start = async function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Battle_View);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Map_Scene);
    } else {
        this.startNormalGame();
    }
    this.resizeScreen();
    this.updateDocumentTitle();
    
    BackGroundManager.init();
    EventManager.init();
    Presenter_Loading.init();
    PopupInputManager.init();

    PopupStatus_View.initialize();
    
    $gameCommand.menuCommand().forEach(element => {
        if (element.iconPath)
        ImageManager.loadIcon(element.iconPath);
    });
    ImageManager.loadSystem("textplateC");
    ImageManager.loadBackground("nexfan_01");
    ImageManager.loadPicture("Actor0001_00_l")
    ImageManager.loadPicture("Actor0002_00_l")
    ImageManager.loadPicture("Actor0003_00_l")
    ImageManager.loadPicture("Actor0004_00_l")
    ImageManager.loadPicture("Actor0005_00_l")
    ImageManager.loadPicture("Actor0001_00_s")
    ImageManager.loadPicture("Actor0002_00_s")
    ImageManager.loadPicture("Actor0003_00_s")
    ImageManager.loadPicture("Actor0004_00_s")
    ImageManager.loadPicture("Actor0005_00_s")
    //Graphics._switchFPSCounter();
};

Scene_Boot.prototype.startNormalGame = function() {
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    SceneManager.goto(Top_Scene);
    /*
    SceneManager.goto(Title_Scene);
    Window_TitleCommand.initCommandPosition();
    */
};

Scene_Gameover.prototype.gotoTitle = function() {
    SceneManager.goto(Title_Scene);
};