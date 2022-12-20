//-----------------------------------------------------------------------------
// Sprite_BattleStatusMp
//

class Sprite_BattleStatusMp extends Sprite{
    constructor(battler){
        super();
        this._battler = battler;
    
        this._elementImage = ImageManager.loadSystem("IconSet");
    
        this._mpBaseFiveSprite = null;
        this.createMpBaseFive();
    
        this._mpBaseSprites = [];
        this.createMpBase();
    
        const index = this._battler.selfElement();
        this._mpFiveSprite = null;
        this.createMpFive(index);
    
        this._mpSprites = [];
        this.createMp(index);
    
        this.refresh();
    }

    refresh(){
        this.refreshMpBase();
        this.refreshMp();
    }

    refreshMpBase(){
        this._mpBaseFiveSprite.visible = (this._battler.mmp >= 5);
        const number = this._battler.mmp % 5;
        this._mpBaseSprites.forEach((sprite,index) => {
            sprite.visible = (index < number);
            if (index < number){
                sprite.x = 78 + index * 23;
                if (this._battler.mmp >= 5){
                    sprite.x += 26;
                }
            }
        });
    }

    refreshMp(){
        this._mpSpriteFive.visible = (this._battler.mmp >= 5 && this._battler.mp >= 5);
        let number = this._battler.mp % 5;
        this._mpSprites.forEach((sprite,index) => {
            if (this._battler.mmp >= 5){
                sprite.visible = (index < (this._battler.mp-5) % 5);
            } else{
                sprite.visible = (index < number);
            }
            if (index < number){
                sprite.x = 78 + index * 23;
                if (this._battler.mmp >= 5){
                    sprite.x += 26;
                }
            }
        });
        this._mpFiveText.bitmap.clear();
        if (this._battler.mmp >= 5){
            if (this._battler.mp >= 5){
                number = this._battler.mp;
            }
            this._mpFiveText.bitmap.drawText(number,0,0,40,40,"left",true);
        }
    }

    createMpBase(){
        for (let i = 0;i < 4;i++){
            let sprite = new Sprite();
            sprite.bitmap = this._elementImage;
            sprite.setFrame(6 * Window_Base._iconWidth + 160,324,Window_Base._iconWidth,Window_Base._iconHeight - 8);
            this.addChild(sprite);
            this._mpBaseSprites.push(sprite);
            sprite.x = 78 + i * 23;
            sprite.y = 40;
        }
    }

    createMpBaseFive(){
        this._mpBaseFiveSprite = new Sprite();
        this._mpBaseFiveSprite.bitmap = this._elementImage;
        this._mpBaseFiveSprite.setFrame(5 * Window_Base._iconWidth,320,Window_Base._iconWidth,Window_Base._iconHeight);
        this._mpBaseFiveSprite.x = 78;
        this._mpBaseFiveSprite.y = 32;
        this.addChild(this._mpBaseFiveSprite);
    }

    createMpFive(index){
        this._mpSpriteFive = new Sprite();
        this._mpSpriteFive.bitmap = this._elementImage;
        this._mpSpriteFive.x = 78;
        this._mpSpriteFive.y = 32;
        this._mpSpriteFive.setFrame((index-1) * Window_Base._iconWidth,320,Window_Base._iconWidth,Window_Base._iconHeight)
        this.addChild(this._mpSpriteFive);
    
        this._mpFiveText = new Sprite(new Bitmap(40,40));
        this._mpFiveText.x = 89.5;
        this._mpFiveText.y = 35;
        this._mpFiveText.scale.x = 0.65;
        this._mpFiveText.scale.y = 0.65;
        this.addChild(this._mpFiveText);
    }

    createMp(index){
        for (let i = 0;i < 4;i++){
            let sprite = new Sprite();
            sprite.bitmap = this._elementImage;
            sprite.x = 78 + i * 23;
            sprite.y = 40;
            sprite.setFrame(index * Window_Base._iconWidth + 160,324,Window_Base._iconWidth,Window_Base._iconHeight - 8);
            this.addChild(sprite);
            this._mpSprites.push(sprite);
            gsap.to(sprite, 0.5,{opacity:168, repeat:-1,yoyo:true});
        }
    }

    terminate(){
        for (let i = this._mpSprites.length-1;i >= 0; i--){
            gsap.killTweensOf(this._mpSprites[i]);
            this._mpSprites[i].destroy();
        }
        for (let i = this._mpBaseSprites.length-1;i >= 0; i--){
            this._mpBaseSprites[i].destroy();
        }
        if (this._mpSpriteFive){
            this._mpSpriteFive.destroy();
            this._mpSpriteFive = null;
        }
        this._mpBaseFiveSprite.destroy();
        this._mpBaseFiveSprite = null;
        this._mpFiveText.destroy();
        this._mpFiveText = null;
        this._elementImage = null;
        this.children.forEach(element => {
            if (element){
                this.removeChild(element);
            }
        });
        this.destroy();
    }
}