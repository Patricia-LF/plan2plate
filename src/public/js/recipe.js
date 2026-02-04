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
  showError("No recipe ID provided");
  hideLoading();
} else {
  loadRecipe(recipeId);
}

// Loads and displays a recipe
async function loadRecipe(id) {
  try {
    // Fetch recipe from API
    const recipe = await getRecipeById(id);
    
    // Display the recipe
    displayRecipe(recipe);
    
    // Set up event listeners for actions (PDF & Email)
    setupActionListeners(id);
  } catch (error) {
    console.error("Error loading recipe:", error);
    showError("Could not load recipe. Please try again.");
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
    const data = await generateRecipePDF(recipeId);
    window.open(data.pdfUrl, "_blank");
  } catch (error) {
    console.error("PDF generation error:", error);
    alert("Could not generate PDF. Please try again.");
  }
}

// Handles sending recipe via email
async function handleEmailRecipe(recipeId) {
  const email = prompt("Enter your email address:");

  // Validate email
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email address");
    return;
  }

  try {
    await emailRecipe(recipeId, email);
    alert("Recipe sent to your email!");
  } catch (error) {
    console.error("Email error:", error);
    alert("Could not send email. Please try again.");
  }
}