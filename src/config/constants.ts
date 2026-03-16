import { extractCustomEmojiId } from '../utils/emoji.js';

export const INITIAL_REACTION_EMOJI = "<:pendiente:1482979612597424220>";
export const APPROVED_REACTION_EMOJI = "<:aprobada:1482979610672238622>";
export const IGNORED_MESSAGE_ID = "1421594560802459848";

export const INITIAL_REACTION_EMOJI_ID = extractCustomEmojiId(INITIAL_REACTION_EMOJI);
export const APPROVED_REACTION_EMOJI_ID = extractCustomEmojiId(APPROVED_REACTION_EMOJI);