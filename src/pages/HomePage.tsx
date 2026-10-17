import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { projects, toolkit } from '../data';
import type { Project } from '../data';
import { Arrow } from '../components/Icons';
import HomePortrait from '../components/HomePortrait';
import LineReveal from '../components/LineReveal';
import Magnetic from '../components/Magnetic';
import Marquee from '../components/Marquee';
import ProjectDialog from '../components/ProjectDialog';
import TypingText from '../components/TypingText';
import WorkList from '../components/WorkList';
import { easeOut, fadeUp, fadeUpAfter, inView, staggered } from '../lib/motion';

// The underline is drawn as two pen strokes, once the word "heart" has risen into place.
const stroke = (delay: number): Variants => ({
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { delay, duration: 0.55, ease: easeOut } },
});

export default function HomePage() {
  const [localTime, setLocalTime] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  useEffect(() => {
    const updateTime = () =>
      setLocalTime(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Manila',
        }).format(new Date()),
      );
    updateTime();
    const timer = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="portfolio-page page-home">
      <section id="home" className="hero section-shell">
        <motion.div className="hero-topline" initial="hidden" animate="show" variants={fadeUp}>
          <span className="eyebrow">
            <span className="status-dot" /> <TypingText text="HELLO, I’M JOEL NAVALES" />
          </span>
          <span className="hero-location mono">
            CEBU, PH <span className="location-star">✳</span>
            <span className="clock">
              <AnimatePresence initial={false}>
                <motion.span
                  key={localTime}
                  initial={{ y: '-100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: easeOut }}
                >
                  {localTime}
                </motion.span>
              </AnimatePresence>
            </span>
            PHT
          </span>
        </motion.div>
        <div className="hero-grid">
          <motion.div
            className="hero-copy"
            initial="hidden"
            animate="show"
            variants={staggered(0.09, 0.05)}
          >
            <h1 tabIndex={-1}>
              <LineReveal
                lines={[
                  'A curious mind.',
                  'A builder',
                  <>
                    at{' '}
                    <span className="heart-word">
                      heart
                      <svg
                        viewBox="0 0 270 20"
                        preserveAspectRatio="none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <motion.path d="M4 12Q130-5 264 9" variants={stroke(0.55)} />
                        <motion.path d="M14 17Q136 7 237 14" variants={stroke(0.8)} />
                      </svg>
                    </span>
                    <span className="coral-text">.</span>
                  </>,
                ]}
              />
            </h1>
            <motion.p variants={fadeUp}>
              I turn ideas into web and mobile experiences.
              <br className="desktop-break" /> A fourth-year BSIT student, learning by building
              <br className="desktop-break" /> and caring about the little details.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <Magnetic>
                <Link className="button button-dark" to="/work" viewTransition>
                  Explore my work <Arrow />
                </Link>
              </Magnetic>
              <Link className="text-link" to="/about" viewTransition>
                A little about me <span aria-hidden="true">↘</span>
              </Link>
            </motion.div>
          </motion.div>
          <HomePortrait />
        </div>
        <motion.div
          className="hero-bottom"
          initial="hidden"
          animate="show"
          variants={fadeUpAfter(0.6)}
        >
          <span className="mono">CODE. DESIGN. LEARN. REPEAT.</span>
          <Link to="/work" viewTransition className="scroll-cue mono">
            NEXT: MY WORK <span aria-hidden="true">↗</span>
          </Link>
        </motion.div>
      </section>

      <motion.div
        className="tool-strip"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <span className="mono">MY EVERYDAY TOOLKIT</span>
        <Marquee items={toolkit} />
      </motion.div>

      <section className="home-work section-shell section-space" aria-labelledby="home-work-title">
        <motion.div
          className="home-section-head"
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={staggered(0.1)}
        >
          <h2 id="home-work-title">
            <LineReveal lines={['Things I’m building']} />
          </h2>
          <motion.div variants={fadeUp}>
            <Link className="text-link" to="/work" viewTransition>
              All projects and skills <Arrow diagonal />
            </Link>
          </motion.div>
        </motion.div>
        <WorkList projects={projects} onOpen={setSelectedProject} />
      </section>

      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
