import type { Variants } from 'motion/react';

// One curve for everything that enters: quick start, long soft landing, no overshoot.
export const easeOut = [0.22, 1, 0.36, 1] as const;

// Critically damped, so followers settle without wobbling.
export const followSpring = { stiffness: 200, damping: 26, mass: 0.8 };

export const fadeUpAfter = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut, delay } },
});

export const fadeUp = fadeUpAfter();

// A smaller lift for chips and tags.
export const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

export const staggered = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

// Start a little before the element is fully on screen, and only once.
export const inView = { once: true, margin: '0px 0px -12% 0px' } as const;
