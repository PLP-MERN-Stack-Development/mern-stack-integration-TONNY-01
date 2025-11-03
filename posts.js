const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');

// GET all posts
router.get('/', postController.getPosts);

// GET single post
router.get('/:id', postController.getPost);

// Create post
router.post('/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('body').notEmpty().withMessage('Body is required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  postController.createPost
);

// Update post
router.put('/:id',
  protect,
  postController.updatePost
);

// Delete post
router.delete('/:id',
  protect,
  postController.deletePost
);

module.exports = router;
