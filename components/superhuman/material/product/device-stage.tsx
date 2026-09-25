"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * THE DEVICE, IN THREE DIMENSIONS, PLAYING THE REAL FILMS.
 *
 * Launchr's films are made for three kinds of screen, so the stage has three
 * devices: a phone (vertical films), a laptop (landscape) and a feed post
 * (square). Each screen is the film itself, as a video texture, unlit so its
 * colours are the colours Launchr rendered.
 *
 * ONE POSE DRIVES IT. The section writes `pose.current` on every scroll frame:
 * which look is current and how far the camera has pushed in. When the look
 * changes device, the old one spins out as the new one spins in, so the phone
 * seems to turn round and come back as a laptop. That is the page's peak.
 *
 * YOUR HAND DRIVES IT TOO. Drag sideways and it turns with you, with a little
 * throw; let go and it drifts back to face you, because the film is the point.
 * The canvas keeps `touch-action: pan-y`, so on a phone a vertical swipe still
 * scrolls the page and only a sideways one turns the device.
 *
 * COST. One scene, drawn only while on screen and while the tab is visible,
 * pixel ratio capped at 2. The films are <video> elements owned by the
 * section (which decides which one plays); this only reads their frames. A
 * poster stands in until a film has a frame. If WebGL is unavailable,
 * `onError` and the section shows the film in a flat frame instead.
 */

export type DeviceKind = "phone" | "laptop" | "post";
export type StageLook = { device: DeviceKind; poster: string };
export type Pose = { look: number; push: number };

const PAPER_CARD = "#fbfaf7";

