import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, Menu, X, Phone, Headphones, Shield, Users, Globe } from 'lucide-react';
import { CONTACT_NUMBER } from '../utils/constants';

/* ─── Trust Ticker ─── */
function TrustTicker() {
  const items = [
    { icon: <Globe size={14} />, text: 'Instant Support for All Major Digital Wallets' },
    { icon: <Headphones size={14} />, text: '24/7 Expert Assistance Available' },
    { icon: <Users size={14} />, text: 'Trusted by Traders Worldwide' },
    { icon: <Shield size={14} />, text: 'Non-Custodial & Fully Transparent' },
  ];

  return (
    <div className="bg-slate-50 border-b border-slate-100 overflow-hidden py-2.5">
      <div className="ticker-track">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 text-slate-400 text-xs font-medium whitespace-nowrap">
            <span className="text-purple-400">{item.icon}</span>
            <span>{item.text}</span>
            <span className="text-purple-300 mx-4">&#9670;</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms & Conditions' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm'
            : 'bg-white/70 backdrop-blur-md'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-5 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-200"
            >
              <ArrowDownUp size={20} className="text-white" />
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Ether<span className="text-purple-600">Swap</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Phone CTA */}
            {CONTACT_NUMBER && (
              <a href={`tel:${CONTACT_NUMBER}`}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold shadow-md shadow-purple-200 hover:bg-purple-700 transition-colors"
                >
                  <Phone size={15} />
                  {CONTACT_NUMBER}
                </motion.div>
              </a>
            )}

            {/* Compact on mobile, full on desktop */}
            <div className="hidden lg:block">
              <ConnectButton />
            </div>
            <div className="lg:hidden">
              <ConnectButton
                accountStatus="avatar"
                chainStatus="none"
                showBalance={false}
              />
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-slate-200"
            >
              <div className="px-5 py-5 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {CONTACT_NUMBER && (
                  <a href={`tel:${CONTACT_NUMBER}`} className="px-4 py-3 text-purple-600 font-semibold">
                    {CONTACT_NUMBER}
                  </a>
                )}
                <div className="pt-3 mt-2 border-t border-slate-100">
                  <ConnectButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Trust Ticker - below nav */}
      <div className="pt-[72px]">
        <TrustTicker />
      </div>
    </>
  );
}

/* ─── Footer ─── */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                <ArrowDownUp size={18} className="text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Ether<span className="text-purple-600">Swap</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your trusted platform for Ethereum token swaps.
              Non-custodial, transparent, and zero platform fees.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs mb-4 tracking-wider uppercase">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-slate-400 hover:text-purple-600 text-sm transition-colors">Home</Link>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-xs mb-4 tracking-wider uppercase">Legal</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/privacy-policy" className="text-slate-400 hover:text-purple-600 text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-400 hover:text-purple-600 text-sm transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">&copy; {currentYear} EtherSwap. All rights reserved.</p>
          <p className="text-slate-400 text-xs">Swapping tokens with confidence.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
