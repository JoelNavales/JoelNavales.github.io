import { lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { achievementPhotos, achievements, email, resumeUrl, socials } from '../data';
import { Arrow } from '../components/Icons';
import AboutVisual from '../components/AboutVisual';
import LineReveal from '../components/LineReveal';
import PhotoCarousel from '../components/PhotoCarousel';
import { fadeUp, inView, rise, staggered } from '../lib/motion';

// The Formspree client only downloads when this page is shown, not with every page.
const ContactForm = lazy(() => import('../components/ContactForm'));

export default function AboutPage() {
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
            <h1 tabIndex={-1}>
              <LineReveal
                lines={[
                  'A little code.',
                  'A lot of',
                  <span className="serif-word">curiosity.</span>,
                ]}
              />
            </h1>
            <motion.div className="education-label" variants={fadeUp}>
              <span className="education-icon" aria-hidden="true">
                <Arrow diagonal />
              </span>
              <span>
                BS INFORMATION TECHNOLOGY
                <br />
                <span className="muted">University of San Jose–Recoletos · 4th year</span>
              </span>
            </motion.div>
          </motion.div>
          <AboutVisual />
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
          id="sensoil"
          tabIndex={-1}
          className="achievements"
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={staggered(0.08)}
        >
          <div className="achievements-head">
            <h2>
              <LineReveal
                lines={[
                  'It started',
                  <>
                    in the <span className="serif-word">soil.</span>
                  </>,
                ]}
              />
            </h2>
            <motion.p variants={fadeUp}>
              For our senior high STEM capstone, Team Sereen ran a feasibility study on{' '}
              <strong>SenSOIL</strong>, a smart farming soil nutrient sensor meant to support
              farmers in Brgy. Taptap, Cebu City. We presented and defended it at the 5th Josenian
              SHS Research Summit at the University of San Jose–Recoletos, and came home with three
              awards.
            </motion.p>
          </div>
          <motion.div className="achievement-photos" variants={fadeUp}>
            <PhotoCarousel photos={achievementPhotos} label="Photos from the research summit" />
          </motion.div>
          <ol className="award-list">
            {achievements.map((award, index) => (
              <motion.li key={award.title} variants={fadeUp}>
                <span className="award-number mono">0{index + 1}</span>
                <div>
                  <h3>{award.title}</h3>
                  <span className="award-meta mono">{award.meta}</span>
                  <p>{award.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
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
            </h2>
            <motion.p className="contact-lede" variants={fadeUp}>
              A project, a question, or just a hello.
              <br />
              I’d love to hear from you.
            </motion.p>
            <motion.div className="contact-direct" variants={fadeUp}>
              <a className="closing-email" href={`mailto:${email}`}>
                {email}
              </a>
              <a className="text-link" href={resumeUrl} target="_blank" rel="noreferrer">
                Résumé (PDF) <Arrow diagonal />
              </a>
            </motion.div>
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
