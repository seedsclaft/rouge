class View_BackGround {
    constructor() {
        this._scene = null;
        this._layer = new Sprite();
        this._layer.filters = [];
        this.createBackGround();
        this.createWeather();
        this._bgAnimSprite = [];
    }

    get layer(){
        return this._layer;
    }

    get _defaultWidth(){
        return Graphics.width;
    }

    get _defaultHeight(){
        return Graphics.height;
    }

    backSprite1(){
        return this._backSprite1;
    }

    createBackGround(){
        this._backSprite1 = new Sprite_BackGround(Graphics.width,Graphics.height);
        this._backSprite2 = new Sprite_BackGround(Graphics.width,Graphics.height);
        this._toneSprite = new ScreenSprite();
        this._layer.addChild(this._backSprite1);
        this._layer.addChild(this._backSprite2);
        this._layer.addChild(this._toneSprite);
    }

    createWeather(){
        this._weather = new PIXI.Graphics();
        this._weather.x = Graphics.width / 2;
        this._weather.y = Graphics.height / 2;
        this._layer.addChild(this._weather);
        this._partcle = new Sprite_Particle();
        this._layer.addChild(this._partcle);
    }

    async setWeather (type,x,y,start) {
        var ext = {}
        if (x != null && y != null) {
            ext = {pos:{x:x,y:y}};
        }
        await this._partcle.setup(this._weather,type,ext,start);
    }

    pauseWeather(){
        this._partcle.pause();
    }

    resumeWeather(){
        this._partcle.resume();
    }

    clearWeather () {
        this._partcle.clear();
    }

    distinctWeather(flag){
        this._partcle.distinct(flag);
    }

    resetup(){
        this._scene = SceneManager._scene;
        this._scene.addChild(this._layer);
        this.startTint(0,$gameScreen.tone());
        /*
        if ($gameScreen.backGroundSize()){
            this.setSize($gameScreen.backGroundSize()[0],$gameScreen.backGroundSize()[1]);
        }
        if ($gameScreen.backGroundPosition()){
            this.moveUV(0,$gameScreen.backGroundPosition()[0],$gameScreen.backGroundPosition()[1],false);
        }
        */
    }


    moveStop(){
        gsap.killTweensOf(this);
    }


    changeBackGround1(name){
        if (name){
            this._backSprite1.bitmap = null;
            this._backSprite1._init = false;
            this._backSprite1.opacity = 255;
            this._backSprite1.bitmap = ImageManager.loadBattleback1(name);
        } else{
            this._backSprite1.bitmap = null;
        }
    }

    changeBackGround2(name){
        if (name){
            this._backSprite2.bitmap = null;
            this._backSprite2._init = false;
            this._backSprite2.opacity = 255;
            this._backSprite2.bitmap = ImageManager.loadBattleback2(name);
        } else{
            this._backSprite2.bitmap = null;
        }
    }

    collapseBackGround(){
        this._backSprite1.opacity = 0;
        //this._backSprite2.opacity = 0;
    }

    setRotation(duration,rotation){
        this._backSprite1.setRotation(duration,rotation);
        //this._backSprite2.setRotation(duration,rotation);
    }

    startTint(duration,color){
        this._toneSprite.setColor(color[0], color[1], color[2]);
        gsap.to(this._toneSprite,duration / 60,{opacity:color[3]});
    }

    setupEndingBlur(){
        this._blurEndingFilter = new PIXI.filters.ZoomBlurFilter();
        this._blurEndingFilter.strength = 0.1;
        var x = Graphics.width * 0.5;
        var y = Graphics.height * 0.5;
        this._blurEndingFilter.center = [x,y];
        this._scene.filters = [this._blurEndingFilter];
    }

    stopEndingBlur(){
        this._blurEndingFilter.strength = 0;
        this._blurEndingFilter = null;
        this._scene.filters = [];
    }

    zoom(duration,zoomX,zoomY){
        this._backSprite1.zoom(duration,zoomX,zoomY);
        //this._backSprite2.zoom(duration,zoomX,zoomY);
    }

    move(duration,x,y){
        this._backSprite1.moveDirection(duration,x,y);
        //this._backSprite2.moveDirection(duration,x,y);
    }

    moveUV(duration,x,y,repeat){
        this._backSprite1.moveUV(duration,x,y,repeat);
        //this._backSprite2.moveUV(duration,x,y,repeat);
    }

    bgFadeOut(duration){
        this._backSprite1.fadeOut(duration,255);
        //this._backSprite2.fadeOut(duration,255);
    }

    bgFadeIn(duration){
        this._backSprite1.fadeIn(duration,0);
        //this._backSprite2.fadeIn(duration,0);
    }

    update(){
        if (this._layer === null || this._scene !== SceneManager._scene){
            return;
        }
        this.updateBlur();
        this.updateShake();
    }

    updateBlur(){
        if (this._blurEndingFilter != null && this._blurEndingFilter.strength < 0.4){
            this._blurEndingFilter.strength += 0.01;
        }
    }

    updateShake(){
        this._layer.y = Math.round($gameScreen.shake());
    }

    setSize(width,height){
        console.error(width)
        this._backSprite1.setSize(width,height);
        //this._backSprite2.setSize(width,height);
    }

    pause(){
        this._pause = true;
        this._backSprite1.pause();
        //this._backSprite2.pause();
        this.pauseWeather();
    }

    resume(){
        this._pause = false;
        this._backSprite1.resume();
        //this._backSprite2.resume();
        this.resumeWeather();
    }

    resetPosition(){
        this._backSprite1.resetPosition();
        //this._backSprite2.resetPosition();
    }
    
    terminate(){
        this._backSprite1.terminate();
        //this._backSprite2.terminate();
    }

    enableWeather(enable){
        if (DataManager.isEventTest()){
            enable = true;
        }
        if (enable){
            if (this._weather.parent == null){
                this._layer.addChildAt(this._weather,3);
            }
        } else {
            if (this._weather.parent != null){
                this._layer.removeChild(this._weather);
            }
        }
    }

}