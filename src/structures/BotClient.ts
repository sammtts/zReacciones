import { Client, GatewayIntentBits, Partials } from "discord.js";
import { env } from "../config/env.js";
import { logger } from "../core/logger.js";

export class BotClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.Message,
                Partials.Channel,
                Partials.Reaction
            ]
        });
    }

    async init(): Promise<void> {
        logger.info("Running client initialization...");
    }

    async start(): Promise<void> {
        logger.info("Connecting to Discord...");
        await this.login(env.DISCORD_TOKEN);
    }
}