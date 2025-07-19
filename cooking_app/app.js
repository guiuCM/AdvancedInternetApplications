import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url'; //handle path

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const SPOONACULAR_API_KEY = 'c2961c29f64f4b35819dd632f4004660';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//api recipies
app.post('/api/recipes', async (req, res) => {
  const { ingredients } = req.body;
  console.log('Received ingredients:', ingredients);

  if (!ingredients || ingredients.length === 0) {
    console.log('No ingredients provided');
    return res.status(400).json({ error: 'No ingredients provided' });
  }

  const ingredientsString = Array.isArray(ingredients) ? ingredients.join(',') : ingredients;

  try {
    console.log('Fetching recipes for:', ingredientsString);
    const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=10&ranking=1&apiKey=${SPOONACULAR_API_KEY}`);

    console.log('API response status:', response.status);

    const data = await response.json();

    console.log('API response data:', data);

    res.json(data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});


//proves
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
