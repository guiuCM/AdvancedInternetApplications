//imports
import { fetchElixirs } from './services/api.js';
import { renderElixirsList } from './components/ElixirsList.js';
import { renderSearchBar } from './components/SearchBar.js';
import { renderFilterBar } from './components/FilterBar.js';
import { renderElixirDetails } from './components/ElixirDetails.js';

let elixirs = [];

async function main() {
  document.getElementById('elixirs-list').innerText = 'Loading...';
  elixirs = await fetchElixirs(); //get the information (api)
  renderSearchBar(elixirs, handleSearch);
  renderFilterBar(elixirs, handleFilter);
  renderElixirsList(elixirs, handleSelect);
}

function handleSearch(filtered) {
  renderElixirsList(filtered, handleSelect);
}

function handleFilter(filtered) {
  renderElixirsList(filtered, handleSelect);
}

function handleSelect(elixir) {
  renderElixirDetails(elixir);
}

//start the web
main();
