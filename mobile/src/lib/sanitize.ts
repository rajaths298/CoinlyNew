/**
 * Input sanitizers for user-supplied text that gets persisted.
 */

/** Max length for a stored display name. */
export const DISPLAY_NAME_MAX = 50;

/**
 * Sanitize a user-supplied display name before it is persisted or sent to
 * Supabase: strip HTML tags / stray angle brackets and control characters,
 * collapse whitespace, trim, and cap the length.
 */
export function sanitizeDisplayName(input: string): string {
  const noHtml = input
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[<>]/g, ''); // strip stray angle brackets

  // Drop control characters (char code < 32, or DEL 127) without a
  // control-character regex literal.
  let cleaned = '';
  for (const ch of noHtml) {
    const code = ch.charCodeAt(0);
    if (code >= 32 && code !== 127) cleaned += ch;
  }

  return cleaned.replace(/\s+/g, ' ').trim().slice(0, DISPLAY_NAME_MAX);
}
