/* ==========================================================================
   Stage — a lit, physical cluster of classical fragments.

   Fluted column drums, capitals, Greek-key tiles, tesserae, orbs and laurel
   rings in veined marble, gold, obsidian and night-stone. They are pulled
   toward the centre, collide softly and get shoved by the cursor, inside a
   faint gold star field. Reflections come from a RoomEnvironment PMREM.

   API
     mountStage(host, opts) → { setJourney({ dolly, explode, spin }), dispose }
     renderStill(opts)      → Promise<dataURL>   (static cluster for cards)
   ========================================================================== */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------- materials */
/* Veined marble drawn once to a canvas: warm stone with soft grey-gold veins. */
function marbleTexture(base, vein, seed) {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = base; g.fillRect(0, 0, c.width, c.height);
  const rand = mulberry32(seed);
  for (let i = 0; i < 26; i++) {
    let x = rand() * c.width, y = rand() * c.height;
    g.strokeStyle = vein;
    g.globalAlpha = 0.08 + rand() * 0.22;
    g.lineWidth = 0.6 + rand() * 2.4;
    g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 9; k++) {
      const nx = x + (rand() - 0.3) * 160, ny = y + (rand() - 0.5) * 90;
      g.quadraticCurveTo(x + (rand() - 0.5) * 120, y + (rand() - 0.5) * 120, nx, ny);
      x = nx; y = ny;
    }
    g.stroke();
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}
export function makeMaterials() {
  const marbleMap = marbleTexture("#ece6d8", "#8a7d68", 11);
  const nightMap = marbleTexture("#1b1916", "#c9a96e", 23);
  return {
    // Clear, iridescent, slightly dispersive glass with a warm body tint
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.05,
      transmission: 1, thickness: 0.6, ior: 1.45, dispersion: 0.4,
      iridescence: 0.9, iridescenceIOR: 1.3, iridescenceThicknessRange: [180, 620],
      clearcoat: 1, clearcoatRoughness: 0.03,
      attenuationColor: new THREE.Color(0xffffff), attenuationDistance: Infinity,
      envMapIntensity: 2.2, specularIntensity: 1, specularColor: new THREE.Color(0xffffff),
    }),
    gold: new THREE.MeshPhysicalMaterial({ color: 0xd2b072, metalness: 1, roughness: 0.24, clearcoat: 0.3, clearcoatRoughness: 0.2 }),
    marble: new THREE.MeshPhysicalMaterial({ map: marbleMap, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.18 }),
    obsidian: new THREE.MeshPhysicalMaterial({ color: 0x0b0b0d, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.03 }),
    nightstone: new THREE.MeshPhysicalMaterial({ map: nightMap, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 }),
  };
}

/* ------------------------------------------------------------ geometries */
export function flutedDrum(radius, height, flutes) {
  const geo = new THREE.CylinderGeometry(radius, radius * 1.02, height, flutes * 6, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 1e-4) continue;
    const th = Math.atan2(z, x);
    const k = 1 - 0.07 * Math.pow(Math.sin(th * flutes / 2), 2);
    pos.setX(i, x * k); pos.setZ(i, z * k);
  }
  geo.computeVertexNormals();
  return geo;
}
export function capital() {
  const echinus = new THREE.CylinderGeometry(0.66, 0.44, 0.26, 64, 1);
  const neck = new THREE.CylinderGeometry(0.45, 0.45, 0.14, 64, 1);
  neck.translate(0, -0.2, 0);
  const abacus = new THREE.BoxGeometry(1.42, 0.2, 1.42);
  abacus.translate(0, 0.23, 0);
  const geo = mergeGeometries([echinus.toNonIndexed(), neck.toNonIndexed(), abacus.toNonIndexed()]);
  geo.computeVertexNormals();
  return geo;
}
/* One unit of the Greek key, as a solid tile. */
export function meanderKey() {
  const pts = [[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.3, 0.6], [-0.3, -0.15], [0.25, -0.15], [0.25, 0.28]];
  const w = 0.2, d = 0.22, parts = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1) + w;
    const box = new THREE.BoxGeometry(x1 === x2 ? w : len, x1 === x2 ? len : w, d);
    box.translate((x1 + x2) / 2, (y1 + y2) / 2, 0);
    parts.push(box.toNonIndexed());
  }
  return mergeGeometries(parts);
}
function makeGeometries() {
  return {
    drum: { geo: flutedDrum(0.55, 0.8, 20), r: 0.78 },
    capital: { geo: capital(), r: 0.92 },
    orb: { geo: new THREE.SphereGeometry(0.5, 48, 32), r: 0.5 },
    ring: { geo: new THREE.TorusGeometry(0.62, 0.11, 24, 96), r: 0.72 },
    key: { geo: meanderKey(), r: 0.85 },
    tessera: { geo: new RoundedBoxGeometry(0.62, 0.62, 0.62, 3, 0.06), r: 0.5 },
  };
}

