gsap.registerPlugin(ScrollTrigger);

// =========================================
// Minimalist Cursor — mix-blend-mode:difference
// =========================================
const cursor = document.querySelector('.cursor');

// GSAP quickTo for silky smooth movement
const xSetter = gsap.quickTo(cursor, "x", {duration: 0.4, ease: "power3.out"});
const ySetter = gsap.quickTo(cursor, "y", {duration: 0.4, ease: "power3.out"});

gsap.set(cursor, { xPercent: -50, yPercent: -50 });

window.addEventListener('mousemove', e => {
    xSetter(e.clientX);
    ySetter(e.clientY);
});

function initCursorEffects() {
    // Swell on all interactive elements
    document.querySelectorAll('a, button, .tech-tag, .timeline-item, .nav-menu a').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });

    // Hollow on headings/text blocks
    document.querySelectorAll('h1, h2, h3, .hero-huge-text, .scrub-text').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.remove('is-hovering');
            cursor.classList.add('is-text');
        });
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-text'));
    });
}

// =========================================
// Constellation Click Burst
// =========================================
function initConstellationClick() {
    document.addEventListener('click', e => {
        const x = e.clientX, y = e.clientY;
        const N = 7;
        const positions = [];

        for (let i = 0; i < N; i++) {
            const angle = (i / N) * Math.PI * 2;
            const dist  = 35 + Math.random() * 35;
            const dX = x + Math.cos(angle) * dist;
            const dY = y + Math.sin(angle) * dist;
            positions.push({ x: dX, y: dY });

            const p = document.createElement('div');
            p.className = 'constellation-particle';
            p.style.cssText = `left:${x}px; top:${y}px;`;
            document.body.appendChild(p);

            gsap.timeline()
                .to(p, { left: dX, top: dY, duration: 0.55, ease: 'power2.out' })
                .to(p, { opacity: 0, scale: 0, duration: 0.3, ease: 'power2.in',
                    onComplete: () => p.remove() }, '-=0.15');
        }

        // Connect with fading lines
        for (let i = 0; i < N; i++) {
            const a = positions[i], b = positions[(i + 1) % N];
            const dx = b.x - a.x, dy = b.y - a.y;
            const len = Math.hypot(dx, dy);
            const ang = Math.atan2(dy, dx) * 180 / Math.PI;

            const ln = document.createElement('div');
            ln.className = 'constellation-line';
            ln.style.cssText = `left:${a.x}px; top:${a.y}px; width:${len}px; transform:rotate(${ang}deg);`;
            document.body.appendChild(ln);

            gsap.fromTo(ln, { opacity: 0.5 }, {
                opacity: 0, duration: 0.65, ease: 'power2.out',
                onComplete: () => ln.remove()
            });
        }
    });
}

