//-----------------------------------------------------------------------------
// Sprite_MenuDock
//

class Sprite_TurnInfo extends Sprite{
    constructor(turnNum){
        super();
        this.createBackground();
        this.createTurnInfo();
    }
    
    createBackground(){
        let background = new Sprite();
        background.bitmap = ImageManager.loadSystem("mainwindowD");
        background.x = 8;
        background.y = 8;
        this.addChild(background);
    }

    createTurnInfo(){
        const _width = 80;
        const _height = 40;
        let turn = new Sprite(new Bitmap(_width,_height));
        turn.bitmap.fontSize = 16;
        turn.bitmap.drawText(TextManager.getText(3000),0,0,_width,_height,"center",true);
        turn.x = 12;
        turn.y = 0;
        this.addChild(turn);
        this._turnSprite = new Sprite(new Bitmap(_width,_height));
        this._turnSprite.bitmap.fontSize = 40;
        this._turnSprite.bitmap.drawText("",0,0,_width,_height,"center",true);
        this._turnSprite.x = 12;
        this._turnSprite.y = 32;
        this.addChild(this._turnSprite);
        let turn3 = new Sprite(new Bitmap(_width,_height));
        turn3.bitmap.fontSize = 16;
        turn3.bitmap.drawText(TextManager.getText(3010),0,0,_width,_height,"center",true);
        turn3.x = 12;
        turn3.y = 60;
        this.addChild(turn3);
    }

    setTurn(value){
        const _width = 80;
        const _height = 40;
        this._turnSprite.bitmap.drawText(value,0,0,_width,_height,"center",true);
    }

}
