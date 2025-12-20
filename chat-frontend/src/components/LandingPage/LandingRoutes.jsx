import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Imports
import LandingLayout from './LandingLayout';
import ModernLanding from './ModernLanding';
import LandingMain from './LandingMain';
import About from './About';
import Contact from './Contact';
import Privacy from './Privacy';
import Terms from './Terms';

const LandingRoutes = () => {
  return (
    <Routes>
      {/* Parent Route: Layout (Navbar + Footer) */}
      <Route element={<LandingLayout />}>
      <Route index element={<LandingMain />} />
        
        {/* Child Routes */}
        <Route index element={<ModernLanding />} />      
        <Route path="about" element={<About />} />      
        <Route path="contact" element={<Contact />} />  
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />  
        
      </Route>
    </Routes>
  );
};

export default LandingRoutes;