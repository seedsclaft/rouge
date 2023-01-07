class Menu_Model extends Model_Base {
    constructor() {
        super();
        this._actorList = null;
        this.actorList().forEach(actor => {
            ImageManager.loadFace(actor.faceName())
        });
    }
    
    backGround(){
        return ["menu",null];
    }

    menuBgm(){
        return $gameBGM.getBgm('menu');
    }

    stageData(){
        return $gameStageData.data();
    }
    
    selectStage(stage){
        $gameStage.setup(stage.id);
    }

    actorList(){
        if (this._actorList == null){
            let actorList = [];
            $gameActors._data.forEach(actorData => {
                if (actorData) actorList.push(actorData);
            });
            this._actorList = actorList;
        }
        return this._actorList;
    }

    setStageActor(actor){
        const _member = $gameParty.members();
        _member.forEach(member => {
            $gameParty.removeActor(member.actorId());
        });
        actor.setSelectedIndex(1);
        $gameParty.addActor(actor.actorId());
    }
}