import { AnimatePresence, motion } from 'motion/react';
import { easeOut } from '../lib/motion';

// A short confirmation in the corner. The live region stays in the page so each message is
// announced as it appears; nothing in it is interactive, so it can leave on its own.
export default function Toast({ message }: { message: string | null }) {
  return (
    <div className="toast-region" role="status">
      <AnimatePresence>
        {message && (
          <motion.p
            key={message}
            className="toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <span className="toast-mark" aria-hidden="true">
              ✓
            </span>
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
