document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SETUP (Lenis + ScrollTrigger) ---
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
    });

    // Sync ScrollTrigger with Lenis's scroll events
    lenis.on('scroll', ScrollTrigger.update);

    // Standard Native Animation Loop
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
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openMenu() {
        mobileDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
    function closeMenu() {
        mobileDrawer.classList.remove('active');
        drawerOverlay.classList.remove: 'active';
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
        drawerClose.addEventListener('click', closeMenu);
        drawerOverlay.addEventListener('click', closeMenu);
        // Close drawer when a link is clicked
        drawerLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // --- 3. NAVIGATION (Smooth Scroll & Spy) ---
    // A. Smooth Scroll on Click (Desktop & Mobile)
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

    // B. ScrollSpy (Active State for Sidebar)
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

    // --- 4. HERO ANIMATIONS (NEW) ---
    // A. Profile Picture Pop-in
    gsap.from(".animate-pop", {
        duration: 0.8,
        scale: 0.5,
        opacity: 0,
        ease: "power2.out",
        delay: 0.2
    });

    // B. Staggered fade-up for Signature, Role, and Socials
    gsap.from(".animate-up", {
        duration: 1,
        y: 40,
        opacity: 0,
        stagger: 0.2, // Animates them one after another
        ease: "power3.out",
        delay: 0.5 // Start after the picture
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

    // --- 6. MATRIX RAIN BACKGROUND ---
    const canvas = document.getElementById('matrix-bg');
    if (canvas && getComputedStyle(canvas).display !== 'none') {
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let ypos = Array(Math.ceil(w / fontSize) + 1).fill(0); // Ensure all columns are covered
        
        const chars = '01'; // Using binary
        const fontSize = 14;

        function resizeCanvas() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            columns = Math.ceil(w / fontSize);
            // Reset y-positions array on resize
            ypos = Array(columns).fill(0);
        }
        window.addEventListener('resize', resizeCanvas);

        function drawMatrix() {
            // Use a semi-transparent fill to create the fading trail effect
            ctx.fillStyle = 'rgba(10, 25, 47, 0.1)'; 
            ctx.fillRect(0, 0, w, h);
            
            // Set color and font for the characters
            ctx.fillStyle = '#64ffda'; // Your accent color
            ctx.font = `${fontSize}px 'Fira Code', monospace`;
            
            // Loop through each column
            for (let i = 0; i < ypos.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                const y = ypos[i] * fontSize;
                ctx.fillText(text, i * fontSize, y);
                
                // Reset to top if it goes off-screen, with a random chance
                if (y > h && Math.random() > 0.975) {
                    ypos[i] = 0;
                } else {
                    ypos[i]++;
                }
            }
        }
        setInterval(drawMatrix, 50);
    }
});