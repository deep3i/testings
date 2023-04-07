import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import Righteous from "./Fonts/Righteous_Regular.json";
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';


export default function LedNeonLine() {

    const containerRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: containerRef.current });
        renderer.setSize(1000, 900);

        const fontLoader1 = new FontLoader();
        const font1 = fontLoader1.parse(Righteous);
        const textGeometry = new TextGeometry('three.js', {
            font: font1, // load the font beforehand
            size: 10,
            height: 2,
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-20, 0, -50); // set the position of the text in the scene
        scene.add(textMesh);

        const neonMaterial = new THREE.MeshLambertMaterial({
            color: 0xff0000, // set the color of the neon line to red
            emissive: 0xf0f0, // set the emissive color to red as well
            emissiveIntensity: 1,
            wireframe: true // set the material to wireframe mode
        });

        const neonMesh = new THREE.Mesh(textGeometry, neonMaterial);
        neonMesh.position.set(-20, 0, -50);
        neonMesh.scale.multiplyScalar(1.2); // increase the scale of the neon line mesh
        scene.add(neonMesh);

        neonMaterial.blending = THREE.AdditiveBlending; // set the blend mode to additive
        neonMaterial.transparent = true; // set the material to transparent
        neonMaterial.opacity = 1; // set the opacity to a value less than 1

        const points = [];
        points.push(new THREE.Vector3(-5, 0, 0));
        points.push(new THREE.Vector3(0, 5, 0));
        points.push(new THREE.Vector3(5, 0, 0));
      
        const lineGeometry = new LineGeometry();
        lineGeometry.setPositions(points);
      
        // create the line material
        const lineMaterial = new LineMaterial({
          color: 0xffffff,
          linewidth: 0.2,
          dashed: false
        });
      
        // create the line object
        const lineObject = new Line2(lineGeometry, lineMaterial);
        scene.add(lineObject);

        function animate() {
            requestAnimationFrame(animate);
            // controls.update();

            renderer.render(scene, camera);
        }

        animate();

    })

    return (
        <>
        <canvas ref={containerRef} style={{ background: "white" }}></canvas>
        </>
    )
}