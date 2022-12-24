AudioManager._bgmVolume = 80;
AudioManager._bgsVolume = 80;
AudioManager._meVolume = 80;
AudioManager._seVolume = 80;
AudioManager._lastVolumeRate = 1.0;
AudioManager._battleVolume = 1.0;
AudioManager._readBattleVolume = 0.7;


AudioManager.getBufferData = function(folder, name) {
    let url;
    if (folder == 'bgm'){
        url = $gameBGM.getBgmUrl(name);
    } else{
        const ext = this.audioFileExt();
        url = this._path + folder + '/' + Utils.encodeURI(name) + ext;
    }
    return url;
}

AudioManager.loadBgm = function(bgm) {
    if (Utils._shouldUseDecoder()){
        return;
    }
    if (bgm.name) { 
        this.createBuffer('bgm/', bgm.name);
    }
};

AudioManager.loadBgs = function(bgs) {
    if (Utils._shouldUseDecoder()){
        return;
    }
    if (bgs.name) { 
        this.createBuffer('bgs/', bgs.name);
    }
};

AudioManager.loadSe = function(se) {
    if (Utils._shouldUseDecoder()){
        return;
    }
    if (se.name) {
        if (!DataManager.isCached('audio/' + 'se/' + se.name + ".ogg")){
            this.createBuffer('se/', se.name);
        }
    }
};

AudioManager.fadeOutBgm = function(duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeOut(duration);
        this._currentBgm = null;
    }
};

AudioManager.fadeOutBgs = function(duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeOut(duration);
        this._currentBgs = null;
    }
};

AudioManager.loadedBgmResource = function(resourceData) {
    if (!resourceData){
        return true;
    }
    let flag = true;
    resourceData.forEach(bgm => {
        if (bgm){
            let data = this.getBufferData('bgm', bgm.name);
            if (!DataManager.isCached(data)){
                flag = false;
            }
        }
    });
    return flag;
}

AudioManager.loadedBgsResource = function(resourceData) {
    if (!resourceData){
        return true;
    }
    let flag = true;
    resourceData.forEach(bgs => {
        if (bgs){
            const data = this.getBufferData('bgs', bgs.name);
            if (!DataManager.isCached(data)){
                flag = false;
            }
        }
    });
    return flag;
}

AudioManager.loadedSeResource = function(resourceData) {
    let flag = true;
    resourceData.forEach(name => {
        const data = this.getBufferData('se', name.name);
        if (!DataManager.isCached(data)){
            flag = false;
        }
    });
    return flag;
}

AudioManager.updateVolume = function() {
    if (this._currentBgm){    
        this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, this._currentBgm);
    }
    if (this._currentBgs){
        this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, this._currentBgs);
    }
};

AudioManager.updateVolumeOption = function() {
    if (this._currentBgm){
        let volume = this._bgmVolume * this._lastVolumeRate;
        Debug.log("volume =" + (volume));
        if (volume >= 100){
            volume = 100;
        }
        this.updateBufferParameters(this._bgmBuffer, volume, this._currentBgm);
    }
    if (this._currentBgs){
        this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, this._currentBgs);
    }
};

// 再生メソッドを上書き
AudioManager.playBgm = async function(bgm, pos, volumeRate) {
    if (!volumeRate){
        volumeRate = 1.0;
    }
    //console.error("playBgm"  + bgm.name);
    await EventManager.loadBgm(bgm);

    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm,volumeRate);
    } else {
        this.stopBgm(bgm);
        if (bgm.name) {
            let url = $gameBGM.getBgmUrl(bgm.name);
            //console.error("playBgm url"  + url);
            const cacheBgm = this.findCache(url);
            if (cacheBgm && cacheBgm._buffer && cacheBgm._buffer._isLoaded){
                this._bgmBuffer = cacheBgm._buffer;
                //Debug.error("cacheBgm" + bgm.name);
            } else{
                this._bgmBuffer = this.createBuffer("bgm/", bgm.name);
                //console.error("createBuffer" + bgm.name);
            }
            this.updateBgmParameters(bgm,volumeRate);
            if (!this._meBuffer) {
                this._bgmBuffer.play(true, pos || 0);
            }
        }
    }
    this.updateCurrentBgm(bgm, pos);
};

AudioManager.playBgmOnce = async function(bgm, pos, volumeRate) {
    if (!volumeRate){
        volumeRate = 1.0;
    }

    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm,volumeRate);
    } else {
        this.stopBgm(bgm);
        if (bgm.name) {
            let url = $gameBGM.getBgmUrl(bgm.name);
            const cacheBgm = this.findCache(url);
            if (cacheBgm && cacheBgm._buffer && cacheBgm._buffer._isLoaded){
                this._bgmBuffer = cacheBgm._buffer;
                Debug.error("cacheBgm" + bgm.name);
            } else{
                this._bgmBuffer = this.createBuffer("bgm/", bgm.name);
            }
            this.updateBgmParameters(bgm,volumeRate);
            if (!this._meBuffer) {
                this._bgmBuffer.play(false, pos || 0);
            }
        }
    }
    this.updateCurrentBgm(bgm, pos);
};

AudioManager.playSe = function(se) {
    console.error(se)
    if (se.name) {
        // [Note] Do not play the same sound in the same frame.
        const latestBuffers = this._seBuffers.filter(
            buffer => buffer.frameCount === Graphics.frameCount
        );
        if (latestBuffers.find(buffer => buffer.name === se.name)) {
            //return;
        }
        const url = "audio/se/" + se.name + this.audioFileExt();
        const cacheBgm = this.findCache(url);
        let buffer;
        if (cacheBgm && cacheBgm._buffer && cacheBgm._buffer._isLoaded){
            buffer = cacheBgm._buffer;
        } else{
            buffer = this.createBuffer("se/", se.name);
        }
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        if (this._seBuffers.indexOf(buffer) == -1){
            this._seBuffers.push(buffer);
        }
        //this.cleanupSe();
    }
};


