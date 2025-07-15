import React from 'react';
import './Header.css';

const Header = ({ mobileMenuOpen, toggleMobileMenu }) => {
  return (
    <nav className="top-nav">
      <div className="nav-container">
        <a href="#" className="nav-logo">
          <span className="logo-icon white-media-icon">▶</span>
          <span className="logo-text">XR Media Plan</span>
        </a>
        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#" className="active">Media</a></li>
          <li><a href="#" className="disabled">Analytics</a></li>
          <li><a href="#" className="disabled">Reports</a></li>
          <li><a href="#" className="disabled">Settings</a></li>
        </ul>
        <button className="nav-toggle" onClick={toggleMobileMenu}>
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Header;
