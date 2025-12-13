const Sweet = require('../models/Sweet');
const { validationResult } = require('express-validator');

/**
 * @desc    Create a new sweet
 * @route   POST /api/sweets
 * @access  Private/Admin
 */
exports.createSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, category, price, quantity, description, imageUrl } = req.body;

    // Check if sweet already exists
    const existingSweet = await Sweet.findOne({ name });
    if (existingSweet) {
      return res.status(400).json({
        status: 'error',
        message: 'Sweet with this name already exists'
      });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      description,
      imageUrl
    });

    res.status(201).json({
      status: 'success',
      data: {
        sweet
      }
    });
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating sweet',
      error: error.message
    });
  }
};

/**
 * @desc    Get all sweets
 * @route   GET /api/sweets
 * @access  Private
 */
exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        count: sweets.length,
        sweets
      }
    });
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching sweets',
      error: error.message
    });
  }
};

/**
 * @desc    Search sweets by name, category, or price range
 * @route   GET /api/sweets/search
 * @access  Private
 */
exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    // Build query
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (category) {
      query.category = category.toLowerCase();
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        count: sweets.length,
        sweets
      }
    });
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error searching sweets',
      error: error.message
    });
  }
};

/**
 * @desc    Get single sweet
 * @route   GET /api/sweets/:id
 * @access  Private
 */
exports.getSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        status: 'error',
        message: 'Sweet not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        sweet
      }
    });
  } catch (error) {
    console.error('Get sweet error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching sweet',
      error: error.message
    });
  }
};

/**
 * @desc    Update sweet
 * @route   PUT /api/sweets/:id
 * @access  Private/Admin
 */
exports.updateSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        status: 'error',
        message: 'Sweet not found'
      });
    }

    const { name, category, price, quantity, description, imageUrl } = req.body;

    // Check if new name already exists (if name is being changed)
    if (name && name !== sweet.name) {
      const existingSweet = await Sweet.findOne({ name });
      if (existingSweet) {
        return res.status(400).json({
          status: 'error',
          message: 'Sweet with this name already exists'
        });
      }
    }

    sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      {
        name: name || sweet.name,
        category: category || sweet.category,
        price: price !== undefined ? price : sweet.price,
        quantity: quantity !== undefined ? quantity : sweet.quantity,
        description: description !== undefined ? description : sweet.description,
        imageUrl: imageUrl || sweet.imageUrl
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        sweet
      }
    });
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating sweet',
      error: error.message
    });
  }
};

/**
 * @desc    Delete sweet
 * @route   DELETE /api/sweets/:id
 * @access  Private/Admin
 */
exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        status: 'error',
        message: 'Sweet not found'
      });
    }

    await sweet.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Sweet deleted successfully'
    });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting sweet',
      error: error.message
    });
  }
};

/**
 * @desc    Purchase sweet (decrease quantity)
 * @route   POST /api/sweets/:id/purchase
 * @access  Private
 */
exports.purchaseSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        status: 'error',
        message: 'Sweet not found'
      });
    }

    const { quantity } = req.body;

    // Check if enough stock is available
    if (sweet.quantity < quantity) {
      return res.status(400).json({
        status: 'error',
        message: `Not enough stock. Only ${sweet.quantity} items available`
      });
    }

    // Decrease quantity
    sweet.quantity -= quantity;
    await sweet.save();

    const totalPrice = (sweet.price * quantity).toFixed(2);

    res.status(200).json({
      status: 'success',
      message: 'Purchase successful',
      data: {
        sweet,
        purchasedQuantity: quantity,
        totalPrice: parseFloat(totalPrice)
      }
    });
  } catch (error) {
    console.error('Purchase sweet error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error processing purchase',
      error: error.message
    });
  }
};

/**
 * @desc    Restock sweet (increase quantity)
 * @route   POST /api/sweets/:id/restock
 * @access  Private/Admin
 */
exports.restockSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        status: 'error',
        message: 'Sweet not found'
      });
    }

    const { quantity } = req.body;

    // Increase quantity
    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({
      status: 'success',
      message: 'Restock successful',
      data: {
        sweet,
        restockedQuantity: quantity
      }
    });
  } catch (error) {
    console.error('Restock sweet error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error restocking sweet',
      error: error.message
    });
  }
};
