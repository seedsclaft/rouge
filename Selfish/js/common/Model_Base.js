class Model_Base {
    constructor() {
    }
    
    bgName(){
        if (this._tempBgName){
            return this._tempBgName;
        }
        return $gamePlayer._lastMapBG1;
    }

    stageData(){
        return DataManager.getStageInfos($gameParty._stageNo);
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
    
    stageBgsData(){
        let bgs = this.stageData().bgs;
        const bgsOptions = this.stageData().bgsOptions;
        bgsOptions.forEach(bgsOpt => {
            if (bgsOpt.seeking < $gameParty.stageProgress()*100){
                bgs = bgsOpt.bgs;
            }
        });
        return ({name:bgs,volume: 30,pitch : 100,pan : 0});
    }
}