class BgmLoader_Event {
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
            return com.code == 241 || (com.code == 655 && _.find(com.parameters,(param) => param.includes('playBgm')));
        })
    }

    async loadBgmFirst(){
        if (this._commands.length > 0){
            await this.loadBgm(this._commands[0]);
        }
    }

    async loadBgm(command){
        this._busy = true;
        this.currentId = _.findIndex(this._commands,(com) => com == command);
        if (this._commands.length > 0 && this.currentId >= 0){
            this.releaseBgm();
            var bgms = [];
            this._commands.forEach((com,index) => {
                if (this.currentId <= index){
                    if (index < (this.saveLength + this.currentId)){
                        if (com.code == 655){
                            var fileName = this.getBgmData(com);
                            Debug.log(fileName)
                        }
                        if (!AudioManager.loadedBgmResource([fileName])){
                            AudioManager.loadBgm(fileName);
                            bgms.push(fileName);
                        }
                    }
                }
            });
            Debug.error("waitLoadBgm start");
            await this.waitLoadBgm(bgms);
        }
        this._busy = false;
    }

    releaseBgm(){
        this._commands.forEach((com,index) => {
            if (index < this.currentId-1){
                if (com.code == 655){
                    var fileName = this.getBgmData(com);
                    Debug.log(fileName)
                }
                AudioManager.purgeBgm(fileName);
            }
        });

    }

    releaseBgmAll(){
        this._commands.forEach((com,index) => {
            if (com.code == 655){
                var fileName = this.getBgmData(com);
            }
            if (fileName){
                //AudioManager.purgeBgm(fileName);
            }
        });
    }

    getBgmData(com){
        var fileName = com.parameters[0].replace("AudioManager.playBgm","");
        fileName = fileName.replace('$gameBGM.','');
        fileName = fileName.replace('getBgm','');
        fileName = fileName.replace("(","");
        fileName = fileName.replace(")","");
        fileName = fileName.replace("(","");
        fileName = fileName.replace(")","");
        fileName = fileName.replace(";","");
        fileName = fileName.replace("\"","");
        fileName = fileName.replace("\"","");
        Debug.error(fileName);
        fileName = $gameBGM.getBgm(fileName);
        return fileName;
    }

    waitLoadBgm (fileName) {
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
            if (AudioManager.loadedBgmResource(fileName)){
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