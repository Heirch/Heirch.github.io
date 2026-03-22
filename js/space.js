// space.js - Ambient Deep-Space Render Engine
const canvas = document.getElementById("space-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
    let w, h;
    let stars = [];
    let meteors = [];

    const numStars = 450;
    const speed = 0.03; // Professional, smoother, slower speed

    // Deep premium void themes mapping to sections
    const themes = {
        'hero': { c1: [5, 10, 25], c2: [2, 5, 15], c3: [0, 0, 8] },       // Extremely deep navy
        'about': { c1: [20, 25, 30], c2: [10, 15, 20], c3: [5, 5, 10] },    // Deep slate
        'skills': { c1: [10, 20, 30], c2: [5, 10, 20], c3: [2, 2, 10] },    // Dark teal depth
        'projects': { c1: [30, 10, 20], c2: [15, 5, 10], c3: [5, 0, 5] },   // Velvet rouge
        'certificates': { c1: [10, 30, 25], c2: [5, 15, 10], c3: [0, 5, 5] }, // Deep emerald
        'achievements': { c1: [25, 10, 35], c2: [10, 5, 20], c3: [5, 0, 10] }, // Deep void violet
        'contact': { c1: [2, 2, 5], c2: [0, 0, 2], c3: [0, 0, 0] }          // Total blackness
    };

    let currentTheme = { c1: [...themes['hero'].c1], c2: [...themes['hero'].c2], c3: [...themes['hero'].c3] };
    let targetTheme = themes['hero'];

    window.addEventListener('themeChanged', (e) => {
        if (themes[e.detail.theme]) targetTheme = themes[e.detail.theme];
    });

    function lerp(start, end, amt) { return start + (end - start) * amt; }
    function lerpColor(c1, c2, amt) { return [lerp(c1[0], c2[0], amt), lerp(c1[1], c2[1], amt), lerp(c1[2], c2[2], amt)]; }

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Star {
        constructor() {
            this.reset(true);
        }

        reset(randomZ = false) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.z = randomZ ? Math.random() * w : w; 
            this.o = 0.2 + Math.random() * 0.8;
            this.r = Math.random() * 1.5 + 0.5;
            this.isNebula = Math.random() > 0.95; // 5% chance to be glowing dust
        }

        update() {
            this.z -= speed * (this.isNebula ? 5 : 10);
            if (this.z <= 0) this.reset();
        }

        draw() {
            let x = (this.x - w / 2) * (w / this.z) * 0.5 + w / 2;
            let y = (this.y - h / 2) * (w / this.z) * 0.5 + h / 2;
            let r = this.r * (w / this.z) * 0.05;

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            
            if (this.isNebula) {
                // Subtle glowing ambient dust representing professional nebula depths
                ctx.fillStyle = `rgba(${Math.round(currentTheme.c1[0]*2)}, ${Math.round(currentTheme.c1[1]*2)}, ${Math.round(currentTheme.c1[2]*2)}, ${this.o * 0.5})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(${Math.round(currentTheme.c1[0]*2)}, ${Math.round(currentTheme.c1[1]*2)}, ${Math.round(currentTheme.c1[2]*2)}, 1)`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.o})`;
                ctx.shadowBlur = Math.random() > 0.5 ? 4 : 0;
                ctx.shadowColor = "rgba(255,255,255,0.8)";
            }
            
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
        }
    }

    // Professional subtle streak meteors
    class Meteor {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w + w; 
            this.y = -Math.random() * h;
            this.length = Math.random() * 40 + 10;
            this.speedX = -Math.random() * 4 - 2; 
            this.speedY = Math.random() * 4 + 2;
            this.opacity = Math.random() * 0.3 + 0.1; // Extremely subtle
            this.active = Math.random() > 0.9;
        }

        update() {
            if (!this.active) {
                if (Math.random() < 0.005) this.active = true;
                return;
            }
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < -this.length || this.y > h + this.length) this.reset();
        }

        draw() {
            if (!this.active) return;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.speedX * 3, this.y - this.speedY * 3); 
            ctx.strokeStyle = `rgba(255,255,255, ${this.opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    function init() {
        resize();
        stars = [];
        meteors = [];
        for (let i = 0; i < numStars; i++) stars.push(new Star());
        for (let i = 0; i < 3; i++) meteors.push(new Meteor()); // Fewer professional meteors
        window.addEventListener("resize", resize);
    }

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX - w / 2) * 0.015; // Smooth reduced parallax
        mouseY = (e.clientY - h / 2) * 0.015;
    });

    function drawNebula() {
        currentTheme.c1 = lerpColor(currentTheme.c1, targetTheme.c1, 0.02);
        currentTheme.c2 = lerpColor(currentTheme.c2, targetTheme.c2, 0.02);
        currentTheme.c3 = lerpColor(currentTheme.c3, targetTheme.c3, 0.02);

        const gradient = ctx.createRadialGradient(
            w / 2 - mouseX, h / 2 - mouseY, 0,
            w / 2 - mouseX, h / 2 - mouseY, Math.max(w, h)
        );
        
        gradient.addColorStop(0, `rgba(${Math.round(currentTheme.c1[0])}, ${Math.round(currentTheme.c1[1])}, ${Math.round(currentTheme.c1[2])}, 0.8)`);
        gradient.addColorStop(0.5, `rgba(${Math.round(currentTheme.c2[0])}, ${Math.round(currentTheme.c2[1])}, ${Math.round(currentTheme.c2[2])}, 0.5)`);
        gradient.addColorStop(1, `rgba(${Math.round(currentTheme.c3[0])}, ${Math.round(currentTheme.c3[1])}, ${Math.round(currentTheme.c3[2])}, 0.9)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#010105"; // Absoute deep base
        ctx.fillRect(0, 0, w, h);
        
        drawNebula();

        ctx.save();
        ctx.translate(mouseX, mouseY);
        
        stars.forEach(star => { star.update(); star.draw(); });
        meteors.forEach(meteor => { meteor.update(); meteor.draw(); });

        ctx.restore();
        requestAnimationFrame(animate);
    }

    init();
    animate();
}
