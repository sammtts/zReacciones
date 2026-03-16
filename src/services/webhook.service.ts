import { Message, User, GuildMember, WebhookClient, AttachmentBuilder } from "discord.js";
import { env } from "../config/env.js";
import { logger } from "../core/logger.js";

const webhookClient = new WebhookClient({ url: env.WEBHOOK_URL });

export async function postToWebhook(
    message: Message,
    author: User,
    reactor: GuildMember,
) {
    try {
        const filesToSend = message.attachments.map(att => 
            new AttachmentBuilder(att.url, { name: att.name, description: att.description ?? "" })
        );
        
        const finalContent = `Aprobado por: ${reactor.user.username} - ${reactor.id}\n${message.content}`;

        await webhookClient.send({
            content: finalContent,
            username: author.username,
            avatarURL: author.displayAvatarURL(),
            files: filesToSend
        });

        logger.info(`Message from ${author.username} - ${author.id} successfully sent to webhook.`);
    } catch (error) {
        logger.error(error, "HTTP error while executing webhook");
    }
}