# Harsh Raj | Software Engineer Portfolio 🚀

> A highly immersive, interactive, and seamless Presentation SPA (Single-Page Application) portfolio built with Vanilla JS, HTML5 Canvas, and advanced CSS animations.

🔗 **Live Portfolio:** [https://Heirch.github.io/](https://Heirch.github.io/)

## 🌠 Overview
This repository contains the source code for my personal developer portfolio. It is engineered from scratch without relying on heavy frontend frameworks, prioritizing pure performance, distinct visual aesthetics, and robust physics-based animations. 

The architecture utilizes a custom slide-based SPA state manager that disables native overlapping scroll glitches in favor of a perfectly isolated 'Presentation Mode'. This allows continuous, stutter-free rendering of space-themed dynamic canvases and complex 'crash-landing' meteor entrance/exit physics.

## 🛠️ Tech Stack & Architecture
- **HTML5 & CSS3:** Semantic structure with strict flexbox/grid layouts, glassmorphism UI, and advanced hardware-accelerated `@keyframes`.
- **Vanilla JavaScript:** Custom Slide-SPA routing logic capturing wheel, touch, and keydown events. Custom event dispatchers (`themeChanged`) orchestrate cross-component visual updates.
- **HTML5 Canvas:** Real-time starfield depth tracking (`z-axis` 3D simulation) and procedural meteor generation rendering at 60 FPS using smooth linear color interpolation (`lerpColor`) for background morphing.

## 🚀 Key Features
- **Dynamic Planetary Themes:** As users smoothly progress through sections (Skills, Projects, etc.), the canvas seamlessly interpolates into distinct celestial biome color palettes (Deep Space, Grey Moon, Orange Titan, Purple Nebula, Gold Black Hole).
- **Presentation SPA Router:** Dedicated wheel and touch momentum-trapping ensures exactly one isolated section exists on the browser screen at a single time to prevent visual clipping.
- **Bidirectional Physics:** Content continuously animates in via aggressive `.crash-land` mechanics and vanishes elegantly in the exact opposite trajectory upon leaving (`.launch-away`).
- **Responsive & Interactive Design:** Features custom cursor tracking logic with magnetic hover impacts on distinct glass-cards and `CTA`s.

## 👨‍💻 Author
**Harsh Raj**  
- **LinkedIn:** [linkedin.com/in/heirch](https://www.linkedin.com/in/heirch)  
- **GitHub:** [@Heirch](https://github.com/Heirch)
- **Email:** harsh35150@gmail.com

---
*Created with passion and code. © 2026 Harsh Raj.*
