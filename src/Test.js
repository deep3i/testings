import { useEffect, useState, useRef } from "react";
import { SketchPicker } from "react-color";
import * as THREE from 'three';
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry.js"
import {FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Righteous from "./Fonts/Righteous_Regular.json";

export default function Neonledletter() {
    const [inc_exposure, setInc_Exposure] = useState(0);
    const [inc_radius, setInc_Radius] = useState(0);
    const [inc_strength, setInc_Strength] = useState(0);
    const [color, setColor] = useState('#ffffff');

    const handleColorChange = (newColor) => {
        setColor(newColor.hex);
      };
     
    const Update_Exposure = () =>{ 
          setInc_Exposure(inc_exposure + 0.1);
    }
    const Update_Radius = () =>{ 
          setInc_Radius(inc_radius + 0.1);
    }
    const Update_Strength = () =>{ 
          setInc_Strength(inc_strength + 0.1);
    }
    
    useEffect(() => {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);

        const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#canvas') });
        renderer.setSize(400, 400);
        document.body.appendChild(renderer.domElement);

        const fontLoader = new FontLoader();
        const font = fontLoader.parse(Righteous);
        const textGeometry = new TextGeometry('hello', {
            font: font,
            size: 2,
            height: 1,
        });

        const textMaterial = new THREE.MeshBasicMaterial({color:0xfff});
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);

        // Create a bloom pass with exposure, threshold, strength,radius on text
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        bloomPass.exposure = inc_exposure;
        bloomPass.strength = inc_strength;
        bloomPass.radius = inc_radius;
        console.log("outside onchange:", inc_exposure);
        // Create a render pass
        const renderPass = new RenderPass(scene, camera);

        // Create an effect composer and add passes
        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);
      
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera)
            composer.render();

        }

        animate();
    },[inc_exposure, inc_radius, inc_strength])
    console.log("exposure:", inc_exposure);
    console.log("radius:", inc_radius);
    console.log("strength:", inc_strength);
    return (
        <>
            <p>Neon Led Letter</p>
            <canvas id="canvas"></canvas>
            <div>
               <p style={{fontWeight:"10px", color:'black'}}>inc_exposure</p>
               <button onClick={Update_Exposure}>inc_exposure</button>
               <button onClick={Update_Radius}>inc_radius</button>
               <button onClick={Update_Strength}>inc_strength</button>
            </div>
            <div>
                <b>color Picker:</b>
                <SketchPicker color={color} onChange={handleColorChange}/>
            </div>
        </>
    )
}