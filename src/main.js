import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

import { World } from "./world.js";
import { HumanPlayer } from "./players/HumanPlayer.js";
import { CombatManager } from "./CombatManager.js";

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
camera.position.set(0, 2, 0);

// World
const world = new World(10, 10);
scene.add(world);

// Player
const player1 = new HumanPlayer(new THREE.Vector3(1, 0, 5), camera, world);
const player2 = new HumanPlayer(new THREE.Vector3(8, 0, 3), camera, world);
scene.add(player1, player2);
player1.name = "Player 1";
player2.name = "Player 2";

//Combat Manager
const combatManager = new CombatManager();
combatManager.addPlayer(player1);
combatManager.addPlayer(player2);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Light
const sun = new THREE.DirectionalLight();
sun.intensity = 3;
sun.position.set(1, 2, 3);
scene.add(sun);

const ambient = new THREE.AmbientLight({ color: "0xffffff", intensity: 0.5 });
scene.add(ambient);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(5, 0, 5);
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

// Terrain Tweaks
const worldFolder = gui.addFolder("World");

worldFolder.add(world, "width", 1, 20, 1).name("Width");
worldFolder.add(world, "height", 1, 20, 1).name("Height");
worldFolder.add(world, "treeCount", 1, 100, 1).name("Tree Count");
worldFolder.add(world, "rockCount", 1, 100, 1).name("Rock Count");
worldFolder.add(world, "bushCount", 1, 100, 1).name("Bush Count");

worldFolder.add(world, "generate").name("Generate");

combatManager.takeTurns();
