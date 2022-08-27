class Model_Event extends Model_Base {
    constructor() {
        super();
    }

    gainCommonEventFlag (eventName) {
        // イベント単位での話した回数
        if (!$gameParty._commonEventNum[eventName]){
            $gameParty._commonEventNum[eventName] = 1;
        } else{
            $gameParty._commonEventNum[eventName] += 1;
        }
        // 全部を通して話した回数
        if (!$gameParty._commonEventRead){
            $gameParty._commonEventRead = {};
        }
        if (!$gameParty._commonEventRead[eventName]){
            $gameParty._commonEventRead[eventName] = 1;
        } else{
            $gameParty._commonEventRead[eventName] += 1;
        }
    }

    loadEventFile (filename) {
        return new Promise(function(resolve){
            DataManager.loadEventFile(filename + '.json',function(data){
                resolve(data)
            });
        });
    }
    
    allEventFileOutput(){
        var eventReadInfo = {};

        let list = [];
        let common = [];
        $dataCommonEvents.forEach(event => {
            if (event != null && event.name != "" && !event.name.includes("*")){
                var isFadeOut = false;
                var isFadeIn = false;
                let fadeoutdata = [];
                let isEnd = false;
                let actor = null;
                event.list.forEach(element => {
                    if (!eventReadInfo[event.name]){
                        eventReadInfo[event.name] = 1;
                    }
                    if (element.code == 111){
                        if (element.parameters.length > 1){//} && element.parameters[1].includes("$gameParty._commonEventNum")){
                            var sentence = String(element.parameters[1]);
                            if (sentence.includes("$gameParty._commonEventNum")){
                                var eventname = sentence.replace("$gameParty._commonEventNum[\"","");
                                var index = eventname.indexOf("\"");
                                eventname = eventname.substring(0,index);

                                if (!eventReadInfo[eventname]){
                                    eventReadInfo[eventname] = 1;
                                }
                                if (element.parameters[1].includes("> 1")){
                                    if (eventReadInfo[eventname] < 2){
                                        eventReadInfo[eventname] = 2;
                                    }
                                }
                                if (element.parameters[1].includes("% 2")){
                                    if (eventReadInfo[eventname] < 2){
                                        eventReadInfo[eventname] = 2;
                                    }
                                }
                                if (element.parameters[1].includes("> 2")){
                                    if (eventReadInfo[eventname] < 3){
                                        eventReadInfo[eventname] = 3;
                                    }
                                }
                                if (element.parameters[1].includes("> 3")){
                                    if (eventReadInfo[eventname] < 4){
                                        eventReadInfo[eventname] = 4;
                                    }
                                }
                                if (element.parameters[1].includes("> 4")){
                                    if (eventReadInfo[eventname] < 5){
                                        eventReadInfo[eventname] = 5;
                                    }
                                }
                                if (element.parameters[1].includes("> 5")){
                                    if (eventReadInfo[eventname] < 6){
                                        eventReadInfo[eventname] = 6;
                                    }
                                }

                            }
                        }
                    }
                    if (element.code == 411){
                        //console.log("else")
                        //console.log(element)
                    }
                    if (element.code == 118){
                        if (element.parameters[0] == "End"){
                            isEnd = true;
                        }
                    }
                    if (element.code == 221){
                        if (isEnd){
                            isFadeIn = false;
                        }
                        if (!isEnd){
                            fadeoutdata.push(true);
                        }
                    }
                    if (element.code == 222){
                        if (isEnd){
                            isFadeIn = true;
                        }
                        if (!isEnd){
                            fadeoutdata.push(false);
                        }
                    }
                    if (element.code == 201){
                    }
                    if (element.code == 101 && element.parameters[2] == 1 && element.parameters[3] == 1){
                        //list.push(event.name)
                    }
                    if (element.code == 101){
                        actor = element.parameters[0];
                    }                  
                    if (element.code == 401){
                        
                        element.parameters.forEach((param,index) => {
                            /*
                            if (param.includes("貴方")){
                                list.push({name:event.name ,actor:actor,param:param});
                            }
                            */
                            /*
                            if (param.includes("　")){
                                element.parameters[index] = param.replace("　"," ");
                            }
                            if (param.includes("……")){
                                element.parameters[index] = param.replace("……","…");
                            }
                            if (param.includes("）") && !param.includes("（")){
                                if (param.charAt(0) == " "){
                                    element.parameters[index] = param.replace(" ","　");
                                }
                            }
                            */
                        });
                        
                    }
                });
                if (isFadeOut){
                    //Debug.log(event.name + "= " +isFadeOut)
                }
                if (fadeoutdata.length > 0 && isFadeIn == false){
                    Debug.log(event.name + "= " +fadeoutdata)
                    console.log(isFadeIn)
                }
                //list = _.uniq(list);
                //list = _.sortBy(list);
                //Debug.log(list)
                var data = JSON.stringify(event);
                var fs = require('fs');
                var dirPath = this.localFileDirectoryPath();
                var filePath = event.name + '.json';
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(dirPath + filePath, data);
            }
            common.push(event);
        });
        /*
        Debug.log(common)
        Debug.log($dataCommonEvents)
        var data = JSON.stringify(common);
        var fs = require('fs');
        var dirPath = this.localFileDirectoryPath();
        var filePath = 'common.json';
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(dirPath + filePath, data);
        */
        console.log(eventReadInfo)
        if (eventReadInfo){
            var data = JSON.stringify(eventReadInfo);
            var fs = require('fs');
            var dirPath = this.localFileDataDirectoryPath();
            var filePath = 'EventReadInfos.json';
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(dirPath + filePath, data);
        }
    }

    localFileDirectoryPath () {
        const path = require('path');
        const base = path.dirname(process.mainModule.filename);
        return path.join(base, 'event/jp/');
    };

    localFileDataDirectoryPath () {
        const path = require('path');
        const base = path.dirname(process.mainModule.filename);
        return path.join(base, 'data/');
    };

    isChangeMessageActor(messageActor){
        this.initMessageActor();
        if (this._lastMessageActor != messageActor){
            this._lastMessageActor = messageActor;
            return true;
        }
        return false;
    }

    initMessageActor(){
        if (this._lastMessageActor == null){
            this._lastMessageActor = null;
        }
    }

    clearMessageActor(){
        this._lastMessageActor = null;
    }

    
    outputActorsText(){
        let list = {};
        $dataCommonEvents.forEach(event => {
            if (event != null && event.name != "" && !event.name.includes("*")){
                let actor = null;
                event.list.forEach(element => {
                    if (element.code == 101 && element.parameters[2] == 1 && element.parameters[3] == 1){
                        //list.push(event.name)
                    }
                    if (element.code == 101){
                        actor = element.parameters[0];
                    }                  
                    if (element.code == 401){
                        element.parameters.forEach((param,index) => {
                            if (actor != null && actor.includes("Actor")){
                                if (list[actor] == null){
                                    list[actor] = [];
                                }
                                list[actor].push(param);
                            }
                        });
                        
                    }
                });
            }
        });
    }
}