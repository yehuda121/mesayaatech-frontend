/**
 * Sanitizes user input string by removing dangerous content,
 * trimming whitespace, enforcing max length, and detecting modifications.
 *
 * @param {string} text - Raw input from user.
 * @param {number} maxLength - Maximum allowed length for the sanitized string.
 * @returns {{
 *   text: string,         // The cleaned and possibly trimmed text.
 *   tooLong: boolean,     // Indicates if the original text exceeded maxLength.
 *   wasModified: boolean  // Indicates if the content was altered during sanitization.
 * }}
 */
function sanitizeText(text, maxLength, type = 'default') {
  if (typeof text !== 'string') {
    return { text: '', tooLong: false, wasModified: false };
  }

  const original = text;
  let cleaned = text.trim();

  // Remove <script>...</script> tags
  cleaned = cleaned.replace(/<script.*?>.*?<\/script>/gi, '');

  // Remove all other HTML tags
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');

  // Remove "javascript:" from links
  cleaned = cleaned.replace(/javascript:/gi, '');

  // Remove inline event handlers (e.g., onclick="...", onmouseover='...')
  cleaned = cleaned.replace(/on\w+=(['"]).*?\1/gi, '');

  // Sanitize against MongoDB-style injection keys
  if (type !== 'email') {
    cleaned = mongoSanitize(cleaned);
  }

  // Remove special dangerous characters
  cleaned = cleaned.replace(/[${}"]/g, '');

  const tooLong = cleaned.length > maxLength;
  const finalText = tooLong ? cleaned.slice(0, maxLength) : cleaned;
  const wasModified = finalText !== original;

  return {
    text: finalText,
    tooLong,
    wasModified
  };
}

/**
 * Removes keys or characters that could be used in MongoDB injection attacks.
 * For example: {$ne: ""} or keys containing ".".
 *
 * @param {*} input - Input to sanitize (string or object).
 * @returns {*} - Sanitized input.
 */
function mongoSanitize(input) {
  if (typeof input === 'object' && input !== null) {
    for (const key in input) {
      if (/^\$/.test(key) || /\./.test(key)) {
        delete input[key];
      } else {
        input[key] = mongoSanitize(input[key]); // recursion
      }
    }
    return input;
  }

  if (typeof input === 'string') {
    return input.replace(/^\$|\./g, '');
  }

  return input;
}

module.exports = sanitizeText;
