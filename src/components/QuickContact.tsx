import { lazy, Suspense, useEffect, useState } from 'react';
import { useAnimate, useReducedMotion } from 'motion/react';
import { easeOut } from '../lib/motion';

const ContactForm = lazy(() => import('./ContactForm'));

// Starts fetching the form early (on hover or focus of the button) so it opens ready to type.
export function preloadContactForm() {
  void import('./ContactForm');
}

// The header's "Let's talk" opens this: the contact form in a panel over the current page,
// dropping in under the button on desktop and sliding up as a sheet on phones. Once opened it
// stays mounted, so a half-written message survives closing the panel by accident.
export default function QuickContact({
  open,
  topic,
  onClose,
  onSent,
}: {
  open: boolean;
  // The project the visitor asked about, if any.
  topic?: string;
  onClose: () => void;
  onSent: () => void;
}) {
  const [panel, animate] = useAnimate<HTMLDialogElement>();
  const reduced = useReducedMotion();
  const [used, setUsed] = useState(open);
  if (open && !used) setUsed(true);

  useEffect(() => {
    const dialog = panel.current;
    if (open === dialog.open) return;
    const sheet = window.matchMedia('(max-width: 760px)').matches;
    if (open) {
      delete dialog.dataset.closing;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      // With a mouse and keyboard, start typing straight away; on touch, don't pop the keyboard.
      if (window.matchMedia('(pointer: fine)').matches) dialog.querySelector('input')?.focus();
      animate(
        dialog,
        sheet ? { y: ['100%', '0%'] } : { opacity: [0, 1], y: [-12, 0], scale: [0.97, 1] },
        { duration: reduced ? 0 : sheet ? 0.4 : 0.35, ease: easeOut },
      );
    } else {
      dialog.dataset.closing = '';
      animate(dialog, sheet ? { y: '100%' } : { opacity: 0, y: -8, scale: 0.98 }, {
        duration: reduced ? 0 : 0.2,
        ease: [0.4, 0, 1, 1],
      }).then(() => {
        dialog.close();
        document.body.style.overflow = '';
      });
    }
  }, [open, panel, animate, reduced]);

  return (
    <dialog
      ref={panel}
      className="quick-contact"
      aria-labelledby="quick-contact-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <div className="quick-head">
        <h2 id="quick-contact-title">Let’s talk</h2>
        <p>A project, a question, or just a hello.</p>
      </div>
      <button className="dialog-close" aria-label="Close the message form" onClick={onClose}>
        ×
      </button>
      {used && (
        <Suspense fallback={<div className="contact-form-loading" />}>
          {/* The first time, the form mounts after the panel opens, so it focuses itself. */}
          <ContactForm
            idPrefix="quick"
            topic={topic}
            autoFocus={window.matchMedia('(pointer: fine)').matches}
            onSent={onSent}
          />
        </Suspense>
      )}
    </dialog>
  );
}
