class PopupInputMessageManager {
    constructor(){
        this._busy = false;
        this._endCall = null;
    }
    static setInputPopup(mainText,endCall,select,select2,subText) {
        if (this._busy){
            return;
        }
        if (this._window == null){
            this._window = new Window_MessageInput(160,80,640,400);
            this._editBox = new EditBoxTextImpl(200,120,640,80);
        }
        if (this._window && this._window.parent){
            this._window.parent.removeChild(this._window);
        }
        this._window.initHandlers();
        this._window.setMainText(mainText);
        this._window.setSubText(subText);
        this._window.select(select);
        SceneManager._scene.addChild(this._window);
        this._editBox.setMaxLength(118);
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
        if (this._window){
            this._window.close();
            this._window.deactivate();
        }
        this._lastInputText = this._editBox._edTxt.value;
        this._editBox.close();
        this._editBox.deactivate();
        await this.setWait(100);
        if (this._window){
            this._window.destroy();
        }
        this._window = null;
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
        if ($gamePause == true && this._window){
            this._window.update();
        }
    }

    static inputStart(endcall){
        const mainText = TextManager.getText(501000);
        const okText = TextManager.getText(501100);
        const cancelText = TextManager.getText(501200);
        const ok2Text = TextManager.getDecideText();
        const cancel2Text = TextManager.getCancelText();
        const cautionText = TextManager.getText(501300);
        const confirmText = TextManager.getText(501400);
        const messageConfirmText = TextManager.getText(501500);
        let _temp = "";
        const _popup = PopupManager;
        this.setInputPopup(mainText,null,"se1","se2",null);
        this.setHandler(okText,"ok",() => {
            if (this.getInputText().length > 6){
                _temp = this.getInputText();
                _popup.setPopup(messageConfirmText,{select:1});
                _popup.setHandler(ok2Text,'ok',() => {
                    if (endcall) endcall();
                });
                _popup.setHandler(cancel2Text,'cancel',() => {
                    this.inputStart(endcall);
                    this._editBox._edTxt.value = _temp;
                });
                _popup.open();
            } else{
                _temp = this.getInputText();
                _popup.setPopup(cautionText,{select:0});
                _popup.setHandler(TextManager.getBackText(),'ok',() => {
                    this.inputStart(endcall);
                    this._editBox._edTxt.value = _temp;
                });
                _popup.open();
            }
        })
        this.setHandler(cancelText,"cancel",() => {
            _popup.setPopup(confirmText,{select:0});
            _popup.setHandler(ok2Text,'ok',() => {
                if (endcall) endcall();
            });
            _temp = this.getInputText();
            _popup.setHandler(cancel2Text,'cancel',() => {
                this.inputStart(endcall);
                this._editBox._edTxt.value = _temp;
            });
            _popup.open();
            this.close();
        })
        this.setSelect(0);
        this.open();
    }
}

class EditBoxTextImpl{
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

        let tmpEdTxt = this._edTxt = document.createElement('textarea');
        //tmpEdTxt.type = 'text';
        tmpEdTxt.style.fontSize = 21 + 'px';
        tmpEdTxt.style.color = '#FFFFFF';
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = 'transparent';
        tmpEdTxt.style.width = width + 'px';
        tmpEdTxt.style.height = height + 'px';
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = 'medium';
        tmpEdTxt.style.padding = '0';
        tmpEdTxt.style.textTransform = 'none';
        tmpEdTxt.style.display = 'none';
        tmpEdTxt.style.position = "absolute";
        tmpEdTxt.style.bottom = "0px";
        tmpEdTxt.style.left = "0px";
        tmpEdTxt.style['-moz-appearance'] = 'textfield';
        tmpEdTxt.style.fontFamily = $gameSystem.mainFontFace();
        
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
        }, 0.5)
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
            edTxt.style.left = x * h + left/2.5 + "px";
            edTxt.style.top = y * v + top/2.5 + "px";
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
            let width = (this._maxLength * 22) / 6;
            let left = (960/2) - (width/2) + 16;
            this._setPosition(left,160);
            this._setSize(width,40 * 8);
            this._limitMaxTextLength();
        }
    }

    _limitMaxTextLength(){
        if (this._maxLength < this._edTxt.value.length){
            this._edTxt.value = this._edTxt.value.substring(0,this._maxLength);
        }
    }
}