class LockFile_Scene extends File_Scene {
    constructor(){
        super();
        this._lockIndexList = [];
    }

    commandStart () {
        this.setMenuSprite(TextManager.getText(200800));
        this._backButton._iconSprite.opacity = 0;
        this._backButton._textButton.opacity = 0;
        this._backButton.setClickHandler(null);
    }

    onFileOk(){    
        this.setCommand(FileCommand.Lock);
    }
    
    onFileCancel(){
        this._listWindow.activate();
    }

    commandLock(index){
        this._listWindow.activate();
        if (_.contains(this._lockIndexList,index)){
            return;
        }
        SoundManager.playLoad();
        this._lockIndexList.push(index);
        this._listWindow.setLockIndexList(this._lockIndexList);
    }

    isAllLocked(){
        return this._lockIndexList.length == this._listWindow._data.length;
    }
    
    helpWindowText(){
        return TextManager.getText(200600);
    }
}