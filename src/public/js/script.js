// script.js - Main orchestrator file for the search page

import { searchRecipes } from "./recipeAPI.js";
import { renderRecipes, clearResults } from "./recipeUI.js";
import { showLoading, hideLoading, showError, hideError } from "./displayState.js";

console.log("Script loaded! ✅");

// DOM elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Event listeners
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

// Handles recipe search
async function handleSearch() {
  const query = searchInput.value.trim();

  // Validate input
  if (!query) {
    showError("Please enter a search term", "warning");
    return;
  }

  // Prepare UI
  showLoading();
  hideError();
  clearResults();

  try {
    // Call API
    const result = await searchRecipes(query);

    // Check if request was successful
    if (!result.ok) {
      showError(result.message, result.type);
      return;
    }

    const recipes = result.data;

    // Handle empty result
    if (recipes.length === 0) {
      showError("No recipes found. Try another search!", "info");
      return;
    }
    
    // Display results
    renderRecipes(recipes);
  } catch (error) {
    // Network error
    console.error("Search error:", error);
    showError("Connection failed. Please try again later.", "error");
  } finally {
    hideLoading();
  }
}


    
    

