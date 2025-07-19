const searchBtn = document.getElementById('searchBtn');
const ingredientsInput = document.getElementById('ingredientsInput');
const recipeContainer = document.getElementById('recipeContainer');
const tryAgainBtn = document.getElementById('tryAgainBtn');

let currentRecipes = [];
let currentIndex = 0;

function showRecipe(index) {
  if (currentRecipes.length === 0) {
    recipeContainer.innerHTML = '<p>No recipes found.</p>';
    tryAgainBtn.style.display = 'none';
    return;
  }

  const recipe = currentRecipes[index];

  const missingIngredients = recipe.missedIngredients.map(i => i.name).join(', ');
  const usedIngredients = recipe.usedIngredients.map(i => i.name).join(', ');

  recipeContainer.innerHTML = `
    <div class="recipe">
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}" width="250" />
      <p><strong>You have:</strong> ${usedIngredients || 'None'}</p>
      <p class="missing"><strong>Missing:</strong> ${missingIngredients || 'None'}</p>
      <a href="https://spoonacular.com/recipes/${encodeURIComponent(recipe.title.replace(/\s/g, '-'))}-${recipe.id}" target="_blank">View full recipe</a>
    </div>
  `;

  tryAgainBtn.style.display = currentRecipes.length > 1 ? 'inline-block' : 'none';
}

searchBtn.addEventListener('click', async () => {
  const ingredients = ingredientsInput.value.trim();
  if (!ingredients) {
    alert('Please enter some ingredients.');
    return;
  }

  recipeContainer.innerHTML = 'Loading...';
  tryAgainBtn.style.display = 'none';

  const response = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: ingredients.split(',').map(s => s.trim()) })
  });

  const data = await response.json();

  if (data.error) {
    recipeContainer.innerHTML = `<p>Error: ${data.error}</p>`;
    return;
  }

  currentRecipes = data;
  currentIndex = 0;
  showRecipe(currentIndex);
});

tryAgainBtn.addEventListener('click', () => {
  if (currentRecipes.length <= 1) return;
  currentIndex = (currentIndex + 1) % currentRecipes.length;
  showRecipe(currentIndex);
});
