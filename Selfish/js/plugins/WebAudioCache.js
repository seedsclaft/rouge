// WebAudio Cache (experimental!)
// by orlando (rpgmakerweb.com forums)
// http://forums.rpgmakerweb.com/index.php?/topic/51422-webaudio-cache-experimental/
// Date: 01/03/2016  

//=============================================================================


/*:
 * @plugindesc A cache for WebAudio which keeps preloaded objects in memory while they are still recent or in use. Combined with TDDP Preload Manager, this should hopefully reduce BGM play lag to a minimum.
 * @author orlando (rpgmakerweb.com forums)
 * @License DON'T REMOVE THE AUTHOR CREDITS LINE EVER. Apart from that, feel free to use this, including for commercial projects. No further credit beyond the mention that is already in this source code file is required.
 */

function WebAudioCache() {
    throw "this is a static class";
}

WebAudioCache._cache = {};

// This should be called on map change to purge old stuff:
WebAudioCache.purgeOld = function() {
    var throwAwayKeys = new Array();
    for (var key in this._cache) {
        var cacheInfo = this._cache[key];
        if (cacheInfo.lastAccess + (1000000 * 60 * 5) <
                performance.now()) {
            // older than five minutes, throw away.
            throwAwayKeys.push_back(key);
        }
    }
    while (throwAwayKeys.length > 0) {
        this._cache[throwAwayKeys[0]] = undefined;
        throwAwayKeys.splice(0, 1);
    }
}

// When loading a new map, consider throwing stuff away:
DataManager._cacheData = DataManager.cacheData;
DataManager.isCached = function(data) {
    if (Utils._shouldUseDecoder()){
        return true;
    }
    if (_.find(WebAudioCache._cache,(c) => c.url == data)){
        return true;
    }
    return false;
}

// This adds new entries to the cache:
WebAudioCache.add = function(url, webAudioObj) {
    if (AudioManager.findCache(url)){
        //webAudioObj.destroy();
        //console.error("[WebAudioCache] findCache: " + url);
    } else{
        if (!Utils._shouldUseDecoder()){
            var cacheInfo = new Object();
            cacheInfo.url = url;
            cacheInfo._buffer = webAudioObj;
            cacheInfo._totalTime = webAudioObj._totalTime;
            cacheInfo._sampleRate = webAudioObj._sampleRate;
            cacheInfo._loopStart = webAudioObj._loopStart;
            cacheInfo._loopLength = webAudioObj._loopLength;
            cacheInfo.lastAccess = performance.now();
            //console.error("[WebAudioCache] ADD to cache: " + url);
            this._cache[url] = cacheInfo;
        } else{
            //console.error("[WebAudioCache] ADD to cache: " + url);
        }
    }
}

// Wrap WebAudio.prototype._load to make sure it loads from the cache:
/*
WebAudio.prototype._oldPreWebAudioCache_load = WebAudio.prototype._load;
WebAudio.prototype._load = function(url,resolve) {
    if (url in WebAudioCache._cache) {
        if (debug) {
            //console.error("[WebAudioCache] RETRIEVE from cache: " + url);
        }
        // Reconstruct the info of this audio object from the cache:
        var cacheInfo = WebAudioCache._cache[url];
        this._buffer = cacheInfo._buffer;
        this._totalTime = cacheInfo._totalTime;
        this._sampleRate = cacheInfo._sampleRate;
        this._loopStart = cacheInfo._loopStart;
        this._loopLength = cacheInfo._loopLength;
        this._url = url;
        this._webAudioCached = true;
        // Remember when this audio snippet was used last:
        WebAudioCache._cache[url].lastAccess = performance.now();

        // Call this but in a way that will trigger after the processing of
        // this logic frame is completed:
        var self = this;
        setTimeout(function() {self._onLoad.apply(self);}, 1);
        // (this is required so load listeners registered right after sound
        // creation will still be triggered)
    } else {
        if (debug) {
            //console.error("[WebAudioCache] CACHE MISS on new audio: " + url);
        }
        return this._oldPreWebAudioCache_load(url);
    }
};
*/

// Wrap WebAudio.prototype._onLoad to make sure it adds to the cache:
WebAudio.prototype._oldPreWebAudioCache_onLoad = WebAudio.prototype._onLoad;
WebAudio.prototype._onLoad = function(xhr) {
    if (typeof(this._webAudioCached) == "undefined") {
        WebAudioCache.add(this._url, this);
    }
    this._oldPreWebAudioCache_onLoad(xhr);
};
