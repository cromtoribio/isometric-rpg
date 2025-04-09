import * as THREE from "three";
import { GameObject } from "./GameObject.js";

const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0b0b0,
    flatShading: true,
});

const rockGeometry = new THREE.SphereGeometry(1, 6, 5);

export class Rock extends GameObject {
    /**
     * @param {THREE.Vector3} coords
     *
     */
    constructor(coords) {
        const minRadius = 0.2;
        const maxRadius = 0.4;
        const minHeight = 0.1;
        const maxHeight = 0.3;

        const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);

        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        const height = minHeight + Math.random() * (maxHeight - minHeight);

        rockMesh.scale.set(radius, height, radius);
        rockMesh.position.set(0.5, height / 2, 0.5);

        super(coords, rockMesh);

        this.name = `Rock (${coords.x}, ${coords.z})`;
        this.moveTo(coords);
    }
}
