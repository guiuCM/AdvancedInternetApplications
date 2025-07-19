// components/FilterBar.js
export function renderFilterBar(elixirs, onFilter) {

    const container = document.getElementById('filters');
    
    container.innerHTML = '';
  
    const select = document.createElement('select');
    const difficulties = [...new Set(elixirs.map(e => e.difficulty).filter(Boolean))];
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Difficulties';
    select.appendChild(defaultOption);
  
    //generates the selective bar
    difficulties.forEach(diff => {
      const option = document.createElement('option');
      option.value = diff;
      option.textContent = diff;
      select.appendChild(option);
    });
  
    //update
    select.onchange = () => {
      const value = select.value;
      const filtered = value ? elixirs.filter(e => e.difficulty === value) : elixirs;
      onFilter(filtered);
    };
  
    container.appendChild(select);
  }
  