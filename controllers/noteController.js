const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const { processNoteAsync } = require('../services/noteService');
const aiService = require('../services/aiService');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
const getNotes = asyncHandler(async (req, res) => {
  // Sort by newest first
  const notes = await Note.find().sort({ createdAt: -1 });
  res.status(200).json(notes);
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  res.status(200).json(note);
});

// @desc    Create new note
// @route   POST /api/notes
// @access  Public
const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Please add a title and content');
  }

  // 1. Save note with status = "processing"
  const note = await Note.create({
    title,
    content,
    status: 'processing',
  });

  // 2. Return response immediately (DO NOT block request)
  res.status(201).json(note);

  // 3. Trigger async background function (do not await)
  processNoteAsync(note._id, content);
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Public
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  await note.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Query the AI based on note context
// @route   POST /api/notes/:id/query
// @access  Public
const queryNote = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question) {
    res.status(400);
    throw new Error('Please provide a question');
  }

  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  if (note.status === 'processing') {
    res.status(400);
    throw new Error('Note is still processing. Please wait.');
  }

  // Combine relevant fields to form the context. Trimmed content limits token size.
  const trimmedContent = note.content.length > 2000 ? note.content.substring(0, 2000) + '...' : note.content;
  const context = `
Title: ${note.title}
Summary: ${note.summary}
Key Points: ${note.keyPoints.join(', ')}
Content Snippet: ${trimmedContent}
  `;

  const answer = await aiService.queryNoteContext(context, question);

  res.status(200).json({ answer });
});

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  deleteNote,
  queryNote,
};
