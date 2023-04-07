import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import Righteous from "./Fonts/Righteous_Regular.json";
import Graffiti from "./Fonts/Graffiti Xenoa_Regular.json";
import planet from "./Fonts/Planet Orbit_Regular.json";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function LightBoxText() {

    const textRef = useRef();
    useEffect(() => {
        // Set up the scene
        const scene = new THREE.Scene();

        // Set up the camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Set up the renderer
        const renderer = new THREE.WebGLRenderer({ canvas: textRef.current });
        renderer.setSize(800, 800);
        //textRef.current.append(renderer.domElement);
        // scene.background = texture;

        // Create the 3D text 1
        const fontLoader = new FontLoader();
        const font = fontLoader.parse(Graffiti);
        const textGeometry = new TextGeometry('THREE.js', {
            font: font,
            size: 0.3,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffff });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(-0.9, -0.3, 0);
        scene.add(text);

        // Create the 3D text 2
        const fontLoader1 = new FontLoader();
        const font1 = fontLoader1.parse(planet)
        const textGeometry1 = new TextGeometry('Hello World', {
            font: font1,
            size: 0.23,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const textMaterial1 = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const text1 = new THREE.Mesh(textGeometry1, textMaterial1);
        text1.position.set(2, 0.8, 1);
        scene.add(text1);

        // Create the 3D text 3
        const fontLoader2 = new FontLoader();
        const font2 = fontLoader2.parse(Righteous)
        const textGeometry2 = new TextGeometry('CANADA', {
            font: font2,
            size: 0.55,
            height: 0.001,
        });
        const textMaterial2 = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const BoredrOval = new THREE.LineBasicMaterial({ color: 0xffffff }); //for change bevel border color
        const text2 = new THREE.Mesh(textGeometry2, BoredrOval);
        text2.position.set(-3.5, -2.7, 0);
        scene.add(text2);

        // Set up the light
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 0, 5);
        text2.add(light);

        //orbit control to add camera view 
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        // Custom shapes for plate 
        // const heartShape = new THREE.Shape();
        // heartShape.moveTo(0, 0);
        // heartShape.bezierCurveTo(0, 2.5, -2, 5, -5, 5);
        // heartShape.bezierCurveTo(-8, 5, -10, 2.5, -10, 0);
        // heartShape.bezierCurveTo(-10, -2.5, -8, -5, -5, -5);
        // heartShape.bezierCurveTo(-2, -5, 0, -2.5, 0, 0);

        // Create a new shape
        const boltShape = new THREE.Shape();

        // Define the lightning bolt shape as a series of points
        boltShape.moveTo(-2, 5);
        boltShape.lineTo(-1, 1);
        boltShape.quadraticCurveTo(0, 0, 1, 1);
        boltShape.lineTo(2, 5);
        boltShape.lineTo(0, 3);
        boltShape.lineTo(-2, 5);

        // const heartShape = new THREE.Shape();
        // heartShape.moveTo(0, 0);
        // heartShape.bezierCurveTo(0, 2, -2, 4, -4, 4);
        // heartShape.bezierCurveTo(-7, 4, -7, 0, -7, 0);
        // heartShape.bezierCurveTo(-7, -6, -3.5, -9, 0, -12);
        // heartShape.bezierCurveTo(3.5, -9, 7, -6, 7, 0);
        // heartShape.bezierCurveTo(7, 0, 7, 4, 4, 4);
        // heartShape.bezierCurveTo(2, 4, 0, 2, 0, 0);

        // const CustomPlategeometry = new THREE.ExtrudeGeometry(boltShape, {
        //     depth: 0.1,
        //     bevelEnabled: true,
        //     bevelThickness: 0.03,
        //     bevelSize: 0,
        //     bevelSegments: 5,
        //     curveSegments: 12
        // });
        // CustomPlategeometry.scale(0.6, 0.6, 0.6);
        // const Cutomplatematerial = new THREE.MeshPhongMaterial({
        //     color: 0xffff,
        //     emissiveIntensity: 2,
        //     side: THREE.DoubleSide,
        // });

        // const CustomPlate = new THREE.Mesh(CustomPlategeometry, Cutomplatematerial);
        // CustomPlate.position.set(-5, 1, -1)  //position x,y,z means x position y position and z - index of z
        // scene.add(CustomPlate);


        //Simple Plate illuminate Shape 1
        const plateGeometry = new THREE.CircleGeometry(1, 32);
        const plateMaterial = new THREE.MeshPhongMaterial({
            color: 0x2f2f2f,
            emissiveIntensity: 2,
            side: THREE.DoubleSide,
        });

        const plate = new THREE.Mesh(plateGeometry, plateMaterial);
        scene.add(plate);

        //Simple Plate illuminate Shape 2
        const plateGeometry1 = new THREE.PlaneGeometry(2, 1);
        const plateMaterial1 = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0xff000,
            emissiveIntensity: 2,
            side: THREE.DoubleSide,
        });

        const plate1 = new THREE.Mesh(plateGeometry1, plateMaterial1);
        plate1.position.set(3, 1, 1)
        scene.add(plate1);

        // Create a new shape with an oval path
        const ovalShape = new THREE.Shape();
        ovalShape.moveTo(0, 0.5);
        ovalShape.ellipse(-3, 2, 2, 1, 0, Math.PI * 4);

        // Create a new extruded geometry with the shape
        const extrudeSettings = {
            depth: 0.1,
            bevelEnabled: false
        };
        const ovalGeometry = new THREE.ExtrudeGeometry(ovalShape, extrudeSettings);

        // Create a new mesh with the geometry and a basic material
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const ovalMesh = new THREE.Mesh(ovalGeometry, material);

        // Position and rotate the mesh
        ovalMesh.rotation.x = -Math.PI / 1;
        ovalMesh.position.set(1, 0, 0);

        // Add the mesh to the scene
        scene.add(ovalMesh);

        // Create the line geometry
        // const lineGeometry = new THREE.TorusGeometry(1.2, 0.3, 3, 8, 2 * Math.PI);
        const lineGeometry = new THREE.TorusGeometry(2,0.5,4,4);

        // Create the material for the line
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xfffff0 });

        // Create the line mesh
        const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);
        lineMesh.position.set(0.1,0.1,0);
        // plate1.add(lineMesh);


        // Render the scene
        function animate() {
            requestAnimationFrame(animate);
            // controls.update();
            // lineMesh.material.color.setHSL((Date.now() % 5000) / 5000, 1, 0.5);
            renderer.render(scene, camera);
        }
        animate();

    })
    return (
        <canvas ref={textRef} />
    )
}