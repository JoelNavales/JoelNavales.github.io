import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { PointerEvent } from 'react';
import type { Project } from '../data';
import { followSpring } from '../lib/motion';
import { Arrow } from './Icons';

// The card tilts toward the mouse while the artwork drifts the other way, for a little depth.
export default function ProjectCover({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const hover = useSpring(0, followSpring);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [5, -5]), followSpring);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-7, 7]), followSpring);
  const artX = useSpring(useTransform(pointerX, [0, 1], [5, -5]), followSpring);
  const artY = useSpring(useTransform(pointerY, [0, 1], [4, -4]), followSpring);
  const artScale = useTransform(hover, [0, 1], [1.03, 1.08]);

  function track(event: PointerEvent<HTMLButtonElement>) {
    if (reduced || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - box.left) / box.width);
    pointerY.set((event.clientY - box.top) / box.height);
    hover.set(1);
  }

  function reset() {
    pointerX.set(0.5);
    pointerY.set(0.5);
    hover.set(0);
  }

  return (
    <motion.button
      className="project-cover"
      onClick={onOpen}
      onPointerMove={track}
      onPointerLeave={reset}
      aria-label={`Explore ${project.title}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      <motion.img
        src={project.image}
        alt={`Original concept artwork for ${project.title}`}
        loading="lazy"
        width="900"
        height="650"
        style={{ x: artX, y: artY, scale: artScale }}
      />
      <span className="project-status">
        <span />
        {project.status} <em>· concept art</em>
      </span>
      <span className="project-open">
        <Arrow diagonal />
      </span>
    </motion.button>
  );
}
