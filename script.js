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

    // 5. SWIPER CAROUSEL
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    speed: 800,
    // This part is new:
    // This tells Swiper to re-calculate its size
    // whenever the window is resized.
    observer: true,
    observeParents: true,
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
        let frameInterval = isMobile() ? 1000 / 25 : 1000 / 45; // FPS throttle

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
            // Throttle frame rate manually for mobile
            if (now - lastTime < frameInterval) {
                window.requestAnimationFrame(drawMatrix);
                return;
            }
            lastTime = now;

            ctx.fillStyle = 'rgba(10, 25, 47, 0.19)'; // Slightly more fade for less ghosting
            ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
            ctx.fillStyle = '#64ffda';
            ctx.font = `${fontSize}px 'Fira Code', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height / dpr && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            window.requestAnimationFrame(drawMatrix);
        }
        window.requestAnimationFrame(drawMatrix);
    }

});
