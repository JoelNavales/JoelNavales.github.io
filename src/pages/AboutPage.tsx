import { lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { socials } from '../data';
import { Arrow, Asterisk } from '../components/Icons';
import LineReveal from '../components/LineReveal';
import { easeOut, fadeUp, inView, rise, staggered } from '../lib/motion';

// The Formspree client only downloads when this page is shown, not with every page.
const ContactForm = lazy(() => import('../components/ContactForm'));

// The portrait is uncovered from the bottom up, like the headline lines beside it,
// while the photo settles from a slight zoom.
const uncover: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.1, ease: easeOut, delay: 0.2 },
    transitionEnd: { clipPath: 'none' },
  },
};
const settle: Variants = {
  hidden: { scale: 1.12 },
  show: { scale: 1, transition: { duration: 1.5, ease: easeOut, delay: 0.2 } },
};

export default function AboutPage() {
  // Reduced motion already drops transforms globally; the clip-path wipe needs opting out here.
  const reduced = useReducedMotion();

  return (
    <div className="portfolio-page page-about">
      <section id="about" className="about section-shell section-space">
        <div className="about-main">
          <motion.div
            className="about-heading"
            initial="hidden"
            animate="show"
            variants={staggered(0.09)}
          >
            <motion.span className="eyebrow" variants={fadeUp}>
              03 / THE PERSON BEHIND THE CODE
            </motion.span>
            <h1 tabIndex={-1}>
              <LineReveal
                lines={[
                  'A little code.',
                  'A lot of',
                  <span className="serif-word">curiosity.</span>,
                ]}
              />
              <Asterisk className="about-asterisk" />
            </h1>
            <motion.div className="education-label" variants={fadeUp}>
              <span className="education-icon" aria-hidden="true">
                ↗
              </span>
              <span>
                BS INFORMATION TECHNOLOGY
                <br />
                <span className="muted">University of San Jose–Recoletos · 4th year</span>
              </span>
            </motion.div>
          </motion.div>
          <motion.div
            className="about-portrait"
            initial={reduced ? false : 'hidden'}
            animate="show"
            variants={uncover}
          >
            <picture>
              <source
                type="image/webp"
                srcSet="/assets/pfp-480.webp 480w, /assets/pfp-800.webp 800w, /assets/pfp-1200.webp 1200w"
                sizes="(max-width: 760px) 88vw, 36vw"
              />
              <motion.img
                src="/assets/pfp-800.jpg"
                alt="Joel Navales in a black suit and white shirt, smiling"
                width="800"
                height="1200"
                fetchPriority="high"
                variants={settle}
              />
            </picture>
          </motion.div>
          <motion.div
            className="about-copy"
            initial="hidden"
            animate="show"
            variants={staggered(0.08, 0.3)}
          >
            <motion.p className="about-intro" variants={fadeUp}>
              I’m Joel Franco V. Navales, <br />a student developer from Cebu, <br />
              Philippines.
            </motion.p>
            <motion.p variants={fadeUp}>
              I like figuring out how things work—and how to make them work a little better. Right
              now, that means building real-world apps with Flutter, PHP/Laravel, and Firebase.
            </motion.p>
            <motion.p variants={fadeUp}>
              I’m also drawn to the design side of things. Exploring UI/UX with Figma and Canva
              helps me think beyond the code and about the people using it.
            </motion.p>
            <motion.a
              className="text-link light-link"
              href={socials[1].url}
              target="_blank"
              rel="noreferrer"
              variants={fadeUp}
            >
              More about me on LinkedIn <Arrow diagonal />
            </motion.a>
          </motion.div>
        </div>
        <motion.div
          className="beyond"
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={staggered(0.07)}
        >
          <motion.div className="beyond-title" variants={fadeUp}>
            <span className="eyebrow">AWAY FROM THE KEYBOARD</span>
            <p>Life has a few other tabs open.</p>
          </motion.div>
          <div className="interest-list">
            <motion.span variants={rise}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 7h5l2-3h4l2 3h5v13H3Zm13 6a4 4 0 1 0-8 0 4 4 0 0 0 8 0"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              Photography <small>Nikon Z50</small>
            </motion.span>
            <motion.span variants={rise}>
              <span aria-hidden="true">⚽</span> Football
            </motion.span>
            <motion.span variants={rise}>
              <span aria-hidden="true">♞</span> Chess
            </motion.span>
            <motion.span variants={rise}>
              <span aria-hidden="true">⌘</span> Gaming <small>COD & Tekken</small>
            </motion.span>
          </div>
        </motion.div>
      </section>

      <section id="contact" tabIndex={-1} className="contact section-shell section-space">
        <div className="contact-top">
          <span className="eyebrow">GOOD THINGS START WITH A HELLO</span>
          <span className="mono">LET’S CONNECT ↙</span>
        </div>
        <motion.div
          className="contact-main"
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={staggered(0.1)}
        >
          <div className="contact-heading">
            <h2>
              <LineReveal
                lines={[
                  'Got an idea?',
                  <>
                    Let’s <span className="serif-word">talk.</span>
                  </>,
                ]}
              />
              <Asterisk className="contact-asterisk" />
            </h2>
            <motion.p className="contact-lede" variants={fadeUp}>
              A project, a question, or just a hello.
              <br />
              I’d love to hear from you.
            </motion.p>
          </div>
          <motion.div className="contact-form-area" variants={fadeUp}>
            <Suspense fallback={<div className="contact-form-loading" />}>
              <ContactForm />
            </Suspense>
          </motion.div>
        </motion.div>
        <div className="contact-bottom">
          <span className="mono">ELSEWHERE ON THE INTERNET</span>
          <div className="social-links">
            {socials.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noreferrer">
                {social.name}
                <Arrow diagonal />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
