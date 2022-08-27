ImageManager.loadParticle = function(filename, hue,resolve) {
    return this.loadBitmap('img/particles/', filename, hue, false,resolve);
}

ImageManager.loadHelp = function(filename, hue,resolve) {
    if ($dataOption && $dataOption.getUserData("language") == LanguageType.English){
        return this.loadBitmap('img/helps_eng/', filename, hue, false,resolve);
    }
    return this.loadBitmap('img/helps/', filename, hue, false,resolve);
}

ImageManager.loadedAnimationResource = function(animation){
    let flag = true;
    animation.forEach(name => {
        if (!_.find(this._cache,(c) => "img/animations/"+ name+".png" == c._url)){
            flag = false;
        }
    });
    return flag;
}

ImageManager.loadedBattleBack1Resource = function(resourceData){
    let flag = true;
    resourceData.forEach(resource => {
        if (!_.find(this._cache,(c) => "img/battlebacks1/" + resource + ".png" == c._url)){
            flag = false;
        }
    });
    return flag;
}

ImageManager.clearImageAnimation = function(name){
    const key = 'img/animations/' + name + '.png';
    const cache = this._cache;
    delete cache[key];
}

ImageManager.clearImageEnemy = function(name){
    const key = 'img/enemies/' + name + '.png';
    const cache = this._cache;
    delete cache[key];
}

ImageManager.clearImageBattleBack1 = function(name){
    const key = 'img/battlebacks1/' + name + '.png';
    const cache = this._cache;
    delete cache[key];
}

ImageManager.clearImageList = function(keys){
    keys.forEach(key => {
    });
};