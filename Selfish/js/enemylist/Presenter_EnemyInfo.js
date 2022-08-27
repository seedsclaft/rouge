class Presenter_EnemyInfo extends Presenter_Base {
    constructor(view) {
        super();
        this._view = view;
        this._model = new Model_EnemyInfo();
        this.setEvent();
    }

    setEvent(){
        this._view.setEvent(this.updateCommand.bind(this));
    }

    updateCommand(){
        super.updateCommand();
        switch (this._view._command){
            case EnemyListCommand.Start:
            return this.commandStart();
            case EnemyListCommand.ChangeIndex:
            return this.commandChangeIndex();
        }
        this._view.clearCommand();
    }

    commandStart(){
        const enemies = this._model.enemyList();
        this._view.commandStart(enemies);
        this.commandChangeIndex();
    }

    commandChangeIndex(){
        const enemy = this._view._listWindow.item();
        const actionList = this._model.actionList(enemy);
        this._view.commandChangeIndex(enemy,actionList);
    }
}