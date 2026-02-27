/**
 * Hero 10 - WebGL Liquid Gradient + Halftone Dither
 */

import * as THREE from 'three';

class LiquidGradientEffect {
  constructor() {
    console.log('Initializing LiquidGradientEffect...');
    this.storageKey = 'hero10-liquid-settings';
    this.settingsVersion = 2;
    
    // ===== CONFIGURATION =====
    this.config = this.loadSettings() || {
      // Liquid Gradient Parameters
      warpAmp:0.3,
      sharpness: 10.0,
      speed: 0.5,
      fbmOctaves: 1,
      noiseScale: 0.5,
      waveAmp: 0.10,
      waveFreq: 10.0,
      waveRotation: 0.0,
      white2Influence: 10.0,
      
      // Center movement amplitudes
      white1RadiusX: 0.60,
      white1RadiusY: 0.45,
      blueRadiusX: 0.55,
      blueRadiusY: 0.50,
      tealRadiusX: 0.50,
      tealRadiusY: 0.55,
      purpleRadiusX: 0.58,
      purpleRadiusY: 0.48,
      pinkRadiusX: 0.52,
      pinkRadiusY: 0.52,
      white2RadiusX: 0.25,
      white2RadiusY: 0.25,
      white3RadiusX: 0.15,
      white3RadiusY: 0.50,

      // Per-blob movement zones (remap orbit to rectangle)
      white1ZoneCenterX: -0.43,
      white1ZoneCenterY: -0.03,
      white1ZoneHalfWidth: 0.41,
      white1ZoneHalfHeight: 0.33,
      white1SpeedMulX: 2.29,
      white1SpeedMulY: 2.33,
      white1PhaseX: 1.007,
      white1PhaseY: 1.217,
      blueZoneCenterX: 0.53,
      blueZoneCenterY: 0.0,
      blueZoneHalfWidth: 0.47,
      blueZoneHalfHeight: 0.56,
      blueSpeedMulX: 1.0,
      blueSpeedMulY: 1.0,
      bluePhaseX: 3.387,
      bluePhaseY: 0.667,
      tealZoneCenterX: 0.53,
      tealZoneCenterY: 0.0,
      tealZoneHalfWidth: 0.47,
      tealZoneHalfHeight: 0.58,
      tealSpeedMulX: 1.0,
      tealSpeedMulY: 1.0,
      tealPhaseX: 1.317,
      tealPhaseY: -0.643,
      purpleZoneCenterX: 0.53,
      purpleZoneCenterY: 0.0,
      purpleZoneHalfWidth: 0.47,
      purpleZoneHalfHeight: 0.58,
      purpleSpeedMulX: 1.0,
      purpleSpeedMulY: 1.0,
      purplePhaseX: 0.057,
      purplePhaseY: -0.273,
      pinkZoneCenterX: 0.53,
      pinkZoneCenterY: 0.0,
      pinkZoneHalfWidth: 0.47,
      pinkZoneHalfHeight: 0.59,
      pinkSpeedMulX: 1.0,
      pinkSpeedMulY: 1.0,
      pinkPhaseX: -0.523,
      pinkPhaseY: 2.097,
      blue2ZoneCenterX: -1.5,
      blue2ZoneCenterY: -0.03,
      blue2ZoneHalfWidth: 0.12,
      blue2ZoneHalfHeight: 0.56,
      blue2SpeedMulX: 1.0,
      blue2SpeedMulY: 1.0,
      blue2PhaseX: -2.773,
      blue2PhaseY: 1.407,
      teal2ZoneCenterX: -1.5,
      teal2ZoneCenterY: -0.04,
      teal2ZoneHalfWidth: 0.04,
      teal2ZoneHalfHeight: 0.58,
      teal2SpeedMulX: 1.0,
      teal2SpeedMulY: 1.0,
      teal2PhaseX: 1.147,
      teal2PhaseY: -0.453,
      purple2ZoneCenterX: -1.5,
      purple2ZoneCenterY: -0.05,
      purple2ZoneHalfWidth: 0.04,
      purple2ZoneHalfHeight: 0.58,
      purple2SpeedMulX: 1.0,
      purple2SpeedMulY: 1.0,
      purple2PhaseX: -5.353,
      purple2PhaseY: 0.037,
      pink2ZoneCenterX: -1.5,
      pink2ZoneCenterY: -0.05,
      pink2ZoneHalfWidth: 0.02,
      pink2ZoneHalfHeight: 0.59,
      pink2SpeedMulX: 1.0,
      pink2SpeedMulY: 1.0,
      pink2PhaseX: -4.533,
      pink2PhaseY: -0.433,
      white2ZoneCenterX: -0.43,
      white2ZoneCenterY: -0.04,
      white2ZoneHalfWidth: 0.41,
      white2ZoneHalfHeight: 0.30,
      white2SpeedMulX: 2.29,
      white2SpeedMulY: 2.31,
      white2PhaseX: 0.817,
      white2PhaseY: 0.767,
      white3ZoneCenterX: -0.44,
      white3ZoneCenterY: -0.04,
      white3ZoneHalfWidth: 0.42,
      white3ZoneHalfHeight: 0.34,
      white3SpeedMulX: 2.28,
      white3SpeedMulY: 2.22,
      white3PhaseX: 0.727,
      white3PhaseY: 0.887,
      
      // Color influence controls
      white1Influence: 1.0,
      blueInfluence: 1.0,
      tealInfluence: 1.0,
      purpleInfluence: 1.0,
      pinkInfluence: 1.0,
      color2GroupInfluence: 0.15,
      whiteGroupInfluence: 4.0,
      colorGroupInfluence: 0.19,
      
      // Colors (RGB 0-1 range)
      colorWhite: { r: 1.0, g: 1.0, b: 1.0 },
      colorBlue: { r: 0.196, g: 0.392, b: 1.0 },
      colorTeal: { r: 0.196, g: 0.863, b: 0.784 },
      colorPurple: { r: 0.588, g: 0.314, b: 1.0 },
      colorPink: { r: 0.9686274509803922, g: 0.34901960784313724, b: 0.6705882352941176 },
      gradientSaturation: 1.0,
      gradientBrightness: 1.0,
      
      // Glyph Dither Controls
      cellPx: 16.0,
      contrast: 5.0,
      gamma: 0.0,
      softness: 0.01,
      minR: 0.05,
      maxR: 0.35,
      dotSpacing: 0.04,
      lumThreshold: 0.0,
      invertDots: true,
      invert: true,
      bayer: false,
      bayerStrength: 0.04,
      
      // Layer Toggles
      showGlyphDither: true,
      showMotionGuides: false
    };
    if (this.config.gradientSaturation === undefined) {
      this.config.gradientSaturation = 1.0;
    }
    if (this.config.gradientBrightness === undefined) {
      this.config.gradientBrightness = 1.0;
    }
    if (this.config.showMotionGuides === undefined) {
      this.config.showMotionGuides = false;
    }
    if (this.config.color2GroupInfluence === undefined) {
      this.config.color2GroupInfluence = this.config.blue2Influence ?? this.config.colorGroupInfluence ?? 1.0;
    }

    // Center data (baseSpeed and baseOffset for animation)
    this.centers = [
      { baseSpeed: [0.45, 0.38], baseOffset: [0, 0] },      // White 1
      { baseSpeed: [0.32, 0.41], baseOffset: [1.6, 2.2] },  // Blue
      { baseSpeed: [0.37, 0.30], baseOffset: [3.1, 0.9] },  // Teal
      { baseSpeed: [0.40, 0.36], baseOffset: [4.4, 3.7] },  // Purple
      { baseSpeed: [0.35, 0.43], baseOffset: [5.5, 1.3] },  // Pink
      { baseSpeed: [0.32, 0.41], baseOffset: [1.6, 2.2] },  // Blue 2
      { baseSpeed: [0.37, 0.30], baseOffset: [3.1, 0.9] },  // Teal 2
      { baseSpeed: [0.40, 0.36], baseOffset: [4.4, 3.7] },  // Purple 2
      { baseSpeed: [0.35, 0.43], baseOffset: [5.5, 1.3] },  // Pink 2
      { baseSpeed: [0.38, 0.36], baseOffset: [2.1, 1.5] },  // White 2
      { baseSpeed: [0.25, 0.40], baseOffset: [4.2, 3.5] }   // White 3
    ];
    this.centerDefs = [
      { index: 0, key: 'white1', label: 'White 1', defaultCenterX: 0.0, defaultCenterY: 0.0 },
      { index: 1, key: 'blue', label: 'Blue', defaultCenterX: 0.0, defaultCenterY: 0.0 },
      { index: 2, key: 'teal', label: 'Teal', defaultCenterX: 0.0, defaultCenterY: 0.0 },
      { index: 3, key: 'purple', label: 'Purple', defaultCenterX: 0.0, defaultCenterY: 0.0 },
      { index: 4, key: 'pink', label: 'Pink', defaultCenterX: 0.0, defaultCenterY: 0.0 },
      { index: 5, key: 'blue2', label: 'Blue 2', defaultCenterX: 0.0, defaultCenterY: 0.0 },
      { index: 6, key: 'teal2', label: 'Teal 2', defaultCenterX: 0.0, defaultCenterY: 0.0 },
      { index: 7, key: 'purple2', label: 'Purple 2', defaultCenterX: 0.0, defaultCenterY: 0.0 },
      { index: 8, key: 'pink2', label: 'Pink 2', defaultCenterX: 0.0, defaultCenterY: 0.0 },
      { index: 9, key: 'white2', label: 'White 2', defaultCenterX: -0.5, defaultCenterY: 0.0 },
      { index: 10, key: 'white3', label: 'White 3', defaultCenterX: -0.85, defaultCenterY: 0.0 }
    ];
    this.ensureMovementZoneConfig();

    this.layerToggles = {
      liquidGradient: true,
      glyphDither: this.config.showGlyphDither
    };

    this.container = document.getElementById('webgl-background-11');
    if (!this.container) {
      console.error('Container #webgl-background-11 not found!');
      return;
    }

    this.sceneLiquid = new THREE.Scene();
    this.sceneDither = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    this.createMotionGuideOverlay();

    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTargetLiquid = new THREE.WebGLRenderTarget(
      Math.floor(window.innerWidth * dpr),
      Math.floor(window.innerHeight * dpr),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    // Uniforms for liquid gradient shader
    this.uniformsLiquid = {
      uRes: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uTime: { value: 0.0 },
      c0: { value: new THREE.Vector3(this.config.colorWhite.r, this.config.colorWhite.g, this.config.colorWhite.b) },
      c1: { value: new THREE.Vector3(this.config.colorBlue.r, this.config.colorBlue.g, this.config.colorBlue.b) },
      c2: { value: new THREE.Vector3(this.config.colorTeal.r, this.config.colorTeal.g, this.config.colorTeal.b) },
      c3: { value: new THREE.Vector3(this.config.colorPurple.r, this.config.colorPurple.g, this.config.colorPurple.b) },
      c4: { value: new THREE.Vector3(this.config.colorPink.r, this.config.colorPink.g, this.config.colorPink.b) },
      warpAmp: { value: this.config.warpAmp },
      sharp: { value: this.config.sharpness },
      noiseScale: { value: this.config.noiseScale },
      fbmOctaves: { value: this.config.fbmOctaves },
      waveAmp: { value: this.config.waveAmp },
      waveFreq: { value: this.config.waveFreq },
      waveRotation: { value: this.config.waveRotation },
      blueInfluence: { value: this.config.blueInfluence },
      tealInfluence: { value: this.config.tealInfluence },
      purpleInfluence: { value: this.config.purpleInfluence },
      pinkInfluence: { value: this.config.pinkInfluence },
      color2GroupInfluence: { value: this.config.color2GroupInfluence },
      whiteGroupInfluence: { value: this.config.whiteGroupInfluence },
      colorGroupInfluence: { value: this.config.colorGroupInfluence },
      m0: { value: new THREE.Vector2(0, 0) },
      m1: { value: new THREE.Vector2(0, 0) },
      m2: { value: new THREE.Vector2(0, 0) },
      m3: { value: new THREE.Vector2(0, 0) },
      m4: { value: new THREE.Vector2(0, 0) },
      m5: { value: new THREE.Vector2(0, 0) },
      m6: { value: new THREE.Vector2(0, 0) },
      m7: { value: new THREE.Vector2(0, 0) },
      m8: { value: new THREE.Vector2(0, 0) },
      m9: { value: new THREE.Vector2(0, 0) },
      m10: { value: new THREE.Vector2(0, 0) }
    };

    // Uniforms for dither shader
    this.uniformsDither = {
      uSource: { value: this.renderTargetLiquid.texture },
      uResolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
      uCellPx: { value: this.config.cellPx },
      uContrast: { value: this.config.contrast },
      uGamma: { value: this.config.gamma },
      uSoftness: { value: this.config.softness },
      uMinR: { value: this.config.minR },
      uMaxR: { value: this.config.maxR },
      uDotSpacing: { value: this.config.dotSpacing },
      uLumThreshold: { value: this.config.lumThreshold },
      uInvertDots: { value: this.config.invertDots ? 1.0 : 0.0 },
      uInvert: { value: this.config.invert ? 1.0 : 0.0 },
      uBayer: { value: this.config.bayer ? 1.0 : 0.0 },
      uBayerStrength: { value: this.config.bayerStrength }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Liquid gradient fragment shader (from p5.js code)
    const fragmentShaderLiquid = `
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

    // Halftone dither shader (same as hero9)
    const fragmentShaderDither = `
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

    // Create materials
    const matLiquid = new THREE.ShaderMaterial({
      uniforms: this.uniformsLiquid,
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderLiquid
    });

    const matDither = new THREE.ShaderMaterial({
      uniforms: this.uniformsDither,
      vertexShader: vertexShader,
      fragmentShader: fragmentShaderDither
    });

    const quad = new THREE.PlaneGeometry(2, 2);
    this.sceneLiquid.add(new THREE.Mesh(quad, matLiquid));
    this.sceneDither.add(new THREE.Mesh(quad, matDither));

    this.createControls();
    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTargetLiquid.setSize(Math.floor(w * dpr), Math.floor(h * dpr));
    this.uniformsLiquid.uRes.value.set(w * dpr, h * dpr);
    this.uniformsDither.uResolution.value.set(w * dpr, h * dpr);
    if (this.guideCanvas) {
      this.guideCanvas.width = w;
      this.guideCanvas.height = h;
    }
  }

  createMotionGuideOverlay() {
    this.guideCanvas = document.createElement('canvas');
    this.guideCanvas.width = window.innerWidth;
    this.guideCanvas.height = window.innerHeight;
    this.guideCanvas.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9998;
    `;
    document.body.appendChild(this.guideCanvas);
    this.guideCtx = this.guideCanvas.getContext('2d');
  }

  worldToScreen(x, y) {
    const w = this.guideCanvas.width;
    const h = this.guideCanvas.height;
    const aspect = w / h;
    const uvx = x / aspect + 0.5;
    const uvy = y + 0.5;
    return {
      x: uvx * w,
      y: (1.0 - uvy) * h
    };
  }

  drawMotionGuides() {
    if (!this.guideCtx || !this.guideCanvas) return;
    const ctx = this.guideCtx;
    const w = this.guideCanvas.width;
    const h = this.guideCanvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!this.config.showMotionGuides) return;

    const colors = {
      white1: '#ffffff',
      blue: '#2f67ff',
      blue2: '#7ba3ff',
      teal: '#31dcc8',
      teal2: '#7feadf',
      purple: '#9550ff',
      purple2: '#bf96ff',
      pink: '#ff64b7',
      pink2: '#ff9cd1',
      white2: '#f2f2f2',
      white3: '#dadada'
    };

    ctx.save();
    ctx.font = '12px system-ui, sans-serif';
    ctx.textBaseline = 'top';

    for (const def of this.centerDefs) {
      const key = def.key;
      const isWhite = key.startsWith('white');
      const color = colors[key] || '#ffffff';

      const cx = this.config[`${key}ZoneCenterX`];
      const cy = this.config[`${key}ZoneCenterY`];
      const hw = this.config[`${key}ZoneHalfWidth`];
      const hh = this.config[`${key}ZoneHalfHeight`];

      const topLeft = this.worldToScreen(cx - hw, cy + hh);
      const bottomRight = this.worldToScreen(cx + hw, cy - hh);
      const center = this.worldToScreen(cx, cy);

      const rectX = Math.min(topLeft.x, bottomRight.x);
      const rectY = Math.min(topLeft.y, bottomRight.y);
      const rectW = Math.abs(bottomRight.x - topLeft.x);
      const rectH = Math.abs(bottomRight.y - topLeft.y);

      if (isWhite) {
        // Dual-pass stroke for high contrast over both light and dark areas.
        ctx.setLineDash([]);
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 4.0;
        ctx.globalAlpha = 0.55;
        ctx.strokeRect(rectX, rectY, rectW, rectH);

        ctx.setLineDash([7, 5]);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = 0.98;
        ctx.strokeRect(rectX, rectY, rectW, rectH);
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5;
        ctx.strokeRect(rectX, rectY, rectW, rectH);
      }

      // Zone center crosshair
      if (isWhite) {
        ctx.globalAlpha = 0.95;
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 4.0;
        ctx.beginPath();
        ctx.moveTo(center.x - 8, center.y);
        ctx.lineTo(center.x + 8, center.y);
        ctx.moveTo(center.x, center.y - 8);
        ctx.lineTo(center.x, center.y + 8);
        ctx.stroke();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(center.x - 8, center.y);
        ctx.lineTo(center.x + 8, center.y);
        ctx.moveTo(center.x, center.y - 8);
        ctx.lineTo(center.x, center.y + 8);
        ctx.stroke();
      } else {
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(center.x - 6, center.y);
        ctx.lineTo(center.x + 6, center.y);
        ctx.moveTo(center.x, center.y - 6);
        ctx.lineTo(center.x, center.y + 6);
        ctx.stroke();
      }

      // Current blob position
      const current = this.currentCenters ? this.currentCenters[def.index] : null;
      if (current) {
        const point = this.worldToScreen(current.x, current.y);
        ctx.globalAlpha = 1.0;
        if (isWhite) {
          ctx.fillStyle = '#111';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Phase/start indicator (t = 0) and connector line for intuition
        const c = this.centers[def.index];
        const nx0 = Math.cos(c.baseOffset[0] + this.config[`${key}PhaseX`]);
        const ny0 = Math.sin(c.baseOffset[1] + this.config[`${key}PhaseY`]);
        const phaseWorldX = cx + nx0 * hw;
        const phaseWorldY = cy + ny0 * hh;
        const phasePoint = this.worldToScreen(phaseWorldX, phaseWorldY);

        if (isWhite) {
          ctx.globalAlpha = 0.9;
          ctx.strokeStyle = '#111';
          ctx.lineWidth = 3.4;
          ctx.beginPath();
          ctx.moveTo(center.x, center.y);
          ctx.lineTo(phasePoint.x, phasePoint.y);
          ctx.stroke();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(center.x, center.y);
          ctx.lineTo(phasePoint.x, phasePoint.y);
          ctx.stroke();
        } else {
          ctx.globalAlpha = 0.7;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(center.x, center.y);
          ctx.lineTo(phasePoint.x, phasePoint.y);
          ctx.stroke();
        }

        if (isWhite) {
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = '#111';
          ctx.beginPath();
          ctx.arc(phasePoint.x, phasePoint.y, 4.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(phasePoint.x, phasePoint.y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = 0.95;
          ctx.strokeStyle = '#111';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(phasePoint.x, phasePoint.y, 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (isWhite) {
          const label = def.label;
          const padX = 5;
          const padY = 2;
          const labelW = ctx.measureText(label).width + padX * 2;
          const labelH = 16;
          ctx.globalAlpha = 0.75;
          ctx.fillStyle = '#111';
          ctx.fillRect(rectX + 2, rectY + 2, labelW, labelH);
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = '#fff';
          ctx.fillText(label, rectX + 2 + padX, rectY + 2 + padY);
        } else {
          ctx.fillStyle = color;
          ctx.fillText(def.label, rectX + 4, rectY + 4);
        }
      }
    }
    ctx.restore();
  }

  ensureMovementZoneConfig() {
    const duplicateKeys = [
      ['blue2', 'blue'],
      ['teal2', 'teal'],
      ['purple2', 'purple'],
      ['pink2', 'pink']
    ];
    const suffixes = ['ZoneCenterX', 'ZoneCenterY', 'ZoneHalfWidth', 'ZoneHalfHeight', 'SpeedMulX', 'SpeedMulY', 'PhaseX', 'PhaseY'];
    for (const pair of duplicateKeys) {
      const target = pair[0];
      const source = pair[1];
      for (const suffix of suffixes) {
        const targetKey = `${target}${suffix}`;
        const sourceKey = `${source}${suffix}`;
        if (this.config[targetKey] === undefined && this.config[sourceKey] !== undefined) {
          this.config[targetKey] = this.config[sourceKey];
        }
      }
    }

    for (const def of this.centerDefs) {
      const key = def.key;
      const radiusXKey = `${key}RadiusX`;
      const radiusYKey = `${key}RadiusY`;
      const zoneCenterXKey = `${key}ZoneCenterX`;
      const zoneCenterYKey = `${key}ZoneCenterY`;
      const zoneHalfWidthKey = `${key}ZoneHalfWidth`;
      const zoneHalfHeightKey = `${key}ZoneHalfHeight`;
      const speedMulXKey = `${key}SpeedMulX`;
      const speedMulYKey = `${key}SpeedMulY`;
      const phaseXKey = `${key}PhaseX`;
      const phaseYKey = `${key}PhaseY`;

      if (this.config[zoneCenterXKey] === undefined) this.config[zoneCenterXKey] = def.defaultCenterX;
      if (this.config[zoneCenterYKey] === undefined) this.config[zoneCenterYKey] = def.defaultCenterY;
      if (this.config[zoneHalfWidthKey] === undefined) this.config[zoneHalfWidthKey] = this.config[radiusXKey] ?? 0.5;
      if (this.config[zoneHalfHeightKey] === undefined) this.config[zoneHalfHeightKey] = this.config[radiusYKey] ?? 0.5;
      if (this.config[speedMulXKey] === undefined) this.config[speedMulXKey] = 1.0;
      if (this.config[speedMulYKey] === undefined) this.config[speedMulYKey] = 1.0;
      if (this.config[phaseXKey] === undefined) this.config[phaseXKey] = 0.0;
      if (this.config[phaseYKey] === undefined) this.config[phaseYKey] = 0.0;
    }

    if (this.config.whiteGroupInfluence === undefined) this.config.whiteGroupInfluence = 1.0;
    if (this.config.colorGroupInfluence === undefined) this.config.colorGroupInfluence = 1.0;
  }

  updateCenterPositions() {
    const t = this.uniformsLiquid.uTime.value * this.config.speed;
    
    for (const def of this.centerDefs) {
      const c = this.centers[def.index];
      const key = def.key;
      const nx = Math.cos(
        t * c.baseSpeed[0] * this.config[`${key}SpeedMulX`] +
        c.baseOffset[0] +
        this.config[`${key}PhaseX`]
      );
      const ny = Math.sin(
        t * c.baseSpeed[1] * this.config[`${key}SpeedMulY`] +
        c.baseOffset[1] +
        this.config[`${key}PhaseY`]
      );
      const x = this.config[`${key}ZoneCenterX`] + nx * this.config[`${key}ZoneHalfWidth`];
      const y = this.config[`${key}ZoneCenterY`] + ny * this.config[`${key}ZoneHalfHeight`];
      if (!this.currentCenters) this.currentCenters = [];
      this.currentCenters[def.index] = { x, y };
      this.uniformsLiquid[`m${def.index}`].value.set(x, y);
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    
    this.uniformsLiquid.uTime.value += 0.016;
    this.updateCenterPositions();

    // Liquid Gradient Pass
    if (this.layerToggles.liquidGradient) {
      this.renderer.setRenderTarget(this.renderTargetLiquid);
      this.renderer.render(this.sceneLiquid, this.camera);
    }

    // Dither Pass (final output)
    if (this.layerToggles.glyphDither) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.sceneDither, this.camera);
    } else if (this.layerToggles.liquidGradient) {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.sceneLiquid, this.camera);
    }

    this.drawMotionGuides();
  };

  saturateColor(color, saturation) {
    const luma = color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
    return {
      r: THREE.MathUtils.clamp(luma + (color.r - luma) * saturation, 0, 1),
      g: THREE.MathUtils.clamp(luma + (color.g - luma) * saturation, 0, 1),
      b: THREE.MathUtils.clamp(luma + (color.b - luma) * saturation, 0, 1)
    };
  }

  updateGradientColors() {
    const saturation = this.config.gradientSaturation;
    const brightness = this.config.gradientBrightness;
    const applyBrightness = (color) => ({
      r: THREE.MathUtils.clamp(color.r * brightness, 0, 1),
      g: THREE.MathUtils.clamp(color.g * brightness, 0, 1),
      b: THREE.MathUtils.clamp(color.b * brightness, 0, 1)
    });
    const white = this.saturateColor(this.config.colorWhite, saturation);
    const blue = applyBrightness(this.saturateColor(this.config.colorBlue, saturation));
    const teal = applyBrightness(this.saturateColor(this.config.colorTeal, saturation));
    const purple = applyBrightness(this.saturateColor(this.config.colorPurple, saturation));
    const pink = applyBrightness(this.saturateColor(this.config.colorPink, saturation));
    this.uniformsLiquid.c0.value.set(white.r, white.g, white.b);
    this.uniformsLiquid.c1.value.set(blue.r, blue.g, blue.b);
    this.uniformsLiquid.c2.value.set(teal.r, teal.g, teal.b);
    this.uniformsLiquid.c3.value.set(purple.r, purple.g, purple.b);
    this.uniformsLiquid.c4.value.set(pink.r, pink.g, pink.b);
  }

  createControls() {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: absolute; top: 20px; right: 20px; z-index: 100;
      background: rgba(255,255,255,0.95); padding: 16px; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: system-ui, sans-serif;
      font-size: 13px; max-width: 280px; max-height: 70vh; overflow-y: auto;
    `;
    let guiVisible = false;
    panel.style.display = 'none';

    const toggleGuiButton = document.createElement('button');
    toggleGuiButton.type = 'button';
    toggleGuiButton.textContent = 'Show GUI';
    toggleGuiButton.style.cssText = `
      position: absolute; top: 0; right: 0; z-index: 101;
      padding: 8px 10px; border: 1px solid #bbb; border-radius: 6px;
      background: rgba(255,255,255,0.95); color: #222; cursor: pointer;
      font: 600 12px system-ui, sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    `;
    toggleGuiButton.onclick = () => {
      guiVisible = !guiVisible;
      panel.style.display = guiVisible ? 'block' : 'none';
      toggleGuiButton.textContent = guiVisible ? 'Hide GUI' : 'Show GUI';
    };

    // Helper functions for UI
    const makeAccordion = (title, openByDefault = false) => {
      const container = document.createElement('div');
      container.style.marginBottom = '8px';
      
      const header = document.createElement('div');
      header.style.cssText = 'cursor: pointer; padding: 8px; background: #f0f0f0; border-radius: 4px; font-weight: 600; user-select: none;';
      header.textContent = title;
      
      const content = document.createElement('div');
      content.style.cssText = `padding: 8px 4px; display: ${openByDefault ? 'block' : 'none'};`;
      
      header.onclick = () => {
        const isOpen = content.style.display === 'block';
        content.style.display = isOpen ? 'none' : 'block';
      };
      
      container.appendChild(header);
      container.appendChild(content);
      
      return { container, content };
    };

    const makeLabel = (text) => {
      const label = document.createElement('label');
      label.style.display = 'grid';
      label.style.gap = '4px';
      label.textContent = text;
      return label;
    };

    const makeRange = (min, max, step, value, onInput) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.gap = '8px';
      wrapper.style.alignItems = 'center';
      
      const input = document.createElement('input');
      input.type = 'range';
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = value;
      input.style.flex = '1';
      
      const valueSpan = document.createElement('span');
      valueSpan.textContent = value;
      valueSpan.style.minWidth = '45px';
      valueSpan.style.fontSize = '11px';
      valueSpan.style.color = '#666';
      valueSpan.style.textAlign = 'right';
      
      input.addEventListener('input', () => {
        const val = parseFloat(input.value);
        valueSpan.textContent = val;
        onInput(val);
      });

      wrapper.setValue = (val) => {
        const next = typeof val === 'number' ? val : parseFloat(val);
        input.value = String(next);
        valueSpan.textContent = next;
        onInput(next);
      };
      
      wrapper.appendChild(input);
      wrapper.appendChild(valueSpan);
      return wrapper;
    };

    const makeColor = (value, onChange) => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = value;
      input.addEventListener('input', () => onChange(input.value));
      return input;
    };

    const makeCheckbox = (checked, onChange) => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = checked;
      input.addEventListener('change', () => onChange(input.checked));
      return input;
    };

