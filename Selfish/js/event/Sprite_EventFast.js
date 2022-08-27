class Sprite_EventFast extends Sprite {
    constructor(){
        super();
        this._baseButton = null;
        this._fastBaseSprite = null;
        this._fastMeterSprite = null;
        this._fastMeterState = FastMeterState.Idel;
        this._anim = [];
        this.createButtons();
        this.createSprites();
    }

    createButtons(){
        this.createBaseButton();
    }

    createBaseButton(){
        this._baseButton = new Sprite_Button();
        this._baseButton.bitmap = new Bitmap(960,540);
        this.addChild(this._baseButton);
        this._baseButton.x = 0;
        this._baseButton.y = 16;
    }

    createSprites(){
        this.createFastMeterSprite();
        this.createFastBaseSprite();
    }

    createFastBaseSprite(){
        const w = 64;
        const h = 64;
        this._fastBaseSprite = new Sprite();
        this._fastBaseSprite.bitmap = new Bitmap(w*2,w*2);
        this._fastBaseSprite.bitmap.drawCircle(w,w,w/2,'white');
        this._fastBaseSprite.bitmap.drawCircle(w,w,(w-6)/2,'balck');
        this._fastBaseSprite.bitmap.fontSize = 28;
        this._fastBaseSprite.bitmap.drawText(TextManager.getText(370),w/2,w/2,w,h,'center');
        this._fastBaseSprite.x = 160;
        this._fastBaseSprite.anchor.x = this._fastBaseSprite.anchor.y = 0.5;
        //this._fastBaseSprite.scale.x = this._fastBaseSprite.scale.y = 0.75;
        this._fastBaseSprite.y = 270;
        this._fastBaseSprite.opacity = 128;
        this.addChild(this._fastBaseSprite);

    }

    createFastMeterSprite(){
        const w = 56;
        const h = 56;
        this._fastMeterSprite = new Sprite();
        this._fastMeterSprite.bitmap = new Bitmap(w*2,w*2);
        this._fastMeterSprite.bitmap.drawCircle(w,w,w/2,'white');
        this._fastMeterSprite.x = 160;
        this._fastMeterSprite.anchor.x = 0.5;
        this._fastMeterSprite.anchor.y = 0.5;
        this._fastMeterSprite.y = 270;
        this._fastMeterSprite.opacity = 200;
        this.addChild(this._fastMeterSprite);
    }

    update(){
        super.update();
        this.updatePressFrame();
        this.updateFastState();
    }

    updatePressFrame(){
        if (PopupManager.busy() || $gameMessage.isChoice() || !EventManager.busy() || EventManager.nextStagebusy()){
            this.clearPressState();
            return;
        }
        if (this._baseButton == null){
            return;
        }
        if (this._fastMeterSprite == null){
            return;
        }
        let pressFrame = this._baseButton.pressFrame();
        const maxFrame = 32;
        if ($gameDefine.platForm() == PlatForm.Android || $gameDefine.platForm() == PlatForm.iOS){
            pressFrame -= 4;
        }
        if (pressFrame > maxFrame){
            pressFrame = maxFrame;
        }
        if (pressFrame > 8 && pressFrame < maxFrame){
            this._fastMeterState = FastMeterState.Touching;
        }
        if (pressFrame == maxFrame){
            this._fastMeterState = FastMeterState.Pressed;
        }
        if (this.isPressOrTouch() && TouchInput.isReleased()){
            this._baseButton.setPressFrame(0);
            this._fastMeterState = FastMeterState.Idel;
        }
        this._fastBaseSprite.visible = this.isPressOrTouch();
        this._fastMeterSprite.visible = this.isPressOrTouch();
        const frameper = (pressFrame / maxFrame);
        this._fastMeterSprite.scale.x = this._fastMeterSprite.scale.y = frameper;
        if (!this.isPress()){
            this._fastBaseSprite.opacity = frameper * 128;
            this._fastMeterSprite.opacity = frameper * 200;
        }
    }

    isPress(){
        return (this._fastMeterState == FastMeterState.Pressed) && TouchInput.isPressed();
    }

    isPressOrTouch(){
        return (this._fastMeterState == FastMeterState.Touching || this._fastMeterState == FastMeterState.Pressed) && TouchInput.isPressed();
    }

    updateFastState(){
        if (PopupManager.busy()){
            return;
        }
        const fastSpeed = this.isPress() ? 2 : 1;
        const hitX = TouchInput.x;
        const hitY = TouchInput.y;
        this._fastBaseSprite.x = this._fastMeterSprite.x = hitX;
        this._fastBaseSprite.y = this._fastMeterSprite.y = hitY;
        if ($gameTemp.fastSpeed == null){
            $gameTemp.fastSpeed = 1;
        }
        $gameTemp.fastSpeed = fastSpeed;
        if (!EventManager.busy()){
            $gameTemp.fastSpeed = 1;
        }
        if (this.isPress()){
            if (this._anim.length == 0){
                //var t1 = gsap.to(this._fastBaseSprite,0.4,{opacity : 64 ,repeat:-1 , yoyo:true});
                var t2 = gsap.to(this._fastMeterSprite,0.4,{opacity : 128 ,repeat:-1 , yoyo:true});

                //this._anim.push(t1);
                this._anim.push(t2);
            }
        } else{
            this.killAnim();
        }
    }

    killAnim(){
        this._anim.forEach(anim => {
            anim.kill();
        });
        this._anim = [];
    }

    clearPressState(){
        this._fastBaseSprite.visible = false;
        this._fastMeterSprite.visible = false;
        this._baseButton.setPressFrame(0);
        this._fastMeterState = FastMeterState.Idel;
    }
}

const FastMeterState = {
    Idel : 0,
    Touching : 1,
    Pressed : 2
}