// =========================================
// GSAP Hybrid Timelines
// =========================================
function initV4Animations() {
    
    // 1. Initial Page Load
    const loadTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
    
    loadTl.from('.nav-brand, .nav-menu a', { 
        y: -20, opacity: 0, stagger: 0.1 
    })
    .from('.hero-image-mask', {
        scale: 0.8, opacity: 0, duration: 2, ease: 'expo.out'
    }, "-=1")
    .from('.text-line', {
        y: 100, opacity: 0, skewY: 5, stagger: 0.2
    }, "-=1.5")
    .from('.premium-tagline', {
        opacity: 0, y: 20
    }, "-=1");

    // 2. Hero Parallax
    gsap.to('.hero-text-side', {
        scrollTrigger: { trigger: '.v4-hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: -100, opacity: 0
    });
    gsap.to('.hero-image-side', {
        scrollTrigger: { trigger: '.v4-hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: 50, scale: 1.05
    });

    // 3. About Section Scrub Reveal (V3 Logic)
    const scrubText = new SplitType('.scrub-text', { types: 'lines, words' });
    
    gsap.from(scrubText.words, {
        scrollTrigger: {
            trigger: '.v4-about',
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1,
        },
        backgroundPositionX: '100%',
        stagger: 1,
        ease: 'none'
    });

    gsap.from('.summary-text', {
        scrollTrigger: { trigger: '.summary-text', start: 'top 85%' },
        opacity: 0, y: 30, duration: 1, ease: 'power3.out'
    });

    // 4. Structural Blocks Fade (V2 Logic)
    // Removed the opacity: 0 scroll trigger for tech tags since they were occasionally failing to fade in.

    gsap.from('.timeline-item', {
        scrollTrigger: { trigger: '.experience-section', start: 'top 80%' },
        opacity: 0, x: -30, duration: 0.8, ease: 'power3.out'
    });

    // 5. Horizontal Scroll (The Projects)
    const hScrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
    if (hScrollWrapper) {
        let scrollTween = gsap.to(hScrollWrapper, {
            x: () => -(hScrollWrapper.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: ".v4-projects-container",
                pin: true,
                scrub: 1,
                start: "center center",
                end: () => "+=" + hScrollWrapper.scrollWidth,
            }
        });

        // Parallax images/videos inside horizontal scroll
        gsap.utils.toArray('.pane-img-wrapper img, .pane-img-wrapper .project-video').forEach(media => {
            gsap.to(media, {
                x: 100,
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentNode.parentNode,
                    containerAnimation: scrollTween,
                    start: "left right",
                    end: "right left",
                    scrub: true
                }
            });
        });
    }

    // 6. Contact Section Reveal
    gsap.from('.contact-detail', {
        scrollTrigger: { trigger: '.contact-info-grid', start: 'top 85%' },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)'
    });

    // 7. Contact Marquee Infinite Auto-Scroll and Scroll Direction Reversal
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        // Clone for infinite loop
        marqueeContent.innerHTML += marqueeContent.innerHTML;
        
        let marqueeTween = gsap.to(marqueeContent, {
            xPercent: -50,
            repeat: -1,
            duration: 20,
            ease: "linear"
        });

        // Speed up marquee on scroll down, reverse on scroll up
        ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                let velocity = Math.abs(self.getVelocity());
                let dir = self.direction;
                gsap.to(marqueeTween, { 
                    timeScale: dir * (1 + velocity / 500), 
                    duration: 0.2, 
                    overwrite: true 
                });
                // return to normal speed
                gsap.delayedCall(0.2, () => {
                    gsap.to(marqueeTween, { timeScale: dir, duration: 1 });
                });
            }
        });
    }
}

// =============================================
// Snap Highlight Observer (Experience Section)
// =============================================
function initSnapHighlight() {
    const timeline = document.querySelector('.timeline');
    const cards = document.querySelectorAll('.timeline-item');
    if (!timeline || !cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
                cards.forEach(c => c.classList.remove('is-snapped'));
                entry.target.classList.add('is-snapped');
            }
        });
    }, {
        root: timeline,
        threshold: 0.7
    });

    cards.forEach(card => observer.observe(card));
}

// =========================================
// Fullscreen Video Modal Logic
// =========================================
function initVideoModal() {
    const projectVideos = document.querySelectorAll('.project-video');
    const modal = document.querySelector('.video-modal');
    const modalVideo = document.getElementById('modal-video');
    const closeBtn = document.querySelector('.modal-close');

    projectVideos.forEach(video => {
        // Find the wrapper to attach the click event
        const wrapper = video.closest('.pane-img-wrapper');
        if (wrapper) {
            wrapper.addEventListener('click', () => {
                const src = video.getAttribute('src');
                modalVideo.src = src;
                modal.classList.add('active');
                modalVideo.play();
            });
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        modalVideo.pause();
        // Clear src after animation finishes to prevent audio leak
        setTimeout(() => {
            modalVideo.src = "";
        }, 400);
    }

    closeBtn.addEventListener('click', closeModal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

document.writeln('<script src="https://unpkg.com/split-type"></script>'); // Dynamically load SplitType plugin for text scrubbing

// =========================================
// Lazy Video Playback Observer
// =========================================
function initLazyVideoPlayback() {
    const videos = document.querySelectorAll('.project-video');
    if (!videos.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Play when visible
                video.play().catch(e => console.log("Autoplay prevented:", e));
            } else {
                // Pause when out of view to save resources
                video.pause();
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.2 // Trigger when 20% visible
    });

    videos.forEach(video => observer.observe(video));
}

// =========================================
// Initialization & Navigation
// =========================================
document.writeln('<script src="https://unpkg.com/split-type"></script>'); // Dynamically load SplitType plugin for text scrubbing

// 1. Force Page to Top on Reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

function initSmoothNavigation() {
    gsap.registerPlugin(ScrollToPlugin);
    
    document.querySelectorAll('.nav-menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: targetId,
                    offsetY: 0
                },
                ease: "power4.inOut"
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    initCursorEffects();
    initConstellationClick();
    initSmoothNavigation();
    initSnapHighlight();
    initVideoModal();
    initLazyVideoPlayback();
    setTimeout(initV4Animations, 200);
});
