const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const faiss = require('faiss');

require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const recipeFilePath = path.join(__dirname, '../data/my_fav_recipes.txt');
const indexPath = path.join(__dirname, '../data/recipe_index.index');

const getEmbedding = async (text) => {
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
    });
    return response.data[0].embedding;
};

const ingestRecipes = async () => {
    try {
        const recipeData = fs.readFileSync(recipeFilePath, 'utf-8');
        const recipes = recipeData.split('-------------------------------').filter(recipe => recipe.trim() !== '');

        const index = new faiss.IndexFlatL2(1536); // 1536 is the dimension for ada-002 embeddings

        for (let i = 0; i < recipes.length; i++) {
            const recipeText = recipes[i].trim();
            const embedding = await getEmbedding(recipeText);
            index.add([embedding]);
        }

        faiss.write_index(index, indexPath);
        console.log('Recipe embeddings stored successfully!');
    } catch (error) {
        console.error('Failed to ingest recipes:', error.message);
    }
};

ingestRecipes();
