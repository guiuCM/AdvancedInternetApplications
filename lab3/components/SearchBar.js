// components/SearchBar.js
export function renderSearchBar(elixirs, onSearch) {

    const container = document.getElementById('search-bar');

    container.innerHTML = '';
    const input = document.createElement('input');
    input.placeholder = 'Search elixirs...';

    input.oninput = () => {
      const equalSearch = input.value.toLowerCase();
      const filtered = elixirs.filter(e => e.name.toLowerCase().includes(equalSearch));
      onSearch(filtered);
    };

    container.appendChild(input);
  }
  