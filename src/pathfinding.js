import * as THREE from "three";
import { World } from "./world.js";
import { getKey } from "./utils.js";

/**
 *
 * @param {THREE.Vector3} start
 * @param {THREE.Vector3} end
 * @param {World} world
 * @return {THREE.Vector3[] | null}
 * If path is found, returns the array of coordinates that make up the path, otherwise returns null
 */

export function search(start, end, world) {
    // if the end and start are the same square, skip searching
    if (start.equals(end)) return [];

    console.log(
        `Searcing for path from (${start.x}, ${start.z}) to (${end.x}, ${end.z})`
    );

    // Set the maximum search distance
    const maxSearchDistance = 20;

    // Keep track of which squares are connected
    // and the cost to get to each square
    const cameFrom = new Map();
    const cost = new Map();

    // Squares to search
    const frontier = [start];
    let pathFound = false;

    // Set cost for starting square
    cost.set(getKey(start), 0);

    let counter = 0;

    // Enter the path if search frontier is not empty
    while (frontier.length > 0) {
        // Get the square with shortest distance metric
        // Dijkstra - distance to origin
        // A* - distance to origin + estimated distance to destination

        // Sort frontier from shortest to longest distance
        frontier.sort((v1, v2) => {
            // Dijkstra calculations
            // const d1 = start.manhattanDistanceTo(v1);
            // const d2 = start.manhattanDistanceTo(v2);

            // return d1 - d2;

            // A* Calculations
            // True cost from the origin to a square
            const g1 = start.manhattanDistanceTo(v1);
            const g2 = start.manhattanDistanceTo(v2);

            // Heuristic distance (aka distance to destination)
            const h1 = v1.manhattanDistanceTo(end);
            const h2 = v2.manhattanDistanceTo(end);

            // Final Cost
            const f1 = g1 + h1;
            const f2 = g2 + h2;

            return f1 - f2;
        });

        // Get the square with shortest distance
        const candidate = frontier.shift();

        // Counter used to show the difference between
        // A* and Dijkstra Algorithms
        counter++;

        // Did we find the end goal?
        if (candidate.equals(end)) {
            pathFound = true;
            console.log(`Path Found. Visited ${counter} candidates.`);
            break;
        }

        // If distance is farther than max distance
        // then skip this square
        if (candidate.manhattanDistanceTo(start) > maxSearchDistance) {
            continue;
        }

        // Search the neighbors of the candidate
        const neighbors = getNeighbors(candidate, world, cost);
        frontier.push(...neighbors);

        // Mark which square each neighbor came from
        neighbors.forEach((neighbor) => {
            cameFrom.set(getKey(neighbor), candidate);
        });
    }

    // If while loop ends and path is not found, return null
    // This means that the search frontier is empty and
    // the end square is unreachable the max search distance
    // was reached and player can't access the square
    if (!pathFound) {
        return null;
    }

    // Reconstruct path starting from the end point
    let curr = end;

    // Create an array to hold the path
    const path = [curr];

    // While the key value of the current square is not equal to the key value of the start square
    // keep going back through the cameFrom map until we reach the start square
    // This will give us the path from the start square to the end square
    while (getKey(curr) !== getKey(start)) {
        const prev = cameFrom.get(getKey(curr));
        path.push(prev);
        curr = prev;
    }

    // Reverse the path so that it goes from start to end
    path.reverse();

    // Remove the first square from the path (the start square)
    // since the plaer is already there
    path.shift();

    return path;
}

/**
 *
 * @param {THREE.Vector3} coords
 * @param {World} world
 * @param {Map} cost
 *
 */
function getNeighbors(coords, world, cost) {
    let neighbors = [];

    // Assuming the world is a finite grid
    // Get Left Neighbor
    if (coords.x > 0) {
        neighbors.push(new THREE.Vector3(coords.x - 1, 0, coords.z));
    }

    // Get Right Neighbor
    if (coords.x < world.width - 1) {
        neighbors.push(new THREE.Vector3(coords.x + 1, 0, coords.z));
    }

    // Get Top Neighbor
    if (coords.z > 0) {
        neighbors.push(new THREE.Vector3(coords.x, 0, coords.z - 1));
    }

    // Get Bottom Neighbor
    if (coords.z < world.height - 1) {
        neighbors.push(new THREE.Vector3(coords.x, 0, coords.z + 1));
    }

    // cost to get to current square is the current square cost + 1
    const newCost = cost.get(getKey(coords) + 1);

    // Exclude any squares that are already visited as well as
    // any squares that are occupied
    neighbors = neighbors
        .filter((coords) => {
            // if neighboring square has not yet been visited, or
            // this is a cheaper path cost, then include it in the search
            if (
                !cost.has(getKey(coords)) ||
                newCost < cost.get(getKey(coords))
            ) {
                cost.set(getKey(coords), newCost);
                return true;
            } else {
                return false;
            }
        })
        .filter((coords) => !world.getObject(coords));

    return neighbors;
}
