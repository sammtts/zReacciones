import type { BotEvent } from "../core/types.js";
import { handleApproval } from "../services/approval.service.js";
import { logger } from "../core/logger.js";

const event: BotEvent<"messageReactionAdd"> = {
    name: "messageReactionAdd",

    async execute(client, reaction, user) {
        try {
            await handleApproval(reaction, user);
        } catch (error) {
            logger.error(error, "Error handling messageReactionAdd");
        }
    }
};

export default event;