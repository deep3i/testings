import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three-stdlib';
import Righteous from "./Fonts/Righteous_Regular.json";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const NeonText = ({ text, color, size }) => {
    
    const containerRef = useRef();
    
    useEffect(() => {
      // Set up Three.js scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;
      const renderer = new THREE.WebGLRenderer({ canvas: containerRef.current });
      renderer.setSize(700, 500);
      renderer.setClearColor(0x000000, 1);
      renderer.gammaOutput = true;

    // Load font and create geometry
    const fontLoader = new FontLoader();
    const font = fontLoader.parse(Righteous);
    const config = {
      font,
      size: size || 1,
      height: 0.5,
    };
    const geometry = new TextGeometry(text, config);

    // Create emissive material for neon light effect
    const material = new THREE.MeshBasicMaterial({
      color: color || 0xfff00f,
      emissive: color || 0xffffff,
      emissiveIntensity: 2,
      side: THREE.DoubleSide,
    });

    // Create mesh for text and add to scene
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh)

    // Create bloom effect for neon glow
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 0.8;
    bloomPass.radius = 5;
    bloomPass.renderToScreen = true // Render the bloom effect to the screen
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloomPass);

    const render = () => {
      requestAnimationFrame(render);
      composer.render();
      controls.update();
    };
    render();

  }, [text, color, size]);

  return ( 
    <div> 
        <canvas ref={containerRef} ></canvas>
    </div>
  );
};

const Neoon = () => {
  return <NeonText text="Hello World!" color={0xff00} size={1} />;
};

export default Neoon;
