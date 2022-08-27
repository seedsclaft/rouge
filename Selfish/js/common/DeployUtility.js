class DeployUtility {
    constructor() {
    }
    
    static outputAudio(platform,basePath,targetPath,resourcePath,isWindows){
        var self = this;
        const fs = require('fs');
        const filePathList = [
            "audio\\bgs",
            "audio\\se"
        ];

        filePathList.forEach(filePath => {
            let allDirents = fs.readdirSync(basePath + filePath, { withFileTypes: true });
            self.deleteFolderRecursive(targetPath + filePath);
            fs.mkdirSync(targetPath + filePath);
            allDirents.forEach(file => {
                let dirPath = targetPath + filePath + "\\" + file.name;
                let indent = isWindows ? "_" : "";
                let copyPath = isWindows ? resourcePath : basePath;
                this.copyFile(copyPath + filePath + "\\" + file.name + indent,dirPath + indent);
            });
        });

        const outPutBgmfilePath = "audio\\bgm";
        let bgmPath = "audio\\bgm";
        if (platform == PlatForm.Android || platform == PlatForm.iOS){
            bgmPath = "audio\\bgm_compressed";
        }

        const bgmDirents = fs.readdirSync(basePath + bgmPath, { withFileTypes: true });
        self.deleteFolderRecursive(targetPath + bgmPath);
        fs.mkdirSync(targetPath + bgmPath);
        bgmDirents.forEach(file => {
            let bgmDirPath = targetPath + outPutBgmfilePath + "\\" + file.name;
            let indent = isWindows ? "_" : "";
            let copyPath = isWindows ? resourcePath : basePath;
            this.copyFile(copyPath + bgmPath + "\\" + file.name + indent,bgmDirPath + indent);
        });

    }

    static outputData(basePath,targetPath,resourcePath,isWindows){
        const fs = require('fs');
        const filePath = "\\data";
        let allDirents = fs.readdirSync(basePath + filePath, { withFileTypes: true });
        allDirents.forEach(file => {
            let dirPath = targetPath + filePath + "\\" + file.name;
            if (file.name == "CommonEvents.json"){
                let commonEvents = fs.readFileSync(basePath + filePath + "\\" + file.name,'utf8');
                commonEvents = "[null]";
                Debug.log("common")
                fs.writeFileSync(dirPath,commonEvents);
                return;
            }
            if (file.name == "System.json" && isWindows){
                this.copyFile(resourcePath + filePath + "\\" + file.name,dirPath);
                return;
            }
            this.copyFile(basePath + filePath + "\\" + file.name,dirPath);
        });
    }

    static outputImage(basePath,targetPath,resourcePath,isWindows){
        const fs = require('fs');
        let filePathList = [
            "img\\animations",
            "img\\battlebacks1",
            "img\\characters",
            "img\\enemies",
            "img\\faces",
            "img\\helps",
            "img\\helps_eng",
            "img\\particles",
            "img\\pictures",
            "img\\system",
            "img\\sv_actors",
        ];
        var self = this;
        filePathList.forEach(filePath => {
            let allDirents = fs.readdirSync(basePath + filePath, { withFileTypes: true });
            self.deleteFolderRecursive(targetPath + filePath);
            fs.mkdirSync(targetPath + filePath);
            allDirents.forEach(file => {
                let dirPath = targetPath + filePath + "\\" + file.name;
                if (!file.name.includes(".png")){
                    this.copyFile(basePath + filePath +  "\\" + file.name,dirPath);
                    return;
                }

                let indent = isWindows ? "_" : "";
                let copyPath = isWindows ? resourcePath : basePath;
                this.copyFile(copyPath + filePath +  "\\" + file.name + indent,dirPath+ indent);
            });
        });
    }
    
    static outputEvent(basePath,targetPath){
        const fs = require('fs');
        const filePath = "\\event" + "\\jp";
        let allDirents = fs.readdirSync(basePath + filePath, { withFileTypes: true });
        this.deleteFolderRecursive(targetPath + filePath);
        fs.mkdirSync(targetPath + filePath);
        allDirents.forEach(file => {
            if (this.isTestVersion(file.name)){
                return;
            }
            let dirPath = targetPath + filePath + "\\" + file.name;
            this.copyFile(basePath + filePath + "\\" + file.name,dirPath);
        });
    }

    static outputEventEnglish(basePath,targetPath){
        const fs = require('fs');
        const filePath = "\\event" + "\\en";
        let allDirents = fs.readdirSync(basePath + filePath, { withFileTypes: true });
        this.deleteFolderRecursive(targetPath + filePath);
        fs.mkdirSync(targetPath + filePath);
        allDirents.forEach(file => {
            /*
            if ($gameDefine.gameVersionNumber() < 100) {
                return;
            }
            */
            if (this.isTestVersion(file.name)){
                return;
            }
            let dirPath = targetPath + filePath + "\\" + file.name;
            this.copyFile(basePath + filePath + "\\" + file.name,dirPath);
        });
    }

    static outputSource(platform,basePath,targetPath){
        const fs = require('fs');
        let filePathList = [];
        const jsDirents = fs.readdirSync(basePath + "\\js", { withFileTypes: true });
        jsDirents.forEach(js => {
            if (!js.isFile()){
                if (js.name == "lib" || js.name == "libs" || js.name == "common" || js.name == "plugins"){
                    filePathList.push("js\\" + js.name);
                }
            } else{
                let dirPath = targetPath + "js\\" + js.name;
                fs.copyFileSync(basePath + "js\\" + js.name,dirPath);
                if (js.name == "rmmv.d.ts" || js.name == "rmmv-pixi.d.ts"
                || js.name == "jsconfig.json"){
                    if (fs.existsSync(dirPath)) {
                        fs.unlinkSync(dirPath);
                    }
                }
            }
        }); 
        filePathList.forEach(filePath => {
            let allDirents = fs.readdirSync(basePath + filePath, { withFileTypes: true });
            this.deleteFolderRecursive(targetPath + filePath);
            fs.mkdirSync(targetPath + filePath);
            allDirents.forEach(file => {
                if (filePath == "js\\lib"){
                    if (platform == PlatForm.Android || platform == PlatForm.iOS || platform == PlatForm.DlSite){
                        return;
                    }
                }
                let dirPath = targetPath + filePath + "\\" + file.name;
                this.copyFile(basePath + filePath +  "\\" + file.name,dirPath,dirPath);
            });
        });
    }

    static outputCssData(basePath,targetPath){
        const fs = require('fs');
        const folderPath = 'css';
        let allDirents = fs.readdirSync(basePath + folderPath, { withFileTypes: true });
        allDirents.forEach(file => {
            let dirPath = targetPath + folderPath + "\\" + file.name;
            this.copyFile(basePath + folderPath +  "\\" + file.name,dirPath);
        });
    }

    static outputIconData(basePath,targetPath){
        const fs = require('fs');
        const folderPath = 'icon';
        let allDirents = fs.readdirSync(basePath + folderPath, { withFileTypes: true });
        allDirents.forEach(file => {
            let dirPath = targetPath + folderPath + "\\" + file.name;
            this.copyFile(basePath + folderPath +  "\\" + file.name,dirPath);
        });
    }

    static outputTextData(basePath,targetPath){
        const fs = require('fs');
        const lang = $dataOption.getUserData('language');
        let langdir = 'jp';
        let folderPath = 'text\\' + langdir;
        if (!fs.existsSync(targetPath + 'text')) {
            fs.mkdirSync(targetPath + 'text');
        }
        let allDirents = fs.readdirSync(basePath + folderPath, { withFileTypes: true });
        this.deleteFolderRecursive(targetPath + folderPath);
        if (!fs.existsSync(targetPath + folderPath)) {
            fs.mkdirSync(targetPath + folderPath);
        }
        allDirents.forEach(file => {
            let dirPath = targetPath + folderPath + "\\" + file.name;
            this.copyFile(basePath + folderPath +  "\\" + file.name,dirPath);
        });


        langdir = 'en';
        folderPath = 'text\\' + langdir;
        if (!fs.existsSync(targetPath + 'text')) {
            fs.mkdirSync(targetPath + 'text');
        }
        allDirents = fs.readdirSync(basePath + folderPath, { withFileTypes: true });
        this.deleteFolderRecursive(targetPath + folderPath);
        if (!fs.existsSync(targetPath + folderPath)) {
            fs.mkdirSync(targetPath + folderPath);
        }
        //if ($gameDefine.gameVersionNumber() >= 100){
            allDirents.forEach(file => {
                let dirPath = targetPath + folderPath + "\\" + file.name;
                this.copyFile(basePath + folderPath +  "\\" + file.name,dirPath);
            });
        //}
    }

    static unlinkSaveData(targetPath){
        const fs = require('fs');
        let allDirents = fs.readdirSync(targetPath, { withFileTypes: true });
        allDirents.forEach(file => {
            if (file.name.includes("save")){
                let path = targetPath + file.name;
                if (fs.existsSync(path)) {
                    this.deleteFolderRecursive(path);
                }     
            }
        });
    }

    static deleteFolderRecursive(path){
        const fs = require('fs');
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function(file, index){
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
                } else { // delete file
                fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    static renamePackageJson(platForm,targetPath){
        const fs = require('fs');
        if (platForm != PlatForm.Steam){
            return;
        }
        const packagePath = targetPath + "\\package.json";
        let p = fs.readFileSync(packagePath,{ encoding: 'utf8' });
        if (!p.includes("--in-process-gpu")){
            p = p.replace("--force-color-profile=srgb","--in-process-gpu --force-color-profile=srgb");
        }
        fs.writeFileSync(packagePath,p);
    }

    static renameMobileVersionCode(platForm,targetPath){
        if (platForm == PlatForm.Android || platForm == PlatForm.iOS){
            const fs = require('fs');
            const packagePath = targetPath.replace("\\www","") + "\\config.xml";
            let p = fs.readFileSync(packagePath,{ encoding: 'utf8' });
            if (p.includes('\" version=\"')){
                const beforeIndex = p.indexOf('\" version=\"');
                let before = p.slice(0,beforeIndex + 2);
                let after = p.slice(beforeIndex + 18,p.length);
                if (platForm == PlatForm.Android){
                    p = before + "version=\"" + $gameDefine.androidVersionCode + "\"" + after;
                } else
                if (platForm == PlatForm.iOS){
                    p = before + "version=\"" + $gameDefine.iosVersionCode + "\"" + after;
                }
            }
            console.log("config.xml = " + p);
            fs.writeFileSync(packagePath,p);
        }
    }

    static renameGameDefine(platForm,targetPath){
        let platformStr = "";
        if (platForm == PlatForm.Android){
            platformStr = "Android";
        }
        if (platForm == PlatForm.iOS){
            platformStr = "iOS";
        }
        if (platForm == PlatForm.Steam){
            platformStr = "Steam";
        }
        if (platForm == PlatForm.DlSite){
            platformStr = "DlSite";
        }
        const fs = require('fs');
        let allDirents = fs.readdirSync(targetPath + "js\\plugins", { withFileTypes: true });
        allDirents.forEach(file => {
            if (file.name == "Game_Define.js"){
                var define = fs.readFileSync(targetPath + "js\\plugins" +  "\\" + file.name,'utf8');
                define = define.replace("PlatForm.None","PlatForm." + platformStr);
                let dirPath = targetPath + "js\\plugins" + "\\" + file.name;
                fs.writeFileSync(dirPath,define);
            }
        });
    }

    static replaceGameAppId(platForm,targetPath){
        if (platForm != PlatForm.Steam){
            return;
        }
        const fs = require('fs');
        const appIdPath = targetPath + "\\steam_appid.txt";
        let p = fs.readFileSync(appIdPath,{ encoding: 'utf8' });
        if ($gameDefine.gameVersionNumber() < 100){
            if (p.includes("1566350")){
                p = p.replace("1566350","1575500");
            }
        } else{
            if (p.includes("1575500")){
                p = p.replace("1575500","1566350");
            }
        }
        fs.writeFileSync(appIdPath,p);
    }
    
    static copyFile(targetPath,dirPath){
        const fs = require('fs');
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath);
        }
        fs.copyFileSync(targetPath,dirPath);
    }
    static isTestVersion(fileName){
        if ($gameDefine.gameVersionNumber() < 100){
            if (fileName.includes('story')){
                let eventName = fileName.substring(6,9);
                return (Number( eventName ) > 5);
            }
        }
        return false;
    }
}