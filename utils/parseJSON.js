/**
 * Safely parse JSON from a string that might contain markdown formatting.
 *
 * @param {string} text - The raw output from the AI.
 * @param {object} fallback - The fallback object if parsing fails.
 * @returns {object} The parsed JSON object or the fallback.
 */
function parseJSONFromText(text, fallback) {
  try {
    // Attempt direct parse
    return JSON.parse(text);
  } catch (error) {
    // Try to extract JSON from markdown code blocks
    const match = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (innerError) {
        // Fallback if extracting from markdown fails
        return fallback;
      }
    }
    
    // Attempt to find any JSON-like object string
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
        try {
            return JSON.parse(objectMatch[0]);
        } catch (objError) {
            return fallback;
        }
    }

    // Ultimate fallback
    return fallback;
  }
}

module.exports = { parseJSONFromText };
