import { Message, MessageReaction, User, GuildMember } from "discord.js";
import type { PartialMessageReaction, PartialUser } from "discord.js";
import { INITIAL_REACTION_EMOJI, INITIAL_REACTION_EMOJI_ID, APPROVED_REACTION_EMOJI, APPROVED_REACTION_EMOJI_ID } from "../config/constants.js";
import { env } from "../config/env.js";
import { logger } from "../core/logger.js";
import { postToWebhook } from "./webhook.service.js";

function isMatchingEmoji(reactionEmoji: MessageReaction['emoji'], expectedId: string | null, expectedStr: string): boolean {
    if (expectedId && reactionEmoji.id === expectedId) return true;
    return reactionEmoji.toString() === expectedStr;
}

export async function handleApproval(
    reaction: MessageReaction | PartialMessageReaction, 
    user: User | PartialUser
): Promise<void> {
    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();

    const message = reaction.message;
    if (message.partial) await message.fetch();

    if (message.channelId !== env.CANAL_ID) return;

    if (!isMatchingEmoji(reaction.emoji, INITIAL_REACTION_EMOJI_ID, INITIAL_REACTION_EMOJI)) {
        return;
    }

    if (!message.guild) return;

    const member = await message.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
        logger.debug(`Could not fetch member object for user ${user.id}`);
        return;
    }

    if (!member.roles.cache.has(env.ROL_ID_PERMITIDO)) return;

    const isAlreadyApproved = message.reactions.cache.some(r => 
        isMatchingEmoji(r.emoji, APPROVED_REACTION_EMOJI_ID, APPROVED_REACTION_EMOJI)
    );
    if (isAlreadyApproved) return;

    try {
        await message.reactions.removeAll();
        await message.react(APPROVED_REACTION_EMOJI);

        await postToWebhook(message as Message, message.author as User, member);
        logger.info(`Message ${message.id} approved by ${member.user.username} (${member.id}).`);
    } catch (error) {
        logger.error({ err: error, messageId: message.id }, `Error during approval sequence`);
    }
}
