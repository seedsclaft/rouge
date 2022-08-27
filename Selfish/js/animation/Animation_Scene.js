//-----------------------------------------------------------------------------
// Animation_Scene
//

class Animation_Scene extends Scene_Base{
    constructor(){
        super();
        this._presenter = new Presenter_Animation(this);
    }

    create(){
        BackGroundManager.resetup();
        EventManager.resetup();
        super.create();
        this.createDisplayObjects();
    }

    setResourceData(resourceData){
        this._resourceData = resourceData;
    }

    isReady(){
        return this._presenter.isReady();
    }

    createDisplayObjects(){
        this.createWindowLayer();
        this._listWindow = new Window_AnimationSelect(0,0,160,540);
        this._listWindow.setHandler('index',     this.changeSelectIndex.bind(this));
        this.addChild(this._listWindow);
    }

    start(){
        super.start();
        this.setCommand(AnimationCommand.Start);
    }

    setData(data){
        this._listWindow.setData(data);
        this._listWindow.activate();
    }

    changeSelectIndex(){
        this.setCommand(AnimationCommand.ChangeSelect);
    }

    playAnimation(data){
        let x = 240;
        let y = Graphics.height / 4;
        if (data.position == 3){
            x = 0;
            y = 0;
        }
        EventManager.showAnimation(data.id,x,y,1,1);
    }
}

const AnimationCommand = {
    Start : 0,
    ChangeSelect : 1,
}