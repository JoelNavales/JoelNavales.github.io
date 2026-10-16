import { Fragment, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react';

// Two identical halves, each wider than the widest screen, so wrapping at -50% is seamless.
const COPIES = 6;

// An endless strip that drifts left, speeds up with scrolling and reverses on the way back up.
// It pauses under the mouse or with its button (WCAG 2.2.2), and stays still for reduced motion.
export default function Marquee({ items, speed = 1.2 }: { items: string[]; speed?: number }) {
  const viewport = useRef<HTMLDivElement>(null);
  const visible = useInView(viewport);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const hovering = useRef(false);
  const direction = useRef(-1);
  const offset = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollSpeed = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(scrollSpeed, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(offset, (value) => `${wrap(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced || paused || hovering.current || !visible) return;
    const extra = boost.get();
    if (extra < 0) direction.current = 1;
    else if (extra > 0) direction.current = -1;
    // `speed` is a percentage of the track per second.
    offset.set(offset.get() + direction.current * speed * (delta / 1000) * (1 + Math.abs(extra)));
  });

  const separated = (copy: number) =>
    items.map((item) => (
      <Fragment key={`${copy}-${item}`}>
        <span>{item}</span>
        <span className="strip-star">✳</span>
      </Fragment>
    ));

  if (reduced) {
    return (
      <ul className="marquee is-static">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="marquee"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') hovering.current = true;
      }}
      onPointerLeave={() => {
        hovering.current = false;
      }}
    >
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="marquee-viewport" ref={viewport} aria-hidden="true">
        <motion.div className="marquee-track" style={{ x }}>
          {Array.from({ length: COPIES }, (_, copy) => separated(copy))}
        </motion.div>
      </div>
      <button
        className="marquee-toggle mono"
        type="button"
        aria-label={paused ? 'Play the toolkit animation' : 'Pause the toolkit animation'}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? 'PLAY' : 'PAUSE'}
      </button>
    </div>
  );
}
