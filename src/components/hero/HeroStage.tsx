import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { AnimatePresence, motion, useAnimate, useInView, useReducedMotion } from 'motion/react';
import { easeOut } from '../../lib/motion';
import HeroArtwork from '../HeroArtwork';
import type { HeroObject } from './types';

// three.js only downloads when the About page asks for it.
const HeroScene = lazy(() => import('./HeroScene'));

const captions: Record<HeroObject, [string, string]> = {
  controller: ['GAMING', 'COD & Tekken. Tap for a little rumble.'],
  camera: ['PHOTOGRAPHY', 'A Nikon Z50. Tap to take a shot.'],
  king: ['CHESS', 'Tap to tip the king over.'],
  ball: ['FOOTBALL', 'Tap to kick it.'],
};

function supportsWebGL2() {
  try {
    const context = document.createElement('canvas').getContext('webgl2');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function HeroStage() {
  const [webgl] = useState(supportsWebGL2);
  // Without WebGL, or if the scene fails, the original illustration takes its place.
  if (!webgl) return <HeroArtwork />;
  return (
    <SceneBoundary fallback={<HeroArtwork />}>
      <InteractiveStage />
    </SceneBoundary>
  );
}

function InteractiveStage() {
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage);
  const reduced = useReducedMotion() ?? false;
  const [flash, animateFlash] = useAnimate<HTMLDivElement>();
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState<HeroObject | null>(null);
  const [pinned, setPinned] = useState<HeroObject | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const drag = useRef({ offset: 0, active: false });
  const invalidate = useRef<() => void>(() => {});
  const hoverTimer = useRef<number>(undefined);
  const pinTimer = useRef<number>(undefined);
  const lastShot = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const follow = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = 1 - (event.clientY / window.innerHeight) * 2;
    };
    window.addEventListener('pointermove', follow, { passive: true });
    return () => window.removeEventListener('pointermove', follow);
  }, [reduced]);

  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(pinTimer.current);
    },
    [],
  );

  function hover(object: HeroObject | null) {
    window.clearTimeout(hoverTimer.current);
    if (object) setHovered(object);
    // A short grace period keeps the caption from flickering between neighbouring objects.
    else hoverTimer.current = window.setTimeout(() => setHovered(null), 90);
  }

  function tap(object: HeroObject) {
    // Touch has no hover, so a tap keeps its caption up for a moment.
    window.clearTimeout(pinTimer.current);
    setPinned(object);
    pinTimer.current = window.setTimeout(() => setPinned(null), 2800);
    if (object === 'camera') shoot();
  }

  function shoot() {
    const now = performance.now();
    // At most one flash every 0.8s, well under the three-per-second photosensitivity limit.
    if (reduced || now - lastShot.current < 800) return;
    lastShot.current = now;
    animateFlash(
      flash.current,
      { opacity: [0, 0.8, 0] },
      { duration: 0.55, times: [0, 0.1, 1], ease: 'easeOut' },
    );
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    const startX = event.clientX;
    const startOffset = drag.current.offset;
    drag.current.active = true;
    setDragging(true);
    const move = (moveEvent: PointerEvent) => {
      const offset = startOffset + (moveEvent.clientX - startX) * 0.007;
      drag.current.offset = Math.max(-1.1, Math.min(1.1, offset));
      invalidate.current();
    };
    const end = () => {
      drag.current.active = false;
      setDragging(false);
      invalidate.current();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  }

  const active = hovered ?? pinned;
  const [label, text] = active
    ? captions[active]
    : ['MY INTERESTS', 'Drag to turn. Tap an object to learn more.'];

  return (
    <motion.div
      ref={stage}
      className="hero-art hero-stage"
      role="img"
      aria-label="Interactive 3D illustration of my interests: a gaming controller, a camera, a chess king and a football."
      style={{ cursor: hovered ? 'pointer' : dragging ? 'grabbing' : 'grab' }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={ready ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.9, ease: easeOut }}
      onPointerDown={startDrag}
    >
      <Suspense fallback={null}>
        <HeroScene
          hovered={hovered}
          reduced={reduced}
          paused={!visible}
          pointer={pointer}
          drag={drag}
          invalidate={invalidate}
          onHover={hover}
          onTap={tap}
          onReady={() => setReady(true)}
        />
      </Suspense>
      <div ref={flash} className="stage-flash" />
      <div className="stage-caption">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: easeOut }}
          >
            <span className="mono">{label}</span>
            {text}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
