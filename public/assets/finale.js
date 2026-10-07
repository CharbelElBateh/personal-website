/* ==========================================================================
   Finale — the closing scroll sequence on the home page.

   One scene, one camera flight, driven by the pinned section's progress:
     0.00 – 0.24  a framed glass window in a black wall tilts square and the
                  camera flies through it
     0.24 – 0.48  a void with a rainbow halo ring; a statement spreads apart
                  word by word; the camera passes through the ring
     0.48 – 0.76  a fall down a colonnade of marble columns with gold capitals
     0.76 – 0.92  a glass pane at the end shatters into iridescent shards
     0.86 – 1.00  floating glass crystals and the closing call to action
   The DOM overlays (statement, call to action) are driven here too.
   ========================================================================== */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
const { makeMaterials, flutedDrum, capital, haloPlane, mulberry32 } = await import("./stage.js" + new URL(import.meta.url).search);

const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
const range = (p, a, b) => clamp01((p - a) / (b - a));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);
const lerp = (a, b, t) => a + (b - a) * t;

const WALL_Z = 0, HALO_Z = -16, CORRIDOR_START = -22, CORRIDOR_END = -76, PANE_Z = -82, CRYSTAL_Z = -94;

/* ---------------------------------------------------------------- pieces */
function windowWall(w, h, mats) {
  const group = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(-200, -200); shape.lineTo(200, -200); shape.lineTo(200, 200); shape.lineTo(-200, 200); shape.lineTo(-200, -200);
  const hole = new THREE.Path();
  hole.moveTo(-w / 2, -h / 2); hole.lineTo(w / 2, -h / 2); hole.lineTo(w / 2, h / 2); hole.lineTo(-w / 2, h / 2); hole.lineTo(-w / 2, -h / 2);
  shape.holes.push(hole);
  group.add(new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: 0x000000 })));
  // gold frame
  const t = 0.05, d = 0.12;
  [[0, h / 2, w + t * 2, t], [0, -h / 2, w + t * 2, t], [w / 2, 0, t, h], [-w / 2, 0, t, h]].forEach(([x, y, bw, bh]) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, d), mats.gold);
    bar.position.set(x, y, 0);
    group.add(bar);
  });
  // the glass pane you fly through
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mats.pane);
  pane.position.z = 0.02;
  group.add(pane);
  group.userData.pane = pane;
  return group;
}

function haloRing() {
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uFade: { value: 1 } },
    vertexShader: "varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: [
      "varying vec3 vPos; uniform float uTime; uniform float uFade;",
      "void main(){",
      "  float r = length(vPos.xy);",
      "  float t = (r - 3.2) / 2.6;",
      "  float ang = atan(vPos.y, vPos.x);",
      "  vec3 rainbow = 0.5 + 0.5 * cos(6.2831 * (t * 0.9 + ang * 0.03 + uTime * 0.02 + vec3(0.0, 0.33, 0.67)));",
      "  vec3 col = mix(rainbow, vec3(0.79, 0.66, 0.43), 0.35);",
      "  float a = smoothstep(0.0, 0.4, t) * smoothstep(1.0, 0.55, t) * 0.55 * uFade;",
      "  gl_FragColor = vec4(col * a, a);",
      "}",
    ].join("\n"),
  });
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.2, 5.8, 160, 1), mat);
  return ring;
}

