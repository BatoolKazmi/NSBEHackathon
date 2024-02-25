import React, { useState } from 'react';
import Modal from "react-modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import Select, { components } from 'react-select';
import { Link } from 'react-router-dom';
import "./MainPage.css";
import SavedRecipes from "./SavedRecipes";
import validIngredients from "../assets/ingredients.txt";
import { BiSolidFoodMenu } from "react-icons/bi";
import { PiCookingPotBold } from "react-icons/pi";
import ToggleButton from './ToggleButton';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function MainPage() {
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [isVegan, setIsVegan] = useState(false);
    const [isDairyFree, setIsDairyFree] = useState(false);
    const [isGlutenFree, setIsGlutenFree] = useState(false);

    useEffect(() => {
        fetchRecipes();
    }, []);

    // Function to fetch recipes from backend
    const fetchRecipes = async () => {
        try {
            // Replace '/api/recipes' with your actual backend endpoint
            const response = await fetch('/api/recipes');
            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }
            const data = await response.json();
            setRecipes(data); // Update state with fetched recipes
        } catch (error) {
            console.error('Error fetching recipes:', error.message);
        }
    };

    const handleIngredientChange = async (newValue, actionMeta) => {
        try {
            const selectedIngredients = newValue ? newValue.map(option => option.value) : [];
            const response = await fetch('/api/recipes/filterByIngredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients: selectedIngredients }),
            });
            if (!response.ok) {
                throw new Error('Failed to filter recipes by ingredients');
            }
            const data = await response.json();
            setRecipes(data); // Update state with filtered recipes from the backend
        } catch (error) {
            console.error('Error filtering recipes by ingredients:', error.message);
        }
    };

    const filterRecipesByTime = async (maxTime) => {
        try {
            const response = await fetch(`/api/recipes?maxTime=${maxTime}`); // Adjust endpoint and query parameter as per your backend
            if (!response.ok) {
                throw new Error('Failed to filter recipes by time');
            }
            const data = await response.json();
            setRecipes(data); // Update state with filtered recipes from the backend
        } catch (error) {
            console.error('Error filtering recipes by time:', error.message);
        }
    };
    
    const handleSliderChange = async (event, newValue) => {
        try {
            const response = await fetch(`/api/recipes?maxTime=${newValue}`); // Adjust endpoint and query parameter as per your backend
            if (!response.ok) {
                throw new Error('Failed to filter recipes by time');
            }
            const data = await response.json();
            setRecipes(data); // Update state with filtered recipes from the backend
        } catch (error) {
            console.error('Error filtering recipes by time:', error.message);
        }
    };

    const handleAllergyChange = async (allergy) => {
        try {
            const response = await fetch('/api/recipes/filterByAllergy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ allergy }),
            });
            if (!response.ok) {
                throw new Error('Failed to filter recipes by allergy');
            }
            const data = await response.json();
            setRecipes(data); // Update state with filtered recipes from the backend
        } catch (error) {
            console.error('Error filtering recipes by allergy:', error.message);
        }
    };

    const handleDietaryRestrictionChange = async (restriction) => {
        try {
            const response = await fetch('/api/recipes/filterByDietaryRestriction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ restriction }),
            });
            if (!response.ok) {
                throw new Error('Failed to filter recipes by dietary restriction');
            }
            const data = await response.json();
            setRecipes(data); // Update state with filtered recipes from the backend
        } catch (error) {
            console.error('Error filtering recipes by dietary restriction:', error.message);
        }
    };
        
    return (
        <div>
            {/* Render recipe cards */}
            {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
            ))}

            {/* Modal for filtering */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                // Add modal content here
            >
                {/* Add modal content, filtering options, etc. */}
                <h2>Filter Options</h2>
                {/* Add filtering options components here */}
                <Box sx={{ width: "100%" }}>
                    <Slider
                        value={sliderValue}
                        aria-label="Custom marks"
                        defaultValue={20}
                        step={10}
                        valueLabelDisplay="auto"
                        onChange={handleSliderChange}
                    />
                </Box>
                {/* Add other filtering options as needed */}
            </Modal>
        </div>
    );
}

export default MainPage;