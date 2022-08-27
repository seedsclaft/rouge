//-----------------------------------------------------------------------------
// Model_Result
//

class Model_Result extends Model_Base {
    constructor(){
        super();
        this._recordData = [];
        if (!$gameTemp._rankingData){
            $gameTemp._rankingData = {};
        }
    }

    recordDataAll(){
        this._recordData = $gameParty.recordData()._recordData;
        this._recordData = _.sortBy(this._recordData,(record) => record._id);
        return this._recordData;
    }

    async getRankingData(stage){
        return $gameTemp._rankingData[stage._id];
    }

    recordData(stage){
        return _.find(this._recordData,record => record._id == stage._id);
    }
    
}