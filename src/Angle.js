import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Righteous from './Fonts/Righteous_Regular.json';
import Anton from './Fonts/Anton_Regular.json';
import Graffiti from './Fonts/Graffiti Xenoa_Regular.json';
import HelloMarlisa from './Fonts/Hello Marlisa_Regular.json';
import HardRace from './Fonts/Hard Race_Regular.json';
import PlanetOrbit from './Fonts/Planet Orbit_Regular.json';
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { SketchPicker } from 'react-color';

function Line() {
  const [color, setColor] = useState('#ffffff');
  const [textfrontcolor, setTextFrontColor] = useState('#ffffff');
  const [textbackcolor, setTextBackColor] = useState('#ffffff');
  const [textglowcolor, setTextGlowColor] = useState('#ffffff');
  const [fontchange, setFontChange] = useState(Righteous);
  const [text, setText] = useState('NEON');
  const [XDimension, setXDimension] = useState(0);
  const [YDimension, setYDimension] = useState(0);

  //Unrealbloompass states
  const [strength, setStrength] = useState(0.5);
  const [threshold, setThreshold] = useState(0.2);
  const [rad, setRad] = useState(0);
  const [bloomglow, setBloomGlow] = useState(false);
  
  const Start_Bloom_Glow = () =>{ 
     setBloomGlow(!bloomglow)
  }

  const Update_Fonts = (e) => {
    console.log(e.target.value);
    if (e.target.value === '1') {
      setFontChange(Anton);
    } else if (e.target.value === '2') {
      setFontChange(Graffiti);
    } else if (e.target.value === '3') {
      setFontChange(HelloMarlisa);
    } else if (e.target.value === '4') {
      setFontChange(PlanetOrbit);
    } else if (e.target.value === '5') {
      setFontChange(HardRace);
    }
  }

  const Text_Line_Color = (newColor) => {
    setColor(newColor.hex);
  };

  const Text_Front_Color = (newColor) => {
    setTextFrontColor(newColor.hex);
  };

  const Text_Back_Color = (newColor) => {
    setTextBackColor(newColor.hex);
  };

  const Text_Glow_Color = (newColor) => {
    setTextGlowColor(newColor.hex);
  };


  const canvasRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    renderer.setSize(600, 400);
    document.body.appendChild(renderer.domElement);

    // Add a background texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg');
    // scene.background = texture 

    // Create a TubeGeometry for your line
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-5, 5, 0),
      new THREE.Vector3(10, -5, 0),
      new THREE.Vector3(10, 0, 0),
    ]);
    const radius = 0.1;
    const segments = 10;
    const geometry = new THREE.TubeBufferGeometry(curve, segments, radius);

    // Create a MeshBasicMaterial for your line
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff,
      emissive: 0x333333,
      roughness: 0.5,
      metalness: 0.5,
    });

    // Create a Mesh object and add it to the scene
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true; // Allow the line to receive shadows
    mesh.castShadow = true; // Allow the line to cast shadows
    // scene.add(mesh);

    //orbit control to add camera view 
    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = false;
    // controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Create the line geometry
    const lineGeometry = new THREE.TorusGeometry(1, 0.1, 20, 10);

    // Create the material for the line
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Create the line mesh
    const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);
    lineMesh.position.set(15, 1, 0)
    // scene.add(lineMesh)

    //Light bloom effect try
    const params = {
      exposure: 1,
      bloomStrength: strength,
      bloomThreshold: threshold,
      bloomRadius: rad
    };
    scene.add(new THREE.AmbientLight(0x404040));

    const pointLight = new THREE.PointLight(0xfff, 1);
    camera.add(pointLight);

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    bloomPass.renderToScreen = true // Render the bloom effect to the screen

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Create the light
    const light = new THREE.PointLight(0xffffff, 2, 50, 2);
    light.position.set(0, 0, 10);

    // Create the group
    const group = new THREE.Group();
    // group.add(lineMesh);
    group.add(light);
    group.position.set( 0, 0, 0);

    // Add the group to the scene
    scene.add(group);



    //Neon Led Light 
    const fontLoader = new FontLoader();
    const font = fontLoader.parse(fontchange);
    const textGeometry = new TextGeometry(text, {
      font,
      size: 2,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    })

    // Create the front-side material for the text
    const frontMaterial = new THREE.MeshBasicMaterial({
      color: textfrontcolor, // Set the color of the text
      transparent: true, // Make the material transparent
      opacity: 0.7, // Set the opacity of the material
      // map:texture
    })

    // Create the back-side material for the text
    const backMaterial = new THREE.MeshBasicMaterial({
      color: textbackcolor, // Set the color of the background
      // map:texture
    })

    // Create the text mesh with the front and back materials
    const textMesh = new THREE.Mesh(textGeometry, [backMaterial, frontMaterial])
    textMesh.position.set(XDimension, YDimension,0)

    // Create the neon light material for the front of the text
    const neonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1 }, // Used to animate the light effect
        thickness: { value: 0.1 }, // Set the thickness of the light effect
        glowColor: { value: new THREE.Color(textglowcolor) }, // Set the color of the light effect
      },
      vertexShader: `
      uniform float time;
      uniform float thickness;
      varying vec3 vNormal;

      void main() {
        vNormal = normal;
        vec3 pos = position + normal * thickness * sin(time);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
      fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 vNormal;

      void main() {
        float intensity = pow(0.2 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
        gl_FragColor = vec4(glowColor * intensity, 1.0);
      }
    `,
      transparent: false, // Make the material transparent
      side: THREE.FrontSide, // Only apply the material to the front of the text
    })
    // Create a mesh to represent the neon light effect
    const neonMesh = new THREE.Mesh(textGeometry, neonMaterial)

    // Set the position of the neon light mesh
    neonMesh.position.set(XDimension, YDimension, 0.1)

    // Create a group to contain the text and neon light meshes
    const group1 = new THREE.Group()
    group1.add(textMesh, neonMesh)
    scene.add(group1)

    // Create a line around the text mesh
    const lineGeometry1 = new THREE.EdgesGeometry(textGeometry)
    const lineMaterial1 = new THREE.LineBasicMaterial({
      color: color, //Set the color of the line
    })
    const lineMash = new THREE.LineSegments(lineGeometry1, lineMaterial1)
    lineMash.position.set(XDimension, YDimension, 0.1)
    scene.add(lineMash)
    
    // const dragControls = new DragControls([lineMash], camera, renderer.domElement);


    // Render the scene
    function animate() {
      requestAnimationFrame(animate);
      neonMaterial.uniforms.time.value += 0.05
      renderer.render(scene, camera);
      // dragControls.activate()
      light.position.x = Math.sin(Date.now() * 0.002) * 10;
      light.position.y = Math.cos(Date.now() * 0.002) * 10;

      if (bloomglow === true) {
        composer.render();
      }

    }
    animate();

  }, [color, textfrontcolor, textbackcolor, textglowcolor, fontchange, text, strength, threshold, rad, XDimension, YDimension]);

  return (
    <div>
      <canvas ref={canvasRef} />
      <div style={{ display: "flex" }}>
        <div>
          <h2>Text Line Color:</h2>
          <SketchPicker color={color} onChange={Text_Line_Color} />
        </div>
        <div>
          <h2>Text Front Color:</h2>
          <SketchPicker color={textfrontcolor} onChange={Text_Front_Color} />
        </div>
        <div>
          <h2>Text Back Color:</h2>
          <SketchPicker color={textbackcolor} onChange={Text_Back_Color} />
        </div>
        <div>
          <h2>Text Glow Color:</h2>
          <SketchPicker color={textglowcolor} onChange={Text_Glow_Color} />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div>
          <h2>Font :</h2>
          <button onClick={Update_Fonts} value={1}>Anton</button>
          <button onClick={Update_Fonts} value={2}>Graffiti</button>
          <button onClick={Update_Fonts} value={3}>HelloMarlisa</button>
          <button onClick={Update_Fonts} value={4}>PlanetOrbit</button>
          <button onClick={Update_Fonts} value={5}>HardRace</button>
        </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div style={{position:'relative', top:'100px', right:'376px'}}> 
          <h2>Set text your position</h2>
          <button onClick={()=>setXDimension(XDimension - 1)}> - X-Dimension</button>
          <button onClick={()=>setYDimension(YDimension - 1)}> - Y-Dimension</button>
          <button onClick={()=>setXDimension(XDimension + 1)}>X-Dimension</button>
          <button onClick={()=>setYDimension(YDimension + 1)}>Y-Dimension</button>
        </div>
        <div>
          <h2>Texte Here</h2>
          <input type={'text'} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <h2>Add Bloom Effect Options:</h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={Start_Bloom_Glow}>On</button>
          <div style={{ display: '', marginLeft: '10px' }}>
            <div>
              <p>strength</p>
              <input type={'number'} style={{ marginBottom: "5px" }} value={strength} onChange={(e)=>setStrength(e.target.value)}/>
            </div>
            <div>
              <p>Radius</p>
              <input type={'number'} style={{ marginBottom: "5px" }} value={rad} onChange={(e)=>setRad(e.target.value)}/>
            </div>
            <div>
              <p>threshold</p>
              <input type={'number'} style={{ marginBottom: "5px" }} value={threshold} onChange={(e)=>setThreshold(e.target.value)}/>
            </div>
          </div>
        </div>
      </div><br/>
    </div>
  );
}

export default Line;
