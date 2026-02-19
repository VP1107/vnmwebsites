# V&M Websites - WOW Edition Portfolio

A visually explosive, animation-heavy portfolio showcasing V&M Websites, built with React, GSAP, and Lenis for smooth scrolling. This project emphasizes high-performance animations and a premium user experience.

## ✨ Features

- **🎨 Hero Section**: Immersive entry with custom text reveal animations and split-screen curtain effect.
- **🚀 Tech Stack Showcase**: Dynamic display of technologies with hover effects and GSAP-powered transitions.
- **💼 Work Showcase**: Interactive project gallery with detailed cards and smooth hover interactions.
- **🛠️ What We Do**: Service overview with engaging layout and typography.
- **👋 About Section**: Detailed introduction with scroll-triggered text reveals.
- **📧 Contact Form**: Fully functional contact form integrated with Google Sheets and Email notifications. (See `MANUAL_GOOGLE_SHEETS_SETUP.md` for backend configuration)
- **🎯 Custom Cursor**: Magnetic cursor effect for enhanced interactivity.
- **⚡ Smooth Scroll**: Implemented using Lenis for a buttery-smooth scrolling experience.
- **🔄 Preloader**: Custom preloader with synchronized exit animation ensuring all assets are ready before display.

## 🚀 Tech Stack

- **Framework**: React 18+ with Vite
- **Animations**: GSAP (GreenSock Animation Platform) - specialized in ScrollTrigger and Flip.
- **Scroll**: Lenis
- **Typography**: Split Type for advanced text animation.
- **Styling**: Custom CSS with a focus on modern, responsive design.

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

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Hero/            # Hero section components
│   ├── About/           # About section components
│   ├── WorkShowcase/    # Project gallery components
│   ├── TechStack/       # Tech stack showcase components
│   ├── WhatWeDo/        # Services section components
│   ├── Contact/         # Contact form components
│   ├── Footer/          # Footer component
│   └── UI/              # Reusable UI components (Cursor, Preloader, ScrollWrapper)
├── styles/              # Global styles
│   ├── global.css
│   └── animations.css
├── animations/          # GSAP animation configurations and utilities
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── data/                # Static data files (projects, tech stack, etc.)
```

## 🎭 Design System

### Colors
- **Background**: Deep Dark Theme
- **Accents**: Neon Green, Cyan, Pink gradients for high contrast.

### Typography
- **Headings**: Syne / Monument Extended (Bold, Impactful)
- **Body**: Inter / DM Sans (Clean, Readable)

## 🌐 Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Modern Mobile Browsers

## 📝 Notes

- **Performance**: Optimized with lazy loading and code splitting.
- **Accessibility**: Semantic HTML structure and focus on keyboard navigation.

---

**Built by Vatsal & Mann** 🚀