/** A flat rounded rectangle whose UVs span it exactly, for screens. */
function screenGeometry(w: number, h: number, r: number) {
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

/** A soft round shadow for the device to stand over. */
function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, "rgba(11,31,58,0.42)");
  grad.addColorStop(0.55, "rgba(11,31,58,0.12)");
  grad.addColorStop(1, "rgba(11,31,58,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** How much of the scene each device needs to show, for the camera fit. */
const FIT: Record<DeviceKind, { w: number; h: number; y: number }> = {
  phone: { w: 1.45, h: 2.0, y: 0 },
  laptop: { w: 3.0, h: 2.05, y: 0.05 },
  post: { w: 2.05, h: 2.45, y: 0 },
};

type Device = {
  group: THREE.Group;
  screen: THREE.MeshBasicMaterial;
  presence: number;
};

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
    scene.environmentIntensity = 0.75;

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-3, 4, 5);
    scene.add(key);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d4ca, 0.9));

    const root = new THREE.Group();
    scene.add(root);

    /* ---- textures: a poster per look, a video texture per look ---- */
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
    const geo = <G extends THREE.BufferGeometry>(g: G) => {
      disposables.push(g);
      return g;
    };
    const screenMat = () => {
      const m = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
      disposables.push(m);
      return m;
    };

    const byKind: Partial<Record<DeviceKind, Device>> = {};

    /* ---- the phone ---- */
    const phone = new THREE.Group();
    {
      const body = new THREE.Mesh(geo(new RoundedBoxGeometry(0.99, 1.73, 0.1, 6, 0.13)), std("#1b1e25", 0.55, 0.32));
      phone.add(body);
      const mat = screenMat();
      const scr = new THREE.Mesh(geo(screenGeometry(0.94, 1.671, 0.1)), mat);
      scr.position.z = 0.0505;
      phone.add(scr);
      const islandMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      disposables.push(islandMat);
      const island = new THREE.Mesh(geo(screenGeometry(0.24, 0.06, 0.03)), islandMat);
      island.position.set(0, 0.765, 0.052);
      phone.add(island);
      const btn = new THREE.Mesh(geo(new RoundedBoxGeometry(0.02, 0.22, 0.04, 2, 0.01)), std("#2a2e37", 0.6, 0.3));
      btn.position.set(0.5, 0.32, 0);
      phone.add(btn);
      // The back, for whoever turns it round: a camera module, two lenses.
      const bump = new THREE.Mesh(geo(new RoundedBoxGeometry(0.36, 0.36, 0.04, 3, 0.07)), std("#23272f", 0.5, 0.28));
      bump.position.set(-0.24, 0.6, -0.06);
      phone.add(bump);
      const glass = std("#07080b", 0.2, 0.08);
      [[-0.31, 0.67], [-0.17, 0.53]].forEach(([x, y]) => {
        const lens = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 24)), glass);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(x, y, -0.085);
        phone.add(lens);
      });
      devices("phone", phone, mat);
    }

    /* ---- the laptop ---- */
    const laptop = new THREE.Group();
    {
      const alu = std("#c7cad0", 0.75, 0.34);
      const lid = new THREE.Group();
      const shell = new THREE.Mesh(geo(new RoundedBoxGeometry(2.62, 1.66, 0.05, 4, 0.05)), alu);
      shell.position.y = 0.83;
      lid.add(shell);
      const bezel = new THREE.Mesh(geo(screenGeometry(2.56, 1.6, 0.05)), std("#0b0c0f", 0.2, 0.5));
      bezel.position.set(0, 0.83, 0.026);
      lid.add(bezel);
      const mat = screenMat();
      const scr = new THREE.Mesh(geo(screenGeometry(2.44, 1.3725, 0.02)), mat);
      scr.position.set(0, 0.86, 0.028);
      lid.add(scr);
      lid.rotation.x = -0.1;
      lid.position.set(0, -0.8, -0.78);
      laptop.add(lid);
      const deck = new THREE.Mesh(geo(new RoundedBoxGeometry(2.62, 0.06, 1.62, 4, 0.03)), alu);
      deck.position.set(0, -0.83, 0.02);
      laptop.add(deck);
      const keys = new THREE.Mesh(geo(new THREE.PlaneGeometry(2.2, 0.8)), std("#26292f", 0.3, 0.7));
      keys.rotation.x = -Math.PI / 2;
      keys.position.set(0, -0.798, -0.25);
      laptop.add(keys);
      const pad = new THREE.Mesh(geo(new THREE.PlaneGeometry(0.9, 0.46)), std("#b8bcc3", 0.7, 0.3));
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(0, -0.798, 0.45);
      laptop.add(pad);
      laptop.rotation.x = 0.16;
      devices("laptop", laptop, mat);
    }

    /* ---- the feed post ---- */
    const post = new THREE.Group();
    {
      const card = new THREE.Mesh(geo(new RoundedBoxGeometry(1.8, 2.24, 0.04, 4, 0.08)), std(PAPER_CARD, 0, 0.85));
      post.add(card);
      const mat = screenMat();
      const scr = new THREE.Mesh(geo(new THREE.PlaneGeometry(1.8, 1.8)), mat);
      scr.position.set(0, -0.04, 0.021);
      post.add(scr);
      const avatar = new THREE.Mesh(geo(new THREE.CircleGeometry(0.075, 24)), std("#ce4631", 0, 0.8));
      avatar.position.set(-0.76, 0.99, 0.021);
      post.add(avatar);
      const line = (w: number, x: number, y: number, c = "#d7d3cb") => {
        const m = new THREE.Mesh(geo(screenGeometry(w, 0.045, 0.02)), std(c, 0, 0.9));
        m.position.set(x, y, 0.021);
        post.add(m);
      };
      line(0.5, -0.4, 1.01, "#b9b4aa");
      line(0.32, -0.49, 0.95);
      [-0.8, -0.64, -0.48].forEach((x) => {
        const d = new THREE.Mesh(geo(new THREE.CircleGeometry(0.04, 16)), std("#8f8a80", 0, 0.9));
        d.position.set(x + 0.04, -1.03, 0.021);
        post.add(d);
      });
      devices("post", post, mat);
    }

    const shadow = new THREE.Mesh(
      geo(new THREE.PlaneGeometry(1, 1)),
      new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }),
    );
    // Faces the camera and sits just behind the device's foot: at eye level a
    // plane lying on the floor would be edge on and invisible.
    shadow.position.set(0, -1.18, -0.4);
    scene.add(shadow);

    function devices(kind: DeviceKind, group: THREE.Group, screen: THREE.MeshBasicMaterial) {
      group.scale.setScalar(0.001);
      root.add(group);
      byKind[kind] = { group, screen, presence: 0 };
    }

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
        tiltX = ((e.clientY - r.top) / r.height - 0.5) * 0.16;
        tiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.22;
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
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", () => {
      tiltX = 0;
      tiltY = 0;
    });

    /* ---- size and camera fit ---- */
    let width = 1;
    let height = 1;
    const resize = () => {
      width = Math.max(1, el.clientWidth);
      height = Math.max(1, el.clientHeight);
      renderer.setSize(width, height, false);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const fitDistance = (kind: DeviceKind) => {
      const f = FIT[kind];
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      return Math.max(f.h / 2 / t, f.w / 2 / (t * camera.aspect)) * 1.08;
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
    let camDist = fitDistance(looks[pose.current?.look ?? 0]?.device ?? "phone");
    let push = 0;
    let lastLook = -1;
    let ready = false;
    const start = performance.now();

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;
      const p = pose.current ?? { look: 0, push: 0 };
      const look = Math.max(0, Math.min(looks.length - 1, p.look));
      const kind = looks[look].device;

      // A change of look gives the device a turn, even when the device stays.
      if (look !== lastLook) {
        if (lastLook !== -1 && looks[lastLook].device === kind) yawVel += 0.28;
        lastLook = look;
      }

      // Presence: the current device spins in, the others spin out.
      const k = 1 - Math.pow(0.0009, dt);
      (Object.keys(byKind) as DeviceKind[]).forEach((dk) => {
        const d = byKind[dk]!;
        const target = dk === kind ? 1 : 0;
        d.presence += (target - d.presence) * k;
        const pr = d.presence;
        const e = pr * pr * (3 - 2 * pr);
        d.group.visible = pr > 0.004;
        d.group.scale.setScalar(Math.max(0.001, e));
        d.group.rotation.y = (1 - e) * (target ? -1.9 : 1.9);
        d.group.position.y = FIT[dk].y - (1 - e) * 0.25;
      });

      // Each device screen shows its current film: the look that is current
      // if it is this device's, otherwise the last one it showed.
      looks.forEach((l, i) => {
        if (i !== look) return;
        const d = byKind[l.device]!;
        const v = videos.current?.[i];
        const film = films[i];
        const map = v && film && v.readyState >= 2 ? film : posters[i];
        if (d.screen.map !== map) {
          d.screen.map = map;
          d.screen.needsUpdate = true;
        }
      });

      // Throw, then drift home.
      if (!dragging) {
        yaw += yawVel;
        yawVel *= Math.pow(0.02, dt);
        yaw += (0 - yaw) * (1 - Math.pow(0.25, dt));
      }
      root.rotation.y = yaw + Math.sin(t * 0.45) * 0.2 + tiltY;
      root.rotation.x = Math.sin(t * 0.37) * 0.035 + tiltX;

      // Camera: fit the current device, then push in on request.
      push += (p.push - push) * k;
      const fit = fitDistance(kind);
      camDist += (fit * (1 - push * 0.17) - camDist) * k;
      camera.position.set(0, 0.08 + push * 0.06, camDist);
      camera.lookAt(0, push * 0.04, 0);

      const sw = kind === "laptop" ? 3.2 : kind === "post" ? 2.2 : 1.5;
      shadow.scale.set(sw, sw * 0.16, 1);
      shadow.position.y = kind === "laptop" ? -0.9 : kind === "post" ? -1.2 : -1.02;

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
      disposables.forEach((d) => d.dispose());
      posters.forEach((p) => p.dispose());
      films.forEach((f) => f?.dispose());
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
