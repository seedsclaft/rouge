//-----------------------------------------------------------------------------
// Sprite_LoadDock
//

class Sprite_LoadDock extends Sprite{
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
        this.createDataTransportButton();
    }

    createUploadButton(){
        this._uploadButton = new Sprite_KeyMapButton();
        this.addChild(this._uploadButton);
        this._buttons.push(this._uploadButton);
        this._uploadButton.x = 720;
        this._uploadButton.y = 4;
        this._uploadButton.setClickHandler(this.callHandler.bind(this,LoadDockActionType.Upload));
        this._uploadButton.setText(TextManager.getText(729));
    }

    createDataTransportButton(){
        this._dataTransportButton = new Sprite_KeyMapButton();
        this.addChild(this._dataTransportButton);
        this._buttons.push(this._dataTransportButton);
        this._dataTransportButton.x = 720;
        this._dataTransportButton.y = 4;
        this._dataTransportButton.setClickHandler(this.callHandler.bind(this,LoadDockActionType.DataTransport));
        this._dataTransportButton.setText(TextManager.getText(730));
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

const LoadDockActionType = {
    Upload : 0,
    DataTransport : 1
}