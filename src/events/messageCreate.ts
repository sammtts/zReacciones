import type { BotEvent } from "../core/types.js";
import { env } from "../config/env.js";
import { INITIAL_REACTION_EMOJI, IGNORED_MESSAGE_ID } from "../config/constants.js";
import { logger } from "../core/logger.js";

const event: BotEvent<"messageCreate"> = {
    name: "messageCreate",

    async execute(client, message) {
        if (
            message.author.bot || 
            message.channelId !== env.CANAL_ID || 
            message.id === IGNORED_MESSAGE_ID
        ) {
            return;
        }

        if (message.reactions.cache.size > 0) return;

        try {
            await message.react(INITIAL_REACTION_EMOJI);
        } catch (error) {
            logger.warn(
                { err: error, messageId: message.id }, 
                "Failed to add initial reaction"
            );
        }
    }
};

export default event;