/* Page presets: which forms and stones dominate. Weights, not counts. */
const PRESETS = {
  home:        { shapes: { drum: 4, capital: 2, orb: 3, ring: 2, key: 2, tessera: 2 }, colors: { glass: 11, gold: 1 } },
  about:       { shapes: { orb: 4, drum: 3, ring: 2, capital: 1 },                   colors: { glass: 11, gold: 1 } },
  work:        { shapes: { drum: 5, capital: 3, tessera: 2 },                        colors: { glass: 11, gold: 1 } },
  publishings: { shapes: { tessera: 4, key: 3, orb: 2 },                             colors: { glass: 11, gold: 1 } },
  projects:    { shapes: { key: 4, ring: 3, tessera: 2 },                            colors: { glass: 11, gold: 1 } },
  curiosities: { shapes: { orb: 3, ring: 3, drum: 2, key: 2, capital: 1 },           colors: { glass: 11, gold: 1 } },
  contact:     { shapes: { orb: 4, ring: 3, tessera: 2 },                            colors: { glass: 11, gold: 1 } },
};

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick(weights, rand) {
  const keys = Object.keys(weights);
  let total = 0;
  for (const k of keys) total += weights[k];
  let x = rand() * total;
  for (const k of keys) { x -= weights[k]; if (x <= 0) return k; }
  return keys[keys.length - 1];
}

/* A soft gold glow, carried by the camera, that the glass refracts. */
export function haloPlane() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0, "rgba(214,186,128,0.42)");
  grad.addColorStop(0.18, "rgba(150,116,62,0.16)");
  grad.addColorStop(0.45, "rgba(40,30,16,0.05)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = "#000"; g.fillRect(0, 0, 512, 512);
  g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshBasicMaterial({ map: tex, fog: false, toneMapped: false }));
  mesh.position.z = -30;
  mesh.renderOrder = -1;
  return mesh;
}

/* A faint gold star field far behind the cluster. */
function starField(seed) {
  const rand = mulberry32(seed * 7 + 3);
  const n = 900, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = rand() * 2 - 1, a = rand() * Math.PI * 2, r = 22 + rand() * 18, s = Math.sqrt(1 - u * u);
    pos[i * 3] = Math.cos(a) * s * r; pos[i * 3 + 1] = u * r; pos[i * 3 + 2] = Math.sin(a) * s * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xc9a96e, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.75, depthWrite: false, fog: false });
  return new THREE.Points(geo, mat);
}

