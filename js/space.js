// space.js - Canvas core engine with dynamic SPA themes
const canvas = document.getElementById("space-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
    let w, h;
    let stars = [];
    let meteors = [];

    // Configuration
    const numStars = 400;
    const speed = 0.05;

    // Theme Definitions (R, G, B) mapping to section IDs
    const themes = {
        'hero': { c1: [50, 20, 80], c2: [10, 5, 30], c3: [3, 0, 20] },
        'about': { c1: [70, 70, 85], c2: [25, 25, 35], c3: [5, 5, 10] },
        'skills': { c1: [140, 60, 10], c2: [50, 15, 5], c3: [10, 2, 0] },
        'soft-skills': { c1: [80, 20, 120], c2: [30, 5, 50], c3: [10, 0, 15] },
        'projects': { c1: [120, 10, 40], c2: [40, 5, 20], c3: [10, 0, 10] },
        'certificates': { c1: [20, 80, 100], c2: [5, 30, 60], c3: [0, 5, 15] },
        'achievements': { c1: [10, 100, 80], c2: [5, 40, 50], c3: [0, 10, 15] },
        'contact': { c1: [180, 120, 20], c2: [40, 20, 5], c3: [0, 0, 0] }
    };

    // Current interpolation state
    let currentTheme = {
        c1: [...themes['hero'].c1],
        c2: [...themes['hero'].c2],
        c3: [...themes['hero'].c3]
    };
    let targetTheme = themes['hero'];

    window.addEventListener('themeChanged', (e) => {
        if (themes[e.detail.theme]) {
            targetTheme = themes[e.detail.theme];
        }
    });

    function lerp(start, end, amt) {
        return start + (end - start) * amt;
    }

    function lerpColor(c1, c2, amt) {
        return [
            lerp(c1[0], c2[0], amt),
            lerp(c1[1], c2[1], amt),
            lerp(c1[2], c2[2], amt)
        ];
    }

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Star {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.z = Math.random() * w; // Depth
            this.o = 0.1 + Math.random() * 0.9; // Opacity
            this.r = Math.random() * 1.5; // Radius
            this.baseColor = Math.random() > 0.8 ? "rgba(192, 132, 252," : "rgba(255, 255, 255,";
        }

        update() {
            this.z -= speed * 10;
            if (this.z <= 0) {
                this.z = w;
                this.x = Math.random() * w;
                this.y = Math.random() * h;
            }
        }

        draw() {
            let x, y, r;
            x = (this.x - w / 2) * (w / this.z) * 0.5 + w / 2;
            y = (this.y - h / 2) * (w / this.z) * 0.5 + h / 2;
            r = this.r * (w / this.z) * 0.05;

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor + this.o + ")";
            ctx.fill();
        }
    }

    class Meteor {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * w + w; // Start slightly off screen
            this.y = -Math.random() * h;
            this.length = Math.random() * 80 + 20;
            this.speedX = -Math.random() * 6 - 3; // Faster
            this.speedY = Math.random() * 6 + 3;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.active = Math.random() > 0.9 ? true : false;
        }

        update() {
            if (!this.active) {
                if (Math.random() < 0.005) this.active = true;
                return;
            }

            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < -this.length || this.y > h + this.length) {
                this.reset();
            }
        }

        draw() {
            if (!this.active) return;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.speedX * 5, this.y - this.speedY * 5); // Tail
            // Theme-colored meteors based on c1 of current theme
            ctx.strokeStyle = `rgba(${currentTheme.c1[0]}, ${currentTheme.c1[1]}, ${currentTheme.c1[2]}, ${this.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    function init() {
        resize();
        stars = [];
        meteors = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
        for (let i = 0; i < 5; i++) {
            meteors.push(new Meteor());
        }
        window.addEventListener("resize", resize);
    }

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX - w / 2) * 0.03;
        mouseY = (e.clientY - h / 2) * 0.03;
    });

    function drawNebula() {
        // Smoothly interpolate the colors toward the target theme
        currentTheme.c1 = lerpColor(currentTheme.c1, targetTheme.c1, 0.015);
        currentTheme.c2 = lerpColor(currentTheme.c2, targetTheme.c2, 0.015);
        currentTheme.c3 = lerpColor(currentTheme.c3, targetTheme.c3, 0.015);

        const gradient = ctx.createRadialGradient(
            w / 2 - mouseX, h / 2 - mouseY, 0,
            w / 2 - mouseX, h / 2 - mouseY, Math.max(w, h)
        );
        
        gradient.addColorStop(0, `rgba(${Math.round(currentTheme.c1[0])}, ${Math.round(currentTheme.c1[1])}, ${Math.round(currentTheme.c1[2])}, 0.4)`);
        gradient.addColorStop(0.5, `rgba(${Math.round(currentTheme.c2[0])}, ${Math.round(currentTheme.c2[1])}, ${Math.round(currentTheme.c2[2])}, 0.2)`);
        gradient.addColorStop(1, `rgba(${Math.round(currentTheme.c3[0])}, ${Math.round(currentTheme.c3[1])}, ${Math.round(currentTheme.c3[2])}, 0.8)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        
        // Base dark background 
        ctx.fillStyle = "#030014";
        ctx.fillRect(0, 0, w, h);
        
        drawNebula();

        // Parallax Stars
        ctx.save();
        ctx.translate(mouseX, mouseY);
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        meteors.forEach(meteor => {
            meteor.update();
            meteor.draw();
        });

        ctx.restore();
        
        requestAnimationFrame(animate);
    }

    init();
    animate();
}
