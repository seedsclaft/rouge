//-----------------------------------------------------------------------------
// Sprite_BattleTarget
//

class Sprite_BattleTarget extends Sprite {
    constructor(){
        super();
        this._enemy = null;
        this.bitmap = ImageManager.loadSystem('target');
        this._animIdx = 0;
        this.setFrame(0,0,this.frameSize(),this.frameSize());
        this.scale.x = 1.25;
        this.scale.y = 1.25;
        this._duration = gsap.to(this.scale,0.08,{x:1.25,repeat:-1,onRepeat : () => {this.changeCycle()},});
        this._lastCycle = 0;
        this.visible = false;
    }

    frameSize(){
        return 192;
    }

    setEnemy(enemy){
        this._enemy = enemy;
    }

    update(){
        super.update();
        const enemy = _.filter($gameTroop.members(),(enemy) => enemy.isSelected());
        if(_.contains(enemy,this._enemy)){
            this.visible = true;
        } else{
            this.visible = false;
        }
    }

    changeCycle(){
        if (this.visible){
            let size = this.frameSize();
            this._lastCycle = this._duration._animationCycle;
            let x = (this._animIdx % 5) * size; 
            let y = (this._animIdx % 10);
            y = 5 > y ? 0 : 1;
            this.setFrame(x,y * size,size,size);
            this.opacity = 255 - (this._animIdx % 10) * 40;
            this._animIdx += 1;
        }
    }
}