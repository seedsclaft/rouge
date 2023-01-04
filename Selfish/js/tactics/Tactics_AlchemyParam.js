class Tactics_AlchemyParam extends Window_Base{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
    }

    setData(data){
        const _elementId = [1,2,3,4,5];
        this.contents.clear();
        this.contents.fontSize = 18;
        const _element = $dataSystem.elements;
        _elementId.forEach((eId,index) => {
            this.drawIconMini($gameElement.data()[index].iconIndex,4 + 56 * index , 4);
            if (data && data.length > index){
                this.drawElementStatus(data[index],4 + index * 56,-2);
            }
        });
    }

    drawElementStatus(alchemyParam,x,y){
        let _elementStatus = alchemyParam;
        /*
        let status = "G";
        if (_elementStatus > 100){
            status = "S";
        } else
        if (_elementStatus > 80){
            status = "A";
        } else
        if (_elementStatus > 60){
            status = "B";
        } else
        if (_elementStatus > 40){
            status = "C";
        } else
        if (_elementStatus > 20){
            status = "D";
        } else
        if (_elementStatus > 10){
            status = "E";
        } else
        if (_elementStatus > 0){
            status = "F";
        }
        */
        this.drawText(_elementStatus,x,y,80,"center");
    }

    //_updateCursor(){

    //}


    terminate(){
        gsap.killTweensOf(this._cursorSprite);
        this.destroy();
    }
}