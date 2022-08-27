//-----------------------------------------------------------------------------
// Sprite_MenuStatus
//

class Sprite_MenuStatus extends Sprite_BattlerStatus{
    constructor(){
        super();
    }

    setup(battler){
        this._battler = battler;

        this.setAttri();
        this.addChild(this._statusMpSprite);
        this.setHp();
        this.setStateIconSprite();
    
        
        this.setName();

        //this.setLevel();
    }

    setAttri(){
        let sprite2 = new Sprite();
        this.addChild(sprite2);
        let bitmap2 = new Bitmap(320,120);
        bitmap2.fillRect(0,0,200,78,'rgba(0,0,0,120)');
        sprite2.bitmap = bitmap2
        sprite2.x = 84;
        sprite2.y = 4;
        sprite2.opacity = 64;
        gsap.to(sprite2,0,{pixi:{ skewX:-15}});
    }

    setLv(){
        let sprite = new Sprite();
        //sprite.bitmap = this.createBitmap("Lv . " + this._battler.level,26,'left');
        let bitmap = new Bitmap(160,48);
        bitmap.fontSize = fontSize;
        bitmap.drawText("Lv . ", 0, 0, 160, 48, 'left',false);
        sprite.bitmap = bitmap;
        this.addChild(sprite);
        sprite.x = 34;
        sprite.y = 32;
    }

    setName(){
        let sprite = new Sprite();
        const name = this._battler.name();
        //sprite.bitmap = this.createBitmap(name,21,'left');
        let bitmap = new Bitmap(160,48);
        bitmap.fontSize = 21;
        bitmap.drawText(name, 0, 0, 160, 48, 'left',false);
        sprite.bitmap = bitmap;
        this.addChild(sprite);
        sprite.x = 96;
        sprite.y = 0;
    }

    setLevel(){
        let sprite = new Sprite();
        const lv = this._battler._level;
        let bitmap = new Bitmap(160,48);
        bitmap.fontSize = 21;
        bitmap.drawText(TextManager.levelA + " " +lv, 0, 0, 160, 48, 'right',false);
        sprite.bitmap = bitmap;
        this.addChild(sprite);
        sprite.x = 96;
        sprite.y = 0;
    }

    isBeingTouched(){
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);
        return this.hitTest(localPos.x, localPos.y) && touchPos.x != 0 && touchPos.y != 0;
    }

    hitTest(x,y){
        let anchorX = 0;
        let width = 200;
        let height = 78;
        let rect;
        if ($gameDefine.mobileMode){
            width = 64;
            anchorX = 88;
            height = 48;
            rect = new Rectangle(
               anchorX + width + 78,
               -this.anchor.y * height,
               width,
               height
           );
        } else{
            /*
            rect = new Rectangle(
                anchorX * width + 78,
                -this.anchor.y * height,
                width,
                height
            );
            */
            width = 64;
            anchorX = 88;
            height = 48;
            rect = new Rectangle(
               anchorX + width + 78,
               -this.anchor.y * height,
               width,
               height
           );
        }
        return rect.contains(x, y);
    }
}