import { motion } from 'motion/react';
import { email, socials } from '../data';
import { useOpenContact } from '../lib/contact';
import { fadeUp, inView, staggered } from '../lib/motion';
import { preloadContactForm } from './QuickContact';
import { Arrow } from './Icons';

// Ends Home and Work with the ways to get in touch, so a visitor who has seen enough always
// has a next step. About ends on the full contact form instead.
export default function ClosingBand() {
  const openContact = useOpenContact();
  const linkedin = socials.find((social) => social.name === 'LinkedIn');

  return (
    <motion.section
      className="closing section-shell"
      aria-labelledby="closing-title"
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={staggered(0.08)}
    >
      <motion.div className="closing-copy" variants={fadeUp}>
        <h2 id="closing-title">Want to work together?</h2>
        <p>Email me or send a quick message.</p>
      </motion.div>
      <motion.div className="closing-actions" variants={fadeUp}>
        <a className="closing-email" href={`mailto:${email}`}>
          {email}
        </a>
        <div className="closing-links">
          <button
            type="button"
            className="button button-dark"
            onPointerEnter={preloadContactForm}
            onFocus={preloadContactForm}
            onClick={() => openContact()}
          >
            Send a message <Arrow />
          </button>
          {linkedin && (
            <a className="text-link" href={linkedin.url} target="_blank" rel="noreferrer">
              LinkedIn <Arrow diagonal />
            </a>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}
