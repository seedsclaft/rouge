class Tactics_SearchList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
    }

    setSearch(data){
        this._data = data;
        super.refresh();
    }

    maxItems() {
        return this._data != null ? this._data.length : 0;
    };

    drawItem(index){
        const _search = this._data[index];
        if (_search){
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.contents.fontSize = 21;
            const _enemy = $dataEnemies[_search.bossEnemy];
            const width = 240;
            const height = 80;
            
            const bitmap = ImageManager.loadFace(_enemy.faceName);
            this.contents.blt(bitmap, 0, 0, width, height, rect.x, rect.y);
            this.drawText("Lv." + _search.bossLv + " " + _enemy.name, rect.x + 200, rect.y,rect.width);
            
            this.drawText("+" + _enemy.gold +" pt", rect.x + 200, rect.y + 40,rect.width);
        }
    }

    updateHelp(){
    }

    update(){
        super.update();
        if (this._lastIndex != this.index()){
            this._lastIndex = this.index();
            this.refresh();
        }
    }

    //_updateCursor(){

    //}


    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}