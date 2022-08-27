//-----------------------------------------------------------------------------
// Sprite_ChallengeDock
//

class Sprite_ChallengeDock extends Sprite{
    constructor(callBack){
        super();
        this._callBack = callBack;
        this.createButtons();
    }

    callBack(){
        if (this._callBack){
            SoundManager.playCancel();
            this._callBack();
        }
    }

    createButtons(){
        this.createStageSkip();
    }

    createStageSkip(){
        this._challengeEndButton = new Sprite_KeyMapButton();
        this.addChild(this._challengeEndButton);
        this._challengeEndButton.x = 720;
        this._challengeEndButton.y = 4;
        this._challengeEndButton.setClickHandler(this.callBack.bind(this));
        this._challengeEndButton.setText(TextManager.getText(739));
    }
}