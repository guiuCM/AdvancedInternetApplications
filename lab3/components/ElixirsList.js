// components/ElixirsList.js
export function renderElixirsList(elixirs, onSelect) {

    const container = document.getElementById('elixirs-list');

    container.innerHTML = '';

    elixirs.forEach(elixir => { //loop for all the elixirs
      const div = document.createElement('div');
      div.textContent = elixir.name;
      div.onclick = () => onSelect(elixir);

      container.appendChild(div);
    });
  }
  