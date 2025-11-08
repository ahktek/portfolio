// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    
    // --- GSAP ANIMATION SETUP ---
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // 1. HERO SECTION ANIMATION (Load immediately)
    // Stagger the fade-in of hero elements
    gsap.from(".animate-hero", {
        duration: 0.8,
        opacity: 0,
        y: 30,          // Move up by 30px while fading in
        stagger: 0.2,   // 0.2s delay between each element starting its animation
        ease: "power3.out",
        delay: 0.3      // Wait a moment after page load before starting
    });

    // 2. SCROLL-TRIGGERED ANIMATIONS
    // Select all elements with the class 'gsap-reveal'
    const revealElements = document.querySelectorAll(".gsap-reveal");

    revealElements.forEach((element) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,      // Start animation when THIS element enters viewport
                start: "top 85%",      // Start when top of element hits 85% down the viewport
                toggleActions: "play none none none" // Only play once
            },
            duration: 1,
            opacity: 0,
            y: 50,
            ease: "power2.out"
        });
    });
});

// Optional: Console log perfectly suited for a developer portfolio
console.log(
    "%c Hello, fellow developer! \n Looking for bugs? 😉",
    "color: #64ffda; font-size: 16px; font-weight: bold; background-color: #0a192f; padding: 10px;"
);