class Tactics_AlchemyParam extends Window_Base{
    constructor(x, y, width,height){
        super(new Rectangle( x, y, width, height ));
    }

    setData(data){
        this.contents.clear();
        this.contents.fontSize = 21;
        const _element = $dataSystem.elements;
        const _elementId = [1,2,3,4,5];
        _elementId.forEach((eId,index) => {
            this.drawText(_element[eId],4 + 68 * index,0,120);
            if (data && data.length > index){
                this.drawElementStatus(data[index],4 + index * 68,0);
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