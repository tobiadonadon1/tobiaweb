"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MARK_PALETTE, MARK_SHAPES } from "../specimens";

/**
 * THE COIN, IN THREE DIMENSIONS.
 *
 * The product's mark is a coin with a slice cut out: buy at 98¢, collect $1,
 * and the missing 2¢ is the whole trade. On the flat page it is cut paper.
 * Here it is the same paper made solid: the SAME outlines (MARK_SHAPES in
 * specimens.tsx), extruded into a thick card token with a bevelled edge and a
 * paper grain, lit softly, casting a real shadow on the page.
 *
 * It is driven by one number, `stage`, which the section writes as the reader
 * scrolls (0 to 3, one whole number per point on the list, below 0 while the
 * section is still arriving). Four poses, one per point:
 *
 *   0  runs every day   the coin arrives turning, like a dial
 *   1  the edge         the 2¢ slice lifts out toward you (the peak)
 *   2  you understand   both face you: 98¢ on the coin, 2¢ on the slice
 *   3  build on it      the slice clicks home, the coin lies down, and a
 *                       stack of coins in the site's other colours rises
 *
 * Between poses it eases and holds, so each point has a still moment to be
 * read against. A pointer adds a few degrees of tilt on desktop.
 *
 * COST. One small scene, drawn only while on screen, pixel ratio capped at 2,
 * no preserveDrawingBuffer. The section loads this file lazily and shows the
 * flat mark until the first frame is ready, and never loads it under reduced
 * motion. If WebGL is unavailable, `onError` leaves the flat mark in place.
 */

const { INK, VERMILION, ULTRAMARINE, SAFFRON, FOREST } = MARK_PALETTE;

/* ---------------------------------------------------------------- *
 * GEOMETRY FROM THE MARK
 * ---------------------------------------------------------------- */

/** The mark's paths are drawn in a 140-unit box centred on (69, 69), y down. */
function outline(d: string): THREE.Shape {
  const pts = [...d.matchAll(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)].map(
    (m) => new THREE.Vector2((Number(m[1]) - 69) / 69, -(Number(m[2]) - 69) / 69),
  );
  return new THREE.Shape(pts);
}

const DEPTH = 0.13;
const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: DEPTH,
  bevelEnabled: true,
  bevelThickness: 0.028,
  bevelSize: 0.022,
  bevelSegments: 3,
  curveSegments: 1,
};

function token(d: string) {
  const g = new THREE.ExtrudeGeometry(outline(d), EXTRUDE);
  g.translate(0, 0, -DEPTH / 2);
  return g;
}

/** The slice's bisector: the mark's cut is 26° wide, centred 52° above +x. */
const SLICE_ANGLE = (52 * Math.PI) / 180;
const SLICE_DIR = new THREE.Vector3(Math.cos(SLICE_ANGLE), Math.sin(SLICE_ANGLE), 0);
/** Roughly the slice's centre of mass, so it turns about itself. */
const SLICE_CENTRE = SLICE_DIR.clone().multiplyScalar(0.58);

/* ---------------------------------------------------------------- *
 * PRINTED FACES
 *
 * Extruded caps take their UVs from the shape's own x/y, which run from -1
 * to 1, so a texture with repeat 0.5 and offset 0.5 maps canvas pixels
 * straight onto the coin: canvas (px, py) sits at x = px/512 - 1,
 * y = 1 - py/512. The slice is cut from the same coordinates, so its "2¢"
 * is drawn where the slice is.
 * ---------------------------------------------------------------- */

const SIZE = 1024;

