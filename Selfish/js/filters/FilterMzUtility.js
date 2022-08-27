//-----------------------------------------------------------------------------
// FilterMzUtility
//

class FilterMzUtility {
	static initFilters(){
        for (let filter in this._filters){
            delete this._filters[filter];
        }
        this._filters = {};
        this._scene.filters = [];
        BackGroundManager._backGroundView._layer.filters = [];
	}

    static sceneSetting(){
        this._scene = SceneManager._scene;
        if (this._scene.filters == null){
            this._scene.filters = [];
            BackGroundManager._backGroundView._layer.filters = [];
        }
        if (this._filters == null){
            this._filters = {};
        }
    }

    static resetFilter(){
        let _lastFilter = [];
        for (let filter in this._filters){
            _lastFilter.push(filter);
            this.removeFilter(Number (filter));
        }
        _lastFilter.forEach(addfilter => {
            this.addFilter(Number( addfilter ));
        });
    }

    static addFilter(type,option){
        this.sceneSetting();
        if ($dataOption.getUserData("displayEffect") == false){
            this.resetFilter();
            return;
        }
        switch (type){
            case FilterType.None:
                this.initFilters();
                break;
            case FilterType.Godlay:
                this.godrayFilter();
                break;
            case FilterType.OldFilm:
                this.oldFilmFilter(false);
                break;
            case FilterType.Sepia:
                this.sepiaFilter();
                break;
            case FilterType.Desaturate:
                this.desaturateFilter();
                break;
            case FilterType.Blur:
                this.blurFilter();
                break;
            case FilterType.BlurFade:
                this.blurFadeFilter();
                break;
            case FilterType.Glitch:
                this.glitchFilter();
                break;
            case FilterType.NormalBlur:
                this.normalBlurFilter(option);
                break;
            case FilterType.RGBSplit:
                this.rgbSplitFilter(option);
                break;
            case FilterType.Pixelate:
                this.pixelateFilter(option);
                break;
            case FilterType.PixelateFade:
                this.pixelateFadeFilter(option);
                break;
            case FilterType.OldFilmBack:
                this.oldFilmFilter(true);
                break;
            case FilterType.DesaturateBack:
                this.desaturateBackFilter();
                break;
            case FilterType.OldFilmFade:
                this.oldFilmFadeFilter(true);
                break;
            case FilterType.MenuBack:
                this.menuBackFilter();
                break;
            case FilterType.EndingBlur:
                this.endingBlurFilter();
                break;
            case FilterType.EndingBlurEnd:
                this.endingBlurEndFilter();
                break;
            case FilterType.EndingBlurStop:
                this.endingBlurStopFilter();
                break;
        }
        $gameScreen.setFilters(this._filters);
    }

    static godrayFilter(){
        let godrayFilter = new PIXI.filters.GodrayFilter();
        godrayFilter.center.x = 0;
        godrayFilter.center.y = 0;
        godrayFilter.angle = 30;
        godrayFilter.gain = 0.5;
        godrayFilter.lacunarity = 2.5;
        godrayFilter.parallel = true;
        const layer = BackGroundManager._backGroundView._layer;
        this.addFilterLayer(FilterType.Godlay,godrayFilter,layer);
    }

    static oldFilmFilter(isBack){
        let oldFilmFilter = new PIXI.filters.OldFilmFilter();
        oldFilmFilter.sepia = 0.05;
        oldFilmFilter.noise = 0.5;
        oldFilmFilter.scratchDensity = 0;
        oldFilmFilter.noiseSize = 1;
        oldFilmFilter.seed = 1;
        oldFilmFilter.vignettingBlur = 0.5;
        let layer;
        if (isBack){
            layer = BackGroundManager._backGroundView._layer;
            this.addFilterLayer(FilterType.OldFilmBack,oldFilmFilter,layer);
        } else{
            layer = SceneManager._scene;
            this.addFilterLayer(FilterType.OldFilm,oldFilmFilter,layer);
        }
    }

    static oldFilmFadeFilter(){
        let oldFilmFilter = new PIXI.filters.OldFilmFilter();
        oldFilmFilter.sepia = 0.05;
        oldFilmFilter.noise = 0.5;
        oldFilmFilter.scratchDensity = 0;
        oldFilmFilter.noiseSize = 1;
        oldFilmFilter.seed = 1;
        oldFilmFilter.vignettingBlur = 0.5;
        let layer = SceneManager._scene;
        this.addFilterLayer(FilterType.OldFilmFade,oldFilmFilter,layer);
    }

    static menuBackFilter(){
        let menuBackFilter = new Sprite_MenuBack();
        let layer = SceneManager._scene;
        layer.addChild(menuBackFilter);
        //this.addFilterLayer(FilterType.MenuBack,menuBackFilter,layer);
    }

