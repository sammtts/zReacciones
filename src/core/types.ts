import type { ClientEvents } from "discord.js";
import { BotClient } from "../structures/BotClient.js";

export interface BotEvent<K extends keyof ClientEvents = keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (
        client: BotClient,
        ...args: ClientEvents[K]
    ) => Promise<void> | void;
}