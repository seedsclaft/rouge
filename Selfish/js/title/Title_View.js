//-----------------------------------------------------------------------------
// Title_View
//
class Title_View extends Scene_Base{
    constructor(){
        super();
        this._resourceData = null;
        this._presenter = new Title_Presenter(this);
        this._lastLanguage = null;
    }

    create(){
        super.create();
        BackGroundManager.resetup();
        //BackGroundManager.moveUV(1,-40,-200,false);
        BackGroundManager.clearWeather();
        EventManager.resetup();
        EventManager.clearWeather();
        this.createHelpWindow();
        this.createWindowLayer();
        this.createCommandWindow();
        this.createDebugWindow();
        this.createVersionSprite();
        this.createTitleSprite();
        this.createMenuButton();
        this.createMenuSprite();
        this._menuPlate.visible = false;
        this.createBackButton();
        this.createKeyMapWindow();
        Presenter_Fade.fadein(0);
    }

    async start(){
        super.start();
        this._commandWindow.deactivate();
        SceneManager.clearStack();
        Presenter_Loading.open();
        if (SceneManager._previousClass.name && SceneManager._previousClass.name != "Load_Scene"){
            await this.loading(this.waitResourceLoad.bind(this));
        }
        Presenter_Loading.close();
        Presenter_Fade.fadeout(0);
        
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
        this._commandWindow.activate();
        this.setCommand(TitleCommand.Start);
    }

