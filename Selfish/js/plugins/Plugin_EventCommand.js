//=============================================================================
// Plugin_EventCommand.js
//=============================================================================
/*:
 * @plugindesc イベントコマンドを管理する。
 * @author econa
 * 
 * @command setTroop
 * @desc 敵データ作成してバトルスタート
 * 
 * @arg searchId
 * @type number
 * @default 0
 * 
 * @arg plusEnemyLevel
 * @type number
 * @default 0
 * 
 * @arg plusBossLevel
 * @type number
 * @default 0
 * 
 * 
 * @command selectAddActor
 * @desc 仲間を選択する
 * 
 * @arg selectIndex
 * @type number
 * @default 0
 * 
 * 
 * 
 * @command moveActors
 * @desc 移動演出。
 * 2:後 4:左 6:右 8:前
 * 
 * @arg direction
 * @type number
 * @default 8
 * 
 * @command setFootSound
 * @desc 足音変更。
 * 0:床 1:フローリング 2:雪 3:草
 * 
 * @arg sound
 * @type number
 * @default 0
 * 
 * @command setMessageAssign
 * @desc メッセージアサイン。
 * 
 * @arg assign
 * @type boolean
 * 
 * @command addFilter
 * @desc フィルター設定
 * 
 * @arg type
 * @type number
 * @desc 0=なし 1=斜光 2=オールド 3=セピア
 * 
 * @arg option
 * @type string
 * 
 * @command removeFilter
 * @desc フィルター設定
 * 
 * @arg type
 * @type number
 * @desc 0=なし 1=斜光 2=オールド 3=セピア
 * 
 * @command setEaseMode
 * @desc easeのオンオフ設定
 * 
 * @arg type
 * @type boolean
 * @desc true / false
 * 
 * @command clearPictures
 * @desc ピクチャを全消去。
 * 
 * @command changeActorFace
 * @desc 表情変更
 * 0:通常 1:笑顔 2:ダメージ 3:攻撃 4:勝利 5:怒り 6:驚き 7:悲しみ 8:その他1 9:その他2
 * 
 * @arg faceType
 * @type number
 * @default 0
 * 
 * @command setNextEvent
 * @desc イベント連結
 * 
 * @arg eventName
 * @type string
 * 
 * @command setMessagePosition
 * @desc メッセージ位置変更
 * 
 * @arg x
 * @type number
 * @min -9999
 * 
 * @arg y
 * @type number
 * @min -9999
 * 
 * @command setBattlePicture
 * @desc 背景をピクチャとして表示
 * 
 * @arg label
 * @type string
 * 
 * @arg x
 * @type number
 * @min -9999
 * 
 * @arg y
 * @type number
 * @min -9999
 * 
 * @arg opacity
 * @type number
 * 
 * @command setEnemyPicture
 * @desc 敵をピクチャとして表示
 * 
 * @arg label
 * @type string
 * 
 * @arg x
 * @type number
 * @min -9999
 * 
 * @arg y
 * @type number
 * @min -9999
 * 
 * @arg opacity
 * @type number
 * 
 * @command clearPictures
 * @desc ピクチャを全消去。
 *
 * @command exit
 * @desc イベント終了宣言。
 *
 * @command showJingle
 * @desc ジングル再生
 * 
 * @command pauseResume
 * @desc 全アニメの動き制御
 * 
 * @arg resume
 * @type boolean
 * @desc true / false
 * 
 * @command eventFilterSet
 * @desc イベントフィルターセット
 * 
 * @command eventFilterStart
 * @desc イベントフィルター動作開始
 * 
 * @command fadeEventBgm
 * @desc イベントBGM音量調節
 * 
 * @command resetEventBgm
 * @desc イベントBGM音量調節を戻す
 * 
 * 
 */

