// script.js - Slide-based Architecture Engine
document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------
    // Custom Cursor
    // ----------------------------------------
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");

    if (window.innerWidth > 768 && cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const interactives = document.querySelectorAll("a, .btn, .tag, .glass-card");
        interactives.forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
                cursorOutline.style.backgroundColor = "rgba(192, 132, 252, 0.1)";
            });
            el.addEventListener("mouseleave", () => {
                cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
                cursorOutline.style.backgroundColor = "transparent";
            });
        });
    }

    // ----------------------------------------
    // Presentation Slide Logic (Glitch-free)
    // ----------------------------------------
    const sections = Array.from(document.querySelectorAll('section'));
    let currentSectionIndex = 0;
    let isAnimating = false;

    // Initialize first view
    sections[0].classList.add('active');
    const firstContent = sections[0].querySelector('.container');
    if (firstContent) {
        firstContent.classList.remove('hidden');
        firstContent.classList.add('crash-land');
    }

    function goToSection(index) {
        if (index < 0 || index >= sections.length || isAnimating || index === currentSectionIndex) return;
        isAnimating = true;

        const currentSection = sections[currentSectionIndex];
        const nextSection = sections[index];

        // 1. Trigger Exit Animation on Current Layer
        const currentContent = currentSection.querySelector('.container');
        if (currentContent) {
            currentContent.classList.remove('crash-land');
            currentContent.classList.add('launch-away');
        }

        // 2. Wait for exit animation to complete (0.6s)
        setTimeout(() => {
            // Hide current entirely
            currentSection.classList.remove('active');
            if (currentContent) {
                currentContent.classList.remove('launch-away');
                currentContent.classList.add('hidden'); // ready for next time
            }

            // Show next section wrapper
            nextSection.classList.add('active');
            
            // 3. Trigger Entrance Animation
            const nextContent = nextSection.querySelector('.container');
            if (nextContent) {
                // Remove hiding blocks
                nextContent.classList.remove('hidden', 'launch-away');
                
                // Force browser reflow to reliably restart animation
                void nextContent.offsetWidth;
                
                // Blast in
                nextContent.classList.add('crash-land');
            }

            // Bookkeeping
            currentSectionIndex = index;
            
            // Trigger background canvas morph via space.js
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: nextSection.id } }));
            
            // Update Navigation Menu Active State
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            const activeNav = document.querySelector(`.nav-links a[href="#${nextSection.id}"]`);
            if (activeNav) activeNav.classList.add('active');

            // 4. Release execution lock
            setTimeout(() => {
                isAnimating = false;
            }, 800); // Wait for crash-land to finish
        }, 600); // Exiting timeout
    }

    // Capture Wheel Scrolling
    let wheelTimeout;
    window.addEventListener('wheel', (e) => {
        if (isAnimating) return;
        
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            const activeSection = sections[currentSectionIndex];
            
            // Allow internal scrolling logic if section is too tall
            const atTop = activeSection.scrollTop <= 0;
            const atBottom = Math.ceil(activeSection.scrollTop + activeSection.clientHeight) >= activeSection.scrollHeight - 2;
            
            // Scroll down
            if (e.deltaY > 50 && atBottom) {
                goToSection(currentSectionIndex + 1);
            } 
            // Scroll up
            else if (e.deltaY < -50 && atTop) {
                goToSection(currentSectionIndex - 1);
            }
        }, 60); // Debounce to prevent wildly sensitive touchpads from skipping 5 slides natively
    });

    // Touch Support
    let touchStartY = 0;
    window.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY);
    window.addEventListener('touchend', e => {
        if (isAnimating) return;
        const touchEndY = e.changedTouches[0].clientY;
        const dist = touchStartY - touchEndY;
        
        const activeSection = sections[currentSectionIndex];
        const atTop = activeSection.scrollTop <= 0;
        const atBottom = Math.ceil(activeSection.scrollTop + activeSection.clientHeight) >= activeSection.scrollHeight - 2;

        if (dist > 50 && atBottom) {
            goToSection(currentSectionIndex + 1); // Swipe Up -> Next
        } else if (dist < -50 && atTop) {
            goToSection(currentSectionIndex - 1); // Swipe Down -> Prev
        }
    });

    // Keyboard Arrow Keys Support
    window.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        
        // Native scroll inside section first
        const activeSection = sections[currentSectionIndex];
        const atTop = activeSection.scrollTop <= 0;
        const atBottom = Math.ceil(activeSection.scrollTop + activeSection.clientHeight) >= activeSection.scrollHeight - 2;

        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && atBottom) {
            e.preventDefault();
            goToSection(currentSectionIndex + 1);
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && atTop) {
            e.preventDefault();
            goToSection(currentSectionIndex - 1);
        }
    });

    // Navigation Menu Click Routing
    document.querySelectorAll('.nav-links a, .cta-buttons a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetIndex = sections.findIndex(s => s.id === targetId);
            if (targetIndex !== -1) {
                goToSection(targetIndex);
            }
        });
    });
});
