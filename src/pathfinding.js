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
 */

export function search(start, end, world) {
    // if the end and start are the same square, skip searching
    if (start.x === end.x && start.y == end.y) return [];

    console.log(
        `Searcing for path from (${start.x}, ${start.y}) to (${end.x}, ${end.y})`
    );
    const maxSearchDistance = 20;
    const visited = new Set();
    const frontier = [start];
    let endFound = false;

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
        console.log(candidate);

        // Did we find the end goal?
        if (candidate.x === end.x && candidate.y === end.y) {
            console.log(`Found the end at (${candidate.x}, ${candidate.y})`);
            break;
        }

        // Mark square as visited
        visited.add(getKey(candidate));

        if (candidate.manhattanDistanceTo(start) > maxSearchDistance) {
            continue;
        }

        // Search the neighbors of the candidate
        const neighbors = getNeighbors(candidate, world, visited);
        frontier.push(...neighbors);
    }
}

/**
 *
 * @param {THREE.Vector2} coords
 * @param {World} world
 * @param {Set} visited
 *
 */
function getNeighbors(coords, world, visited) {
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

    neighbors = neighbors.filter((coords) => !visited.has(getKey(coords)));
    return neighbors;
}
