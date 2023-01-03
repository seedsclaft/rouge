class Tactics_SearchList extends Window_Selectable{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
    }

    itemHeight(){
        return 80;
    }

    setSearch(data){
        this._data = data;
        super.refresh();
    }

    item(){
        return this._data != null ? this._data[this.index()] : 0;
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
            const height = 72;
            const bitmap = ImageManager.loadEnemy(_enemy.battlerName);
            this.contents.blt(bitmap, 0, 0, width, height, rect.x, rect.y - 16);
            let text = TextManager.getText(700)  + "." + _search.bossLv + " " + _enemy.name;
            if (_search.enemyNum){
                text += " 他" + _search.enemyNum;
            }
            this.drawText(text, rect.x + 200, rect.y - 12,rect.width);

            this.drawText("+" + _search.pt +" pt", rect.x + 200, rect.y + 16,rect.width);
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