AudioManager.cleanupSe = function() {
    for (const buffer of this._seBuffers) {
        if (!buffer.isPlaying()) {
            WebAudioCache._cache[buffer.url] = undefined;
            delete WebAudioCache._cache[buffer.url];
            Debug.log("delete se" + buffer.url);
            buffer.destroy();
        }
    }
    this._seBuffers = this._seBuffers.filter(buffer => buffer.isPlaying());
};

AudioManager.playBgs = function(bgs, pos, volumeRate) {
    if (!volumeRate){
        volumeRate = 1.0;
    }
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs,volumeRate);
    } else {
        this.stopBgs();
        if (bgs.name) {
            const url = "audio/bgs/" + bgs.name + this.audioFileExt();
            const cacheBgm = this.findCache(url);
            let buffer;
            if (cacheBgm && cacheBgm._buffer && cacheBgm._buffer._isLoaded){
                this._bgsBuffer = cacheBgm._buffer;
            } else{
                this._bgsBuffer = this.createBuffer("bgs/", bgs.name);
            }
            this.updateBgsParameters(bgs,volumeRate);
            this._bgsBuffer.play(true, pos || 0);
        }
    }
    this.updateCurrentBgs(bgs, pos);
};


AudioManager.findCache = function(url) {
    return cacheBgm = _.find(WebAudioCache._cache,(webAudio) => url == webAudio.url);
}

AudioManager.stopBgm = function(bgm) {
    if (bgm === undefined){
        bgm = null;
    }
    if (this._bgmBuffer) {
        if (bgm && this._bgmBuffer.name == bgm.name){
            this._currentBgm = null;
            return;
        }
        WebAudioCache._cache[this._bgmBuffer.url] = undefined;
        delete WebAudioCache._cache[this._bgmBuffer.url];
        this._bgmBuffer.destroy();
        this._bgmBuffer = null;
        this._currentBgm = null;
    }
};

AudioManager.stopBgs = function() {
    if (this._bgsBuffer) {
        WebAudioCache._cache[this._bgsBuffer.url] = undefined;
        delete WebAudioCache._cache[this._bgsBuffer.url];
        this._bgsBuffer.destroy();
        this._bgsBuffer = null;
        this._currentBgs = null;
    }
};

// ロードしたBGMを削除
AudioManager.purgeBgm = function(bgmData) {
    if (!bgmData){
        return;
    }
    let bgmArray = [];
    if (bgmData instanceof Array){
        bgmData.forEach(bgm => {
            bgmArray.push(bgm);
        });
    } else{
        bgmArray = [bgmData];
    }
    bgmArray.forEach(data => {
        const url = "audio/bgm/" + data.name + this.audioFileExt();
        let cacheBgm = this.findCache(url);
        if (cacheBgm){
            Debug.error("delete bgm" + cacheBgm.url);
            WebAudioCache._cache[cacheBgm.url]._buffer.destroy();
            WebAudioCache._cache[cacheBgm.url] = undefined;
            delete WebAudioCache._cache[cacheBgm.url];
        }
    });
}

// SEを削除
AudioManager._purgeSe = AudioManager.purgeSe;
AudioManager.purgeSe = function(seData) {
    if (!seData){
        return;
    }
    const url = "audio/se/" + seData.name + AudioManager.audioFileExt();
    if (WebAudioCache._cache[url]){
        WebAudioCache._cache[url] = undefined;
        delete WebAudioCache._cache[url];
    }
}

AudioManager.createBuffer = function(folder, name) {
    const ext = this.audioFileExt();
    let url;
    if (folder != 'bgm/'){
        url = this._path + folder + Utils.encodeURI(name) + ext;
    } else{
        url = $gameBGM.getBgmUrl(name);
    }
    const buffer = new WebAudio(url);
    buffer.name = name;
    buffer.frameCount = Graphics.frameCount;
    return buffer;
};



AudioManager.updateBgmParameters = function(bgm,volumeRate) {
    this._lastVolumeRate = volumeRate;
    let volume = this._bgmVolume * volumeRate;
    Debug.log("volume =" + volume);
    if (volume >= 100){
        volume = 100;
    }
    this.updateBufferParameters(this._bgmBuffer, volume, bgm);
};

AudioManager.updateBgsParameters = function(bgs,volumeRate) {
    let volume = this._bgsVolume * volumeRate;
    Debug.log("volume =" + volume);
    if (volume >= 100){
        volume = 100;
    }
    this.updateBufferParameters(this._bgsBuffer, volume, bgs);
};

AudioManager.updateSeParameters = function(buffer, se) {
    this.updateBufferParameters(buffer, this._seVolume, se);
};

AudioManager.fadeToBgm = function(duration,volume,rate) {
    if (this._bgmBuffer && this._currentBgm) {
        this._lastVolumeRate = rate;
        let volumeRate = (this._bgmVolume * 0.01) * volume * 0.01 * rate;
        Debug.error("volumeRate =" + volumeRate);
        if (volumeRate >= 1){
            volumeRate = 1.0;
        }
        this._bgmBuffer.fadeTo(duration,volumeRate);
    }
};

AudioManager.fadeToBgs = function(duration,volume,rate) {
    if (this._bgsBuffer && this._currentBgs) {
        let volumeRate = (this._bgsVolume * 0.01) * volume * 0.01 * rate;
        Debug.log("volumeRate =" + volumeRate);
        if (volumeRate >= 1){
            volumeRate = 1.0;
        }
        this._bgsBuffer.fadeTo(duration,volumeRate);
    }
};

