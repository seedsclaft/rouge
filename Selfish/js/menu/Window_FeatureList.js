//-----------------------------------------------------------------------------
// Window_FeatureList
//

class Window_FeatureList extends Window_Base{
    constructor(x,y,width,height){
        super(new Rectangle( x,y,width,height ));
        this.hide();
        this.scale.x = this.scale.y = 1;
        this.padding = 4;
        this._lastFeature = null;
    }

    refresh(features,x,y){
        if (features.length == 0){
            this.width = 0;
            if (this._lastFeature){
                this._lastFeature = null;
            }
            return;
        }
        this.x = x;
        this.y = y;
        this.height = features.length * 28 + this.padding * 5;
        this.y = this.y - this.height * 0.75;
        const widthX = this.x + this.width * 0.75;
        if (widthX > 960){
            this.x = 960 - this.width  * 0.75;
        }
        if (this._lastFeature != features.toString()){
            let width = 0;
            this.contents.fontSize = 21;
            features.forEach((feature) => {
                let measureTextWidth = this.contents.measureTextWidth(feature);
                if (measureTextWidth > width){
                    width = measureTextWidth;
                }
            });
            this.width = width + this.padding * 4;
            this.createContents();
            if (features) {
                this.drawFeatures(features);
            }
            this._lastFeature = features.toString();
        }
    }

    drawFeatures(features){
        this.contents.fontSize = 21;
        let y = 0;
        features.forEach((feature,index) => {
            y = index * 28;
            this.drawText(feature,this.padding * 2,y,this.width,24);
        });
    }
}