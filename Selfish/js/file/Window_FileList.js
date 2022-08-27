//-----------------------------------------------------------------------------
// Window_FileList
//
// The window for selecting a save file on the save and load screens.

class Window_FileList extends Window_Selectable{
    constructor(x, y, width, height){
        super(new Rectangle( x, y, width, height ));
        this._data = [];
        this._lockIndexList = [];
        this.activate();
        this.opacity = 0;
        this._upArrowSprite.move(this._width - 12, 12);
        this._downArrowSprite.move(this._width - 12, this._height - 8);
        //gsap.to(this._upArrowSprite,0.4,{y:this._upArrowSprite.y - 8,repeat:-1,yoyo:true});
        //gsap.to(this._downArrowSprite,0.4,{y:this._downArrowSprite.y + 8,repeat:-1,yoyo:true});
    }

    setData(data){
        this._data = data;
        this.refresh();
    }

    maxItems(){
        return this._data.length;
    }

    maxVisibleItems(){
        return 6;
    }

    itemHeight(){
        return 88;
    }

    drawItem(index){
        const info = this._data[index];
        let rect = this.itemRect(index);
        this.drawBack(rect.x - 4,rect.y + 2,rect.width + 8,rect.height - 4,0x000000,128)
        this.resetTextColor();
        const isExists = StorageManager.exists(index);
        if (info && isExists){
            let name;
            if (index == 0){
                name = 'save' + (100);
            } else{
                name = 'save' + (index);
            }
            const locked = this._lockIndexList && _.contains(this._lockIndexList,index);
            this.changePaintOpacity(!locked);
            if (locked){
                this.drawText(TextManager.getText(200500), rect.x - 8, rect.y + this.lineHeight() / 2 + 2, this.width,'center');
            } else{
                let image = CriateSpriteManager.imageSrc()[name];
                if (image && image.src && !image.src.contains('undefined')){
                    this.contents._context.drawImage(image, 0, 0, 160, 90, 12, rect.y + 4,160, 80);
                }
                this.drawTimeStamp(info.timestamp, rect.x + 180, rect.y + this.lineHeight());
                this.drawContents(info, rect, index);    
            }
        } else{
            this.drawText(TextManager.getText(200100), rect.x - 8, rect.y + this.lineHeight() / 2 + 2, this.width,'center');
        }
    }

    drawTimeStamp(time,x,y){
        const ts = Number(time); 
        const d = new Date( ts );
        const year  = d.getFullYear();
        const month = ((d.getMonth() + 1) < 10) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
        const day  = (d.getDate() < 10) ? '0' + d.getDate() : d.getDate();
        const hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
        const min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
        const text = ( year + '  ' + month + '  ' + day + '  ' + hour + ':' + min  );
        this.drawText(text, x, y, 240);
        this.contents.fontSize = 16;
        this.drawText('/', x + 50, y - 1, 240);
        this.drawText('/', x + 96, y - 1, 240);
        this.resetFontSettings();
    }

    drawContents(info, rect, index){
        if (info.title) {
            var fileName = index != 0  ? 'File ' + (index) : 'AutoSave';
            this.drawText(fileName, rect.x + 180, rect.y + 6, rect.width - 192);
        }
        if (info.subTitle){
            this.drawText(info.subTitle, rect.x , rect.y + 6, rect.width - 24, 'right');
        }
        this.drawPlaytime(info, rect.x, rect.y + this.lineHeight(), rect.width);
    }

    drawPlaytime(info,x,y,width){
        if (info.playtime) {
            this.drawText(TextManager.getText(200700) + info.playtime, x  - 24, y, width, 'right');
        }
    }

    playOkSound(){

    }

    terminate(){
        gsap.killTweensOf(this._upArrowSprite);
        gsap.killTweensOf(this._downArrowSprite);
    }

    setLockIndexList(list){
        this._lockIndexList = list;
        this.refresh();
    }
}