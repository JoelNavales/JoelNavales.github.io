import { useState } from 'react';
import type { PointerEvent } from 'react';
import { motion, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion/react';
import type { Project } from '../data';
import { easeOut, fadeUp, inView, staggered } from '../lib/motion';
import { Arrow } from './Icons';

const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = (PREVIEW_WIDTH * 650) / 900;
// Overdamped, so the preview trails the pointer without wobbling.
const trail = { stiffness: 300, damping: 34, mass: 0.6 };

// Project rows. With a mouse, the hovered project's cover floats beside the pointer and leans
// into the direction of travel.
export default function WorkList({
  projects,
  onOpen,
}: {
  projects: Project[];
  onOpen: (project: Project) => void;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const x = useSpring(0, trail);
  const y = useSpring(0, trail);
  const rotate = useTransform(useVelocity(x), [-1500, 1500], [-8, 8], { clamp: true });

  function place(event: PointerEvent, immediate = false) {
    // Beside the pointer, flipping to its left near the edge of the screen.
    const fitsRight = event.clientX + 32 + PREVIEW_WIDTH < window.innerWidth - 16;
    const left = fitsRight ? event.clientX + 32 : event.clientX - 32 - PREVIEW_WIDTH;
    const top = event.clientY - PREVIEW_HEIGHT / 2;
    if (immediate) {
      x.jump(left);
      y.jump(top);
    } else {
      x.set(left);
      y.set(top);
    }
  }

  return (
    <>
      <motion.ul
        className="work-list"
        initial="hidden"
        whileInView="show"
        viewport={inView}
        variants={staggered(0.08)}
        onPointerMove={(event) => {
          if (event.pointerType === 'mouse') place(event);
        }}
        onPointerLeave={() => setActive(null)}
      >
        {projects.map((project, index) => (
          <motion.li key={project.id} variants={fadeUp}>
            <button
              className="work-row"
              onClick={() => onOpen(project)}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'mouse') return;
                // Appear where the pointer is rather than flying in from the last spot.
                if (active === null) place(event, true);
                setActive(index);
              }}
            >
              <span className="work-row-number mono">{project.number}</span>
              <span className="work-row-title">{project.title}</span>
              <span className="work-row-meta">
                {project.category} · {project.status}
              </span>
              <Arrow diagonal />
            </button>
          </motion.li>
        ))}
      </motion.ul>
      {!reduced && (
        <motion.div
          className="work-preview"
          aria-hidden="true"
          style={{ x, y, rotate }}
          initial={false}
          animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.85 : 1 }}
          transition={{ duration: 0.25, ease: easeOut }}
        >
          {projects.map((project, index) => (
            <img
              key={project.id}
              src={project.image}
              alt=""
              style={{ opacity: index === active ? 1 : 0 }}
            />
          ))}
        </motion.div>
      )}
    </>
  );
}
