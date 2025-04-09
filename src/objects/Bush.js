import * as THREE from "three";
import { GameObject } from "./GameObject.js";

const bushGeometry = new THREE.SphereGeometry(1, 8, 8);
const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0x80a040,
    flatShading: true,
});

export class Bush extends GameObject {
    /**
     * @param {THREE.Vector3} coords
     *
     */
    constructor(coords) {
        const minBushRadius = 0.1;
        const maxBushRadius = 0.3;
        const radius =
            minBushRadius + Math.random() * (maxBushRadius - minBushRadius);

        const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);

        bushMesh.scale.set(radius, radius, radius);
        bushMesh.position.set(0.5, radius, 0.5);

        super(coords, bushMesh);

        this.name = `Bush (${coords.x}, ${coords.z})`;
        this.moveTo(coords);
    }
}
