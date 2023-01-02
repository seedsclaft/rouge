class Battle_EnemyStatus extends Window_Selectable{
    constructor(){
        super(new Rectangle( 0, 0, 0, 0 ));
        this._data = [];
        this._line = 0;
        this._cursorAll = false;
        this._cursorFixed = false;
        this._cursorLine = false;
    }

    setEnemy(enemyData) {
        this._data = enemyData;
        this._line = 0;
        this.refresh();
    };

    maxCols() {
        return this._data.length;
    };

    maxItems() {
        return this._data.length;
    };

    selectedEnemy() {
        if (this._cursorAll) return this._data;
        if (this._cursorLine) return this._data.filter(a => a._line == this._line);
        return this._data != null ? [this._data[this.index()]] : null;
    };

    enemy() {
        return this._data != null ? this._data[this.index()] : null;
    };

    enemyIndex() {
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    };

    deactivate() {
        super.deactivate();
        $gameTroop.select(null);
    };

    select(index) {
        super.select(index);
        this._cursorAll = false;
        this._cursorLine = false;
        $gameTroop.select(this.enemy());
    };

    selectTarget(target) {
        this._cursorAll = false;
        if (this._cursorLine){
            this.selectLine();
            return;
        }
        let index = -1;
        if (target){
            index = _.findIndex(this._data,target);
        }
        if (index < 0){
            this.select(0);
            $gameTroop.select(this._data[0]);
            return;
        }
        this.select(index);
        $gameTroop.select(target);
    };

    updateHelp() {
        if (this.enemy()) {
            this.setHelpWindowItem(this.enemy());
        }
    };

    selectAll() {
        $gameTroop.aliveMembers().forEach(enemy => {
            enemy.select();
        });
        this._cursorAll = true;
    };

    selectLine(){
        this._data.forEach(enemy => {
            if (enemy._line == this._line){
                enemy.select();
                this._index = enemy.index();
            }
        });
        this._cursorLine = true;
    }

    cursorLeft(){
        if (this._cursorAll || this._cursorLine) return;
        super.cursorLeft();
    }

    cursorRight(){
        if (this._cursorAll || this._cursorLine) return;
        super.cursorRight();
    }

    cursorUp(){
        if (this._cursorAll) return;
        const _newLine = 1;
        const _change = this._data.find(a => a._line == _newLine);
        if (_change){
            this._line = _newLine;
            this.selectTarget(_change);
        }
    }

    cursorDown(){
        if (this._cursorAll) return;
        const _newLine = 0;
        const _change = this._data.find(a => a._line == _newLine);
        if (_change){
            this._line = _newLine;
            this.selectTarget(_change);
        }
    }
}