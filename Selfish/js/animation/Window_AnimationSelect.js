//-----------------------------------------------------------------------------
// Window_AnimationSelect
//
// The window for selecting a skill on the skill screen.

function Window_AnimationSelect() {
    this.initialize.apply(this, arguments);
}

Window_AnimationSelect.prototype = Object.create(Window_Selectable.prototype);
Window_AnimationSelect.prototype.constructor = Window_AnimationSelect;

Window_AnimationSelect.prototype.initialize = function(x, y, width,height) {
    Window_Selectable.prototype.initialize.call(this,new Rectangle( x, y, width * 2,height * 2));
    this._data = [];
    this.padding = 0;
    this.scale.x = this.scale.y = 0.5;
};

Window_AnimationSelect.prototype.lineHeight = function() {
    return 24;
}

Window_AnimationSelect.prototype.setData = function(data) {
    this._data = data;
    this.refresh();
}

Window_AnimationSelect.prototype.contentsHeight = function() {
    return this.height * 2;
};

Window_AnimationSelect.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_AnimationSelect.prototype.item = function() {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

Window_AnimationSelect.prototype.drawItem = function(index) {
    let animation = this._data[index];
    if (animation) {
        this.resetTextColor();
        var rect = this.itemRect(index);
        const skillData = _.find($dataSkills,(skill) => skill && skill.animation == animation.id);
        if (skillData){
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(animation.id + ". " + skillData.name, rect.x , rect.y , rect.width );
        
        } else{
            this.drawText(animation.id + ". " + animation.name, rect.x , rect.y , rect.width );
        
        }
    }
};

Window_AnimationSelect.prototype.refresh = function() {
    this.createContents();
    this.contents.fontSize = 32;
    this.drawAllItems();
};