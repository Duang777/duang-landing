"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { springConfig, stepSpring } from "@/lib/spring";
import { LOGO_LAYERS, type LogoLayer } from "./contours";


function shapeFromCubics(layer: LogoLayer) {
  const shape = new THREE.Shape();
  const [x0, y0] = layer.cubics[0].p0;
  shape.moveTo(x0, y0);
  for (const c of layer.cubics) {
    shape.bezierCurveTo(c.c1[0], c.c1[1], c.c2[0], c.c2[1], c.p3[0], c.p3[1]);
  }
  shape.closePath();
  return shape;
}

function buildLogo() {
  const depth = 0.3;
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x1c1c1e,
    roughness: 0.36,
    metalness: 0.15,
    clearcoat: 0.85,
    clearcoatRoughness: 0.22,
    envMapIntensity: 0.9,
  });
  const root = new THREE.Group();
  LOGO_LAYERS.forEach((layer, i) => {
    const geo = new THREE.ExtrudeGeometry(shapeFromCubics(layer), {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.016,
      bevelSize: 0.012,
      bevelSegments: 6,
      curveSegments: 64,
    });
    geo.translate(0, 0, -depth / 2 + (1 - i) * 0.04);
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    root.add(mesh);
  });
  const center = new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3());
  for (const child of root.children) child.position.sub(center);
  root.scale.setScalar(1.55);
  return root;
}

/** The Duang stacked logo as a graphite object: floats, leans toward the pointer, spins when dragged or scrolled. */
export function LogoStage({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = "size-full opacity-0 transition-opacity duration-700 ease-out";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.5;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xfffaf5, 0xe8e0d6, 0.8));
    const key = new THREE.DirectionalLight(0xfff4e8, 1.8);
    key.position.set(3.8, 5.5, 4.2);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 30 });
    key.shadow.bias = -0.0002;
    key.shadow.normalBias = 0.025;
    key.shadow.radius = 10;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.1);
    rim.position.set(-3, 2.5, -3.5);
    scene.add(rim);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.14 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.25;
    ground.receiveShadow = true;
    scene.add(ground);

    const logo = buildLogo();
    scene.add(logo);
    // Click to take the logo apart: arch up and forward, bottom chevron down and back, then it springs shut.
    const layers = logo.children.map((m) => ({ mesh: m, base: m.position.clone() }));
    const SPREAD = [
      { y: 0.42, z: 0.32, rz: 0.22 },
      { y: 0, z: 0, rz: -0.06 },
      { y: -0.42, z: -0.32, rz: -0.18 },
    ];
    const spread = { x: 0, v: 0 };
    const spreadOpen = springConfig(0.45, 0.7);
    const spreadShut = springConfig(0.6, 0.42);
    let spreadTarget = 0;
    let shutTimer = 0;
    const explode = () => {
      spreadTarget = 1;
      window.clearTimeout(shutTimer);
      shutTimer = window.setTimeout(() => (spreadTarget = 0), 1100);
      kick();
    };

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const aspect = width / height;
      camera.aspect = aspect;
      // Keep the logo near 40% of the frame height on wide screens, back off on portrait ones.
      const z = Math.max(8, 6.4 / aspect);
      camera.position.set(0.12, 0.4, z);
      // Portrait frames put the pill closer to the logo, so lift the logo further.
      camera.lookAt(0, aspect < 1 ? -1.3 : -0.95, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    // Pointer lean, drag spin with inertia, and scroll spin all feed one target rotation.
    const pointer = { x: 0, y: 0 };
    const drag = { active: false, lastX: 0, startX: 0, startY: 0, moved: 0, spin: 0, velocity: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (drag.active) {
        drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY));
        const dx = (e.clientX - drag.lastX) * 0.012;
        drag.lastX = e.clientX;
        drag.spin += dx;
        drag.velocity = dx;
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      drag.active = true;
      drag.lastX = drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.moved = 0;
      drag.velocity = 0;
    };
    const onPointerUp = () => {
      if (drag.active && drag.moved < 6 && !reduced) explode();
      drag.active = false;
    };
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);

    let visible = true;
    let raf = 0;
    let shown = false;
    const clock = new THREE.Clock();
    const rot = { x: 0, y: 0 };

    const frame = () => {
      raf = 0;
      const t = clock.getElapsedTime();
      const progress = Math.min(1, window.scrollY / Math.max(1, el.offsetHeight));
      if (!drag.active) {
        drag.spin += drag.velocity;
        drag.velocity *= 0.94;
      }
      const targetY = -0.35 + pointer.x * 0.35 + drag.spin + progress * Math.PI * 0.8;
      const targetX = 0.1 + pointer.y * 0.16;
      rot.y += (targetY - rot.y) * 0.08;
      rot.x += (targetX - rot.x) * 0.08;
      logo.rotation.set(rot.x, rot.y, 0);
      logo.position.y = Math.sin(t * 0.9) * 0.04 + progress * 0.5;
      stepSpring(spread, spreadTarget, spreadTarget ? spreadOpen : spreadShut, 1 / 60);
      layers.forEach(({ mesh, base }, i) => {
        const o = SPREAD[i] ?? SPREAD[1];
        mesh.position.set(base.x, base.y + o.y * spread.x, base.z + o.z * spread.x);
        mesh.rotation.z = o.rz * spread.x;
      });
      renderer.render(scene, camera);
      if (!shown) {
        shown = true;
        renderer.domElement.classList.remove("opacity-0");
      }
      if (visible && !reduced) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting && document.visibilityState === "visible";
      if (visible) kick();
    });
    io.observe(el);
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) kick();
    };
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(el);
    resize();
    kick();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(shutTimer);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={className} aria-hidden />;
}
