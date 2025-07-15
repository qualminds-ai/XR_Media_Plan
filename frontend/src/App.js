import React, { useState } from 'react';
import Header from './Header';
import Media from './Media';
import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
      {/* Top Navigation */}
      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      
      {/* Main Content - Media Upload Page */}
      <Media />
    </div>
  );
}

export default App;
