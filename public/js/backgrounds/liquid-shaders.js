/**
 * Shared GLSL for the liquid-gradient + halftone-dither backgrounds.
 *
 * These three shaders were byte-identical in home-hero, research-hero,
 * sign-in and about-us — 221 lines duplicated four times. They live here once
 * instead. pattern-tool-background.js is deliberately not a consumer: it
 * shares only the vertex shader and has its own, different fragment shaders
 * for the image-dither tool.
 */

export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShaderLiquid = `
  precision highp float;

  varying vec2 vUv;
  uniform vec2 uRes;
  uniform float uTime;

  uniform vec3 c0;
  uniform vec3 c1;
  uniform vec3 c2;
  uniform vec3 c3;
  uniform vec3 c4;

  uniform float warpAmp;
  uniform float sharp;
  uniform float noiseScale;
  uniform int fbmOctaves;
  uniform float waveAmp;
  uniform float waveFreq;
  uniform float waveRotation;
  uniform float blueInfluence;
  uniform float tealInfluence;
  uniform float purpleInfluence;
  uniform float pinkInfluence;
  uniform float color2GroupInfluence;
  uniform float whiteGroupInfluence;
  uniform float colorGroupInfluence;

  uniform vec2 m0;
  uniform vec2 m1;
  uniform vec2 m2;
  uniform vec2 m3;
  uniform vec2 m4;
  uniform vec2 m5;
  uniform vec2 m6;
  uniform vec2 m7;
  uniform vec2 m8;
  uniform vec2 m9;
  uniform vec2 m10;

  float hash21(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for(int i=0;i<10;i++){
      if(i >= fbmOctaves) break;
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  float influence(vec2 p, vec2 center, float sharp){
    float d = length(p - center);
    return exp(-sharp * d * d);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);

    float t = uTime;

    float cosR = cos(waveRotation);
    float sinR = sin(waveRotation);
    vec2 pRotated = vec2(
      p.x * cosR - p.y * sinR,
      p.x * sinR + p.y * cosR
    );
    
    vec2 wave = vec2(
      sin(pRotated.y * waveFreq + t * 0.5) * waveAmp,
      sin(pRotated.x * waveFreq + t * 0.4) * waveAmp
    );
    p += wave;

    float n1 = fbm(p * noiseScale + vec2(0.0, t * 0.18));
    float n2 = fbm(p * noiseScale + vec2(10.0, -t * 0.15));
    vec2 warp = vec2(n1, n2) - 0.5;

    vec2 q = p + warp * warpAmp;

    float w0 = influence(q, m0, sharp);
    float w1 = influence(q, m1, sharp);
    float w2 = influence(q, m2, sharp);
    float w3 = influence(q, m3, sharp);
    float w4 = influence(q, m4, sharp);
    float w5 = influence(q, m5, sharp);
    float w6 = influence(q, m6, sharp);
    float w7 = influence(q, m7, sharp);
    float w8 = influence(q, m8, sharp);
    float w9 = influence(q, m9, sharp);
    float w10 = influence(q, m10, sharp);

    w0 *= whiteGroupInfluence;
    w1 *= blueInfluence * colorGroupInfluence;
    w2 *= tealInfluence * colorGroupInfluence;
    w3 *= purpleInfluence * colorGroupInfluence;
    w4 *= pinkInfluence * colorGroupInfluence;
    w5 *= color2GroupInfluence * colorGroupInfluence;
    w6 *= color2GroupInfluence * colorGroupInfluence;
    w7 *= color2GroupInfluence * colorGroupInfluence;
    w8 *= color2GroupInfluence * colorGroupInfluence;
    w9 *= whiteGroupInfluence;
    w10 *= whiteGroupInfluence;

    float s = w0 + w1 + w2 + w3 + w4 + w5 + w6 + w7 + w8 + w9 + w10 + 1e-6;
    w0 /= s; w1 /= s; w2 /= s; w3 /= s; w4 /= s; w5 /= s; w6 /= s; w7 /= s; w8 /= s; w9 /= s; w10 /= s;

    vec3 col = c0*(w0 + w9 + w10) + c1*(w1 + w5) + c2*(w2 + w6) + c3*(w3 + w7) + c4*(w4 + w8);
    
    float totalInfluence = w0 + w1 + w2 + w3 + w4 + w5 + w6 + w7 + w8 + w9 + w10;
    col = mix(vec3(1.0), col, totalInfluence * 1.5);
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const fragmentShaderDither = `
  precision highp float;
  uniform sampler2D uSource;
  uniform vec2 uResolution;
  uniform float uCellPx;
  uniform float uContrast;
  uniform float uGamma;
  uniform float uSoftness;
  uniform float uMinR;
  uniform float uMaxR;
  uniform float uDotSpacing;
  uniform float uLumThreshold;
  uniform float uInvertDots;
  uniform float uInvert;
  uniform float uBayer;
  uniform float uBayerStrength;

  float bayerMatrix4x4(vec2 p) {
    ivec2 ip = ivec2(floor(p));
    int x = ip.x & 3;
    int y = ip.y & 3;
    int index = x + y * 4;
    float values[16];
    values[0]=0.0;values[1]=8.0;values[2]=2.0;values[3]=10.0;
    values[4]=12.0;values[5]=4.0;values[6]=14.0;values[7]=6.0;
    values[8]=3.0;values[9]=11.0;values[10]=1.0;values[11]=9.0;
    values[12]=15.0;values[13]=7.0;values[14]=13.0;values[15]=5.0;
    return values[index]/16.0;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 col = texture2D(uSource, uv).rgb;
    
    // Calculate cell position
    vec2 cellCoord = gl_FragCoord.xy / uCellPx;
    vec2 cellCenter = floor(cellCoord) + 0.5;
    vec2 offset = cellCoord - cellCenter;
    float dist = length(offset);
    
    // Sample gradient at cell center to determine dot size
    vec2 cellCenterUV = cellCenter * uCellPx / uResolution;
    vec3 cellColor = texture2D(uSource, cellCenterUV).rgb;
    
    // Calculate RAW luminance for sizing (before any processing)
    float rawLum = dot(cellColor, vec3(0.299, 0.587, 0.114));
    
    // Control dot size based on RAW luminance
    // When inverted: darker/colored = bigger dots, white = smaller dots
    float lumForSize = uInvertDots > 0.5 ? (1.0 - rawLum) : rawLum;
    
    // Map lumForSize (0 to 1) directly to radius range
    float radius = mix(uMinR, uMaxR, lumForSize);
    // Apply dot spacing by reducing effective radius
    radius = max(0.0, radius - uDotSpacing);
    
    // Now calculate luminance for visual output (with all processing)
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    
    // Apply luminance threshold
    lum = max(0.0, lum - uLumThreshold) / max(0.001, 1.0 - uLumThreshold);
    
    if (uBayer > 0.5) {
      float threshold = bayerMatrix4x4(gl_FragCoord.xy);
      lum = mix(lum, lum + (threshold - 0.5) * uBayerStrength, uBayer);
    }

    lum = pow(lum, uGamma);
    lum = (lum - 0.5) * uContrast + 0.5;
    lum = clamp(lum, 0.0, 1.0);
    float alpha = smoothstep(radius + uSoftness, radius - uSoftness, dist);
    
    if (uInvert > 0.5) alpha = 1.0 - alpha;
    
    // Output colored dots: use alpha as mask, preserve gradient color
    vec3 finalColor = col * alpha + vec3(1.0) * (1.0 - alpha);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