/* --------------------------------------------------------------- scene */
function buildScene(renderer, preset, count, seed) {
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.6;
  pmrem.dispose();

  scene.fog = new THREE.Fog(0x000000, 14, 30);

  const key = new THREE.DirectionalLight(0xfff0d8, 1.6);
  key.position.set(-5, 7, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc9a96e, 1.8);
  rim.position.set(6, -2, -6);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0x6b6152, 0.3));
  const edge = new THREE.DirectionalLight(0xdfe8ff, 1.4);
  edge.position.set(-7, 3, -5);
  scene.add(edge);
  const stars = starField(seed);
  scene.add(stars);

  const mats = makeMaterials();
  const geos = makeGeometries();
  const rand = mulberry32(seed);
  const bodies = [];
  for (let i = 0; i < count; i++) {
    const shape = pick(preset.shapes, rand);
    let color = pick(preset.colors, rand);
    if (shape === "ring" && rand() < 0.35) color = "gold"; // some laurel rings in gold
    const g = geos[shape];
    let mesh = new THREE.Mesh(g.geo, mats[color]);
    if (color === "glass" && (shape === "drum" || shape === "orb")) {
      const group = new THREE.Group();
      group.add(mesh);
      const rims = shape === "drum" ? [[0.4, 0.55], [-0.4, 0.56]] : [[0, 0.5]];
      rims.forEach(([y, r]) => {
        const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.022, 10, 96), mats.gold);
        rim.rotation.x = Math.PI / 2; rim.position.y = y;
        group.add(rim);
      });
      mesh = group;
    }
    const s = 0.85 + rand() * 0.55;
    mesh.scale.setScalar(s);
    const dir = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
    const p = dir.multiplyScalar(4 + rand() * 5);
    mesh.position.copy(p);
    mesh.quaternion.setFromEuler(new THREE.Euler(rand() * 6.28, rand() * 6.28, rand() * 6.28));
    scene.add(mesh);
    bodies.push({
      mesh, r: g.r * s * 1.3, m: s * s * s,
      p: mesh.position, v: new THREE.Vector3(),
      w: new THREE.Vector3((rand() - 0.5) * 0.22, (rand() - 0.5) * 0.22, (rand() - 0.5) * 0.22),
      seed: rand(),
    });
  }
  return {
    scene, bodies, stars,
    dispose() {
      env.dispose();
      Object.values(mats).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      Object.values(geos).forEach((g) => g.geo.dispose());
      stars.geometry.dispose(); stars.material.dispose();
    },
  };
}

/* ------------------------------------------------------------- physics */
const _d = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _axis = new THREE.Vector3();
function step(bodies, dt, env) {
  const { mouse, mouseVel, mouseOn, explode, spread } = env;
  const kCenter = 2.6 * (1 - explode);
  for (const b of bodies) {
    // pull toward a slightly squashed centre so wide frames fill sideways
    b.v.x += (-b.p.x / spread) * kCenter * dt;
    b.v.y += -b.p.y * kCenter * dt;
    b.v.z += -b.p.z * kCenter * 1.4 * dt;
    if (explode > 0) {
      _d.copy(b.p);
      if (_d.lengthSq() < 0.01) _d.set(b.seed - 0.5, 0.3, 0.2);
      _d.normalize();
      b.v.addScaledVector(_d, explode * (3 + b.seed * 5) * dt);
    }
    if (mouseOn) {
      _d.subVectors(b.p, mouse);
      _d.z *= 0.5;
      const dist = _d.length();
      const R = 2.6;
      if (dist < R) {
        const f = (R - dist) / R;
        _d.multiplyScalar(1 / (dist + 1e-4));
        b.v.addScaledVector(_d, f * 11 * dt);
        b.v.addScaledVector(mouseVel, f * 0.03);
        b.w.x += mouseVel.y * f * 0.01;
        b.w.y -= mouseVel.x * f * 0.01;
      }
    }
  }
  // soft collisions
  for (let i = 0; i < bodies.length; i++) {
    const a = bodies[i];
    for (let j = i + 1; j < bodies.length; j++) {
      const c = bodies[j];
      _d.subVectors(a.p, c.p);
      const dist = _d.length();
      const min = a.r + c.r;
      if (dist < min && dist > 1e-5) {
        const push = (min - dist) * 14 * dt;
        _d.multiplyScalar(1 / dist);
        const ta = c.m / (a.m + c.m), tc = a.m / (a.m + c.m);
        a.v.addScaledVector(_d, push * ta * 2);
        c.v.addScaledVector(_d, -push * tc * 2);
        // positional correction keeps the pile from sinking into itself
        a.p.addScaledVector(_d, (min - dist) * 0.25 * ta);
        c.p.addScaledVector(_d, -(min - dist) * 0.25 * tc);
      }
    }
  }
  const lin = Math.exp(-dt * (3.2 - explode * 2.4));
  const ang = Math.exp(-dt * 1.4);
  for (const b of bodies) {
    b.v.multiplyScalar(lin);
    b.p.addScaledVector(b.v, dt);
    b.w.multiplyScalar(ang);
    b.w.x += Math.sin(env.time * 0.2 + b.seed * 20) * 0.012 * dt;
    b.w.y += Math.cos(env.time * 0.16 + b.seed * 30) * 0.012 * dt;
    const wl = b.w.length();
    if (wl > 1e-5) {
      _axis.copy(b.w).multiplyScalar(1 / wl);
      _q.setFromAxisAngle(_axis, wl * dt);
      b.mesh.quaternion.premultiply(_q);
    }
  }
}

