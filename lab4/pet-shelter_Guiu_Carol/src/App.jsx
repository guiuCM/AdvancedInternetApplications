// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import localPets from './pets.json';

const App = () => {

  //variables
  const [pets, setPets] = useState([]); //list of pets
  const [searchTerm, setSearchTerm] = useState(''); //searchbar value
  const [sortBy, setSortBy] = useState('name'); //name or rating
  const [newPet, setNewPet] = useState({ name: '', description: '', image: '', rating: 1 });

  //add pets.json
  useEffect(() => {
    setPets(localPets);
  }, []);

  //remove pet by id
  const handleDelete = (id) => {
    setPets(pets.filter(pet => pet.id !== id));
  };

  //add pet
  const handleAdd = () => {
    if (!newPet.name || !newPet.description || !newPet.image) return;
  
    const newPetWithId = {
      ...newPet,
      id: Date.now(), // unic ID (timestamp)
    };
  
    setPets([...pets, newPetWithId]);
    setNewPet({ name: '', description: '', image: '', rating: 1 });
  };

  //update rating
  const handleRatingChange = (id, newRating) => {
    const updated = pets.map(pet =>
      pet.id === id ? { ...pet, rating: newRating } : pet
    );
    setPets(updated);
  };

  //filter the list of pets
  const sortedPets = [...pets]
    .filter(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="app-container">
      <h1>My pet Shelter</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      <div className="pets-grid">
        {sortedPets.map((pet) => (
          <div className="pet-card" key={pet.id}>
            <img src={pet.image} alt={pet.name} className="pet-image" />
            <h2>{pet.name}</h2>
            <p>{pet.description}</p>
            <div className="rating">
              <span>Rating:</span>
              <select
                value={pet.rating}
                onChange={(e) => handleRatingChange(pet.id, parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <button onClick={() => handleDelete(pet.id)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>

      <div className="add-form">
        <h2>Add New Pet</h2>
        <input
          placeholder="Name"
          value={newPet.name}
          onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
        />
        <input
          placeholder="Description"
          value={newPet.description}
          onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
        />
        <input
          placeholder="Image URL"
          value={newPet.image}
          onChange={(e) => setNewPet({ ...newPet, image: e.target.value })}
        />
        <input
          type="number"
          min="1"
          max="5"
          value={newPet.rating}
          onChange={(e) => setNewPet({ ...newPet, rating: parseInt(e.target.value) })}
        />
        <button onClick={handleAdd}>Add Pet</button>
      </div>
    </div>
  );
};

export default App;
