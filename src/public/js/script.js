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
    showError("Please enter a search term");
    return;
  }

  // Prepare UI
  showLoading();
  hideError();
  clearResults();

  try {
    // Call API
    const recipes = await searchRecipes(query);
    
    // Display results
    renderRecipes(recipes);
  } catch (error) {
    console.error("Search error:", error);
    showError(
      error.message || "Could not load recipes. Please try again later."
    );
  } finally {
    hideLoading();
  }
}



