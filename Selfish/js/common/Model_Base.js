class Model_Base {
    constructor() {
    }
    
    bgName(){
    }

    stageData(){
    }

    continuePositionData(){
        const continueBackGroundPosition = this._tempContinueBackGroundPosition ? this._tempContinueBackGroundPosition : $gameScreen.backGroundPosition();
        return continueBackGroundPosition ? continueBackGroundPosition : [0,0];
    }
    continueSizeData(){
        const continueBackGroundSize = this._tempContinueBackGroundSize ? this._tempContinueBackGroundSize : $gameScreen.backGroundSize();
        return continueBackGroundSize ? continueBackGroundSize : [1024,576];
    }

    reloadMapIfUpdated(){
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
            $gamePlayer.requestMapReload();
        }
    }
    
    resumeScene(){
        return $gameSystem.resume();
    }
    
    endEvent(){
        return this.stageData().endEvent;
    }

    endEventScene(){
        return this.stageData().endEventScene;
    }

    battlerFeature(battler){
        return battler.features();
    }
    
    resetingFilters(){
        FilterMzUtility.changeThrouthTerminal(false);
        const filters = $gameScreen.filters();
        FilterMzUtility.initFilters();
        filters.forEach(filter => {
            FilterMzUtility.addFilter(Number( filter ));
        });
    }


    isTutorial(){
        return $gameSwitches.value(6) == true;
    }
    
}