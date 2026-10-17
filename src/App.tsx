import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { motion, MotionConfig, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { Arrow } from './components/Icons';
import QuickContact, { preloadContactForm } from './components/QuickContact';
import Toast from './components/Toast';
import { easeOut } from './lib/motion';

const titles: Record<string, string> = {
  '/': 'Joel Navales — Developer & Curious Creative',
  '/work': 'Work & Skills — Joel Navales',
  '/about': 'About & Contact — Joel Navales',
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const previousLocation = useRef(location);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 24));

  const [quickOpen, setQuickOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  function messageSent() {
    setQuickOpen(false);
    // Wait for the panel to finish closing: while it's open the rest of the page is inert, and
    // a toast announced then would never reach a screen reader.
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToast('Message sent. Thanks for reaching out!');
      toastTimer.current = window.setTimeout(() => setToast(null), 5000);
    }, 320);
  }

  useLayoutEffect(() => {
    document.title = titles[location.pathname] ?? titles['/'];
    if (previousLocation.current.key !== location.key) {
      const target = location.hash
        ? document.getElementById(location.hash.slice(1))
        : document.querySelector<HTMLElement>('main h1');
      target?.focus({ preventScroll: true });
      setMenuOpen(false);
    }
    previousLocation.current = location;
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 760) setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    // "user" keeps fades but drops movement for people who ask their OS for reduced motion.
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className={scrolled ? 'site-bar is-scrolled' : 'site-bar'}>
        <header className="site-header">
          <Link
            className="brand"
            to="/"
            viewTransition
            aria-label="Joel Navales home"
            onClick={() => setMenuOpen(false)}
          >
            joel<span className="brand-dot">.</span>
            <span className="brand-slash">/</span>
            <span className="brand-label mono">
              DEVELOPER &<br />
              CURIOUS CREATIVE
            </span>
          </Link>
          <button
            id="menu-toggle"
            className="menu-toggle"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
            <span aria-hidden="true">{menuOpen ? '×' : '+'}</span>
          </button>
          <nav
            id="main-nav"
            className={menuOpen ? 'main-nav is-open' : 'main-nav'}
            aria-label="Main navigation"
          >
            {[
              ['/', 'Home'],
              ['/work', 'Work'],
              ['/about', 'About'],
            ].map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                end
                viewTransition
                className={({ isActive }) => (isActive ? 'nav-active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      // One shared dot that glides to whichever page is active.
                      <motion.span
                        layoutId="nav-dot"
                        className="nav-dot"
                        transition={{ duration: 0.5, ease: easeOut }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <Link
              className="nav-contact"
              to="/about#contact"
              viewTransition
              onPointerEnter={preloadContactForm}
              onFocus={preloadContactForm}
              onClick={(event) => {
                setMenuOpen(false);
                // A plain click opens the quick form; modified clicks still open the About page.
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                setQuickOpen(true);
              }}
            >
              Let’s talk <Arrow diagonal />
            </Link>
          </nav>
        </header>
        <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </div>
      <main id="main" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer section-shell">
        <small>© {new Date().getFullYear()} Joel Franco V. Navales. All rights reserved.</small>
        <small className="footer-note">
          All other trademarks and typefaces are the property of their respective owners.
        </small>
      </footer>
      <QuickContact open={quickOpen} onClose={() => setQuickOpen(false)} onSent={messageSent} />
      <Toast message={toast} />
      <ScrollRestoration />
    </MotionConfig>
  );
}
