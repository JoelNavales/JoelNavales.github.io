import { useEffect, useRef } from 'react';
import { motion, useAnimate, useReducedMotion } from 'motion/react';
import type { Project } from '../data';
import { easeOut, fadeUp, staggered } from '../lib/motion';
import { Arrow } from './Icons';

export default function ProjectDialog({
  project = null,
  onClose = () => {},
}: {
  project?: Project | null;
  onClose?: () => void;
}) {
  const [dialog, animate] = useAnimate<HTMLDialogElement>();
  const reduced = useReducedMotion();
  const closing = useRef(false);

  useEffect(() => {
    if (!project) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    closing.current = false;
    delete element.dataset.closing;
    element.showModal();
    document.body.style.overflow = 'hidden';
    animate(
      element,
      { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] },
      { duration: reduced ? 0 : 0.5, ease: easeOut },
    );
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [project, dialog, animate, reduced]);

  // Play the exit before the native dialog closes, so it doesn't vanish mid-frame.
  async function close() {
    if (closing.current) return;
    closing.current = true;
    dialog.current.dataset.closing = '';
    if (!reduced)
      await animate(
        dialog.current,
        { opacity: 0, y: 16, scale: 0.98 },
        { duration: 0.2, ease: [0.4, 0, 1, 1] },
      );
    onClose();
  }

  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="project-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
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
          close();
      }}
    >
      {project && (
        <>
          <button
            className="dialog-close"
            aria-label="Close project details"
            onClick={close}
            autoFocus
          >
            ×
          </button>
          <div className="dialog-art">
            <motion.img
              src={project.image}
              alt={`Concept illustration for ${project.title}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.9, ease: easeOut }}
            />
          </div>
          <motion.div
            className="dialog-copy"
            initial="hidden"
            animate="show"
            variants={staggered(0.06, 0.12)}
          >
            <motion.span className="eyebrow" variants={fadeUp}>
              {project.category} / {project.status}
            </motion.span>
            <motion.h2 id="project-title" variants={fadeUp}>
              {project.title}
            </motion.h2>
            <motion.p variants={fadeUp}>{project.detail}</motion.p>
            <motion.div className="tags" variants={fadeUp}>
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </motion.div>
            <motion.p className="art-disclosure" variants={fadeUp}>
              Cover artwork is a concept illustration, not an application screenshot.
            </motion.p>
            <motion.div className="dialog-actions" variants={fadeUp}>
              <a
                className="button button-dark"
                href={`mailto:navales546@gmail.com?subject=${encodeURIComponent(`Let’s talk about ${project.title}`)}`}
              >
                Let’s talk about this <Arrow diagonal />
              </a>
              {project.demo && (
                <a className="text-link" href={project.demo} target="_blank" rel="noreferrer">
                  Live demo <Arrow diagonal />
                </a>
              )}
              {project.repo && (
                <a className="text-link" href={project.repo} target="_blank" rel="noreferrer">
                  View on GitHub <Arrow diagonal />
                </a>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </dialog>
  );
}
