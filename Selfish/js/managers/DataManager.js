$dataActors       = null;
$dataClasses      = null;
$dataSkills       = null;
$dataItems        = null;
$dataWeapons      = null;
$dataArmors       = null;
$dataEnemies      = null;
$dataTroops       = null;
$dataStates       = null;
$dataAnimations   = null;
$dataTilesets     = null;
$dataCommonEvents = null;
$dataSystem       = null;
$dataMapInfos     = null;
$dataMap          = null;
$dataEventReadInfos     = null;
$gameTemp         = null;
$gameSystem       = null;
$gameScreen       = null;
$gameTimer        = null;
$gameMessage      = null;
$gameSwitches     = null;
$gameVariables    = null;
$gameSelfSwitches = null;
$gameActors       = null;
$gameParty        = null;
$gameTroop        = null;
$gameMap          = null;
$gamePlayer       = null;
$testEvent        = null;
$gameDefine       = null;
$gameColor        = null;
$gameBGM          = null;
$gameElement      = null;
$gameSe           = null;
$gameStateInfo    = null;
$dataText         = null;
$dataStage        = null;
$gameKeyMap       = null;
$gameSkillExp     = null;
$gameHelp         = null;
$gameTips         = null;
$gameBackGround   = null;
$gameTutorial     = null;
$gameChallenge    = null;
$gameAchievement  = null;
$dataOption       = null;
$gameText         = null;
$gameCommand      = null;
$gameAlchemy      = null;
$gameSearch       = null;
$gameStage        = null;
$gamePause        = false;

DataManager._errors = [];

DataManager._databaseFiles = [
    { name: '$dataActors',       src: 'Actors.json'       },
    { name: '$dataClasses',      src: 'Classes.json'      },
    { name: '$dataItems',        src: 'Items.json'        },
    { name: '$dataSkills',       src: 'Skills.json'       },
    { name: '$dataWeapons',      src: 'Weapons.json'      },
    { name: '$dataArmors',       src: 'Armors.json'       },
    { name: '$dataEnemies',      src: 'Enemies.json'      },
    { name: '$dataTroops',       src: 'Troops.json'       },
    { name: '$dataStates',       src: 'States.json'       },
    { name: '$dataAnimations',   src: 'Animations.json'   },
    { name: '$dataTilesets',     src: 'Tilesets.json'     },
    { name: '$dataCommonEvents', src: 'CommonEvents.json' },
    { name: '$dataSystem',       src: 'System.json'       },
    { name: '$dataMapInfos',     src: 'MapInfos.json'     },
    { name: '$dataEventReadInfos',     src: 'EventReadInfos.json'     }
];

DataManager.loadDatabase = async function() {
    $dataText = {};
    const test = this.isBattleTest() || this.isEventTest();
    const prefix = test ? "Test_" : "";
    for (const databaseFile of this._databaseFiles) {
        if (databaseFile.name == "$dataBgms"){
            this.loadDataFile(databaseFile.name, databaseFile.src);
        } else
        if (databaseFile.name == "$dataEventReadInfos"){
            this.loadDataFile(databaseFile.name, databaseFile.src);
        } else{
            this.loadDataFile(databaseFile.name, prefix + databaseFile.src);
        }
    }
    if (this.isEventTest()) {
        this.loadDataFile("$testEvent", prefix + "Event.json");
    }
    this.loadOptionData();
};

DataManager.isDatabaseLoaded = function() {
    this.checkError();
    for (const databaseFile of this._databaseFiles) {
        if (!window[databaseFile.name]) {
            return false;
        }
    }
    if ($dataOption == null) {
        return false;
    }

    return true;
};

// 各データのnoteからデータ生成
DataManager.loadDatabasePlus = function(object) {
    if (object == $dataActors){
        this.createActorDataPlus();
    }
    if (object == $dataSkills){
        this.createSkillDataPlus();
    }
    if (object == $dataEnemies){
        this.createEnemyDataPlus();
    }
    if (object == $dataClasses){
        this.createClassDataPlus();
    }
};

