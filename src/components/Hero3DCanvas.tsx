import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  fullBackground?: boolean;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ fullBackground = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera - configured for full background ambient coverage or contained
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    if (fullBackground) {
      camera.position.set(1.5, 0.2, 8.5);
    } else {
      camera.position.set(0, 0, 8);
    }

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = fullBackground ? 1.05 : 1.2;
    container.appendChild(renderer.domElement);

    // Master Group for mouse rotation
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    if (fullBackground) {
      // Slightly shift to the right so it balances with the left headline while sweeping behind
      masterGroup.position.set(1.8, 0, 0);
    }

    // Centerpiece: Geometric Torus Knot with metallic orange/chrome finish
    const torusGeometry = new THREE.TorusKnotGeometry(
      fullBackground ? 1.8 : 1.6,
      fullBackground ? 0.48 : 0.45,
      128,
      32,
      2,
      3
    );
    const torusMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xff5500),
      emissive: new THREE.Color(0x220500),
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      transparent: fullBackground,
      opacity: fullBackground ? 0.85 : 1.0,
      wireframe: false,
    });
    const mainMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    masterGroup.add(mainMesh);

    // Outer Wireframe Cage: Icosahedron with cyan glow
    const cageGeo = new THREE.IcosahedronGeometry(fullBackground ? 3.2 : 2.8, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x00e5ff),
      wireframe: true,
      transparent: true,
      opacity: fullBackground ? 0.25 : 0.22,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    masterGroup.add(cageMesh);

    // Floating Abstract Satellite Spheres
    const satellites: THREE.Mesh[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const cyanSatMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x004455,
      roughness: 0.2,
      metalness: 0.8,
    });
    const orangeSatMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0x441100,
      roughness: 0.2,
      metalness: 0.8,
    });

    const satCount = fullBackground ? 7 : 5;
    for (let i = 0; i < satCount; i++) {
      const mesh = new THREE.Mesh(sphereGeo, i % 2 === 0 ? cyanSatMat : orangeSatMat);
      const angle = (i / satCount) * Math.PI * 2;
      const radius = fullBackground ? 4.0 : 3.2;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(i * 1.5) * 1.5, Math.sin(angle) * radius);
      masterGroup.add(mesh);
      satellites.push(mesh);
    }

    // Creative Particle Field - wider dispersion for full background
    const particleCount = fullBackground ? 450 : 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0xff5500);
    const color2 = new THREE.Color(0x00e5ff);

    for (let i = 0; i < particleCount; i++) {
      const pRadius = fullBackground ? 3.0 + Math.random() * 8.5 : 3.5 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = pRadius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = pRadius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = pRadius * Math.cos(phi);

      const mixed = Math.random() > 0.5 ? color1 : color2;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: fullBackground ? 0.06 : 0.05,
      vertexColors: true,
      transparent: true,
      opacity: fullBackground ? 0.75 : 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const orangeLight = new THREE.PointLight(0xff5500, 5.0, 25);
    orangeLight.position.set(5, 5, 5);
    scene.add(orangeLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 5.5, 25);
    cyanLight.position.set(-5, -4, 4);
    scene.add(cyanLight);

    const topWhiteLight = new THREE.DirectionalLight(0xffffff, 1.8);
    topWhiteLight.position.set(0, 10, 6);
    scene.add(topWhiteLight);

    // Interactive mouse tracking with gentle parallax
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = x * 0.4;
      targetRotationX = -y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width || container.clientWidth;
        height = entry.contentRect.height || container.clientHeight;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    const handleWindowResize = () => {
      if (container) {
        width = container.clientWidth;
        height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleWindowResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous auto rotation
        mainMesh.rotation.x += delta * 0.22;
        mainMesh.rotation.y += delta * 0.32;

        cageMesh.rotation.x -= delta * 0.12;
        cageMesh.rotation.y -= delta * 0.18;

        particles.rotation.y += delta * 0.04;

        // Orbit satellites
        satellites.forEach((sat, idx) => {
          const orbitSpeed = 0.45 + idx * 0.12;
          const currentAngle = elapsedTime * orbitSpeed + (idx * Math.PI * 2) / satCount;
          sat.position.x = Math.cos(currentAngle) * (3.2 + (idx % 2) * 0.6);
          sat.position.z = Math.sin(currentAngle) * (3.2 + (idx % 2) * 0.6);
          sat.position.y = Math.sin(elapsedTime * 1.4 + idx) * 0.9;
        });

        // Smooth mouse damping
        currentRotationX += (targetRotationX - currentRotationX) * 0.04;
        currentRotationY += (targetRotationY - currentRotationY) * 0.04;
        masterGroup.rotation.x = currentRotationX;
        masterGroup.rotation.y = currentRotationY;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleWindowResize);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      sphereGeo.dispose();
      cyanSatMat.dispose();
      orangeSatMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [fullBackground]);

  return (
    <div
      ref={containerRef}
      className={
        fullBackground
          ? 'absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden'
          : 'w-full h-full min-h-[380px] lg:min-h-[560px] relative pointer-events-none select-none flex items-center justify-center'
      }
      aria-hidden="true"
    >
      {/* Subtle background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#FF5500]/12 blur-[120px] pointer-events-none right-10 top-1/4" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[#00E5FF]/10 blur-[120px] -left-10 bottom-10 pointer-events-none" />
    </div>
  );
};
