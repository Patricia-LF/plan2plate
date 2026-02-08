// recipe.js - Main orchestrator file for the recipe detail page

import { getRecipeById, generateRecipePDF, emailRecipe } from "./recipeAPI.js";
import { displayRecipe } from "./recipeUI.js";
import { hideLoading, showError } from "./displayState.js";

console.log("Recipe script loaded! ✅");

// DOM elements
const backBtn = document.getElementById("back-btn");

// Event listener. Backs to previous page, e.g. last search
backBtn.addEventListener("click", () => {
  window.history.back();
});

// Get recipe ID from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

// Validate and load recipe
if (!recipeId) {
  showError("No recipe ID provided", "warning");
  hideLoading();
} else {
  loadRecipe(recipeId);
}

// Loads and displays a recipe
async function loadRecipe(id) {
  try {
    // Fetch recipe from API
    const result = await getRecipeById(id);
    
    if (!result.ok) {
      showError(result.message, result.type);
      hideLoading();
      return;
    }

  // Display the recipe
    displayRecipe(result.data);
    
    // Set up event listeners for actions (PDF & Email)
    setupActionListeners(id);
  } catch (error) {
    // Network error
    console.error("Error loading recipe:", error);
    showError("Connection failed. Please try again.", "error");
  } finally {
    hideLoading();
  }
}

// Sets up event listeners for PDF and Email buttons
function setupActionListeners(recipeId) {
  // Find buttons via event delegation (they were created in recipeUI.js)
  document.addEventListener("click", async (e) => {
    // PDF button
    if (e.target.matches(".btn-primary")) {
      await handleDownloadPDF(recipeId);
    }
    
    // Email button
    if (e.target.matches(".btn-secondary")) {
      await handleEmailRecipe(recipeId);
    }
  });
}

// Handles PDF download
async function handleDownloadPDF(recipeId) {
  try {
    const result = await generateRecipePDF(recipeId);
    
    if (!result.ok) {
      showError(result.message, result.type);
      return;
    }
    
    window.open(result.pdfUrl, "_blank");
  } catch (error) {
    console.error("PDF generation error:", error);
    showError("Could not generate PDF. Please try again.", "error");
  }
}

// Handles sending recipe via email
async function handleEmailRecipe(recipeId) {
  const email = prompt("Enter your email address:");

  // Validate email
  if (!email || !email.includes("@")) {
    showError("Please enter a valid email address", "warning");
    return;
  }

  try {
    const result = await emailRecipe(recipeId, email);
    
    if (!result.ok) {
      showError(result.message, result.type);
      return;
    }
    
    showError("Recipe sent to your email!", "success"); //green success message
  } catch (error) {
    console.error("Email error:", error);
    showError("Could not send email. Please try again.", "error");
  }
}
