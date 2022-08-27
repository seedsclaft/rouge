ConfigManager.save = function() {
    StorageManager.saveObject("config", $dataOption.makeData());
};

ConfigManager.applyData = function(config) {
    this.alwaysDash = this.readFlag(config, "alwaysDash", false);
    this.commandRemember = this.readFlag(config, "commandRemember", false);
    this.touchUI = this.readFlag(config, "touchUI", true);
    this.bgmVolume = this.readVolume(config, "bgmVolume");
    this.bgsVolume = this.readVolume(config, "bgsVolume");
    this.meVolume = this.readVolume(config, "meVolume");
    this.seVolume = this.readVolume(config, "seVolume");
    $dataOption.applyData(config);
};

ConfigManager.load = function() {
    StorageManager.loadObject("config")
        .then(config => this.applyData(config || {}))
        .catch(() => {
                ConfigManager.save();
                ConfigManager.load();
                return 0
            })
        .then(() => {
            this._isLoaded = true;
            return 0;
        })
        .catch(() => 0);
};