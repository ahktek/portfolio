document.addEventListener("DOMContentLoaded", () => {

    // --- 1. SETUP (Lenis + ScrollTrigger) ---
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // --- 2. MOBILE DRAWER LOGIC ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openMenu() {
        mobileDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
    function closeMenu() {
        mobileDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
        drawerClose.addEventListener('click', closeMenu);
        drawerOverlay.addEventListener('click', closeMenu);
        // Close drawer when a link is clicked
        drawerLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // --- 3. SMOOTH SCROLL ON CLICK (Handles BOTH Desktop & Mobile links) ---
    // We target both .nav-icon (desktop) and .drawer-link (mobile)
    document.querySelectorAll('.nav-icon, .drawer-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            lenis.scrollTo(targetId, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        });
    });

    // --- 4. SCROLLSPY LOGIC (Desktop Sidebar) ---
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

    // --- 5. ANIMATIONS ---
    gsap.from(".animate-hero", { duration: 1.2, opacity: 0, y: 50, stagger: 0.15, ease: "power4.out", delay: 0.2 });
    gsap.utils.toArray(".gsap-reveal").forEach(element => {
        gsap.from(element, { scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none none" }, duration: 1.5, opacity: 0, y: 60, ease: "power4.out" });
    });

    // --- 6. MATRIX RAIN EFFECT ---
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas(); window.addEventListener('resize', resizeCanvas);
    const chars = '01'; const fontSize = 14; const columns = canvas.width / fontSize;
    const drops = []; for (let i = 0; i < columns; i++) { drops[i] = 1; }
    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.1)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#64ffda'; ctx.font = `${fontSize}px 'Fira Code', monospace`;
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) { drops[i] = 0; }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 50);
});