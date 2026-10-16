import { motion, useReducedMotion, useSpring } from 'motion/react';
import type { PointerEvent, ReactNode } from 'react';
import { followSpring } from '../lib/motion';

// Leans the wrapped control toward a mouse pointer. Touch and reduced motion get a still control.
export default function Magnetic({ children, pull = 0.3 }: { children: ReactNode; pull?: number }) {
  const reduced = useReducedMotion();
  const x = useSpring(0, followSpring);
  const y = useSpring(0, followSpring);

  function follow(event: PointerEvent<HTMLSpanElement>) {
    if (reduced || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - box.left - box.width / 2) * pull);
    y.set((event.clientY - box.top - box.height / 2) * pull);
  }

  function settle() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      className="magnetic"
      style={{ x, y }}
      onPointerMove={follow}
      onPointerLeave={settle}
    >
      {children}
    </motion.span>
  );
}
