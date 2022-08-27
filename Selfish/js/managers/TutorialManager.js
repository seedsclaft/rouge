class TutorialManager {
    constructor(){
        //this._busy = false;
    }
    static openGuide(key,addindex,endCall) {
        //if (this._busy){
        //    return;
        //}
        this._busy = true;
        const data = $gameTutorial.getData(key);
        if (!data){
            return;
        }
        if ($gameParty.checkReadTutorial(key)){
            return;
        }
        this.createTextData(data.textData);
        this.drawTextData(addindex);
        let self = this;
        gsap.to(this._textSprites[0],0.5,{delay:8,onComplete:function(){
            self._textSprites.forEach(sprite => {
                if (sprite && sprite.parent){
                    sprite.parent.removeChild(sprite);
                    sprite.destroy();
                }
            });
            if (endCall) endCall();
            self._busy = false;
            self._textSprites = [];
        }});
        $gameParty.gainReadTutorial(key);
    }

    static createTextData(textData){
        this._textSprites = [];
        textData.forEach(data => {
            let window = new Window_Base(new Rectangle( 0,0,960,80 ));
            let x = data.x;
            let y = data.y;
            let text = TextManager.getText( data.textId );
            
            window.x = Number(x);
            window.y = Number(y);

            window.activate();
            window.show();
            window.opacity = 0;

            var func = function(text, x, y, width,height,size) {
                this.contents.fontSize = Number(size);
                const textState = this.createTextState(text, x, y, width);
                this.processAllText(textState);
                return textState.outputWidth;
            }
            window.drawTextEx = func;

            var fontSize = data.fontSize;
            
            let width = window.drawTextEx(text,0,0,960,80,fontSize);
            if (data.align == "center"){
                width = window.x + (960-width)/2;
                window.x = width;
            }
            this._textSprites.push(window);
        });
    }

    static drawTextData(addindex){
        this._textSprites.forEach(sprite => {
            sprite.alpha = 0;
            
            gsap.to(sprite,0.5,{alpha:1});
            if (addindex != undefined){
                SceneManager._scene.addChildAt(sprite,addindex);
            } else{
                SceneManager._scene.addChildAt(sprite,2);
            }
            gsap.to(sprite,0.5,{alpha:0,delay:8});
        });
    }

    static busy(){
        return this._busy;
    }

    static clear(endCall){
        this._textSprites.forEach(sprite => {
            gsap.killTweensOf(sprite);
            if (sprite && sprite.parent){
                sprite.parent.removeChild(sprite);
                sprite.destroy();
            }
        })
        this._textSprites = [];
        if (endCall) endCall();
        this._busy = false;
    }

    
    static openText(key,addindex,endCall) {
        this._busy = true;
        const data = $gameTutorial.getData(key);
        if (!data){
            return;
        }

        let textData = JSON.parse( data.text).split("\n");
        this._textSprites = [];
        textData.forEach((data,index) => {
            let window = new Window_Base(new Rectangle( 0,0,960,540 ));
            let x = 0;
            let y = index * 32 - 16;
            let text = data;
            
            window.x = Number(x);
            window.y = Number(y) ;//+ index * 24;

            window.activate();
            window.show();
            window.opacity = 0;

            var func = function(text, x, y, width,height,size) {
                this.contents.fontSize = Number(size);
                this.contents.textColor = "black";$gameColor.getColor('flat');
                const textState = this.createTextState(text, x, y, width);
                this.processAllText(textState);
                return textState.outputWidth;
            }
            window.drawTextEx = func;

            var fontSize = 22;
            
            let width = window.drawTextEx(text,0,0,960,80,fontSize);
            if (data.align == "center"){
                width = window.x + (960-width)/2;
                window.x = width;
            }
            this._textSprites.push(window);
        });

        this.drawTextData(addindex);
        let self = this;
        gsap.to(this._textSprites[0],0.5,{delay:8,onComplete:function(){
            self._textSprites.forEach(sprite => {
                if (sprite && sprite.parent){
                    sprite.parent.removeChild(sprite);
                    sprite.destroy();
                }
            });
            if (endCall) endCall();
            self._busy = false;
            self._textSprites = [];
        }});
    }
}
TutorialManager._textSprites = [];