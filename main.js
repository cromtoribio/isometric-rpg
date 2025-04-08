import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

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
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Test Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

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

debugObject.cubeColor = "0x00ff00";

const cubeFolder = gui.addFolder("Cube");
cubeFolder.add(cube.position, "x", -2, 2, 0.1).name("X Position");
cubeFolder.addColor(debugObject, "cubeColor").onChange(() => {
    cube.material.color.set(debugObject.cubeColor);
});
