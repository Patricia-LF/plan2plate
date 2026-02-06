// recipeAPI.js - Handles all API calls to the backend

// Searches for recipes based on a search term
// Returns an array of recipe objects
export async function searchRecipes(query) {
  const response = await fetch(
    `/api/recipes/search?query=${encodeURIComponent(query)}`,
  );
  //till error-sida
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch recipes");
  }

  return response.json();
}

// Fetches a specific recipe by ID
// Returns a recipe data object
export async function getRecipeById(id) {
  const response = await fetch(`/api/recipes/${id}`);
  //till error-sida
  if (!response.ok) {
    throw new Error("Failed to load recipe");
  }

  return response.json();
}

// Requests PDF generation for a recipe
// Returns an object with pdfUrl
// export async function generateRecipePDF(recipeId) {
//   const response = await fetch(`/api/recipes/${recipeId}/pdf`);
//   //till error-sida
//   if (!response.ok) {
//     throw new Error("Failed to generate PDF");
//   }

//   return response.json();
// }

// Requests PDF generation for a recipe
// Returns an object with pdfUrl
export async function generateRecipePDF(recipeId) {
  return {
    pdfUrl: `/pdf/${recipeId}`,
  };
}

// Sends a recipe via email
// Returns response data
export async function emailRecipe(recipeId, email) {
  const response = await fetch(`/api/recipes/${recipeId}/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  //till error-sida
  if (!response.ok) {
    throw new Error("Failed to send email");
  }

  return response.json();
}
