const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const faiss = require('faiss');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const recipeFilePath = path.join(__dirname, '../data/my_fav_recipes.txt');
const indexPath = path.join(__dirname, '../data/recipe_index.index');

let indexCache = null;
let lastIndexUpdate = 0;
const INDEX_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getIndex = () => {
    const currentTime = Date.now();
    if (!indexCache || currentTime - lastIndexUpdate > INDEX_CACHE_DURATION) {
        indexCache = faiss.read_index(indexPath);
        lastIndexUpdate = currentTime;
    }
    return indexCache;
};

const getRelevantRecipes = async (query) => {
    try {
        const userEmbeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: query,
        });

        const userEmbedding = userEmbeddingResponse.data[0].embedding;
        const index = getIndex();

        const [distances, ids] = index.search([userEmbedding], 5);

        const recipeData = fs.readFileSync(recipeFilePath, 'utf-8');
        const recipes = recipeData
            .split('-------------------------------')
            .filter(recipe => recipe.trim() !== '');

        return ids.map(id => recipes[id]).filter(Boolean);
    } catch (error) {
        console.error('Failed to retrieve relevant recipes:', error.message);
        return [];
    }
};

exports.chatWithBot = async (req, res) => {
    try {
        const { userInput, availableIngredients = '' } = req.body;

        const query = `Preference: ${userInput}. Available ingredients: ${availableIngredients}`;
        const relevantRecipes = await getRelevantRecipes(query);

        const llmPrompt = `
You are a helpful recipe assistant. Based on user preferences and available ingredients, recommend the best possible recipe.

### User Preferences:
- ${userInput}

### Available Ingredients:
- ${availableIngredients}

### Top Relevant Recipes:
${relevantRecipes.join('\n\n')}

### Instructions:
1. Recommend the most suitable recipe.
2. Provide a summary with name, ingredients, and instructions.
3. Suggest alternatives if necessary.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'You are a helpful recipe assistant.' },
                { role: 'user', content: llmPrompt }
            ],
            max_tokens: 500,
        });

        res.status(200).json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error('Chatbot Error:', error.message);
        res.status(500).json({ error: 'Failed to process your request.' });
    }
};