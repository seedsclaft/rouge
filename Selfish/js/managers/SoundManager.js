SoundManager.getSe = function(key) {
    const seFile = _.find($gameSE._data,(data) => data.key == key);
    return $gameSE.convertSeData(seFile.se,seFile.option);
};

SoundManager.playGuard = function() {
    if ($dataSystem){
        AudioManager.playSe(this.getSe($gameSE.guard));
    }
};

SoundManager.playJustGuard = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.justGuard));
    }
};

SoundManager.playMessageType1 = function() {
    if ($dataSystem){
        let type = this.getSe($gameSE.messageType1);
        if (this._typeKey1){
            type.pitch = this._typeKey1;
        }
        AudioManager.playStaticSe(type);
    }
};

SoundManager.playMessageType2 = function() {
    if ($dataSystem){
        let type = this.getSe($gameSE.messageType2);
        if (this._typeKey2){
            type.pitch = this._typeKey2;
        }
        AudioManager.playStaticSe(type);
    }
};

SoundManager.changeKeyMessageType1 = function() {
    // 後で入れるかも
    /*
    if ($dataSystem){
        const type = this.getSe($gameSE.messageType1);
        if (!this._typeKey1Base){
            this._typeKey1Base = type.pitch;
        }
        this._typeKey1 = Number(this._typeKey1Base) + Math.randomInt(30) - 15;
        this._typeKey1 -= this._typeKey1 % 5;
    }
    */
};

SoundManager.changeKeyMessageType2 = function() {
    /*
    if ($dataSystem){
        const type = this.getSe($gameSE.messageType2);
        if (!this._typeKey2Base){
            this._typeKey2Base = type.pitch;
        }
        this._typeKey2 = Number(this._typeKey2Base) + Math.randomInt(30) - 15;
        this._typeKey2 -= this._typeKey2 % 5;
    }
    */
};

SoundManager.playActorCommand = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.actorCommand));
    }
};

SoundManager.playLevelUp = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.levelUp));
    }
};

SoundManager.playCutIn = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.cutIn));
    }
};

SoundManager.playLanding = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.landing));
    }
};

SoundManager.playCounter = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.counter));
    }
};

SoundManager.playChain = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.chain));
    }
};

SoundManager.playEyeCatch = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.eyecatch));
    }
};

SoundManager.playAnswerQuiz = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.answerquiz));
    }
};

SoundManager.playMissQuiz = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.missquiz));
    }
};

SoundManager.footSound1 = function(pan,pitch) {
    if (pan === undefined){
        pan = 0;
    }
    if (pitch === undefined){
        pitch = 0;
    }
    if ($dataSystem){
        let sound = this.getSe($gameSE.footSound1);
        sound.pan = Number(sound.pan) + pan;
        sound.pitch = 150 - Number(Math.randomInt(50));
        AudioManager.playStaticSe(sound);
    }
};

SoundManager.footSound2 = function(pan,pitch) {
    if (pan === undefined){
        pan = 0;
    }
    if (pitch === undefined){
        pitch = 0;
    }
    if ($dataSystem){
        let sound = this.getSe($gameSE.footSound2);
        sound.pan = Number(sound.pan) + pan;
        sound.pitch = 125 - Number(Math.randomInt(50));
        AudioManager.playStaticSe(sound);
    }
};

SoundManager.footSound3 = function(pan,pitch) {
    if (pan === undefined){
        pan = 0;
    }
    if (pitch === undefined){
        pitch = 0;
    }
    if ($dataSystem){
        let sound = this.getSe($gameSE.footSound3);
        sound.pan = Number(sound.pan) + pan;
        sound.pitch = 125 - Number(Math.randomInt(50));
        AudioManager.playStaticSe(sound);
    }
};

SoundManager.playUnlock = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.unlock));
    }
};

SoundManager.playJingle = function() {
    if ($dataSystem){
        AudioManager.playStaticSe(this.getSe($gameSE.jingle));
    }
};

SoundManager.playEndrollSound = async function(volume) {
    if (this._anim){
        this._anim.kill();
    }
    this._anim = new TimelineMax();
    this._anim.to(SceneManager._scene, 0, {
        onComplete:function(){
            AudioManager.playSe({
                name: "hakusyu2",
                volume : volume,
                pitch : 100,
                pan : 0,
            });
        },
    }).to(SceneManager._scene, 0.4, {
        onComplete:function(){
            AudioManager.playSe({
                name: "hakusyu3",
                volume : volume,
                pitch : 100,
                pan : 0,
            });
        },
        delay : 0.5
    })
    this._anim.repeat(-1);
}
