const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  deleteNote,
  queryNote,
} = require('../controllers/noteController');

router.route('/').get(getNotes).post(createNote);
router.route('/:id').get(getNoteById).delete(deleteNote);
router.route('/:id/query').post(queryNote);

module.exports = router;
