//-----------------------------------------------------------------------------
// Window_SkillBase
//

class Window_SkillBase extends Window_Base{
    constructor(x, y, width, height){
        super(new Rectangle( x, y, width ,height));
        this._initX = x;
        this._initY = y;
        this._actor = null;
        this._data = [];
        this._lastIndex = -1;
        this.hide();
        this._offsetX = 72;
    }

    createBack(x, y, width, height){
        // override
    }

    createList(x, y, width, height){
        // override
    }

    setHandler(symbol, method){
        this._skillList._handlers[symbol] = method;
    }

    contentsHeight(){
        return this.height;
    }

    actor(){
        return this._actor;
    }

    show(){
        super.show();
        this._skillList.show();
    }

    activate(){
        super.activate();
        this._skillList.activate();
    }

    deactivate(){
        super.deactivate();
        this._skillList.deactivate();
    }

    index(){
        return this._skillList.index();
    }

    item(){
        return this._skillList._data && this._skillList.index() >= 0 ? this._skillList._data[this._skillList.index()] : null;
    }

    selectLast(){
        this._skillList.selectLast();
    }

    setData(data,actor){
        this._skillList.setData(data);
        this._actor = actor;
        this.refresh();
    }

    refresh(){
        this.createContents();
        this.drawLine();
    }

    updateHelp(){
        this._skillList.updateHelp();
    }

    drawLine(){
        /*

        */
    }

    showAnimation(){
        this.resetPosition();
        const duration = 0.2;
        this.alpha = 0;
        this._backSprite.skew.x = 0;
        gsap.to(this._backSprite,duration,{pixi:{skewX:-15}});
        gsap.to(this,duration,{alpha:1});
    }

    hideAnimation(){
        this.resetPosition();
        const duration = 0.2;
        gsap.to(this,duration,{alpha:0});
    }

    reShowAnimation(){
        const duration = 0.2;
        gsap.to(this,duration,{x:this._initX,y:this._initY,alpha:1});
    }

    resetPosition(){
        this.x = this._initX;
        this.y = this._initY;
    }

    deleteAnimation(){
        const duration = 0.2;
        gsap.to(this,duration,{alpha:0});
    }

    _updateCursor(){}
    _updateFrame(){}
    _updateContentsBack(){}
    _updatePauseSign(){}
    _updateArrows(){}
    updateBackOpacity(){}
    loadWindowskin(){}

    _createAllParts(){
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
    }

    _refreshAllParts(){
        /*
        this._refreshBack();
        this._refreshFrame();
        this._refreshCursor();
        this._refreshPauseSign();
        this._refreshArrows();
        */
    }

    terminate(){
        this._skillList.terminate();
        this.destroy();
    }
}