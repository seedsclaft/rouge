class Model_Option extends Model_Base {
    constructor() {
        super();
        this._category = 1;
        this._changeKey = null;
    }

    get category(){
        return this._category;
    }

    setCategoryIndex(index){
        this._category = index;
    }

    optionData (){
        return $dataOption.getOptionData(this.category);
    }

    categoryData (){
        return $dataOption.getCategoryData();
    }
    
    getConfigValue(symbol){
        return $dataOption.getUserData(symbol);
    }

    setConfigValue(symbol, value){
        $dataOption.setUserData(symbol,value);
    }

    changeValue(symbol, value){
        const lastValue = this.getConfigValue(symbol);
        if (lastValue !== value) {
            this.setConfigValue(symbol, value);
        }
    }

    volumeOffset(){
        return 5;
    }

    optionGain(option,symbol){
        let value = this.getConfigValue(symbol);
        switch (Number( option.type )){
            case OptionType.Volume:
                value += this.volumeOffset();
                value = value.clamp(0, 100);
                break;
            case OptionType.OnOff:       
                value = !value;
                break;
            case OptionType.Other:
                value += 1;
                if (value === option.otherOption.length){
                    value = 0;
                }
                value = value.clamp(0, option.otherOption.length-1);
                break;
        }
        this.changeValue(symbol, value);
    }

    optionLess(option,symbol){
        let value = this.getConfigValue(symbol);
        switch (Number( option.type )){
            case OptionType.Volume:
                value -= this.volumeOffset();
                value = value.clamp(0, 100);
                break;
            case OptionType.OnOff:       
                value = !value;
                break;
            case OptionType.Other:
                value -= 1;
                if (value == -1){
                    value = option.otherOption.length-1;
                }
                value = value.clamp(0, option.otherOption.length-1);
                break;
        }
        this.changeValue(symbol, value);
    }

    keyAssaginData(){
        const control = this.getControlSystem();
        let list = [];
        const controlType = $dataOption.getUserData("controlType");
        for (let key in control){
            if (controlType === 0){
                list.push(this.exChangeKeyAssign( control[key] ));
            } else
            if (controlType === 1){
                list.push(this.exChangeKeyAssign2( control[key] ) );
            } else
            if (controlType === 2){
                if (key == 'ok' || key == 'escape' || key == 'menu' || key == 'shift'){
                    list.push(this.exChangeKeyAssign2( control[key] ) + 16 );
                } else{
                    list.push(this.exChangeKeyAssign2( control[key] ) );
                }
            }
        }
        return list;
    }

    setChangeKeyByIndex(changeKeyIndex){
        const control = this.getControlSystem();
        let change = null;
        let index = 0;
        for (let key in control){
            if (changeKeyIndex == index){
                change = key;
            }
            index += 1;
        }
        this._changeKey = change;
    }

    changeKeyAssign(changeKey){
        let control = this.getControlSystem();
        let replace = null;
        let replaceKey = null;
        for (let key in control){
            if (changeKey == control[key]){
                replace = key;
                replaceKey = control[this._changeKey];
            }
        }
        $dataOption.setKeyControl(this._changeKey,changeKey);
        control[this._changeKey] = changeKey;
        if (replace){
            $dataOption.setKeyControl(replace,replaceKey);
            control[replace] = replaceKey;
        }
        ConfigManager.save();
    }

    getControlSystem(){
        const controlType = $dataOption.getUserData("controlType");
        if (controlType === 0){
            Debug.log($dataOption.keyControl())
            return $dataOption.keyControl();
        }
        if (controlType !== 0){
            return $dataOption.xpadControl();
        }
    }

    exChangeKeyAssign(data){
        data = data.toUpperCase();
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let idx = _.findIndex(alphabet,(a) => data == a);
        if (idx == -1){
            const arrows = ['ARROWLEFT','ARROWRIGHT','ARROWUP','ARROWDOWN'];
            idx = _.findIndex(arrows,(a) => data == a);
            if (idx != -1){
                idx += 32;
            } else{
                if (data == "SHIFT"){
                    idx = 48;
                    width *= 2;
                    x -= 12;
                }
                if (data == "CONTROL"){
                    idx = 50;
                    width *= 2;
                    x -= 12;
                }
                if (!isNaN(+data)){
                    idx = 36 + +data;
                }
            }
        }
        return idx;
    }

    exChangeKeyAssign2(data){    
        const keySet = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let idx = _.findIndex(keySet,(a) => data == a);
        switch (idx){
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            idx += 64;
            break;
            case 5:
            idx += 65;
            break;
            case 6:
            idx += 66;
            break;
            case 7:
            idx += 67;
            break;
            case 12:
            idx = 34;
            break;
            case 13:
            idx = 35;
            break;
            case 14:
            idx = 32;
            break;
            case 15:
            idx = 33;
            break;
        }
        return idx;
    }
}