//-----------------------------------------------------------------------------
// Top_Scene
//

class Top_Scene extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Presenter_Top(this);
    }

    create(){
        super.create();
    }

    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
            this._keyMapWindow.refresh('menuEnemy');
        }
    }

    start(){
        super.start();
        this.setCommand(TopCommand.Start);
    }

    commandLogo(){
        TutorialManager.openGuide("release001",0,() => {        
            this.commandGameStart();
        });
    }


    commandGameStart(){
        SceneManager.goto(Title_View);
        Window_TitleCommand.initCommandPosition();
    }

    update(){
        super.update();
        if (TutorialManager.busy()){
            if (Input.isTriggered('ok') || Input.isTriggered('cancell') || TouchInput.isReleased()){
                SoundManager.playOk();
                TutorialManager.clear(() => {
                    this.commandGameStart();
                });
            }
        }
    }

}

const TopCommand = {
    Start : 1
}