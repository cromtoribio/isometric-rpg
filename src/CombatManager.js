import { Player } from "./players/Player.js";

export class CombatManager {
    /**
     * @type {Player[]} Active players in combat
     */
    players = [];

    constructor() {}

    /**
     * Get player's initaitive and add them to array of Players
     * @param {Player} player
     */
    addPlayer(player) {
        this.players.push(player);
    }

    /**
     * Main combat loop
     */
    async takeTurns() {
        while (true) {
            for (const player of this.players) {
                console.log("Player turn", player.name);
                let actionPerformed = false;
                do {
                    const action = await player.requestAction();

                    if (await action.canPerform()) {
                        // Wait for the player to finish performing their action
                        await action.perform();
                        actionPerformed = true;
                    } else {
                        alert("Action cannot be performed");
                    }
                } while (!actionPerformed);
            }
        }
    }
}
