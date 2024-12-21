const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { OpenAI } = require('openai');
const faiss = require('faiss');
require('dotenv').config();

const recipeFilePath = path.join(__dirname, '../data/my_fav_recipes.txt');
const indexPath = path.join(__dirname, '../data/recipe_index.index');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to update FAISS index
const updateIndex = async () => {
    try {
        const recipes = fs.readFileSync(recipeFilePath, 'utf-8')
            .split('-------------------------------')
            .filter(recipe => recipe.trim() !== '');

        // Generate embeddings for all recipes
        const embeddings = await Promise.all(recipes.map(async (recipe) => {
            const response = await openai.embeddings.create({
                model: 'text-embedding-ada-002',
                input: recipe,
            });
            return response.data[0].embedding;
        }));

        // Create and save new index
        const dimension = embeddings[0].length;
        const index = faiss.IndexFlatL2(dimension);
        index.add(embeddings);
        faiss.write_index(index, indexPath);
        
        console.log('Index updated successfully');
    } catch (error) {
        console.error('Error updating index:', error);
    }
};

const formatRecipeText = (data) => `
[Recipe]
Name: ${data.name || 'N/A'}
Ingredients: ${data.ingredients || 'N/A'}
Instructions: ${data.instructions || 'N/A'}
Cuisine: ${data.cuisine || 'N/A'}
Taste: ${data.taste || 'N/A'}
Prep Time: ${data.prepTime || 'N/A'}
Reviews: ${data.reviews || 'N/A'}
-------------------------------
`;

const uploadRecipeImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: 'Extract the recipe text from this image.' },
                            { type: 'image_url', image_url: `data:image/png;base64,${base64Image}` }
                        ]
                    }
                ],
                max_tokens: 500
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const recipeText = openaiResponse.data.choices[0]?.message?.content || 'No text extracted';

        const recipeData = formatRecipeText({ name: '[OCR Recipe]', instructions: recipeText });
        fs.appendFileSync(recipeFilePath, recipeData, 'utf-8');

        // Update index after adding new recipe
        await updateIndex();

        fs.unlinkSync(imagePath);

        res.status(201).json({ 
            message: 'Recipe uploaded and indexed successfully via OpenAI Vision OCR.', 
            extracted_text: recipeText 
        });
    } catch (error) {
        console.error('Error with OpenAI OCR:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to process recipe image with OpenAI OCR.' });
    }
};

const addRecipeText = async (req, res) => {
    try {
        const { name, ingredients, instructions, taste, cuisine, prepTime, reviews } = req.body;

        if (!name || !ingredients || !instructions) {
            return res.status(400).json({ message: 'Name, ingredients, and instructions are required fields.' });
        }

        const recipeData = formatRecipeText({
            name,
            ingredients,
            instructions,
            taste,
            cuisine,
            prepTime,
            reviews
        });

        fs.appendFileSync(recipeFilePath, recipeData, 'utf-8');

        // Update index after adding new recipe
        await updateIndex();

        res.status(201).json({ message: 'Recipe added and indexed successfully via text.' });
    } catch (error) {
        console.error('Error adding text recipe:', error.message);
        res.status(500).json({ error: 'Failed to add recipe text.' });
    }
};



const getAllRecipes = async (req, res) => {
    try {
        if (!fs.existsSync(recipeFilePath)) {
            return res.status(404).json({ message: 'No recipes found.' });
        }

        const data = fs.readFileSync(recipeFilePath, 'utf-8');
        const recipes = data
            .split('-------------------------------')
            .filter(recipe => recipe.trim() !== '')
            .map(recipe => {
                const lines = recipe.trim().split('\n');
                return {
                    name: lines.find(line => line.startsWith('Name:'))?.replace('Name: ', '').trim() || 'N/A',
                    ingredients: lines.find(line => line.startsWith('Ingredients:'))?.replace('Ingredients: ', '').trim() || 'N/A',
                    instructions: lines.find(line => line.startsWith('Instructions:'))?.replace('Instructions: ', '').trim() || 'N/A',
                    cuisine: lines.find(line => line.startsWith('Cuisine:'))?.replace('Cuisine: ', '').trim() || 'N/A',
                    taste: lines.find(line => line.startsWith('Taste:'))?.replace('Taste: ', '').trim() || 'N/A',
                    prepTime: lines.find(line => line.startsWith('Prep Time:'))?.replace('Prep Time: ', '').trim() || 'N/A',
                    reviews: lines.find(line => line.startsWith('Reviews:'))?.replace('Reviews: ', '').trim() || 'N/A',
                };
            });

        res.status(200).json({ recipes });
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ error: 'Failed to fetch recipes.' });
    }
};


const searchRecipesByName = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: 'Recipe name query parameter is required.' });
        }

        if (!fs.existsSync(recipeFilePath)) {
            return res.status(404).json({ message: 'No recipes found.' });
        }

        const data = fs.readFileSync(recipeFilePath, 'utf-8');
        const recipes = data
            .split('-------------------------------')
            .filter(recipe => recipe.trim() !== '')
            .map(recipe => recipe.trim())
            .filter(recipe => recipe.includes(`Name: ${name}`))
            .map(recipe => {
                const lines = recipe.trim().split('\n');
                return {
                    name: lines.find(line => line.startsWith('Name:'))?.replace('Name: ', '').trim() || 'N/A',
                    ingredients: lines.find(line => line.startsWith('Ingredients:'))?.replace('Ingredients: ', '').trim() || 'N/A',
                    instructions: lines.find(line => line.startsWith('Instructions:'))?.replace('Instructions: ', '').trim() || 'N/A',
                };
            });

        if (recipes.length === 0) {
            return res.status(404).json({ message: 'No matching recipes found.' });
        }

        res.status(200).json({ recipes });
    } catch (error) {
        console.error('Error searching recipes:', error.message);
        res.status(500).json({ error: 'Failed to search recipes.' });
    }
};

module.exports = {
    uploadRecipeImage,
    addRecipeText,
    getAllRecipes,
    searchRecipesByName,
};
