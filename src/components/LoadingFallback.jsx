import React from 'react';

const LoadingFallback = () => (
  <div style={{
    height: '100vh',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  }}>
    {/* Animated logo or spinner */}
    <div style={{
      width: '60px',
      height: '60px',
      border: '3px solid rgba(0, 255, 136, 0.2)',
      borderTop: '3px solid #38bdf8',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />

    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingFallback;
