document.addEventListener("DOMContentLoaded", () => {

    // 1. CORE SETUP (Lenis Smooth Scroll + GSAP)
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });
    lenis.on('scroll', ScrollTrigger.update);
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. MOBILE DRAWER LOGIC
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    function openMenu() {
        mobileDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        mobileDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu, { passive: true });
        drawerClose.addEventListener('click', closeMenu, { passive: true });
        drawerOverlay.addEventListener('click', closeMenu, { passive: true });
        drawerLinks.forEach(link => link.addEventListener('click', closeMenu, { passive: true }));
    }

    // 3. NAVIGATION (Smooth Scroll & Spy)
    document.querySelectorAll('.nav-icon, .drawer-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            lenis.scrollTo(targetId, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        }, { passive: false });
    });

    const sections = document.querySelectorAll("section[id]");
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section, start: "top center", end: "bottom center",
            onToggle: (self) => {
                if (self.isActive) {
                    document.querySelectorAll(".nav-icon").forEach(icon => icon.classList.remove("active"));
                    const activeLink = document.querySelector(`.nav-icon[href="#${section.id}"]`);
                    if (activeLink) activeLink.classList.add("active");
                }
            }
        });
    });

    // 4. HERO ANIMATIONS
    gsap.from(".animate-pop", {
        duration: 1.5,
        scale: 0.8,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        delay: 0.3
    });

    const signature = document.querySelector(".signature-name");
    if (signature) {
        signature.innerHTML = signature.textContent.split("").map(char =>
            char === " " ? "&nbsp;" : `<span>${char}</span>`
        ).join("");

        gsap.from(".signature-name span", {
            duration: 1.2,
            x: -50,
            opacity: 0,
            stagger: 0.03,
            ease: "power4.out",
            delay: 0.6
        });
    }

    gsap.from(".hero-role-1", {
        duration: 1.2, x: 50, opacity: 0, ease: "power4.out", delay: 1.0
    });
    gsap.from(".hero-role-2", {
        duration: 1.2, x: -50, opacity: 0, ease: "power4.out", delay: 1.2
    });
    gsap.from(".hero-social-bar", {
        duration: 1.2, x: 50, opacity: 0, ease: "power4.out", delay: 1.4
    });

    // 5. SWIPER CAROUSEL - FULLY RESPONSIVE & MOBILE OPTIMIZED
let swiperInstance = null;

function initSwiper() {
    // Destroy existing instance if exists
    if (swiperInstance) {
        swiperInstance.destroy(true, true);
    }

    const isMobile = window.innerWidth <= 768;
    const isSmall = window.innerWidth <= 480;

    swiperInstance = new Swiper(".mySwiper", {
        // Responsive slides
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        centeredSlides: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        speed: 800,
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
        },
        // Critical: Re-init on resize
        observer: true,
        observeParents: true,
        // Breakpoints for dynamic behavior
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            480: {
                slidesPerView: 1,
                spaceBetween: 15,
            },
            768: {
                slidesPerView: 1,
                spaceBetween: 20,
            }
        }
    });
}

// Initialize on load
initSwiper();

// Re-init on window resize (with debounce)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initSwiper, 200);
});

    // 6. SCROLL REVEALS
    gsap.utils.toArray(".gsap-reveal").forEach(element => {
        gsap.from(element, {
            scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none none" },
            duration: 1.5, opacity: 0, y: 60, ease: "power4.out"
        });
    });

    // 7. MATRIX RAIN BACKGROUND - FINAL MOBILE OPTIMIZED VERSION
    const canvas = document.getElementById('matrix-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let dpr = window.devicePixelRatio || 1;

        // Utility to detect mobile
        const isMobile = () => window.innerWidth < 600;

        // Reduce redraw rate on mobile
        let lastTime = 0;
        let frameInterval = isMobile() ? 1000 / 25 : 1000 / 25; // FPS throttle

        function resizeCanvas() {
            if (isMobile()) {
                dpr = 0.7; // Downscale resolution on mobile
            } else {
                dpr = 1;
            }
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }
        resizeCanvas();

        const chars = '01';
        const fontSize = isMobile() ? 9 : 14; // Even smaller font on mobile for fewer columns
        let columns;
        let drops = [];

        function initDrops() {
            columns = Math.floor(window.innerWidth / fontSize);
            drops = Array.from({ length: columns }, () => 1);
        }
        initDrops();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initDrops();
            frameInterval = isMobile() ? 1000 / 25 : 1000 / 45;
        });

    function drawMatrix(now) {
    if (now - lastTime < frameInterval) {
        window.requestAnimationFrame(drawMatrix);
        return;
    }
    lastTime = now;

    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // === LESS FADE = BRIGHTER BACKGROUND ===
    ctx.fillStyle = 'rgba(10, 15, 26, 0.08)';  // WAS 0.19 → NOW 0.08
    ctx.fillRect(0, 0, w, h);

    // === BRIGHT FONT ===
    const cyberFont = isMobile() 
        ? `${fontSize}px var(--font-mono)` 
        : `${fontSize + 2}px var(--font-mono)`;
    ctx.font = cyberFont;

    // === STORE POSITIONS ===
    const positions = [];
    const texts = [];
    const isGlitch = [];

    // === FIRST PASS: CALCULATE + STORE ===
    for (let i = 0; i < drops.length; i++) {
        let x = i * fontSize;
        let y = drops[i] * fontSize;

        // BARREL DISTORTION
        const centerX = w / 2;
        const centerY = h / 2;
        const dx = (x - centerX) / centerX;
        const dy = (y - centerY) / centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const curvature = isMobile() ? 0.35 : 0.45;
        const factor = 1 + curvature * dist * dist;

        x = centerX + dx * factor * centerX;
        y = centerY + dy * factor * centerY;

        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const glitch = Math.random() > 0.985;  // More glitch

        positions.push({ x, y });
        texts.push(glitch ? '█' : text);
        isGlitch.push(glitch);

        if (y > h && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
    }

    // === SECOND PASS: DRAW BASE (BRIGHT) ===
    ctx.fillStyle = '#00ff9d';  // FULL BRIGHT MINT
    for (let i = 0; i < positions.length; i++) {
        const { x, y } = positions[i];
        const text = texts[i];
        const glitch = isGlitch[i];

        if (glitch) {
            ctx.fillStyle = '#ff00ff';
            ctx.fillText('█', x, y);
        } else {
            ctx.fillText(text, x, y);
        }
        ctx.fillStyle = '#00ff9d';
    }

    // === THIRD PASS: DOUBLE GLOW (NUCLEAR) ===
    ctx.shadowColor = '#00ff9d';
    ctx.shadowBlur = isMobile() ? 8 : 14;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    for (let i = 0; i < positions.length; i++) {
        const { x, y } = positions[i];
        const text = texts[i];
        ctx.fillText(text, x, y);
    }

    // === FOURTH PASS: EXTRA BRIGHT CORE ===
    ctx.shadowBlur = isMobile() ? 3 : 5;
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < positions.length; i++) {
        const { x, y } = positions[i];
        const text = texts[i];
        ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;

    // === RESET ===
    ctx.shadowBlur = 0;

    window.requestAnimationFrame(drawMatrix);
}
   
}
    // CRT BOOT GLITCH
    setTimeout(() => {
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 100);
    }, 500);
          // START MATRIX RAIN
    window.requestAnimationFrame(drawMatrix);  
});
