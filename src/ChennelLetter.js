import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"

export default function NeonSign() {
    const canvasRef = useRef();
  
    useEffect(() => {
  
      // Initialize Three.js scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        canvasRef.current.innerWidth / canvasRef.current.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ canvas:canvasRef.current});
      renderer.setSize(window.innerWidth, window.innerHeight);
  
      // Add lights to the scene
      const pointLight = new THREE.PointLight(0x0fffff, 1, 100);
      pointLight.position.set(0, 0, 10);
      scene.add(pointLight);
  
      // Create geometry and material for each letter
      const letterGeometries = [
        new TextGeometry('N', { size: 2, height: 1 }),
        new TextGeometry('E', { size: 2, height: 1 }),
        new TextGeometry('O', { size: 2, height: 1 }),
        new TextGeometry('N', { size: 2, height: 1 }),
      ];
      const letterMaterials = [
        new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xff0000 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0x00ff00 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0x0000ff }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xff00ff }),
      ];
  
      // Create mesh for each letter and add to scene
      const letterMeshes = letterGeometries.map((geometry, i) => {
        const mesh = new THREE.Mesh(geometry, letterMaterials[i]);
        mesh.position.x = i * 3 - 3;
        mesh.position.y = 0;
        mesh.position.z = 0;
        scene.add(mesh);
        return mesh;
      });
  
      // Add backing board to the scene
      const backingGeometry = new THREE.PlaneGeometry(15, 5);
      const backingMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        emissive: 0x222222,
      });
      const backingMesh = new THREE.Mesh(backingGeometry, backingMaterial);
      backingMesh.position.x = 0;
      backingMesh.position.y = -2;
      backingMesh.position.z = -1;
      scene.add(backingMesh);
  
      // Animation loop that updates the position and intensity of the lights
      function animate() {
        requestAnimationFrame(animate);
  
        const time = Date.now() * 0.001;
        pointLight.position.x = Math.sin(time * 0.6) * 6;
        pointLight.position.y = Math.cos(time * 0.7) * 6;
        pointLight.position.z = Math.sin(time * 0.8) * 6;
        letterMeshes.forEach((mesh, i) => {
          mesh.material.emissiveIntensity = (Math.sin(time * 4 + i * 0.4) + 1) / 2;
        });
  
        renderer.render(scene,  camera);
    }
    animate();

    },[]);
    return <canvas ref={canvasRef}/>
}
