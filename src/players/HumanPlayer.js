import * as THREE from "three";
import { Player } from "./Player.js";
import { MovementAction } from "../actions/MovementAction.js";

export class HumanPlayer extends Player {
    name = "HumanPlayer";

    /**
     * @type {THREE.Raycaster}
     */
    raycaster = new THREE.Raycaster();

    /**
     * Wait for player to choose a target square
     * @returns {Promise<THREE.Vector3 | null>}
     */
    async getTargetSquare() {
        return new Promise((resolve) => {
            /**
             * Event handler for when user clicks on the screen
             * @param {MouseEvent} event
             */
            function onMouseDown(event) {
                console.log("Mouse down event", event);
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
                    // Get selected square coordinates in integer coordinates
                    const selectedCoords = new THREE.Vector3(
                        Math.floor(intersections[0].point.x),
                        0,
                        Math.floor(intersections[0].point.z)
                    );

                    console.log("selectedCoords", selectedCoords);
                    window.removeEventListener("mousedown", onMouseBound);
                    resolve(selectedCoords);
                }
            }
            // Need to assign the bound function to a variable
            // so that the event listener can be removed later
            // Using bind() results in a new unction signature
            // each time you use it.
            const onMouseBound = onMouseDown.bind(this);

            // Wait for player to select a square
            window.addEventListener("mousedown", onMouseBound);
            console.log("Waiting for player to select a target square...");
        });

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
        const statusText = document.getElementById("status");
        const actionButtonComtainer = document.getElementById("actions");

        actionButtonComtainer.innerHTML = "";

        const actions = this.getActions();

        statusText.innerText = `Waiting for ${this.name} to select an action...`;
        return new Promise((resolve) => {
            actions.forEach((action) => {
                const button = document.createElement("button");
                button.innerText = action.name;
                button.onclick = () => {
                    console.log("Action clicked", action);
                    resolve(action);
                };
                actionButtonComtainer.appendChild(button);
            });
        });
    }
}
