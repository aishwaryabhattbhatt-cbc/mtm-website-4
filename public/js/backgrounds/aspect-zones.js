/**
 * Re-anchors the gradient's colour blobs to the current aspect ratio.
 *
 * Blob X positions live in the shader's coordinate space, where the horizontal
 * span runs from -aspect/2 to +aspect/2. Every config here was tuned at an
 * aspect of 1.6, so the half-span they assume is 0.8.
 *
 * That matters because these backgrounds deliberately park colour just outside
 * the right edge — blueZoneCenterX sits at 1.5 on most of them — so it bleeds
 * inward and leaves the middle white. At 1.6 that blob is 0.7 past the edge.
 * On a phone the half-span collapses to about 0.23 and the same blob is six
 * half-spans out instead of just under two: nothing bleeds in and the gradient
 * disappears entirely.
 *
 * Scaling every position by aspect/1.6 keeps the composition proportional. A
 * blob 1.875 half-spans past the edge stays 1.875 half-spans past it at any
 * width, so the arrangement survives instead of drifting off-screen.

 */

const REF_ASPECT = 1.6;
const BLOBS = ['white1', 'blue', 'teal', 'purple', 'pink', 'white2', 'white3'];

// Keyed by the config object so the pristine values are captured once, before
// anything rewrites them. Without this a second call would read its own output
// and the positions would compound toward zero.
const pristine = new WeakMap();

/**
 * Every blob scales, which makes the result independent of container height:
 * a blob ends up at the same offset in half-spans whatever the aspect, so the
 * five pages sharing this background compose identically even though their
 * heroes are different heights (register 390x975, sign-in 390x783, about-us
 * 390x620 on the same phone).
 *
 * @param {object} config  the effect's config; mutated in place
 * @param {number} aspect  container width / height, matching what uRes is
 *                         built from — the shader derives its own aspect from
 *                         uRes, so any other source disagrees with it
 */
export function rescaleZonesForAspect(config, aspect) {
    if (!pristine.has(config)) {
        pristine.set(
            config,
            BLOBS.map((key) => [
                key,
                {
                    centerX: config[`${key}ZoneCenterX`],
                    halfWidth: config[`${key}ZoneHalfWidth`],
                },
            ])
        );
    }

    // Exactly 1 at or above the reference, so every normal desktop multiplies
    // the authored values by one and gets them back bit-for-bit. Scaling the
    // originals rather than round-tripping them through a half-span matters:
    // x / 0.8 * 0.8 is not always x in floating point.
    const scale = Math.min(aspect, REF_ASPECT) / REF_ASPECT;

    for (const [key, original] of pristine.get(config)) {
        config[`${key}ZoneCenterX`] = original.centerX * scale;
        config[`${key}ZoneHalfWidth`] = original.halfWidth * scale;
    }
}
