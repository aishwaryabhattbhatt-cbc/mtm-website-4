// Self-check for public/js/backgrounds/aspect-zones.js
//   node scripts/test-aspect-zones.mjs
//
// The rescale is invisible on every desktop — it is an identity at or above the
// reference aspect — so a broken version would look completely fine until
// someone opened the site on a phone. These asserts are what actually catches
// it.

import assert from 'node:assert/strict';
import { rescaleZonesForAspect } from '../public/js/backgrounds/aspect-zones.js';

const BLOBS = ['white1', 'blue', 'teal', 'purple', 'pink', 'white2', 'white3'];

// Mirrors the shape the backgrounds actually carry: colour blobs parked just
// outside the right edge, which is what disappears on a narrow screen.
const makeConfig = () =>
    Object.fromEntries(
        BLOBS.flatMap((k) => [
            [`${k}ZoneCenterX`, k === 'white1' ? -0.43 : 1.5],
            [`${k}ZoneHalfWidth`, 0.1],
        ])
    );

let checks = 0;
const check = (name, fn) => {
    fn();
    checks++;
    console.log(`  ok  ${name}`);
};

check('identity at the reference aspect', () => {
    const c = makeConfig();
    const before = { ...c };
    rescaleZonesForAspect(c, 1.6);
    for (const k of Object.keys(before)) {
        assert.equal(c[k], before[k], `${k} changed at aspect 1.6`);
    }
});

check('identity above the reference (every normal desktop)', () => {
    const c = makeConfig();
    const before = { ...c };
    rescaleZonesForAspect(c, 2.143); // the about-us container
    for (const k of Object.keys(before)) {
        assert.equal(c[k], before[k], `${k} changed at aspect 2.143`);
    }
});

check('scales proportionally below the reference', () => {
    const c = makeConfig();
    rescaleZonesForAspect(c, 0.8); // exactly half the reference
    assert.equal(c.blueZoneCenterX, 0.75, 'blue should halve from 1.5');
    assert.equal(c.white1ZoneCenterX, -0.215, 'white1 should halve from -0.43');
    assert.equal(c.blueZoneHalfWidth, 0.05, 'half-width should halve too');
});

check('a parked blob keeps its offset in half-spans', () => {
    // The property that makes this work: 1.5 is 1.875 half-spans out at the
    // reference, and must still be 1.875 half-spans out on a phone.
    const c = makeConfig();
    const phone = 390 / 844;
    rescaleZonesForAspect(c, phone);
    // A ratio of divided values, so compare with a tolerance rather than
    // exactly — the property holds to within floating-point noise.
    const offsetInHalfSpans = c.blueZoneCenterX / (phone / 2);
    assert.ok(
        Math.abs(offsetInHalfSpans - 1.5 / (1.6 / 2)) < 1e-12,
        `expected ~1.875 half-spans, got ${offsetInHalfSpans}`
    );
});

check('repeated calls do not compound', () => {
    const c = makeConfig();
    rescaleZonesForAspect(c, 0.5);
    const once = { ...c };
    rescaleZonesForAspect(c, 0.5);
    rescaleZonesForAspect(c, 0.5);
    for (const k of Object.keys(once)) {
        assert.equal(c[k], once[k], `${k} drifted on repeat calls`);
    }
});

check('narrow then wide restores the originals exactly', () => {
    // Resizing a window down and back up must not leave the gradient shrunk.
    const c = makeConfig();
    const original = { ...c };
    rescaleZonesForAspect(c, 0.46);
    rescaleZonesForAspect(c, 1.756);
    for (const k of Object.keys(original)) {
        assert.equal(c[k], original[k], `${k} not restored after narrow->wide`);
    }
});

check('two configs are tracked independently', () => {
    const a = makeConfig();
    const b = makeConfig();
    rescaleZonesForAspect(a, 0.8);
    rescaleZonesForAspect(b, 1.6);
    assert.equal(a.blueZoneCenterX, 0.75);
    assert.equal(b.blueZoneCenterX, 1.5, 'second config picked up the first one\'s cache');
});

check('composition is independent of container height', () => {
    // register, sign-in and about-us heroes are different heights on the same
    // phone; they must still compose identically.
    const offsets = [390 / 975, 390 / 783, 390 / 620].map((aspect) => {
        const c = makeConfig();
        rescaleZonesForAspect(c, aspect);
        return c.blueZoneCenterX / (aspect / 2); // offset in half-spans
    });
    for (const o of offsets) {
        assert.ok(Math.abs(o - offsets[0]) < 1e-12, `offsets differ: ${offsets}`);
    }
});

console.log(`\n${checks} checks passed`);
