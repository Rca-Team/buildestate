import React, { useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Initials avatar
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
    {/* Skip-to-main-content — keyboard accessibility */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#D4755B] focus:text-white focus:font-manrope focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ backgroundColor: `rgba(255, 255, 255, ${bgOpacity.get()})` }}
      className="sticky top-0 z-50 border-b border-[#E6D5C3] backdrop-blur-md"
    >
      <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMobileMenu}>
          <img src="/RCA-Logo.png" alt="RCA.Estate" width="36" height="36" className="h-9 w-auto" />
          <span className="font-fraunces text-2xl font-bold text-[#111827]">RCA.Estate</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-manrope transition-[color] ${
                isActive(link.path)
                  ? 'text-[#D4755B] font-semibold'
                  : 'text-[#374151] hover:text-[#D4755B]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link
                to="/add-property"
                className="bg-[#D4755B] text-white font-manrope font-bold px-5 py-2 rounded-xl hover:bg-[#B86851] transition-[background-color,box-shadow] hover:shadow-md active:scale-[0.96] transition-transform"
              >
                + List Property
              </Link>

              {/* User avatar dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  aria-expanded={isUserMenuOpen}
                  aria-label="User menu"
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-[#FAF8F4] transition-[background-color,border-color] border border-transparent hover:border-[#E6D5C3] active:scale-[0.96]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#D4755B] text-white font-manrope font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <span className="font-manrope font-semibold text-[#221410] max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="font-material-icons text-[#9CA3AF] text-lg" aria-hidden="true">
                    {isUserMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E6D5C3] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-[#F3F0EC] mb-1">
                      <p className="font-manrope text-xs text-[#9CA3AF]">Signed in as</p>
                      <p className="font-manrope text-sm font-semibold text-[#221410] truncate">{user.email}</p>
                    </div>
                    {[
                      { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
                      { to: '/my-listings', icon: 'home_work', label: 'My Listings' },
                    ].map(({ to, icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 font-manrope text-sm transition-[background-color,color] mx-1 rounded-xl ${
                          isActive(to) ? 'text-[#D4755B] font-semibold bg-[#FAF8F4]' : 'text-[#374151] hover:bg-[#FAF8F4] hover:text-[#D4755B]'
                        }`}
                      >
                        <span className="font-material-icons text-base" aria-hidden="true">{icon}</span>
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-[#F3F0EC] mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 font-manrope text-sm text-[#374151] hover:bg-red-50 hover:text-red-500 transition-[background-color,color] mx-1 rounded-xl"
                        style={{ width: 'calc(100% - 8px)' }}
                      >
                        <span className="font-material-icons text-base" aria-hidden="true">logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="font-manrope font-semibold text-[#374151] hover:text-[#D4755B] transition-[color] px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-[#D4755B] text-white font-manrope font-bold px-6 py-2 rounded-xl hover:bg-[#B86851] transition-[background-color,box-shadow] hover:shadow-md active:scale-[0.96]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[#374151] hover:text-[#D4755B] transition-[color] rounded-lg active:bg-black/5"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="font-material-icons text-2xl" aria-hidden="true">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="md:hidden fixed inset-0 top-[72px] bg-black/40 backdrop-blur-xs z-40"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden absolute top-[72px] left-0 w-full bg-white border-b border-[#E6D5C3] shadow-xl py-5 px-6 flex flex-col gap-2 z-50 max-h-[calc(100vh-72px)] overflow-y-auto"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-manrope text-base py-3 px-3 rounded-xl transition-all ${
                    isActive(link.path)
                      ? 'text-[#D4755B] bg-[rgba(212,117,91,0.08)] font-semibold'
                      : 'text-[#374151] hover:bg-[#FAF8F4]'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 mt-2 pt-4 flex flex-col gap-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-3 py-1">
                      <p className="font-manrope text-xs text-[#9CA3AF]">Signed in as</p>
                      <p className="font-manrope font-semibold text-sm text-[#374151] truncate">{user.name}</p>
                    </div>
                    <Link to="/dashboard" className="font-manrope text-base py-2.5 px-3 rounded-xl text-[#374151] hover:bg-[#FAF8F4] transition-all" onClick={closeMobileMenu}>Dashboard</Link>
                    <Link to="/my-listings" className="font-manrope text-base py-2.5 px-3 rounded-xl text-[#374151] hover:bg-[#FAF8F4] transition-all" onClick={closeMobileMenu}>My Listings</Link>
                    <Link
                      to="/add-property"
                      className="mt-2 bg-[#D4755B] text-white font-manrope font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-[#B86851] active:scale-[0.98] transition-all text-center shadow-sm"
                      onClick={closeMobileMenu}
                    >
                      + List Property
                    </Link>
                    <button onClick={handleLogout} className="font-manrope text-base py-2.5 px-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all mt-1">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" className="font-manrope font-semibold text-base py-3 px-3 rounded-xl text-[#374151] hover:bg-[#FAF8F4] text-center border border-[#E6E0DA]" onClick={closeMobileMenu}>Sign In</Link>
                    <Link
                      to="/signup"
                      className="bg-[#D4755B] text-white font-manrope font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-[#B86851] active:scale-[0.98] transition-all text-center shadow-sm"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
    </>
  );
};

export default Navbar;