function grain(ctx: CanvasRenderingContext2D, amount: number) {
  const img = ctx.getImageData(0, 0, SIZE, SIZE);
  const px = img.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    px[i] += n;
    px[i + 1] += n;
    px[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function canvasTexture(draw: (ctx: CanvasRenderingContext2D) => void, color: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.repeat.set(0.5, 0.5);
  tex.offset.set(0.5, 0.5);
  tex.anisotropy = 4;
  if (color) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function faces(font: string) {
  const at = (x: number, y: number) => [(x + 1) * 512, (1 - y) * 512] as const;
  const sliceAt = at(SLICE_DIR.x * 0.7, SLICE_DIR.y * 0.7);

  const printCoin = (ctx: CanvasRenderingContext2D, ink: string) => {
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `500 300px ${font}`;
    const [x, y] = at(-0.14, -0.2);
    ctx.fillText("98¢", x, y);
  };
  const printSlice = (ctx: CanvasRenderingContext2D, ink: string) => {
    ctx.save();
    ctx.translate(sliceAt[0], sliceAt[1]);
    // Reads outward along the slice, the way a label follows a spoke.
    ctx.rotate(-SLICE_ANGLE + Math.PI / 2);
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 84px ${font}`;
    ctx.fillText("2¢", 0, 0);
    ctx.restore();
  };

  const coinMap = canvasTexture((ctx) => {
    ctx.fillStyle = SAFFRON;
    ctx.fillRect(0, 0, SIZE, SIZE);
    printCoin(ctx, "#9a5a12");
    grain(ctx, 22);
  }, true);
  const sliceMap = canvasTexture((ctx) => {
    ctx.fillStyle = VERMILION;
    ctx.fillRect(0, 0, SIZE, SIZE);
    printSlice(ctx, "#faf8f2");
    grain(ctx, 22);
  }, true);
  // One bump for both: paper tooth everywhere, the print pressed in.
  const bump = canvasTexture((ctx) => {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, SIZE, SIZE);
    printCoin(ctx, "#3a3a3a");
    printSlice(ctx, "#3a3a3a");
    grain(ctx, 60);
  }, false);
  const plainBump = canvasTexture((ctx) => {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, SIZE, SIZE);
    grain(ctx, 60);
  }, false);

  return { coinMap, sliceMap, bump, plainBump };
}

/* ---------------------------------------------------------------- *
 * POSES
 * ---------------------------------------------------------------- */

type Pose = {
  rx: number; ry: number; rz: number;
  px: number; py: number; pz: number;
  lift: number; liftZ: number;
  sx: number; sy: number; sz: number;
  stack: number;
};

const POSES: Pose[] = [
  // 0. runs every day: face on, leaning back a little, slice at home
  { rx: -0.34, ry: -0.42, rz: 0, px: 0, py: 0.08, pz: 0, lift: 0, liftZ: 0, sx: 0, sy: 0, sz: 0, stack: 0 },
  // 1. the edge: the slice comes out toward you
  { rx: -0.16, ry: 0.36, rz: 0, px: -0.22, py: -0.02, pz: 0, lift: 0.7, liftZ: 0.6, sx: -0.3, sy: 0.5, sz: -0.22, stack: 0 },
  // 2. you understand: both face you, both labels read
  { rx: -0.04, ry: 0.02, rz: 0, px: -0.3, py: 0, pz: 0.25, lift: 0.86, liftZ: 0.18, sx: 0, sy: 0, sz: -0.1, stack: 0 },
  // 3. build on it: whole again, lying down, a stack rises under it
  { rx: -1.1, ry: 0, rz: 0.4, px: 0, py: 0.42, pz: 0, lift: 0, liftZ: 0, sx: 0, sy: 0, sz: 0, stack: 1 },
];

const KEYS = Object.keys(POSES[0]) as (keyof Pose)[];
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** The pose for a stage value, holding still near each whole number. */
function poseAt(stage: number): Pose {
  const s = Math.min(POSES.length - 1, Math.max(0, stage));
  const i = Math.min(POSES.length - 2, Math.floor(s));
  const f = smooth(0.2, 0.8, s - i);
  const a = POSES[i];
  const b = POSES[i + 1];
  const out = { ...a };
  for (const k of KEYS) out[k] = a[k] + (b[k] - a[k]) * f;
  return out;
}

/* ---------------------------------------------------------------- *
 * THE STAGE
 * ---------------------------------------------------------------- */

export default function CoinStage({
  stage,
  onReady,
  onError,
  className = "",
}: {
  /** Written by the section as the reader scrolls. Read every frame. */
  stage: React.RefObject<number>;
  onReady?: () => void;
  onError?: () => void;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const ready = useRef(onReady);
  const failed = useRef(onError);

  useEffect(() => {
    ready.current = onReady;
    failed.current = onError;
  }, [onReady, onError]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      failed.current?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    // No tone mapping: the lights are balanced so a face turned to the key
    // light renders at the flat mark's own colour, and a tone curve would
    // only wash saffron towards peach.
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = true;
    // Plain PCF with a radius: soft enough under a floating coin, and far
    // cheaper per frame on a phone than variance shadows and their blur.
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);

    /* ---- light: soft key from the upper left, warm fill, a rim behind ---- */
    // Lit to show the brand colours at their own value, not brighter: a face
    // turned to the camera should read as the flat mark's saffron. Three's
    // lights are physical (diffuse is albedo / π), so key plus fill come to
    // about π on a lit face. No environment map: a room environment is many
    // times brighter than its intensity suggests, and it clipped saffron to
    // yellow.
    scene.add(new THREE.HemisphereLight(0xfff4e2, 0xd6cdb9, 1.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    // High and a little in front, so the shadow falls under the coin rather
    // than off the side of the canvas.
    key.position.set(-1.6, 7, 3.2);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.left = key.shadow.camera.bottom = -3;
    key.shadow.camera.right = key.shadow.camera.top = 3;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 6;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffe7cf, 0.7);
    rim.position.set(4, 2.5, -3);
    scene.add(rim);

    /* ---- the floor only catches the shadow; the page is the floor ---- */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.ShadowMaterial({ opacity: 0.11, color: new THREE.Color(INK) }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.3;
    floor.receiveShadow = true;
    scene.add(floor);

    /* ---- the pieces ---- */
    const font =
      getComputedStyle(document.documentElement).getPropertyValue("--font-host").trim() ||
      "Helvetica, Arial, sans-serif";

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const keep = <T,>(list: T[], v: T) => (list.push(v), v);

    const root = new THREE.Group();
    const coin = new THREE.Group();
    root.add(coin);
    scene.add(root);

    const slicePivot = new THREE.Group();
    coin.add(slicePivot);

    const stackDiscs: THREE.Mesh[] = [];

    const build = () => {
      const { coinMap, sliceMap, bump, plainBump } = faces(font);
      [coinMap, sliceMap, bump, plainBump].forEach((t) => keep(textures, t));

      const face = (map: THREE.Texture) =>
        keep(materials, new THREE.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 1.2, roughness: 0.74, metalness: 0 }));
      const edge = (color: string) =>
        keep(materials, new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.86), roughness: 0.82, metalness: 0 }));

      // ExtrudeGeometry: group 0 is the two caps, group 1 the edge and bevel.
      const coinMesh = new THREE.Mesh(keep(geometries, token(MARK_SHAPES.DISC_CUT)), [face(coinMap), edge(SAFFRON)]);
      coinMesh.castShadow = true;
      coin.add(coinMesh);

      const sliceMesh = new THREE.Mesh(keep(geometries, token(MARK_SHAPES.SLICE)), [face(sliceMap), edge(VERMILION)]);
      sliceMesh.castShadow = true;
      sliceMesh.position.copy(SLICE_CENTRE).multiplyScalar(-1);
      slicePivot.add(sliceMesh);

      // The stack: the other colours of the site's marks, each turned a
      // little, so the torn edges never line up and it reads as made by hand.
      const disc = keep(geometries, token(MARK_SHAPES.DISC));
      [ULTRAMARINE, FOREST, INK].forEach((color, i) => {
        const mat = keep(
          materials,
          new THREE.MeshStandardMaterial({ color, bumpMap: plainBump, bumpScale: 1.2, roughness: 0.78, metalness: 0, transparent: true, opacity: 0 }),
        );
        const m = new THREE.Mesh(disc, mat);
        m.rotation.z = [0.9, -0.5, 2.1][i];
        m.castShadow = true;
        m.visible = false;
        coin.add(m);
        stackDiscs.push(m);
      });
    };

    /* ---- sizing: keep the whole piece in frame at any aspect ---- */
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      // The piece needs about 3.3 units across and 3.5 tall.
      const dist = Math.max(3.5 / (2 * half), 3.3 / (2 * half * camera.aspect)) + 1.2;
      camera.position.set(0, dist * 0.09, dist);
      camera.lookAt(0, -0.05, 0);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    /* ---- pointer: a few degrees of tilt, desktop only ---- */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    /* ---- the loop, only while on screen ---- */
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let first = true;
    const cur = poseAt(stage.current ?? 0);
    const tilt = { x: 0, y: 0 };
    let dial = 0;

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const s = stage.current ?? 0;
      const target = poseAt(s);
      const k = first ? 1 : 1 - Math.exp(-dt * 7);
      for (const key of KEYS) cur[key] += (target[key] - cur[key]) * k;

      // Arriving: the coin turns a full revolution as the section comes up,
      // and lands upright just before it pins. Scroll is the hand on the dial.
      const dialTarget = -Math.PI * 2 * (1 - smooth(-1, -0.1, s));
      dial += (dialTarget - dial) * k;

      tilt.x += ((fine ? pointer.y * 0.12 : 0) - tilt.x) * (1 - Math.exp(-dt * 4));
      tilt.y += ((fine ? pointer.x * 0.16 : 0) - tilt.y) * (1 - Math.exp(-dt * 4));

      root.position.y = Math.sin(now / 1100) * 0.025;
      coin.position.set(cur.px, cur.py, cur.pz);
      coin.rotation.set(cur.rx + tilt.x, cur.ry + tilt.y, cur.rz + dial);

      slicePivot.position
        .copy(SLICE_CENTRE)
        .addScaledVector(SLICE_DIR, cur.lift)
        .add(new THREE.Vector3(0, 0, cur.liftZ));
      slicePivot.rotation.set(cur.sx, cur.sy, cur.sz);

      stackDiscs.forEach((m, i) => {
        const e = smooth(i * 0.18, i * 0.18 + 0.64, cur.stack);
        m.visible = e > 0.001;
        m.position.z = -(DEPTH + 0.075) * (i + 1) - (1 - e) * 1.6;
        (m.material as THREE.MeshStandardMaterial).opacity = e;
      });

      renderer.render(scene, camera);
      if (first) {
        first = false;
        ready.current?.();
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !disposed) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });

    // Print the faces in the site's own face, once it has loaded.
    const start = () => {
      if (disposed) return;
      build();
      fit();
      io.observe(el);
    };
    const fonts = document.fonts;
    Promise.race([
      fonts ? fonts.load(`500 100px ${font}`).then(() => fonts.ready) : Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(start, start);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [stage]);

  return <div ref={host} aria-hidden className={className} />;
}
