// sanitizeText.js

function sanitizeText(text, maxLength) {
  if (typeof text !== 'string') return '';

  // Step 1 - Trim leading and trailing spaces
  let cleaned = text.trim();

  // Step 2 - Remove dangerous content to prevent XSS and unwanted HTML
  cleaned = cleaned
    .replace(/<script.*?>.*?<\/script>/gi, '')  // Remove any <script>...</script> tags
    .replace(/<\/?[^>]+(>|$)/g, '')            // Remove any remaining HTML tags
    .replace(/javascript:/gi, '')              // Remove javascript: from potential links
    .replace(/on\w+=".*?"/gi, '');              // Remove inline event handlers (e.g., onclick="...")

  // Step 3 - Length check
  if (cleaned.length > maxLength) {
    return 'tooLong';
  }

  return cleaned;
}

module.exports = sanitizeText;
