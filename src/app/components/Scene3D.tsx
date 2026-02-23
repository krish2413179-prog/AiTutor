import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Scene3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f);
    // Add light fog for depth
    scene.fog = new THREE.Fog(0x0f0f0f, 10, 20);

    // --- 2. Camera ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 8;

    // --- 3. Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // --- 4. Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0x14F195, 20);
    spotLight.position.set(5, 5, 5);
    spotLight.angle = 0.3;
    spotLight.penumbra = 1;
    scene.add(spotLight);

    const pointLight = new THREE.PointLight(0x9945FF, 10, 20);
    pointLight.position.set(-5, -5, -5);
    scene.add(pointLight);

    // --- 5. Objects ---
    
    // Group to hold everything for floating
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // A. The "Human Brain" (Bicameral Structure)
    const brainGroup = new THREE.Group();
    mainGroup.add(brainGroup);

    // Shared Materials
    // 1. Inner Cortex (Solid, Dark, Glossy)
    const cortexMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x050505, // Almost black
      emissive: 0x1a052a, // Very subtle purple deep glow
      emissiveIntensity: 0.3,
      roughness: 0.4,
      metalness: 0.8,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      flatShading: false,
    });

    // 2. Synaptic Web (Wireframe Overlay)
    const synapseMaterial = new THREE.LineBasicMaterial({
      color: 0x9945FF, // Neon Purple
      transparent: true,
      opacity: 0.15, // Subtle wireframe
      blending: THREE.AdditiveBlending
    });

    // Helper to create a hemisphere
    const createHemisphere = (isLeft: boolean) => {
      // Use TorusKnot to simulate the "wrinkles" of the brain, but scale it to look like a lobe
      const geo = new THREE.TorusKnotGeometry(0.8, 0.28, 150, 24, 2, 3); 
      const lobe = new THREE.Mesh(geo, cortexMaterial);
      
      // Squash and stretch to form a brain lobe shape
      lobe.scale.set(0.5, 0.8, 1.1); 
      
      // Position: Separate the two hemispheres
      lobe.position.set(isLeft ? -0.55 : 0.55, 0, 0);
      
      // Rotate to align the "knot" structure more naturally
      lobe.rotation.z = isLeft ? -0.2 : 0.2; 
      lobe.rotation.y = Math.PI / 2; // Face forward
      
      // Add Wireframe Overlay
      const wireframeGeo = new THREE.WireframeGeometry(geo);
      const wireframe = new THREE.LineSegments(wireframeGeo, synapseMaterial);
      lobe.add(wireframe);

      return lobe;
    };

    const leftHemisphere = createHemisphere(true);
    const rightHemisphere = createHemisphere(false);
    
    brainGroup.add(leftHemisphere);
    brainGroup.add(rightHemisphere);


    // 3. Active Neural Sparks (Particles) - Focused on the "Corpus Callosum" (center) and outer cortex
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    
    for(let i=0; i<particleCount; i++) {
        // Distribute particles in a brain-like volume (two ellipsoids)
        const isLeft = Math.random() > 0.5;
        const centerX = isLeft ? -0.6 : 0.6;
        
        // Random point in sphere
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 0.9 + Math.random() * 0.3; // Near surface
        
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta);
        let z = r * Math.cos(phi);
        
        // Squash to match lobe shape
        x *= 0.6;
        y *= 0.9;
        z *= 1.2;

        particlePos[i*3] = x + centerX;
        particlePos[i*3+1] = y;
        particlePos[i*3+2] = z;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    
    const particleMat = new THREE.PointsMaterial({
        color: 0x14F195, // Neon Green (Active signals)
        size: 0.04,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const neuralSparks = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(neuralSparks);


    // C. Floating "Skill Nodes" (Orbiting the brain)
    const satellites = new THREE.Group();
    // Rotate satellites group slightly
    satellites.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    mainGroup.add(satellites);

    const nodeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x14F195,
      emissive: 0x14F195,
      emissiveIntensity: 2,
      toneMapped: false
    });
    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0x9945FF,
      emissive: 0x9945FF,
      emissiveIntensity: 2,
      toneMapped: false
    });

    const node1 = new THREE.Mesh(nodeGeo, greenMat);
    node1.position.set(3.2, 0, 0);
    satellites.add(node1);

    const node2 = new THREE.Mesh(nodeGeo, greenMat);
    node2.position.set(-3.2, 0, 0);
    satellites.add(node2);

    const node3 = new THREE.Mesh(nodeGeo, purpleMat);
    node3.position.set(0, 3.2, 0);
    satellites.add(node3);

    const node4 = new THREE.Mesh(nodeGeo, purpleMat);
    node4.position.set(0, -3.2, 0);
    satellites.add(node4);

    // D. Orbital Ring
    const torusGeo = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x444444 });
    const ring = new THREE.Mesh(torusGeo, torusMat);
    ring.rotation.x = Math.PI / 2;
    satellites.add(ring);


    // --- 6. Animation Loop ---
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate group
      mainGroup.rotation.y += 0.005;

      // Float
      mainGroup.position.y = Math.sin(t / 1.5) * 0.1;

      // Pulse brain (scale)
      const scale = 1 + Math.sin(t * 2) * 0.02;
      brainGroup.scale.set(scale, scale, scale);

      // Pulse the emissive glow
      const pulse = 0.5 + Math.sin(t * 3) * 0.2;
      // Access material directly from one of the lobes
      // (This assumes the materials are shared, which they are in the setup above)
      // Note: We need to be careful with type casting in TS if accessing children directly, 
      // but since we have reference to `cortexMaterial` in closure scope:
      cortexMaterial.emissiveIntensity = pulse;

      // Rotate neural sparks independently
      neuralSparks.rotation.y -= 0.01;
      neuralSparks.rotation.z += 0.005;

      // Subtle wobble of hemispheres
      leftHemisphere.rotation.z = -0.2 + Math.sin(t) * 0.05;
      rightHemisphere.rotation.z = 0.2 - Math.sin(t) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // --- 7. Handle Resize ---
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Dispose resources
      renderer.dispose();
      
      // Dispose Brain Resources
      cortexMaterial.dispose();
      synapseMaterial.dispose();
      
      // Dispose Particles
      particleGeo.dispose();
      particleMat.dispose();

      // Dispose Nodes/Ring
      nodeGeo.dispose();
      greenMat.dispose();
      purpleMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[600px] relative">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Overlay Badge to make it look product-connected */}
      <div className="absolute bottom-10 right-10 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4 pointer-events-none select-none z-10">
        <div className="w-3 h-3 rounded-full bg-[#14F195] animate-pulse shadow-[0_0_10px_#14F195]" />
        <div>
          <p className="text-xs text-gray-400 uppercase font-mono">Live Validation</p>
          <p className="text-white font-bold text-sm">Processing Block #19248</p>
        </div>
      </div>
    </div>
  );
};

export default Scene3D;
