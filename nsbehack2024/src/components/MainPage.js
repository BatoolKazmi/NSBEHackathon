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
            <div className='d-flex justify-content-between align-items-center pt-4 px-4'>
                <h1 className='mx-auto'>&nbsp;&nbsp;&nbsp;Fridge to Food</h1>
                <Link to={{ pathname: '/saved-recipes' }}>
                    <BiSolidFoodMenu className='saved-btn'/>
                </Link>
            </div>
            <h5 className='d-flex justify-content-center mt-3 mb-1'>
                Enter all ingredients you currently have to receive recipes that you can start cooking right away!
            </h5>
            <h5 className='d-flex justify-content-center mb-4'>
                Use the filter feature to filter recipes by time, allergies, and dietary restrictions
            </h5>
            <div className='container'>
                <div className='row'>
                    <div className='col-6 offset-3'>
                    <Select
                        className='select'
                        classNames={{
                            control: () => 'select-control'
                        }}
                        options={ingredientsList}
                        value={selectedIngredients.map((ingredient) => ({ value: ingredient, label: ingredient }))}
                        onChange={handleIngredientChange}
                        /* onInputChange={(inputValue) => {
                            handleIngredientChange(inputValue);
                        }} */
                        isClearable={false}
                        isSearchable
                        isMulti
                        placeholder="Enter Ingredients"
                    />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-1 offset-8 text-right mt-2'>
                        <button
                            onClick={() => setModalIsOpen(true)}
                            className='filter-btn'
                        >Filter</button>
                    </div>
                </div>
            </div>
            <div className='modal-container'>
                <div>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                        className="modal-shape"
                        
                    >
                        <div className='modal-content'>
                            <h4>Filter Results</h4>
                            <hr/>
                            <h5 className='mt-3'>Time</h5>
                            <h6>
                                {`Select the MAXIMUM amount of time in minutes for the recipes (select 0 to show recipes of all times)`}
                            </h6>
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
                            <h5 className='mt-4'>Allergies</h5>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-6'>
                                        <FormControlLabel control={<Checkbox checked={selectedAllergies.includes('Nuts')} onChange={() => handleAllergyChange('Nuts')}/>} className="checkbox" label="Nuts" />
                                        <FormControlLabel control={<Checkbox checked={selectedAllergies.includes('Shellfish')} onChange={() => handleAllergyChange('Shellfish')}/>} className="checkbox" label="Shellfish" />
                                        <FormControlLabel control={<Checkbox checked={selectedAllergies.includes('Fish')} onChange={() => handleAllergyChange('Fish')}/>} className="checkbox" label="Fish" />
                                    </div>
                                    <div className='col-6'>
                                        <FormControlLabel control={<Checkbox checked={selectedAllergies.includes('Eggs')} onChange={() => handleAllergyChange('Eggs')}/>} className="checkbox" label="Eggs" />
                                        <FormControlLabel control={<Checkbox checked={selectedAllergies.includes('Soy')} onChange={() => handleAllergyChange('Soy')}/>} className="checkbox" label="Soy" />
                                        <FormControlLabel control={<Checkbox checked={selectedAllergies.includes('Sesame')} onChange={() => handleAllergyChange('Sesame')}/>} className="checkbox" label="Sesame" />
                                    </div>
                                </div>
                            </div>
                            <h5 className='mt-4'>Dietary Restrictions</h5>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-6'>
                                        <FormControlLabel control={<Checkbox checked={isVegan} onChange={() => setIsVegan(!isVegan)}/>} className="checkbox" label="Vegan" />
                                        <FormControlLabel control={<Checkbox checked={isGlutenFree} onChange={() => setIsGlutenFree(!isGlutenFree)}/>} className="checkbox mt-2" label="Gluten-free" />
                                    </div>
                                    <div className='col-6'>
                                        <FormControlLabel control={<Checkbox checked={isVegetarian} onChange={() => setIsVegetarian(!isVegetarian)}/>} className="checkbox" label="Vegetarian" />
                                        <FormControlLabel control={<Checkbox checked={isDairyFree} onChange={() => setIsDairyFree(!isDairyFree)}/>} className="checkbox mt-2" label="Dairy-free" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        
            <div className='container mt-4'>
                <div className='row'>
                    {filteredRecipes().map((recipe, index) => (
                    <div className='col-4'>
                        <div className='recipe-card' key={index}>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <img src={recipe.images} alt={`Recipe ${index + 1}`} style={{maxWidth: "100%", maxHeight: "120px"}}></img>
                                </div>
                                <div>
                                    <div className='heart-btn'>
                                        <ToggleButton recipe={recipe} savedRecipes={savedRecipes} setSavedRecipes={setSavedRecipes}/>
                                    </div>
                                    <div className='pot-btn'>
                                        {/* target="_blank" opens link in new tab */}
                                        <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                                            <PiCookingPotBold size="25px"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className='recipe-title mb-1'>{recipe.title}</div>
                            <h6>{recipe.description}</h6>
                            <h6>Time: {recipe.total}</h6>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MainPage;