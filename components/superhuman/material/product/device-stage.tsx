"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * THE DEVICES, IN THREE DIMENSIONS, PLAYING THE REAL FILMS. On black.
 *
 * Two devices: a MacBook-style laptop for the landscape films and a phone for
 * the vertical one. Each screen is the film itself, a video texture, unlit so
 * its colours are the colours Launchr rendered.
 *
 * THE OPENING. The laptop rises out of the dark closed, the lid swings open
 * and the screen powers on into the film that is already playing, in about a
 * second. It plays once, the first time the stage is drawn.
 *
 * ONE POSE DRIVES THE REST. The section writes `pose.current` on every scroll
 * frame (which film is current). A new film on the same device gives it a
 * turn; a new device spins the old one out as the new one spins in.
 *
 * YOUR HAND DRIVES IT TOO. Drag sideways and it turns with you and drifts
 * back to face you. `touch-action: pan-y` keeps a vertical swipe scrolling.
 *
 * COST. One scene, drawn only while on screen and while the tab is visible,
 * pixel ratio capped at 2. The <video> elements belong to the section, which
 * decides what plays. A poster stands in until a film has a frame. Without
 * WebGL, `onError`, and the section shows the film flat.
 */

export type DeviceKind = "phone" | "laptop";
export type StageLook = { device: DeviceKind; poster: string };
export type Pose = { look: number };

/** A flat rounded rectangle whose UVs span it exactly, for screens. */
function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ShapeGeometry(s, 12);
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - x) / w;
    uv[i * 2 + 1] = (pos.getY(i) - y) / h;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

/** A soft pool of light for the device to stand in, on a black page. */
function poolTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,0.16)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.05)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** How much of the scene each device needs to show, for the camera fit. */
const FIT: Record<DeviceKind, { w: number; h: number; y: number }> = {
  phone: { w: 1.4, h: 1.95, y: 0 },
  laptop: { w: 3.45, h: 2.45, y: 0.12 },
};

const LID_OPEN = -0.12;
const LID_SHUT = 1.5;
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

type Device = { group: THREE.Group; screen: THREE.MeshBasicMaterial; presence: number };

