/**
 * Hero 10 - WebGL Liquid Gradient + Halftone Dither (Pattern Tool)
 */

import * as THREE from 'three';

class LiquidGradientEffect {
  constructor() {
    console.log('Initializing LiquidGradientEffect (Pattern Tool)...');
    this.storageKey = 'hero10-liquid-pattern-tool-settings';
    this.settingsVersion = 2;

    // ===== CONFIGURATION =====
    // Remove any previously saved settings
    if (window && window.localStorage) {
      window.localStorage.removeItem(this.storageKey);
    }
    this.config = {
      "warpAmp": 0.3,
      "sharpness": 10,
      "speed": 0.8,
      "fbmOctaves": 1,
      "noiseScale": 0.5,
      "waveAmp": 0.1,
      "waveFreq": 10,
      "waveRotation": 0,
      "white2Influence": 10,
      "white1RadiusX": 0.6,
      "white1RadiusY": 0.45,
      "blueRadiusX": 0.55,
      "blueRadiusY": 0.5,
      "tealRadiusX": 0.5,
      "tealRadiusY": 0.55,
      "purpleRadiusX": 0.58,
      "purpleRadiusY": 0.48,
      "pinkRadiusX": 0.52,
      "pinkRadiusY": 0.52,
      "white2RadiusX": 0.25,
      "white2RadiusY": 0.25,
      "white3RadiusX": 0.15,
      "white3RadiusY": 0.5,
      "white1ZoneCenterX": -0.43,
      "white1ZoneCenterY": -0.03,
      "white1ZoneHalfWidth": 0.41,
      "white1ZoneHalfHeight": 0.33,
      "white1SpeedMulX": 2.29,
      "white1SpeedMulY": 2.33,
      "white1PhaseX": 1.007,
      "white1PhaseY": 1.217,
      "blueZoneCenterX": 1,
      "blueZoneCenterY": 0,
      "blueZoneHalfWidth": 0.2,
      "blueZoneHalfHeight": 0.56,
        blueZoneCenterX: 1.5,
        blueZoneCenterY: 0.0,
        blueZoneHalfWidth: 0.1,
        blueZoneHalfHeight: 0.56,
      "tealZoneCenterX": 1,
      "tealZoneCenterY": 0,
      "tealZoneHalfWidth": 0.2,
      "tealZoneHalfHeight": 0.58,
        tealZoneCenterX: 1.5,
        tealZoneCenterY: 0.0,
        tealZoneHalfWidth: 0.1,
        tealZoneHalfHeight: 0.58,
      "purpleZoneCenterX": 1,
      "purpleZoneCenterY": 0,
      "purpleZoneHalfWidth": 0.2,
      "purpleZoneHalfHeight": 0.58,
        purpleZoneCenterX: 1.5,
        purpleZoneCenterY: 0.0,
        purpleZoneHalfWidth: 0.1,
        purpleZoneHalfHeight: 0.58,
      "pinkZoneCenterX": 1,
      "pinkZoneCenterY": 0,
      "pinkZoneHalfWidth": 0.2,
      "pinkZoneHalfHeight": 0.59,
        pinkZoneCenterX: 1.5,
        pinkZoneCenterY: 0.0,
        pinkZoneHalfWidth: 0.1,
        pinkZoneHalfHeight: 0.59,
      "blue2ZoneCenterX": -1.5,
      "blue2ZoneCenterY": -0.03,
      "blue2ZoneHalfWidth": 0.12,
      "blue2ZoneHalfHeight": 0.56,
      "blue2SpeedMulX": 1,
      "blue2SpeedMulY": 1,
      "blue2PhaseX": -2.773,
      "blue2PhaseY": 1.407,
      "teal2ZoneCenterX": -1.5,
      "teal2ZoneCenterY": -0.04,
      "teal2ZoneHalfWidth": 0.04,
      "teal2ZoneHalfHeight": 0.58,
      "teal2SpeedMulX": 1,
      "teal2SpeedMulY": 1,
      "teal2PhaseX": 1.147,
      "teal2PhaseY": -0.453,
      "purple2ZoneCenterX": -1.5,
      "purple2ZoneCenterY": -0.05,
      "purple2ZoneHalfWidth": 0.04,
      "purple2ZoneHalfHeight": 0.58,
      "purple2SpeedMulX": 1,
      "purple2SpeedMulY": 1,
      "purple2PhaseX": -5.353,
      "purple2PhaseY": 0.037,
      "pink2ZoneCenterX": -1.5,
      "pink2ZoneCenterY": -0.05,
      "pink2ZoneHalfWidth": 0.02,
      "pink2ZoneHalfHeight": 0.59,
      "pink2SpeedMulX": 1,
      "pink2SpeedMulY": 1,
      "pink2PhaseX": -4.533,
      "pink2PhaseY": -0.433,
      "white2ZoneCenterX": -0.43,
      "white2ZoneCenterY": -0.04,
      "white2ZoneHalfWidth": 0.41,
      "white2ZoneHalfHeight": 0.3,
      "white2SpeedMulX": 2.29,
      "white2SpeedMulY": 2.31,
      "white2PhaseX": 0.817,
      "white2PhaseY": 0.767,
      "white3ZoneCenterX": -0.44,
      "white3ZoneCenterY": -0.04,
      "white3ZoneHalfWidth": 0.42,
      "white3ZoneHalfHeight": 0.34,
      "white3SpeedMulX": 2.28,
      "white3SpeedMulY": 2.22,
      "white3PhaseX": 0.727,
      "white3PhaseY": 0.887,
      "white1Influence": 1,
      "blueInfluence": 1,
      "tealInfluence": 1,
      "purpleInfluence": 1,
      "pinkInfluence": 1,
      "color2GroupInfluence": 0.15,
      "whiteGroupInfluence": 4,
      "colorGroupInfluence": 0.05,
      "colorWhite": {
        "r": 1,
        "g": 1,
        "b": 1
      },
      "colorBlue": {
        "r": 0.196,
        "g": 0.392,
        "b": 1
      },
      "colorTeal": {
        "r": 0.196,
        "g": 0.863,
        "b": 0.784
      },
      "colorPurple": {
        "r": 0.588,
        "g": 0.314,
        "b": 1
      },
      "colorPink": {
        "r": 0.9686274509803922,
        "g": 0.34901960784313724,
        "b": 0.6705882352941176
      },
      "inputSaturation": 1.5,
      "inputBrightness": 1.01,
      "defaultImagePath": "./images/gradient.png",
      "imageFitContain": true,
      "inputWhiteThreshold": 0.98,
      "inputWhiteFeather": 0.135,
      "inputWhiteSatMax": 0.3,
      "gradientSaturation": 1.75,
      "gradientBrightness": 1.5,
      "cellPx": 10,
      "contrast": 1.1,
      "gamma": 1.2,
      "minR": 0.01,
      "maxR": 0.7,
      "dotSpacing": -0.1,
      "lumThreshold": 0,
      "invertDots": true,
      "invert": false,
        "bgColor": { "r": 0.741, "g": 0.741, "b": 0.741 },
        "bgAlpha": 0.0,
      "showGlyphDither": true,
      "showMotionGuides": false
    };
    if (this.config.gradientSaturation === undefined) {
      this.config.gradientSaturation = 1.0;
    }
    if (this.config.gradientBrightness === undefined) {
      this.config.gradientBrightness = 1.0;
    }
    if (this.config.inputSaturation === undefined) {
      this.config.inputSaturation = 1.0;
    }
    if (this.config.inputBrightness === undefined) {
      this.config.inputBrightness = 1.0;
    }
    if (this.config.defaultImagePath === undefined) {
      this.config.defaultImagePath = './images/gradient.png';
    }
    if (this.config.imageFitContain === undefined) {
      this.config.imageFitContain = true;
    }
    if (this.config.inputWhiteThreshold === undefined) {
      this.config.inputWhiteThreshold = 0.98;
    }
    if (this.config.inputWhiteFeather === undefined) {
      this.config.inputWhiteFeather = 0.06;
    }
    if (this.config.inputWhiteSatMax === undefined) {
      this.config.inputWhiteSatMax = 0.12;
    }
    if (this.config.showMotionGuides === undefined) {
      this.config.showMotionGuides = false;
    }
    if (this.config.blueInfluence === undefined) this.config.blueInfluence = 1.0;
    if (this.config.tealInfluence === undefined) this.config.tealInfluence = 1.0;
    if (this.config.purpleInfluence === undefined) this.config.purpleInfluence = 1.0;
    if (this.config.pinkInfluence === undefined) this.config.pinkInfluence = 1.0;
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

    this.container = document.getElementById('webgl-background-pattern-tool');
    this.guiContainer = document.getElementById('pattern-tool-gui');
    if (!this.container) {
      console.error('Container #webgl-background-pattern-tool not found!');
      return;
    }

    this.sceneLiquid = new THREE.Scene();
    this.sceneDither = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      preserveDrawingBuffer: true
    });

    const initialSize = this.getContainerSize();
    this.renderer.setSize(initialSize.w, initialSize.h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    this.createMotionGuideOverlay();

    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTargetLiquid = new THREE.WebGLRenderTarget(
      Math.floor(initialSize.w * dpr),
      Math.floor(initialSize.h * dpr),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    this.fallbackTexture = new THREE.DataTexture(
      new Uint8Array([255, 255, 255, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    this.fallbackTexture.needsUpdate = true;
    this.uploadedTexture = null;
    this.uploadedImageAspect = 1;

    // Uniforms for liquid gradient shader
    this.uniformsLiquid = {
      uRes: { value: new THREE.Vector2(initialSize.w * dpr, initialSize.h * dpr) },
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
      uImage: { value: this.fallbackTexture },
      uImageScale: { value: new THREE.Vector2(1, 1) },
      uImageOffset: { value: new THREE.Vector2(0, 0) },
      uFitContain: { value: this.config.imageFitContain ? 1.0 : 0.0 },
      uHasImage: { value: 0.0 },
      uInputSaturation: { value: this.config.inputSaturation },
      uInputBrightness: { value: this.config.inputBrightness },
      uInputWhiteThreshold: { value: this.config.inputWhiteThreshold },
      uInputWhiteFeather: { value: this.config.inputWhiteFeather },
      uInputWhiteSatMax: { value: this.config.inputWhiteSatMax },
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
      uResolution: { value: new THREE.Vector2(initialSize.w * dpr, initialSize.h * dpr) },
      uCellPx: { value: this.config.cellPx },
      uDpr: { value: dpr },
      uContrast: { value: this.config.contrast },
      uGamma: { value: this.config.gamma },
      uMinR: { value: this.config.minR },
      uMaxR: { value: this.config.maxR },
      uDotSpacing: { value: this.config.dotSpacing },
      uLumThreshold: { value: this.config.lumThreshold },
      uInvertDots: { value: this.config.invertDots ? 1.0 : 0.0 },
      uInvert: { value: this.config.invert ? 1.0 : 0.0 },
      uBgColor: { value: new THREE.Vector3(this.config.bgColor.r, this.config.bgColor.g, this.config.bgColor.b) },
      uBgAlpha: { value: this.config.bgAlpha }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Image pass shader: uploaded image becomes the source for dither
    const fragmentShaderLiquid = `
      precision highp float;

      varying vec2 vUv;
      uniform sampler2D uImage;
      uniform vec2 uImageScale;
      uniform vec2 uImageOffset;
      uniform float uFitContain;
      uniform float uHasImage;
      uniform float uInputSaturation;
      uniform float uInputBrightness;
      uniform float uInputWhiteThreshold;
      uniform float uInputWhiteFeather;
      uniform float uInputWhiteSatMax;

      void main() {
        vec2 rectMin = 0.5 - 0.5 * uImageScale + uImageOffset;
        vec2 uv = (vUv - rectMin) / uImageScale;
        vec3 color = vec3(1.0);

        bool inRect = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;

        // Contain mode: keep full image visible with white bars around.
        // Cover mode: fill viewport and crop overflow.
        if (uHasImage > 0.5 && (inRect || uFitContain < 0.5)) {
          vec2 sampleUv = uv;
          if (uFitContain < 0.5) {
            sampleUv = clamp(sampleUv, 0.0, 1.0);
          }
          vec4 tex = texture2D(uImage, sampleUv);
          color = mix(vec3(1.0), tex.rgb, tex.a);

          // For non-transparent assets (e.g. JPG/PNG with white bg),
          // fade near-white pixels to white as if they were transparent.
          float lumaTex = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
          float maxC = max(tex.r, max(tex.g, tex.b));
          float minC = min(tex.r, min(tex.g, tex.b));
          float sat = maxC - minC;
          float whiteByLuma = smoothstep(
            uInputWhiteThreshold - uInputWhiteFeather,
            uInputWhiteThreshold + uInputWhiteFeather,
            lumaTex
          );
          float lowSatMask = 1.0 - smoothstep(uInputWhiteSatMax, uInputWhiteSatMax + 0.05, sat);
          float bgMask = whiteByLuma * lowSatMask;
          color = mix(color, vec3(1.0), bgMask);
        }

        float luma = dot(color, vec3(0.299, 0.587, 0.114));
        color = vec3(luma) + (color - vec3(luma)) * uInputSaturation;
        color *= uInputBrightness;
        color = clamp(color, 0.0, 1.0);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Halftone dither shader – pure circles
    const fragmentShaderDither = `
      precision highp float;
      uniform sampler2D uSource;
      uniform vec2 uResolution;
      uniform float uCellPx;
      uniform float uDpr;
      uniform float uContrast;
      uniform float uGamma;
      uniform float uMinR;
      uniform float uMaxR;
      uniform float uDotSpacing;
      uniform float uLumThreshold;
      uniform float uInvertDots;
      uniform float uInvert;
      uniform vec3 uBgColor;
      uniform float uBgAlpha;

      void main() {
        // Cell size in PHYSICAL pixels (gl_FragCoord is in physical/device pixels)
        float cellPx = uCellPx * uDpr;

        // Cell grid
        vec2 cellCoord   = (gl_FragCoord.xy - 0.5) / cellPx;
        vec2 cellCenter  = floor(cellCoord) + 0.5;
        vec2 local       = fract(cellCoord) - 0.5; // [-0.5, 0.5], circle fits in [0, 0.5]
        float dist       = length(local);           // 0 = cell centre, 0.5 = inscribed circle edge

        // Sample source at the centre of this cell
        vec2 cellCenterUV = clamp((cellCenter * cellPx + 0.5) / uResolution, 0.0, 1.0);
        vec3 cellColor    = texture2D(uSource, cellCenterUV).rgb;

        // Luminance -> tone curve
        float lum = dot(cellColor, vec3(0.299, 0.587, 0.114));
        lum = pow(clamp(lum, 0.0, 1.0), max(0.001, uGamma));
        lum = clamp((lum - 0.5) * uContrast + 0.5, 0.0, 1.0);

        // Radius in cell-units (0 = invisible, 0.5 = fills cell)
        float t      = uInvertDots > 0.5 ? (1.0 - lum) : lum;
        float radius = clamp(mix(uMinR, uMaxR, t) - uDotSpacing, 0.0, 0.499);

        // Smooth circle edge: 1 physical pixel wide so it looks round, not jagged
        float edge  = 1.0 / cellPx;
        float alpha = 1.0 - smoothstep(radius - edge, radius + edge, dist);
        if (uInvert > 0.5) alpha = 1.0 - alpha;

        vec3 finalColor  = mix(uBgColor, cellColor, alpha);
        float finalAlpha = mix(uBgAlpha, 1.0, alpha);
        gl_FragColor = vec4(finalColor, finalAlpha);
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
    this.loadDefaultImage();
    this.updateImageFit();
    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  getContainerSize() {
    const w = Math.max(1, this.container?.clientWidth || window.innerWidth);
    const h = Math.max(1, this.container?.clientHeight || window.innerHeight);
    return { w, h };
  }

  onWindowResize() {
    const { w, h } = this.getContainerSize();
    this.renderer.setSize(w, h);
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTargetLiquid.setSize(Math.floor(w * dpr), Math.floor(h * dpr));
    this.uniformsLiquid.uRes.value.set(w * dpr, h * dpr);
    this.uniformsDither.uResolution.value.set(w * dpr, h * dpr);
    this.uniformsDither.uDpr.value = dpr;
    if (this.guideCanvas) {
      this.guideCanvas.width = w;
      this.guideCanvas.height = h;
    }
    this.updateImageFit();
  }

  loadUploadedImage(file) {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const loader = new THREE.TextureLoader();

    loader.load(
      objectUrl,
      (texture) => {
        this.applyImageTexture(texture);
        URL.revokeObjectURL(objectUrl);
      },
      undefined,
      () => {
        URL.revokeObjectURL(objectUrl);
        console.error('Failed to load uploaded image');
      }
    );
  }

  loadDefaultImage() {
    const loader = new THREE.TextureLoader();
    const defaultUrl = new URL(this.config.defaultImagePath, import.meta.url).href;

    loader.load(
      defaultUrl,
      (texture) => {
        this.applyImageTexture(texture);
      },
      undefined,
      () => {
        console.error('Failed to load default image:', defaultUrl);
      }
    );
  }

  applyImageTexture(texture) {
    if (this.uploadedTexture) {
      this.uploadedTexture.dispose();
    }

    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.encoding = THREE.sRGBEncoding;

    this.uploadedTexture = texture;
    this.uploadedImageAspect = texture.image && texture.image.height
      ? texture.image.width / texture.image.height
      : 1;
    this.uploadedImageNativeWidth  = texture.image ? texture.image.width  : null;
    this.uploadedImageNativeHeight = texture.image ? texture.image.height : null;

    this.uniformsLiquid.uImage.value = texture;
    this.uniformsLiquid.uHasImage.value = 1.0;
    this.updateImageFit();
  }

  updateImageFit() {
    const { w, h } = this.getContainerSize();
    const viewportAspect = w / Math.max(h, 1);
    const imageAspect = this.uploadedImageAspect || 1;

    let scaleX = 1;
    let scaleY = 1;

    if (this.config.imageFitContain) {
      // Contain: full image visible, no crop.
      if (imageAspect > viewportAspect) {
        scaleX = 1;
        scaleY = viewportAspect / imageAspect;
      } else {
        scaleX = imageAspect / viewportAspect;
        scaleY = 1;
      }
    } else {
      // Cover: fill viewport, crop overflow.
      if (imageAspect > viewportAspect) {
        scaleX = imageAspect / viewportAspect;
        scaleY = 1;
      } else {
        scaleX = 1;
        scaleY = viewportAspect / imageAspect;
      }
    }

    this.uniformsLiquid.uImageScale.value.set(scaleX, scaleY);
    this.uniformsLiquid.uImageOffset.value.set(0, 0);
    this.uniformsLiquid.uFitContain.value = this.config.imageFitContain ? 1.0 : 0.0;
  }

  createMotionGuideOverlay() {
    this.guideCanvas = document.createElement('canvas');
    const { w, h } = this.getContainerSize();
    this.guideCanvas.width = w;
    this.guideCanvas.height = h;
    this.guideCanvas.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    `;
    this.container.appendChild(this.guideCanvas);
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
        position: relative;
        background: rgba(255,255,255,0.95); padding: 16px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: system-ui, sans-serif;
        font-size: 13px; width: 100%; max-height: calc(100vh - 32px); overflow-y: auto; box-sizing: border-box;
      `;
    panel.style.display = 'block';

    const imageSection = document.createElement('div');
    imageSection.style.cssText = 'padding: 10px; margin-bottom: 10px; border: 1px solid #eee; border-radius: 6px;';

    const imageLabel = document.createElement('div');
    imageLabel.textContent = 'Source Image (for Dither Input)';
    imageLabel.style.cssText = 'font-weight: 600; margin-bottom: 6px; font-size: 12px;';

    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.style.width = '100%';
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) this.loadUploadedImage(file);
    });

    imageSection.appendChild(imageLabel);
    imageSection.appendChild(imageInput);
    panel.appendChild(imageSection);

    // Helper functions for UI

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

    const makeCheckbox = (checked, onChange) => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = checked;
      input.addEventListener('change', () => onChange(input.checked));
      return input;
    };

    const inputLayerSection = document.createElement('div');
    inputLayerSection.style.cssText = 'padding: 10px; margin-bottom: 10px; border: 1px solid #eee; border-radius: 6px;';

    const inputLayerTitle = document.createElement('div');
    inputLayerTitle.textContent = 'Input Layer';
    inputLayerTitle.style.cssText = 'font-weight: 600; margin-bottom: 8px; font-size: 12px;';
    inputLayerSection.appendChild(inputLayerTitle);

    const inputSaturationLabel = makeLabel('Input Saturation');
    inputSaturationLabel.appendChild(makeRange(0.0, 2.0, 0.01, this.config.inputSaturation, (v) => {
      this.config.inputSaturation = v;
      this.uniformsLiquid.uInputSaturation.value = v;
    }));

    const inputBrightnessLabel = makeLabel('Input Brightness');
    inputBrightnessLabel.appendChild(makeRange(0.0, 2.0, 0.01, this.config.inputBrightness, (v) => {
      this.config.inputBrightness = v;
      this.uniformsLiquid.uInputBrightness.value = v;
    }));

    const fitContainLabel = makeLabel('Contain (no crop)');
    fitContainLabel.appendChild(makeCheckbox(this.config.imageFitContain, (v) => {
      this.config.imageFitContain = v;
      this.updateImageFit();
    }));

    const inputWhiteThresholdLabel = makeLabel('White BG Threshold');
    inputWhiteThresholdLabel.appendChild(makeRange(0.85, 1.0, 0.005, this.config.inputWhiteThreshold, (v) => {
      this.config.inputWhiteThreshold = v;
      this.uniformsLiquid.uInputWhiteThreshold.value = v;
    }));

    const inputWhiteFeatherLabel = makeLabel('White BG Feather');
    inputWhiteFeatherLabel.appendChild(makeRange(0.0, 0.2, 0.005, this.config.inputWhiteFeather, (v) => {
      this.config.inputWhiteFeather = v;
      this.uniformsLiquid.uInputWhiteFeather.value = v;
    }));

    const inputWhiteSatMaxLabel = makeLabel('White BG Saturation Max');
    inputWhiteSatMaxLabel.appendChild(makeRange(0.0, 0.3, 0.005, this.config.inputWhiteSatMax, (v) => {
      this.config.inputWhiteSatMax = v;
      this.uniformsLiquid.uInputWhiteSatMax.value = v;
    }));

    inputLayerSection.appendChild(inputSaturationLabel);
    inputLayerSection.appendChild(inputBrightnessLabel);
    inputLayerSection.appendChild(fitContainLabel);
    inputLayerSection.appendChild(inputWhiteThresholdLabel);
    inputLayerSection.appendChild(inputWhiteFeatherLabel);
    inputLayerSection.appendChild(inputWhiteSatMaxLabel);
    panel.appendChild(inputLayerSection);
    const glyphSection = document.createElement('div');
    glyphSection.style.cssText = 'padding: 10px; margin-bottom: 10px; border: 1px solid #eee; border-radius: 6px;';

    const glyphTitle = document.createElement('div');
    glyphTitle.textContent = 'Glyph Dither';
    glyphTitle.style.cssText = 'font-weight: 600; margin-bottom: 8px; font-size: 12px;';
    glyphSection.appendChild(glyphTitle);

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

    const minRLabel = makeLabel('Min Radius');
    minRLabel.appendChild(makeRange(0.0, 0.5, 0.01, this.config.minR, (v) => {
      this.uniformsDither.uMinR.value = v;
    }));

    const maxRLabel = makeLabel('Max Radius');
    maxRLabel.appendChild(makeRange(0.0, 0.7, 0.01, this.config.maxR, (v) => {
      this.uniformsDither.uMaxR.value = v;
    }));

    const dotSpacingLabel = makeLabel('Dot Spacing (+gap / -overlap)');
    dotSpacingLabel.appendChild(makeRange(-0.3, 0.3, 0.01, this.config.dotSpacing, (v) => {
      this.uniformsDither.uDotSpacing.value = v;
    }));

    const lumThresholdLabel = makeLabel('Lum Threshold');
    lumThresholdLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.lumThreshold, (v) => {
      this.config.lumThreshold = v;
      this.uniformsDither.uLumThreshold.value = v;
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

    // Background color helpers
    const toHex = (r, g, b) =>
      '#' + [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
    const fromHex = (hex) => ({
      r: parseInt(hex.slice(1, 3), 16) / 255,
      g: parseInt(hex.slice(3, 5), 16) / 255,
      b: parseInt(hex.slice(5, 7), 16) / 255
    });

    const bgColorLabel = makeLabel('Background Color');
    const bgColorPicker = document.createElement('input');
    bgColorPicker.type = 'color';
    bgColorPicker.value = toHex(this.config.bgColor.r, this.config.bgColor.g, this.config.bgColor.b);
    bgColorPicker.style.cssText = 'width: 100%; height: 32px; padding: 2px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; box-sizing: border-box;';
    bgColorPicker.addEventListener('input', () => {
      const c = fromHex(bgColorPicker.value);
      this.config.bgColor = c;
      this.uniformsDither.uBgColor.value.set(c.r, c.g, c.b);
    });
    bgColorLabel.appendChild(bgColorPicker);

    const bgAlphaLabel = makeLabel('Background Opacity');
    bgAlphaLabel.appendChild(makeRange(0.0, 1.0, 0.01, this.config.bgAlpha, (v) => {
      this.config.bgAlpha = v;
      this.uniformsDither.uBgAlpha.value = v;
    }));

    glyphSection.appendChild(bgColorLabel);
    glyphSection.appendChild(bgAlphaLabel);
    glyphSection.appendChild(ditherToggleLabel);
    glyphSection.appendChild(cellLabel);
    glyphSection.appendChild(contrastLabel);
    glyphSection.appendChild(gammaLabel);
    glyphSection.appendChild(minRLabel);
    glyphSection.appendChild(maxRLabel);
    glyphSection.appendChild(dotSpacingLabel);
    glyphSection.appendChild(lumThresholdLabel);
    glyphSection.appendChild(invertLabel);
    panel.appendChild(glyphSection);

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

    const downloadOutputButton = document.createElement('button');
    downloadOutputButton.textContent = 'Download Output PNG';
    downloadOutputButton.style.cssText = 'padding: 10px; background: #8E44AD; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
    downloadOutputButton.onmouseover = () => downloadOutputButton.style.background = '#7D3C98';
    downloadOutputButton.onmouseout = () => downloadOutputButton.style.background = '#8E44AD';
    downloadOutputButton.onclick = () => this.downloadOutput();
    
    buttonsDiv.appendChild(saveButton);
    buttonsDiv.appendChild(downloadButton);
    buttonsDiv.appendChild(downloadOutputButton);
    panel.appendChild(buttonsDiv);

    const mount = this.guiContainer || document.body;
    mount.appendChild(panel);
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
    // Always boot Hero 10 from in-code defaults; ignore persisted localStorage.
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
      a.download = `hero10-liquid-pattern-tool-settings-${Date.now()}.json`;
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

  downloadOutput() {
    const btn = event.target;
    try {
      // Use native input image size; fall back to current viewport
      const imgW = this.uploadedImageNativeWidth  || this.getContainerSize().w;
      const imgH = this.uploadedImageNativeHeight || this.getContainerSize().h;

      // Off-screen render targets at native image resolution
      const rtLiquid = new THREE.WebGLRenderTarget(imgW, imgH, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });
      const rtDither = new THREE.WebGLRenderTarget(imgW, imgH, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });

      // Stash uniforms we temporarily override
      const prevLiqRes  = this.uniformsLiquid.uRes.value.clone();
      const prevScale   = this.uniformsLiquid.uImageScale.value.clone();
      const prevOffset  = this.uniformsLiquid.uImageOffset.value.clone();
      const prevFit     = this.uniformsLiquid.uFitContain.value;
      const prevRes     = this.uniformsDither.uResolution.value.clone();
      const prevDpr     = this.uniformsDither.uDpr.value;
      const prevSource  = this.uniformsDither.uSource.value;

      // Override for native-res render
      // Image fills the output 1:1 (no letterbox bars)
      this.uniformsLiquid.uRes.value.set(imgW, imgH);
      this.uniformsLiquid.uImageScale.value.set(1, 1);
      this.uniformsLiquid.uImageOffset.value.set(0, 0);
      this.uniformsLiquid.uFitContain.value = 1.0;
      this.uniformsDither.uResolution.value.set(imgW, imgH);
      this.uniformsDither.uDpr.value = 1.0;  // render target has no screen DPR
      this.uniformsDither.uSource.value = rtLiquid.texture;

      // Liquid pass → rtLiquid
      this.renderer.setRenderTarget(rtLiquid);
      this.renderer.render(this.sceneLiquid, this.camera);

      // Dither pass → rtDither
      this.renderer.setRenderTarget(rtDither);
      this.renderer.render(this.sceneDither, this.camera);

      // Read raw pixels (WebGL returns rows bottom-up)
      const pixels = new Uint8Array(imgW * imgH * 4);
      this.renderer.readRenderTargetPixels(rtDither, 0, 0, imgW, imgH, pixels);

      // Restore everything
      this.renderer.setRenderTarget(null);
      this.uniformsLiquid.uRes.value.copy(prevLiqRes);
      this.uniformsLiquid.uImageScale.value.copy(prevScale);
      this.uniformsLiquid.uImageOffset.value.copy(prevOffset);
      this.uniformsLiquid.uFitContain.value = prevFit;
      this.uniformsDither.uResolution.value.copy(prevRes);
      this.uniformsDither.uDpr.value = prevDpr;
      this.uniformsDither.uSource.value = prevSource;
      rtLiquid.dispose();
      rtDither.dispose();

      // Flip rows (WebGL origin is bottom-left, canvas is top-left)
      const canvas = document.createElement('canvas');
      canvas.width  = imgW;
      canvas.height = imgH;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(imgW, imgH);
      for (let row = 0; row < imgH; row++) {
        const srcRow = imgH - 1 - row;
        imageData.data.set(
          pixels.subarray(srcRow * imgW * 4, (srcRow + 1) * imgW * 4),
          row * imgW * 4
        );
      }
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pattern-tool-output-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        const orig = btn.textContent;
        btn.textContent = 'Downloaded!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      }, 'image/png');

      console.log(`Output downloaded at ${imgW}×${imgH} (native image size)`);
    } catch (error) {
      console.error('Failed to download output image:', error);
      alert('Failed to download output image: ' + error.message);
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
    this.uniformsLiquid.uInputSaturation.value = this.config.inputSaturation;
    this.uniformsLiquid.uInputBrightness.value = this.config.inputBrightness;
    this.uniformsLiquid.uFitContain.value = this.config.imageFitContain ? 1.0 : 0.0;
    this.uniformsLiquid.uInputWhiteThreshold.value = this.config.inputWhiteThreshold;
    this.uniformsLiquid.uInputWhiteFeather.value = this.config.inputWhiteFeather;
    this.uniformsLiquid.uInputWhiteSatMax.value = this.config.inputWhiteSatMax;
    this.updateGradientColors();
    
    this.uniformsDither.uCellPx.value = this.config.cellPx;
    this.uniformsDither.uContrast.value = this.config.contrast;
    this.uniformsDither.uGamma.value = this.config.gamma;
    this.uniformsDither.uMinR.value = this.config.minR;
    this.uniformsDither.uMaxR.value = this.config.maxR;
    this.uniformsDither.uDotSpacing.value = this.config.dotSpacing;
    this.uniformsDither.uLumThreshold.value = this.config.lumThreshold;
    this.uniformsDither.uInvertDots.value = this.config.invertDots ? 1.0 : 0.0;
    this.uniformsDither.uInvert.value = this.config.invert ? 1.0 : 0.0;
    this.uniformsDither.uBgColor.value.set(this.config.bgColor.r, this.config.bgColor.g, this.config.bgColor.b);
    this.uniformsDither.uBgAlpha.value = this.config.bgAlpha;
    
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
