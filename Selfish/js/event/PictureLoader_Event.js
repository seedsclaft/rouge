class PictureLoader_Event {
    constructor() {
        this.initMember();
    }

    initMember(){
        this._commands = [];
        this.saveLength = 2;
        this.currentId = 0;
        this._busy = false;
    }

    setCommand(commands){
        this._commands = _.filter(commands,function(com){
            return com.code == 283;
        })
    }

    async loadPictureFirst(){
        if (this._commands.length > 0){
            await this.loadPicture(this._commands[0]);
        }
    }

    async loadPicture(command){
        this._busy = true;
        this.currentId = _.findIndex(this._commands,(com) => com == command);
        if (this._commands.length > 0 && this.currentId >= 0){
            this.releasePicture();
            var pictures = [];
            this._commands.forEach((com,index) => {
                if (this.currentId <= index){
                    if (index < (this.saveLength + this.currentId)){
                        let fileName = com.parameters[0];
                        if (fileName != null && fileName != "" && !ImageManager.loadedBattleBack1Resource([fileName])){
                            ImageManager.loadBattleback1(fileName);
                            pictures.push(fileName);
                        }
                    }
                }
            });
            if (pictures.length > 0){
                Debug.error("waitLoadPicture start");
                await this.waitLoadPicture(pictures);
            }
        }
        this._busy = false;
    }

    releasePicture(){
        this._commands.forEach((com,index) => {
            if (index < this.currentId-1){
                ImageManager.clearImageBattleBack1(com.parameters[0]);
            }
        });
    }

    waitLoadPicture (fileName) {
        const self = this;
        return new Promise(function(resolve){
            self.intervalRepeater(fileName,function(){
                resolve();
            });
        });
    }

    // 最低間隔を確保したいタイプのリピート処理を行う関数
    async intervalRepeater (fileName,resolve) {
        const self = this;
        while (true) {
            // 本処理と sleep を同時実行して最低間隔を確保する
            await Promise.all([self.sleep(500)])
            if (ImageManager.loadedBattleBack1Resource(fileName)){
                resolve()
                break;
            }
        }
    }

    async sleep (msec){
        return new Promise(resolve => setTimeout(resolve, msec));
    }

    busy(){
        return this._busy;
    }
}