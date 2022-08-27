//-----------------------------------------------------------------------------
// Window_RushBattleStatus
//

class Window_RushBattleStatus extends Window_Base{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height ));
        this._data = null;
    }

    setData(data,turns){
        this._data = data;
        this.refresh(turns);
    }

    refresh(turns){
        const lineHeight = 28;
        const spacing = 8;
        this.createContents();
        this.drawLineText(TextManager.getText(900300), 0, 0, 240);
        const clearTextId = (this._data.loseType == 0) ? 1000300 : 1000400;
        this.drawText(TextManager.getText(clearTextId),0,lineHeight,360);
        
        if (turns == 9999){
            this.drawLineText(TextManager.getText(1101000), 0, lineHeight * 2 + spacing, 240);
            this.drawText(TextManager.getText(900901), 0, lineHeight * 3 + spacing, 360);
        } else
        if (turns){
            this.drawLineText(TextManager.getText(1101000), 0, lineHeight * 2 + spacing, 240);
            const turnsText = turns + TextManager.getText(900500);
            this.drawText(turnsText, 0, lineHeight * 3 + spacing, 360);
        } else{
            this.drawText( TextManager.getText(900900), 0, lineHeight * 3 + spacing, 240);
        }
    }
}