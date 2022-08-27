class Model_Help {
    constructor() {
    }
    
    get animationData(){
        return $dataAnimationsMv;
    }
    
    helpData(key){
        const helpData = $gameHelp.getHelpData(key);
        if (!helpData){
            Debug.error("helpData = null");
            return null;
        }
        return helpData;
    }
    
    helpList(){
        let helpData = $gameHelp._data;
        helpData = _.filter(helpData ,(help) => {return _.find($gameParty.getHelpKeyData(),(keyData) => keyData.key == help.key)});
        return helpData;
    }

    readHelpData(helpData){
        let readableHelp = _.filter($gameParty.getHelpKeyData() ,(helpkey) => helpkey.key == helpData.key);
        if (readableHelp != null && readableHelp.length > 0){
            readableHelp.forEach(help => {
                help.isRead = true;
            });
        }
    }
}