DataManager.createActorDataPlus = function() {
    $dataActors.forEach(element => {
        if (element && element.note != ''){
            const json = JSON.parse(element.note);
            if (json){
                element.x = json.x ? Number(json.x) : 0;
                element.y = json.y ? Number(json.y) : 0;
                element.elementId = json.elementId ? (json.elementId).split(",").map(num => Number(num)) : [];
                element.paramUpRate = json.paramUpRate ? (json.paramUpRate).split(",").map(num => Number(num)) : [];
                element.alchemyParam = json.alchemyParam ? (json.alchemyParam).split(",").map(num => Number(num)) : [];
                element.scale = json.scale ? Number(json.scale) : 1.0;
            }
        }
    });
}

DataManager.createSkillDataPlus = function() {
    $dataSkills.forEach(element => {
        if (element && element.note != ''){
            const json = JSON.parse(element.note);
            if (json){
                element.maxLevel = json.maxLevel ? Number(json.maxLevel) : 0;
                element.stateTurns = json.stateTurns ? Number(json.stateTurns) : 0;
                element.stateEffect = json.stateEffect ? Number(json.stateEffect) : 0;
                element.stateEval = json.stateEval ? String(json.stateEval) : null;
                element.selfSkill = json.selfSkill ? Number(json.selfSkill) : 0;
                element.nextLevel = json.nextLevel ? (json.nextLevel).split(",").map(num => Number(num)) : [];
                element.nextExp = json.nextExp ? Number(json.nextExp) : 0;
                element.passiveType = json.passiveType ? json.passiveType : "";
                element.effect = json.effect ? Number(json.effect) : 0;
                element.animation = json.animation ? Number(json.animation) : 0;
                element.features = json.features ? json.features : [];
                element.repeatPlus = json.repeatPlus ? Number(json.repeatPlus) : 0;
                element.helpTextId = json.helpTextId ? Number(json.helpTextId) : 0;
                if (element.repeatPlus){
                    element.repeats += element.repeatPlus;
                }
                element.chargeTurn = json.chargeTurn ? Number(json.chargeTurn) : 0;
                element.range = json.range != null ? Number(json.range) : null;
            }
        }
    });
}


DataManager.createEnemyDataPlus = function() {
    $dataEnemies.forEach(element => {
        if (element && element.note != ''){
            const json = JSON.parse(element.note);
            if (json){
                element.scale = json.scale ? Number(json.scale) : 1;
                element.faceX = json.faceX ? Number(json.faceX) : 0;
                element.faceY = json.faceY ? Number(json.faceY) : 0;
                element.attackId = json.attackId ? Number(json.attackId) : 301;
                element.elementId = json.elementId ? Number(json.elementId) : 1;   
            }
        }
    });
}

DataManager.createClassDataPlus = function() {
    $dataClasses.forEach(classData => {
        if (classData){
            classData.learnings.forEach(learning => {
                const skillId = learning.skillId;
                let awake;
                if (learning.note != ""){
                    const data = JSON.parse(learning.note);
                    awake = {timing:Number(data.timing),type:Number(data.type),skillId:skillId,level:learning.level,skill:data.skill,value:data.value };
                } else{
                    awake = {type:0,skillId:skillId,level:learning.level};
                }
                learning.awake = awake;
            });
        }
    });
}


DataManager.loadOptionData = function() {
    if ($dataOption){
        return;
    }
    $dataOption = new Game_Option();
};

DataManager.getFacePositionData = function(faceName) {
    return _.find($dataActors,(d) => (d && d.faceName == faceName));
};

DataManager.getStageInfos = function(stageId) {
    return _.find($dataStage,(d) => (d && d.id == stageId));
}

DataManager.loadMapData = function(mapId,resolve) {
    if (mapId > 0) {
        const filename = "Map%1.json".format(mapId.padZero(3));
        this.loadDataFile("$dataMap", filename,resolve);
    } else {
        this.makeEmptyMap();
        if (resolve){
            return resolve();
        }
    }
};

DataManager.loadDataFile = function(name, src ,resolve) {
    const xhr = new XMLHttpRequest();
    const url = "data/" + src;
    window[name] = null;
    xhr.open("GET", url);
    xhr.overrideMimeType("application/json");
    xhr.onload = () => this.onXhrLoad(xhr, name, src, url,resolve);
    xhr.onerror = () => this.onXhrError(name, src, url);
    xhr.send();
};

