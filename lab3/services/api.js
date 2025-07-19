// services/api.js
export async function fetchElixirs() {

    // Await pauses execution until promise resolves
    const res = await fetch('https://wizard-world-api.herokuapp.com/Elixirs');

    //error handler
    if (!res.ok) throw new Error('Failed to fetch elixirs');
    return res.json();
  }
  