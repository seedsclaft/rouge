class Window_StatusDetail extends Window_Base{
    constructor(x,y){
        super(x,y);
    }

    setup(battler){
        this._battler = battler;
        this.refresh();
    }

    initialize(x,y){
        const width = this.windowWidth();
        const height = this.windowHeight();
        super.initialize(new Rectangle( x, y, width, height ));
        Window_Base.prototype.initialize.call(this, new Rectangle( x, y, width, height ));
    }

    windowWidth(){
        return 624;
    }

    windowHeight(){
        return 532;
    }

    refresh(){
        if (this._battler == null){
            return;
        }
        this.createContents();
        this.updateLvInfo();
        this.updateRoleInfo();
        this.updateStatusInfo();
        //this.updateSkillInfo();
        this.updateSpecialInfo();
    }

    updateLvInfo(){
        const y = 8;
        this.drawText("Lv.",40,y,160);
        this.drawText(this._battler.level,40,y,72,"right");
        this.drawText(this._battler.name(),120,y,160,"right");
    }

    updateRoleInfo(){
        const y = 8;
        this.drawText($dataClasses[ this._battler._classId ] .name,360,y,160,"left");
    }

    updateStatusInfo(){
        const x = 360;
        const y = 64;
        const line = 36;
        this.drawText("攻撃",x,y,160);
        this.drawText("防御",x,y + line,160);
        this.drawText("攻速",x,y + line * 2,160);
        
        this.drawText(this._battler.atk,x,y,160,"right");
        this.drawText(this._battler.def,x,y + line,160,"right");
        this.drawText(this._battler.agi,x,y + line * 2,160,"right");
    }

    updateSkillInfo(){
    }
    
    updateSpecialInfo(){

    }

}
