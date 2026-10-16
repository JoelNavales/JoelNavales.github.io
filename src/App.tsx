import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import {
  motion,
  MotionConfig,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
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
  const reduced = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [navFocused, setNavFocused] = useState(false);
  const travel = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const delta = latest - (scrollY.getPrevious() ?? latest);
    // Distance travelled in the current direction, so small jitters don't toggle the bar.
    travel.current =
      Math.sign(delta) === Math.sign(travel.current) ? travel.current + delta : delta;
    setScrolled(latest > 24);
    if (latest < 320 || travel.current < -32) setTucked(false);
    else if (travel.current > 48) setTucked(true);
  });

  // Tucked away while reading down the page, but never with the menu open, while the nav has
  // keyboard focus, or for people who prefer reduced motion.
  const hidden = tucked && !menuOpen && !navFocused && !reduced;

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
      <motion.div
        className={scrolled ? 'site-bar is-scrolled' : 'site-bar'}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.35, ease: easeOut }}
        onFocus={() => setNavFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setNavFocused(false);
        }}
      >
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
      </motion.div>
      <main id="main" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer section-shell">
        <span>© {new Date().getFullYear()} Joel Navales</span>
        <span className="footer-note">
          Made with curiosity, in Cebu. <span className="coral-text">✳</span>
        </span>
      </footer>
      <QuickContact open={quickOpen} onClose={() => setQuickOpen(false)} onSent={messageSent} />
      <Toast message={toast} />
      <ScrollRestoration />
    </MotionConfig>
  );
}
