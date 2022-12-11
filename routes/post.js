const express = require('express');
const {
  createPost,
  readPost,
  deletePost,
  updatePost,
} = require('../controllers/postController');
const { verify } = require('../authorization');
const router = express.Router();

router.post('/createPost', verify, createPost);
router.get('/:id', verify, readPost);
router.delete('/:id', verify, deletePost);
router.put('/:id', verify, updatePost);
module.exports = router;
