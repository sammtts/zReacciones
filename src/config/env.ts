import { config } from "dotenv";
import { z } from "zod";
import { logger } from "../core/logger.js";
config();

const envSchema = z.object({
    NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
    
    DISCORD_TOKEN: z
    .string()
    .min(1, "DISCORD_TOKEN is required."),

    WEBHOOK_URL: z
    .string()
    .url("WEBHOOK_URL must be a valid URL."),

    CANAL_ID: z
    .string()
    .regex(/^\d+$/, "CANAL_ID must be a valid Discord ID."),

    ROL_ID_PERMITIDO: z
    .string()
    .regex(/^\d+$/, "ROL_ID_PERMITIDO must be a valid Discord ID."),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    logger.fatal("Invalid environment variables:");

    for (const issue of parsed.error.issues) {
        logger.fatal(`- ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
}

export const env = parsed.data;