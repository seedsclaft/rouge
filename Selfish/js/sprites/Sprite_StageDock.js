//-----------------------------------------------------------------------------
// Sprite_StageDock
//

class Sprite_StageDock extends Sprite{
    constructor(){
        super();
        this.createButtons();
    }


    createButtons(){
        this.createStageInfo();
    }
    
    createStageInfo(){
        this._stageInfoButton = new Sprite_KeyMapButton();
        this.addChild(this._stageInfoButton);
        this._stageInfoButton.y = 4;
        this._stageInfoButton.setClickHandler(this.callStageInfo.bind(this));
        this._stageInfoButton.setText(TextManager.getText(725));
        this._stageInfoButton.x = 944 - this._stageInfoButton.width;
    }

    callStageInfo(){
        SoundManager.playOk();
    }
}