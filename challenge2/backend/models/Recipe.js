const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: [String],
    taste: String,
    reviews: String,
    cuisine: String,
    preparationTime: String,
    image: String
});

module.exports = mongoose.model('Recipe', RecipeSchema);
