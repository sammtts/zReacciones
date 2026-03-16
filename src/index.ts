import { createClient } from "./client.js";
import { logger } from "./core/logger.js";

async function bootstrap() {
    try{
        const client = await createClient();
        await client.start();
    } catch (error) {
        if (error instanceof Error) {
            logger.fatal(error, "An error occurred during bot startup");
        } else {
            logger.fatal("An unknown error occurred during bot startup");
        }
    }
}

bootstrap();