    static sepiaFilter(){
        let sepiaMatrix = new PIXI.filters.ColorMatrixFilter();
        sepiaMatrix.sepia(true);
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.Sepia,sepiaMatrix,layer);
    }

    static desaturateFilter(){
        let desaturateMatrix = new PIXI.filters.ColorMatrixFilter();
        desaturateMatrix.desaturate(true);
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.Desaturate,desaturateMatrix,layer);
    }

    static desaturateBackFilter(){
        let desaturateMatrix = new PIXI.filters.ColorMatrixFilter();
        desaturateMatrix.desaturate(true);
        const layer = BackGroundManager._backGroundView._layer;
        this.addFilterLayer(FilterType.DesaturateBack,desaturateMatrix,layer);
    }

    static blurFilter(){
        let blurFilter = new PIXI.filters.ZoomBlurFilter();
        blurFilter.strength = 0.01;
        const x = Math.randomInt(800) + 120;
        const y = Math.randomInt(400) + 120;
        blurFilter.center = [x,y];
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.Blur,blurFilter,layer);
    }

    static blurFadeFilter(){
        let blurFadeFilter = new PIXI.filters.ZoomBlurFilter();
        blurFadeFilter.strength = 0.4;
        const x = Graphics.width * 0.5;
        const y = Graphics.height * 0.5;
        blurFadeFilter.center = [x,y];
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.BlurFade,blurFadeFilter,layer);
    }

    static glitchFilter(){
        if ($gameDefine.platForm() == PlatForm.iOS){
            return;
        }
        let glitchFilter = new PIXI.filters.GlitchFilter();
        glitchFilter.fillMode = PIXI.filters.GlitchFilter.MIRROR;
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.Glitch,glitchFilter,layer);
    }

    static normalBlurFilter(option){
        let normalBlurFilter = new PIXI.filters.BlurFilter();
        normalBlurFilter.blur = option.start != null ? Number( option.start ) : 0;
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.NormalBlur,normalBlurFilter,layer);
        if (option.plus != null){
            this._filters[FilterType.NormalBlur].plus = option.plus;
        }
    }

    static rgbSplitFilter(option){
        let rgbSplitFilter = new PIXI.filters.RGBSplitFilter();
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.RGBSplit,rgbSplitFilter,layer);
        if (option != null){
            this._filters[FilterType.RGBSplit].option = option;
        }
    }

    static pixelateFilter(){
        let filter = new PIXI.filters.PixelateFilter();
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.Pixelate,filter,layer);

    }

    static pixelateFadeFilter(option){
        if (this._filters && this._filters[FilterType.PixelateFade]) return;
        let filter = new PIXI.filters.PixelateFilter();
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.PixelateFade,filter,layer);
        if (option != null){
            filter.size[0] = option.x;
            filter.size[1] = option.y;
        }
    }

    static endingBlurFilter(){
        let blurFadeFilter = new PIXI.filters.ZoomBlurFilter();
        blurFadeFilter.strength = 0.0;
        const x = Graphics.width * 0.5;
        const y = Graphics.height * 0.5;
        blurFadeFilter.center = [x,y];
        const layer = SceneManager._scene;
        this.addFilterLayer(FilterType.EndingBlur,blurFadeFilter,layer);
    }

    static endingBlurEndFilter(){
        if (this._filters && this._filters[FilterType.EndingBlur]){
            const blurFilter = this._filters[FilterType.EndingBlur].filter;
            let blurFadeFilter = new PIXI.filters.ZoomBlurFilter();
            blurFadeFilter.strength = blurFilter.strength;
            const x = Graphics.width * 0.5;
            const y = Graphics.height * 0.5;
            blurFadeFilter.center = [x,y];
            const layer = SceneManager._scene;
            this.addFilterLayer(FilterType.EndingBlurEnd,blurFadeFilter,layer);
            this.removeFilter(Number( FilterType.EndingBlur ));
            this._endingBlurStop = false;
        }
    }

    static endingBlurStopFilter(){
        this._endingBlurStop = true;
    }

    static addFilterLayer(type,filter,layer){
        this._filters[type] = {filter:filter,layer:layer};
        layer.filters.push(filter);
    }

    static update(){
        this.updateScene();
        this.updateGodray();
        this.updateOldFilm();
        this.updateBlur();
        this.updateBlurFade();
        this.updateGlitch();
        this.updateNormalBlur();
        this.updateOldFilmBack();
        this.updateOldFilmFade();
        this.updatePixelateFade();
        this.updateEndingBlur();
        this.updateEndingBlurEnd();
    }

    static updateScene(){
        if (this._scene != SceneManager._scene){
            this._scene = SceneManager._scene;
            if (this._throuthTerminal == true){
                return;
            }
            this.resetFilter();
        }
    }

    static changeThrouthTerminal(isThrouth){
        this._throuthTerminal = isThrouth;
    }


    static updateGodray(){
        if (this._filters && this._filters[FilterType.Godlay]){
            const godrayFilter = this._filters[FilterType.Godlay].filter;
            godrayFilter.time = Graphics.frameCount * 0.01;
        }
    }

    static updateOldFilm(){
        if (this._filters && this._filters[FilterType.OldFilm]){
            const oldFilmFilter = this._filters[FilterType.OldFilm].filter;
            let base = Graphics.frameCount % 60;
            oldFilmFilter.seed = (base+1) * 0.01;
        }
    }

    static updateBlur(){
        if (this._filters && this._filters[FilterType.Blur]){
            const blurFilter = this._filters[FilterType.Blur].filter;
            blurFilter.strength += 0.01;
        }
    }

    static updateBlurFade(){
        if (this._filters && this._filters[FilterType.BlurFade]){
            const blurFilter = this._filters[FilterType.BlurFade].filter;
            blurFilter.strength -= 0.02;
            if (blurFilter.strength < 0){
                blurFilter.strength = 0;
            }
        }
    }

    static updateNormalBlur(){
        if (this._filters && this._filters[FilterType.NormalBlur]){
            const normalBlurFilter = this._filters[FilterType.NormalBlur].filter;
            const plus = this._filters[FilterType.NormalBlur].plus != null ? this._filters[FilterType.NormalBlur].plus : 0;
            normalBlurFilter.blur += plus;
        }
    }

    static updateGlitch(){
        if (this._filters && this._filters[FilterType.Glitch]){
            if ($gameDefine.platForm() == PlatForm.iOS){
                return;
            }
            const glitchFilter = this._filters[FilterType.Glitch].filter;
            if (Graphics.frameCount % 15 == 0){
                glitchFilter.slices = 4 + Math.randomInt(6);
            }
        }
    }

    static updateOldFilmBack(){
        if (this._filters && this._filters[FilterType.OldFilmBack]){
            const oldFilmFilter = this._filters[FilterType.OldFilmBack].filter;
            let base = Graphics.frameCount % 60;
            oldFilmFilter.seed = (base+1) * 0.01;
        }
    }

    static updateOldFilmFade(){
        if (this._filters && this._filters[FilterType.OldFilmFade]){
            const oldFilmFilter = this._filters[FilterType.OldFilmFade].filter;
            //oldFilmFilter.scratchDensity -= 0.01;
            //oldFilmFilter.noise -= 0.01;
            let base = Graphics.frameCount % 60;
            oldFilmFilter.seed = (base+1) * 0.01;
        }
    }

    static updatePixelateFade(){
        if (this._filters && this._filters[FilterType.PixelateFade]){
            let filter = this._filters[FilterType.PixelateFade].filter;
            let sizeX = filter.size[0];
            let sizeY = filter.size[1];
            sizeX -= 0.4;
            sizeY -= 0.4;
            filter.size[0] = sizeX;
            filter.size[1] = sizeY;
            if (sizeX < 0){
                filter.size[0] = 0;
            }
            if (sizeY < 0){
                filter.size[1] = 0;
                this.removeFilter(FilterType.PixelateFade);
            }
        }
    }

    static updateEndingBlur(){
        if (this._filters && this._filters[FilterType.EndingBlur]){
            const blurFilter = this._filters[FilterType.EndingBlur].filter;
            if (this._endingBlurStop && this._endingBlurStop == true){
                return;
            }
            blurFilter.strength += 0.002;
        }
    }

    static updateEndingBlurEnd(){
        if (this._filters && this._filters[FilterType.EndingBlurEnd]){
            const blurFilter = this._filters[FilterType.EndingBlurEnd].filter;
            blurFilter.strength -= 0.1;
            if (blurFilter.strength < 0){
                blurFilter.strength = 0;
            }
        }
    }

    static removeFilter(type){
        if (!this._filters){
            return;
        }
        if (!this._filters.hasOwnProperty(type)){
            return;
        }
        const removefilter = this._filters[type].filter;
        if (removefilter){
            const layer = this._filters[type].layer;
            layer.filters = _.without(layer.filters,removefilter);
            delete this._filters[type];
            $gameScreen.setFilters(this._filters);
        }
    }
}

const FilterType = {
    None : 0,
    Godlay : 1,
    OldFilm : 2,
    Sepia : 3,
    Desaturate : 4,
    Blur : 5,
    BlurFade : 6,
    Glitch : 7,
    NormalBlur : 8,
    RGBSplit : 9,
    Pixelate : 10,
    PixelateFade : 11,
    OldFilmBack : 102,
    DesaturateBack : 104,
    OldFilmFade : 202,
    MenuBack : 301,
    EndingBlur : 400,
    EndingBlurEnd : 401,
    EndingBlurStop : 402
}