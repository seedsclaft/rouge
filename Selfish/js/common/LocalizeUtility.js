class LocalizeUtility {
    constructor() {
    }

    static outputTextdata(){
        const keyNames = [
            "actorsName",
            "skillsName",
            "skillsDescription",
            "mapinfosName",
            //"itemsName",
            "statesName",
            "statesMessage1",
            "systemElements",
            "systemSkillTypes",
            "troopsName",
            "enemiesName",
            //"helpText",
        ]
        let textTemp = {};
        textTemp['actorsName'] =        $dataActors.map(d => d != null ? d.name : null);
        textTemp['skillsName'] =        $dataSkills.map(d => d != null ? d.name : null);
        textTemp['skillsDescription'] = $dataSkills.map(d => d != null ? d.description : null);
        textTemp['mapinfosName'] =      $dataMapInfos.map(d => d != null ? d.name : null);
        //textTemp['itemsName'] =         $dataItems.map(d => d != null ? d.name : null);
        textTemp['statesName'] =        $dataStates.map(d => d != null ? d.name : null);
        textTemp['statesMessage1'] =     $dataStates.map(d => d != null ? d.message1 : null);
        textTemp['systemElements'] =    $dataSystem.elements.map(d => d != null ? d : null);
        textTemp['systemSkillTypes'] =  $dataSystem.skillTypes.map(d => d != null ? d : null);
        textTemp['troopsName'] =        $dataTroops.map(d => d != null ? d.name : null);
        textTemp['enemiesName'] =       $dataEnemies.map(d => d != null ? d.name : null);

        

        textTemp['helpText'] = $dataText['helpText'];

        const fs = require('fs');
        keyNames.forEach(keyname => {
            let data = textTemp[keyname];
            data = JSON.stringify(data);
            var dirPath = this.localFileDirectoryTextPath();
            var filePath = keyname + '.json';
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(dirPath + filePath, data);
            //csv 
            if (keyname == "quizQuestion" || keyname == "quizChoices" || keyname == "helpText"){

            } else{
                this.data2csv(textTemp[keyname],keyname);
            }
        });

        let data = JSON.stringify($gameText.baseTextData());
        var dirPath = this.localFileDirectoryTextPath();
        var filePath = 'systemtext.json';
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(dirPath + filePath, data);
        //csv 
        this.json2csv($gameText.baseTextData());
        this.help2csv();
        //this.tutorial2csv($gameTutorial._data);
        
        this.allTextDataLength();
    }

    static csvToTextdata(type){
        var fs = require('fs');
        let path = require('path');
        var iconvlite = require('iconv-lite');
        const base = path.dirname(process.mainModule.filename);
        path = path.join(base, "csv/en/text");

        let allDirents = fs.readdirSync(path, { withFileTypes: true });
        allDirents.forEach(file => {
            let p = fs.readFileSync(path + "\\" + file.name);
            p = iconvlite.decode(Buffer.from(p), type);
            //p = iconvlite.decode(Buffer.from(p), "Shift_JIS");
            //p = iconvlite.decode(Buffer.from(p), "utf-8");
            if (file.name == "systemtext.csv"){
                this.outputSystemText(p);
            } else 
            if (file.name == "materialtext.csv"){
                var outputname = file.name.replace("csv","");
                this.outputMaterialTextData(p,outputname + "json");
            } else 
            if (file.name == "quiztext.csv"){
                var outputname = file.name.replace("csv","");
                this.outputQuizTextData(p,outputname + "json");
            } else 
            if (file.name == "tipstext.csv"){
                var outputname = file.name.replace("csv","");
                this.outputTipsTextData(p,outputname + "json");
            } else 
            if (file.name == "helptext.csv"){
                var outputname = file.name.replace("csv","");
                this.outputHelpTextData(p,outputname + "json");
            } else 
            if (file.name == "skillsDescription.csv"){
                var outputname = file.name.replace("csv","");
                this.outputSkillsDescriptionData(p,outputname + "json");
            } else {
                var outputname = file.name.replace("csv","");
                this.outputTextData(p,outputname + "json");
            }
        });
    }

    static outputSystemText(csv){
        let jsonData = {};
        let dataArray = this.csvToJson(csv);
        dataArray.forEach(data => {
            data[1] = data[1].replace(/\r/g, '');
            data[1] = data[1].replace(/\c/g, ',');
            data[1] = data[1].replace(/’/g, '`');
            data[1] = data[1].replace(/”/g, '"');
            data[1] = data[1].replace(/“/g, '"');
            this.convertChar(data[1]);
            jsonData[data[0]] = data[1];
        });
        jsonData = JSON.stringify(jsonData);
        this.outputJson('text/en/' + 'systemtext.json' ,jsonData);
    }

    static outputSkillsDescriptionData(csv,filename){
        let jsonData = [];
        let dataArray = this.csvToJson(csv);
        dataArray.forEach(data => {
            data[1] = data[1].replace(/\r/g, '');
            data[1] = data[1].replace(/\c/g, ',');
            data[1] = data[1].replace(/’/g, '`');
            data[1] = data[1].replace(/”/g, '"');
            data[1] = data[1].replace(/“/g, '"');
            this.convertChar(data[1]);
            data[2] = data[2].replace(/\r/g, '');
            data[2] = data[2].replace(/\c/g, ',');
            data[2] = data[2].replace(/’/g, '`');
            data[2] = data[2].replace(/”/g, '"');
            data[2] = data[2].replace(/“/g, '"');
            this.convertChar(data[2]);
            if (data[2] != ""){
                data[1] += "\n" + data[2];
            }
            jsonData.push(data[1]);
        });
        jsonData = JsonEx.stringify(jsonData);
        this.outputJson('text/en/' + filename ,jsonData);
    }

    static outputTextData(csv,filename){
        let jsonData = [];
        let dataArray = this.csvToJson(csv);
        dataArray.forEach(data => {
            data[1] = data[1].replace(/\r/g, '');
            data[1] = data[1].replace(/\c/g, ',');
            data[1] = data[1].replace(/’/g, '`');
            this.convertChar(data[1]);
            jsonData.push(data[1]);
        });
        jsonData = JsonEx.stringify(jsonData);
        this.outputJson('text/en/' + filename ,jsonData);
    }

    static outputMaterialTextData(csv,filename){
        var materialTitle = [];
        var materialText = [];
        let dataArray = this.csvToJson(csv);
        
        for (var i = 0;i < 1000; i++){
            var temp = _.find(dataArray,(data) => data[0] == i);
            var tempText = "";
            if (temp){
                temp[2] = temp[2].replace(/\r/g, '');
                temp[2] = temp[2].replace(/\c/g, ',');
                temp[2] = temp[2].replace(/’/g, '`');
                temp[2] = temp[2].replace(/”/g, '"');
                temp[2] = temp[2].replace(/“/g, '"');
                this.convertChar(temp[2]);
                materialTitle.push(temp[2]);
                for (var j = 3; j <= temp.length; j++){
                    if (temp[j] && temp[j] != ""){
                        tempText += temp[j];
                        if (temp.length <= (temp.length+1)){
                            if (temp[j+1] != "" && temp[j+1]){
                                tempText += "\n";
                            }
                        }
                    }
                }
                tempText = tempText.replace(/\c/g, ',');
                tempText = tempText.replace(/\r/g, '');
                tempText = tempText.replace(/’/g, '`');
                tempText = tempText.replace(/”/g, '"');
                tempText = tempText.replace(/“/g, '"');
                this.convertChar(tempText);
                materialText.push(tempText);
            } else{
                materialTitle.push("");
                materialText.push("");
            }
        }
        materialTitle = JSON.stringify(materialTitle);
        materialText = JSON.stringify(materialText);
        this.outputJson('text/en/' + "materialTitle.json" ,materialTitle);
        this.outputJson('text/en/' + "materialText.json" ,materialText);
    }

    static outputQuizTextData(csv,filename){
        var quizQuestion = [];
        var quizChoices = [];
        let dataArray = this.csvToJson(csv);
        dataArray.forEach(data => {
            data[0] = data[0].replace(/\r/g, '');
            data[0] = data[0].replace(/\c/g, ',');
            data[0] = data[0].replace(/’/g, '`');
            data[0] = data[0].replace(/”/g, '"');
            data[0] = data[0].replace(/“/g, '"');
            this.convertChar(data[0]);
            quizQuestion.push(data[0]);
            data[2] = data[2].replace(/\r/g, '');
            data[3] = data[3].replace(/\r/g, '');
            data[4] = data[4].replace(/\r/g, '');
            data[2] = data[2].replace(/\c/g, ',');
            data[3] = data[3].replace(/\c/g, ',');
            data[4] = data[4].replace(/\c/g, ',');
            data[2] = data[2].replace(/’/g, '`');
            data[3] = data[3].replace(/’/g, '`');
            data[4] = data[4].replace(/’/g, '`');
            data[2] = data[2].replace(/”/g, '"');
            data[2] = data[2].replace(/“/g, '"');
            data[3] = data[3].replace(/”/g, '"');
            data[3] = data[3].replace(/“/g, '"');
            data[4] = data[4].replace(/”/g, '"');
            data[4] = data[4].replace(/“/g, '"');
            this.convertChar(data[2]);
            this.convertChar(data[3]);
            this.convertChar(data[4]);
            var choise = ([data[2],data[3],data[4]]);
            quizChoices.push(choise);
        });
        quizQuestion = JSON.stringify(quizQuestion);
        quizChoices = JSON.stringify(quizChoices);
        
        this.outputJson('text/en/' + "quizQuestion.json" ,quizQuestion);
        this.outputJson('text/en/' + "quizChoices.json" ,quizChoices);
    }

    static outputTipsTextData(csv,filename){
        var tipsText = [];
        var tipsHelpText = [];
        let dataArray = this.csvToJson(csv);
        
        for (var i = 0;i < 1000; i++){
            var temp = _.find(dataArray,(data) => data[1] == i);
            var tempText = "";
            if (temp){
                temp[2] = temp[2].replace(/\r/g, '');
                temp[2] = temp[2].replace(/\c/g, ',');
                temp[2] = temp[2].replace(/’/g, '`');
                this.convertChar(temp[2]);
                tipsText.push(temp[2]);
                for (var j = 3; j <= temp.length; j++){
                    if (temp[j] && temp[j] != ""){
                        tempText += temp[j];
                        if (temp.length <= (temp.length+1)){
                            if (temp[j+1] != ""){
                                tempText += "\n";
                            }
                        }
                    }
                }
                tempText = tempText.replace(/\r/g, '');
                tempText = tempText.replace(/\c/g, ',');
                tempText = tempText.replace(/’/g, '`');
                this.convertChar(tempText);
                tipsHelpText.push(tempText);
            } else{
                tipsText.push("");
                tipsHelpText.push("");
            }
        }
        tipsText = JSON.stringify(tipsText);
        tipsHelpText = JSON.stringify(tipsHelpText);
        this.outputJson('text/en/' + "tipsText.json" ,tipsText);
        this.outputJson('text/en/' + "tipsHelpText.json" ,tipsHelpText);
    }

    static outputHelpTextData(csv){
        var helpText = [];
        let dataArray = this.csvToJson(csv);
        
        let listArray = [];
        for (var i = 0;i < 1000; i++){
            var temp = dataArray[i];
            if (temp){
                listArray = [];
                let listIndex = 0;
                var tempList = [];
                var tempText = "";
                for (var j = 2; j <= temp.length; j++){
                    if (temp[j] && temp[j] != ""){
                        temp[j] = temp[j].replace(/\r/g, '');
                        temp[j] = temp[j].replace(/\c/g, ',');
                        temp[j] = temp[j].replace(/’/g, '`');
                        this.convertChar(temp[j]);
                        tempText += temp[j] + "\n";
                    }
                    listIndex += 1;
                    if (listIndex == 3){
                        listIndex = 0;
                        tempList.push(tempText);
                        tempText = "";
                    }
                }
                if (tempText != ""){
                    tempList.push(tempText);
                }
                helpText.push(tempList);
            }
        }
        helpText = JSON.stringify(helpText);
        this.outputJson('text/en/' + "helpText.json" ,helpText);
    }

    static csvToJson (csvStr, userOptions) {
        if (typeof csvStr !== 'string') return null;
     
        var options = { header : 0, columnName : [], ignoreBlankLine : true };
     
        if (userOptions) {
            if (userOptions.header) options.header = userOptions.header;
            if (userOptions.columnName) options.columnName = userOptions.columnName;
        }
     
        var rows = csvStr.split('\n');
        var json = [], line = [], row = '', data = {};
        var i, len, j, len2;
     
        for (i = 0, len = rows.length; i < len; i++) {
            if ((i + 1) <= options.header) continue;
            if (options.ignoreBlankLine && rows[i] === '') continue;
     
            line = rows[i].split(',');
     
            if (options.columnName.length > 0) {
                data = {};
                for (j = 0, len2 = options.columnName.length; j < len2; j++) {
                    if (typeof line[j] !== 'undefined') {
                        row = line[j];
                        row = row.replace(/^"(.+)?"$/, '$1');
                    } else {
                        row = null;
                    }
     
                    data[options.columnName[j]] = row;
                }
                json.push(data);
            } else {
                json.push(line);
            }
        }
     
        return json;
    };

    static localFileDirectoryTextPath () {
        const lang = $dataOption.getUserData('language');
        let langdir = '';
        if (lang == LanguageType.Japanese){
            langdir = 'jp';
        }
        if (lang == LanguageType.English){
            langdir = 'en';
        }
        const path = require('path');
        const base = path.dirname(process.mainModule.filename);
        return path.join(base, 'text/' + langdir + '/');
    };    

    static json2csv(json) {
        var body = Object.keys(json).map(function(key) {
            return key + "," + json[key];
        }).join(',\n');
        this.outputcsv('csv/jp/text/' + 'systemtext.csv' ,body);
    }

    static data2csv(json,keyname) {
        var idx = -1;
        var body = json.map(function(d){
            var data = "";
            if (d) {
                data = String(d.split("\n") + ",");
            }
            idx += 1;
            return idx + "," + data;
        }).join("\n");
        this.outputcsv("csv/jp/text/" + keyname + '.csv' ,body);
    }

    static textBody(){
        if (this._textBody == null){
            this._textBody = "";
        }
        return this._textBody;
    }

    static event2csv(json){
        var list = _.filter(json.list,(l) => l.code == 401 || l.code == 402 || l.code == 403 || l.code == 101 || l.code == 102);
        var body = "";
        var tempText = "";
        list.forEach(d => {
            var data = d.code + ",";
            if (d.code == 101){
                data = "アクター設定" + ",";
                var actorid = d.parameters[0].replace("Actor","");
                if (actorid && actorid > 0){
                    data += TextManager.actorName( Number(actorid) ) + " ";
                    if (d.parameters[1] == 0) {data += "通常" }
                    if (d.parameters[1] == 1) {data += "笑顔" }
                    if (d.parameters[1] == 2) {data += "苦痛・ダメージ" }
                    if (d.parameters[1] == 3) {data += "攻撃時" }
                    if (d.parameters[1] == 4) {data += "勝利・喜び" }
                    if (d.parameters[1] == 5) {data += "不信・怒り" }
                    if (d.parameters[1] == 6) {data += "驚き・動揺" }
                    if (d.parameters[1] == 7) {data += "悲しみ・焦り" }
                    if (d.parameters[1] == 8) {data += "特殊１" }
                    if (d.parameters[1] == 9) {data += "特殊２" }
                }
            } else 
            if (d.code == 102){
                data = "選択肢の準備" + ",";
                d.parameters.forEach((param,index) => {
                    if (index <= 0){
                        data += String(param + ",");
                        tempText += String(param);
                    }
                });
            } else 
            if (d.code == 401){
                data = "本文" + ",";
                d.parameters.forEach(param => {
                    data += String(param + ",");
                    tempText += String(param);
                });
            } else 
            if (d.code == 402){
                data = "選択肢の遷移先" + ",";
                d.parameters.forEach(param => {
                    data += String(param + ",");
                    tempText += String(param);
                });
            } else {
                d.parameters.forEach(param => {
                    data += String(param + ",");
                    tempText += String(param);
                });

            }
            body += data + "\n";
        });
        let textBody = this.textBody();
        tempText = tempText.replace(/ /g,'');
        tempText = tempText.replace(/　/g,'');
        tempText = tempText.replace(/\n/g,'');
        tempText = tempText.replace(/,/g,'');
        this._textBody += tempText;
        this.outputcsv('csv/jp/event/' + json.name + '.csv' ,body);
    }

    static csv2event(type){
        var fs = require('fs');
        let path = require('path');
        const base = path.dirname(process.mainModule.filename);
        path = path.join(base, "csv/en/event");
        var iconvlite = require('iconv-lite');
        let allDirents = fs.readdirSync(path, { withFileTypes: true });
        allDirents.forEach((file,index) => {
            let p = fs.readFileSync(path + "\\" + file.name);
            p = iconvlite.decode(Buffer.from(p), type);
            this.convertEventData(p, file.name.replace(".csv",".json"));
            if (index == allDirents.length-1){
                PopupCautionManager.setPopup('コンバート終了しました！');
                PopupCautionManager.open(() => {
                });
            }
        });
    }

    static convertEventData(csv,filename){
        var fs = require('fs');
        const path = require('path');
        let base = path.dirname(process.mainModule.filename);
        base = path.join(base, 'event/jp/');
        let dataArray = this.csvToJson(csv);

        let baseData = fs.readFileSync(base + "\\" + filename);
        baseData = JSON.parse(baseData);
        
        let listCodes = [];
        baseData.list.forEach((l,index) => {
            var listData = l;
            if ( listData.code == 401 ){
                var basetext = listData.parameters[0];
                var localizeData = _.find(dataArray,(data) => data[1] == basetext);
                if (localizeData){
                    localizeData[2] = localizeData[2].replace(/\c/g, ',');
                    localizeData[2] = localizeData[2].replace(/’/g, '`');
                    localizeData[2] = localizeData[2].replace(/\r/g, '');
                    listData.parameters[0] = localizeData[2];
                    if (localizeData[2].length > 40){
                        //console.log(filename);
                        //console.log(localizeData[2]);
                    }
                    this.testChar(listData.parameters[0]);
                } else{
                    dataArray.forEach(data => {
                        data[1] = data[1].replace(/ /g, '');
                        data[1] = data[1].replace(/\./g, '');
                        data[1] = data[1].replace(/\|/g, '');
                        data[1] = data[1].replace(/\^/g, '');
                        data[1] = data[1].replace(/\\/g, '');
                    });
                    let tempBaseText = basetext;
                    tempBaseText = tempBaseText.replace(/ /g, '');
                    tempBaseText = tempBaseText.replace(/\./g, '');
                    tempBaseText = tempBaseText.replace(/\|/g, '');
                    tempBaseText = tempBaseText.replace(/\^/g, '');
                    tempBaseText = tempBaseText.replace(/\\/g, '');
                    var localizeData = _.find(dataArray,(data) => data[1] == tempBaseText);
                
                    if (localizeData){
                        localizeData[2] = localizeData[2].replace(/\c/g, ',');
                        localizeData[2] = localizeData[2].replace(/\r/g, '');
                        listData.parameters[0] = localizeData[2];
                        if (localizeData[2].length > 40){
                            //console.log(filename);
                            //console.log(localizeData[2]);
                        }
                        this.testChar(listData.parameters[0]);
                    } else{
                        console.error(tempBaseText)
                        console.error(filename)
                    }
                }
                listCodes.push(listData);
                if (localizeData && localizeData[3] && localizeData[3].length > 1){
                    localizeData[3] = localizeData[3].replace(/\c/g, ',');
                    localizeData[3] = localizeData[3].replace(/’/g, '`');
                    localizeData[3] = localizeData[3].replace(/\r/g, '');
                    var extraCode = {code:401,indent:listData.indent,parameters:[localizeData[3]]};
                    listCodes.push(extraCode);
                    if (localizeData[3].length > 40){
                        console.log(filename);
                        console.log(localizeData[3]);
                    }
                    this.testChar(listData.parameters[0]);
                }
            } else
            if (listData.code == 102){
                var basetexts = listData.parameters[0];
                var localizeData = _.find(dataArray,(data) => data[1] == basetexts[0]);
                
                if (localizeData){
                    listData.parameters[0] = [];
                    for (var i = 0 ; i < localizeData.length ; i++){
                        localizeData[i] = localizeData[i].replace(/\c/g, ',');
                        localizeData[i] = localizeData[i].replace(/\r/g, '');
                        if (i > (localizeData.length/2)){
                            listData.parameters[0].push(localizeData[i]);
                        }
                    }
                } else{
                    console.error(filename)
                    console.error(listData)
                }
                listCodes.push(listData);
            } else
            if (listData.code == 402){
                var basetext = listData.parameters[1];
                var localizeData = _.find(dataArray,(data) => data[2] == basetext && data[0].includes("遷移先"));
                
                if (localizeData) {
                    localizeData[3] = localizeData[3].replace(/\c/g, ',');
                    localizeData[3] = localizeData[3].replace(/\r/g, '');
                    listData.parameters[1] = localizeData[3];
                } else{
                    console.error(filename)
                    console.error(listData)
                }
                listCodes.push(listData);
            } else{
                listCodes.push(listData);
            }
        });

        baseData.list = listCodes;
        var data = JSON.stringify(baseData);
        let localizebase = path.dirname(process.mainModule.filename);

        var dirPath = path.join(localizebase, 'event/en/');
        var filePath = filename;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(dirPath + filePath, data);

    }

    static actortext2csv(textList,name){
        var body = "";
        textList.forEach(text => {
            body += text + "\n";
        });
        this.outputcsv('csv/jp/event/' + name + '.csv' ,body);
    }

    static tips2csv(json) {
        var body = json.map(function(d){
            return Object.keys(d).map(function(key) {
                if (key == "key" || key == "helpText" || key == "text" || key == "id"){
                    var data = d[key];
                    if (key == "helpText"){
                        data = String(data[0].split("\n") + ",");
                    }
                    return data;
                }
            }).join(',');
        }).join("\n");
        this.outputcsv('csv/jp/text/' + 'tipstext.csv' ,body);
    }

    static quiz2csv() {
        var quiz = new Game_Quiz();
        var body = quiz._data.map(function(d){
            return Object.keys(d).map(function(key) {
                var data = d[key];
                return data;
            }).join(',');
        }).join("\n");
        this.outputcsv('csv/jp/text/' + 'quiztext.csv' ,body);
    }

    static help2csv() {
        var help = new Game_Help();
        var body = help._data.map(function(d){
            return Object.keys(d).map(function(key) {
                var data = d[key];
                if (key == "pages"){
                    data = String(data);
                    data = data.split("\n") + ",";
                }
                if (key == "pages" || key == "key")
                return data;
            }).join(',');
        }).join("\n");
        this.outputcsv('csv/jp/text/' + 'helptext.csv' ,body);
    }

    static tutorial2csv(json) {
        /*
        var body = json.map(function(d){
            return Object.keys(d).map(function(key) {
                var data = d[key];
                if (key == "text"){
                    data = String(data.split("\n") + ",");
                }
                return data;
            }).join(',');
        }).join("\n");
        this.outputcsv('csv/jp/text/' + 'tutorialtext.csv' ,body);
        */
    }


    static outputcsv(dirpath,data){
        return
        var fs = require('fs');
        let path = require('path');
        const base = path.dirname(process.mainModule.filename);
        path = path.join(base, dirpath);
        if (data != ""){
            if (!fs.existsSync(base)){
                fs.mkdirSync(base);
            }
            fs.writeFileSync(path, data);
        }
    }

    static outputJson(dirpath,data){
        var fs = require('fs');
        let path = require('path');
        const base = path.dirname(process.mainModule.filename);
        path = path.join(base, dirpath);
        if (data != ""){
            if (!fs.existsSync(base)){
                fs.mkdirSync(base);
            }
            fs.writeFileSync(path, data);
        }
    }

    static async convertTextData(){
        $dataText['actorsName'] = await $gameText.huckTextData("actorsName");
        $dataText['skillsName'] = await $gameText.huckTextData("skillsName");
        $dataText['skillsDescription'] = await $gameText.huckTextData("skillsDescription");
        $dataText['mapinfosName'] = await $gameText.huckTextData("mapinfosName");
        $dataText['statesName'] = await $gameText.huckTextData("statesName");
        $dataText['statesMessage1'] = await $gameText.huckTextData("statesMessage1");
        $dataText['systemElements'] = await $gameText.huckTextData("systemElements");
        $dataText['systemSkillTypes'] = await $gameText.huckTextData("systemSkillTypes");
        $dataText['troopsName'] = await $gameText.huckTextData("troopsName");
        $dataText['enemiesName'] = await $gameText.huckTextData("enemiesName");
        $dataText['materialTitle'] = await $gameText.huckTextData("materialTitle");
        $dataText['materialText'] = await $gameText.huckTextData("materialText");
        $dataText['tipsText'] = await $gameText.huckTextData("tipsText");
        $dataText['tipsHelpText'] = await $gameText.huckTextData("tipsHelpText");
        $dataText['quizQuestion'] = await $gameText.huckTextData("quizQuestion");
        $dataText['quizChoices'] = await $gameText.huckTextData("quizChoices");
        $dataText['helpText'] = await $gameText.huckTextData("helpText");
        var textdata = await $gameText.huckTextData("systemtext");
        if (textdata){
            $gameText._data = textdata;
        }
        /*
        await $gameText.huckSystemTextData();
        */
    }

    // 使用文字数を集計する
    static async allTextDataLength(){
        var _textLengthData = {};
        Object.keys($gameText._data).forEach(key => {
            if ($gameText._data[key] != null) {
                if (!_textLengthData["system"]){
                    _textLengthData["system"] = "";
                }
                _textLengthData["system"] += $gameText._data[key];
            }
        })
        Object.keys($dataText).forEach(key => {
            if (key == "itemsNote") return; 
            if (key == "itemsName") return;
            if (key == "classesName") return;
            if (key == "itemsDescription") return;
            if (key == "skillsMessage1") return;
            if (key == "skillsMessage2") return;
            if (key == "statesMessage2") return;
            if (key == "statesMessage3") return;
            if (key == "statesMessage4") return;
            if (key == "systemGameTitle") return;
            if ($dataText[key] != null){
                if ($dataText[key] instanceof Array){
                    $dataText[key].forEach(data => {
                        if (data != null) {
                            if (!_textLengthData[key]){
                                _textLengthData[key] = "";
                            }
                            _textLengthData[key] += data;
                        }
                    });
                } else{
                    if ($dataText[key] != null ){
                        if (!_textLengthData[key]){
                            _textLengthData[key] = "";
                        }
                        _textLengthData[key] += $dataText[key];
                    }
                }
            }
        });
        Object.keys(_textLengthData).forEach(key => {
            let temp = _textLengthData[key];
            temp = temp.replace(/ /g,'');
            temp = temp.replace(/　/g,'');
            temp = temp.replace(/\n/g,'');
            temp = temp.replace(/,/g,'');
            _textLengthData[key] = temp;
        })
        var count = 0;
        Object.keys(_textLengthData).forEach(key => {
            count += _textLengthData[key].length;
            //console.log(_textLengthData[key])
            console.log(key + " は " + _textLengthData[key].length)
        })
        console.log(count)
    }
    
    static async allEventTextDataLength(){

    }

    static testChar(str){
        var testStr = str.split("");
        testStr.forEach(testChar => {
            if (testChar == "？"){
                console.error(str)
            }
            if (testChar == "’"){
                console.error(str)
            }
            if (testChar == "！"){
                console.error(str)
            }
        });
    }

    static convertChar(textData){
        textData = textData.replace(/’/g, '`');
        textData = textData.replace(/！/g, '!');
        textData = textData.replace(/？/g, '?');
    }

    static checkEnglishConverted(){
        var fs = require('fs');
        let path = require('path');
        const base = path.dirname(process.mainModule.filename);
        path = path.join(base, "text/en");
        
        const isUpperCase = c => {
            return /^[A-Z]+$/g.test(c)
        }

        var func = function ja2Bit ( str ) {
            return ( str.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/) )? true : false
        }
        let allDirents = fs.readdirSync(path, { withFileTypes: true });
        allDirents.forEach(file => {
            let p = fs.readFileSync(path + "\\" + file.name);
            if (file.name != "systemtext.json" && file.name != "quizChoices.json"){
                p = JSON.parse(p)
                p.forEach(text => {
                    if (text){
                        if (isUpperCase(text)){
                            console.log(text)
                        }
                        if (func(text)){
                            console.log(text)
                        }
                    }
                    
                });
            }
        });
        path = require('path');
        path = path.join(base, "event/en");
        allDirents = fs.readdirSync(path, { withFileTypes: true });
        allDirents.forEach(file => {
            let p = fs.readFileSync(path + "\\" + file.name);
            p = JSON.parse(p);
            p.list.forEach(listData => {
                if (listData && listData.code == 401){

                    if (isUpperCase(listData.parameters[0])){
                        console.log(file.name)
                        console.log(listData.parameters[0])
                    }
                    if (func(listData.parameters[0])){
                        console.log(file.name)
                        console.log(listData.parameters[0])
                    }
                }
                if (listData && listData.code == 102){
                    listData.parameters[0].forEach(text => {
                        if (isUpperCase(text)){
                            console.log(file.name)
                            console.log(text)
                        }
                        if (func(text)){
                            console.log(file.name)
                            console.log(text)
                        }
                    });

                }
                if (listData && listData.code == 402){
                    if (isUpperCase(listData.parameters[1])){
                        console.log(file.name)
                        console.log(listData.parameters[1])
                    }
                    if (func(listData.parameters[1])){
                        console.log(file.name)
                        console.log(listData.parameters[1])
                    }

                }
            });
        })
    }
}