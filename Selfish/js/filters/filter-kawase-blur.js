/*!
 * @pixi/filter-kawase-blur - v2.6.0
 * Compiled Sun, 13 Jan 2019 12:59:55 UTC
 *
 * @pixi/filter-kawase-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports,require("pixi.js")):"function"==typeof define&&define.amd?define(["exports","pixi.js"],r):r((e=e||self).__filters={},e.PIXI)}(this,function(e,r){"use strict";var t="attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}",i="\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec2 uOffset;\r\n\r\nvoid main(void)\r\n{\r\n    vec4 color = vec4(0.0);\r\n\r\n    // Sample top left pixel\r\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));\r\n\r\n    // Sample top right pixel\r\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));\r\n\r\n    // Sample bottom right pixel\r\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));\r\n\r\n    // Sample bottom left pixel\r\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));\r\n\r\n    // Average\r\n    color *= 0.25;\r\n\r\n    gl_FragColor = color;\r\n}",o="\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec2 uOffset;\r\nuniform vec4 filterClamp;\r\n\r\nvoid main(void)\r\n{\r\n    vec4 color = vec4(0.0);\r\n\r\n    // Sample top left pixel\r\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\r\n\r\n    // Sample top right pixel\r\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\r\n\r\n    // Sample bottom right pixel\r\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\r\n\r\n    // Sample bottom left pixel\r\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\r\n\r\n    // Average\r\n    color *= 0.25;\r\n\r\n    gl_FragColor = color;\r\n}\r\n",n=function(e){function n(n,l,u){void 0===n&&(n=4),void 0===l&&(l=3),void 0===u&&(u=!1),e.call(this,t,u?o:i),this.uniforms.uOffset=new Float32Array(2),this._pixelSize=new r.Point,this.pixelSize=1,this._clamp=u,this._kernels=null,Array.isArray(n)?this.kernels=n:(this._blur=n,this.quality=l)}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var l={kernels:{configurable:!0},clamp:{configurable:!0},pixelSize:{configurable:!0},quality:{configurable:!0},blur:{configurable:!0}};return n.prototype.apply=function(e,r,t,i){var o,n=this.pixelSize.x/r.size.width,l=this.pixelSize.y/r.size.height;if(1===this._quality||0===this._blur)o=this._kernels[0]+.5,this.uniforms.uOffset[0]=o*n,this.uniforms.uOffset[1]=o*l,e.applyFilter(this,r,t,i);else{for(var u,s=e.getRenderTarget(!0),f=r,a=s,p=this._quality-1,x=0;x<p;x++)o=this._kernels[x]+.5,this.uniforms.uOffset[0]=o*n,this.uniforms.uOffset[1]=o*l,e.applyFilter(this,f,a,!0),u=f,f=a,a=u;o=this._kernels[p]+.5,this.uniforms.uOffset[0]=o*n,this.uniforms.uOffset[1]=o*l,e.applyFilter(this,f,t,i),e.returnRenderTarget(s)}},n.prototype._generateKernels=function(){var e=this._blur,r=this._quality,t=[e];if(e>0)for(var i=e,o=e/r,n=1;n<r;n++)i-=o,t.push(i);this._kernels=t},l.kernels.get=function(){return this._kernels},l.kernels.set=function(e){Array.isArray(e)&&e.length>0?(this._kernels=e,this._quality=e.length,this._blur=Math.max.apply(Math,e)):(this._kernels=[0],this._quality=1)},l.clamp.get=function(){return this._clamp},l.pixelSize.set=function(e){"number"==typeof e?(this._pixelSize.x=e,this._pixelSize.y=e):Array.isArray(e)?(this._pixelSize.x=e[0],this._pixelSize.y=e[1]):e instanceof r.Point?(this._pixelSize.x=e.x,this._pixelSize.y=e.y):(this._pixelSize.x=1,this._pixelSize.y=1)},l.pixelSize.get=function(){return this._pixelSize},l.quality.get=function(){return this._quality},l.quality.set=function(e){this._quality=Math.max(1,Math.round(e)),this._generateKernels()},l.blur.get=function(){return this._blur},l.blur.set=function(e){this._blur=e,this._generateKernels()},Object.defineProperties(n.prototype,l),n}(r.Filter);e.KawaseBlurFilter=n,Object.defineProperty(e,"__esModule",{value:!0})}),Object.assign(PIXI.filters,this?this.__filters:__filters);
//# sourceMappingURL=filter-kawase-blur.js.map
