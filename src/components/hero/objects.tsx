import { useFrame } from '@react-three/fiber';
import type { ThreeElements } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import type { HeroObject } from './types';

// The palette of the project cover illustrations, so the 3D pieces read as the same drawings.
const palette = {
  ink: '#25251f',
  charcoal: '#3a3c36',
  paper: '#f6f1e6',
  coral: '#f08b75',
  cobalt: '#3859d8',
  lime: '#dbec81',
  steel: '#7b7d72',
  glass: '#22307a',
};

// Three flat bands of light instead of a smooth gradient: cel shading.
const bands = new THREE.DataTexture(new Uint8Array([120, 195, 255]), 3, 1, THREE.RedFormat);
bands.minFilter = THREE.NearestFilter;
bands.magFilter = THREE.NearestFilter;
bands.needsUpdate = true;

const toonMaterials = new Map<string, THREE.MeshToonMaterial>();
function toon(color: string) {
  let material = toonMaterials.get(color);
  if (!material) {
    material = new THREE.MeshToonMaterial({ color, gradientMap: bands });
    toonMaterials.set(color, material);
  }
  return material;
}

// Ink outlines: a slightly inflated, inside-out copy of each part (the "inverted hull" trick).
const outlineMaterial = new THREE.MeshBasicMaterial({ color: palette.ink, side: THREE.BackSide });
outlineMaterial.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    '#include <begin_vertex>\n\ttransformed += normalize( normal ) * 0.024;',
  );
};

const hulls = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
function hullOf(geometry: THREE.BufferGeometry) {
  let hull = hulls.get(geometry);
  if (!hull) {
    // Welding by position smooths the normals, so hard edges don't split the outline open.
    const shape = new THREE.BufferGeometry();
    shape.setAttribute('position', geometry.getAttribute('position'));
    shape.setIndex(geometry.getIndex());
    hull = mergeVertices(shape);
    hull.computeVertexNormals();
    hulls.set(geometry, hull);
  }
  return hull;
}

function faceted(geometry: THREE.BufferGeometry) {
  const flat = geometry.toNonIndexed();
  flat.computeVertexNormals();
  return flat;
}

function roundedRect(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function slab(width: number, height: number, radius: number, depth: number, bevel: number) {
  return new THREE.ExtrudeGeometry(roundedRect(width, height, radius), {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 10,
  }).center();
}

// A single curved shell gives the controller its two distinctive hand grips.
function controllerShell() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.5, 0.4);
  shape.lineTo(0.5, 0.4);
  shape.bezierCurveTo(0.73, 0.4, 0.8, 0.2, 0.87, -0.37);
  shape.bezierCurveTo(0.93, -0.72, 0.67, -0.78, 0.51, -0.51);
  shape.lineTo(0.32, -0.24);
  shape.quadraticCurveTo(0, -0.12, -0.32, -0.24);
  shape.lineTo(-0.51, -0.51);
  shape.bezierCurveTo(-0.67, -0.78, -0.93, -0.72, -0.87, -0.37);
  shape.bezierCurveTo(-0.8, 0.2, -0.73, 0.4, -0.5, 0.4);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.055,
    bevelSegments: 4,
    curveSegments: 16,
  }).translate(0, 0, -0.11);
}

const kingProfile = [
  [0, 0],
  [0.46, 0],
  [0.47, 0.06],
  [0.42, 0.1],
  [0.43, 0.15],
  [0.34, 0.21],
  [0.25, 0.27],
  [0.21, 0.42],
  [0.18, 0.66],
  [0.17, 0.88],
  [0.27, 0.92],
  [0.28, 0.97],
  [0.19, 1.01],
  [0.2, 1.06],
  [0.3, 1.22],
  [0.31, 1.29],
  [0.24, 1.34],
  [0.11, 1.38],
  [0, 1.39],
].map(([x, y]) => new THREE.Vector2(x, y));

