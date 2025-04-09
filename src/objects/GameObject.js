import * as THREE from "three";
import { createTextMaterial } from "../utils";

export class GameObject extends THREE.Group {
    /**
     * @type {THREE.Vector3}
     */
    coords;

    /**
     * @type {THREE.Mesh}
     */
    mesh;

    /**
     * @type {number}
     */
    hitPoints = 10;

    /**
     * @type {number}
     */
    maxHitPoints = 10;

    /**
     * @type {THREE.Sprite}
     */
    healthOverlay;

    /**
     * @param {THREE.Vector3} coords
     * @param {THREE.Mesh} mesh
     *
     */
    constructor(coords, mesh) {
        super();
        this.coords = coords;
        this.mesh = mesh;
        this.add(mesh);

        this.healthOverlay = new THREE.Sprite();
        this.healthOverlay.position.set(0.5, 1.15, 0.5);
        this.add(this.healthOverlay);
        this.updateHitPointOverlay();
    }

    get isDead() {
        return this.hitPoints === 0;
    }

    /**
     *
     * @param {number} damage
     */
    hit(damage) {
        this.hitPoints -= damage;
        if (this.hitPoints < 0) {
            this.hitPoints = 0;
        }
        this.updateHitPointOverlay();
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
        this.position.copy(coords);
    }

    updateHitPointOverlay() {
        if (this.healthOverlay.material) {
            this.healthOverlay.material.dispose();
        }

        this.healthOverlay.material = createTextMaterial(
            `${this.hitPoints}/${this.maxHitPoints}`
        );
    }
}
