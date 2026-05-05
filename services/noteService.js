const Note = require('../models/Note');
const aiService = require('./aiService');

/**
 * Asynchronously processes a note using the AI service.
 * Updates the note status to 'ready' upon completion (success or failure).
 * 
 * @param {string} noteId - The ID of the note.
 * @param {string} content - The content to process.
 */
async function processNoteAsync(noteId, content) {
  try {
    console.log(`Starting background processing for Note ${noteId}...`);
    
    // Call AI Service
    const aiResult = await aiService.processNoteContent(content);
    
    // Update the note in the database
    await Note.findByIdAndUpdate(noteId, {
      status: 'ready',
      summary: aiResult.summary,
      keyPoints: aiResult.keyPoints,
      tags: aiResult.tags,
    });
    
    console.log(`Successfully processed Note ${noteId}`);
  } catch (error) {
    console.error(`Error processing Note ${noteId} in background:`, error);
    
    // Ensure the note is not stuck in 'processing' status
    try {
      await Note.findByIdAndUpdate(noteId, {
        status: 'ready',
        summary: 'Error during background processing.',
        keyPoints: [],
        tags: ['error']
      });
      console.log(`Fallback status set for Note ${noteId}`);
    } catch (fallbackError) {
      console.error(`CRITICAL: Failed to set fallback status for Note ${noteId}:`, fallbackError);
    }
  }
}

module.exports = {
  processNoteAsync
};
