//=============================================================================
// Game_MaterialInfo.js
//=============================================================================
/*:
 * @plugindesc 用語データ。
 * @author econa
 *
 * @param MaterialInfoList
 * @desc 用語データ
 * @type struct<MaterialInfo>[]
 * @default []
 * 
 * */

/*~struct~MaterialInfo:
 * @param item
 * @type item
 * 
 * @param index
 * @type number
 * 
 * @param title
 * @type string
 * 
 * @param text
 * @type note
 * 
 * @param event
 * @type string
 * 
 * @param eventItem
 * @type item[]
 * 
 * @param memo
 * @type string
 * @default 
 * 
 * */

//-----------------------------------------------------------------------------
// Game_MaterialInfo
//
// The game object class for an actor.

function Game_MaterialInfo() {
  this.initialize.apply(this, arguments);
}

Game_MaterialInfo.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_MaterialInfo');
    var list = [];
    JSON.parse(this._data.MaterialInfoList).forEach(material => {
        var data = JSON.parse(material);
        if (data.eventItem){
            data.eventItem = JSON.parse(data.eventItem).map(i => Number(i));
        }
        if (data.title){
            //data.title = JSON.parse(data.title);
        }
        if (data.text){
            data.text = JSON.parse(data.text);
        }
        list.push(data);
    });
    this._data = list;

    let materialTitle = [];
    let materialText = [];
    for (let i = 0;i < 1000; i++){
        let temp = this.getData(i);
        if (temp){
            materialTitle.push(temp.title);
            materialText.push(temp.text);
        } else{
            materialTitle.push("");
            materialText.push("");
        }
    }

    //$dataText['materialTitle'] = materialTitle;
    //$dataText['materialText'] = materialText;
    this._userData = [];

};

Game_MaterialInfo.prototype.getData = function(materialId) {
    const materialData = _.find(this._data,(data) => data.item == materialId);
    if (materialData){
        return materialData;
    }
    return null;
}

Game_MaterialInfo.prototype.convertUserData = function() {
    $gameParty.items().forEach(item => {
        if (item && item.id){
            let data = this.getData(item.id);
            if (data){
                let userMaterial = _.find(this._userData,(uData) => uData.id == item.id);
                if (!userMaterial){
                    userMaterial = new Game_Material();
                    this._userData.push(userMaterial);
                }
                userMaterial.setMaterial(data);
            }
        }
    });
}

Game_MaterialInfo.prototype.getUserMaterial = function(id) {
    let data = _.find(this._userData,(uData) => uData.id == id);
    if (data){
        return data;
    }
    return null;
}

Game_MaterialInfo.prototype.getUserMaterialAll = function() {
    let list = [];
    this._userData.forEach(material => {
        list[material.index] = material;
    });
    list = _.compact( list );
    return list;
}

Game_MaterialInfo.prototype.getUserMaterialStatus = function(item) {
    let list = [];
    this._userData.forEach(material => {
        if (material.index == item.index){
            list.push(material);
        }
    });
    list = _.compact( list );
    return list;
}

class Game_Material {
    constructor(){
        this.id = 0;
        this.index = 0;
        this.event = null;
        this._eventItemList = null;
        this._title = null;
        this._text = null;
    }

    setMaterial(material){
        this.id = Number( material.item );
        this.index = Number ( material.index );
        if (material.event){
            this.event = material.event;
        }
        if (material.eventItem){
            this._eventItemList = material.eventItem;
        }
        if (material.title){
            this._title = TextManager.getMaterialTitle(this.id);
            this._title = TextManager.convertEscapeCharacters(this._title);
        }
        if (material.text){
            this._text = TextManager.getMaterialText(this.id);
            this._text = TextManager.convertEscapeMessages(this._text);
            this._text = TextManager.convertEscapeCharacters(this._text);
        }
    }
    get eventName(){
        if (this.event){
            return this.event;
        }
        return null;
    }
    get eventItemList(){
        if (this._eventItemList){
            return this._eventItemList;
        }
        return null;
    }
    get title(){
        return this._title;
    }
    get text(){
        return this._text;
    }
}