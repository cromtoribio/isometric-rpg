import * as THREE from "three";
import { World } from "./world.js";

/**
 * Returns the key for the object map given a set of coordinates
 * @param {THREE.Vector2} coords
 * @returns
 */
const getKey = (coords) => `${coords.x}-${coords.y}`;

/**
 *
 * @param {THREE.Vector2} start
 * @param {THREE.Vector2} end
 * @param {World} world
 * @return {THREE.Vector2[] | null}
 * If path is found, returns the array of coordinates that make up the path, otherwise returns null
 */

export function search(start, end, world) {
    // if the end and start are the same square, skip searching
    if (start.x === end.x && start.y == end.y) return [];

    console.log(
        `Searcing for path from (${start.x}, ${start.y}) to (${end.x}, ${end.y})`
    );
    const maxSearchDistance = 20;
    const cameFrom = new Map();
    const cost = new Map();
    const frontier = [start];
    let pathFound = false;

    // Set cost for starting square
    cost.set(getKey(start), 0);

    while (frontier.length > 0) {
        // Get the square with shortest distance metric
        // Dijkstra - distance to origin
        // A* - distance to origin + estimated distance to destination

        // Sort frontier from shortest to longest distance
        frontier.sort((v1, v2) => {
            const d1 = start.manhattanDistanceTo(v1);
            const d2 = start.manhattanDistanceTo(v2);

            return d1 - d2;
        });

        // Get the square with shortest distance
        const candidate = frontier.shift();

        // Did we find the end goal?
        if (candidate.x === end.x && candidate.y === end.y) {
            pathFound = true;
            console.log(`Found the end at (${candidate.x}, ${candidate.y})`);
            break;
        }

        // If distance is farther than max distance
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

    if (!pathFound) {
        console.log(pathFound);
        return null;
    }

    // Reconstruct path
    let curr = end;
    const path = [curr];

    while (getKey(curr) !== getKey(start)) {
        const prev = cameFrom.get(getKey(curr));
        path.push(prev);
        curr = prev;
    }

    path.reverse();
    path.shift();

    return path;
}

/**
 *
 * @param {THREE.Vector2} coords
 * @param {World} world
 * @param {Map} cost
 *
 */
function getNeighbors(coords, world, cost) {
    let neighbors = [];

    // Left
    if (coords.x > 0) {
        neighbors.push(new THREE.Vector2(coords.x - 1, coords.y));
    }

    // Right
    if (coords.x < world.width - 1) {
        neighbors.push(new THREE.Vector2(coords.x + 1, coords.y));
    }

    // Top
    if (coords.y > 0) {
        neighbors.push(new THREE.Vector2(coords.x, coords.y - 1));
    }

    // Bottom
    if (coords.y < world.height - 1) {
        neighbors.push(new THREE.Vector2(coords.x, coords.y + 1));
    }

    const newCost = cost.get(getKey(coords));

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
