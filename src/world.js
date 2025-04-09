import * as THREE from "three";
import { Bush } from "./objects/Bush.js";
import { Rock } from "./objects/Rock.js";
import { Tree } from "./objects/Tree.js";
import { getKey } from "./utils.js";

const loader = new THREE.TextureLoader();
const gridTexture = loader.load("./textures/grid.png");

export class World extends THREE.Group {
    // Private property
    #objectMap = new Map();

    constructor(width, height) {
        super();

        this.width = width;
        this.height = height;
        this.treeCount = 10;
        this.rockCount = 20;
        this.bushCount = 10;

        this.trees = new THREE.Group();
        this.add(this.trees);

        this.rocks = new THREE.Group();
        this.add(this.rocks);

        this.bushes = new THREE.Group();
        this.add(this.bushes);

        this.path = new THREE.Group();
        this.add(this.path);

        this.generate();
    }

    generate() {
        this.clear();
        this.createTerrain();
        this.createTrees();
        this.createRocks();
        this.createBushes();
    }

    clear() {
        if (this.terrain) {
            this.terrain.geometry.dispose();
            this.terrain.material.dispose();
            this.remove(this.terrain);
        }

        this.trees.clear();
        this.rocks.clear();
        this.bushes.clear();

        this.#objectMap.clear();
    }

    createTerrain() {
        gridTexture.repeat = new THREE.Vector2(this.width, this.height);
        gridTexture.wrapS = THREE.RepeatWrapping;
        gridTexture.wrapT = THREE.RepeatWrapping;
        gridTexture.colorSpace = THREE.SRGBColorSpace;

        const terrainGeometry = new THREE.PlaneGeometry(
            this.width,
            this.height,
            this.width,
            this.height
        );
        const terrainMaterial = new THREE.MeshStandardMaterial({
            map: gridTexture,
        });

        this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        this.terrain.name = "Terrain";
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.set(this.width / 2, 0, this.height / 2);
        this.add(this.terrain);
    }

    createTrees() {
        for (let i = 0; i < this.treeCount; i++) {
            const coords = new THREE.Vector3(
                Math.floor(this.width * Math.random()),
                0,
                Math.floor(this.height * Math.random())
            );
            const tree = new Tree(coords);
            this.addObject(tree, coords, this.trees);
        }
    }

    createRocks() {
        for (let i = 0; i < this.rockCount; i++) {
            const coords = new THREE.Vector3(
                Math.floor(this.width * Math.random()),
                0,
                Math.floor(this.height * Math.random())
            );

            const rockMesh = new Rock(coords);
            this.addObject(rockMesh, coords, this.rocks);
        }
    }

    createBushes() {
        for (let i = 0; i < this.bushCount; i++) {
            const coords = new THREE.Vector3(
                Math.floor(this.width * Math.random()),
                0,
                Math.floor(this.height * Math.random())
            );

            const bush = new Bush(coords);
            this.addObject(bush, coords, this.bushes);
        }
    }

    /**
     * Adds an object at the specified coordinates unless
     * an object already exists at those coordinates
     * @param {GameObject} object
     * @param {THREE.Vector3} coords
     * @param {THREE.Group} group The group to add the object to
     * @returns
     */
    addObject(object, coords, group) {
        // Don't place objects on top of each other
        if (this.#objectMap.has(getKey(coords))) {
            return false;
        }

        group.add(object);
        this.#objectMap.set(getKey(coords), object);
        return true;
    }

    /**
     * Returns object at 'coords' if one exists, otherwise returns null
     * @param {THREE.Vector2} coords
     * @returns {object | null}
     */
    getObject(coords) {
        return this.#objectMap.get(getKey(coords)) ?? null;
    }
}

// Terrain
//   - Terrain Mesh
//   - Trees Group
//     - Trees 1
//     - Trees 2
//     - ...
