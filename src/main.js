import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

import { Terrain } from "./terrain.js";

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// GUI
const gui = new GUI();

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.y = 5;
camera.position.z = 10;

// Terrain
const terrain = new Terrain(10, 10);
scene.add(terrain);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Light
const sun = new THREE.DirectionalLight();
sun.position.set(1, 2, 3);
scene.add(sun);

const ambient = new THREE.AmbientLight({ color: "0xffffff", intensity: 0.5 });
scene.add(ambient);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
    // Orbit Controls
    controls.update();

    // Stats
    stats.update();

    renderer.render(scene, camera);
}

// Resize Canvas
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GUI Controls
const debugObject = {};

// Cube Tweaks

debugObject.terrainColor = 0x50a000;

const terrainFolder = gui.addFolder("Terrain");
terrainFolder.add(terrain, "width", 1, 20, 1).name("Width");
terrainFolder.add(terrain, "height", 1, 20, 1).name("Height");
terrainFolder.addColor(terrain.material, "color").name("Color");
terrainFolder.onChange(() => {
    terrain.createGeometry();
});
