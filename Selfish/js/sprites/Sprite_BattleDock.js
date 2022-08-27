//-----------------------------------------------------------------------------
// Sprite_BattleDock
//

class Sprite_BattleDock extends Sprite{
    constructor(){
        super();
        this._action = {};
        this.createButtons();
        this.hideGuardButton();
        this.hideSkillChangeButton();
        this.hideLimitBreakButton();
        this._buttons = [];
        this._buttons.push(this._guardButton);
        this._buttons.push(this._skillChangeButton);
        this._buttons.push(this._limitBreakButton);
        this._buttons.push(this._categoryChangeButton);
        this._buttons.push(this._categoryLeftButton);
        this._buttons.push(this._analyzeButton);
        this._buttons.push(this._categoryRightButton);
        this.showTypeChange(false);
        this._skillChangeEnable = true;
        this._categoryChangeEnable = true;
        this._limitBreakEnable = true;
        this._guardEnable = true;
    }

    setClickHandler(key,action){
        this._action[key] = action;
    }

    createButtons(){
        this.createSkillChangeButton();
        this.createLimitBreakButton();
        this.createCategoryChangeButton();
        this.createGuardButton();
        this.createAnalyzeButton();
        this.createArrows();
    }
    
    createSkillChangeButton(){
        this._skillChangeButton = new Sprite_KeyMapButton();
        this.addChild(this._skillChangeButton);
        this._skillChangeButton.x = 694;
        this._skillChangeButton.y = 4;
        this._skillChangeButton.setClickHandler(this.callHandler.bind(this,BattleDockActionType.SkillChange));
        //this.hideSkillChangeButton();
        this._skillChangeButton.setText(TextManager.getText(714));

    }

    showSkillChangeButton(){
        this._skillChangeButton.visible = true;
        this.setButtonsPosition(false);
    }
    
    hideSkillChangeButton(){
        this._skillChangeButton.visible = false;
    }

    enableSkillChangeButton(enable){
        if (enable){
            this._skillChangeButton.opacity = 255;
        } else{
            this._skillChangeButton.opacity = 128;
        }
        this._skillChangeEnable = enable;
    }

    callHandler(key){
        if (this._action[key]){
            if (key == BattleDockActionType.AnalyzeNext
            || key == BattleDockActionType.AnalyzePrevios){
                SoundManager.playCursor();
            }
            if (key == BattleDockActionType.SkillChange){
                if (!this._skillChangeEnable){
                    return;
                }
            } else
            if (key == BattleDockActionType.CategoryChange){
                if (!this._categoryChangeEnable){
                    return;
                }
            } else
            if (key == BattleDockActionType.LimitBreak){
                if (!this._limitBreakEnable){
                    return;
                }
            } else
            if (key == BattleDockActionType.Guard){
                if (!this._guardEnable){
                    return;
                }
            }
            this._action[key]();
        }
    }

    createLimitBreakButton(){
        this._limitBreakButton = new Sprite_KeyMapButton();
        this.addChild(this._limitBreakButton);
        this._limitBreakButton.x = 694 - 240;
        this._limitBreakButton.y = 4;
        this._limitBreakButton.setClickHandler(this.callHandler.bind(this,BattleDockActionType.LimitBreak));
        
        this._limitBreakButton.setText(TextManager.getText(738));
    }

    showLimitBreakButton(){
        this._limitBreakButton.visible = true;
        this.setButtonsPosition(false);
    }
    
    hideLimitBreakButton(){
        this._limitBreakButton.visible = false;
    }

    enableLimitBreakButton(enable){
        if (enable){
            this._limitBreakButton.opacity = 255;
        } else{
            this._limitBreakButton.opacity = 128;
        }
        this._limitBreakEnable = enable;
    }

    createCategoryChangeButton(){
        this._categoryChangeButton = new Sprite_KeyMapButton();
        this.addChild(this._categoryChangeButton);
        this._categoryChangeButton.x = 694;
        this._categoryChangeButton.y = 4;
        this._categoryChangeButton.setClickHandler(this.callHandler.bind(this,BattleDockActionType.CategoryChange));
        //this.hideSkillChangeButton();
        this._categoryChangeButton.setText(TextManager.getText(726));
    }

