import { BotClient } from "./structures/BotClient.js";
import { logger } from "./core/logger.js";
import { loadEvents } from "./handlers/eventHandler.js";

export async function createClient(): Promise<BotClient> {
    const client = new BotClient();
    logger.info("Initializing bot client...");

    await loadEvents(client);
    
    await client.init();
    return client;
}