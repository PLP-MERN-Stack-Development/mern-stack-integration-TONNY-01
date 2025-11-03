const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');
const { body, validationResult } = require('express-validator');

// GET all categories
router.get('/', categoryController.getCategories);

// Create category (protected route)
router.post('/',
  protect,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('slug').notEmpty().withMessage('Slug is required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  categoryController.createCategory
);

module.exports = router;
