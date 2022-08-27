//-----------------------------------------------------------------------------
// MagicInfo_Scene
//

class MagicInfo_Scene extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Presenter_MagicInfo(this);
    }

    create(){
        super.create();
        //this.createHelpWindow();
        this.createScreenSprite();
        this.createListWindow();
        this.createStatusWindow();
        this.createCategoryText();
        this.createCategoryButton();
        this.createMenuButton();
        this.createBackButton();
        this.createMenuSprite();
        this.createKeyMapWindow();
        this.setMenuSprite(TextManager.getText(2120));
    }

    createBackButton(){
        this._backButton = new Sprite_IconButton();
        this.addChild(this._backButton);
        this._backButton.setup(TextManager.getBackText());
        this._backButton.setClickHandler(() => {
            SoundManager.playCancel();
            if (this._statusWindow.active){
                this.cancelStatus();
                return;
            }
            this.popScene()
        })
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('menuMagicInfo');
        }
    }

    createEnemySprite(){
        /*
        */
    }

    createListWindow(){
        this._listWindow = new Window_MagicInfoList(-16,96,320,408);
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this._listWindow.setHandler('index',  this.selectChange.bind(this));
        this._listWindow.setHandler('pageup',  this.callCategoryChange.bind(this,-1));
        this._listWindow.setHandler('pagedown',  this.callCategoryChange.bind(this,1));
        this.addChild(this._listWindow);
    }

    createStatusWindow(){
        this._statusWindow = new Window_MagicInfoStatus(344,100,564,408);
        this.addChild(this._statusWindow);
    }

    createCategoryText(){
        let _backCategory = new Sprite();
        _backCategory.bitmap = new Bitmap(320,40);
        _backCategory.x = 640;
        _backCategory.y = 56;
        _backCategory.alpha = 0.5;
        this.addChild(_backCategory);
        _backCategory.bitmap.fillRect(0, 0, 320, 40, "black");

        this._categoryText = new Sprite();
        this._categoryText.bitmap = new Bitmap(240,40);
        this._categoryText.x = 724;
        this._categoryText.y = 56;
        this.addChild(this._categoryText);

        let _categoryTitle = new Sprite();
        _categoryTitle.bitmap = new Bitmap(240,40);
        _categoryTitle.x = 656;
        _categoryTitle.y = 56;
        this.addChild(_categoryTitle);
        _categoryTitle.bitmap.fontSize = 21;
        _categoryTitle.bitmap.drawText(TextManager.getText(1200100),0,0,240,40);
    }

    createCategoryButton(){
        this._categoryRightButton = new Sprite_Button();
        this._categoryRightButton.bitmap = ImageManager.loadSystem("minus");
        this._categoryRightButton.x = 746 + 12;
        this._categoryRightButton.y = 60;
        this._categoryRightButton.setClickHandler(this.callCategoryChange.bind(this,-1));
        this.addChild(this._categoryRightButton);

        this._categoryLeftButton = new Sprite_Button();
        this._categoryLeftButton.bitmap = ImageManager.loadSystem("plus");
        this._categoryLeftButton.x = 880;
        this._categoryLeftButton.y = 60;
        this._categoryLeftButton.setClickHandler(this.callCategoryChange.bind(this,1));
        this.addChild(this._categoryLeftButton);
    }

    start(){
        super.start();
        this.setCommand({command:MagicInfoCommand.Start});
    }

    commandStart(data){
        this._listWindow.setData(data);
        this._listWindow.activate();
        this._listWindow.selectLast();
        this._statusWindow.show();
        //this._statusWindow.showAnimation();
        this._statusWindow.deactivate();
    }

    selectChange(){
        this.setCommand({command:MagicInfoCommand.ChangeIndex});
    }

    commandChangeIndex(magicId,categoryText){
        this._statusWindow.setData(magicId);
        this._listWindow.selectLast();
        this._listWindow.activate();

        this._categoryText.bitmap.clear();
        this._categoryText.bitmap.fontSize = 21;
        this._categoryText.bitmap.drawText(categoryText,0,0,240,40,"center");
    }

    cancelStatus(){
        this._listWindow.activate();
        this._statusWindow.deactivate();
    }

    terminate(){
        super.terminate();
        this._statusWindow = null;
    }

    callCategoryChange(select){
        this.setCommand({command:MagicInfoCommand.ChangeCategory,select:select});
    }

}

const MagicInfoCommand = {
    Start : 1,
    ChangeIndex : 2,
    ChangeCategory : 3
}