const shapes = {
  controller: controllerShell(),
  touchpad: slab(0.53, 0.27, 0.06, 0.035, 0.012),
  shoulder: new RoundedBoxGeometry(0.38, 0.12, 0.24, 3, 0.04),
  dpadVertical: new RoundedBoxGeometry(0.095, 0.32, 0.065, 2, 0.015),
  dpadHorizontal: new RoundedBoxGeometry(0.32, 0.095, 0.065, 2, 0.015),
  button: new THREE.CylinderGeometry(0.065, 0.065, 0.055, 24).rotateX(Math.PI / 2),
  stickBase: new THREE.CylinderGeometry(0.145, 0.145, 0.055, 32).rotateX(Math.PI / 2),
  stick: new THREE.CylinderGeometry(0.105, 0.12, 0.085, 32).rotateX(Math.PI / 2),
  lightBar: new RoundedBoxGeometry(0.4, 0.025, 0.025, 2, 0.01),
  body: new RoundedBoxGeometry(1.42, 0.9, 0.48, 5, 0.1),
  grip: new RoundedBoxGeometry(0.36, 0.84, 0.3, 5, 0.12),
  viewfinder: faceted(
    new THREE.CylinderGeometry(0.2, 0.3, 0.26, 4).rotateY(Math.PI / 4).scale(1.5, 1, 0.9),
  ),
  mount: new THREE.CylinderGeometry(0.4, 0.4, 0.08, 48).rotateX(Math.PI / 2),
  barrel: new THREE.CylinderGeometry(0.34, 0.36, 0.4, 48).rotateX(Math.PI / 2),
  focusRing: new THREE.CylinderGeometry(0.365, 0.365, 0.12, 48).rotateX(Math.PI / 2),
  glass: new THREE.CircleGeometry(0.27, 48),
  glint: new THREE.CircleGeometry(0.055, 24),
  shutter: new THREE.CylinderGeometry(0.075, 0.075, 0.06, 24),
  dial: new THREE.CylinderGeometry(0.14, 0.14, 0.09, 24),
  king: new THREE.LatheGeometry(kingProfile, 48),
  crossUpright: new RoundedBoxGeometry(0.09, 0.3, 0.09, 2, 0.02),
  crossArm: new RoundedBoxGeometry(0.26, 0.09, 0.09, 2, 0.02),
  ball: new THREE.SphereGeometry(0.42, 48, 32),
  shadow: new THREE.CircleGeometry(1, 48).rotateX(-Math.PI / 2),
};

const glintMaterial = new THREE.MeshBasicMaterial({ color: palette.paper });

// Football panels drawn in the shader. Pentagons sit on the 12 corners of an icosahedron and
// hexagons on its 20 faces; a ray from the centre exits a truncated icosahedron through whichever
// face plane it meets first, and the two plane distances below come from that solid.
const icosahedron = new THREE.IcosahedronGeometry(1, 0).getAttribute('position');
const corners: THREE.Vector3[] = [];
const faces: THREE.Vector3[] = [];
for (let i = 0; i < icosahedron.count; i += 3) {
  const triangle = [0, 1, 2].map((offset) =>
    new THREE.Vector3().fromBufferAttribute(icosahedron, i + offset),
  );
  faces.push(triangle[0].clone().add(triangle[1]).add(triangle[2]).normalize());
  for (const corner of triangle) {
    if (!corners.some((known) => known.distanceTo(corner) < 1e-3))
      corners.push(corner.clone().normalize());
  }
}

