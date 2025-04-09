import * as THREE from "three";
import { Action } from "./Action.js";
import { search } from "../pathfinding.js";

const breadcrumb = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial()
);

export class MovementAction extends Action {
    name = "Move";

    path = [];
    pathIndex = 0;
    pathUpdater = null;

    /**
     *
     * @type {GameObject} source
     */
    constructor(source, world) {
        super(source);

        this.world = world;
    }

    async perform() {
        return new Promise((resolve) => {
            function updateSourcePosition() {
                // if we reach the end of the path, clear the interval
                // and clear the breadcrumbs, then resolve this action to
                // unblock the combat manager
                if (this.pathIndex === this.path.length) {
                    clearInterval(this.pathUpdater);
                    this.world.path.clear();
                    resolve();

                    // otherwise, move source object to next path node
                } else {
                    // Move the player to the next square in the path
                    // and increment the pathIndex
                    const curr = this.path[this.pathIndex++];
                    this.source.moveTo(curr);
                }
            }

            // If player selects a new square, while already moving along a path clear the interval
            clearInterval(this.pathUpdater);

            // Add breakcrumbs to the path
            this.path.forEach((coords) => {
                const node = breadcrumb.clone();
                node.position.set(coords.x + 0.5, 0, coords.z + 0.5);
                this.world.path.add(node);
            });

            // trigger interval function to update player's position
            this.pathIndex = 0;
            // Call updatePosition function every 250ms
            // to move the player along the path
            this.pathUpdater = setInterval(
                updateSourcePosition.bind(this),
                300
            );
        });
    }

    async canPerform() {
        const selectedCoords = await this.source.getTargetSquare();

        console.log("canPerform", selectedCoords);
        // Get the target square from the player
        // const selectedCoords = new THREE.Vector3(
        //     Math.floor(intersections[0].point.x),
        //     0,
        //     Math.floor(intersections[0].point.z)
        // );

        // this.world.path.clear();

        // Find path from player's current position to selected square
        this.path = search(this.source.coords, selectedCoords, this.world);

        console.log(this.path);
        // If no path found, return early
        return this.path !== null && this.path.length > 0;
    }
}
