class CommonUtility {
    constructor() {
    }

    static scriptMinifyUrls = [
        "js/managers/DataManager.js",
        "js/managers/ConfigManager.js",
        "js/managers/SceneManager.js",
        "js/managers/ImageManager.js",
        "js/managers/AudioManager.js",
        "js/managers/SoundManager.js",
        "js/managers/TextManager.js",
        "js/managers/PopupManager.js",
        "js/managers/PopupCautionManager.js",
        "js/managers/PopupInputManager.js",
        "js/managers/TipsManager.js",
        "js/managers/CriateSpriteManager.js",
        "js/managers/ResourceLoadManager.js",
        "js/managers/TutorialManager.js",
        "js/managers/WebViewManager.js",
        "js/objects/Game_System.js",
        "js/objects/Game_Screen.js",
        "js/objects/Game_Action.js",
        "js/objects/Game_ActionResult.js",
        "js/objects/Game_Battler.js",
        "js/objects/Game_Unit.js",
        "js/objects/Game_States.js",
        "js/objects/Game_Interpreter.js",
        //"js/objects/Game_RushTroop.js",
        "js/objects/Game_SkillHelp.js",
        "js/sprites/Sprite_Button.js",
        "js/sprites/Sprite_IconButton.js",
        "js/sprites/Sprite_Animation.js",
        "js/sprites/Sprite_StateIcon.js",
        "js/sprites/Sprite_Title.js",
        "js/sprites/Sprite_TransFade.js",
        "js/sprites/Sprite_Particle.js",
        "js/sprites/Sprite_BackGround.js",
        "js/sprites/Sprite_Element.js",
        "js/sprites/Sprite_MenuBack.js",
        "js/sprites/Sprite_Ready.js",
        "js/sprites/Sprite_Levelup.js",
        "js/sprites/Sprite_MapDock.js",
        "js/sprites/Sprite_ChallengeDock.js",
        "js/sprites/Sprite_StageDock.js",
        "js/sprites/Sprite_BattleDock.js",
        "js/sprites/Sprite_MenuDock.js",
        "js/sprites/Sprite_KeyMapButton.js",
        "js/sprites/Sprite_LoadDock.js",
        "js/sprites/Sprite_ResultDock.js",
        "js/background/BackGroundManager.js",
        "js/background/View_BackGround.js",
        "js/event/Model_Event.js",
        "js/event/View_Event.js",
        "js/event/EventManager.js",
        "js/event/BgmLoader_Event.js",
        "js/event/PictureLoader_Event.js",
        "js/event/Sprite_EventMenu.js",
        "js/event/Window_BackLog.js",
        "js/event/Window_Message.js",
        "js/event/Sprite_EventPicture.js",
        "js/event/Sprite_EventFast.js",
        "js/event/Event_Scene.js",
        "js/help/Model_Help.js",
        "js/help/Help_Scene.js",
        "js/help/Presenter_Help.js",
        "js/help/Popup_Help.js",
        "js/help/Window_HelpList.js",
        "js/help/Window_HelpStatus.js",
        "js/fade/Presenter_Fade.js",
        "js/loading/Presenter_Loading.js",
        "js/loading/Window_Loading.js",
        "js/pause/Presenter_Pause.js",
        "js/pause/Window_Pause.js",
        "js/windows/Window_BattleStatus.js",
        "js/windows/Window_SkillHelp.js",
        "js/windows/Window_KeyMap.js",
        "js/windows/Window_BattleResult.js",
        "js/windows/Window_Confirm.js",
        "js/windows/Window_Caution.js",
        "js/windows/Window_Credit.js",
        "js/windows/Window_PartyCommand.js",
        "js/popup/status/PopupStatus_Manager.js",
        "js/popup/status/PopupStatus_Model.js",
        "js/popup/status/PopupStatus_View.js",
        "js/popup/status/PopupStatus_Presenter.js",
        "js/popup/status/PopupStatus_ActorList.js",
        "js/popup/status/PopupStatus_ActorListItem.js",
        "js/popup/status/PopupStatus_MagicList.js",
        "js/popup/status/PopupStatus_SpParam.js",
        "js/tactics/Tactics_Model.js",
        "js/tactics/Tactics_View.js",
        "js/tactics/Tactics_Presenter.js",
        "js/tactics/Tactics_CommandList.js",
        "js/tactics/Tactics_EnergyInfo.js",
        "js/tactics/Tactics_ActorSelect.js",
        "js/tactics/Tactics_ActorSpriteList.js",
        "js/tactics/Tactics_AlchemyMagicList.js",
        "js/tactics/Tactics_AlchemyParam.js",
        "js/tactics/Tactics_SearchList.js",
        "js/tactics/Tactics_MagicCategory.js",
        "js/strategy/Strategy_Model.js",
        "js/strategy/Strategy_View.js",
        "js/strategy/Strategy_Presenter.js",
        "js/top/Presenter_Top.js",
        "js/top/Model_Top.js",
        "js/top/Top_Scene.js",
        "js/title/Title_View.js",
        "js/title/Title_Presenter.js",
        "js/title/Title_Model.js",
        "js/title/Title_CommandList.js",
        "js/title/Window_DebugCommand.js",
        "js/battle/Layer_BattleParty.js",
        "js/battle/Layer_BattleTroop.js",
        "js/battle/Layer_BattlePicture.js",
        "js/battle/Window_BattleLog.js",
        "js/battle/Window_BattleRecord.js",
        "js/battle/Spriteset_BattleGrid.js",
        "js/battle/Sprite_Battler.js",
        "js/battle/Sprite_BattleTarget.js",
        "js/battle/Sprite_BattlerStatus.js",
        "js/battle/Sprite_Damage.js",
        "js/battle/Sprite_PopupText.js",
        "js/battle/Battle_MagicList.js",
        "js/battle/Battle_EnemyStatus.js",
        "js/menu/Menu_View.js",
        "js/menu/Menu_Presenter.js",
        "js/menu/Menu_Model.js",
        "js/menu/Window_FeatureList.js",
        "js/menu/Menu_StageList.js",
        "js/menu/Window_MenuActorStatus.js",
        "js/menu/Window_LibraryCommand.js",
        "js/menu/Sprite_MenuStatus.js",
        "js/file/File_Scene.js",
        "js/file/Presenter_File.js",
        "js/file/Model_File.js",
        "js/file/Window_FileList.js",
        "js/option/Scene_Option.js",
        "js/option/Presenter_Option.js",
        "js/option/Model_Option.js",
        "js/option/Window_OptionCaterogy.js",
        "js/option/Window_OptionList.js",
        "js/option/Window_OptionKeyAssign.js",
        "js/scenes/Scene_Base.js",
        "js/filters/DrawActorFilter.js",
        "js/filters/DrawMobFilter.js",
        "js/filters/MenuBackFilter.js",
        "js/filters/SmokeFilter.js",
        "js/filters/filter-drop-shadow.js",
        "js/filters/filter-adjustment.js",
        "js/filters/filter-old-film.js",
        "js/filters/filter-ascii.js",
        "js/filters/filter-glow.js",
        "js/filters/filter-godray.js",
        "js/filters/filter-zoom-blur.js",
        "js/filters/filter-kawase-blur.js",
        "js/filters/filter-shockwave.js",
        "js/filters/filter-simple-lightmap.js",
        "js/filters/filter-glitch.js",
        "js/filters/filter-rgb-split.js",
        "js/filters/filter-pixelate.js",
        "js/filters/FilterMzUtility.js",
    ];
    
    static scriptMinify(){
        const fs = require('fs');
        const path = require('path');
        let basePath = path.dirname(process.mainModule.filename);

        let filePathList = [];
        let minifySprict = "";
        /*
        const jsDirents = fs.readdirSync(basePath + "\\js", { withFileTypes: true });
        jsDirents.forEach(js => {
            if (!js.isFile() && js.name != "lib" && js.name != "libs" && js.name != "common" && js.name != "plugins"){
                filePathList.push("js\\" + js.name);
            }
        }); 
        */
        this.scriptMinifyUrls.forEach(filePath => {
            filePath = filePath.replace(/\//g, "\\");
            //let allDirents = fs.readdirSync(basePath + filePath, { withFileTypes: true });
            //allDirents.forEach(file => {
                let scriptFile = fs.readFileSync(basePath + filePath,{ encoding: 'utf8' });
                minifySprict += scriptFile;
                minifySprict += "\n";
            //});
        });
        fs.writeFileSync(basePath + "js" + "//" + "script.js",minifySprict);
    }
}