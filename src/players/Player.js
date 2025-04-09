import * as THREE from "three";
import { GameObject } from "../objects/GameObject.js";
import { World } from "../world.js";
import { MovementAction } from "../actions/MovementAction.js";

const geometry = new THREE.CapsuleGeometry(0.25, 0.5);
const material = new THREE.MeshStandardMaterial({ color: 0x4040c0 });

/**
 * Base player class that human and AI players will extend
 *
 */
export class Player extends GameObject {
    name = "Player";

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
    }

    /**
     * Wait for player to choose a target square
     * @returns {Promise<THREE.Vector3 | null>}
     */
    async getTargetSquare() {
        return null;
    }

    /**
     * Wait for player to choose a target object
     * @returns {Promise<GameObject | null>}
     */
    async getTargetObject() {
        return null;
    }

    /**
     * Wait for player to choose an action
     * @returns {Promise<Action | null>}
     */
    async requestAction() {
        return null;
    }
}
