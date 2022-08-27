PIXI.filters.MenuBackFilter = class extends PIXI.Filter {
  constructor() {
    var fragmentSrc = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform float time;

    void main(void) {
      vec4 color = texture2D(uSampler, vTextureCoord);
      vec2 p = (gl_FragCoord.xy * 1.0 - (960.0,540.0)) / min(960.0, 540.0);
      float f = (0.5+p.x) * (0.5+p.y);

      float t = 0.25;
      float r = abs(sin(time*t)) * 0.5 * f;
      float g = abs(sin(time*t-1.0)) * 0.5 * f;
      float b = abs(sin(time*t-2.0)) * 0.5 * f;
      color.r = r;
      color.b = b;
      color.g = g;
      color.a = 0.1;
      gl_FragColor = color;
    }
  `;

    super(
      null, // vertex shader
      fragmentSrc, // fragment shader
      {time : { type: '1f', value: 0.0 },} // uniforms
    );
  }
};
