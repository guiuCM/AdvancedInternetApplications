// components/ElixirDetails.js
export function renderElixirDetails(elixir) {

    const container = document.getElementById('elixir-details');
    
    container.innerHTML = `
      <h2>${elixir.name}</h2>
      <p><strong>Effect:</strong> ${elixir.effect || 'N/A'}</p>
      <p><strong>Ingredients:</strong> ${elixir.ingredients.map(i => i.name).join(', ') || 'N/A'}</p>
      <p><strong>Difficulty:</strong> ${elixir.difficulty || 'Unknown'}</p>
    `;
  }
  