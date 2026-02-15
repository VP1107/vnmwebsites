import React from 'react';
import './TechStack.css';

const TechStack = () => {
  return (
    <section className="section tech-stack">
      <h2 className="gradient-text">TECH STACK</h2>
      <div className="tech-stack-container">
        <span style={{ color: 'var(--color-accent-green)' }}>HTML</span>
        <span style={{ color: 'var(--color-accent-cyan)' }}>CSS</span>
        <span style={{ color: 'var(--color-accent-pink)' }}>JavaScript</span>
        <span style={{ color: 'var(--color-accent-green)' }}>React</span>
        <span style={{ color: 'var(--color-accent-cyan)' }}>Three.js</span>
        <span style={{ color: 'var(--color-accent-pink)' }}>anime.js</span>
      </div>
    </section>
  );
};

export default TechStack;
