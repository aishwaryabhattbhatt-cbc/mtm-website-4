// ============================================
// RESPONSIVE UTILITIES & ENHANCEMENTS
// ============================================

class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            sm: 480,
            md: 768,
            lg: 1024,
            xl: 1440,
            xxl: 1920
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.init();
    }

    /**
     * Get current breakpoint based on window width
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width < this.breakpoints.sm) return 'xs';
        if (width < this.breakpoints.md) return 'sm';
        if (width < this.breakpoints.lg) return 'md';
        if (width < this.breakpoints.xl) return 'lg';
        if (width < this.breakpoints.xxl) return 'xl';
        return 'xxl';
    }

    /**
     * Check if current breakpoint is mobile
     */
    isMobile() {
        return this.currentBreakpoint === 'xs' || this.currentBreakpoint === 'sm';
    }

    /**
     * Check if current breakpoint is tablet
     */
    isTablet() {
        return this.currentBreakpoint === 'md';
    }

    /**
     * Check if current breakpoint is desktop
     */
    isDesktop() {
        return this.currentBreakpoint === 'lg' || 
               this.currentBreakpoint === 'xl' || 
               this.currentBreakpoint === 'xxl';
    }

    /**
     * Get window dimensions
     */
    getWindowDimensions() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            breakpoint: this.currentBreakpoint
        };
    }

    /**
     * Initialize responsive listeners
     */
    init() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => this.handleResize());
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.onBreakpointChange(newBreakpoint);
        }
    }

    /**
     * Callback when breakpoint changes
     */
    onBreakpointChange(breakpoint) {
        console.log(`Breakpoint changed to: ${breakpoint}`);
        document.documentElement.setAttribute('data-breakpoint', breakpoint);
        
        // Dispatch custom event
        const event = new CustomEvent('breakpointchange', {
            detail: { breakpoint }
        });
        window.dispatchEvent(event);
    }

    /**
     * Get grid gap based on breakpoint
     */
    getGridGap() {
        const gaps = {
            xs: 20,
            sm: 20,
            md: 24,
            lg: 32,
            xl: 32,
            xxl: 32
        };
        return gaps[this.currentBreakpoint];
    }

    /**
     * Get container max width based on breakpoint
     */
    getContainerWidth() {
        const widths = {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: 960,
            xl: 1200,
            xxl: 1320
        };
        return widths[this.currentBreakpoint];
    }
}

// ============================================
// INITIALIZE
// ============================================

// Create global responsive manager instance
const responsive = new ResponsiveManager();

// Log current state for debugging
console.log('Responsive Manager Initialized:', {
    breakpoint: responsive.currentBreakpoint,
    dimensions: responsive.getWindowDimensions(),
    gridGap: responsive.getGridGap(),
    containerWidth: responsive.getContainerWidth()
});

// Listen for breakpoint changes
window.addEventListener('breakpointchange', (event) => {
    console.log('Breakpoint changed:', event.detail.breakpoint);
});

// ============================================
// EXAMPLE: DYNAMIC CONTENT LOADING
// ============================================

/**
 * Load different content based on breakpoint
 */
function loadResponsiveContent() {
    if (responsive.isMobile()) {
        console.log('Loading mobile-optimized content');
    } else if (responsive.isTablet()) {
        console.log('Loading tablet-optimized content');
    } else if (responsive.isDesktop()) {
        console.log('Loading desktop-optimized content');
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadResponsiveContent);

// Call when breakpoint changes
window.addEventListener('breakpointchange', loadResponsiveContent);

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for resize events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get computed CSS variable value
 */
function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
}

/**
 * Set CSS variable value
 */
function setCSSVariable(variableName, value) {
    document.documentElement.style.setProperty(variableName, value);
}

/**
 * Check if device supports touch
 */
function isTouch() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

console.log('Touch support:', isTouch());

// ============================================
// NAVBAR MOBILE MENU
// ============================================

/**
 * Mobile hamburger menu toggle
 */
function initNavbarMenu() {
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navbarMenu) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.navbar') && navbarMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });

    // Close menu on screen resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1023) {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });
}

/**
 * Language selector
 */
function initLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            console.log('Language changed to:', button.getAttribute('data-lang'));
        });
    });
}

// ============================================
// PAGE LOAD INDICATOR
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Responsive website loaded successfully');
    console.log('Current setup:', {
        breakpoint: responsive.currentBreakpoint,
        isMobile: responsive.isMobile(),
        isTablet: responsive.isTablet(),
        isDesktop: responsive.isDesktop(),
        windowWidth: window.innerWidth,
        gridGap: responsive.getGridGap(),
        containerWidth: responsive.getContainerWidth()
    });

    // Initialize navbar menu
    initNavbarMenu();
    
    // Initialize language selector
    initLanguageSelector();
    
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
    const glideSpeed = 0.15;
    
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
    
    heroSections.forEach((section, sectionIndex) => {
        const bottomLeftImg = section.querySelector('.hero-svg-bottom-left');
        const topRightImg = section.querySelector('.hero-svg-top-right');
        
        // Apply breathing to bottom-left SVG
        if (bottomLeftImg) {
            fetch('assets/svg/bottom-left-new.svg')
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
                    
                    console.log(`✓ Section ${sectionIndex + 1} Bottom-left: Breathing applied to ${totalCircles} circles`);
                })
                .catch(err => console.error('Error loading bottom-left SVG:', err));
        }
        
        // Apply breathing to top-right SVG
        if (topRightImg) {
            fetch('assets/svg/top-right-new.svg')
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
                    
                    console.log(`✓ Section ${sectionIndex + 1} Top-right: Breathing applied to ${totalCircles} circles`);
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
    
    console.log('✓ Viewport observer initialized for performance optimization');
}

// ============================================
// HERO TITLE WORD ANIMATION
// ============================================

function initHeroTitleAnimation() {
    // Wait a brief moment for page to fully render before starting animations
    setTimeout(() => {
        runTitleAnimation();
    }, 100);
}

function runTitleAnimation() {
    const heroTitles = document.querySelectorAll('.hero-title');
    const wordDelay = 0.15; // Delay between each word (seconds)
    const wordAnimationDuration = 0.6; // Duration of each word animation (seconds)
    const collageImageAnimationDuration = 0.5; // Slightly faster animation for collage images
    const collageImageGap = 0.09; // Slightly shorter gap between each collage image appearance
    
    heroTitles.forEach(title => {
        const text = title.textContent;
        const words = text.split(' ');
        
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
                // Buttons finish at: totalTitleDuration + 0.1 + 0.8 (button animation duration)
                const buttonsFinishTime = totalTitleDuration + 0.1 + 0.8;
                
                collageImages.forEach((img, index) => {
                    // Image delay: when buttons finish + small buffer + sequential delay for each image
                    const delay = buttonsFinishTime + 0.1 + (index * (collageImageAnimationDuration + collageImageGap));
                    img.style.animationDelay = `${delay}s`;
                    img.style.animationDuration = `${collageImageAnimationDuration}s`;
                });
            }
        }
    });
    
    // Force animation restart by removing and re-adding animation-play-state
    // This ensures animations start from the beginning
    setTimeout(() => {
        document.querySelectorAll('.hero-title-word, .hero-subtitle, .hero-buttons, .hero-image-right, .collage-image').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }, 10);
    
    console.log('✓ Hero title word animation initialized with sequential content reveal and collage images');
}
