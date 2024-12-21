const express = require('express');
const { addIngredient, updateIngredient, getAllIngredients } = require('../controllers/ingredientController');

const router = express.Router();

// Add a new ingredient
router.post('/add', addIngredient);

// Update an existing ingredient
router.put('/update/:id', updateIngredient);

// Get all ingredients
router.get('/', getAllIngredients);

module.exports = router;
