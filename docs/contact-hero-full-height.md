# Contact hero: match forgot-password's full-screen height

**Status:** not started — captured for later
**Raised:** 2026-08-26

## What to change

The contact page's hero fills only as much height as its form needs. The
forgot-password hero fills the screen. They should match.

The two sections are already near-identical in every other respect — both are
`position: relative`, `width: 100%`, `overflow: clip`, `background:
var(--surface-white)`, `margin-top: var(--navbar-height)`, and a centering
`display: flex; align-items: center; justify-content: center`. The only
difference is the height utility.

**[ForgotPasswordHeroSection.astro:18](../src/components/forgot-password/ForgotPasswordHeroSection.astro#L18)**

```astro
<section class="forgot-password-hero section-height-100">
```

**[ContactFormSection.astro:17](../src/components/contact/ContactFormSection.astro#L17)**

```astro
<section class="contact-form-section" data-contact-form-section>
```

So the change is to add `section-height-100` to the contact section, plus the
matching responsive override described below.

`.section-height-100` is defined in `src/styles/styles.css` and sets both
`height` and `min-height` to `var(--section-height-100)`. Per the CSS
conventions, never hardcode `100vh` — always use this utility.

## The part that is easy to miss

Adding the class alone is not enough. forgot-password also carries a
`max-width: 1023px` override:

```css
@media (max-width: 1023px) {
    .forgot-password-hero {
        height: auto;
        min-height: var(--section-height-100);
        margin-top: 0;
    }
}
```

Two things are happening there:

1. `height: auto` with `min-height` retained lets the section grow past the
   viewport when the form is taller than the screen, instead of clipping it.
   With `overflow: clip` on the section, a fixed `height` would cut the form
   off on short screens.
2. `margin-top: 0` removes the navbar offset, because the navbar collapses from
   80px to 70px at 1023px and stops being fixed. This matches the project-wide
   hero rule in CLAUDE.md.

Contact currently has **no** `margin-top: 0` reset at 1023px, so that needs
checking as part of the same change — it may already be a latent spacing bug
independent of the height work.

## Padding difference to resolve

The two sections do not use the same vertical padding:

| Section | Padding |
| --- | --- |
| forgot-password | `var(--section-pad-block) var(--content-margin-inline)` |
| contact | `var(--space-10) var(--content-margin-inline) var(--space-12)` |

Once the section is full-height and centering its content, contact's asymmetric
`--space-10` / `--space-12` padding stops doing anything useful and is likely
better replaced with `--section-pad-block` to match. Worth confirming visually
rather than assuming.

## Test

- `/en/contact/` and `/fr/contact/` at 1440×900 — hero fills the viewport,
  form centred, matching `/en/forgot-password/`.
- Same pages at 390×844 and at a short viewport (around 600px tall) — the form
  must not be clipped by `overflow: clip`.
- Check the navbar gap at 1023px against forgot-password.

## Related

The four pages sharing this background — sign-in, register, forgot-password,
contact — should ideally agree on hero height. Worth checking register and
sign-in at the same time, since a fix that only lands on contact may leave the
set inconsistent in a different way.
