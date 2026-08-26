// Dumps every shader uniform a background script ends up with, headlessly.
//
// The backgrounds are ~1000 lines of WebGL each and nothing about them is
// checkable by reading a diff, so refactors there are verified by running the
// class against a THREE/DOM stub and diffing this dump before and after. Real
// math where the values matter (Vector2/3, MathUtils.clamp); inert stubs
// everywhere else.
//
//   node scripts/probe-background-uniforms.mjs public/js/backgrounds/x.js <containerId>
//
// Output is deterministic: uTime advances exactly one 0.016 step because the
// stubbed requestAnimationFrame never schedules a second frame.
//
// Worth knowing what this catches: the uniforms are built from raw config
// values, then updateGradientColors() overwrites c0-c4 with saturation- and
// brightness-adjusted ones. Anything that drops that second pass leaves the
// gradient washed out, and the diff here is the only place it shows up.

import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { dirname, basename, resolve } from 'path';
import { pathToFileURL } from 'url';

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
}

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
}

const THREE = {
    Vector2,
    Vector3,
    MathUtils: { clamp: (v, a, b) => Math.max(a, Math.min(b, v)) },
    Scene: class {
        add() {}
    },
    OrthographicCamera: class {
        constructor() {
            this.position = new Vector3();
        }
    },
    PlaneGeometry: class {},
    Mesh: class {},
    ShaderMaterial: class {
        constructor(o) {
            Object.assign(this, o || {});
        }
    },
    WebGLRenderTarget: class {
        constructor() {
            this.texture = {};
        }
    },
    WebGLRenderer: class {
        constructor() {
            this.domElement = { style: {} };
        }
        setSize() {}
        setPixelRatio() {}
        setRenderTarget() {}
        render() {}
        setClearColor() {}
        getContext() {
            return {};
        }
    },
    DataTexture: class {},
    TextureLoader: class {
        load() {
            return {};
        }
    },
    LinearFilter: 1,
    RGBAFormat: 2,
    ClampToEdgeWrapping: 3,
    NearestFilter: 4,
    SRGBColorSpace: 5,
    LinearSRGBColorSpace: 6,
};

// Any 2D canvas call is a no-op that keeps returning itself, so motion-guide
// drawing runs to completion without a real canvas behind it.
const ctx2d = new Proxy(
    {},
    {
        get: (t, k) => (k in t ? t[k] : (t[k] = () => ctx2d)),
        set: (t, k, v) => ((t[k] = v), true),
    }
);

const mkEl = () => ({
    style: {},
    clientWidth: 1440,
    clientHeight: 900,
    offsetWidth: 1440,
    offsetHeight: 900,
    dataset: {},
    appendChild() {},
    removeChild() {},
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getBoundingClientRect: () => ({ width: 1440, height: 900, top: 0, left: 0 }),
    querySelector: () => null,
    querySelectorAll: () => [],
    classList: { add() {}, remove() {}, toggle() {} },
    getContext: () => ctx2d,
});

globalThis.THREE = THREE;
// 'loading' keeps the file's own init() on the DOMContentLoaded path so it
// never self-instantiates — this script picks the container id instead.
globalThis.document = {
    readyState: 'loading',
    addEventListener() {},
    createElement: () => mkEl(),
    getElementById: () => mkEl(),
    querySelector: () => mkEl(),
    querySelectorAll: () => [],
    body: mkEl(),
    documentElement: mkEl(),
};
globalThis.window = {
    addEventListener() {},
    devicePixelRatio: 1,
    innerWidth: 1440,
    innerHeight: 900,
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
};
globalThis.requestAnimationFrame = () => 0;
globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
};

const [file, containerId, variant] = process.argv.slice(2);
if (!file || !containerId) {
    console.error(
        'Usage: node scripts/probe-background-uniforms.mjs <background-file> <containerId> [variant]'
    );
    process.exit(1);
}

// The bare `three` specifier can't resolve here, and THREE is on globalThis.
const src =
    readFileSync(file, 'utf8').replace(/^import \* as THREE from 'three';$/m, '') +
    '\nexport { LiquidGradientEffect };\n';
// Written next to the original, not in a temp dir: the backgrounds now import
// ./liquid-shaders.js relatively, and that only resolves from this directory.
const probePath = `${dirname(file)}/.${basename(file)}.probe.mjs`;
writeFileSync(probePath, src);

let LiquidGradientEffect, VARIANTS;
try {
    ({ LiquidGradientEffect, VARIANTS } = await import(pathToFileURL(resolve(probePath)).href));
} finally {
    unlinkSync(probePath);
}

// A merged background picks its config from VARIANTS by container attribute at
// runtime; there is no DOM here, so the variant is named on the command line.
let overrides = {};
if (variant) {
    if (!VARIANTS || !(variant in VARIANTS)) {
        console.error(`Unknown variant "${variant}". Known: ${Object.keys(VARIANTS || {}).join(', ') || '(none exported)'}`);
        process.exit(1);
    }
    overrides = VARIANTS[variant];
}
const inst = new LiquidGradientEffect(containerId, overrides);

const plain = (uniforms) =>
    Object.fromEntries(
        Object.entries(uniforms).map(([k, u]) => {
            const v = u && u.value;
            if (v && typeof v === 'object') {
                return 'x' in v ? [k, [v.x, v.y, v.z].filter((n) => n !== undefined)] : [k, '<obj>'];
            }
            return [k, v];
        })
    );

console.log(
    JSON.stringify(
        {
            liquid: plain(inst.uniformsLiquid),
            dither: plain(inst.uniformsDither),
            layerToggles: inst.layerToggles,
        },
        null,
        1
    )
);
