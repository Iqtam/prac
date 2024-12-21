const Ingredient = require('../models/Ingredient');

// Add a new ingredient
const addIngredient = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        const ingredient = new Ingredient({ name, quantity });
        await ingredient.save();
        res.status(201).json({ message: 'Ingredient added successfully', ingredient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing ingredient
const updateIngredient = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const ingredient = await Ingredient.findByIdAndUpdate(id, { quantity }, { new: true });
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }
        res.json({ message: 'Ingredient updated successfully', ingredient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all ingredients
const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addIngredient,
    updateIngredient,
    getAllIngredients,
};
