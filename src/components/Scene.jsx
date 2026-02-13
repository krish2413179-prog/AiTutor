import React, { useRef, useLayoutEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { easing } from 'maath';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Float, Environment } from '@react-three/drei';
import { EffectComposer, Noise, Bloom, Vignette } from '@react-three/postprocessing';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import * as THREE from 'three';


function useOptimizedGLTF(path) {
  const gl = useThree((state) => state.gl);
  
  return useLoader(GLTFLoader, path, (loader) => {
    // 1. KTX2 Loader (Textures)
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/basis/');
    ktx2Loader.detectSupport(gl);
    loader.setKTX2Loader(ktx2Loader);

    // 2. Draco Loader (Geometry Compression)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);

    // 3. Meshopt Decoder (The missing piece for your specific error)
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
}


function BaseRock() {
  const gltf = useOptimizedGLTF('/models/rock-version1-export-v1-optimize.glb');
  
  useLayoutEffect(() => {
    gltf.scene.traverse((obj) => {
      if (obj.isMesh) {
       
        obj.material.roughness = 0.9;
        obj.material.metalness = 0.1;
      }
    })
  }, [gltf.scene]);

  return <primitive object={gltf.scene} />;
}


function LiquidRock() {
  const gltf = useOptimizedGLTF('/models/moving-liquid-rock-final-v1-optimize.glb');
  const mixer = useRef();

  
  
  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  return <primitive object={gltf.scene} />;
}




export function Scene() {
  return (
    <>
    
      <spotLight position={[0, 10, -5]} intensity={600} angle={0.6} penumbra={1} color="#ffffff" />
      <pointLight position={[-5, 0, 5]} intensity={0.1} color="#4a4a4a" /> 
      <Environment preset="city" environmentIntensity={0.2} />

      {/* --- COMPOSITION --- */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group scale={2} rotation={[0.3, 0, 0]} position={[0, -0.5, 0]}>
          <BaseRock />
          {/* We layer the liquid slightly larger or same position */}
          <group scale={1.01}> 
            <LiquidRock />
          </group>
        </group>
      </Float>

      {/* Background Atmosphere */}
      

      {/* --- POST PROCESSING --- */}
      <EffectComposer disableNormalPass>
        <Noise opacity={0.3} premultiply />
        <Bloom luminanceThreshold={0.7} mipmapBlur intensity={0.6} radius={0.5} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}