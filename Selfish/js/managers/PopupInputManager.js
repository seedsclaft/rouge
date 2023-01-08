class PopupInputManager {
    constructor(){
    }

    static init (){
        this._window = new Window_Confirm();
        this._editBox = new EditBoxImpl(400,270,240,80);
        this._busy = false;
        this._endCall = null;
    }

    static setInputPopup(mainText,endCall,select,subText,inputNumber) {
        if (this._busy){
            return;
        }
        if (this._window && this._window.parent){
            this._window.parent.removeChild(this._window);
        }
        SceneManager._scene.addChild(this._window);
        this._window.initHandlers();
        this._window.setTextData(mainText,subText);
        this._window.select(select);
        this._editBox.setMaxLength(inputNumber);
        this._endCall = endCall;
    }

    static open(){
        if (this._busy){
            return;
        }
        this._window.refresh();
        this._window.show();
        this._window.open();
        this._window.activate();
        this._editBox.activate();
        this._busy = true;
    }

    static setSelect(num){
        this._window.select(num);
        this._window.refresh();
    }
    
    static setHandler(text,key,action){
        this._window.setHandler(key,  () => {
            this.close(action);
        });
        this._window.setCommandText(key, text);
    }
    
    static async close(action) {
        this._window.close();
        this._window.deactivate();
        if (this._window && this._window.parent){
            this._window.parent.removeChild(this._window);
        }
        this._lastInputText = this._editBox._edTxt.value;
        this._editBox.close();
        this._editBox.deactivate();
        await this.setWait(100);
        this._busy = false;
        if (action){
            action();
        }
    }

    static getInputText(){
        if (this._lastInputText){
            return this._lastInputText;
        }
        return this._editBox._edTxt.value;
    }
    
    static setWait (num){
        return new Promise(resolve => {
            const delayTime = num
            setTimeout(() => {
              return resolve()
            }, delayTime)
          })
    }
    
    static busy(){
        return this._busy;
    }

    static setFocus(){
        this._editBox.focus();
    }

    static update(){
        if (this._editBox && this._editBox._edTxt){
            this._editBox._update();
        }
    }

    static inputFileName(okHandler){
        const mainText = TextManager.getText(210400);
        PopupInputManager.setInputPopup(mainText,null,0,null,14);
        PopupInputManager.setHandler(TextManager.getText(840),'ok',() => {
            if (okHandler){
                okHandler();
            }
        });
        PopupInputManager.open();
    }
}

class EditBoxImpl{
    constructor(x,y,width,height){
        this._edTxt = null;
        this._editing = false;
        this._maxLength = 0;
        this.createInput(width,height);
        this._setPosition(x,y);
        this._isInit = true;
    }

    createInput(width,height){
        if (this._isInit) return;
        let tmpEdTxt = this._edTxt = document.createElement('input');
        tmpEdTxt.type = 'text';
        tmpEdTxt.style.fontSize = 21 + 'px';
        tmpEdTxt.style.color = '#FFFFFF';
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = 'rgba(60,60,60,0.5)';
        tmpEdTxt.style.width = width + 'px';
        tmpEdTxt.style.height = height + 'px';
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = 'medium';
        tmpEdTxt.style.padding = '5px';
        tmpEdTxt.style.textTransform = 'none';
        tmpEdTxt.style.display = 'none';
        tmpEdTxt.style.position = "absolute";
        tmpEdTxt.style.bottom = "0px";
        tmpEdTxt.style.left = "0px";
        tmpEdTxt.style['-moz-appearance'] = 'textfield';
        tmpEdTxt.style.fontFamily = $gameSystem.mainFontFace();
        tmpEdTxt.style.textShadow = "1px 1px 0 #000, -1px -1px 0 #000,-1px 1px 0 #000, 1px -1px 0 #000,0px 1px 0 #000,  0-1px 0 #000,-1px 0 0 #000, 1px 0 0 #000"
        tmpEdTxt.style.textAlign = "center";
        document.body.appendChild(tmpEdTxt);
        tmpEdTxt.style.zIndex = 10;

        if ($gameDefine.platForm() == PlatForm.iOS){
            tmpEdTxt.addEventListener("touchstart", preventDefaultInput);
        }
    }

    activate(){
        this._beginEditing();
        
        setTimeout(() => {
            this._edTxt.focus();
            this._edTxt.value = "アルト"
        }, 0.5);
    }

    focus(){
        this._edTxt.focus();
    }

    close(){
        this._edTxt.blur();
    }

    deactivate(){
        this._edTxt.value = "";
        this._endEditing();
    }

    _setPosition(x,y){
        let edTxt = this._edTxt;
        if (edTxt){
            const left = Graphics._canvas.offsetLeft;
            const top = Graphics._canvas.offsetTop;
            const h = Graphics._stretchWidth() / Graphics._width;
            const v = Graphics._stretchHeight() / Graphics._height;
            edTxt.style.left = x * h + left/10 + "px";
            edTxt.style.top = y * v - top/7 + "px";
        }
    }

    _setSize(width,height){
        let edTxt = this._edTxt;
        if (edTxt){
            const h = Graphics._stretchWidth() / Graphics._width;
            const v = Graphics._stretchHeight() / Graphics._height;
            edTxt.style.width = width * h + "px";
            edTxt.style.height = height * v + "px";
            edTxt.style.fontSize = 21 * Graphics._realScale + 'px';
        }
    }

    _beginEditing () {
        if (this._edTxt) {
            this._edTxt.style.display = '';
        }
    
        this._editing = true;
    }

    _endEditing () {
        if (this._edTxt) {
            this._edTxt.style.display = 'none';
        }
        this._editing = false;
    }

    setMaxLength (maxLength) {
        if (!isNaN(maxLength)) {
            if(maxLength < 0) {
                maxLength = 65535;
            }
            this._maxLength = maxLength;
            this._edTxt && (this._edTxt.maxLength = maxLength);
        }
        this._update();
    }

    _update () {
        if (this._maxLength){
            let width = this._maxLength * 22;
            let left = (Graphics.width/2) - (width/2);
            this._setPosition(left,Graphics.height/2 - 48);
            this._setSize(width,40);
        }
    }
}
const preventDefaultInput = event => event.stopPropagation();