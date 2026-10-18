import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { PanInfo, Variants } from 'motion/react';
import { Arrow } from './Icons';
import { easeOut } from '../lib/motion';

export type CarouselPhoto = {
  src: string;
  alt: string;
  caption: string;
  position?: string;
};

// Each slide arrives from the side it was asked for; `direction` is 1 for next, -1 for previous.
const slide: Variants = {
  enter: (direction: number) => ({ x: `${direction * 100}%` }),
  center: { x: '0%', transition: { duration: 0.7, ease: easeOut } },
  exit: (direction: number) => ({
    x: `${direction * -100}%`,
    transition: { duration: 0.7, ease: easeOut },
  }),
};

const fade: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// A drag counts as a swipe once it travels this far or is flicked this fast.
const swipeDistance = 60;
const swipeVelocity = 400;

export default function PhotoCarousel({
  photos,
  label,
}: {
  photos: CarouselPhoto[];
  label: string;
}) {
  const reduced = useReducedMotion();
  const [[index, direction], setSlide] = useState([0, 1]);
  const photo = photos[index];

  const go = (step: number) =>
    setSlide(([current]) => [(current + step + photos.length) % photos.length, step]);
  const show = (target: number) => setSlide(([current]) => [target, target > current ? 1 : -1]);

  // Fetch the neighbours ahead of time so a slide never arrives half-loaded.
  useEffect(() => {
    for (const step of [1, -1]) {
      new Image().src = photos[(index + step + photos.length) % photos.length].src;
    }
  }, [index, photos]);

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    if (offset.x < -swipeDistance || velocity.x < -swipeVelocity) go(1);
    else if (offset.x > swipeDistance || velocity.x > swipeVelocity) go(-1);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') go(1);
    else if (event.key === 'ArrowLeft') go(-1);
  };

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div className="carousel-frame">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            style={{ objectPosition: photo.position }}
            draggable={false}
            custom={direction}
            variants={reduced ? fade : slide}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
          />
        </AnimatePresence>
        <span className="carousel-count mono" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </span>
      </div>
      <div className="carousel-progress">
        {photos.map((item, itemIndex) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Show photo ${itemIndex + 1}: ${item.caption}`}
            aria-current={itemIndex === index}
            onClick={() => show(itemIndex)}
          />
        ))}
      </div>
      <div className="carousel-bar">
        <p className="carousel-caption" aria-live="polite">
          {photo.caption}
        </p>
        <div className="carousel-controls">
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)}>
            <Arrow className="arrow-back" />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => go(1)}>
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
}
