import { useRef } from 'react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { easeOut } from '../lib/motion';

const rise: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.95, ease: easeOut } },
};

// One line that slides up from behind a mask. The mask only clips while the line is moving;
// left in place it can shave italic overhangs and leave hairline seams in some renderers.
function MaskedLine({ children }: { children: ReactNode }) {
  const mask = useRef<HTMLSpanElement>(null);
  return (
    <span className="line-mask" ref={mask}>
      <motion.span
        className="line"
        variants={rise}
        onAnimationComplete={() => mask.current?.classList.add('is-open')}
      >
        {children}{' '}
      </motion.span>
    </span>
  );
}

// The surrounding motion element sets the timing; the trailing space (collapsed at the line end)
// keeps the heading's text intact for screen readers.
export default function LineReveal({ lines }: { lines: ReactNode[] }) {
  return lines.map((line, index) => <MaskedLine key={index}>{line}</MaskedLine>);
}
