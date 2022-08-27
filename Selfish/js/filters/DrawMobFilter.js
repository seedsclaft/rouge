PIXI.filters.DrawMobFilter = class extends PIXI.Filter {
  constructor() {
    var fragmentSrc = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main(void) {
      vec4 color = texture2D(uSampler, vTextureCoord);
      vec2 p = (gl_FragCoord.xy * 1.0 - (640.0,640.0)) / min(640.0, 640.0);
      if (color.a > 0.01){
        color.r = 0.4 * color.a;
        color.g = 0.45 * color.a;
        color.b = 0.8 * color.a;
        color.a *= 0.75;
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
