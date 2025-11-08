document.addEventListener("DOMContentLoaded", () => {

    // --- 1. SETUP (Lenis + ScrollTrigger) ---
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. SMOOTH SCROLL ON CLICK (New Feature) ---
    // This intercepts the click, stops the "jump", and tells Lenis to glide there.
    document.querySelectorAll('.nav-icon').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // STOP the default instant jump
            
            const targetId = this.getAttribute('href'); // Get "#hero", "#about", etc.
            
            lenis.scrollTo(targetId, { 
                duration: 1.5, // Slightly slower than normal scroll for a luxurious feel
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Match your main easing
            });
        });
    });

    // --- 3. SCROLLSPY LOGIC (Sidebar Active State) ---
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

    // --- 4. ANIMATIONS ---
    gsap.from(".animate-hero", {
        duration: 1.2, opacity: 0, y: 50, stagger: 0.15, ease: "power4.out", delay: 0.2
    });

    gsap.utils.toArray(".gsap-reveal").forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            duration: 1.5, opacity: 0, y: 60, ease: "power4.out"
        });
    });
});