    showCategoryChangeButton(){
        this._categoryChangeButton.visible = true;
        this.setButtonsPosition(false);
    }
    
    hideCategoryChangeButton(){
        this._categoryChangeButton.visible = false;
    }

    enableCategoryChangeButton(enable){
        if (enable){
            this._categoryChangeButton.opacity = 255;
        } else{
            this._categoryChangeButton.opacity = 128;
        }
        this._categoryChangeEnable = enable;
    }

    createGuardButton(){
        this._guardButton = new Sprite_KeyMapButton();
        this.addChild(this._guardButton);
        this._guardButton.x = 824;
        this._guardButton.y = 4;
        this._guardButton.clickCallTypeChange();
        this._guardButton.setClickHandler(this.callHandler.bind(this,BattleDockActionType.Guard));
        //this.hideGuardButton();
        this._guardButton.setText(TextManager.getText(721));
    }

    createAnalyzeButton(){
        this._analyzeButton = new Sprite_KeyMapButton();
        this.addChild(this._analyzeButton);
        this._analyzeButton.y = 4;
        this._analyzeButton.clickCallTypeChange();
        this._analyzeButton.setText(TextManager.getText(713));
        //this._analyzeButton.setClickHandler(this.callHandler.bind(this,BattleDockActionType.Analyze));
        //this.hideGuardButton();
        this._analyzeButton.x = 924 - this._analyzeButton.width;
    }

    showAnalyzeButton(){
        this._analyzeButton.visible = true;
        this.setButtonsPosition(true);
    }
    
    hideAnalyzeButton(){
        this._analyzeButton.visible = false;
    }

    showGuardButton(){
        this._guardButton.visible = true;
        this.setButtonsPosition(false);
    }
    
    hideGuardButton(){
        this._guardButton.visible = false;
    }

    enableGuardButton(enable){
        if (enable){
            this._guardButton.opacity = 255;
        } else{
            this._guardButton.opacity = 128;
        }
        this._guardEnable = enable;
    }

    createArrows(){
        this._categoryRightButton = new Sprite_Button();
        this._categoryRightButton.bitmap = ImageManager.loadSystem("minus");
        this._categoryRightButton.y = 4;
        this._categoryRightButton.setClickHandler(this.callHandler.bind(this,BattleDockActionType.AnalyzePrevios));
        this.addChild(this._categoryRightButton);

        this._categoryLeftButton = new Sprite_Button();
        this._categoryLeftButton.bitmap = ImageManager.loadSystem("plus");
        this._categoryLeftButton.y = 4;
        this._categoryLeftButton.setClickHandler(this.callHandler.bind(this,BattleDockActionType.AnalyzeNext));
        this.addChild(this._categoryLeftButton);
    }

    showTypeChange(isSelecting){
        if (isSelecting){
            //this.showLimitBreakButton();
            this.showSkillChangeButton();
            this.showGuardButton();
            this.showCategoryChangeButton();
            this.hideAnalyzeButton();
        } else{
            //this.hideLimitBreakButton();
            this.hideSkillChangeButton();
            this.hideGuardButton();
            this.hideCategoryChangeButton();
            this.showAnalyzeButton();
        }
        this._categoryLeftButton.visible = !isSelecting;
        this._categoryRightButton.visible = !isSelecting;
        this.setButtonsPosition(!isSelecting);
    }

    show(){
        super.show();
    }

    setButtonsPosition(isAnalyze){
        let posX = 960;
        const marginX = 6;
        this._buttons.forEach((button,index) => {
            if (button.visible){
                let spacing = button.width;
                if (index % 4 != 0 && isAnalyze){
                    spacing -= 30;
                } else{
                    posX -= 24;
                }
                button.x = posX - spacing;
                posX -= spacing;
                posX -= marginX;
            }
        });
        //this._analyzeButton.x = 924 - this._analyzeButton.width;
    }

}

const BattleDockActionType = {
    SkillChange : 0,
    LimitBreak : 1,
    Guard : 2,
    Analyze : 3,
    AnalyzeNext : 4,
    AnalyzePrevios : 5,
    CategoryChange : 6
}