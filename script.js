document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SETUP (Lenis Smooth Scroll + GSAP) ---
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
        smoothWheel: true,
        smoothTouch: false, // Optional: enable for touch devices
        touchMultiplier: 2,
    });

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // The animation loop for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // --- 2. MOBILE DRAWER LOGIC ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-nav a');

    function openMenu() {
        gsap.to(drawerOverlay, { autoAlpha: 1, duration: 0.3 });
        gsap.to(mobileDrawer, { x: 0, duration: 0.4, ease: "power2.out" });
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        gsap.to(mobileDrawer, { x: "100%", duration: 0.3, ease: "power2.in" });
        gsap.to(drawerOverlay, { autoAlpha: 0, duration: 0.4, delay: 0.1 });
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
        drawerClose.addEventListener('click', closeMenu);
        drawerOverlay.addEventListener('click', closeMenu);
        drawerLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // --- 3. NAVIGATION (Smooth Scroll & Spy) ---
    // A. Smooth Scroll on Click (Handles BOTH Desktop & Mobile links)
    document.querySelectorAll('.nav-icon, .drawer-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            lenis.scrollTo(targetId, { 
                duration: 1.5, 
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    });

    // B. ScrollSpy (Active State for Desktop Sidebar)
    const sections = document.querySelectorAll("section[id]");
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section, 
            start: "top center", 
            end: "bottom center",
            onToggle: (self) => {
                if (self.isActive) {
                    // Remove active from all
                    document.querySelectorAll(".nav-icon").forEach(icon => icon.classList.remove("active"));
                    // Add active to the one that matches
                    const activeLink = document.querySelector(`.nav-icon[href="#${section.id}"]`);
                    if (activeLink) activeLink.classList.add("active");
                }
            }
        });
    });

    // --- 4. HERO ANIMATIONS (Jayden Style) ---
    
    // A. Profile Picture (The Anchor - Pops first)
    gsap.from(".animate-pop", {
        duration: 0.8,
        scale: 0.5,
        opacity: 0,
        ease: "power2.out",
        delay: 0.2
    });

    // B. Signature (Letter-by-letter "draw" effect)
    const signature = document.querySelector(".signature-name");
    if (signature) {
        // Split text into individual letter spans
        signature.innerHTML = signature.textContent.trim().split("").map(char => 
            char === " " ? " " : `<span class="sig-char">${char}</span>`
        ).join("");
        
        // Animate the letters
        gsap.from(".sig-char", {
            duration: 0.8,
            opacity: 0,
            y: 40,
            rotate: 10,
            ease: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
            stagger: 0.05,
            delay: 0.5
        });
    }

    // C. Staggered fade-up for Role and Socials
    gsap.from(".animate-up", {
        duration: 1,
        y: 40,
        opacity: 0,
        stagger: 0.2, 
        ease: "power3.out",
        delay: 0.8 
    });

    // --- 5. SCROLL REVEALS (Rest of page) ---
    gsap.utils.toArray(".gsap-reveal").forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            duration: 1,
            opacity: 0,
            y: 50,
            ease: "power3.out"
        });
    });

    // --- 6. MATRIX RAIN BACKGROUND (Optimized for desktop only) ---
    const canvas = document.getElementById('matrix-bg');
    
    if (canvas && window.innerWidth > 768) { // Only run on screens wider than 768px
        const ctx = canvas.getContext('2d');
        let w, h, columns;
        let drops = [];
        const fontSize = 14;
        const chars = '01';

        function setupMatrix() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            columns = Math.floor(w / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }
            ctx.font = `${fontSize}px 'Fira Code', monospace`;
        }
        
        setupMatrix();
        window.addEventListener('resize', setupMatrix);

        function drawMatrix() {
            ctx.fillStyle = 'rgba(10, 25, 47, 0.1)'; 
            ctx.fillRect(0, 0, w, h);
            
            ctx.fillStyle = 'rgba(100, 255, 218, 0.5)'; // Accent color
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                ctx.fillText(text, x, y);
                
                if (y > h && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i]++;
            }
        }
        
        // Use setInterval for a consistent, throttled framerate
        setInterval(drawMatrix, 50);
    }
});