function makeRenderer(canvas, alpha) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, powerPreference: "high-performance" });
  // Neutral keeps gold warm and marble white instead of shifting their hue
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

/* --------------------------------------------------------------- mount */
export function mountStage(host, opts = {}) {
  const preset = PRESETS[opts.preset] || PRESETS.home;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const weak = (navigator.hardwareConcurrency || 8) <= 4;
  // Fewer, larger pieces read as sculpture; a crowd reads as texture.
  const home = (opts.preset || "home") === "home";
  const count = opts.count || (home ? (small || weak ? 11 : 18) : (small || weak ? 10 : 18));

  const canvas = document.createElement("canvas");
  canvas.className = "stage-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  let renderer;
  try { renderer = makeRenderer(canvas, true); }
  catch (e) { canvas.remove(); host.classList.add("stage-fallback"); return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);

  const world = buildScene(renderer, preset, count, opts.seed || 7);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  camera.position.set(0, 0, 15);
  camera.add(haloPlane());
  world.scene.add(camera);

  const state = {
    dolly: 0, explode: 0, spin: 0,
    mouse: new THREE.Vector3(99, 99, 0), mouseVel: new THREE.Vector3(), mouseOn: false,
    time: 0, spread: 1, visible: true, focusY: 0, baseZ: 17,
  };
  const target = { dolly: 0, explode: 0, spin: 0 };
  let appliedFocus = 0;
  const ndc = new THREE.Vector2(), ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3(), last = new THREE.Vector3();
  let parX = 0, parY = 0, tParX = 0, tParY = 0;

  function resize() {
    const r = host.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the cluster framed on tall phones and very wide desktops alike
    camera.fov = camera.aspect < 0.8 ? 46 : 32;
    camera.updateProjectionMatrix();
    appliedFocus = null;
    // Inner-page stages are short and wide: stretch the cluster to the frame
    // and bring the camera in so the scene fills it instead of floating small.
    state.spread = home ? Math.max(1, Math.min(1.6, camera.aspect * 0.7)) : Math.max(1, Math.min(3.2, camera.aspect * 1.05));
    // short, wide frames bring the camera in so the cluster still fills them
    state.baseZ = home
      ? (camera.aspect > 2.3 ? 12 : camera.aspect > 1.5 ? 15 : camera.aspect < 0.8 ? 10.5 : camera.aspect < 1.2 ? 12 : 17)
      : (camera.aspect > 2.3 ? 9 : camera.aspect > 1.5 ? 10.5 : camera.aspect < 0.8 ? 9 : 9.5);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  function onPointer(e) {
    const r = host.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
    state.mouseOn = inside && !REDUCE;
    tParX = inside ? (x / r.width - 0.5) : 0;
    tParY = inside ? (y / r.height - 0.5) : 0;
    if (!inside) return;
    ndc.set((x / r.width) * 2 - 1, -(y / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) {
      state.mouseVel.subVectors(hit, last).multiplyScalar(30).clampLength(0, 30);
      last.copy(hit);
      state.mouse.copy(hit);
    }
  }
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  host.addEventListener("pointerleave", () => { state.mouseOn = false; tParX = tParY = 0; });

  const io = new IntersectionObserver(([en]) => { state.visible = en.isIntersecting; }, { rootMargin: "120px" });
  io.observe(host);

  // Settle the cluster before the first frame so it arrives as a mass, not a scatter
  for (let i = 0; i < (REDUCE ? 360 : 240); i++) step(world.bodies, 1 / 60, { ...state, time: i / 60 });

  let lastT = performance.now(), raf = 0, frames = 0;
  let ftAvg = 16, dprNow = renderer.getPixelRatio(), lastDrop = 0;
  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.033, (now - lastT) / 1000);
    lastT = now;
    if (!state.visible) return;
    state.time += dt;
    const k = 1 - Math.exp(-dt * 6);
    state.dolly += (target.dolly - state.dolly) * k;
    state.explode += (target.explode - state.explode) * k;
    state.spin += (target.spin - state.spin) * k;
    if (!REDUCE) {
      step(world.bodies, dt * 0.5, state);
      step(world.bodies, dt * 0.5, state);
    }
    state.mouseVel.multiplyScalar(0.85);
    parX += (tParX - parX) * (1 - Math.exp(-dt * 3));
    parY += (tParY - parY) * (1 - Math.exp(-dt * 3));
    // camera: gentle parallax, scroll-driven dolly that ends inside the cluster
    const z = THREE.MathUtils.lerp(state.baseZ, 2.2, state.dolly);
    const orbit = state.spin;
    camera.position.set(Math.sin(orbit) * z + parX * 1.4, -parY * 1.0 + Math.sin(orbit * 0.5) * 0.6, Math.cos(orbit) * z);
    camera.lookAt(0, 0, 0);
    if (state.focusY !== appliedFocus) {
      const r = renderer.getSize(new THREE.Vector2());
      if (state.focusY) camera.setViewOffset(r.x, r.y, 0, -state.focusY, r.x, r.y);
      else camera.clearViewOffset();
      appliedFocus = state.focusY;
    }
    world.stars.rotation.y = state.time * 0.008;
    renderer.render(world.scene, camera);
    if (++frames === 2) { host.classList.add("is-ready"); window.dispatchEvent(new Event("stage:ready")); }
    // adaptive resolution: step down if frames run long, never below 1x
    ftAvg += (dt * 1000 - ftAvg) * 0.05;
    if (ftAvg > 26 && dprNow > 1 && state.time - lastDrop > 2) {
      dprNow = Math.max(1, dprNow - 0.25);
      renderer.setPixelRatio(dprNow);
      resize();
      lastDrop = state.time; ftAvg = 16;
    }
  }
  // Compile shaders off the main thread where the browser allows it (KHR_parallel_shader_compile),
  // so the glass doesn't freeze the page while it warms up.
  let disposed = false;
  const start = () => { if (!disposed) { lastT = performance.now(); raf = requestAnimationFrame(tick); } };
  if (renderer.compileAsync) renderer.compileAsync(world.scene, camera).then(start, start);
  else start();

  return {
    setJourney(j) {
      if (j.dolly != null) target.dolly = j.dolly;
      if (j.explode != null) target.explode = j.explode;
      if (j.spin != null) target.spin = j.spin;
      if (j.focusY != null) state.focusY = Math.round(j.focusY);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      world.dispose(); renderer.dispose(); canvas.remove();
    },
  };
}