    setBackGround(title){
        BackGroundManager.changeBackGround(title[0],title[1]);
        BackGroundManager.resetPosition();
        BackGroundManager.setWeather("menu");
        //gsap.to(BackGroundManager._backGroundView._backSprite2, 4, {pixi:{opacity:128},repeat:-1,yoyo:true,ease: Expo.easeIn, });
        gsap.to(BackGroundManager._backGroundView._backSprite2, 16, {pixi:{opacity:128,scaleY:1.01},repeat:-1,yoyo:true,ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 1, points: 20, taper: "none", randomize: true, clamp: false}), });
    }
    
    waitResourceLoad(){
        return AudioManager.loadedBgmResource(this._resourceData.bgm) && this.isReady();
    }
    
    setResourceData(resourceData){
        this._resourceData = resourceData;
    }

    isBusy(){
        return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
    }

    createCommandWindow(){
        this._commandWindow = new Title_CommandList(640, 280, 400, 200);
        this._commandWindow.setHandler('newGame',  this.setCommand.bind(this,TitleCommand.NewGame));
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow.setHandler('option', this.commandOptions.bind(this));
        if ($gameTemp.isPlaytest()){
            this._commandWindow.setHandler('shift', this.commandDebug.bind(this));
        }
        this._commandWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._commandWindow);
    }

    createDebugWindow(){
        this._debugWindow = new Window_DebugCommand();
        this._debugWindow.setHandler('outputeventfile',  this.outputeventfile.bind(this));
        this._debugWindow.setHandler('outputAndroid',  this.outputAndroid.bind(this));
        this._debugWindow.setHandler('outputtextdata',  this.outputtextdata.bind(this));
        this._debugWindow.setHandler('outputactorstext',  this.outputActorsText.bind(this));
        this._debugWindow.setHandler('csvtotextdata',  this.csvtotextdata.bind(this));
        this._debugWindow.setHandler('csvtoeventdata',  this.csvtoeventdata.bind(this));
        this._debugWindow.setHandler('scriptminify',  this.scriptminify.bind(this));
        this._debugWindow.setHandler('versioncheck',  this.versioncheck.bind(this));
        this._debugWindow.setHandler('resourcedownload',  this.resourcedownload.bind(this));
        this._debugWindow.setHandler('twitterApply',  this.twitterApply.bind(this));
        this._debugWindow.setHandler('deploysteamwin',  this.deploysteamwin.bind(this));
        this._debugWindow.setHandler('deploysteammac',  this.deploysteammac.bind(this));
        this._debugWindow.setHandler('deploydlsitewin',  this.deploydlsitewin.bind(this));
        this._debugWindow.setHandler('deploydlsitemac',  this.deploydlsitemac.bind(this));
        this._debugWindow.setHandler('deployandroid',  this.deployandroid.bind(this));
        this._debugWindow.setHandler('deployios',  this.deployios.bind(this));
        this._debugWindow.setHandler('outputDeployAssetOnly',  this.outputDeployAssetOnly.bind(this));
        this._debugWindow.setHandler('outputDeployAll',  this.outputDeployAll.bind(this));
        this.addWindow(this._debugWindow);
    }

    createVersionSprite(){
        this._versionSprite = new Sprite();
        this._versionSprite.x = 12;
        this._versionSprite.y = 0;
        this._versionSprite.scale.x = 0.66;
        this._versionSprite.scale.y = 0.66;
        let bitmap = new Bitmap(320,128);
        bitmap.drawText(TextManager.getText(100300) + $gameDefine.gameVersion,0,0,320,64,"left")
        this._versionSprite.bitmap = bitmap;
        this.addChild(this._versionSprite);
    }

    createTitleSprite(){
    }

    createHelpWindow(){
        this._helpWindow = new Window_Help();
        this.addChild(this._helpWindow);
    }
    
    createKeyMapWindow(){
        this._keyMapWindow = new Window_KeyMap();
        this._keyMapWindow.refresh("title");
        if (!$gameDefine.mobileMode){
            this.addChild(this._keyMapWindow);
        }
    }

    createBackButton(){
        this._backButton = new Sprite_IconButton();
        this._backButton.hide();
        this.addChild(this._backButton);
    }

    async commandNewGame(){
        this._commandWindow.hide();
        this._versionSprite.hide();
        gsap.killTweensOf(BackGroundManager._backGroundView._backSprite2);

        await this.setWait(2000);
        this.setCommand(TitleCommand.NameInput);
    }

    commandContinue(){
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    }

    commandNameInput(){
        const mainText = TextManager.getText(14050);
        PopupInputManager.setInputPopup(mainText,null,0,null,14);
        PopupInputManager.setHandler(TextManager.getText(840),'ok',() => {
            this.setCommand(TitleCommand.NameInputEnd);
            $gameSystem.setUserName(PopupInputManager.getInputText());
        });
        PopupInputManager.open();
    }

    onLoadSuccess(){
        SoundManager.playLoad();
        SceneManager.goto(Map_Scene);
    }

    onLoadFailure(){
        SoundManager.playBuzzer();
    }

    commandOptions(){        
        let index = _.findIndex(this.children,(child) => child instanceof Window_Help);
        
        this._lastLanguage = $dataOption.getUserData('language');

        Scene_Option.setPopup(() => {
            this._commandWindow.activate();
            this._keyMapWindow.hide();
            this.setMenuSprite("");
            const lastLanguage = $dataOption.getUserData('language');
            if (lastLanguage != this._lastLanguage){
                SceneManager.goto(Title_View);
            }
        },5);
        if (this._keyMapWindow){
            Scene_Option.setKeyHelpWindow(this._keyMapWindow);
            this._keyMapWindow.show();
            this._keyMapWindow.refresh("menuOption");
        }
        if (this._backButton){
            Scene_Option.setBackButton(this._backButton);
            this._backButton.show();
        }
        if (this._menuPlate){
            Scene_Option.setMenuButton(this._menuPlate);
            this._menuPlate.show();
        }
        this.setMenuSprite(TextManager.getText(2050));
        Scene_Option.setHelpWindow(this._helpWindow);
        
    }

    commandDebug(){
        this.setCommand(TitleCommand.Debug);
    }

    sendDebugMode(){
        this._commandWindow.deactivate();
        this._debugWindow.show();
        this._debugWindow.activate();
    }

    commandUpdate(){

    }

    playTitleMusic(){
        AudioManager.playBgm($gameBGM.getBgm('title'));
        AudioManager.stopBgs();
        AudioManager.stopMe();
    }

    async checkUpdatePopup(){
    }

    outputeventfile(){
        this.setCommand(TitleCommand.OutputEventFile);
    }

    outputAndroid(){
        this.setCommand(TitleCommand.OutputAndroid);
    }

    outputtextdata(){
        this.setCommand(TitleCommand.OutputTextData);
    }

    outputActorsText(){
        this.setCommand(TitleCommand.OutputActorsText);
    }


    csvtotextdata(){
        this.setCommand(TitleCommand.CsvToTextData);
    }

    csvtoeventdata(){
        this.setCommand(TitleCommand.CsvToEventData);
    }

    scriptminify(){
        this.setCommand(TitleCommand.ScriptMinify);
    }

    versioncheck(){
        this.setCommand(TitleCommand.VersionCheck);
    }

    resourcedownload(){
        this.setCommand(TitleCommand.ResourceDownload);
    }

    twitterApply(){
        this.setCommand(TitleCommand.TwitterApply);
    }

    deploysteamwin(){
        this.setCommand(TitleCommand.DeploySteamWin);
    }

    deploysteammac(){
        this.setCommand(TitleCommand.DeploySteamMac);
    }

    deploydlsitewin(){
        this.setCommand(TitleCommand.DeployDlSiteWin);
    }

    deploydlsitemac(){
        this.setCommand(TitleCommand.DeployDlSiteMac);
    }

    deployandroid(){
        this.setCommand(TitleCommand.DeployAndroid);
    }

    deployios(){
        this.setCommand(TitleCommand.DeployiOS);
    }

    outputDeployAssetOnly(){
        this.setCommand(TitleCommand.OutputDeployAssetOnly);
    }

    outputDeployAll(){
        this.setCommand(TitleCommand.OutputDeployAll);
    }

    terminate(){
        super.terminate();
        BackGroundManager.clearWeather();
        EventManager.remove();
        BackGroundManager.remove();
        this.destroy();
    }

    update(){
        if (!this.isBusy()) {
            this._commandWindow.open();
        }
        super.update();
        /*
        if (Input.isTriggered('debug') && $gameTemp.isPlaytest()){
            SceneManager.push(Load_Scene)
        }
        */
        if (Input.isTriggered('pagedown')){
            return;
            var xhr = new XMLHttpRequest();
            var url = 'https://www.dropbox.com/s/tipkaxhv6usaj1m/freebird.ogg?dl=1'
            xhr.open('GET', url);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function() {
                if (xhr.status < 400) {
                    var fs       = require('fs');
                    var dirPath  = "audio/bgm";
                    var filePath = dirPath + "/testFile.ogg";
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath);
                    }
                    fs.writeFileSync(filePath, new Buffer(xhr.response, 'base64'));
                    var bgm = {name:"testFile",volume:90,pitch:100,pan:0}
                    AudioManager.playBgm(bgm)
                }
            }.bind(this);
            xhr.onerror = this._loader || function(){this._hasError = true;}.bind(this);
            xhr.send();
    
        }
        if (this._reader != null && this._reader.result){
            var data = JSON.parse(this._reader.result)
            var textData = []
            var idx = 0;
            data.forEach(d => {
                var length = 0
                if (d){
                    d.list.forEach(prm => {
                        if (prm.code == "401"){
                            var t = {}
                            t["type"] = "common"
                            t["id"] = idx
                            t["length"] = length
                            t["parameters"] = prm.parameters[0]
                            textData.push(t)
                        }
                        length += 1
                    });
                    var jsonData = JSON.stringify(d.list)
                    if (idx < 10){
                        var name = "Event0" + "0"+  idx.toString()
                    } else
                    if (idx < 100){
                        var name = "Event0" + idx.toString()
                    }
                    var fs = require('fs');
                    fs.writeFileSync(StorageManager.localFileEventDirectoryPath() + name + ".json", jsonData);
                }  
                idx += 1
            });
            var tData = JSON.stringify(textData)
            var csvText = "type,id,length,paramater" + "\n"
            textData.forEach(element => {
                Object.keys(element).forEach(function(key) {
                    csvText += element[key]
                    csvText += ","
                });
                csvText += "\n"
            });
            var name = "Text_Common"
            var fs = require('fs');
            fs.writeFileSync(StorageManager.localFileEventDirectoryPath() + name + ".csv", csvText);
        
            Debug.log(textData)
            this._reader = null;
        }
        if (this._reader2 != null && this._reader2.result){
            //Debug.log(this._reader2.result)
            var array = this._reader2.result.split("\n")
            var data = []
            array.forEach(element => {
                data.push(element.split(","))
            });
            data.forEach(element => {
                if (element[0] === "common"){
                    var id = element[1]
                    var length = element[2]
                    Debug.log("id=" + element[1])
                    Debug.log("length=" + element[2])
                    Debug.log("param=" + element[3])
                    Debug.log($dataCommonEvents[+id].list[+length]["parameters"][0])
                    $dataCommonEvents[+id].list[+length]["parameters"][0] = element[3]
                }
            });
    
            
            this._reader2 = null;
            var jsonData = JSON.stringify($dataCommonEvents)
            Debug.log($dataCommonEvents)
            $('<a>', {
                href: window.URL.createObjectURL(new Blob([jsonData], {type : 'text/plain'})), // ※ window.URL
                download: "CommonEvents" + ".json"
            })[0].click(); 
        }
    }

    checkUpdate(){
        var xhr = new XMLHttpRequest();
        var url = 'http://ecoddr.blog.jp/System.json'
        //xhr.responseType = "arraybuffer";
        xhr.open('GET', url);
        xhr.setRequestHeader('Pragma', 'no-cache');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
    
        //xhr.overrideMimeType('application/json');
        var self = this
        xhr.onload = function() {
            if (xhr.status < 400) {
                var data = JSON.parse(xhr.responseText);
                Debug.log(data.currencyUnit)
                Debug.log($dataSystem.currencyUnit)
                if ($dataSystem.currencyUnit != data.currencyUnit){
                                
                    var text = 'ver' + data.currencyUnit + TextManager.getItemName(142);
                    var text1 = TextManager.getDecideText();
                    var text2 = TextManager.getCancelText();
                    var text3 = TextManager.getItemDescription(142);
                    text = self._updateWindow.convertEscapeCharacters(text);
                    self._updateWindow.setup(text,text1,text2,text3,() => {
                        window.open("http://ecoddr.blog.jp/archives/588533.html");
                        self._commandWindow.activate();
                    },() => {
                        self._commandWindow.activate();
    
                    });
    
    
                    //window.open()
                } else{
                    
                    if (self._cautionWindow == null){
                        var text = "最新の状態です";
                        self._cautionWindow = new Window_Caution(text,360,280,560,160);
                        self.addChild(self._cautionWindow);
                    }
                    self._cautionWindow.disp();
                    self._commandWindow.activate();
                }
            }
        };
        xhr.onerror = this._mapLoader || function() {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        xhr.send();
    }
}

const TitleCommand = {
    Start : 0,
    NewGame : 1,
    Continue : 2,
    Debug : 3,
    OutputEventFile : 11,
    OutputAndroid : 12,
    VersionCheck : 13,
    ResourceDownload : 14,
    TwitterApply : 15,
    ScriptMinify : 16,
    OutputTextData : 21,
    CsvToTextData : 22,
    CsvToEventData : 23,
    OutputActorsText : 31,
    DeploySteamWin : 101,
    DeploySteamMac : 102,
    DeployDlSiteWin : 103,
    DeployDlSiteMac : 104,
    DeployAndroid : 105,
    DeployiOS : 106,
    OutputDeployAssetOnly : 107,
    OutputDeployAll : 108,
    NameInput : 200,
    NameInputEnd : 201
}