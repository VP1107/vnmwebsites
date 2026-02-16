import React from 'react';
import './Logo.css';

const Logo = ({ className, style }) => {
    return (
        <a href="#" className={`logo-essential ${className || ''}`} style={style}>
            <span className="vm">V&M</span>
            <span className="creations">CREATIONS</span>
        </a>
    );
};

export default Logo;
