import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import './App.css';

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
          <Route path="/privacy-policy" element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
          <Route path="/terms" element={<AnimatedPage><TermsAndConditions /></AnimatedPage>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
