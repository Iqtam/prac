const express = require('express');
const { uploadRecipeImage, addRecipeText, getAllRecipes } = require('../controllers/recipeController');
const multer = require('multer');

const router = express.Router();

// Configure Multer for image uploads
const upload = multer({ dest: 'uploads/' });

// Upload recipe via image (uses OCR parsing)
router.post('/upload', upload.single('image'), uploadRecipeImage);

// Add a recipe directly via plain text
router.post('/add-text', addRecipeText);

// Get all recipes from the combined text file
router.get('/', getAllRecipes);

module.exports = router;
