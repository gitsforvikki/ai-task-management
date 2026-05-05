const { GoogleGenerativeAI } = require('@google/generative-ai');
const { parseJSONFromText } = require('../utils/parseJSON');

const API_KEY = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Calls Google Gemini to process the note and generate summary, keyPoints, and tags.
 *
 * @param {string} content - The content of the note.
 * @returns {Promise<Object>} - The generated summary, keyPoints, and tags.
 */
async function processNoteContent(content) {
  if (!genAI) {
    console.error('AI ERROR: genAI is not initialized. Check GEMINI_API_KEY or OPENROUTER_API_KEY in .env');
    return getFallbackData();
  }

  console.log('AI INFO: Using model gemini-3-flash-preview for processing...');
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
You are an expert AI assistant that processes notes.
Analyze the following text and extract a summary, 3-5 key points, and 3-5 tags.
You MUST return ONLY valid JSON in the exact structure below, with no additional markdown, explanations, or text:

{
  "summary": "A concise summary of the note (max 100 words).",
  "keyPoints": ["point1", "point2", "point3"],
  "tags": ["tag1", "tag2", "tag3"]
}

Text to analyze:
"""
${content}
"""
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();
    console.log('AI INFO: Successfully received response from Gemini.');
    return parseJSONFromText(resultText, getFallbackData());
  } catch (error) {
    console.error('AI ERROR during processNoteContent:', error.message);
    // If it's a quota error, log it specifically
    if (error.message.includes('429') || error.message.includes('quota')) {
        console.error('AI ERROR: Quota exceeded. Please wait or check your Google AI Studio plan.');
    }
    return getFallbackData();
  }
}

/**
 * Queries the AI based on the note's context.
 */
async function queryNoteContext(context, question) {
  if (!genAI) {
    console.warn('GEMINI_API_KEY is not set. Returning fallback data.');
    return "Gemini API Key is missing. I cannot answer queries at this time.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
You are an intelligent assistant. Answer the user's question based strictly on the provided context.
If the answer is not contained within the context, say "I cannot find the answer in the provided context."

Context:
${context}

Question:
${question}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('AI Query Error:', error.message);
    return "An error occurred while processing your query.";
  }
}

function getFallbackData() {
  return {
    summary: 'AI processing failed or API key missing.',
    keyPoints: ['Failed to generate key points'],
    tags: ['error']
  };
}

module.exports = {
  processNoteContent,
  queryNoteContext
};
