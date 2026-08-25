// ============================================
// NAVBAR MOBILE MENU
// ============================================

/**
 * Mobile hamburger menu toggle with accordion dropdowns
 */
function initNavbarMenu() {
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbar-menu');
    if (!hamburger || !navbarMenu) return;

    const mobileQuery = window.matchMedia('(max-width: 1023px)');

    function closeAllMobileDropdowns() {
        navbarMenu.querySelectorAll('.nav-dropdown-panel.mobile-open').forEach(panel => {
            panel.style.height = '0';
            panel.classList.remove('mobile-open');
            const navItem = panel.closest('.nav-item--dropdown');
            if (navItem) {
                navItem.classList.remove('is-active');
                const trigger = navItem.querySelector('.nav-link--has-dropdown');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navbarMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        closeAllMobileDropdowns();
    }

    // Toggle hamburger menu open/close
    hamburger.addEventListener('click', () => {
        if (navbarMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            hamburger.classList.add('active');
            navbarMenu.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
        }
    });

    // Mobile accordion toggle for dropdown triggers
    navbarMenu.querySelectorAll('.nav-link--has-dropdown').forEach(trigger => {
        trigger.addEventListener('click', () => {
            if (!mobileQuery.matches) return;

            const navItem = trigger.closest('.nav-item--dropdown');
            const panel = navItem && navItem.querySelector('.nav-dropdown-panel');
            if (!panel) return;

            const isOpen = panel.classList.contains('mobile-open');

            if (isOpen) {
                panel.style.height = '0';
                panel.classList.remove('mobile-open');
                navItem.classList.remove('is-active');
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                closeAllMobileDropdowns();
                panel.classList.add('mobile-open');
                panel.style.height = panel.scrollHeight + 'px';
                navItem.classList.add('is-active');
                trigger.setAttribute('aria-expanded', 'true');
            }

        });
    });

    // Close menu when clicking a plain nav link (not a dropdown trigger)
    navbarMenu.querySelectorAll('.nav-link:not(.nav-link--has-dropdown)').forEach(link => {
        link.addEventListener('click', () => closeMobileMenu());
    });

    // Close menu when clicking outside the navbar
    document.addEventListener('click', event => {
        if (!event.target.closest('.navbar') && navbarMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1023) {
            closeMobileMenu();
        }
    });
}

/**
 * Desktop dropdown interaction:
 * - Keep dropdown open while pointer is inside navbar + dropdown area
 * - Switch active dropdown when hovering another menu button
 * - Close only when pointer leaves navbar area (or focus/click moves away)
 */
function initNavbarDropdownInteraction() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const dropdownItems = Array.from(navbar.querySelectorAll('.nav-item--dropdown'));
    if (!dropdownItems.length) return;

    const desktopMediaQuery = window.matchMedia('(min-width: 1024px)');
    let activeItem = null;

    function clearActiveItem() {
        if (activeItem) {
            activeItem.classList.remove('is-active');
            const trigger = activeItem.querySelector('.nav-link--has-dropdown');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
            activeItem = null;
        }
    }

    function setActiveItem(item) {
        if (!desktopMediaQuery.matches) return;
        if (activeItem === item) return;

        clearActiveItem();
        activeItem = item;
        activeItem.classList.add('is-active');
        const trigger = activeItem.querySelector('.nav-link--has-dropdown');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    dropdownItems.forEach((item) => {
        item.addEventListener('mouseenter', () => setActiveItem(item));

        const trigger = item.querySelector('.nav-link--has-dropdown');
        if (trigger) {
            trigger.addEventListener('focus', () => setActiveItem(item));
        }
    });

    navbar.addEventListener('mouseleave', () => {
        if (!desktopMediaQuery.matches) return;
        clearActiveItem();
    });

    navbar.addEventListener('focusout', (event) => {
        if (!desktopMediaQuery.matches) return;

        const nextTarget = event.relatedTarget;
        if (!nextTarget || !navbar.contains(nextTarget)) {
            clearActiveItem();
        }
    });

    document.addEventListener('click', (event) => {
        if (!desktopMediaQuery.matches) return;
        if (!event.target.closest('.navbar')) {
            clearActiveItem();
        }
    });

    function handleViewportChange() {
        if (!desktopMediaQuery.matches) {
            clearActiveItem();
        }
    }

    if (desktopMediaQuery.addEventListener) {
        desktopMediaQuery.addEventListener('change', handleViewportChange);
    } else {
        desktopMediaQuery.addListener(handleViewportChange);
    }
}

// ============================================
// GOOGLE SHEETS CMS RUNTIME REFRESH
// ============================================

function normalizeCmsCell(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim();
}

function parseCmsDictionaryFromCsv(csvText) {
    if (!window.Papa) {
        console.warn('[CMS] Papa Parse not found on window. Runtime CMS refresh skipped.');
        return null;
    }

    const parsed = window.Papa.parse(csvText, { skipEmptyLines: true });
    const rows = parsed?.data || [];
    if (rows.length === 0) return {};

    const headerRow = rows[0].map(cell => normalizeCmsCell(cell).toLowerCase());
    const firstCell = headerRow[0];
    const hasHeader = firstCell === 'key' || firstCell === 'tag' || firstCell === 'id';
    if (!hasHeader) return {};

    function findCol(candidates) {
        return headerRow.findIndex(h => candidates.some(c => h.includes(c)));
    }

    // Each candidate is checked separately in priority order so that
    // 'updated text (french)' cannot be mistakenly matched by the
    // 'updated text' substring when searching for the English column.
    const enIdx = (() => {
        const specific = findCol(['updated text (english)']);
        if (specific !== -1) return specific;
        const english = findCol(['english']);
        if (english !== -1) return english;
        const current = findCol(['current text', 'text']);
        return current !== -1 ? current : 1;
    })();
    const frIdx = (() => {
        const specific = findCol(['updated text (french)']);
        if (specific !== -1) return specific;
        return findCol(['french', 'fr']);
    })();

    const dictionary = {};
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const key = normalizeCmsCell(row[0]);
        if (!key) continue;
        const en = normalizeCmsCell(row[enIdx]);
        const fr = frIdx >= 0 ? normalizeCmsCell(row[frIdx]) : '';
        dictionary[key] = { en, fr };
    }

    return dictionary;
}

function applyCmsDictionary(dictionary, locale) {
    if (!dictionary) return;

    const nodes = document.querySelectorAll('[data-copy-key]');
    nodes.forEach((node) => {
        const key = node.getAttribute('data-copy-key');
        if (!key) return;

        const row = dictionary[key];
        if (!row) {
            console.warn(`[CMS] Missing key in runtime dictionary: ${key}`);
            return;
        }

        const value = (locale === 'fr' ? row.fr : row.en) || row.en;
        if (!value) {
            console.warn(`[CMS] Missing localized content for key: ${key}`);
            return;
        }

        const scrollLabelNode = node.querySelector?.('.btn-scroll-label');
        if (scrollLabelNode) {
            scrollLabelNode.textContent = value;
            return;
        }

        node.textContent = value;
    });
}

function buildCsvUrl(url) {
    return `${url}${url.includes('?') ? '&' : '?'}_ts=${Date.now()}`;
}

async function fetchCsvDictionary(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
        console.warn(`[CMS] Runtime fetch failed with status ${response.status}: ${url}`);
        return null;
    }
    return parseCmsDictionaryFromCsv(await response.text());
}

async function fetchAndApplyRuntimeCmsCopy() {
    const cmsRoot = document.querySelector('main[data-cms-page-id]') || document.body;
    const locale = cmsRoot?.dataset?.locale || document.documentElement.lang || 'en';
    const directCsvUrl = cmsRoot?.dataset?.cmsCsvUrl;
    const sheetId = cmsRoot?.dataset?.cmsSheetId;
    const gid = cmsRoot?.dataset?.cmsTabGid;
    const secondaryCsvUrl = cmsRoot?.dataset?.cmsSecondaryCsvUrl;

    if (!directCsvUrl && (!sheetId || !gid)) return;

    const primaryUrl = directCsvUrl
        ? buildCsvUrl(directCsvUrl)
        : buildCsvUrl(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`);

    try {
        const fetches = [fetchCsvDictionary(primaryUrl)];
        if (secondaryCsvUrl) fetches.push(fetchCsvDictionary(buildCsvUrl(secondaryCsvUrl)));

        const results = await Promise.all(fetches);
        // Secondary (home) is merged first so primary (page-specific) keys win,
        // matching the build-time merge order in getPageDictionary.
        const dictionary = Object.assign({}, ...results.filter(Boolean).reverse());
        applyCmsDictionary(dictionary, locale);
    } catch (error) {
        console.warn('[CMS] Runtime fetch failed. Keeping prerendered copy.', error);
    }
}

function initRuntimeCmsRefresh() {
    const cmsRoot = document.querySelector('main[data-cms-page-id]') || document.body;
    const directCsvUrl = cmsRoot?.dataset?.cmsCsvUrl;
    const sheetId = cmsRoot?.dataset?.cmsSheetId;
    const gid = cmsRoot?.dataset?.cmsTabGid;
    if (!directCsvUrl && (!sheetId || !gid)) return;

    const refreshMs = Number(cmsRoot?.dataset?.cmsRefreshMs || '30000');
    const intervalMs = Number.isFinite(refreshMs) && refreshMs >= 5000 ? refreshMs : 30000;

    fetchAndApplyRuntimeCmsCopy();
    window.setInterval(fetchAndApplyRuntimeCmsCopy, intervalMs);
}

// ============================================
// PAGE LOAD INDICATOR
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navbar menu
    initNavbarMenu();

    // Initialize desktop navbar dropdown interaction
    initNavbarDropdownInteraction();

    // Initialize runtime CMS refresh (near-live Google Sheet updates)
    initRuntimeCmsRefresh();
    
    // Initialize hero title word animation
    initHeroTitleAnimation();
    
    // Initialize particle swell effect for hero-2
    initParticleSwell();
    
    // Initialize SVG breathing effect
    initSVGBreathing();
    
    // Initialize viewport observer for animations
    initViewportObserver();
});

// ============================================
// PARTICLE SWELL EFFECT FOR HERO-2
// ============================================

function initParticleSwell() {
    const hero2 = document.querySelector('.hero-2');
    if (!hero2) return;
    
    const particleSpacing = 25;
    const mouseDist = 350;

    // Create particle grid
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5;
    `;
    
    const cols = Math.ceil(hero2.offsetWidth / particleSpacing) + 1;
    const rows = Math.ceil(hero2.offsetHeight / particleSpacing) + 1;
    
    const particles = [];
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                left: ${i * particleSpacing}px;
                top: ${j * particleSpacing}px;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease-out;
                will-change: transform, opacity;
            `;
            particlesContainer.appendChild(particle);
            particles.push({
                element: particle,
                gridX: i,
                gridY: j,
                originX: i * particleSpacing,
                originY: j * particleSpacing,
                x: i * particleSpacing,
                y: j * particleSpacing,
                vx: 0,
                vy: 0
            });
        }
    }
    
    hero2.appendChild(particlesContainer);
    
    let globalMouseX = hero2.offsetWidth / 2;
    let globalMouseY = hero2.offsetHeight / 2;
    
    document.addEventListener('mousemove', (e) => {
        globalMouseX = e.clientX;
        globalMouseY = e.clientY;
    });
    
    function animate() {
        const rect = hero2.getBoundingClientRect();
        mouseX = globalMouseX - rect.left;
        mouseY = globalMouseY - rect.top;
        
        particles.forEach(p => {
            const dx = mouseX - p.originX;
            const dy = mouseY - p.originY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            let opacity = 0.4;
            let scale = 1;
            
            if (dist < mouseDist && dist > 0) {
                const proximity = 1 - (dist / mouseDist);
                const strength = proximity * proximity;
                
                // Map proximity to opacity: 0.4 to 1.0
                opacity = 0.4 + (strength * 0.6);
                
                // Circle closest to cursor scales to 6x
                // Surrounding circles scale to 2x+ based on proximity
                scale = 1 + (strength * 5);
            }
            
            p.element.style.opacity = opacity;
            p.element.style.transform = `scale(${scale})`;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// SVG BREATHING EFFECT
// ============================================

function initSVGBreathing() {
    // Get all hero sections that should have breathing (hero-section without hero-2 or hero-no-breathing class)
    const heroSections = document.querySelectorAll('.hero-section:not(.hero-2):not(.hero-no-breathing)');
    
    heroSections.forEach((section) => {
        const bottomLeftImg = section.querySelector('.hero-svg-bottom-left');
        const topRightImg = section.querySelector('.hero-svg-top-right');
        
        // Apply breathing to bottom-left SVG
        if (bottomLeftImg) {
            fetch('svg/bottom-left-new.svg')
                .then(response => response.text())
                .then(svgContent => {
                    const svgWrapper = document.createElement('div');
                    svgWrapper.innerHTML = svgContent;
                    const inlineSvg = svgWrapper.querySelector('svg');
                    
                    inlineSvg.classList.add('hero-svg', 'hero-svg-bottom-left');
                    inlineSvg.style.cssText = bottomLeftImg.getAttribute('style') || '';
                    
                    bottomLeftImg.replaceWith(inlineSvg);
                    
                    const allLayers = inlineSvg.querySelectorAll('[id^="Layer_"]');
                    let totalCircles = 0;
                    
                    allLayers.forEach(layer => {
                        const circles = layer.querySelectorAll('circle');
                        circles.forEach(circle => {
                            const cx = circle.getAttribute('cx');
                            const cy = circle.getAttribute('cy');
                            const randomDuration = (Math.random() * 3 + 2).toFixed(2);
                            const randomDelay = (Math.random() * 2).toFixed(2);
                            
                            circle.style.transformOrigin = `${cx}px ${cy}px`;
                            circle.style.animationDuration = `${randomDuration}s`;
                            circle.style.animationDelay = `${randomDelay}s`;
                            circle.classList.add('breathing-circle');
                            totalCircles++;
                        });
                    });
                    
                })
                .catch(err => console.error('Error loading bottom-left SVG:', err));
        }
        
        // Apply breathing to top-right SVG
        if (topRightImg) {
            fetch('svg/top-right-new.svg')
                .then(response => response.text())
                .then(svgContent => {
                    const svgWrapper = document.createElement('div');
                    svgWrapper.innerHTML = svgContent;
                    const inlineSvg = svgWrapper.querySelector('svg');
                    
                    inlineSvg.classList.add('hero-svg', 'hero-svg-top-right');
                    inlineSvg.style.cssText = topRightImg.getAttribute('style') || '';
                    
                    topRightImg.replaceWith(inlineSvg);
                    
                    const allLayers = inlineSvg.querySelectorAll('[id^="Layer_"]');
                    let totalCircles = 0;
                    
                    allLayers.forEach(layer => {
                        const circles = layer.querySelectorAll('circle');
                        circles.forEach(circle => {
                            const cx = circle.getAttribute('cx');
                            const cy = circle.getAttribute('cy');
                            const randomDuration = (Math.random() * 3 + 2).toFixed(2);
                            const randomDelay = (Math.random() * 2).toFixed(2);
                            
                            circle.style.transformOrigin = `${cx}px ${cy}px`;
                            circle.style.animationDuration = `${randomDuration}s`;
                            circle.style.animationDelay = `${randomDelay}s`;
                            circle.classList.add('breathing-circle');
                            totalCircles++;
                        });
                    });
                    
                })
                .catch(err => console.error('Error loading top-right SVG:', err));
        }
    });
}

// ============================================
// VIEWPORT OBSERVER FOR PERFORMANCE
// ============================================

function initViewportObserver() {
    const heroSections = document.querySelectorAll('.hero-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('paused');
            } else {
                entry.target.classList.add('paused');
            }
        });
    }, observerOptions);
    
    heroSections.forEach(section => {
        observer.observe(section);
    });
    
}

// ============================================
// HERO TITLE WORD ANIMATION
// ============================================

function initHeroTitleAnimation() {
    requestAnimationFrame(() => runTitleAnimation());
}

function runTitleAnimation() {
    const heroTitles = document.querySelectorAll('.hero-title');
    const wordDelay = 0.12; // Delay between each word (seconds) — 20% faster than 0.15
    const wordAnimationDuration = 0.48; // Duration of each word animation (seconds) — 20% faster than 0.6, keep in sync with .hero-title-word's wordAppear duration in HomeHeroSection.astro
    const collageImageAnimationDuration = 1.3; // Grow-in duration for collage cards — slow, fluid entrance
    const collageImageStagger = 0.15; // Delay between each card's start (same pace as the badge stagger below)
    
    heroTitles.forEach(title => {
        const text = title.textContent.trim();
        const words = text.split(' ');

        // Prevent CMS runtime refresh from overwriting the animated spans
        title.removeAttribute('data-copy-key');

        // Clear the original text
        title.textContent = '';
        
        // Create a span for each word
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'hero-title-word';
            wordSpan.textContent = word;
            wordSpan.style.animationDelay = `${index * wordDelay}s`;
            
            title.appendChild(wordSpan);
            
            // Add space after each word except the last
            if (index < words.length - 1) {
                title.appendChild(document.createTextNode(' '));
            }
        });
        
        // Calculate total title animation duration
        const totalTitleDuration = (words.length - 1) * wordDelay + wordAnimationDuration;
        
        // Get the hero-content container
        const heroContent = title.closest('.hero-content');
        if (heroContent) {
            // Set animation delay for subtitle
            const subtitle = heroContent.querySelector('.hero-subtitle');
            if (subtitle) {
                subtitle.style.animationDelay = `${totalTitleDuration + 0.1}s`;
            }
            
            // Set animation delay for buttons
            const buttons = heroContent.querySelector('.hero-buttons');
            if (buttons) {
                buttons.style.animationDelay = `${totalTitleDuration + 0.1}s`;
            }
        }
        
        // Get the hero-section for collage images
        const heroSection = title.closest('.hero-section');
        if (heroSection) {
            const heroImage = heroSection.querySelector('.hero-image-right');
            if (heroImage) {
                heroImage.style.animationDelay = `${totalTitleDuration + 0.6}s`;
            }
            
            // Set animation delays for collage images
            const collageImages = heroSection.querySelectorAll('.collage-image');
            if (collageImages.length > 0) {
                // Collage starts while the buttons are still settling in (overlap),
                // not after their full 1.1s entrance finishes — waiting for the full
                // duration made the gap between the left content and the collage
                // read as a dead pause.
                const buttonsStartTime = totalTitleDuration + 0.1;
                const collageStartTime = buttonsStartTime + 0.5;

                collageImages.forEach((img, index) => {
                    const delay = collageStartTime + (index * collageImageStagger);
                    img.style.animationDelay = `${delay}s`;
                    img.style.animationDuration = `${collageImageAnimationDuration}s`;
                });

                // Decorative badges continue the exact same stagger train as
                // the cards (indices length, length+1, ...) instead of
                // waiting for every card to fully finish first — that wait
                // read as two separate movements instead of one continuous
                // reveal, since cards themselves overlap at this stagger.
                const collageBadges = heroSection.querySelectorAll('.collage-badge');
                collageBadges.forEach((badge, index) => {
                    const delay = collageStartTime + ((collageImages.length + index) * collageImageStagger);
                    badge.style.animationDelay = `${delay}s`;
                });

                // Mobile's single collage image: unlike the desktop cards
                // above, this one waits for the buttons' entrance to fully
                // finish (buttonsStartTime + their own 1.1s duration,
                // --motion-duration-heading) before flying in, rather than
                // overlapping with it.
                const collageMobileRow = heroSection.querySelector('.collage-mobile-row');
                if (collageMobileRow) {
                    collageMobileRow.style.animationDelay = `${buttonsStartTime + 1.1}s`;
                }
            }
        }
    });

    // Force animation restart by removing and re-adding animation-play-state
    // This ensures animations start from the beginning
    setTimeout(() => {
        document.querySelectorAll('.hero-title-word, .hero-subtitle, .hero-buttons, .hero-image-right, .collage-image, .collage-badge, .collage-mobile-row').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }, 10);
    
}
