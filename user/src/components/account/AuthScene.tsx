import { useEffect, useRef } from "react";

/**
 * Constellation 3D (three.js) du panneau gauche des écrans de connexion :
 * un globe de points reliés entre eux — le réseau de talents et
 * d'entreprises — qui tourne lentement et suit la souris.
 *
 * three.js est chargé à la demande, seulement sur ces pages. Le rendu
 * s'arrête quand l'onglet est caché, et l'animation est figée si le
 * visiteur demande moins de mouvement.
 */
export function AuthScene({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    // Le panneau n'existe qu'à partir de lg (1024 px) : three.js n'est chargé
    // qu'à ce moment-là, jamais sur mobile.
    const desktop = window.matchMedia("(min-width: 1024px)");
    let started = false;
    const start = () => {
      if (started || !desktop.matches) return;
      started = true;
      void import("three").then((THREE) => {
        if (disposed) return;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);
        renderer.domElement.style.display = "block";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 7.5);

        const cyan = new THREE.Color("#22b5d6");
        const glow = new THREE.Color("#7fe3f5");
        const group = new THREE.Group();
        scene.add(group);

        // Points répartis sur une sphère (spirale de Fibonacci).
        const COUNT = 220;
        const RADIUS = 2.4;
        const points: InstanceType<typeof THREE.Vector3>[] = [];
        for (let i = 0; i < COUNT; i++) {
          const y = 1 - (i / (COUNT - 1)) * 2;
          const r = Math.sqrt(1 - y * y);
          const theta = Math.PI * (3 - Math.sqrt(5)) * i;
          points.push(
            new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(RADIUS),
          );
        }
        const nodeGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const nodes = new THREE.Points(
          nodeGeometry,
          new THREE.PointsMaterial({ color: glow, size: 0.06, transparent: true, opacity: 0.95 }),
        );
        group.add(nodes);

        // Liens entre voisins proches.
        const linkPositions: number[] = [];
        const MAX_DISTANCE = 0.62;
        for (let i = 0; i < COUNT; i++) {
          for (let j = i + 1; j < COUNT; j++) {
            if (points[i].distanceTo(points[j]) < MAX_DISTANCE) {
              linkPositions.push(
                points[i].x,
                points[i].y,
                points[i].z,
                points[j].x,
                points[j].y,
                points[j].z,
              );
            }
          }
        }
        const linkGeometry = new THREE.BufferGeometry();
        linkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linkPositions, 3));
        const links = new THREE.LineSegments(
          linkGeometry,
          new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: 0.28 }),
        );
        group.add(links);

        // Anneaux en orbite.
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: cyan,
          transparent: true,
          opacity: 0.35,
        });
        const ringA = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.008, 8, 160), ringMaterial);
        ringA.rotation.x = Math.PI / 2.4;
        const ringB = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.006, 8, 160), ringMaterial);
        ringB.rotation.set(Math.PI / 3, Math.PI / 5, 0);
        group.add(ringA, ringB);

        // Satellites qui parcourent les anneaux.
        const satelliteGeometry = new THREE.SphereGeometry(0.07, 16, 16);
        const satelliteMaterial = new THREE.MeshBasicMaterial({ color: glow });
        const satA = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        const satB = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        ringA.add(satA);
        ringB.add(satB);

        // Poussière d'étoiles en fond.
        const dust: number[] = [];
        for (let i = 0; i < 400; i++) {
          dust.push(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 14,
            -4 - Math.random() * 10,
          );
        }
        const dustGeometry = new THREE.BufferGeometry();
        dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dust, 3));
        const stars = new THREE.Points(
          dustGeometry,
          new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.03,
            transparent: true,
            opacity: 0.45,
          }),
        );
        scene.add(stars);

        const resize = () => {
          const { clientWidth: w, clientHeight: h } = host;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          renderer.domElement.style.width = "100%";
          renderer.domElement.style.height = "100%";
          camera.aspect = w / h;
          // Le globe garde sa taille apparente sur les panneaux étroits.
          camera.position.z = w / h < 0.8 ? 9.5 : 7.5;
          camera.updateProjectionMatrix();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        resize();

        const pointer = { x: 0, y: 0 };
        const onPointer = (event: PointerEvent) => {
          const rect = host.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        };
        window.addEventListener("pointermove", onPointer);

        let frame = 0;
        const clock = new THREE.Clock();
        const render = () => {
          const t = clock.getElapsedTime();
          group.rotation.y = t * 0.12 + pointer.x * 0.35;
          group.rotation.x = Math.sin(t * 0.2) * 0.08 + pointer.y * 0.25;
          satA.position.set(Math.cos(t * 0.8) * 3.2, Math.sin(t * 0.8) * 3.2, 0);
          satB.position.set(Math.cos(-t * 0.55 + 1) * 3.6, Math.sin(-t * 0.55 + 1) * 3.6, 0);
          stars.rotation.z = t * 0.01;
          (links.material as InstanceType<typeof THREE.LineBasicMaterial>).opacity =
            0.22 + Math.sin(t * 1.2) * 0.06;
          renderer.render(scene, camera);
        };
        const loop = () => {
          render();
          frame = requestAnimationFrame(loop);
        };
        const onVisibility = () => {
          cancelAnimationFrame(frame);
          if (!document.hidden && !reduceMotion) loop();
        };
        document.addEventListener("visibilitychange", onVisibility);
        if (reduceMotion) render();
        else loop();

        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          window.removeEventListener("pointermove", onPointer);
          document.removeEventListener("visibilitychange", onVisibility);
          scene.traverse((object) => {
            const mesh = object as {
              geometry?: { dispose(): void };
              material?: { dispose(): void };
            };
            mesh.geometry?.dispose();
            mesh.material?.dispose();
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
      });
    };

    start();
    desktop.addEventListener("change", start);

    return () => {
      disposed = true;
      desktop.removeEventListener("change", start);
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden />;
}