/* A glass pane pre-cut into triangular shards; a vertex shader flies them apart. */
function shatterPane(w, h, cols, rows, material, seed) {
  const rand = mulberry32(seed);
  const pts = [];
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const edge = i === 0 || j === 0 || i === cols || j === rows;
      const jx = edge ? 0 : (rand() - 0.5) * (w / cols) * 0.7;
      const jy = edge ? 0 : (rand() - 0.5) * (h / rows) * 0.7;
      pts.push([-w / 2 + (i / cols) * w + jx, -h / 2 + (j / rows) * h + jy]);
    }
  }
  const P = (i, j) => pts[j * (cols + 1) + i];
  const tris = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1);
    if (rand() < 0.5) { tris.push([a, b, c], [a, c, d]); } else { tris.push([a, b, d], [b, c, d]); }
  }
  const depth = 0.05;
  const pos = [], center = [], dir = [], spin = [];
  tris.forEach((t) => {
    const cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
    const f = t.map(([x, y]) => [x, y, depth / 2]);
    const bk = t.map(([x, y]) => [x, y, -depth / 2]);
    const faces = [[f[0], f[1], f[2]], [bk[0], bk[2], bk[1]]];
    for (let k = 0; k < 3; k++) {
      const k2 = (k + 1) % 3;
      faces.push([f[k], bk[k], bk[k2]], [f[k], bk[k2], f[k2]]);
    }
    // outward from the centre and toward the camera (+z)
    const out = new THREE.Vector3(cx, cy, 0).multiplyScalar(0.35 + rand() * 0.5);
    out.z = 2.2 + rand() * 3.5;
    const axis = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
    const speed = (rand() - 0.5) * 9;
    faces.forEach((tri) => tri.forEach((v) => {
      pos.push(v[0], v[1], v[2]);
      center.push(cx, cy, 0);
      dir.push(out.x, out.y, out.z);
      spin.push(axis.x, axis.y, axis.z, speed);
    }));
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("aCenter", new THREE.Float32BufferAttribute(center, 3));
  geo.setAttribute("aDir", new THREE.Float32BufferAttribute(dir, 3));
  geo.setAttribute("aSpin", new THREE.Float32BufferAttribute(spin, 4));
  geo.computeVertexNormals();

  const uniforms = { uShatter: { value: 0 } };
  const mat = material.clone();
  mat.side = THREE.DoubleSide;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uShatter = uniforms.uShatter;
    const rot = [
      "attribute vec3 aCenter; attribute vec3 aDir; attribute vec4 aSpin; uniform float uShatter; varying float vFadeZ;",
      "vec3 rotAxis(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c); }",
    ].join("\n");
    shader.vertexShader = rot + "\n" + shader.vertexShader
      .replace("#include <beginnormal_vertex>", "vec3 objectNormal = rotAxis(vec3(normal), aSpin.xyz, aSpin.w * uShatter);")
      .replace("#include <begin_vertex>", [
        "vec3 transformed = position - aCenter;",
        "transformed = rotAxis(transformed, aSpin.xyz, aSpin.w * uShatter);",
        "transformed += aCenter + aDir * (uShatter * 0.7 + uShatter * uShatter * 2.4);",
      ].join("\n"))
      .replace("#include <project_vertex>", "#include <project_vertex>\nvFadeZ = -mvPosition.z;");
    // shards dissolve as they reach the lens instead of washing out the view
    shader.fragmentShader = "varying float vFadeZ;\n" + shader.fragmentShader
      .replace("#include <dithering_fragment>", "gl_FragColor.a *= smoothstep(0.5, 3.2, vFadeZ);\n#include <dithering_fragment>");
  };
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.uniforms = uniforms;
  return mesh;
}

