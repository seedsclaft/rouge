//=============================================================================
// main.js v1.2.1
//=============================================================================

const scriptUrls = [
    "js/libs/pixi.js",
    "js/libs/pako.min.js",
    "js/libs/localforage.min.js",
    "js/libs/effekseer.min.js",
    "js/libs/vorbisdecoder.js",
	"js/libs/gsap.min.js",
	"js/libs/PixiPlugin.min.js",
	"js/libs/EasePack.min.js",
	"js/libs/underscore.js",
	"js/libs/pixi-particles.js",

    "js/rmmz_core.js",
	"js/rpg_core.js",
    "js/rmmz_managers.js",
    "js/rmmz_objects.js",
    "js/rmmz_scenes.js",
    "js/rmmz_sprites.js",
    "js/rmmz_windows.js",
	"js/common/Model_Base.js",
	"js/common/Presenter_Base.js",
	"js/common/Debug.js",
	"js/common/CommonUtility.js",
	"js/common/DeployUtility.js",
	"js/common/LocalizeUtility.js",
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
	"js/managers/PopupLevelUpManager.js",
	"js/managers/TipsManager.js",
    "js/managers/CriateSpriteManager.js",
    "js/managers/ResourceLoadManager.js",
    "js/managers/TutorialManager.js",
    "js/managers/WebViewManager.js",
	//"js/objects/Game_Temp.js",
	"js/objects/Game_System.js",
	"js/objects/Game_Map.js",
	"js/objects/Game_Screen.js",
	"js/objects/Game_Message.js",
	"js/objects/Game_Action.js",
	"js/objects/Game_ActionResult.js",
	"js/objects/Game_Battler.js",
	"js/objects/Game_Unit.js",
	"js/objects/Game_CharacterBase.js",
	"js/objects/Game_States.js",
	"js/objects/Game_Interpreter.js",
	//"js/objects/Game_RushTroop.js",
	"js/objects/Game_SkillHelp.js",
	"js/rpg_sprites.js",
	"js/rpg_windows.js",
	"js/sprites/Sprite_Button.js",
	"js/sprites/Sprite_IconButton.js",
	"js/sprites/Sprite_Animation.js",
	"js/sprites/Sprite_StateIcon.js",
	"js/sprites/Sprite_Title.js",
	"js/sprites/Sprite_TransFade.js",
	"js/sprites/Sprite_Particle.js",
	"js/sprites/Sprite_BackGround.js",
	"js/sprites/Sprite_StageTitle.js",
	"js/sprites/Sprite_MapName.js",
	"js/sprites/Sprite_NextStage.js",
	"js/sprites/Sprite_Element.js",
	"js/sprites/Sprite_TimeLine.js",
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
	"js/sprites/Sprite_TurnInfo.js",
	"js/animation/Model_Animation.js",
	"js/animation/Animation_Scene.js",
	"js/animation/Presenter_Animation.js",
	"js/animation/Window_AnimationSelect.js",
	"js/background/BackGroundManager.js",
	"js/background/View_BackGround.js",
	"js/event/Model_Event.js",
	"js/event/View_Event.js",
	"js/event/EventManager.js",
	"js/event/BgmLoader_Event.js",
	"js/event/PictureLoader_Event.js",
	"js/event/Sprite_EventMenu.js",
	"js/event/Window_BackLog.js",
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
	"js/windows/Window_StageInfo.js",
	"js/windows/Window_Credit.js",
	"js/windows/Window_PartyCommand.js",
	"js/top/Presenter_Top.js",
	"js/top/Model_Top.js",
	"js/top/Top_Scene.js",
	"js/title/Title_Scene.js",
	"js/title/Presenter_Title.js",
	"js/title/Model_Title.js",
	"js/title/Window_TitleCommandList.js",
	"js/title/Window_DebugCommand.js",
	"js/battle/Battle_View.js",
	"js/battle/Presenter_Battle.js",
	"js/battle/Model_Battle.js",
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
	"js/skill/Window_SkillCategory.js",
	"js/skill/Window_SkillSelect.js",
	"js/skill/Window_RoleSkillSelect.js",
	"js/menu/Menu_Scene.js",
	"js/menu/Presenter_Menu.js",
	"js/menu/Model_Menu.js",
	"js/menu/Window_FeatureList.js",
	"js/menu/Window_MenuListCommand.js",
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
    "js/plugins.js"
];
const effekseerWasmUrl = "js/libs/effekseer.wasm";

