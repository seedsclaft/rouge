class Sprite_EventMenu extends Sprite {
    constructor(){
        super();
        this._action = {};
        this._autoButton = null;
        this._skipButton = null;
        this._logButton = null;
        this._displayButton = null;
        this._fastButton = null;
        this.createSprites();
        this.createButtons();
    }

    createSprites(){
        this._dimmerSprite = new Sprite();
        this._dimmerSprite.bitmap = new Bitmap(0, 0);
        this._dimmerSprite.y = -24;
        let bitmap = this._dimmerSprite.bitmap;
        const w = Graphics.width;
        const h = 88;
        const m = 24;
        const c1 = ColorManager.dimColor1();
        const c2 = ColorManager.dimColor2();
        bitmap.resize(w, h);
        //bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        bitmap.fillRect(0, m, w, h - m * 2, c1);
        bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        this._dimmerSprite.setFrame(0, 0, w, h);
        this._dimmerSprite.opacity = 96;
        this.addChild(this._dimmerSprite);
    }

    createButtons(){
        this.createAutoButton();
        this.createSkipButton();
        this.createLogButton();
        this.createDisplayButton();
        this.createFastButton();
    }

    get buttonTextWidth(){
        return 120;
    }

    get buttonTextHeight(){
        return 32;
    }

    createAutoButton(){
        this._autoButton = new Sprite_Button();
        this._autoButton.bitmap = new Bitmap(this.buttonTextWidth,this.buttonTextHeight);
        this._autoButton.bitmap.fontSize = 21;
        this._autoButton.bitmap.drawText(TextManager.getText(330),0,0,this.buttonTextWidth,this.buttonTextHeight,'center');
        
        this._autoSprite = new Sprite();
        this._autoSprite.bitmap = new Bitmap(this.buttonTextWidth,this.buttonTextHeight);
        this._autoSprite.bitmap.fontSize = 18;
        this._autoSprite.bitmap.drawText(TextManager.getText(320),84,1,this.buttonTextWidth,this.buttonTextHeight);
        gsap.to(this._autoSprite,0.6,{alpha:0,repeat:-1,yoyo:true,ease: Power1.easeOut})
        
        this.addChild(this._autoButton);
        this.addChild(this._autoSprite);
        this._autoButton.x = this._autoSprite.x = 760;
        this._autoButton.y = this._autoSprite.y = 8;
        this._autoButton.setClickHandler(this.commandAuto.bind(this));
    }

    showAutoButton(){
        this._autoSprite.visible = true;
    }

    hideAutoButton(){
        this._autoSprite.visible = false;
    }

    createSkipButton(){
        this._skipButton = new Sprite_Button();
        this._skipButton.bitmap = new Bitmap(this.buttonTextWidth,this.buttonTextHeight);
        this._skipButton.bitmap.fontSize = 21;
        this._skipButton.bitmap.drawText(TextManager.getText(340),0,0,this.buttonTextWidth,this.buttonTextHeight,'center');
        
        this.addChild(this._skipButton);
        this._skipButton.x = 840;
        this._skipButton.y = 8;
        this._skipButton.setClickHandler(this.commandSkip.bind(this));
    }

    createLogButton(){
        this._logButton = new Sprite_Button();
        this._logButton.bitmap = ImageManager.loadSystem('IconSet');
        const w = Window_Base._iconWidth;
        const h = Window_Base._iconHeight;
        this._logButton.setFrame(1 * w,12 * h ,w,h);
        this.addChild(this._logButton);
        this._logButton.x = 24;
        this._logButton.y = 8;
        this._logButton.scale.x = this._logButton.scale.y = 1.0;
        this._logButton.setClickHandler(this.commandLog.bind(this));
    }

    createDisplayButton(){
        this._displayButton = new Sprite_Button();
        this._displayButton.bitmap = ImageManager.loadSystem('IconSet');
        const w = Window_Base._iconWidth;
        const h = Window_Base._iconHeight;
        this._displayButton.setFrame(15 * w,10 * h ,w,h);
        this.addChild(this._displayButton);
        this._displayButton.x = 72;
        this._displayButton.y = 8;
        this._displayButton.scale.x = this._displayButton.scale.y = 1.0;
        this._displayButton.setClickHandler(this.commandDisPlay.bind(this));
    }

    createFastButton(){
        this._fastButton = new Sprite_EventFast();
        this.addChild(this._fastButton);
    }

    commandAuto(){
        this._action[EventMenuButton.Auto]();
        SoundManager.playCursor();
        TouchInput.clear();
    }

    commandSkip(){
        this._action[EventMenuButton.Skip]();
        TouchInput.clear();
    }

    commandLog(){
        this._action[EventMenuButton.Log]();
        TouchInput.clear();
    }

    commandDisPlay(){
        this._action[EventMenuButton.Display]();
        TouchInput.clear();
    }

    setAction(menubutton,func){
        this._action[menubutton] = func;
    }
}

const EventMenuButton = {
    Auto : 1,
    Skip : 2,
    Log : 3,
    Display :4
}