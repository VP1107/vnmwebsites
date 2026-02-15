# V&M Websites - WOW Edition Portfolio

A visually explosive, animation-heavy portfolio showcasing V&M Websites built with React, Three.js, and anime.js.

## ✨ Features

- **🎨 Hero Section**: Three.js animated gradient mesh background, 200+ particle explosion, morphing logo with glitch effects
- **🎬 Who We Are**: Scroll-controlled video playback with 3D text reveal
- **🎡 What We Do**: Interactive 3D rotating carousel with drag/scroll controls
- **📧 Contact Form**: Animated form fields with morphing submit button
- **🎯 Custom Cursor**: Magnetic cursor with particle trails
- **⚡ Premium Animations**: Extensive use of anime.js for cinematic transitions

## 🚀 Tech Stack

- **Framework**: React 18 with Vite
- **3D Graphics**: Three.js with @react-three/fiber
- **Animations**: anime.js
- **Scroll**: Locomotive Scroll
- **Particles**: tsParticles
- **Styling**: Custom CSS with cyberpunk design system

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎭 Design System

### Colors
- Background: `#000000` (Pure Black)
- Accent Green: `#00ff88` (Electric Neon)
- Accent Pink: `#ff0080` (Hot Pink)
- Accent Cyan: `#00d4ff` (Tech Cyan)
- Gradient: `linear-gradient(135deg, #00ff88, #00d4ff, #ff0080)`

### Typography
- **Display**: Syne Extra Bold (120px hero, scales down)
- **Accent**: Monument Extended (All-caps impact)
- **Body**: Inter (Minimal text usage)

## 🎬 Animation Highlights

### Hero Section
1. Particle explosion (200 particles, 2s duration)
2. Logo morph with SVG path animation
3. Continuous glitch effect loop
4. Scramble text reveal
5. Scroll-linked 3D transforms
6. Magnetic cursor interaction

### Who We Are
- Video scrubbing controlled by scroll position
- 3D character reveal with translateZ and rotateY

### What We Do
- 3D carousel rotation (360° through section)
- Click-drag manual control
- Elastic hover effects on cards

### Contact Form
- Glowing input fields on focus
- Floating labels
- Submit button morphs into checkmark
- Form fields dissolve into particles
- Typewriter success message

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Hero.jsx
│   ├── WhoWeAre.jsx
│   ├── WhatWeDo.jsx
│   ├── ContactForm.jsx
│   ├── Footer.jsx
│   └── CustomCursor.jsx
├── animations/          # Animation utilities
│   ├── textEffects.js
│   └── particleEffects.js
├── three/              # Three.js components
│   └── GradientMesh.jsx
├── hooks/              # Custom React hooks
│   └── useMousePosition.js
├── utils/              # Utility functions
│   └── isMobile.js
└── styles/             # Global styles
    ├── global.css
    └── animations.css
```

## 🎯 Next Steps

### High Priority
1. **Add actual videos**:
   - Coding montage for "Who We Are" section
   - Service demo videos for carousel cards
   
2. **Work Showcase Section**: 
   - Implement liquid morph SVG mask transitions
   - Add project videos/GIFs with parallax
   - 3D tilt on mousemove

3. **Tech Stack Section**:
   - Particle logo formation/dissolution
   - Floating tech stack logos

### Medium Priority
4. **Enhanced Particles**:
   - Integrate tsParticles for contact form background
   - Mouse repulsion and click interactions

5. **Smooth Scroll**:
   - Implement Locomotive Scroll
   - Section snapping (optional)

6. **Performance**:
   - Lazy load sections below fold
   - Code splitting for Three.js

### Low Priority (Final Polish)
7. **Mobile Optimization**:
   - Reduce animation complexity on mobile
   - Touch swipe for carousel
   - Simplified particle systems

8. **Accessibility**:
   - Respect `prefers-reduced-motion`
   - Keyboard navigation
   - ARIA labels

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (WebGL compatible versions)
- Mobile browsers (with reduced animations)

## 📝 Notes

- Custom cursor is disabled on mobile/touch devices
- Videos fall back to gradient backgrounds if not available
- All animations respect `prefers-reduced-motion` setting

## 🚧 Development

Currently running on: `http://localhost:5173`

The site is designed for maximum visual impact on desktop. Mobile optimization will be added in the final phase.

---

**Built by Vatsal & Mann** — First-year students with unlimited ambition 🚀
