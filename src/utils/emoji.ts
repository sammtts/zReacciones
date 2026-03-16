export function extractCustomEmojiId(emojiStr: string): string | null {
    return emojiStr.match(/<a?:\w+:(\d+)>/)?.[1] ?? null;
}