import * as THREE from "three";
import { GameObject } from "../objects/GameObject.js";
import { World } from "../world.js";
import { MovementAction } from "../actions/MovementAction.js";
import { WaitAction } from "../actions/WaitAction.js";

const geometry = new THREE.CapsuleGeometry(0.25, 0.5);

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
        const material = new THREE.MeshStandardMaterial({ color: 0x4040c0 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0.5, 0.5, 0.5);
        super(coords, mesh);
        this.moveTo(coords);
        this.camera = camera;
        this.world = world;
    }

    /**
     * @returns {Action[]} actions
     */
    getActions() {
        return [
            new MovementAction(this, this.world),
            new WaitAction(this, this.world),
        ];
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
