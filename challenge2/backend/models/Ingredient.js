const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ingredient', IngredientSchema);
