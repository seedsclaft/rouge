class Sprite_EndRollCredit extends Sprite{
    constructor(x,y){
        super();
    }

    setup(no,onlyOnes,noIndent){
        const credit = $gameVariables.value(11)[no];
        this.createNameSprite(credit,onlyOnes,noIndent);
    
        this.start();
    }

    createNameSprite(credit,onlyOnes,noIndent){
        this._credit = [];
        let marginY = 0;
        this._marginX = [];
        let lengthIndex = 0;
        let right = 0;
        credit.forEach(data => {
            if (onlyOnes && right != 0){
                return;
            }
            data = data.split('');
            data.forEach((char,index) => {
                if (char == "-" || char == " " || char == "様"){
                    return;
                }
                let sprite = new Sprite();
                let bitmap = new Bitmap(40,40);
                bitmap.fontSize = 21;
                bitmap.drawText(char,0,0,40,40,'center',true,true);
                let width = bitmap.measureTextWidth(char);
                if (width < 16){
                    width = 14;
                }
                sprite.bitmap = bitmap;
                sprite.x = 12 + 4*(index-lengthIndex) + right;
                if (noIndent){
                    sprite.x = 12 + right;
                }
                sprite.y = marginY;
                sprite.opacity = 0;
                this.addChild(sprite);
                this._credit.push(sprite);
                this._marginX.push(24 + right);
                right += width + 4;
            });
            marginY += 28;
            right = 16;
            if (noIndent){
                right = 0;
            }
            lengthIndex = this._credit.length;
        });
    }

    start(){
        const terminate = 6;
        this._credit.forEach((credit ,index) => {
            gsap.to(credit,0.4,{x:this._marginX[index],opacity:255,delay:index * 0.05});
            gsap.to(credit,0.8,{opacity:0, delay :terminate, onComplete:function(){
                credit.destroy();
            }});
        });
    }

    terminate(){
        for (let i = this._credit.length-1;i >= 0;i--){
            gsap.killTweensOf(this._credit[i]);
            if (this._credit[i] != null && this._credit[i]._texture != null){
                this._credit[i].destroy();
            }
        }
        this._credit = [];
        this.destroy();
    }
}