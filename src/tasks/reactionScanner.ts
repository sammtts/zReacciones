import { BotClient } from "../structures/BotClient.js";
import { env } from "../config/env.js";
import { IGNORED_MESSAGE_ID, INITIAL_REACTION_EMOJI } from "../config/constants.js";
import { logger } from "../core/logger.js";
import { TextChannel, DiscordAPIError } from "discord.js";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function processPendingMessages(client: BotClient, isInitialScan: boolean = false) {
    const scanType = isInitialScan ? "initial" : "scheduled";
    logger.info(`Message scan (${scanType}) started.`);

    try {
        const channel = await client.channels.fetch(env.CANAL_ID).catch(() => null);
        if (!channel || !(channel instanceof TextChannel)) {
            logger.error(`Failed to fetch text channel ${env.CANAL_ID}`);
            return;
        }

        const messages = await channel.messages.fetch({ limit: 100 }); 
        let addedCount = 0;

        for (const [id, message] of messages) {
            if (message.author.bot || message.id === IGNORED_MESSAGE_ID) continue;

            if (message.reactions.cache.size === 0) {
                try {
                    await message.react(INITIAL_REACTION_EMOJI);
                    addedCount++;
                    
                    if (addedCount % 10 === 0) {
                        await sleep(1000);
                    }
                } catch (error) {
                    if (error instanceof DiscordAPIError && error.code === 50013) {
                        logger.warn(`Missing reaction permissions for message ${message.id}.`);
                    } else {
                        logger.warn({ err: error, messageId: message.id }, `Failed to react to message`);
                    }
                }
            }
        }
    } catch (error) {
        logger.error(error, "Unexpected error iterating messages during scan");
    }
}

let timeoutId: NodeJS.Timeout | null = null;
const SCAN_INTERVAL_MS = 5 * 60 * 1000;

export function startMessageScanner(client: BotClient) {
    processPendingMessages(client, true);

    const loop = () => {
        timeoutId = setTimeout(async () => {
            await processPendingMessages(client, false);
            loop();
        }, SCAN_INTERVAL_MS);
    };

    loop();
}

export function stopMessageScanner() {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
}