PIXI.filters.DrawActorFilter = class extends PIXI.Filter {
  constructor() {
    var fragmentSrc = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform float time;
    uniform float element;

    void main(void) {
      vec4 color = texture2D(uSampler, vTextureCoord);
      vec2 p = (gl_FragCoord.xy * 1.0 - (1280.0,960.0)) / min(1280.0, 960.0);
      float f = (1.0+p.x) * p.y;
      if (color.a > 0.1 && (f > time*4.0-1.0)){
        if (element == 1.0){
          color.r = 1.00 * color.a;
          color.g = 0.50 * color.a;
          color.b = 0.50 * color.a;
        } else if (element == 2.0 || element == 6.0){
          color.r = 0.90 * color.a;
          color.g = 0.90 * color.a;
          color.b = 0.50 * color.a;
        } else if (element == 3.0){
          color.r = 0.50 * color.a;
          color.g = 0.50 * color.a;
          color.b = 1.00 * color.a;
        } else if (element == 4.0 || element == 7.0){
          color.r = 0.80 * color.a;
          color.g = 0.80 * color.a;
          color.b = 0.80 * color.a;
        } else if (element == 5.0){
          color.r = 0.80 * color.a;
          color.g = 0.50 * color.a;
          color.b = 0.80 * color.a;
        }
        color.a = 0.5 * color.a;
      }
      gl_FragColor = color;
    }
  `;

    super(
      null, // vertex shader
      fragmentSrc, // fragment shader
      {
        //time : { type: '1f', value: 0.0}
        time: 0.0,
        //element : { type: '1f', value: 0.0 }
        element : 0.0,
      } // uniforms
    );
  }
};