const ballMaterial = new THREE.MeshToonMaterial({ color: palette.paper, gradientMap: bands });
ballMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uCorners = { value: corners };
  shader.uniforms.uFaces = { value: faces };
  shader.uniforms.uPanel = { value: new THREE.Color(palette.ink) };
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vBallNormal;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\n\tvBallNormal = normal;');
  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      `#include <common>
uniform vec3 uCorners[12];
uniform vec3 uFaces[20];
uniform vec3 uPanel;
varying vec3 vBallNormal;`,
    )
    .replace(
      '#include <color_fragment>',
      `#include <color_fragment>
	vec3 ballNormal = normalize( vBallNormal );
	float pentagon = 0.0;
	for ( int i = 0; i < 12; i ++ ) pentagon = max( pentagon, dot( ballNormal, uCorners[ i ] ) );
	float nearest = 0.0;
	float runnerUp = 0.0;
	for ( int i = 0; i < 20; i ++ ) {
		float facing = dot( ballNormal, uFaces[ i ] );
		if ( facing > nearest ) { runnerUp = nearest; nearest = facing; }
		else if ( facing > runnerUp ) { runnerUp = facing; }
	}
	float panelEdge = pentagon / 2.32744 - nearest / 2.26728;
	float inPentagon = smoothstep( - fwidth( panelEdge ), fwidth( panelEdge ), panelEdge );
	float gap = nearest - runnerUp;
	float seam = 1.0 - smoothstep( 0.0, fwidth( gap ) + 0.018, gap );
	diffuseColor.rgb = mix( diffuseColor.rgb, uPanel, max( inPentagon, seam * 0.75 ) );`,
    );
};

function Part({
  geometry,
  color,
  material,
  outline = true,
  ...props
}: {
  geometry: THREE.BufferGeometry;
  color?: string;
  material?: THREE.Material;
  outline?: boolean;
} & ThreeElements['group']) {
  return (
    <group {...props}>
      <mesh geometry={geometry} material={material ?? toon(color ?? palette.paper)} />
      {outline && <mesh geometry={hullOf(geometry)} material={outlineMaterial} />}
    </group>
  );
}

export type ObjectProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  hovered: boolean;
  reduced: boolean;
  onHover: (object: HeroObject | null) => void;
  onTap: (object: HeroObject) => void;
};

const FLOOR = -1.55;
const ignoreRaycast = () => null;

// Shared behaviour for every object: hover and tap plumbing, an idle float, and a flat shadow
// on a shared floor, drawn the way the cover illustrations draw theirs.
function Piece({
  name,
  position,
  rotation,
  hovered,
  reduced,
  onHover,
  onTap,
  onPress,
  phase,
  shadow: [shadowWidth, shadowDepth],
  lift,
  children,
}: ObjectProps & {
  name: HeroObject;
  onPress?: () => void;
  phase: number;
  shadow: [number, number];
  lift?: RefObject<number>;
  children: ReactNode;
}) {
  const float = useRef<THREE.Group>(null!);
  const shadowMesh = useRef<THREE.Mesh>(null!);
  const shadowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: palette.ink,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const bob = reduced ? 0 : Math.sin(time * 0.9 + phase) * 0.07;
    float.current.position.y = bob;
    float.current.rotation.z = reduced ? 0 : Math.sin(time * 0.6 + phase) * 0.03;
    const targetScale = hovered ? 1.07 : 1;
    const scale = THREE.MathUtils.damp(float.current.scale.x, targetScale, 10, delta);
    float.current.scale.setScalar(scale);

    const height = Math.max(0, bob + (lift?.current ?? 0));
    const spread = 1 - Math.min(height * 0.7, 0.6);
    shadowMesh.current.scale.set(shadowWidth * spread, 1, shadowDepth * spread);
    shadowMaterial.opacity = 0.09 * spread;
    if (Math.abs(scale - targetScale) > 0.001) state.invalidate();
  });

  return (
    <group
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(name);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover(null);
      }}
      onClick={(event) => {
        event.stopPropagation();
        // A drag that ends over an object is not a tap.
        if (event.delta > 6) return;
        onPress?.();
        onTap(name);
      }}
    >
      <group ref={float}>
        <group rotation={rotation}>{children}</group>
      </group>
      <mesh
        ref={shadowMesh}
        geometry={shapes.shadow}
        material={shadowMaterial}
        position={[0, FLOOR - position[1], 0]}
        raycast={ignoreRaycast}
      />
    </group>
  );
}

