//-----------------------------------------------------------------------------
// Window_ScrollSkillBase
//

class Window_ScrollSkillBase extends Window_Selectable {
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width,height ));
        this._upArrowSprite.move(this._width - 36, 4);
        this._downArrowSprite.move(this._width - 104, this._height - 4);
        //gsap.to(this._upArrowSprite,0.4,{y:this._upArrowSprite.y - 8,repeat:-1,yoyo:true});
        //gsap.to(this._downArrowSprite,0.4,{y:this._downArrowSprite.y + 8,repeat:-1,yoyo:true});
    
        this.opacity = 0;
        this._noRemoveNewSkillId = false;
        this._canRepeat = false;

        this._costWidth = 0;
        gsap.to(this._cursorSprite,0,{pixi:{ skewX:-15}});
    }

    setCostWidth (costWidth){
        this._costWidth = costWidth;
    }

    setSkillHelpWindow(x,y,width,height){
        this._skillhelpWindow = new Window_SkillHelp(x,y,width,height);
        this.addChild(this._skillhelpWindow);
        this.setHelpWindow(this._skillhelpWindow);

        this.removeChild(this._downArrowSprite);
        this.addChild(this._downArrowSprite);
    }

    contentsHeight(){
        return this.height;
    }

    actor(){
        return this._actor;
    }

    itemHeight(){
        return 48;
    }

    maxItems(){
        return this._data ? this._data.length : 1;
    }

    item(){
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    }

    show(){
        this.select(0);
        this.showHelpWindow();
    }

    isCurrentItemEnabled(){
        return this.item() && this.item().enable;
    }

    isEnabled(){
        return this._actor.actorId() <= 5;
    }

    costWidth(){
        return this._costWidth;
    }

    itemRect(index){
        const maxCols = this.maxCols();
        const itemWidth = this.itemWidth() - 96;
        const itemHeight = this.itemHeight();
        const colSpacing = this.colSpacing();
        const rowSpacing = this.rowSpacing();
        const col = index % maxCols;
        const row = Math.floor(index / maxCols);
        const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX() + (this.topRow() - index) * 13;
        const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
        const width = itemWidth - colSpacing;
        const height = itemHeight - rowSpacing;
        return new Rectangle(x, y, width, height);
    }

    drawItem(index){
        const skillData = this._data[index];
        if (skillData) {
            const costWidth = this.costWidth();
            let rect = this.itemRect(index);
    
            let skill = $dataSkills[skillData.skillId];
            this.changePaintOpacity(skillData.enable);
    
            this.drawSkillBack(rect.x + 72 + (index-this.topRow()) * 13,rect.y + 2,rect.width,index,skillData);
            const padding = 8;
            const spacing = 4;
            rect.width -= this.textPadding();
            
            this.changePaintOpacity(skillData.enable);
            this.changeTextColor(this.normalColor());
    
            const isSelect = skillData.selected;
            if (skillData.hideFlag){
                this.drawItemNameHide(skill,rect.x + 68,rect.y+spacing,rect.width - costWidth,isSelect);
            } else{
                this.drawItemName(skill,rect.x + 68,rect.y+spacing,rect.width - costWidth,isSelect);
            }
            if (skill.maxLevel){
                this.drawSkillExp(skillData,rect.x + 382 ,rect.y + 2,72);
                this.drawSkillLevel(skillData,skill.maxLevel,rect.x+padding + 386, rect.y+spacing, rect.width - costWidth);
            }
            this.drawMpCost(skillData._mpCost, rect.x + 56,rect.y + 4, rect.width);
            if (index == this.index()){
                if (this._cursorSprite){
                    this._cursorSprite.x = rect.x + 74;
                    this._cursorSprite.y = rect.y + 0;
                    this._cursorSprite.alpha = (skillData.skillId > 1000) ? 0.9 : 0;
                }
            }
        }
    }

    drawSkillBack(x,y,width,index,skillData){
        const element1 = skillData.elementId[0]; 
        const element2 = skillData.elementId[1];
        const element3 = skillData.elementId[2];
        let elementColor = "rgba(0,0,0,255)";
        let elementColor2 = "rgba(0,0,0,0)";
        if (index == this.index()){
            elementColor = $gameColor.skillElementColor(element1);
            elementColor2 = $gameColor.skillElementColor2(element1);
        }
        this.drawBackFadeLeftSkewX(x + 4,y,width - 6 - 32,42,elementColor,elementColor2,128);
        this.drawBackSkewX(x + width - 42,y,42,42,$gameColor.getColor("text"),48);

        if (index == 4 || element2 == element3){
            this.drawBackSkewX(x + 4,y,15,42,$gameColor.skillElementColor(element3),200);
        } else
        if (skillData){
            this.drawBackSkewX(x + 4,y,15,42,$gameColor.skillElementColor(element3),200);
            this.drawUpperTriangle(x + 4,y,15,42,$gameColor.skillElementColor(element2),200);
        }
    }

    setData(data){
        this._data = data;
        this.refresh();
        this.updateHelp();
    }

    setDataOnly(data){
        this._data = data;
    }

    activate(){
        this.active = true;
    }

    deactivate(){
        this.active = false;
    }
    
    selectLast(){
        this.forceSelect(this.index() >= 0 ? this.index() : 0);
    }

    refresh(){
        this.createContents();
        this.drawAllItems();
        if (this._scrollBar == null){
            this._scrollBar = new ScrollBar(this);
        }
    }

    update(){
        Window_Selectable.prototype.update.call(this);
        if (this._lastIndex != this.index()){
            if (this._data && this._data[this.index()] != null){
                if (this._noRemoveNewSkillId){
                } else{
                    $gameParty._newSkillIdList = _.without($gameParty._newSkillIdList,this._data[this.index()].skillId);
                }
                this.refresh();
            }
            this._lastIndex = this.index();
        }
    }

    hideAnimation(){
        this.resetPosition();
        const duration = 0.2;
        gsap.to(this,duration,{x:this.x + 24,y:this.y + 24,alpha:0.25});
    }

    reShowAnimation(){
        const duration = 0.2;
        gsap.to(this,duration,{x:this._initX,y:this._initY,alpha:1});
    }

    resetPosition(){
        this.x = this._initX;
        this.y = this._initY;
    }

    deleteAnimation(){
        const duration = 0.2;
        gsap.to(this,duration,{alpha:0});
    }

    updateHelp(){
        if (this.item() && this.item().helpData && this.item().helpData.baseText.length > 2){
            this.setHelpWindowData(this.item().helpData);
        } else{
            this.setHelpWindowData(null);
        }
    }

    createContents(){
        this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight() + 160);
        this.resetFontSettings();
    }

    updateOrigin(){
        const blockWidth = this.scrollBlockWidth() || 1;
        const blockHeight = this.scrollBlockHeight() || 1;
        const baseX = this._scrollX - (this._scrollX % blockWidth);
        const baseY = this._scrollY - (this._scrollY % blockHeight);
        if (baseX !== this._scrollBaseX || baseY !== this._scrollBaseY) {
            this.updateScrollBase(baseX, baseY);
            this.paint();
        }
        this.origin.x = (this._scrollY % blockHeight) * -0.27;
        this.origin.y = this._scrollY % blockHeight;
        if (this._scrollBar){
            this._scrollBar.skew.x = -0.27;
            this._scrollBar._onScroll();
        }
    }

    _updateCursor(){

    }

    terminate(){
        gsap.killTweensOf(this._upArrowSprite);
        gsap.killTweensOf(this._downArrowSprite);
    }

    setNoRemoveNewSkillId(){
        this._noRemoveNewSkillId = true;
    }

    showBattleAnimation(){
        this._initX = this.x - 24;
        this._initY = this.y - 24;
        this.alpha = 0;
        const duration = 0.2;
        gsap.to(this,duration,{x:this.x - 24,y:this.y - 24,alpha:1});
    }

    hideBattleAnimation(){
        this.resetPosition();
        const duration = 0.2;
        gsap.to(this,duration,{x:this.x,y:this.y,alpha:0});
    }
}