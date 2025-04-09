# isometric-rpg

This is a single player RPG created using Three.JS

The base game concept and functionality is from [Dan Greenheck](https://www.youtube.com/@dangreenheck)

I followed his YouTube Series and then adjusted the visuals to match my style/uses!

# Game Structure

This is here to help me make sure that I understand the structure of Dan's code so that I am not just following a tutorial, but actually understand it.

## Files

### Base Files

index.html & main.js

index.html is the base website that calls main.js to render the 3D world.
main.js is the base code that initializes the 3D world using THREE.js. It initializes all parts of the world including the scene, the camera, the renderer, and all objects that are part of the game.

### Game Classes

**Game Objects**

**_GameObject.js_**
extends THREE.Mesh class

All Game Objects (i.e. Rocks, Trees, Bushes, Players & Enemies) are instances of THREE.Mesh objects so that they can be added to the scene.

Constructor:

-   `coords` (THREE.Vector3) Used in game objects to place or move them within the game world
-   `geometry` (THREE.BufferGeometry class) Used to instantiate the Mesh object added to the scene. Creates the actual "shape" of the object.
-   `material` (THREE.Material class) Used to insitantiate the Mesh object added to the scene. Creates the color of the object.

**_Bush.js, Tree.js, Rock.js_**
extends GameObject class

Variables:

-   `material` (THREE.MeshStandardMaterial) & `geometry` (THREE.SphereGeometry) are instantiated once at the beginning before the Class definition and passed to `super` to create the Object Mesh

Constructor:

-   `this.name` sets the Mesh name to `Object (x, z)` for debugging
-   `coords` used to set Object Position in the world

**Bush.js** uses `minBushRadius` & `maxBushRadius` to calculate a random scale for the bush
**Rock.js** uses `minRadius`, `maxRadius`, `minHeight`, & `maxHeight` to calculate a random scale for the rocks