DataManager.onXhrLoad = function(xhr, name, src, url,resolve) {
    if (xhr.status < 400) {
        window[name] = JSON.parse(xhr.responseText);
        this.onLoad(window[name]);
        if (resolve){
            return resolve(window[name]);
        }
    } else {
        this.onXhrError(name, src, url);
    }
};

DataManager.loadEventFile = function(src,resolve) {
    let xhr = new XMLHttpRequest();
    const lang = $dataOption.getUserData('language');
    let dirPath = "";
    if (lang == LanguageType.Japanese){
        dirPath = 'jp';
    }
    if (lang == LanguageType.English){
        dirPath = 'en';
    }
    const url = 'event/' + dirPath + '/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            return resolve(JSON.parse(xhr.responseText))
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};

DataManager.loadParticleFile = function(src,resolve) {
    let xhr = new XMLHttpRequest();
    const url = 'img/particles/' + src + '.json';
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            resolve(JSON.parse(xhr.responseText))
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    xhr.send();
};

DataManager.loadStageSequenceData = function(resolve) {
    let xhr = new XMLHttpRequest();
    const url = 'data/Map001.json';
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            resolve(JSON.parse(xhr.responseText));
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    xhr.send();
};

DataManager.loadTextData = function(src,resolve) {
    let xhr = new XMLHttpRequest();
    const url = 'text/' + src + '.json';
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            resolve(JSON.parse(xhr.responseText))
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    xhr.send();
};

DataManager.onLoad = function(object) {
    if (this.isMapObject(object)) {
        this.extractMetadata(object);
        this.extractArrayMetadata(object.events);
    } else {
        this.extractArrayMetadata(object);
    }
    // 文字を管理するデータを作る
    this.createTextData(object);
    // noteデータから拡張データを生成
    this.loadDatabasePlus(object);
};

DataManager.createTextData = function(data) {
    switch (data){
        case $dataActors: //name,nickname,profile
            $dataText['actorsName'] = data.map(d => d != null ? d.name : null);
            $dataText['actorsNickName'] = data.map(d => d != null ? d.nickname : null);
            $dataText['actorsProfile'] = data.map(d => d != null ? d.profile : null);
            break;
        case $dataClasses: //name
            $dataText['classesName'] = data.map(d => d != null ? d.name : null);
            break;
        case $dataSkills: //name,description,message1,message2
            $dataText['skillsName'] = data.map(d => d != null ? d.name : null);
            $dataText['skillsDescription'] = data.map(d => d != null ? d.description : null);
            $dataText['skillsMessage1'] = data.map(d => d != null ? d.message1 : null);
            $dataText['skillsMessage2'] = data.map(d => d != null ? d.message2 : null);
            break;
        case $dataItems: //name,description
            $dataText['itemsName'] = data.map(d => d != null ? d.name : null);
            $dataText['itemsDescription'] = data.map(d => d != null ? d.description : null);
            $dataText['itemsNote'] = data.map(d => d != null ? d.note : null);
            break;
        case $dataWeapons: //name,description
            $dataText['weaponsName'] = data.map(d => d != null ? d.name : null);
            $dataText['weaponsDescription'] = data.map(d => d != null ? d.description : null);
            break;
        case $dataArmors: //name,description
            $dataText['armorsName'] = data.map(d => d != null ? d.name : null);
            $dataText['armorsDescription'] = data.map(d => d != null ? d.description : null);
            break;
        case $dataEnemies: //name
            $dataText['enemiesName'] = data.map(d => d != null ? d.name : null);
            break;
        case $dataTroops: //name
            $dataText['troopsName'] = data.map(d => d != null ? d.name : null);
            break;
        case $dataStates: //name,message1,message2,message3,message4
            $dataText['statesName'] = data.map(d => d != null ? d.name : null);
            $dataText['statesMessage1'] = data.map(d => d != null ? d.message1 : null);
            $dataText['statesMessage2'] = data.map(d => d != null ? d.message2 : null);
            $dataText['statesMessage3'] = data.map(d => d != null ? d.message3 : null);
            $dataText['statesMessage4'] = data.map(d => d != null ? d.message4 : null);
            break;
        case $dataSystem: //elements,gameTitle,skillTypes,terms,armorTypes,equipTypes,weaponTypes
            $dataText['systemElements'] = data.elements.map(d => d != null ? d : null);
            $dataText['systemGameTitle'] = data.gameTitle;
            $dataText['systemSkillTypes'] = data.skillTypes.map(d => d != null ? d : null);
            $dataText['systemTerms'] = data.terms;
            $dataText['systemArmorTypes'] = data.armorTypes.map(d => d != null ? d : null);
            $dataText['systemEquipTypes'] = data.equipTypes.map(d => d != null ? d : null);
            $dataText['systemWeaponTypes'] = data.weaponTypes.map(d => d != null ? d : null);
            break;
        case $dataMapInfos: //name
            $dataText['mapinfosName'] = data.map(d => d != null ? d.name : null);
            break;
    }
}

