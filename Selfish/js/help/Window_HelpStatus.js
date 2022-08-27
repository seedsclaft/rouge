//-----------------------------------------------------------------------------
// Window_HelpStatus
//

class Window_HelpStatus extends Window_Selectable {
    constructor(x, y, width, height){
        super(new Rectangle( x, y, width,height ));
        this._data = null;
        this._sprite = new Sprite();
        this._sprite.scale.x = this._sprite.scale.y = (1/(2/3));
        this.addChild(this._sprite);
        this._cursorSprite.opacity = 0;
        this.setHandler('index',this.refresh.bind(this));
        this.scale.x = this.scale.y = (2/3);
        this._baseX = x;
        this.padding = 0;
        this.opacity = 0;
        this._canRepeat = false;

        this._stockSprite = [];
    }

    itemHeight(){
        return this.innerHeight;
    }

    itemWidth(){
        return this.innerWidth;
    }

    maxItems(){
        return this._data ? this._data.length : 1;
    }

    maxRows(){
        return 1;
    }

    maxCols(){
        return this._data ? this._data.length : 1;
    }

    setData(data){
        this._helpData = data;
        this._data = this._helpData.imgs;
        this.refresh();
    }

    refresh(){
        super.refresh();
        this.refreshTexts();
    }

    refreshTexts(){
        this._stockSprite.forEach(sprite => {
            sprite.bitmap.clear();
        });
        const helpTextData = this.helpText();
        const createNum = helpTextData.length - (this._stockSprite.length);
        this.createSprite(createNum);
        helpTextData.forEach((textData,index) => {
            let sprite = this._stockSprite[index];
            sprite.bitmap = new Bitmap(Number(textData.width),Number(textData.height));
            if (textData.color){
                sprite.bitmap.textColor = $gameColor.getColor(textData.color);
            }
            if (textData.textId){
                sprite.bitmap.drawText(TextManager.getText( textData.textId ),0,0,480,28);
            }
            if (textData.rect == true || textData.rect == "true" ){
                sprite.bitmap.fillRect(0,0,Number(textData.width),Number(textData.height),$gameColor.getColor(textData.color));
                sprite.bitmap.clearRect(4,4,Number(textData.width) - 8,Number(textData.height) - 8,$gameColor.getColor(textData.color));
            }
            sprite.scale.x = sprite.scale.y = 1;
            if (textData.scale){
                sprite.scale.x = sprite.scale.y = Number(textData.scale);
            }
            sprite.x = Number(textData.x);
            sprite.y = Number(textData.y);
        });
    }

    createSprite(length){
        for (let i = 0;i < length;i++){
            let sprite = new Sprite();
            sprite.bitmap = new Bitmap(480,40);
            this.addChild(sprite);
            this._stockSprite.push(sprite);
        }
    }

    helpText(){
        if (this._helpData.imgsTexts){
            return _.filter(this._helpData.imgsTexts,(textData) => {return textData.index == this.index()});
        }
        return [];
    }

    drawItem(index){
        if (index >= 0 && this._data){
            const data = this._data[index];
            if (data == "" && index == this.index()){
                const scalePer = ((2/3)/0.75);
                this.scale.x = this.scale.y = 0.75;
                this._sprite.bitmap = null;
                this._sprite.visible = false;
                this.contents.fontSize = 29 * scalePer;
                this.setFlatMode();
                this._helpData.pages[index].forEach((pageInfo,idx) => {
                    var textY = 44 * idx + 40;
                    this.drawIcon(pageInfo.iconId,0,textY);
                    this.drawText(pageInfo.title,48,textY,144,16);
                    this.drawText(pageInfo.text,208,textY,600,16);
                });
                this.contents.fontSize = 26 * scalePer;
                this.drawText((this.index()+1) + "/" + this._data.length,0,640 * scalePer,960 * scalePer,'center');
            } else
            if (data && index == this.index()){
                this.resetFontSettings();
                this.scale.x = this.scale.y = (2/3);
                this._sprite.bitmap = ImageManager.loadHelp(data);
                this._sprite.visible = true;
                this.drawBack(0,480,960,208,"rgba(0,0,0,196)",128);
                const helpIndex = _.findIndex($gameHelp._data,(mHelp) => mHelp == this._helpData);
                let marginY = $dataOption.getUserData("language") == LanguageType.English ? 0.75 : 1;
                    
                if (helpIndex >= 0){
                    let helpText = TextManager.getHelpText(helpIndex)[index].split("\n");
                    let isIcon = false;
                    helpText.forEach((element,index) => {
                        if (element.includes('\K')){
                            isIcon = true;
                        }
                    });
                    helpText.forEach((element,index) => {
                        if (isIcon){
                            this.drawTextEx(element,16,548 + index * this.lineHeight() * marginY,924);
                        } else{
                            this.drawText(element,16,548 + index * this.lineHeight() * marginY,924);
                        }
                    });
                    //this.drawTextEx(TextManager.getHelpText(helpIndex)[index],16,548,320,16);
                }
                this.drawText((this.index()+1) + "/" + this._data.length,0,640,960,'center');
            }
        }
    }

    onTouchSelect(){
        //
    }

    swipHelp(moveX){
        if (moveX != 0){
            this._movedX = moveX;
            this.x = this._baseX + moveX;
            this.alpha = (355 - Math.abs(moveX)) / 255;
        }
    }

    swipReset(){
        this._movedX = 0;
    }

    swipEndHelp(moveX){
        if (this._movedX != 0){
            gsap.to(this,0.25,{x : this._baseX,alpha : 1});
        }
    }

    drawTextEx(text, x, y, width,index){
        this.resetFontSettings();
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);
        return textState.outputWidth;
    }

    resetFontSettings(){
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = 26;//$gameSystem.mainFontSize();
        this.resetTextColor();
    }

    updateHelp(){
    }

    _updateCursor(){
    }

    update(){
        super.update();
        if (TouchInput.isTriggered()){
            this.callOkHandler();
        }
    }
}