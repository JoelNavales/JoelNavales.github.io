import { motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { easeOut } from '../lib/motion';
import { assetUrl } from '../lib/assets';
import './page-visuals.css';

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

export default function HomePortrait() {
  const reduced = useReducedMotion();

  return (
    <figure className="hero-art home-portrait">
      <motion.div
        className="home-portrait-frame"
        initial={reduced ? false : 'hidden'}
        animate="show"
        variants={uncover}
      >
        <picture>
          <source
            type="image/webp"
            srcSet={[480, 800, 1200]
              .map((width) => `${assetUrl(`assets/pfp-${width}.webp`)} ${width}w`)
              .join(', ')}
            sizes="(max-width: 760px) 42vw, (max-width: 1100px) 40vw, max(360px, 22.5vw)"
          />
          <motion.img
            src={assetUrl('assets/pfp-800.jpg')}
            alt="Joel Navales in a black suit and white shirt, smiling"
            width="800"
            height="1200"
            fetchPriority="high"
            variants={settle}
          />
        </picture>
      </motion.div>
      <figcaption className="home-portrait-caption">
        <span className="mono">JOEL NAVALES / CEBU, PH</span>
      </figcaption>
    </figure>
  );
}
