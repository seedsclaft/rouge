//-----------------------------------------------------------------------------
// Window_SkillItemList
//

class Window_SkillItemList extends Window_SkillBase{
    constructor(x,y,width,height){
        super(x,y,width,height);
        this.createBack(492);
        this.createList(-12,34,width,264);
        this.deactivate();
    }

    createBack(width){
        this._backSprite = new Sprite(new Bitmap(width, Graphics.boxHeight));
        this._backSprite.bitmap.fillRect(0, 0, width, 384,'black');
        this._backSprite.alpha = 0.4;
        this._backSprite.anchor.y = 0.5;
        this._backSprite.y = 274;
        this.addChildAt(this._backSprite,1);
    }

    createList(x, y, width, height){
        this._skillList = new Window_ScrollSkillBase(x,y,width,height);
        this._skillList.setSkillHelpWindow(-40,240,564,124);
        this._skillList.setCostWidth(164);
        this.addChild(this._skillList);
    }

    setData(data,actor) {
        this._actor = actor;
        this._skillList.setData(data,actor);
        this.createContents();
        this.drawLine();
    }

    callOkHandler(){
        //共通スキル
        if (this.item().id == 6){
            this._data[this._data.length-1] = $dataSkills[this._elementId];
        }
        this.callHandler('ok');
    }

    drawLine(){
        const y = 2;
        const width = 160;
        
        this.drawLineText(TextManager.getText(10200),this._offsetX + 324,y, width);
        this.drawLineText(TextManager.getText(10300),this._offsetX + 408,y, width);
    }
}