// A tap presses the face buttons and gives the controller a short rumble.
export function Controller(props: ObjectProps) {
  const body = useRef<THREE.Group>(null!);
  const buttons = useRef<THREE.Group>(null!);
  const rumble = useRef({ strength: 0, elapsed: 0 });

  useFrame((state, delta) => {
    const current = rumble.current;
    current.elapsed += delta;
    current.strength = THREE.MathUtils.damp(current.strength, 0, 7, delta);
    body.current.rotation.z = Math.sin(current.elapsed * 50) * current.strength * 0.055;
    body.current.rotation.x = Math.sin(current.elapsed * 35) * current.strength * 0.035;
    buttons.current.position.z = -current.strength * 0.035;
    if (current.strength > 0.001) state.invalidate();
  });

  return (
    <Piece
      name="controller"
      phase={0}
      shadow={[0.9, 0.3]}
      onPress={() => {
        if (!props.reduced) rumble.current = { strength: 1, elapsed: 0 };
      }}
      {...props}
    >
      <group ref={body}>
        <Part geometry={shapes.shoulder} color={palette.charcoal} position={[-0.53, 0.42, -0.04]} />
        <Part geometry={shapes.shoulder} color={palette.charcoal} position={[0.53, 0.42, -0.04]} />
        <Part geometry={shapes.controller} color={palette.paper} />
        <Part geometry={shapes.touchpad} color={palette.charcoal} position={[0, 0.18, 0.19]} />
        <Part
          geometry={shapes.lightBar}
          color={palette.cobalt}
          position={[0, 0.35, 0.2]}
          outline={false}
        />
        <Part
          geometry={shapes.dpadVertical}
          color={palette.ink}
          position={[-0.56, 0.12, 0.21]}
          outline={false}
        />
        <Part
          geometry={shapes.dpadHorizontal}
          color={palette.ink}
          position={[-0.56, 0.12, 0.215]}
          outline={false}
        />
        {[-0.25, 0.25].map((x) => (
          <group key={x} position={[x, -0.16, 0.2]}>
            <Part geometry={shapes.stickBase} color={palette.charcoal} outline={false} />
            <Part
              geometry={shapes.stick}
              color={palette.ink}
              position={[0, 0, 0.065]}
              outline={false}
            />
          </group>
        ))}
        <group ref={buttons}>
          <Part
            geometry={shapes.button}
            color={palette.lime}
            position={[0.56, 0.25, 0.22]}
            outline={false}
          />
          <Part
            geometry={shapes.button}
            color={palette.coral}
            position={[0.69, 0.12, 0.22]}
            outline={false}
          />
          <Part
            geometry={shapes.button}
            color={palette.cobalt}
            position={[0.56, -0.01, 0.22]}
            outline={false}
          />
          <Part
            geometry={shapes.button}
            color={palette.glass}
            position={[0.43, 0.12, 0.22]}
            outline={false}
          />
        </group>
      </group>
    </Piece>
  );
}

