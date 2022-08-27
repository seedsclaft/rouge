//-----------------------------------------------------------------------------
// Presenter_Result
//

class Presenter_Result extends Presenter_Base {
    constructor(view){
        super();
        this.initialize(view);
    }

    initialize(view){
        this._view = view;
        this._model = new Model_Result();
        this._busy = false;
    
        this.setEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    updateCommand(){
        super.updateCommand();
        if (this._busy == true){
            return;
        }
        switch (this._view._command){
            case ResultCommand.Start:
            return this.commandStart();
            case ResultCommand.ChangeIndex:
            return this.commandChangeIndex();
            case ResultCommand.ScoreUpdate:
            return this.commandScoreUpdate();
            case ResultCommand.LoadRanking:
            return this.commandLoadRanking();
        }
        this._view.clearCommand();
    }

    commandStart(){
        this._view.showRecordList(this._model.recordDataAll(),0);
        this._view.activateRecordList();
        this.commandChangeIndex();
    }

    async commandChangeIndex(){
        this._busy = true;
        const stageData = this._view._listWindow.item();
        const recordData = this._model.recordData(stageData);
        let stageId = stageData._id;
        if (stageId > 100){
            stageId -= 100;
        }
        let backGround = DataManager.getStageInfos(stageId).backGround;
        if (stageData._type == Game_ResultType.Battle){
            const rankingData = await this._model.getRankingData(stageData);
            const battlerPicture = `Actor` + String(Number(stageData._finishActorId).padZero(4));
            this._view.commandChangeIndex(recordData,rankingData,battlerPicture,backGround);
        } else{
            this._view.commandChangeIndex(recordData,null,'Actor0005','School5'); 
        }
        this._busy = false;
    }

    commandScoreUpdate(){
        SoundManager.playOk();
        this._view.commandScoreUpdate();
    }

    async commandLoadRanking(){
        this._busy = true;
        const stageData = this._view._listWindow.item();
        Presenter_Loading.open();
        const rankData = await this._model.getRankingDataAll(stageData);
        const recordData = this._model.recordData(stageData);
        this._view.commandLoadRanking(recordData,rankData);
        Presenter_Loading.close();
        this._busy = false;
    }
}