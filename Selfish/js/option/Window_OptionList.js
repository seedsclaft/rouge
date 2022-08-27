//-----------------------------------------------------------------------------
// Window_OptionList
//

class Window_OptionList extends Window_Command {
    constructor(x,y){
        super(x,y);
    }

    initialize(x,y){
        super.initialize(new Rectangle( x,y , 540, this.itemHeight() * 7 + 24 ));
        this._lastHitX = null;
        this._lastScreenMode = $dataOption.getUserData("screenMode");
        this.deselect();
    }

    itemHeight(){
        return 40;
    }

    setData(data){
        this.clearCommandList();
        this.createContents();
        this._data = data;
        data.forEach(option => {
            const isEnable = option.version ? Number(option.version) <= $gameDefine.gameVersionNumber() : true;
            this.addCommand(TextManager.getText(option.textId), option.key,isEnable);
        });
        this.drawAllItems();
    }

    refresh(){
        this.clearCommandList();
        this.createContents();
        super.refresh();
    }

    drawItem(index){
        const option = this._list[index];
        let rect = this.itemRect(index);
        let statusWidth = this.statusWidth();
        let titleWidth = rect.width - statusWidth;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(option.name, rect.x + 12, rect.y, titleWidth, 'left');
        
        this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
        this.drawVolume(rect.x,rect.y,index);
    }

    drawVolume(x,y,index){
        let optionData = this._data[index];
        let symbol = optionData.key;
        let value = this.getConfigValue(symbol);
        if (optionData.type == OptionType.Volume){
            var color1 = this.hpGaugeColor1();
            var color2 = this.hpGaugeColor2();    
            this.drawGauge(x + 240, y - 4, 200,value * 0.01, color1, color2);
            this.contents.fontSize = 12;
            this.drawText("▼", 220 + x + value * 2, y, 40, 'center');
            this.resetFontSettings();
        }
    }

    statusWidth(){
        return 160;
    }

    statusText(index){
        let option = this._data[index];
        let symbol = option.key;
        let value = this.getConfigValue(symbol);
        if (option.type == OptionType.Volume){
            // 0-100%
            return this.volumeStatusText(value);
        }
        if (option.type == OptionType.OnOff){
            return this.booleanStatusText(value);
        }
        if (option.type == OptionType.Other){
            return this.otherStatusText(value,option);
        }
        return "";
    }

    booleanStatusText(value){
        return value ? TextManager.getText( 140 ) : TextManager.getText( 150 );
    }

    volumeStatusText(value){
        return value + TextManager.getText( 300 );
    }

    otherStatusText(value,option){
        if (value == false) {value = 0};
        if (value == true) {value = 1};
        if (value == undefined) {return ""};
        return TextManager.getText(option.otherOption[value]);
    }

    option(){
        return this._data[this.index()];
    }

    processOk(){
        const option = this._data[this.index()];
        if (option.type == OptionType.Volume){
            return;
        }
        if (this.isCurrentItemEnabled()) {
            //this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            this.playBuzzerSound();
        }
    }

    changeValue(symbol, value){
        const lastValue = this.getConfigValue(symbol);
        if (lastValue !== value) {
            this.setConfigValue(symbol, value);
            this.redrawItem(this.findSymbol(symbol));
            if (symbol == "seVolume"){
                SoundManager.playCursor();
            }
        }
    }

    getConfigValue(symbol){
        return $dataOption.getUserData(symbol);
    }

    setConfigValue(symbol, volume){
        $dataOption.setUserData(symbol,volume);
    }

    update(){
        super.update();
        this.updateSlider();
        this.updateScreen();
    }

    updateSlider(){
        if (!this.active){
            return;
        }
        if (this.index() >= 0 && this._data[this.index()]){
            const option = this._data[this.index()];
            const isEnable = option.version ? Number(option.version) <= $gameDefine.gameVersionNumber() : true;
            if (!isEnable){
                return;
            }
        }
        const x = TouchInput.x;
        if (x >= 564 && x <= 776){
            if (TouchInput.isPressed()){
                let option = this._data[this.index()];
                let symbol = option.key;
                let value = this.getConfigValue(symbol);
                if (option.type == 1){
                    // 0-100%
                    value = Math.ceil( 100 - ( (770 - x) / 2 ) );
                    let per = value % 5;
                    this.changeValue(symbol, value - per);
                }
            }
        }
    }

    updateScreen(){
        const screenMode = $dataOption.getUserData("screenMode");
        if (this._lastScreenMode != screenMode){
            this._lastScreenMode = screenMode;
            this.redrawItem(this.findSymbol("screenMode"));
        }
    }

    updateHelp(){
        if (this._data[this.index()]){
            const option = this._data[this.index()];
            const isEnable = option.version ? Number(option.version) <= $gameDefine.gameVersionNumber() : true;
            let helpTextId = 50000;
            if (isEnable){
                helpTextId = Number( this._data[this.index()].textId ) + 1;
            }
            this.setHelpWindowText(TextManager.getText(helpTextId));
        }
    }
}