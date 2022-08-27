//-----------------------------------------------------------------------------
// Sprite_Map
//

class Sprite_Map extends Spriteset_Base{
    constructor(){
        super();
        this.createBattleField();
        this._minimap.alpha = 1;
    }

    createBattleField() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (Graphics.width - width) / 2;
        const y = (Graphics.height - height) / 2;
        this._battleField = new Sprite();
        this._battleField.setFrame(0, 0, width, height);
        this._battleField.x = x;
        this._battleField.y = y - 24;
        this.addChild(this._battleField);
        this._effectsContainer = this._battleField;
    };

    terminate(){
        super.terminate();
        this._minimap.terminateObjects();
        this._minimap = null;
        this.destroy();
    }
}