import * as dotenv from "dotenv";
dotenv.config();
import axios from 'axios';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

// Error handling
async function makeRequest(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Spoonacular responded with error (400, 401, 404, 500 etc.)
      console.error('Spoonacular API error:', error.response.status);
      
      const err = new Error(error.response.data.message || 'API request failed');
      err.status = error.response.status;  
      throw err;
      
    } else if (error.request) {
      // No response (network error, Spoonacular down)
      console.error('No response from Spoonacular API');
      
      const err = new Error('No response from recipe API');
      err.status = 503;  // Service Unavailable
      throw err;
      
    } else {
      // Something else (wrong in code)
      console.error('Request setup error:', error.message);
      
      const err = new Error(error.message);
      err.status = 500;  // Internal Server Error
      throw err;
    }
  }
}

// Recipe search (12st)
export async function searchRecipes(query, number = 12) {
  if (!query || query.trim() === '') {
    const err = new Error('Search query cannot be empty');
    err.status = 400;
    throw err;
  }

  const url = `${BASE_URL}/recipes/complexSearch`;
  const params = {
    apiKey: API_KEY,  // API_KEY is used here
    query: query.trim(),
    number,
    addRecipeInformation: true,
    fillIngredients: true
  };
  
  const data = await makeRequest(url, params);
  return data.results || [];
}  

// Get details for a specific recipe
export async function getRecipeDetails(id) {
  if (!id || isNaN(id)) {
    const err = new Error('Valid recipe ID is required');
    err.status = 400;
    throw err;
  }

  const url = `${BASE_URL}/recipes/${id}/information`;
  const params = {
    apiKey: API_KEY,  // API_KEY is used here
    includeNutrition: false
  };
  
  return await makeRequest(url, params);
}