class Main {
    constructor() {
        this.xhrSucceeded = false;
        this.loadCount = 0;
        this.error = null;
    }

    run() {
        this.showLoadingSpinner();
        this.testXhr();
        this.loadMainScripts();
    }

    showLoadingSpinner() {
        const loadingSpinner = document.createElement("div");
        const loadingSpinnerImage = document.createElement("div");
        loadingSpinner.id = "loadingSpinner";
        loadingSpinnerImage.id = "loadingSpinnerImage";
        loadingSpinner.appendChild(loadingSpinnerImage);
        document.body.appendChild(loadingSpinner);
    }

    eraseLoadingSpinner() {
        const loadingSpinner = document.getElementById("loadingSpinner");
        if (loadingSpinner) {
            document.body.removeChild(loadingSpinner);
        }
    }

    testXhr() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", document.currentScript.src);
        xhr.onload = () => (this.xhrSucceeded = true);
        xhr.send();
    }

    loadMainScripts() {
        for (const url of scriptUrls) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.async = false;
            script.defer = true;
            script.onload = this.onScriptLoad.bind(this);
            script.onerror = this.onScriptError.bind(this);
            script._url = url;
            document.body.appendChild(script);
        }
        this.numScripts = scriptUrls.length;
        window.addEventListener("load", this.onWindowLoad.bind(this));
        window.addEventListener("error", this.onWindowError.bind(this));
    }

    onScriptLoad() {
        if (++this.loadCount === this.numScripts) {
            PluginManager.setup($plugins);
        }
    }

    onScriptError(e) {
        this.printError("Failed to load", e.target._url);
    }

    printError(name, message) {
        this.eraseLoadingSpinner();
        if (!document.getElementById("errorPrinter")) {
            const errorPrinter = document.createElement("div");
            errorPrinter.id = "errorPrinter";
            errorPrinter.innerHTML = this.makeErrorHtml(name, message);
            document.body.appendChild(errorPrinter);
        }
    }

    makeErrorHtml(name, message) {
        const nameDiv = document.createElement("div");
        const messageDiv = document.createElement("div");
        nameDiv.id = "errorName";
        messageDiv.id = "errorMessage";
        nameDiv.innerHTML = name;
        messageDiv.innerHTML = message;
        return nameDiv.outerHTML + messageDiv.outerHTML;
    }

    onWindowLoad() {
        if (!this.xhrSucceeded) {
            const message = "Your browser does not allow to read local files.";
            this.printError("Error", message);
        } else if (this.isPathRandomized()) {
            const message = "Please move the Game.app to a different folder.";
            this.printError("Error", message);
        } else if (this.error) {
            this.printError(this.error.name, this.error.message);
        } else {
            this.initEffekseerRuntime();
        }
    }

    onWindowError(event) {
        if (!this.error) {
            this.error = event.error;
        }
    }

    isPathRandomized() {
        // [Note] We cannot save the game properly when Gatekeeper Path
        //   Randomization is in effect.
        return (
            Utils.isNwjs() &&
            process.mainModule.filename.startsWith("/private/var")
        );
    }

    initEffekseerRuntime() {
        const onLoad = this.onEffekseerLoad.bind(this);
        const onError = this.onEffekseerError.bind(this);
        effekseer.initRuntime(effekseerWasmUrl, onLoad, onError);
    }

    onEffekseerLoad() {
        this.eraseLoadingSpinner();
        SceneManager.run(Scene_Boot);
    }

    onEffekseerError() {
        this.printError("Failed to load", effekseerWasmUrl);
    }
}

const main = new Main();
main.run();

//-----------------------------------------------------------------------------
