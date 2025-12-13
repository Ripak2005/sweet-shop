const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createSweet,
  getAllSweets,
  searchSweets,
  getSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} = require('../controllers/sweetController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/sweets/search
 * @desc    Search sweets by name, category, or price range
 * @access  Private
 */
router.get('/search', protect, searchSweets);

/**
 * @route   POST /api/sweets
 * @desc    Create a new sweet (Admin only)
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['chocolate', 'candy', 'gummy', 'lollipop', 'hard-candy', 'toffee', 'other'])
      .withMessage('Invalid category'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('quantity')
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer')
  ],
  createSweet
);

/**
 * @route   GET /api/sweets
 * @desc    Get all sweets
 * @access  Private
 */
router.get('/', protect, getAllSweets);

/**
 * @route   GET /api/sweets/:id
 * @desc    Get single sweet
 * @access  Private
 */
router.get('/:id', protect, getSweet);

/**
 * @route   PUT /api/sweets/:id
 * @desc    Update sweet (Admin only)
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  authorize('admin'),
  [
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer')
  ],
  updateSweet
);

/**
 * @route   DELETE /api/sweets/:id
 * @desc    Delete sweet (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), deleteSweet);

/**
 * @route   POST /api/sweets/:id/purchase
 * @desc    Purchase sweet (decrease quantity)
 * @access  Private
 */
router.post(
  '/:id/purchase',
  protect,
  [
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1')
  ],
  purchaseSweet
);

/**
 * @route   POST /api/sweets/:id/restock
 * @desc    Restock sweet (increase quantity - Admin only)
 * @access  Private/Admin
 */
router.post(
  '/:id/restock',
  protect,
  authorize('admin'),
  [
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1')
  ],
  restockSweet
);

module.exports = router;
