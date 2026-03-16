import type { BotEvent } from "../core/types.js";
import { logger } from "../core/logger.js";
import { startMessageScanner } from "../tasks/reactionScanner.js";

const event: BotEvent<"ready"> = {
    name: "ready",
    once: true,

    execute(client) {
        logger.info(`Bot connected as ${client.user?.tag} (ID: ${client.user?.id})`);
        startMessageScanner(client);
    }
};

export default event;