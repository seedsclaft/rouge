//-----------------------------------------------------------------------------
// Sprite_MenuDock
//

class Sprite_MenuDock extends Sprite{
    constructor(){
        super();
        this._action = {};
        this._buttons = [];
        this.createButtons();
        this._buttons.push(this._actorPlusButton);
        this._buttons.push(this._actorChangeButton);
        this._buttons.push(this._actorMinusButton);
        this._buttons.push(this._spPlusButton);
        this._buttons.push(this._spChangeButton);
        this._buttons.push(this._spMinusButton);

        this.hide();
    }

    isTutorial(){
        return $gameSwitches.value(6) == true;
    }

    callHandler(key){
        if (this.isTutorial()){
            return;
        }
        if (this._action[key]){
            this._action[key]();
        }
    }

    setClickHandler(key,action){
        this._action[key] = action;
    }

    createButtons(){
        this.createSpButton();
        this.createSpPlusMinus();
        this.createActorChangeButton();
        this.createActorPlusMinus();
    }
    
    createSpButton(){
        this._spChangeButton = new Sprite_KeyMapButton();
        this._spChangeButton.x = 624;
        this._spChangeButton.y = 4;
        this.addChild(this._spChangeButton);
        this._spChangeButton.setText(TextManager.getText(736));
    }

    createSpPlusMinus(){
        this._spMinusButton = new Sprite_Button();
        this._spMinusButton.bitmap = ImageManager.loadSystem("minus");
        this._spMinusButton.y = 4;
        this._spMinusButton.setClickHandler(this.callHandler.bind(this,MenuDockActionType.SpMinus));
        this.addChild(this._spMinusButton);

        this._spPlusButton = new Sprite_Button();
        this._spPlusButton.bitmap = ImageManager.loadSystem("plus");
        this._spPlusButton.y = 4;
        this._spPlusButton.setClickHandler(this.callHandler.bind(this,MenuDockActionType.SpPlus));
        this.addChild(this._spPlusButton);
    }

    createActorChangeButton(){
        this._actorChangeButton = new Sprite_KeyMapButton();
        this._actorChangeButton.x = 824;
        this._actorChangeButton.y = 4;
        this.addChild(this._actorChangeButton);
        this._actorChangeButton.setText(TextManager.getText(735));
    }

    createActorPlusMinus(){
        this._actorMinusButton = new Sprite_Button();
        this._actorMinusButton.bitmap = ImageManager.loadSystem("minus");
        this._actorMinusButton.y = 4;
        this._actorMinusButton.setClickHandler(this.callHandler.bind(this,MenuDockActionType.ActorMinus));
        this.addChild(this._actorMinusButton);

        this._actorPlusButton = new Sprite_Button();
        this._actorPlusButton.bitmap = ImageManager.loadSystem("plus");
        this._actorPlusButton.y = 4;
        this._actorPlusButton.setClickHandler(this.callHandler.bind(this,MenuDockActionType.ActorPlus));
        this.addChild(this._actorPlusButton);
    }

    show(){
        super.show();
        this.setButtonsPosition();
    }

    show(isSpchange){
        super.show();
        this._spChangeButton.visible = isSpchange;
        this._spMinusButton.visible = isSpchange;
        this._spPlusButton.visible = isSpchange;
        this.setButtonsPosition();
    }

    setButtonsPosition(){
        let posX = 960;
        const marginX = 6;
        this._buttons.forEach((button,index) => {
            if (button.visible){
                let spacing = button.width;
                if (index % 3 != 0){
                    spacing -= 30;
                } else{
                    posX -= 24;
                }
                button.x = posX - spacing;
                posX -= spacing;
                posX -= marginX;
            }
        });
    }
}

const MenuDockActionType = {
    SpPlus : 0,
    SpMinus : 1,
    ActorPlus : 2,
    ActorMinus : 3
}