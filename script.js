document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. CORE SETUP (Lenis Smooth Scroll + GSAP)
    // =========================================
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

    // =========================================
    // 2. MOBILE DRAWER LOGIC
    // =========================================
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
        menuToggle.addEventListener('click', openMenu);
        drawerClose.addEventListener('click', closeMenu);
        drawerOverlay.addEventListener('click', closeMenu);
        drawerLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // =========================================
    // 3. NAVIGATION (Smooth Scroll & Spy)
    // =========================================
    // A. Smooth Scroll on Click (Desktop & Mobile)
    document.querySelectorAll('.nav-icon, .drawer-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            lenis.scrollTo(targetId, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        });
    });

    // B. ScrollSpy (Active State for Sidebar)
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

    // =========================================
    // 4. HERO ANIMATIONS (Tactical Zig-Zag)
    // =========================================
    
    // A. Profile Picture (The Anchor - Pops first)
    gsap.from(".animate-pop", {
        duration: 1.5,
        scale: 0.8,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        delay: 0.3
    });

    // B. Signature (Attacks from the LEFT)
    const signature = document.querySelector(".signature-name");
    if (signature) {
        // Split text into letters for that premium feel
        signature.innerHTML = signature.textContent.split("").map(char => 
            char === " " ? "&nbsp;" : `<span>${char}</span>`
        ).join("");
        
        gsap.from(".signature-name span", {
            duration: 1.2,
            x: -50,         // <--- Starts 50px to the LEFT
            opacity: 0,
            stagger: 0.03,  // Fast ripple effect
            ease: "power4.out",
            delay: 0.6      // Waits for profile to land
        });
    }

    // C. Role Part 1 (Attacks from the RIGHT)
    gsap.from(".hero-role-1", {
        duration: 1.2, x: 50, opacity: 0, ease: "power4.out", delay: 1.0
    });

    // D. Role Part 2 (Attacks from the LEFT)
    gsap.from(".hero-role-2", {
        duration: 1.2, x: -50, opacity: 0, ease: "power4.out", delay: 1.2
    });

    // E. Social Bar (Attacks from the RIGHT again - Zig-Zag complete)
    gsap.from(".hero-social-bar", {
        duration: 1.2, x: 50, opacity: 0, ease: "power4.out", delay: 1.4
    });

    // =========================================
    // NEW: SELECTED WORK CAROUSEL (Swiper)
    // =========================================
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,           // Infinite loop
        grabCursor: true,     // Shows a hand cursor to indicate draggable
        autoplay: {
            delay: 3000,      // 3 seconds per slide
            disableOnInteraction: false, // Keeps auto-playing even after user swipes
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        speed: 800, // Smooth slide transition speed (in ms)
    });

    // =========================================
    // 5. SCROLL REVEALS (Rest of page)
    // =========================================
    gsap.utils.toArray(".gsap-reveal").forEach(element => {
        gsap.from(element, {
            scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none none" },
            duration: 1.5, opacity: 0, y: 60, ease: "power4.out"
        });
    });

    // =========================================
    // 6. MATRIX RAIN BACKGROUND
    // =========================================
    const canvas = document.getElementById('matrix-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    function resizeCanvas() {
        // Lower resolution on mobile to improve performance
        if (window.innerWidth < 600) dpr = 0.7; // scale down for mobile
        else dpr = 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any transforms
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const chars = '01';
    const fontSize = window.innerWidth < 600 ? 11 : 14; // use smaller font on mobile
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops = [];
    function initDrops() {
        columns = Math.floor(window.innerWidth / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) { drops[i] = 1; }
    }
    initDrops();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initDrops();
    });
    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.15)';
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