/* A settled cluster rendered once to an image, for cards. One shared
   off-screen renderer keeps the WebGL context count at one. */
let stillRenderer = null;
export async function renderStill({ preset = "home", seed = 1, count = 14, width = 800, height = 600, zoom = 11 } = {}) {
  if (!stillRenderer) {
    stillRenderer = makeRenderer(document.createElement("canvas"), true);
    stillRenderer.setClearColor(0x000000, 0);
  }
  const r = stillRenderer;
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  r.setSize(width, height, false);
  const world = buildScene(r, PRESETS[preset] || PRESETS.home, count, seed);
  const env = { mouse: new THREE.Vector3(99, 99, 0), mouseVel: new THREE.Vector3(), mouseOn: false, explode: 0, spread: Math.min(1.8, width / height * 0.85), time: 0 };
  for (let i = 0; i < 420; i++) { env.time = i / 60; step(world.bodies, 1 / 60, env); }
  const cam = new THREE.PerspectiveCamera(32, width / height, 0.1, 80);
  cam.add(haloPlane());
  world.scene.add(cam);
  const a = mulberry32(seed * 13)() * 6.28;
  cam.position.set(Math.sin(a) * zoom, 1.2, Math.cos(a) * zoom);
  cam.lookAt(0, 0, 0);
  r.render(world.scene, cam);
  const url = r.domElement.toDataURL("image/png");
  world.dispose();
  return url;
}
