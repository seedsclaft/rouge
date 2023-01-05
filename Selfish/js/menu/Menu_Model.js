class Menu_Model extends Model_Base {
    constructor() {
        super();
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
        $gameStage.initialize(stage.id);
    }
}