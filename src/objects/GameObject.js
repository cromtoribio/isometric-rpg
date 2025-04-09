import * as THREE from "three";

export class GameObject extends THREE.Mesh {
    /**
     * @type {THREE.Vector3}
     */
    coords;

    /**
     * @param {THREE.Vector3} coords
     * @param {THREE.BufferGeometry} geometry
     * @param {THREE.Material} material
     *
     */
    constructor(coords, geometry, material) {
        super(geometry, material);
        this.coords = coords;
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
}
