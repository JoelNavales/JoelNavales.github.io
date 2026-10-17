import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils } from 'three';
import type { Group } from 'three';
import { Ball, Camera, Controller, King } from './objects';
import type { SceneProps } from './types';

function Stage({ hovered, reduced, pointer, drag, onHover, onTap, onReady }: SceneProps) {
  const group = useRef<Group>(null!);
  const announced = useRef(false);
  // Narrow screens get the same composition, scaled down to fit.
  const fit = useThree((state) => Math.min(1, state.size.width / state.size.height / 1.35));

  useFrame((state, delta) => {
    if (!announced.current) {
      announced.current = true;
      onReady();
    }
    const spin = drag.current;
    if (!spin.active) spin.offset = MathUtils.damp(spin.offset, 0, 1.6, delta);
    // The whole group leans a little toward the mouse, anywhere on the page.
    const targetY = spin.offset + (reduced ? 0 : pointer.current.x * 0.25);
    const targetX = reduced ? 0 : -pointer.current.y * 0.08;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetY, 5, delta);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, targetX, 5, delta);
    if (Math.abs(group.current.rotation.y - targetY) > 0.0005 || Math.abs(spin.offset) > 0.0005)
      state.invalidate();
  });

  const shared = { reduced, onHover, onTap };
  return (
    <group ref={group} scale={fit} position={[0, 0.3, 0]}>
      <Controller
        position={[-1.05, 0.22, 0]}
        rotation={[0.12, 0.25, -0.14]}
        hovered={hovered === 'controller'}
        {...shared}
      />
      <Camera
        position={[1.1, -0.48, 0.45]}
        rotation={[0.14, -0.58, 0.04]}
        hovered={hovered === 'camera'}
        {...shared}
      />
      <King
        position={[-0.1, -0.62, -1.05]}
        rotation={[0, 0.3, 0.05]}
        hovered={hovered === 'king'}
        {...shared}
      />
      <Ball
        position={[-0.5, -1, 0.95]}
        rotation={[0.3, 0.4, 0]}
        hovered={hovered === 'ball'}
        {...shared}
      />
    </group>
  );
}

export default function HeroScene(props: SceneProps) {
  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      camera={{ fov: 30, position: [0, 0.35, 6.3] }}
      frameloop={props.paused ? 'never' : props.reduced ? 'demand' : 'always'}
      gl={{ powerPreference: 'low-power', alpha: true }}
      onCreated={(state) => {
        state.gl.setClearColor(0x000000, 0);
        props.invalidate.current = state.invalidate;
      }}
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[-2.5, 4, 5]} intensity={2.5} />
      <Stage {...props} />
    </Canvas>
  );
}
