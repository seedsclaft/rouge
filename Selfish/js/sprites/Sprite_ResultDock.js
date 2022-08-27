//-----------------------------------------------------------------------------
// Sprite_ResultDock
//

class Sprite_ResultDock extends Sprite{
    constructor(){
        super();
        this._buttons = [];
        this._action = {};
        this.createButtons();
        this.setButtonsPosition();
    }

    setClickHandler(key,action){
        this._action[key] = action;
    }

    callHandler(key){
        if (this._action[key]){
            this._action[key]();
        }
    }

    createButtons(){
        this.createUploadButton();
    }

    createUploadButton(){
        this._uploadButton = new Sprite_KeyMapButton();
        this.addChild(this._uploadButton);
        this._buttons.push(this._uploadButton);
        this._uploadButton.x = 720;
        this._uploadButton.y = 4;
        this._uploadButton.setClickHandler(this.callHandler.bind(this,LoadDockActionType.Upload));
        this._uploadButton.setText(TextManager.getText(734));
    }

    setButtonsPosition(){
        let posX = 960;
        const marginX = 6;
        this._buttons.forEach((button,index) => {
            if (button.visible){
                let spacing = button.width;
                posX -= 24;
                button.x = posX - spacing;
                posX -= spacing;
                posX -= marginX;
            }
        });
    }
}

const ResultDockActionType = {
    Upload : 0
}