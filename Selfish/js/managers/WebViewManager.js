class WebViewManager {
    constructor(){
    }
    static createWebView () {
        this._margin = 120;
        this._webView = document.createElement("div");
        this._iframe = document.createElement("iframe");
        this._webView.appendChild(this._iframe);
        this._iframe.style.width = "100%";
        this._iframe.style.height = "100%";
        this._iframe.style.border = "none";
    
        this._webView.style.width = 960 + "px";
        this._webView.style.height = 540 + "px";
        this._webView.style.overflow = "hidden";
        // MVはposition設定が必要
        this._webView.style.position = "absolute";
        // ゲーム本体より前に
        this._webView.style.visibility = 'hidden';
    
        document.body.appendChild(this._webView);
    };
    static showWebView (src,loadedEvent,margin) {
        if (!this._webView){
            this.createWebView();
        }
        this._webView.style.visibility = 'visible';
        if (margin){
            this._margin = margin;
        } else{
            this._margin = 120;
        }
        this._updateWebView();
        let iframe = this._iframe;
        if (iframe) {
            iframe.src = src;//"http://ecoddr.blog.jp/archives/13456012.html";
            let self = this;
            let cb = function () {
                //self._loaded = true;
                if (loadedEvent){
                    loadedEvent(iframe);
                }
                iframe.removeEventListener("load", cb);
            };
            iframe.addEventListener("load", cb);
        }
    };
    
    static hideWebView () {
        this._webView.style.visibility = 'hidden';
        let iframe = this._iframe;
        if (iframe) {
            iframe.src = "";
        }
    };
    static _updateWebView () {
        this._webView.style.width = (this._width - this._margin) + "px";
        this._webView.style.height = (this._height - this._margin) + "px"; 
        this._webView.style.zIndex = 7;
        //this._centerElement(this._webView);
    };
}