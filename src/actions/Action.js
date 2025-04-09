import { GameObject } from "../objects/GameObject";

/**
 * Base Action class
 */
export class Action {
    name = "BaseAction";

    /**
     * @type {GameObject}
     */
    source = null;

    /**
     * @type {GameObject}
     */
    constructor(source) {
        this.source = source;
    }

    /**
     * Performs the action
     */
    async perform() {
        // Do something
    }

    /**
     * Returns true/false if the action can be performed
     * @return {<Promise<boolean>}
     */

    async canPerform() {
        return true;
    }
}
