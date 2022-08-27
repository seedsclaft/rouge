//=============================================================================
// RPG Maker MZ - ScrollBar
//=============================================================================

/*:
 * @target MZ
 * @plugindesc スクロールできる選択ウィンドウにスクロールバーを表示します。
 * @author econa(ecoddr)
 * 
 * @param BarImage
 * @type file
 * @dir img/system
 * @default 
 * @desc スクロールバーの画像設定。
 * 
 * @param BarLeftPositon
 * @type number
 * @default 12
 * @desc リストが縦に並ぶときバーの位置をウィンドウの幅から「設定した数値分」左に移動します。
 * 
 * @param BarBottomPositon
 * @type number
 * @default 12
 * @desc リストが横に並ぶときバーの位置をウィンドウの高さから「設定した数値分」上に移動します。
 * 
 * @param MinHeight
 * @type number
 * @default 24
 * @desc これ以上高さを小さくしない閾値。
 * 
 * @help ScrollBar.js
 *
 * このプラグインは、スクロールできる選択ウィンドウにスクロールバーを表示します。
 *
 */

 (() => {
    const _Window_Selectable_refresh = Window_Selectable.prototype.refresh;   
    Window_Selectable.prototype.refresh = function() {
        _Window_Selectable_refresh.apply(this, arguments);
        if (ScrollBar.isScrollabel(this)){
            if (this._scrollBar == null){
                this._scrollBar = new ScrollBar(this);
            }
        }
    };

    const _Window_Scrollable_updateOrigin = Window_Scrollable.prototype.updateOrigin;  
    Window_Scrollable.prototype.updateOrigin = function() {
        _Window_Scrollable_updateOrigin.apply(this, arguments);
        if (this._scrollBar){
            this._scrollBar._onScroll();
        }
    };
})();

class ScrollBar extends Sprite {
    constructor(window){
        super();
        this.isInit = false;
        this._window = window;
        
        this._setup();
    }
    _setup(){
        if (this.isInit){
            return;
        }
        this.isInit = true;

        const window = this._window;
        this._directionType = window.isHorizontal() ? scrollBarDirectionType.HORIZONTAL : scrollBarDirectionType.VERTICAL;
        this._setBarPosition();
        this._setBarImage();
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this._window.addChild(this);
    }

    _setBarPosition(){
        const scrollBarDirectionType = this._directionType;
        if (scrollBarDirectionType == scrollBarDirectionType.HORIZONTAL){
            this.position.y = this._window.height - ScrollBar.pluginOption("BarBottomPositon");
        } else{
            this.position.x = this._window.width - ScrollBar.pluginOption("BarLeftPositon");   
        }
    }
    
    _setBarImage(){
        this.bitmap = ImageManager.loadSystem(ScrollBar.pluginOption("BarImage"));
    }

    _setBarHeight(){
        const window = this._window;
        const height = window.itemHeight() * window.maxPageRows() / (((window.maxItems()+1) - window.maxPageRows()));
        if (height > ScrollBar.pluginOption("MinHeight")){
            this.height = height;
        } else{
            this.height = ScrollBar.pluginOption("MinHeight");
        }
    }
    
    _onScroll(){
        if (ScrollBar.isScrollabel(this._window) == false){
            this.visible = false;
            return;
        }
        const window = this._window;
        if (!window.active){
            return;
        }
        this.visible = true;
        const padding = window._padding;
        let par;
        let ratio;
        if (this._directionType == scrollBarDirectionType.HORIZONTAL){
            par = window.innerWidth / window.maxScrollX();
            ratio = window._scrollX / window.maxScrollX();
            this.x = par * window._scrollX + padding;
            this.anchor.x = ratio;
        } else
        if (this._directionType == scrollBarDirectionType.VERTICAL){
            par = window.innerHeight / window.maxScrollY();
            ratio = window._scrollY / window.maxScrollY();
            this.y = par * window._scrollY + padding;
            this.anchor.y = ratio;
            this.skewOption(par);
        }
        this._setBarHeight();
    }
    _onScrollNoActive(){
        if (ScrollBar.isScrollabel(this._window) == false){
            this.visible = false;
            return;
        }
        this.visible = true;
        const window = this._window;
        const padding = window._padding;
        let par;
        let ratio;
        if (this._directionType == scrollBarDirectionType.HORIZONTAL){
            par = window.innerWidth / window.maxScrollX();
            ratio = window._scrollX / window.maxScrollX();
            this.x = par * window._scrollX + padding;
            this.anchor.x = ratio;
        } else
        if (this._directionType == scrollBarDirectionType.VERTICAL){
            par = window.innerHeight / window.maxScrollY();
            ratio = window._scrollY / window.maxScrollY();
            this.y = par * window._scrollY + padding;
            this.anchor.y = ratio;
            this.skewOption(par);
        }
        this._setBarHeight();
    }

    skewOption(par){
        const window = this._window;
        if (this._directionType == scrollBarDirectionType.VERTICAL && this.skew.x != 0){
            this.x = par * window._scrollY * this.skew.x + window.padding + this._window.width - 48;
        }
    }

    static pluginOption(key){
        let option = $gameSystem._pluginOption;
        if (option == null){
            option = PluginManager.parameters('ScrollBar');
            option["BarImage"] = String(option["BarImage"]);
            option["BarBottomPositon"] = Number(option["BarBottomPositon"]);
            option["BarLeftPosition"] = Number(option["BarLeftPosition"]);
            option["MinHeight"] = Number(option["MinHeight"]);
            $gameSystem._pluginOption = option;
        }
        return option[key];
    }

    static isScrollabel(window){
        if (window.isHorizontal()){
            return window.maxScrollX() !== 0;
        } else {
            return window.maxScrollY() !== 0;
        }
    }
}

const scrollBarDirectionType = {
    HORIZONTAL : 0,
    VERTICAL : 1
}

