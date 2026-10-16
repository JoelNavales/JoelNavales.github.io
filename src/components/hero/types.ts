import type { RefObject } from 'react';

export type HeroObject = 'phone' | 'camera' | 'king' | 'ball';

export type SceneProps = {
  projectIndex: number;
  hovered: HeroObject | null;
  reduced: boolean;
  paused: boolean;
  // Written by the page, read every frame, so they live in refs instead of state.
  pointer: RefObject<{ x: number; y: number }>;
  drag: RefObject<{ offset: number; active: boolean }>;
  invalidate: RefObject<() => void>;
  onHover: (object: HeroObject | null) => void;
  onTap: (object: HeroObject) => void;
  onReady: () => void;
};