    const hexToRgb = (hex) => {
      const h = hex.replace('#', '').trim();
      const r = parseInt(h.slice(0, 2), 16) / 255;
      const g = parseInt(h.slice(2, 4), 16) / 255;
      const b = parseInt(h.slice(4, 6), 16) / 255;
      return { r, g, b };
    };

    const rgbToHex = (color) => {
      const toHex = (c) => {
        const v = Math.max(0, Math.min(255, Math.round(c * 255)));
        return v.toString(16).padStart(2, '0');
      };
      return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
    };

    // Liquid Gradient section
    const liquidSection = makeAccordion('Liquid Gradient', true);

    const warpLabel = makeLabel('Warp Amount');
    warpLabel.appendChild(makeRange(0, 2, 0.1, this.config.warpAmp, (v) => {
      this.uniformsLiquid.warpAmp.value = v;
    }));

    const sharpLabel = makeLabel('Edge Sharpness');
    sharpLabel.appendChild(makeRange(1, 20, 0.5, this.config.sharpness, (v) => {
      this.uniformsLiquid.sharp.value = v;
    }));

    const speedLabel = makeLabel('Speed');
    speedLabel.appendChild(makeRange(0, 3, 0.1, this.config.speed, (v) => {
      this.config.speed = v;
    }));

