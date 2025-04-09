import * as THREE from "three";
import { search } from "./pathfinding.js";
import { GameObject } from "./objects/GameObject.js";
import { World } from "./world.js";

const geometry = new THREE.CapsuleGeometry(0.25, 0.5);
const material = new THREE.MeshStandardMaterial({ color: 0x4040c0 });

export class Player extends GameObject {
    /**
     * @type {THREE.Raycaster}
     */
    raycaster = new THREE.Raycaster();

    path = [];
    pathIndex = 0;
    pathUpdater = null;

    /**
     * Instantiates a player object.
     * @param {THREE.Vector3} coords
     * @param {THREE.Camera} camera
     * @param {World} world
     */
    constructor(coords, camera, world) {
        super(coords, geometry, material);
        this.moveTo(coords);
        this.camera = camera;
        this.world = world;
        window.addEventListener("mousedown", this.onMouseDown.bind(this));
    }

    /**
     * Moves the player to the given coordinates.
     * @param {THREE.Vector3} coords
     */
    moveTo(coords) {
        // Set player object coordinates to the given coordinates
        this.coords = coords;

        // Set the player's position to the coordinates
        // Offset by 0.5 to center the player in the square
        this.position.set(coords.x + 0.5, this.coords.y + 0.5, coords.z + 0.5);
    }

    /**
     *
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        // Get the mouse coordinates and cast a ray from the camera to the coordinates
        const coords = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        this.raycaster.setFromCamera(coords, this.camera);

        // Check if the ray intersects with the terrain
        const intersections = this.raycaster.intersectObject(
            this.world.terrain
        );

        // If there are intersections, find the path to the selected square
        // and update the player's position
        if (intersections.length > 0) {
            // Get players current position in integer coordinates
            const playerCoords = new THREE.Vector3(
                Math.floor(this.position.x),
                Math.floor(this.position.y),
                Math.floor(this.position.z)
            );

            // Get selected square coordinates in integer coordinates
            const selectedCoords = new THREE.Vector3(
                Math.floor(intersections[0].point.x),
                0,
                Math.floor(intersections[0].point.z)
            );

            // If player selects a new square, while already moving along a path clear the interval
            clearInterval(this.pathUpdater);

            // Find path from player's current position to selected square
            this.path = search(playerCoords, selectedCoords, this.world);

            // If no path found, return early
            if (this.path === null || this.path.length === 0) return;

            // DEBUG: show path as breadcrumbs on terrain
            this.world.path.clear();
            this.path.forEach((coords) => {
                const node = new THREE.Mesh(
                    new THREE.SphereGeometry(0.1),
                    new THREE.MeshBasicMaterial()
                );

                node.position.set(coords.x + 0.5, 0, coords.z + 0.5);
                this.world.path.add(node);
            });

            // trigger interval function to update player's position
            this.pathIndex = 0;
            // Call updatePosition function every 250ms
            // to move the player along the path
            this.pathUpdater = setInterval(this.updatePosition.bind(this), 250);
        }
    }

    updatePosition() {
        // if pathIndex is equal to the length of the path, clear the interval
        // and return — this indicates that the player has reached the end of the path
        if (this.pathIndex === this.path.length) {
            clearInterval(this.pathUpdater);
            return;
        }

        // Move the player to the next square in the path
        // and increment the pathIndex
        const curr = this.path[this.pathIndex++];
        this.moveTo(curr);
    }
}
