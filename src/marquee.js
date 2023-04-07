import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import Righteous from "./Fonts/Righteous_Regular.json";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';

export default function MarqueeLetter() {

    const textRef = useRef();

    useEffect(() => {
        // Set up the scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#000000');

        // Set up the camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        // const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        // camera.position.set(0, 5, - 15);

        // Set up the renderer
        const renderer = new THREE.WebGLRenderer({ canvas: textRef.current });
        renderer.setSize(800, 800);

        // Create the 3D text 3
        const fontLoader2 = new FontLoader();
        const font2 = fontLoader2.parse(Righteous)
        const textGeometry2 = new TextGeometry('CANADA', {
            font: font2,
            size: 0.55,
            height: 0.001,
        });
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });

        const mesh = new THREE.Mesh(textGeometry2, material);
        mesh.position.x = 1
        scene.add(mesh);


        // Set up the light
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 0, 5);
        mesh.add(light);

        //orbit control to add camera view 
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        // Create the line geometry
        // const lineGeometry = new THREE.TorusGeometry(1.2, 0.3, 3, 8, 2 * Math.PI);
        const lineGeometry = new THREE.TorusGeometry(2, 0.2, 7, 7);

        // Create the material for the line
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xfffff0 });

        // Create the line mesh
        const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);
        lineMesh.position.set(0.1, 0.1, 0);
        // scene.add(lineMesh);


        //3d object
        // const rectLight1 = new THREE.RectAreaLight(0xff0000, 5, 4, 10);
        // rectLight1.position.set(- 5, 5, 5);
        // scene.add(rectLight1);

        // const rectLight2 = new THREE.RectAreaLight(0x00ff00, 5, 4, 10);
        // rectLight2.position.set(0, 5, 5);
        // scene.add(rectLight2);

        // const rectLight3 = new THREE.RectAreaLight(0x0000ff, 5, 4, 10);
        // rectLight3.position.set(5, 5, 5);
        // scene.add(rectLight3);

        // scene.add(new RectAreaLightHelper(rectLight1));
        // scene.add(new RectAreaLightHelper(rectLight2));
        // scene.add(new RectAreaLightHelper(rectLight3));

        // const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
        // const matStdFloor = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.1, metalness: 0 });
        // const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
        // scene.add(mshStdFloor);

        // const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16);
        // const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 });
        // const meshKnot = new THREE.Mesh(geoKnot, matKnot);
        // meshKnot.name = 'meshKnot';
        // meshKnot.position.set(0, 5, 0);
        // scene.add(meshKnot);

        // const controls = new OrbitControls(camera, renderer.domElement);
        // controls.target.copy(meshKnot.position);

        // Render the scene
        function animate(time) {
            requestAnimationFrame(animate);
            // controls.update();
            // Move the text to the left
            // scene.children[0].position.x -= 0.5;
            // meshKnot.rotation.y = time / 1000;
            // lineMesh.material.color.setHSL((Date.now() % 5000) / 5000, 1, 0.5);
            renderer.render(scene, camera);
        }
        animate();


    })
    return (
        <canvas ref={textRef} />
    )
}