export function Camera(props: ObjectProps) {
  const body = useRef<THREE.Group>(null!);
  const shutter = useRef<THREE.Group>(null!);
  const press = useRef(0);

  useFrame((state, delta) => {
    press.current = THREE.MathUtils.damp(press.current, 0, 6, delta);
    shutter.current.position.y = 0.48 - press.current * 0.035;
    body.current.rotation.x = -press.current * 0.12;
    if (press.current > 0.001) state.invalidate();
  });

  return (
    <Piece
      name="camera"
      phase={4.2}
      shadow={[0.85, 0.36]}
      onPress={() => {
        if (!props.reduced) press.current = 1;
      }}
      {...props}
    >
      <group ref={body}>
        <Part geometry={shapes.body} color={palette.charcoal} />
        <Part geometry={shapes.grip} color={palette.charcoal} position={[-0.53, -0.02, 0.2]} />
        <Part geometry={shapes.viewfinder} color={palette.charcoal} position={[0.08, 0.56, 0]} />
        <Part geometry={shapes.dial} color={palette.steel} position={[0.46, 0.49, -0.04]} />
        <group ref={shutter} position={[-0.53, 0.48, 0.18]}>
          <Part geometry={shapes.shutter} color={palette.coral} />
        </group>
        <group position={[0.12, -0.02, 0]}>
          <Part geometry={shapes.mount} color={palette.steel} position={[0, 0, 0.28]} />
          <Part geometry={shapes.barrel} color={palette.charcoal} position={[0, 0, 0.52]} />
          <Part geometry={shapes.focusRing} color={palette.lime} position={[0, 0, 0.6]} />
          <mesh geometry={shapes.glass} material={toon(palette.glass)} position={[0, 0, 0.722]} />
          <mesh geometry={shapes.glint} material={glintMaterial} position={[0.1, 0.1, 0.724]} />
        </group>
      </group>
    </Piece>
  );
}

// Tipped over on a tap, then set back up, pivoting on the edge of its base.
export function King(props: ObjectProps) {
  const pivot = useRef<THREE.Group>(null!);
  const tip = useRef({ angle: 0, target: 0 });
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function topple() {
    if (props.reduced || tip.current.target !== 0) return;
    tip.current.target = -1.35;
    timer.current = window.setTimeout(() => {
      tip.current.target = 0;
    }, 1300);
  }

  useFrame((state, delta) => {
    const current = tip.current;
    current.angle = THREE.MathUtils.damp(
      current.angle,
      current.target,
      current.target ? 8 : 3.5,
      delta,
    );
    pivot.current.rotation.z = current.angle;
    if (Math.abs(current.angle - current.target) > 0.001) state.invalidate();
  });

  return (
    <Piece name="king" phase={2.1} shadow={[0.5, 0.3]} onPress={topple} {...props}>
      <group ref={pivot} position={[0.46, 0, 0]}>
        <group position={[-0.46, 0, 0]}>
          <Part geometry={shapes.king} color={palette.coral} />
          <Part geometry={shapes.crossUpright} color={palette.coral} position={[0, 1.52, 0]} />
          <Part geometry={shapes.crossArm} color={palette.coral} position={[0, 1.55, 0]} />
        </group>
      </group>
    </Piece>
  );
}

// A tap kicks the ball up; it falls back with a couple of shrinking bounces.
export function Ball(props: ObjectProps) {
  const ball = useRef<THREE.Group>(null!);
  const height = useRef(0);
  const bounce = useRef({ velocity: 0, spin: 0 });

  function kick() {
    if (props.reduced) return;
    bounce.current.velocity = 4.6;
    bounce.current.spin = 10;
  }

  useFrame((state, delta) => {
    const current = bounce.current;
    const step = Math.min(delta, 1 / 30);
    if (current.velocity !== 0 || height.current > 0) {
      current.velocity -= 17 * step;
      height.current += current.velocity * step;
      if (height.current <= 0) {
        height.current = 0;
        current.velocity = Math.abs(current.velocity) > 1.4 ? -current.velocity * 0.45 : 0;
      }
    }
    current.spin = THREE.MathUtils.damp(current.spin, 0, 1.4, step);
    ball.current.position.y = height.current;
    ball.current.rotation.x -= current.spin * step;
    if (!props.reduced) ball.current.rotation.y += step * 0.35;
    if (height.current > 0 || current.spin > 0.01) state.invalidate();
  });

  return (
    <Piece name="ball" phase={1.3} shadow={[0.42, 0.3]} lift={height} onPress={kick} {...props}>
      <group ref={ball}>
        <Part geometry={shapes.ball} material={ballMaterial} />
      </group>
    </Piece>
  );
}
