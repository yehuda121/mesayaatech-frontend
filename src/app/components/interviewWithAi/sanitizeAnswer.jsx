/**
 * Sanitizes user-submitted HTML content for interview answers.
 * Allows safe formatting tags only and strips all dangerous attributes.
 *
 * @param {string} text - User input containing HTML
 * @returns {string} - Clean and safe HTML (max 700 chars)
 */
export function sanitizeAnswer(text) {
  if (typeof text !== 'string') return '';

  // Only allow basic formatting tags
  const allowedTags = ['b', 'i', 'strong', 'em', 'code', 'pre', 'p', 'br'];

  // Remove all dangerous attributes (e.g., onclick, style, onerror, etc.)
  text = text.replace(/<([a-zA-Z0-9]+)(\s+[^>]*)?>/g, (match, tagName, attrs = '') => {
    tagName = tagName.toLowerCase();

    if (!allowedTags.includes(tagName)) return ''; // remove disallowed tags

    // Strip all attributes (keep tag only)
    return `<${tagName}>`;
  });

  // Remove all closing tags that are not in the allowed list
  text = text.replace(/<\/([a-zA-Z0-9]+)>/g, (match, tagName) => {
    return allowedTags.includes(tagName.toLowerCase()) ? match : '';
  });

  // Final safety cleanup: remove script/style tags and comments
  text = text.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // Trim and enforce max length
  // const cleaned = text.trim();
  return text.length > 700 ? text.slice(0, 700) : text;
}
