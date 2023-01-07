class Model_File extends Model_Base {
    constructor() {
        super();
    }

    lastStageNo (){
        return 1;
    }
    
    saveFiles(){
        let auto = [];
        let data = auto.concat(DataManager.savefiles());
        // 新規作成リスト用
        if (SceneManager._scene instanceof Save_Scene && data.length < 100){
            data.push(null);
        }
        return data;
    }

    selectLastIndex(){
        if (this.saveFiles().length == 2){
            return 1;
        }
        return $dataOption.lastAccessSaveId() - 1;
    }

    setSelectLastIndex(id){
        if (id < DataManager.autoSaveGameId()){
            $dataOption.setUserData("lastAccessSaveId",id + 1);
            ConfigManager.save();
        }
    }

    loadFile(index){
        // auto
        if (index == 0){
            index = 100;
        }
        if (DataManager.loadGame(index)) {
            return true;
        } else {
            return false;
        }
    }

    saveFile(index){
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(index)) {
            return true;
        } else {
            return false;
        }
    }


    upLoadData(savedataId){
        return StorageManager.load(savedataId);
    }
}