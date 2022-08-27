//-----------------------------------------------------------------------------
// Sprite_Particle
//

class Sprite_Particle extends ScreenSprite{
    constructor(){
        super();
        this._emitter = null;
        this._pause = false;
        this._distinct = false;
    }

    loadTexture(filename){
        return new Promise(resolve => {
            ImageManager.loadParticle(filename,null,resolve());
        });
    }

    loadParticleData(filename){
        return new Promise(resolve => {
            return DataManager.loadParticleFile(filename,resolve);
        });
    }

    async setup(parent,filename,ext,start){
        if (ext === undefined){
            ext = {};
        }
        if (start === undefined){
            start = 0
        }
        this.clear();
        await this.loadTexture(filename);
        var data = await this.loadParticleData(filename);
        if (ext.pos){
            data.pos.x = ext.pos.x;
            data.pos.y = ext.pos.y;
        }
        this._emitter = new PIXI.particles.Emitter(parent,
            [new Sprite(ImageManager.loadParticle(filename)).texture]
        ,data);
    
        this._emitter.emit = true;
        this._emitter.update(start);
    }

    clear(){
        if (this._emitter){
            this._emitter.cleanup();
        }
        if (this._emitter && this._emitter.emit){
            this._emitter.emit = false;
        }
        this._emitter = null;
    }

    update(){
        if (this._emitter && !this._pause){
            if (this._distinct == true){
                this.updateDistinct();
            } else{
                this._emitter.update(0.016);
            }
        }
    }

    updateDistinct(){
        if (Graphics.frameCount % 30 == 0){
            this._emitter.update(0.016 * 10);
        }
    }

    pause(){
        this._pause = true;
    }

    resume(){
        this._pause = false;
    }

    distinct(flag){
        this._distinct = flag;
    }
}