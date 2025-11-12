document.addEventListener("DOMContentLoaded", () => {

    // --- 1. SETUP (Lenis Smooth Scroll + GSAP) ---
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
    });

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // --- 2. MOBILE DRAWER LOGIC ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-nav a');

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
        drawerLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // --- 3. NAVIGATION (Smooth Scroll & Spy) ---
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

    const sections = document.querySelectorAll("section[id]");
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section, 
            start: "top center", 
            end: "bottom center",
            onToggle: (self) => {
                if (self.isActive) {
                    document.querySelectorAll(".nav-icon").forEach(icon => icon.classList.remove("active"));
                    const activeLink = document.querySelector(`.nav-icon[href="#${section.id}"]`);
                    if (activeLink) activeLink.classList.add("active");
                }
            }
        });
    });

    // --- 4. HERO ANIMATIONS (Jayden Style) ---
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
        signature.innerHTML = signature.textContent.trim().replace(/\s+/g, '&nbsp;').split("").map(char => 
            char === " " ? " " : `<span class="sig-char">${char}</span>`
        ).join("");
        
        gsap.from(".signature-name span.sig-char", {
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

    // --- 6. OPTIMIZED MATRIX BACKGROUND ---
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    // On mobile, we use fewer columns to save performance
    let columns = Math.floor(window.innerWidth / (window.innerWidth < 768 ? 20 : 14)); // Wider columns on mobile
    let drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    const chars = '01';
    const fontSize = 14;
    ctx.font = `${fontSize}px 'Fira Code', monospace`;

    // --- Resize handler ---
    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        columns = Math.floor(window.innerWidth / (window.innerWidth < 768 ? 20 : 14));
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        ctx.font = `${fontSize}px 'Fira Code', monospace`;
    });

    // --- Animation loop ---
    let animationFrameId = null;
    let lastTime = 0;
    const throttleInterval = 50; // ~20 frames per second

    function drawMatrix(timestamp) {
        if (timestamp - lastTime < throttleInterval) {
            animationFrameId = requestAnimationFrame(drawMatrix);
            return; // Skip this frame to throttle
        }
        lastTime = timestamp;

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
        
        animationFrameId = requestAnimationFrame(drawMatrix); // Request next frame
    }

    // --- Start/Stop logic ---
    let scrollTimer = -1;
    lenis.on('scroll', (e) => {
        // When user starts scrolling, stop the matrix animation
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        // Clear any existing timer to restart the animation
        if (scrollTimer !== -1) {
            clearTimeout(scrollTimer);
        }

        // Set a timer to restart the animation 250ms after the user stops scrolling
        scrollTimer = setTimeout(() => {
            animationFrameId = requestAnimationFrame(drawMatrix);
        }, 250);
    });

    // Initial start
    animationFrameId = requestAnimationFrame(drawMatrix);
});