export default function DeviceStage({
  looks,
  videos,
  pose,
  onReady,
  onError,
  className = "",
}: {
  looks: StageLook[];
  videos: React.RefObject<(HTMLVideoElement | null)[]>;
  pose: React.RefObject<Pose>;
  onReady: () => void;
  onError: () => void;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      onError();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.touchAction = "pan-y";
    canvas.style.cursor = "grab";
    canvas.setAttribute("aria-hidden", "true");
    el.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfd4ff, 1.1);
    rim.position.set(4, 2, -4);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x101014, 0.5));

    const root = new THREE.Group();
    scene.add(root);

    /* ---- textures ---- */
    const loader = new THREE.TextureLoader();
    const posters = looks.map((l) => {
      const t = loader.load(l.poster);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
    const films = looks.map((_, i) => {
      const v = videos.current?.[i];
      if (!v) return null;
      const t = new THREE.VideoTexture(v);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });

    const disposables: { dispose: () => void }[] = [];
    const std = (color: string, metalness: number, roughness: number) => {
      const m = new THREE.MeshStandardMaterial({ color, metalness, roughness });
      disposables.push(m);
      return m;
    };
    const basic = (color: number) => {
      const m = new THREE.MeshBasicMaterial({ color, toneMapped: false });
      disposables.push(m);
      return m;
    };
    const geo = <G extends THREE.BufferGeometry>(g: G) => {
      disposables.push(g);
      return g;
    };

    const byKind: Partial<Record<DeviceKind, Device>> = {};
    const register = (kind: DeviceKind, group: THREE.Group, screen: THREE.MeshBasicMaterial) => {
      group.scale.setScalar(0.001);
      group.visible = false;
      root.add(group);
      byKind[kind] = { group, screen, presence: 0 };
    };

    /* ---- the laptop ---- */
    const laptop = new THREE.Group();
    const lid = new THREE.Group();
    const laptopScreen = basic(0x000000);
    {
      const alu = std("#b9bcc3", 0.85, 0.3);
      const shell = new THREE.Mesh(geo(new RoundedBoxGeometry(2.62, 1.66, 0.045, 4, 0.05)), alu);
      shell.position.set(0, 0.83, -0.024);
      lid.add(shell);
      const bezel = new THREE.Mesh(geo(roundedRect(2.58, 1.62, 0.06)), basic(0x050506));
      bezel.position.set(0, 0.83, 0.001);
      lid.add(bezel);
      const scr = new THREE.Mesh(geo(roundedRect(2.46, 1.38375, 0.03)), laptopScreen);
      scr.position.set(0, 0.86, 0.003);
      lid.add(scr);
      const notch = new THREE.Mesh(geo(roundedRect(0.26, 0.06, 0.025)), basic(0x050506));
      notch.position.set(0, 1.532, 0.004);
      lid.add(notch);
      // The lid hinges on the deck's back edge.
      lid.position.set(0, -0.8, -0.78);
      lid.rotation.x = LID_SHUT;
      laptop.add(lid);

      const deck = new THREE.Mesh(geo(new RoundedBoxGeometry(2.62, 0.055, 1.62, 4, 0.027)), alu);
      deck.position.set(0, -0.83, 0.02);
      laptop.add(deck);
      const keys = new THREE.Mesh(geo(roundedRect(2.24, 0.78, 0.03)), std("#1c1e23", 0.3, 0.6));
      keys.rotation.x = -Math.PI / 2;
      keys.position.set(0, -0.801, -0.24);
      laptop.add(keys);
      const pad = new THREE.Mesh(geo(roundedRect(0.92, 0.5, 0.04)), std("#a9adb4", 0.8, 0.28));
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(0, -0.801, 0.45);
      laptop.add(pad);
      laptop.rotation.x = 0.14;
      register("laptop", laptop, laptopScreen);
    }

    /* ---- the phone ---- */
    const phone = new THREE.Group();
    {
      const body = new THREE.Mesh(geo(new RoundedBoxGeometry(0.99, 1.73, 0.1, 6, 0.13)), std("#2a2d34", 0.7, 0.28));
      phone.add(body);
      const mat = basic(0xffffff);
      const scr = new THREE.Mesh(geo(roundedRect(0.94, 1.671, 0.1)), mat);
      scr.position.z = 0.0505;
      phone.add(scr);
      const island = new THREE.Mesh(geo(roundedRect(0.24, 0.06, 0.03)), basic(0x000000));
      island.position.set(0, 0.765, 0.052);
      phone.add(island);
      const btn = new THREE.Mesh(geo(new RoundedBoxGeometry(0.02, 0.22, 0.04, 2, 0.01)), std("#3a3e47", 0.7, 0.3));
      btn.position.set(0.5, 0.32, 0);
      phone.add(btn);
      const bump = new THREE.Mesh(geo(new RoundedBoxGeometry(0.36, 0.36, 0.04, 3, 0.07)), std("#30343c", 0.6, 0.28));
      bump.position.set(-0.24, 0.6, -0.06);
      phone.add(bump);
      const glass = std("#07080b", 0.2, 0.08);
      [[-0.31, 0.67], [-0.17, 0.53]].forEach(([x, y]) => {
        const lens = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 24)), glass);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(x, y, -0.085);
        phone.add(lens);
      });
      register("phone", phone, mat);
    }

    const poolMat = new THREE.MeshBasicMaterial({ map: poolTexture(), transparent: true, depthWrite: false });
    disposables.push(poolMat);
    const pool = new THREE.Mesh(geo(new THREE.PlaneGeometry(1, 1)), poolMat);
    pool.position.set(0, -1.0, -0.4);
    scene.add(pool);

    /* ---- your hand ---- */
    let yaw = 0;
    let yawVel = 0;
    let dragging = false;
    let lastX = 0;
    let tiltX = 0;
    let tiltY = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.pointerType === "mouse") {
        tiltX = ((e.clientY - r.top) / r.height - 0.5) * 0.14;
        tiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.2;
      }
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      yaw += dx * 0.012;
      yawVel = dx * 0.012;
    };
    const onUp = () => {
      dragging = false;
      canvas.style.cursor = "grab";
    };
    const onLeave = () => {
      tiltX = 0;
      tiltY = 0;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    /* ---- size and fit ---- */
    const resize = () => {
      const w = Math.max(1, el.clientWidth);
      const h = Math.max(1, el.clientHeight);
      renderer.setSize(w, h, false);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const fitDistance = (kind: DeviceKind) => {
      const f = FIT[kind];
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      // On a narrow screen the width is the limit, so allow a tighter margin.
      const w = camera.aspect < 1 ? f.w * 0.9 : f.w;
      return Math.max(f.h / 2 / t, w / 2 / (t * camera.aspect)) * 1.06;
    };

    /* ---- the loop, only while seen ---- */
    let seen = false;
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen) kick();
    });
    io.observe(el);
    const onVis = () => {
      if (!document.hidden) kick();
    };
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    let last = performance.now();
    // The opening only makes sense if the laptop is what is on screen.
    let introDone = looks[pose.current?.look ?? 0]?.device !== "laptop";
    if (introDone) lid.rotation.x = LID_OPEN;
    let introStart = -1;
    let camDist = fitDistance("laptop") * (introDone ? 1 : 1.3);
    let lastLook = -1;
    let ready = false;
    const start = performance.now();

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;
      const p = pose.current ?? { look: 0 };
      const look = Math.max(0, Math.min(looks.length - 1, p.look));
      const kind = looks[look].device;
      const k = 1 - Math.pow(0.0009, dt);

      // The opening: rise, open, power on. Quick (about 1.1 s), because the
      // film is already playing and the point is to see it.
      let rise = 1;
      let power = 1;
      if (!introDone) {
        if (introStart < 0) introStart = now;
        const it = (now - introStart) / 1000;
        rise = ease(it / 0.7);
        lid.rotation.x = LID_SHUT + (LID_OPEN - LID_SHUT) * smooth((it - 0.1) / 0.75);
        power = smooth((it - 0.45) / 0.35);
        if (it > 1.1 || kind !== "laptop") {
          introDone = true;
          lid.rotation.x = LID_OPEN;
          power = 1;
        }
      }

      if (look !== lastLook) {
        if (lastLook !== -1 && looks[lastLook].device === kind) yawVel += 0.3;
        lastLook = look;
      }

      (Object.keys(byKind) as DeviceKind[]).forEach((dk) => {
        const d = byKind[dk]!;
        const target = dk === kind ? 1 : 0;
        // In the opening the laptop is simply there; it enters by rising.
        if (!introDone && dk === "laptop") d.presence = 1;
        d.presence += (target - d.presence) * k;
        const e = smooth(d.presence);
        d.group.visible = d.presence > 0.004;
        d.group.scale.setScalar(Math.max(0.001, e));
        d.group.rotation.y = (1 - e) * (target ? -1.9 : 1.9);
        d.group.position.y = FIT[dk].y - (1 - e) * 0.25 - (dk === "laptop" ? (1 - rise) * 0.9 : 0);
      });

      // Screens: the current film once it has a frame, the poster before.
      const d = byKind[kind]!;
      const v = videos.current?.[look];
      const film = films[look];
      const map = v && film && v.readyState >= 2 ? film : posters[look];
      if (d.screen.map !== map) {
        d.screen.map = map;
        d.screen.needsUpdate = true;
      }
      laptopScreen.color.setScalar(power);

      if (!dragging) {
        yaw += yawVel;
        yawVel *= Math.pow(0.02, dt);
        yaw += (0 - yaw) * (1 - Math.pow(0.25, dt));
      }
      const sway = introDone ? Math.sin(t * 0.45) * 0.14 : 0;
      root.rotation.y = yaw + sway + tiltY;
      root.rotation.x = (introDone ? Math.sin(t * 0.37) * 0.03 : 0) + tiltX;

      const fit = fitDistance(kind);
      camDist += (fit - camDist) * (introDone ? k : 1 - Math.pow(0.2, dt));
      camera.position.set(0, 0.1 + (1 - rise) * 0.35, camDist);
      camera.lookAt(0, 0, 0);

      const sw = kind === "laptop" ? 3.4 : 1.7;
      pool.scale.set(sw, sw * 0.22, 1);
      pool.position.y = kind === "laptop" ? -0.92 : -1.02;

      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        onReady();
      }
      if (seen && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    kick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      disposables.forEach((x) => x.dispose());
      poolMat.map?.dispose();
      posters.forEach((x) => x.dispose());
      films.forEach((x) => x?.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    };
    // The looks and the video list are fixed for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className={className} />;
}
