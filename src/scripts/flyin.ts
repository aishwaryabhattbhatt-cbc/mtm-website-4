// Scroll-in entrances, wired once for the whole site.
//
// Every section used to carry its own IntersectionObserver doing the same two
// things: reveal an element when it scrolls into view, or reveal a row of cards
// one after another. That was 70-odd copies of the same fifteen lines. The CSS
// already lives in design-system.css (SCROLL-IN ENTRANCES); this is the other
// half.
//
// A section opts in by marking its root, which lets sections migrate one at a
// time without two observers racing over the same element:
//
//   <section class="..." data-flyin>
//       <h2 class="heading-fly-in">                 reveals itself
//       <div class="content-fly-in">                reveals itself
//       <div class="card-fly-in">                   reveals itself
//       <div class="row" data-flyin-stagger>        reveals its .card-fly-in
//                                                   children 140ms apart
//   </section>
//
// Thresholds default to the values in animation-conventions.md and can be
// overridden per element with data-flyin-threshold="0.4".
//
// Why a stagger container rather than observing each card: cards in a single
// row all cross the viewport edge together, so per-card observers would fire
// simultaneously and the stagger would be lost. Cards stacked vertically want
// the opposite — those are left to reveal themselves.

const STAGGER_STEP_MS = 140;

const DEFAULT_THRESHOLD: Record<string, number> = {
    'heading-fly-in': 0.15,
    'content-fly-in': 0.15,
    'card-fly-in': 0.2,
};

function thresholdFor(el: HTMLElement, fallback: number): number {
    const raw = el.dataset.flyinThreshold;
    if (!raw) return fallback;
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
}

/** Reveal `el` once it has been `threshold` visible, then stop watching it. */
function revealSelf(el: HTMLElement, threshold: number) {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) return;
            el.classList.add('is-visible');
            observer.disconnect();
        },
        { threshold }
    );
    observer.observe(el);
}

/** Reveal a row's cards one after another once the row itself is in view. */
function revealStaggered(row: HTMLElement, threshold: number) {
    const cards = [...row.querySelectorAll<HTMLElement>('.card-fly-in')];
    if (!cards.length) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) return;
            cards.forEach((card, i) => {
                window.setTimeout(() => card.classList.add('is-visible'), i * STAGGER_STEP_MS);
            });
            observer.disconnect();
        },
        { threshold }
    );
    observer.observe(row);
}

function initSection(section: HTMLElement) {
    const staggerRows = [...section.querySelectorAll<HTMLElement>('[data-flyin-stagger]')];
    staggerRows.forEach((row) => revealStaggered(row, thresholdFor(row, 0.2)));

    for (const cls of Object.keys(DEFAULT_THRESHOLD)) {
        section.querySelectorAll<HTMLElement>(`.${cls}`).forEach((el) => {
            // A card inside a stagger row is that row's to reveal, in order.
            if (cls === 'card-fly-in' && staggerRows.some((row) => row.contains(el))) return;
            revealSelf(el, thresholdFor(el, DEFAULT_THRESHOLD[cls]));
        });
    }
}

export function initFlyIns(root: ParentNode = document) {
    root.querySelectorAll<HTMLElement>('[data-flyin]').forEach(initSection);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initFlyIns());
} else {
    initFlyIns();
}
