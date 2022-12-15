class Model_Title {
    constructor() {
    }

    outputDeproy(platform,basePath,targetPath,isWindows){
        const path = require('path');
        let bPath = path.dirname(process.mainModule.filename);
        let resourcePath = bPath.replace("project","static\\asset_bundle");
        DeployUtility.outputAudio(platform,basePath,targetPath,resourcePath,isWindows);
        DeployUtility.outputData(basePath,targetPath,resourcePath,isWindows);
        DeployUtility.outputImage(basePath,targetPath,resourcePath,isWindows);
        DeployUtility.outputEvent(basePath,targetPath);
        DeployUtility.outputEventEnglish(basePath,targetPath);
        DeployUtility.outputSource(platform,basePath,targetPath);
        DeployUtility.outputCssData(basePath,targetPath);
        DeployUtility.outputIconData(basePath,targetPath);
        DeployUtility.outputTextData(basePath,targetPath);
        DeployUtility.unlinkSaveData(targetPath);
        DeployUtility.renamePackageJson(platform,targetPath);
        DeployUtility.renameMobileVersionCode(platform,targetPath);
        DeployUtility.renameGameDefine(platform,targetPath);
        DeployUtility.replaceGameAppId(platform,targetPath);
    }

    outputAndroid(){
        const path = require('path');
        let basePath = path.dirname(process.mainModule.filename);
        let targetPath = basePath.replace("project","static\\android\\www");
        this.outputDeproy(PlatForm.Android,basePath,targetPath,false);
    }

    outputiOS(){
        const path = require('path');
        let basePath = path.dirname(process.mainModule.filename);
        let targetPath = basePath.replace("project","static\\iOS\\www");
        this.outputDeproy(PlatForm.iOS,basePath,targetPath,false);
    }

    outputSteamWin(){
        const path = require('path');
        let basePath = path.dirname(process.mainModule.filename);
        let targetPath = basePath.replace("project","static\\steam\\project");
        this.outputDeproy(PlatForm.Steam,basePath,targetPath,true);
    }

    outputSteamMac(){
        const path = require('path');
        let basePath = path.dirname(process.mainModule.filename);
        let targetPath = basePath.replace("project","static\\mac\\project\\Game.app\\Contents\\Resources\\app.nw");
        this.outputDeproy(PlatForm.Steam,basePath,targetPath,false);
    }

    outputDlSiteWin(){
        const path = require('path');
        let basePath = path.dirname(process.mainModule.filename);
        let targetPath = basePath.replace("project","static\\dlsite\\project");
        this.outputDeproy(PlatForm.DlSite,basePath,targetPath,true);
    }

    outputDlSiteMac(){
        const path = require('path');
        let basePath = path.dirname(process.mainModule.filename);
        let targetPath = basePath.replace("project","static\\dlsite_mac\\project\\Game.app\\Contents\\Resources\\app.nw");
        this.outputDeproy(PlatForm.DlSite,basePath,targetPath,false);
    }

    loadResourceData(){
        let needBgm = $gameBGM.getBgm('title');
        if ( !AudioManager.loadedBgmResource([needBgm]) ){
            AudioManager.loadBgm(needBgm);
        }
        return {bgm:[needBgm]};
    }

    outputTextdata() {
        LocalizeUtility.outputTextdata();
    }

    csvToTextdata(type) {
        //LocalizeUtility.csvToTextdata(type);
    }

    csvToEventdata(type) {
        //LocalizeUtility.csv2event(type);
    }

    scriptMinify() {
        CommonUtility.scriptMinify();
    }

    outputActorsText(){
        EventManager.outputActorsText();
    }


    outputDeployAssetOnly(){
    }

    outputDeployAll(){
        this.outputSteamWin();
        this.outputSteamMac();
        this.outputDlSiteWin();
        this.outputDlSiteMac();
        this.outputAndroid();
        this.outputiOS();
    }
}