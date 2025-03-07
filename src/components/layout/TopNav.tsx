import React from 'react';
import './TopNav.css';

const TopNav: React.FC = () => {
  return (
    <nav className="top-nav">
      <div className="logo">
        <img src="/gsynergy-logo.png" alt="GSynergy Logo" />
      </div>
      <div className="auth-menu">
        {/* Auth menu will be implemented later as it's optional */}
        <button className="auth-button">Sign In</button>
      </div>
    </nav>
  );
};

export default TopNav;
