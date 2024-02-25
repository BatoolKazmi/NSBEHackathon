import React, { useState } from 'react';
import MainPage from './components/MainPage';
import SavedRecipes from './components/SavedRecipes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  const [savedRecipes, setSavedRecipes] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage savedRecipes={savedRecipes} setSavedRecipes={setSavedRecipes} />} />
        <Route path="/saved-recipes" element={<SavedRecipes savedRecipes={savedRecipes} />} />
      </Routes>
    </Router>
  );
}

export default App;