    liquidSection.content.appendChild(warpLabel);
    liquidSection.content.appendChild(sharpLabel);
    liquidSection.content.appendChild(speedLabel);
    panel.appendChild(liquidSection.container);

    // Colors section
    const colorsSection = makeAccordion('Colors', false);

    const makeHexColorInput = (hex, onChange) => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.gap = '8px';
      wrapper.style.alignItems = 'center';
      const input = document.createElement('input');
      input.type = 'color';
      input.value = hex;
      input.style.width = '32px';
      input.style.height = '32px';
      const hexInput = document.createElement('input');
      hexInput.type = 'text';
      hexInput.value = hex;
      hexInput.style.width = '70px';
      hexInput.style.fontSize = '12px';
      hexInput.style.marginLeft = '6px';
      hexInput.style.border = '1px solid #ccc';
      hexInput.style.borderRadius = '4px';
      hexInput.style.padding = '2px 4px';
      input.addEventListener('input', () => {
        hexInput.value = input.value;
        onChange(input.value);
      });
      hexInput.addEventListener('input', () => {
        if (/^#([0-9a-fA-F]{6})$/.test(hexInput.value)) {
          input.value = hexInput.value;
          onChange(hexInput.value);
        }
      });
      wrapper.appendChild(input);
      wrapper.appendChild(hexInput);
      return wrapper;
    };

    const whiteLabel = makeLabel('White');
    whiteLabel.appendChild(makeHexColorInput(rgbToHex(this.config.colorWhite), (hex) => {
      const c = hexToRgb(hex);
      this.config.colorWhite = c;
      this.updateGradientColors();
    }));

    const blueLabel = makeLabel('Blue');
    blueLabel.appendChild(makeHexColorInput(rgbToHex(this.config.colorBlue), (hex) => {
      const c = hexToRgb(hex);
      this.config.colorBlue = c;
      this.updateGradientColors();
    }));

    const tealLabel = makeLabel('Teal');
    tealLabel.appendChild(makeHexColorInput(rgbToHex(this.config.colorTeal), (hex) => {
      const c = hexToRgb(hex);
      this.config.colorTeal = c;
      this.updateGradientColors();
    }));

    const purpleLabel = makeLabel('Purple');
    purpleLabel.appendChild(makeHexColorInput(rgbToHex(this.config.colorPurple), (hex) => {
      const c = hexToRgb(hex);
      this.config.colorPurple = c;
      this.updateGradientColors();
    }));

    const pinkLabel = makeLabel('Pink');
    pinkLabel.appendChild(makeHexColorInput(rgbToHex(this.config.colorPink), (hex) => {
      const c = hexToRgb(hex);
      this.config.colorPink = c;
      this.updateGradientColors();
    }));

    const color2GroupInfluenceLabel = makeLabel('Color 2 Influence');
    color2GroupInfluenceLabel.appendChild(makeRange(0.0, 4.0, 0.01, this.config.color2GroupInfluence, (v) => {
      this.config.color2GroupInfluence = v;
      this.uniformsLiquid.color2GroupInfluence.value = v;
    }));

    const saturationLabel = makeLabel('Saturation');
    saturationLabel.appendChild(makeRange(0.0, 4.0, 0.01, this.config.gradientSaturation, (v) => {
      this.config.gradientSaturation = v;
      this.updateGradientColors();
    }));

    const brightnessLabel = makeLabel('Brightness');
    brightnessLabel.appendChild(makeRange(0.0, 2.0, 0.01, this.config.gradientBrightness, (v) => {
      this.config.gradientBrightness = v;
      this.updateGradientColors();
    }));

    const whiteGroupInfluenceLabel = makeLabel('White Influence');
    const whiteGroupInfluenceControl = makeRange(0.0, 4.0, 0.01, this.config.whiteGroupInfluence, (v) => {
      this.config.whiteGroupInfluence = v;
      this.uniformsLiquid.whiteGroupInfluence.value = v;
    });
    whiteGroupInfluenceLabel.appendChild(whiteGroupInfluenceControl);

    const colorGroupInfluenceLabel = makeLabel('Color Group Influence');
    const colorGroupInfluenceControl = makeRange(0.0, 4.0, 0.01, this.config.colorGroupInfluence, (v) => {
      this.config.colorGroupInfluence = v;
      this.uniformsLiquid.colorGroupInfluence.value = v;
    });
    colorGroupInfluenceLabel.appendChild(colorGroupInfluenceControl);

    colorsSection.content.appendChild(whiteLabel);
    colorsSection.content.appendChild(blueLabel);
    colorsSection.content.appendChild(tealLabel);
    colorsSection.content.appendChild(purpleLabel);
    colorsSection.content.appendChild(pinkLabel);
    colorsSection.content.appendChild(color2GroupInfluenceLabel);
    colorsSection.content.appendChild(saturationLabel);
    colorsSection.content.appendChild(brightnessLabel);
    colorsSection.content.appendChild(whiteGroupInfluenceLabel);
    colorsSection.content.appendChild(colorGroupInfluenceLabel);
    panel.appendChild(colorsSection.container);

    // Movement Zones section
    const movementSection = makeAccordion('Movement Zones', false);
    const showGuidesLabel = makeLabel('Show Motion Guides');
    const showGuidesCheckbox = makeCheckbox(this.config.showMotionGuides, (v) => {
      this.config.showMotionGuides = v;
    });
    showGuidesLabel.appendChild(showGuidesCheckbox);
    movementSection.content.appendChild(showGuidesLabel);

    const addMovementSlider = (parent, field, text, min, max, step) => {
      const label = makeLabel(text);
      const range = makeRange(min, max, step, this.config[field], (v) => {
        this.config[field] = v;
      });
      label.appendChild(range);
      parent.appendChild(label);
    };

    for (const def of this.centerDefs) {
      const group = document.createElement('div');
      group.style.cssText = 'padding: 8px; border: 1px solid #eee; border-radius: 6px; margin-bottom: 10px;';

      const groupTitle = document.createElement('div');
      groupTitle.textContent = def.label;
      groupTitle.style.cssText = 'font-weight: 600; margin-bottom: 6px; font-size: 12px;';
      group.appendChild(groupTitle);

      addMovementSlider(group, `${def.key}ZoneCenterX`, 'Center X', -1.5, 1.5, 0.01);
      addMovementSlider(group, `${def.key}ZoneCenterY`, 'Center Y', -1.0, 1.0, 0.01);
      addMovementSlider(group, `${def.key}ZoneHalfWidth`, 'Half Width', 0.0, 1.5, 0.01);
      addMovementSlider(group, `${def.key}ZoneHalfHeight`, 'Half Height', 0.0, 1.5, 0.01);
      addMovementSlider(group, `${def.key}SpeedMulX`, 'Speed X', 0.0, 4.0, 0.01);
      addMovementSlider(group, `${def.key}SpeedMulY`, 'Speed Y', 0.0, 4.0, 0.01);
      addMovementSlider(group, `${def.key}PhaseX`, 'Phase X', -6.283, 6.283, 0.01);
      addMovementSlider(group, `${def.key}PhaseY`, 'Phase Y', -6.283, 6.283, 0.01);

      movementSection.content.appendChild(group);
    }

    panel.appendChild(movementSection.container);

    // Glyph Dither section
    const glyphSection = makeAccordion('Glyph Dither', false);

    const cellLabel = makeLabel('Cell Size (px)');
    cellLabel.appendChild(makeRange(6.0, 24.0, 1.0, this.config.cellPx, (v) => {
      this.uniformsDither.uCellPx.value = v;
    }));

    const contrastLabel = makeLabel('Contrast');
    contrastLabel.appendChild(makeRange(0.0, 10.0, 0.1, this.config.contrast, (v) => {
      this.uniformsDither.uContrast.value = v;
    }));

    const gammaLabel = makeLabel('Gamma');
    gammaLabel.appendChild(makeRange(-2.0, 3.0, 0.1, this.config.gamma, (v) => {
      this.uniformsDither.uGamma.value = v;
    }));

    const softnessLabel = makeLabel('Softness');
    softnessLabel.appendChild(makeRange(0.0, 0.1, 0.01, this.config.softness, (v) => {
      this.uniformsDither.uSoftness.value = v;
    }));

    const minRLabel = makeLabel('Min Radius');
    minRLabel.appendChild(makeRange(0.0, 0.5, 0.01, this.config.minR, (v) => {
      this.uniformsDither.uMinR.value = v;
    }));

    const maxRLabel = makeLabel('Max Radius');
    maxRLabel.appendChild(makeRange(0.0, 0.5, 0.01, this.config.maxR, (v) => {
      this.uniformsDither.uMaxR.value = v;
    }));

    const dotSpacingLabel = makeLabel('Dot Spacing');
    dotSpacingLabel.appendChild(makeRange(0.0, 0.3, 0.01, this.config.dotSpacing, (v) => {
      this.uniformsDither.uDotSpacing.value = v;
    }));

    const ditherToggleLabel = makeLabel('Show Layer');
    ditherToggleLabel.appendChild(makeCheckbox(this.config.showGlyphDither, (v) => {
      this.config.showGlyphDither = v;
      this.layerToggles.glyphDither = v;
    }));

    const invertLabel = makeLabel('Invert');
    invertLabel.appendChild(makeCheckbox(this.config.invert, (v) => {
      this.config.invert = v;
      this.uniformsDither.uInvert.value = v ? 1.0 : 0.0;
    }));

    glyphSection.content.appendChild(ditherToggleLabel);
    glyphSection.content.appendChild(cellLabel);
    glyphSection.content.appendChild(contrastLabel);
    glyphSection.content.appendChild(gammaLabel);
    glyphSection.content.appendChild(softnessLabel);
    glyphSection.content.appendChild(minRLabel);
    glyphSection.content.appendChild(maxRLabel);
    glyphSection.content.appendChild(dotSpacingLabel);
    glyphSection.content.appendChild(invertLabel);
    panel.appendChild(glyphSection.container);

    // Sync uniforms with loaded config values
    this.syncUniformsWithConfig();

    // Add Save/Download buttons section
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.cssText = 'padding: 15px; display: flex; gap: 10px; flex-direction: column;';
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Settings';
    saveButton.style.cssText = 'padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
    saveButton.onmouseover = () => saveButton.style.background = '#45a049';
    saveButton.onmouseout = () => saveButton.style.background = '#4CAF50';
    saveButton.onclick = () => this.saveSettings();
    
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Settings JSON';
    downloadButton.style.cssText = 'padding: 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
    downloadButton.onmouseover = () => downloadButton.style.background = '#0b7dda';
    downloadButton.onmouseout = () => downloadButton.style.background = '#2196F3';
    downloadButton.onclick = () => this.downloadSettings();
    
    buttonsDiv.appendChild(saveButton);
    buttonsDiv.appendChild(downloadButton);
    panel.appendChild(buttonsDiv);

    const hero11Section = document.querySelector('.hero-section.home-section-1');
    if (hero11Section) {
      hero11Section.style.position = 'relative';
      // Create a container for the GUI elements if not present
      let guiContainer = hero11Section.querySelector('.hero11-webgl-gui-container');
      if (!guiContainer) {
        guiContainer = document.createElement('div');
        guiContainer.className = 'hero11-webgl-gui-container';
        guiContainer.style.position = 'absolute';
        guiContainer.style.top = '0';
        guiContainer.style.right = '0';
        guiContainer.style.width = 'auto';
        guiContainer.style.height = 'auto';
        guiContainer.style.zIndex = '100';
        hero11Section.appendChild(guiContainer);
      }
      guiContainer.appendChild(toggleGuiButton);
      guiContainer.appendChild(panel);
    } else {
      document.body.appendChild(toggleGuiButton);
      document.body.appendChild(panel);
    }
  }

  saveSettings() {
    try {
      const payload = {
        version: this.settingsVersion,
        config: this.config
      };
      const settings = JSON.stringify(payload, null, 2);
      localStorage.setItem(this.storageKey, settings);
      console.log('Settings saved to localStorage');
      
      // Visual feedback
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = 'Saved!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  }

  loadSettings() {
    // Always boot Hero 11 from in-code defaults; ignore persisted localStorage.
    console.log('Ignoring saved settings; using in-code defaults');
    return null;
  }

  downloadSettings() {
    try {
      const settings = JSON.stringify(this.config, null, 2);
      const blob = new Blob([settings], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hero10-liquid-settings-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Settings downloaded');
      
      // Visual feedback
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = 'Downloaded!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    } catch (error) {
      console.error('Failed to download settings:', error);
      alert('Failed to download settings');
    }
  }

  syncUniformsWithConfig() {
    // Sync all uniforms with config values (used after loading settings)
    this.uniformsLiquid.warpAmp.value = this.config.warpAmp;
    this.uniformsLiquid.sharp.value = this.config.sharpness;
    this.uniformsLiquid.noiseScale.value = this.config.noiseScale;
    this.uniformsLiquid.fbmOctaves.value = this.config.fbmOctaves;
    this.uniformsLiquid.waveAmp.value = this.config.waveAmp;
    this.uniformsLiquid.waveFreq.value = this.config.waveFreq;
    this.uniformsLiquid.waveRotation.value = this.config.waveRotation;
    this.uniformsLiquid.blueInfluence.value = this.config.blueInfluence;
    this.uniformsLiquid.tealInfluence.value = this.config.tealInfluence;
    this.uniformsLiquid.purpleInfluence.value = this.config.purpleInfluence;
    this.uniformsLiquid.pinkInfluence.value = this.config.pinkInfluence;
    this.uniformsLiquid.color2GroupInfluence.value = this.config.color2GroupInfluence;
    this.uniformsLiquid.whiteGroupInfluence.value = this.config.whiteGroupInfluence;
    this.uniformsLiquid.colorGroupInfluence.value = this.config.colorGroupInfluence;
    this.updateGradientColors();
    
    this.uniformsDither.uCellPx.value = this.config.cellPx;
    this.uniformsDither.uContrast.value = this.config.contrast;
    this.uniformsDither.uGamma.value = this.config.gamma;
    this.uniformsDither.uSoftness.value = this.config.softness;
    this.uniformsDither.uMinR.value = this.config.minR;
    this.uniformsDither.uMaxR.value = this.config.maxR;
    this.uniformsDither.uDotSpacing.value = this.config.dotSpacing;
    this.uniformsDither.uLumThreshold.value = this.config.lumThreshold;
    this.uniformsDither.uInvertDots.value = this.config.invertDots ? 1.0 : 0.0;
    this.uniformsDither.uInvert.value = this.config.invert ? 1.0 : 0.0;
    this.uniformsDither.uBayer.value = this.config.bayer ? 1.0 : 0.0;
    this.uniformsDither.uBayerStrength.value = this.config.bayerStrength;
    
    // Restore layer toggle
    this.layerToggles.glyphDither = this.config.showGlyphDither;
  }
}

// Initialize
function init() {
  try {
    new LiquidGradientEffect();
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