DataManager.createGameObjects = function() {
    $gameTemp          = new Game_Temp();
    $gameSystem        = new Game_System();
    $gameScreen        = new Game_Screen();
    $gameTimer         = new Game_Timer();
    $gameMessage       = new Game_Message();
    $gameSwitches      = new Game_Switches();
    $gameVariables     = new Game_Variables();
    $gameSelfSwitches  = new Game_SelfSwitches();
    $gameActors        = new Game_Actors();
    $gameParty         = new Game_Party();
    $gameTroop         = new Game_Troop();
    $gameMap           = new Game_Map();
    $gamePlayer        = new Game_Player();
    $gameDefine        = new Game_Define();
    $gameColor         = new Game_Color();
    $gameElement       = new Game_Element();
    $gameBGM           = new Game_BGM();
    $gameSE            = new Game_SE();
    $gameStateInfo     = new Game_StateInfo();
    $gameKeyMap        = new Game_KeyMap();
    $gameAlchemy       = new Game_Alchemy();
    $gameSearch        = new Game_Search();
    $gameHelp          = new Game_Help();
    $gameTips          = new Game_Tips();
    $gameBackGround    = new Game_BackGround();
    $gameTutorial      = new Game_Tutorial();
    $gameChallenge     = new Game_Challenge();
    $gameAchievement   = new Game_Achievement();
    $gameText          = new Game_Text();
    $gameCommand       = new Game_Command();
    $gameTacticsActorPosition   = new Game_TacticsActorPosition();
    $gameStage = new Game_Stage();
};

DataManager.setupBattleTest = function() {
    this.createGameObjects();
    $gameParty.setupBattleTest();
    $gameVariables.setValue(1,+$dataTroops[$dataSystem.testTroopId].name);
    //BattleManager.setup($dataSystem.testTroopId, true, false);
    //BattleManager.setBattleTest(true);
    //BattleManager.playBattleBgm();
    // 覚醒コストを1に
    $gameDefine.limitBreakValue = 1;
};

DataManager.setupEventTest = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer(-1, 8, 6);
    $gamePlayer.setTransparent(false);
};

DataManager.maxSavefiles = function() {
    if ($gameDefine){
        const platForm = $gameDefine.platForm();
        if (platForm == PlatForm.Android || platForm == PlatForm.iOS){
            return 49;
        }
    }
    return 99;
};


DataManager.makeSaveContents = function() {
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    const contents = {};
    contents.system       = $gameSystem;
    contents.screen       = $gameScreen;
    contents.timer        = $gameTimer;
    contents.switches     = $gameSwitches;
    contents.variables    = $gameVariables;
    contents.selfSwitches = $gameSelfSwitches;
    contents.actors       = $gameActors;
    contents.party        = $gameParty;
    contents.map          = $gameMap;
    contents.player       = $gamePlayer;
    //contents.troop        = $gameTroop;
    contents.saveImage    = CriateSpriteManager._saveImage;
    return contents;
};




DataManager.checkUpdate = async function() {
    // バージョンチェック
}
