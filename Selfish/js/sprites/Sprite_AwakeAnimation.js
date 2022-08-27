//-----------------------------------------------------------------------------
// Sprite_AwakeAnimation
//

class Sprite_AwakeAnimation extends Sprite{
    constructor(){
        super();
        this._tilingSprite = null;
        this._actorSprite = null;
        this._skillSprite = null;
    }

    setup(battler,skillId){
        this.createTilingSprite();
        this.createActorSprite(battler);
        this.createMask();
        this.createSkill(skillId);
    }

    createTilingSprite(){
        let sprite = new TilingSprite();
        sprite.bitmap = ImageManager.loadSystem('gotit');
        sprite.move(0, 144, 960, 264);
        sprite.origin.x = 0;
        sprite.x = 960;
        sprite.opacity = 0;
        this.addChild(sprite);
        this._tilingSprite = sprite;
    }

    createActorSprite(battler){
        let sprite = new Sprite_EventPicture();
        sprite.bitmap = ImageManager.loadPicture(battler.faceName());
        sprite.y = 160;
        this.addChild(sprite);
        this._actorSprite = sprite;
    }

    createMask(){
        let maskGraphic = new PIXI.Graphics();
        maskGraphic.beginFill(0x000000);
        maskGraphic.drawRect(0, 144, 960, 264);
        maskGraphic.endFill();

        this._actorSprite.mask = maskGraphic;
    }

    createSkill(skillId){
        const skill = $dataSkills[skillId];
        let sprite = new Sprite();
        let skillBitmap = new Bitmap(320,80);
        let iconBitmap = ImageManager.loadSystem('iconplus');
        const pw = Window_Base._iconWidth;
        const ph = Window_Base._iconHeight;
        const sx = skill.iconIndex % 16 * pw;
        const sy = Math.floor(skill.iconIndex / 16) * ph;
        skillBitmap.blt(iconBitmap, sx, sy, pw, ph, 0, 8+24);
        skillBitmap.fontSize = 24 + 4;
        skillBitmap.drawText(TextManager.getSkillName(skillId),pw + 4,32,320,48,'left');
        skillBitmap.fontSize = 21 + 4;
        skillBitmap.drawText(TextManager.getText(611700),8,0,320,48,'left');
        sprite.bitmap = skillBitmap;

        sprite.x = 960;
        sprite.y = 320;

        this.addChild(sprite);
        this._skillSprite = sprite;
    }

    start(){
        gsap.to(this._tilingSprite.origin,0.5,{x:960,repeat : -1 , ease:Power0.easeNone});
        gsap.to(this._tilingSprite,0.1,{x:0,opacity : 255, ease:Power0.easeNone});
        gsap.to(this._tilingSprite,0.2,{x:-960,opacity : 0,delay:1.2, ease:Power0.easeNone});
        
        gsap.to(this._actorSprite,0.2,{opacity:255,x : 200});
        gsap.to(this._actorSprite,1,{x : 320,delay:0.2});
        gsap.to(this._actorSprite,0.2,{opacity:0,x : 960,delay:1.2});

        gsap.to(this._skillSprite,0.2,{opacity:255,x : 680});
        gsap.to(this._skillSprite,1,{x : 600,delay:0.2});
        gsap.to(this._skillSprite,0.2,{opacity:0,x : -320,delay:1.2});

        let self = this;
        gsap.to(this,0,{delay:1.5 , onComplete:function(){
            self.terminate();
        }});
    }

    terminate(){
        if (this._tilingSprite){
            this._tilingSprite.destroy();
        }
        if (this._actorSprite){
            this._actorSprite.terminate();
        }
        if (this._skillSprite){
            this._skillSprite.destroy();
        }
        if (this.parent){
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}