(() => {
    const pluginName = "Plugin_EventCommand";
    const _eManager = EventManager;
    PluginManager.registerCommand(pluginName, "setTroop", args => {
        const _searchData = $gameSearch.getData(args.searchId);
        const _plusEnemyLevel = Number(args.plusEnemyLevel);
        const _plusBossLevel = Number(args.plusBossLevel);
        let troopData = $dataTroops[_searchData.enemyNum];
        for (let i = 0; i < _searchData.enemy.length; i++) {
            troopData.members[i].enemyId = _searchData.enemy[i];
        }
        let troop = new Game_Troop();
        troop.setup(_searchData.enemyNum,_searchData.lvMin + _plusEnemyLevel,_searchData.lvMax + _plusEnemyLevel);
        troop.setupBoss(6,_searchData.bossEnemy,_searchData.bossLv + _plusBossLevel);
        $gameTroop = troop;
        SceneManager.goto(Battle_View);
    });

    PluginManager.registerCommand(pluginName, "selectAddActor", args => {
        const mainText = TextManager.getText(14040);
        const text1 = TextManager.getDecideText();
        const _popup = PopupManager;
        _popup.setPopup(mainText,{select:0,subText:null});
        _popup.setHandler(text1,'ok',() => {
            let actorList = [];
            $gameActors._data.forEach(actorData => {
                if (actorData && actorData.selectedIndex() == 0){
                    actorList.push(actorData);
                } 
            });
            PopupStatus_View.setSelectData(actorList,
                (data) => {
                    PopupStatus_View.close();
                    data.setSelectedIndex(Number(args.selectIndex));
                    $gameParty.addActor(data.actorId());
                    EventManager.setLabel("End");
                }
            );
        });
        _popup.open();
    });

    PluginManager.registerCommand(pluginName, "clearPictures", () => {
        _eManager.clearPictures();
    });

    PluginManager.registerCommand(pluginName, "setFootSound", args => {
        _eManager.setFootSound(Number(args.sound));
    });

    PluginManager.registerCommand(pluginName, "changeActorFace", args => {
        _eManager.changeActorFace(Number(args.faceType));
    });

    PluginManager.registerCommand(pluginName, "addFilter", args => {
        let opt = null;
        if (args.option){
            opt = JSON.parse(args.option);
        }
        FilterMzUtility.addFilter(Number(args.type),opt);
    });

    PluginManager.registerCommand(pluginName, "removeFilter", args => {
        FilterMzUtility.removeFilter(Number(args.type));
    });

    PluginManager.registerCommand(pluginName, "setEaseMode", args => {
        _eManager.setEaseMode(Number(args.type));
    });
    
    PluginManager.registerCommand(pluginName, "setNextEvent", args => {
        _eManager.setNextEvent(String(args.eventName));
    });

    PluginManager.registerCommand(pluginName, "setMessagePosition", args => {
        _eManager.setMessagePosition(Number(args.x),Number(args.y));
    });

    PluginManager.registerCommand(pluginName, "setBattlePicture", args => {
        _eManager.setBattlePicture(String(args.label),Number(args.x),Number(args.y),Number(args.opacity));
    });

    PluginManager.registerCommand(pluginName, "setEnemyPicture", args => {
        _eManager.setEnemyPicture(String(args.label),Number(args.x),Number(args.y),Number(args.opacity));
    });

    PluginManager.registerCommand(pluginName, "setMessageAssign", args => {
        _eManager.setMessageAssign(args.assign);
    });

    PluginManager.registerCommand(pluginName, "exit", () => {
        _eManager.exit();
    });

    PluginManager.registerCommand(pluginName, "showJingle", () => {
        _eManager.showJingle();
    });

    PluginManager.registerCommand(pluginName, "pauseResume", args => {
        _eManager.pauseResume(args.resume == "true");
    });

    PluginManager.registerCommand(pluginName, "eventFilterSet", () => {
        _eManager.eventFilterSet();
    });
    
    PluginManager.registerCommand(pluginName, "eventFilterStart", () => {
        _eManager.eventFilterStart();
    });
    
    PluginManager.registerCommand(pluginName, "fadeEventBgm", () => {
        _eManager.fadeEventBgm();
    });

    PluginManager.registerCommand(pluginName, "resetEventBgm", () => {
        _eManager.resetEventBgm();
    });

})();
