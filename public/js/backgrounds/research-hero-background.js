/**
 * Research Hero Background - WebGL Liquid Gradient + Halftone Dither
 */

import * as THREE from 'three';
import {
    vertexShader,
    fragmentShaderLiquid,
    fragmentShaderDither,
} from './liquid-shaders.js';

class LiquidGradientEffect {
  constructor(containerId = 'webgl-background-10') {
    this.config = {
      "warpAmp": 0.3,
      "sharpness": 6,
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
      "color2GroupInfluence": 2.5,
      "whiteGroupInfluence": 4,
      "colorGroupInfluence": 2.1,
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
      "gradientSaturation": 3,
      "gradientBrightness": 1.5,
      "cellPx": 7 * Math.min(window.devicePixelRatio, 2),
      "contrast": 5,
      "gamma": 3,
      "softness": 0.07,
      "minR": 0.01,
      "maxR": 0.6,
      "dotSpacing": 0.1,
      "lumThreshold": 0,
      "invertDots": true,
      "invert": false,
      "bayer": false,
      "bayerStrength": 0.04,
      "showGlyphDither": true,
      "showMotionGuides": false
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

    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found!`);
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
    
    // Size to the container, not the window — the section can be taller than
    // the viewport (short-screen height floor), and a window-sized canvas
    // leaves the bottom of the section without a background.
    const initW = this.container.clientWidth || window.innerWidth;
    const initH = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(initW, initH);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    this.createMotionGuideOverlay();

    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTargetLiquid = new THREE.WebGLRenderTarget(
      Math.floor(initW * dpr),
      Math.floor(initH * dpr),
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    // Uniforms for liquid gradient shader
    this.uniformsLiquid = {
      uRes: { value: new THREE.Vector2(initW * dpr, initH * dpr) },
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
      uResolution: { value: new THREE.Vector2(initW * dpr, initH * dpr) },
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

    // Liquid gradient fragment shader (from p5.js code)

    // Halftone dither shader (same as hero9)

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

    // Applies saturation/brightness to the gradient colours; the raw
    // config values the uniforms were built with are pre-adjustment.
    this.syncUniformsWithConfig();
    window.addEventListener('resize', () => this.onWindowResize());
    // The container's height can change without a window resize (the section
    // has a min-height floor and grows with content), so track it directly.
    if (typeof ResizeObserver !== 'undefined') {
      this.containerResizeObserver = new ResizeObserver(() => this.onWindowResize());
      this.containerResizeObserver.observe(this.container);
    }
    this._visibilityKey = containerId;
    this.initVisibilityGating();
    this.animate();
  }

  // Skips the per-frame shader render (the expensive part) while the canvas
  // is off-screen, the tab is hidden, or the visitor asked for less motion —
  // otherwise this scene renders at full rate forever, even scrolled away.
  // Also tracks a fine-grained visibility ratio in a page-wide registry: when
  // this canvas overlaps another gated scene in the viewport (e.g. scrolling
  // between the home hero and research sections, which sit ~30px apart),
  // whichever one is less visible throttles its render calls to half rate
  // instead of both competing for the GPU at full rate simultaneously.
  initVisibilityGating() {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = reducedMotionQuery.matches;
    reducedMotionQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      this.updatePausedState();
    });

    this.inViewport = true;
    this.visibleRatio = 1;
    if (typeof IntersectionObserver !== 'undefined') {
      const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
      this.visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.inViewport = entry.isIntersecting;
            this.visibleRatio = entry.intersectionRatio;
          });
          this._updateVisibilityRegistry();
          this.updatePausedState();
        },
        { threshold: thresholds }
      );
      this.visibilityObserver.observe(this.container);
    }

    document.addEventListener('visibilitychange', () => this.updatePausedState());
    this.updatePausedState();
  }

  _updateVisibilityRegistry() {
    if (!window.__mtmCanvasVisibility) window.__mtmCanvasVisibility = {};
    window.__mtmCanvasVisibility[this._visibilityKey] = this.inViewport ? this.visibleRatio : 0;
  }

  // True when another gated canvas is currently more visible than this one —
  // this instance should skip rendering every other frame while that holds.
  _shouldThrottleForOverlap() {
    const registry = window.__mtmCanvasVisibility;
    if (!registry) return false;
    const myRatio = registry[this._visibilityKey] ?? 0;
    const maxOtherRatio = Object.entries(registry)
      .filter(([key]) => key !== this._visibilityKey)
      .reduce((max, [, ratio]) => Math.max(max, ratio), 0);
    return maxOtherRatio > 0 && myRatio < maxOtherRatio;
  }

  updatePausedState() {
    this.isPaused = this.reducedMotion || !this.inViewport || document.hidden;
  }

  onWindowResize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h);
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderTargetLiquid.setSize(Math.floor(w * dpr), Math.floor(h * dpr));
    this.uniformsLiquid.uRes.value.set(w * dpr, h * dpr);
    this.uniformsDither.uResolution.value.set(w * dpr, h * dpr);
    this.uniformsDither.uCellPx.value = 7 * dpr;
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
    if (this.isPaused) return;

    this.uniformsLiquid.uTime.value += 0.016;
    this.updateCenterPositions();

    // Time/position state stays current every frame even when the render
    // below is skipped, so throttling never causes a visible time-jump.
    if (this._shouldThrottleForOverlap()) {
      this._skipToggle = !this._skipToggle;
      if (this._skipToggle) return;
    }

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
  const ids = new Set();
  const variantContainers = document.querySelectorAll('[data-webgl-variant="research"]');

  variantContainers.forEach((el) => {
    if (el.id) ids.add(el.id);
  });

  if (ids.size === 0) {
    ids.add('webgl-background-10');
  }

  ids.forEach((id) => {
    try {
      new LiquidGradientEffect(id);
    } catch (error) {
      console.error(`Failed to initialize container #${id}:`, error);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}