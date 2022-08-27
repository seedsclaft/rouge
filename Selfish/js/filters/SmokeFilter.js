PIXI.filters.SmokeFilter = class extends PIXI.Filter {
  constructor() {
    var fragmentSrc = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

        
    uniform float time;
    uniform vec2 resolution;

    #define iTime time
    #define iResolution vTextureCoord

    //vec3 bgColor = vec3(0.01, 0.45, 1.1);
    vec3 bgColor = vec3(1.0, 1.0, 1.0);
    vec3 rectColor = vec3(0.01, 0.3, 1.1);

    const float noiseIntensity = 2.8;
    const float noiseDefinition = 0.6;
    const vec2 glowPos = vec2(-2., 0.);

    const float total = 30.;
    const float minSize = 0.03;
    const float maxSize = 0.08-minSize;
    const float yDistribution = 0.5;

    float random(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }
  
  float noise( in vec2 p )
  {
      p *= noiseIntensity;
    
      vec2 i = floor( p );
      vec2 f = fract( p );
    vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(random(i + vec2(0.0,0.0)), 
                       random(i + vec2(1.0,0.0)), u.x),
                  mix(random(i + vec2(0.0,1.0)), 
                       random(i + vec2(1.0,1.0)), u.x), u.y);
  }
  
  float fbm( in vec2 uv )
  {	
    uv *= 5.0;
      mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
      float f  = 0.5000*noise( uv ); uv = m*uv;
      f += 0.2500*noise( uv ); uv = m*uv;
      f += 0.1250*noise( uv ); uv = m*uv;
      f += 0.0625*noise( uv ); uv = m*uv;
      
      f = 0.5 + 0.5 * f;
      return f;
  }
  
  vec3 bg(vec2 uv ) {
      float velocity = iTime/1.6;
      float intensity = sin(uv.x*3.+velocity*2.)*1.1+1.75;
      uv.y -= 2.;
      vec2 bp = uv+glowPos;
      uv *= noiseDefinition;
  
      float rb = fbm(vec2(uv.x*.5-velocity*.03, uv.y))*.1;
      rb = sqrt(rb); 
      uv += rb;
  
      //coloring
      float rz = fbm(uv*.9+vec2(velocity*.35, 0.0));
      rz *= dot(bp*intensity,bp)+1.2;
  
      vec3 col = bgColor/(.1-rz);
      return sqrt(abs(col));
  }
  
  
  float rectangle(vec2 uv, vec2 pos, float width, float height, float blur) {
      pos = (vec2(width, height) + .01)/3. - abs(uv - pos);
      pos = smoothstep(0., blur , pos);
      return pos.x * pos.y; 
     
  }
  
  mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
  }
  
  void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 p = (fragCoord.xy * 1.0 - (960.0,540.0)) / min(960.0, 540.0);
      

    vec2 uv = fragCoord.xy / p.xy * 2. - 1.;
    uv.x *= p.x/p.y;
    vec3 color = bg(p)*(2.-abs(p.y*1.00));
    
    float velX = -time/8.;
    float velY = time/10.;
    for(float i=0.; i<total; i++){
        float index = i/total;
        float rnd = random(vec2(index));
        vec3 pos = vec3(0, 0., 0.);
        pos.x = fract(velX*rnd+index)*4.-2.0;
        pos.y = sin(index*rnd*1000.+velY) * yDistribution;
        pos.z = maxSize*rnd+minSize;
        vec2 uvRot = uv - pos.xy + pos.z/2.;
    	uvRot = rotate2d( i+time/2. ) * uvRot;
        uvRot += pos.xy+pos.z/2.;
        float rect = rectangle(uvRot, pos.xy, pos.z, pos.z, (maxSize+minSize-pos.z)/2.);
	    //color += rectColor * rect * pos.z/maxSize;
    }
    
	fragColor = vec4(color, 1.0);
}

    void main(void) {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;
    super(
      null, // vertex shader
      fragmentSrc, // fragment shader
      {time : { type: '1f', value: 0.0 },} // uniforms
    );
  };
};
