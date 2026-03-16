import { readdir } from "node:fs/promises";
import path from "node:path";
import { BotClient } from "../structures/BotClient.js";
import { logger } from "../core/logger.js";

export async function loadEvents(client: BotClient) {
    const eventsPath = path.join(process.cwd(), "src/events");
    const files = await readdir(eventsPath);

    for (const file of files) {
        const filePath = path.join(eventsPath, file);
        const eventModule = await import(filePath);
        const event = eventModule.default;

        if (!event) {
            logger.warn(`Event ${file} has no default export`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
        logger.debug(`Loaded event: ${event.name}`);
    }
}