/* ----------------------------------------------------------------- mount */
function mountFinale(section) {
  const sticky = section.querySelector(".finale-sticky");
  const canvas = section.querySelector(".finale-canvas");
  const words = Array.from(section.querySelectorAll(".finale-statement .w"));
  const cta = section.querySelector(".finale-cta");
  const cue = section.querySelector(".finale-cue");
  const cueFill = cue && cue.querySelector("i");
  const skip = section.querySelector(".finale-skip");
  if (skip) skip.addEventListener("click", () => {
    const end = section.offsetTop + section.offsetHeight - window.innerHeight;
    if (window.Smooth && window.Smooth.to) window.Smooth.to(end); else window.scrollTo(0, end);
    const link = section.querySelector(".finale-card a");
    if (link) link.focus({ preventScroll: true });
  });
  const small = Math.min(window.innerWidth, window.innerHeight) < 700 || (navigator.hardwareConcurrency || 8) <= 4;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.4 : 1.6));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.8;
  pmrem.dispose();
  scene.fog = new THREE.Fog(0x000000, 16, 46);

  const mats = makeMaterials();
  // a thin sheet of clear glass: mostly reflection and an iridescent sheen
  mats.pane = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.14,
    iridescence: 1, iridescenceIOR: 1.3, envMapIntensity: 2.4, side: THREE.DoubleSide, depthWrite: false,
  });
  // shards must catch light against black: reflective, iridescent, semi-opaque
  mats.shard = new THREE.MeshPhysicalMaterial({
    color: 0xe8eeff, metalness: 0.1, roughness: 0.06, transparent: true, opacity: 0.26,
    iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [150, 700],
    clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 3, depthWrite: false,
  });

  scene.add(new THREE.AmbientLight(0x6b6152, 0.35));
  const key = new THREE.DirectionalLight(0xfff0d8, 2.0);
  key.position.set(-4, 6, 6);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 140);
  camera.position.set(0, 0, 14);
  scene.add(camera);

  // 1. the window
  // landscape window on desktop, portrait on phones
  const portrait = sticky.clientWidth / Math.max(1, sticky.clientHeight) < 0.8;
  const W = portrait ? 4.4 : 9, Hh = portrait ? 6.4 : 5.4;
  const wall = windowWall(W, Hh, mats);
  wall.position.z = WALL_Z;
  scene.add(wall);

  // 2. the void: halo ring, drifting relics, stars
  const ring = haloRing();
  // lifted and scaled so the whole ring floats above the floor (y -3.7); the camera still passes through its centre
  ring.position.set(0, 1.1, HALO_Z);
  ring.scale.setScalar(0.8);
  scene.add(ring);
  const rand = mulberry32(99);
  const relics = new THREE.Group();
  const drumGeo = flutedDrum(0.5, 0.75, 20), orbGeo = new THREE.SphereGeometry(0.45, 40, 28);
  for (let i = 0; i < (small ? 6 : 12); i++) {
    const m = new THREE.Mesh(rand() < 0.5 ? drumGeo : orbGeo, rand() < 0.75 ? mats.glass : mats.gold);
    const side = rand() < 0.5 ? -1 : 1;
    m.position.set(side * (2.6 + rand() * 3.5), (rand() - 0.5) * 5, -4 - rand() * 10);
    m.rotation.set(rand() * 6, rand() * 6, rand() * 6);
    m.userData.spin = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.4);
    relics.add(m);
  }
  scene.add(relics);
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(1600 * 3);
  for (let i = 0; i < 1600; i++) {
    starPos[i * 3] = (rand() - 0.5) * 60;
    starPos[i * 3 + 1] = (rand() - 0.5) * 40;
    starPos[i * 3 + 2] = 4 - rand() * 120;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xc9a96e, size: 0.05, transparent: true, opacity: 0.8, depthWrite: false })));

  // 3. the colonnade
  const pairs = small ? 8 : 13;
  const step = (CORRIDOR_START - CORRIDOR_END) / (pairs - 1);
  const colGeo = flutedDrum(0.42, 7, 20);
  const capGeo = capital();
  const columns = new THREE.InstancedMesh(colGeo, mats.marble, pairs * 2);
  const caps = new THREE.InstancedMesh(capGeo, mats.gold, pairs * 2);
  const lintels = new THREE.InstancedMesh(new THREE.BoxGeometry(1.3, 0.3, step + 0.2), mats.gold, 2);
  const mtx = new THREE.Matrix4();
  for (let k = 0; k < pairs; k++) {
    const z = CORRIDOR_START - k * step;
    [-3, 3].forEach((x, s) => {
      mtx.makeTranslation(x, -0.2, z);
      columns.setMatrixAt(k * 2 + s, mtx);
      mtx.compose(new THREE.Vector3(x, 3.45, z), new THREE.Quaternion(), new THREE.Vector3(0.75, 0.75, 0.75));
      caps.setMatrixAt(k * 2 + s, mtx);
    });
  }
  scene.add(columns, caps);
  [-3, 3].forEach((x, s) => {
    mtx.compose(new THREE.Vector3(x, 3.75, (CORRIDOR_START + CORRIDOR_END) / 2), new THREE.Quaternion(), new THREE.Vector3(1, 1, (CORRIDOR_START - CORRIDOR_END) / step + 1));
    lintels.setMatrixAt(s, mtx);
  });
  scene.add(lintels);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x060504, roughness: 0.55, metalness: 0.4, envMapIntensity: 0.12 });
  // The floor is there from the very first frame: it runs under the window, through the void and down the colonnade.
  const FLOOR_NEAR = -2.6, FLOOR_FAR = CORRIDOR_END - 8;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, FLOOR_NEAR - FLOOR_FAR), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -3.7, (FLOOR_NEAR + FLOOR_FAR) / 2);
  scene.add(floor);
  const templeLights = [];
  for (let k = 0; k < 4; k++) {
    const l = new THREE.PointLight(0xc9a96e, 0, 18, 2);
    l.position.set(0, 2.5, CORRIDOR_START - (k + 0.5) * ((CORRIDOR_START - CORRIDOR_END) / 4));
    scene.add(l);
    templeLights.push(l);
  }

  /* The temple builds itself as you cross the halo: columns rise out of the
     floor in a wave from near to far, capitals settle on top, the lintels run
     along them, the floor and lights fade up. t runs 0 → 1. */
  const _p = new THREE.Vector3(), _s = new THREE.Vector3(), _q = new THREE.Quaternion();
  const CORRIDOR_LEN = CORRIDOR_START - CORRIDOR_END;
  let builtAt = -1;
  function buildTemple(t) {
    if (Math.abs(t - builtAt) < 1e-4) return;
    builtAt = t;
    for (let k = 0; k < pairs; k++) {
      const z = CORRIDOR_START - k * step;
      const start = (k / pairs) * 0.45;
      const rise = easeOut(range(t, start, start + 0.4));
      const settle = easeOut(range(t, start + 0.22, start + 0.55));
      [-3, 3].forEach((x, side) => {
        mtx.makeTranslation(x, -0.2 - (1 - rise) * 7.4, z);
        columns.setMatrixAt(k * 2 + side, mtx);
        _p.set(x, 3.45 + (1 - settle) * 1.4, z);
        _s.setScalar(0.75 * (0.4 + 0.6 * settle));
        mtx.compose(_p, _q.identity(), _s);
        caps.setMatrixAt(k * 2 + side, mtx);
      });
    }
    columns.instanceMatrix.needsUpdate = true;
    caps.instanceMatrix.needsUpdate = true;
    const run = easeOut(range(t, 0.35, 1));
    [-3, 3].forEach((x, side) => {
      const len = Math.max(0.001, run);
      _p.set(x, 3.75, CORRIDOR_START + 0.1 - (CORRIDOR_LEN + step) * len / 2);
      _s.set(1, 1, ((CORRIDOR_LEN / step) + 1) * len);
      mtx.compose(_p, _q.identity(), _s);
      lintels.setMatrixAt(side, mtx);
    });
    lintels.instanceMatrix.needsUpdate = true;
    templeLights.forEach((l, k) => { l.intensity = 30 * easeOut(range(t, 0.15 + k * 0.12, 0.5 + k * 0.12)); });
  }
  buildTemple(0);

  // 4. the pane that shatters
  const shards = shatterPane(W * 0.9, Hh * 0.9, small ? 8 : 12, small ? 5 : 7, mats.shard, 7);
  shards.position.z = PANE_Z;
  scene.add(shards);
  const paneFrame = new THREE.Group();
  [[0, Hh * 0.45, W * 0.9 + 0.1, 0.05], [0, -Hh * 0.45, W * 0.9 + 0.1, 0.05], [W * 0.45, 0, 0.05, Hh * 0.9], [-W * 0.45, 0, 0.05, Hh * 0.9]].forEach(([x, y, bw, bh]) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.1), mats.gold);
    bar.position.set(x, y, 0);
    paneFrame.add(bar);
  });
  paneFrame.position.z = PANE_Z;
  scene.add(paneFrame);

  const paneLight = new THREE.PointLight(0xffffff, 40, 14, 2);
  paneLight.position.set(-2.5, 2, PANE_Z + 4);
  scene.add(paneLight);

  // 5. crystals beyond, in a gold glow
  const crystalCount = small ? 26 : 56;
  const crystals = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.42, 0), mats.glass, crystalCount);
  const cData = [];
  for (let i = 0; i < crystalCount; i++) {
    const a = rand() * Math.PI * 2, r = 1.8 + rand() * 6;
    cData.push({
      p: new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.65, CRYSTAL_Z + (rand() - 0.5) * 10),
      q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand() * 6, rand() * 6, rand() * 6)),
      s: 0.5 + rand() * 1.1,
      w: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
      sp: 0.2 + rand() * 0.6,
    });
  }
  scene.add(crystals);
  const crystalLight = new THREE.PointLight(0xe9cf98, 60, 26, 2);
  crystalLight.position.set(0, 1, CRYSTAL_Z + 4);
  scene.add(crystalLight);
  const corridorParts = [columns, caps, lintels];
  const glow = haloPlane();
  glow.position.set(0, 0, CRYSTAL_Z - 14);
  glow.scale.setScalar(0.8);
  scene.add(glow);

  /* camera path */
  function cameraZ(p) {
    if (p < 0.24) return lerp(14, -3, easeInOut(p / 0.24));
    if (p < 0.48) return lerp(-3, HALO_Z - 1, (p - 0.24) / 0.24);
    if (p < 0.76) return lerp(HALO_Z - 1, CORRIDOR_END - 1, easeInOut((p - 0.48) / 0.28));
    if (p < 0.84) return lerp(CORRIDOR_END - 1, PANE_Z + 2.2, easeOut((p - 0.76) / 0.08));
    return lerp(PANE_Z + 2.2, CRYSTAL_Z + 7, easeInOut((p - 0.84) / 0.16));
  }

  function resize() {
    const w = sticky.clientWidth, h = sticky.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 0.8 ? 58 : 42;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(sticky);
  resize();

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "200px" }).observe(section);

  let mx = 0, my = 0, tmx = 0, tmy = 0;
  window.addEventListener("pointermove", (e) => { tmx = e.clientX / window.innerWidth - 0.5; tmy = e.clientY / window.innerHeight - 0.5; }, { passive: true });

  const q = new THREE.Quaternion(), m4 = new THREE.Matrix4(), sc = new THREE.Vector3();
  let last = performance.now(), time = 0, pSmooth = 0;
  let ftAvg = 16, dprNow = renderer.getPixelRatio(), lastDrop = 0;

  // Compile every shader and upload every buffer now, while the loader is up,
  // so the first time the visitor reaches the finale nothing stalls.
  (async () => {
    try {
      corridorParts.forEach((o) => { o.visible = true; });
      buildTemple(1);
      if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
      else renderer.compile(scene, camera);
      renderer.render(scene, camera);
      buildTemple(0);
    } catch (e) { console.warn("finale warm-up:", e); }
    if (window.LoadProgress) window.LoadProgress.mark("finale");
  })();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    time += dt;
    const r = section.getBoundingClientRect();
    const H = window.innerHeight;
    const pTarget = REDUCE ? 1 : clamp01(-r.top / Math.max(r.height - H, 1));
    // the camera glides toward the scroll position rather than snapping to it
    pSmooth += (pTarget - pSmooth) * (REDUCE ? 1 : 1 - Math.exp(-dt * 2.4));
    if (Math.abs(pTarget - pSmooth) < 0.0002) pSmooth = pTarget;
    const p = pSmooth;

    mx += (tmx - mx) * (1 - Math.exp(-dt * 3));
    my += (tmy - my) * (1 - Math.exp(-dt * 3));

    // the window squares up as you approach it
    const tilt = 1 - easeOut(p / 0.2);
    wall.rotation.set(0.32 * tilt, -0.28 * tilt, 0.04 * tilt);
    wall.userData.pane.visible = camera.position.z > 0.3;
    wall.visible = camera.position.z > -1.5;
    const temple = range(p, 0.44, 0.6);
    corridorParts.forEach((o) => { o.visible = temple > 0; });
    if (temple > 0) buildTemple(temple);

    ring.material.uniforms.uTime.value = time;
    ring.material.uniforms.uFade.value = 1 - range(p, 0.5, 0.56);
    relics.children.forEach((m) => { m.rotation.x += m.userData.spin.x * dt; m.rotation.y += m.userData.spin.y * dt; });

    // corridor sway, then a steady hold before the pane
    const z = cameraZ(p);
    const corridor = range(p, 0.48, 0.76);
    camera.position.set(mx * 0.8 + Math.sin(corridor * Math.PI * 2) * 0.35 * (1 - corridor), -my * 0.5, z);
    camera.lookAt(mx * 0.4, -my * 0.2, z - 10);
    camera.rotation.z += Math.sin(corridor * Math.PI) * 0.06;

    const shatter = range(p, 0.8, 0.97);
    shards.userData.uniforms.uShatter.value = shatter;
    // a light sheet while intact, fading as shards sweep past the lens
    shards.material.opacity = 0.16 + 0.1 * range(shatter, 0, 0.15) - 0.26 * range(shatter, 0.4, 0.75);
    shards.visible = shatter < 0.999;
    paneFrame.visible = camera.position.z > PANE_Z - 0.5;

    for (let i = 0; i < cData.length; i++) {
      const c = cData[i];
      q.setFromAxisAngle(c.w, time * c.sp);
      m4.compose(c.p, q.multiply(c.q), sc.setScalar(c.s));
      crystals.setMatrixAt(i, m4);
      q.identity();
    }
    crystals.instanceMatrix.needsUpdate = true;

    // DOM: the statement spreads apart, the call to action arrives
    const sIn = range(p, 0.24, 0.29), sOut = range(p, 0.39, 0.44), spread = easeInOut(range(p, 0.29, 0.44));
    words.forEach((w) => {
      w.style.opacity = String(sIn * (1 - sOut));
      w.style.transform = "translateX(" + (Number(w.dataset.o) * spread * (portrait ? 5 : 9)).toFixed(2) + "vw)";
    });
    const c = easeOut(range(p, 0.88, 0.96));
    cta.style.opacity = String(c);
    cta.style.transform = "translateY(" + ((1 - c) * 30).toFixed(1) + "px)";
    cta.style.pointerEvents = c > 0.5 ? "auto" : "none";
    if (cue) {
      // the cue appears once the sequence has started and leaves as the card arrives
      cue.style.opacity = String(range(p, 0.01, 0.05) * (1 - range(p, 0.84, 0.9)));
      if (skip) skip.classList.toggle("on", p > 0.01 && p < 0.84);
      cueFill.style.transform = "scaleX(" + p.toFixed(4) + ")";
    }

    renderer.render(scene, camera);

    // adaptive resolution: step down if frames run long, never below 1x
    ftAvg += (dt * 1000 - ftAvg) * 0.05;
    if (ftAvg > 26 && dprNow > 1 && time - lastDrop > 2) {
      dprNow = Math.max(1, dprNow - 0.25);
      renderer.setPixelRatio(dprNow);
      resize();
      lastDrop = time; ftAvg = 16;
    }
  }
  requestAnimationFrame(frame);
}

const finale = document.querySelector(".finale");
if (finale) {
  try { mountFinale(finale); } catch (e) { finale.classList.add("finale-static"); console.warn("finale:", e); }
}
