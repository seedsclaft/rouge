class Event_Scene extends Scene_Base{
    constructor(){
        super();
    }

    create(){
        BackGroundManager.resetup();
        EventManager.resetup();
    }

    update(){
        super.update();
        $gameScreen.update();
    }
}