//-----------------------------------------------------------------------------
// Sprite_StageTitle
//

class Sprite_StageTitle extends Sprite{
    constructor(){
        super();
        this.terminateTime = 4.0;
    }

    setup(no,name){
        this.createActsSprite(no);
        this.createNameSprite(name);
    
        this.start();
    }

    createActsSprite(no){
        this._acts = [];
        let _acts = ['A','c','t'];
        let numberArray = no.toString().split("");
        numberArray.forEach(number => {
            _acts.push(number);
        });
        _acts.push('.');
        _acts.forEach((char,index) => {
            let sprite = new Sprite();
            let bitmap = new Bitmap(40,40);
            bitmap.fontSize = 21;
            bitmap.drawText(char,0,0,40,40,'center',true,true);
            sprite.bitmap = bitmap;
            sprite.scale.x = 1;
            sprite.scale.y = 0.8;
            sprite.x = 40 + index * 14;
            sprite.y = 16;
            sprite.opacity = 0;
            this.addChild(sprite);
            this._acts.push(sprite);
        });
    }

    createNameSprite(name){
        this._names = [];
        let _name = name.split('');
        _name.forEach((char,index) => {
            let sprite = new Sprite();
            let bitmap = new Bitmap(120,120);
            bitmap.drawText(char,0,0,120,120,'center',true,true);
            
            sprite.bitmap = bitmap;
            sprite.x = 24 + index * 24;
            sprite.y = 0;
            sprite.opacity = 0;
            this.addChild(sprite);
            this._names.push(sprite);
        });
    }

    start(){
        const terminate = this.terminateTime;
        this._acts.forEach((act ,index) => {
            gsap.to(act,1.0,{x:index * 14,opacity:255,delay:index * 0.05});
            gsap.to(act,1.0,{opacity:0, delay :terminate ,onComplete:function(){
                act.destroy();
            }});
        });
        this._names.forEach((name ,index) => {
            gsap.to(name,0.5,{x:40 + index * 24 - 48 ,opacity:255,delay:1.2 + index * 0.1});
            gsap.to(name,1.0,{opacity:0, delay :terminate, onComplete:function(){
                name.destroy();
            }});
        });
    }

    terminate(){
        this._acts.forEach(act  => {
            gsap.killTweensOf(act);
            if (act != null && act._texture != null){
                act.destroy();
            }
        });
        this._acts = [];
        this._names.forEach(name  => {
            gsap.killTweensOf(name);
            if (name != null && name._texture != null){
                name.destroy();
            }
        });
        this._names = [];
        this.destroy();
    }
}