import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { achievementPhotos, achievements, projects } from '../data';
import type { Project } from '../data';
import ClosingBand from '../components/ClosingBand';
import { Arrow } from '../components/Icons';
import HomePortrait from '../components/HomePortrait';
import LineReveal from '../components/LineReveal';
import Magnetic from '../components/Magnetic';
import ProjectDialog from '../components/ProjectDialog';
import TypingText from '../components/TypingText';
import WorkList from '../components/WorkList';
import { easeOut, fadeUp, inView, staggered } from '../lib/motion';

// The underline is drawn as two pen strokes, once the word "apps" has risen into place.
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
            <TypingText text="HELLO, I’M JOEL NAVALES" />
          </span>
          <span className="hero-location mono">
            CEBU, PH
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
                  'It started with',
                  'a soil sensor.',
                  <>
                    Now I build{' '}
                    <span className="heart-word">
                      apps
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
              In senior high, my team’s research on SenSOIL, a soil nutrient sensor for farmers in
              Brgy. Taptap, Cebu, won three awards. Now I’m a fourth-year BSIT student building web
              and mobile apps with Flutter, Laravel, React and Firebase.
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <Magnetic>
                <Link className="button button-dark" to="/work" viewTransition>
                  Explore my work <Arrow />
                </Link>
              </Magnetic>
              <Link className="text-link" to="/about#sensoil" viewTransition>
                The SenSOIL story <Arrow diagonal />
              </Link>
            </motion.div>
          </motion.div>
          <HomePortrait />
        </div>
      </section>

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

      <motion.section
        className="home-sensoil section-shell section-space"
        aria-labelledby="home-sensoil-title"
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={staggered(0.08)}
      >
        <motion.figure className="home-sensoil-photo" variants={fadeUp}>
          <img
            src={achievementPhotos[0].src}
            alt={achievementPhotos[0].alt}
            loading="lazy"
            width="1100"
            height="825"
          />
          <figcaption>{achievementPhotos[0].caption}, April 2023</figcaption>
        </motion.figure>
        <div className="home-sensoil-copy">
          <h2 id="home-sensoil-title">
            <LineReveal
              lines={[
                'Three awards',
                <>
                  for a <span className="serif-word">soil</span> sensor.
                </>,
              ]}
            />
          </h2>
          <motion.p variants={fadeUp}>
            Team Sereen’s feasibility study on SenSOIL, a smart farming sensor for soil nutrients,
            took three prizes at the 5th Josenian SHS Research Summit.
          </motion.p>
          <motion.ul className="home-sensoil-awards" variants={fadeUp}>
            {achievements.map((award) => (
              <li key={award.title}>{award.title}</li>
            ))}
          </motion.ul>
          <motion.div variants={fadeUp}>
            <Link className="text-link" to="/about#sensoil" viewTransition>
              Photos and the full story <Arrow diagonal />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <ClosingBand />

      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
