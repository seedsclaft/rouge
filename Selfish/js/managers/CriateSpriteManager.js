//-----------------------------------------------------------------------------
// CriateSpriteManager
//
// The static class that manages battle progress.

//contents.drawtextなどで作るbitmapを.pngで作成する
function CriateSpriteManager() {
    throw new Error('This is a static class');
}

CriateSpriteManager.createData = function(data,name) {
    let d = data._canvas.toDataURL('save/' + ".png", 0.9);
    d= d.replace(/^.*,/, '');
    const fs       = require('fs');
    const dirPath  = "output/";
    const filePath = dirPath + name + ".png";
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(filePath, new Buffer(d, 'base64'));
}

CriateSpriteManager.createSaveImage = function() {
    const data = SceneManager.backgroundBitmap();
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    const dstWidth = 160;
    const dstHeight = 90;
    canvas.width = dstWidth;
    canvas.height = dstHeight;
    ctx.drawImage(data._canvas, 0, 0, 960, 540, 0, 0, dstWidth, dstHeight);
    ctx.imageSmoothingQuality = 'high';
    const d = canvas.toDataURL('save/' + ".png", 0.9);
    //if (this._saveImage == null){
        this._saveImage = d;
    //}
}

CriateSpriteManager.loadSaveImage = function() {
    this._imageSrc = {};
    const length = DataManager.savefiles().length;
    for (let i = 0;i < length;i++){
        let json = StorageManager.load(i+1);
        if (json){
            let data = JsonEx.parse(json);
            let image = new Image();
            image.src = data.saveImage;
            this._imageSrc['save' + (i+1)] = image;
        }
    }
}

CriateSpriteManager.loadSaveImageByIndex = function(index) {
    //this._imageSrc = {};
    const length = DataManager.savefiles().length;
    for (let i = 0;i < length;i++){
        if (index == i){
            let json = StorageManager.load(i+1);
            if (json){
                let data = JsonEx.parse(json);
                let image = new Image();
                image.src = data.saveImage;
                this._imageSrc['save' + (i+1)] = image;
            }
        }
    }
}

CriateSpriteManager.addSaveImage = function(idx) {
    let image = new Image();
    return new Promise((resolve) => {
        if (idx == DataManager.autoSaveGameId()){
            let json = StorageManager.load(100);
            if (json){
                let data = JsonEx.parse(json);
                image.src = data.saveImage;
                this._imageSrc['save' + (100)] = image;
                resolve();
            }
        } else{
            let json = StorageManager.load(idx);
            if (json){
                let data = JsonEx.parse(json);
                image.src = data.saveImage;
                this._imageSrc['save' + (idx)] = image;
                resolve();
            }
        }
    });
}

CriateSpriteManager.imageSrc = function() {
    if (!this._imageSrc){
        this.loadSaveImage();
    }
    return this._imageSrc;
}

CriateSpriteManager.createResultImage = function() {
    SceneManager.snapForBackground();
    const data = SceneManager.backgroundBitmap();
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    const dstWidth = 640;
    const dstHeight = 360;
    canvas.width = dstWidth;
    canvas.height = dstHeight;
    ctx.drawImage(data._canvas, 0, 0, 960, 540, 0, 0, dstWidth, dstHeight);
    ctx.imageSmoothingQuality = 'high';
    const d = canvas.toDataURL('save/' + ".png", 0.9);
    return d;
}