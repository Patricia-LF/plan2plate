// recipeAPI.js - Handles all API calls to the backend

// Helper function to determine error type from status code
function getErrorType(status) {
  if (status === 400) return "warning";
  if (status === 404) return "info";
  if (status >= 500) return "error";
  return "error";
}

// Searches for recipes based on a search term
// Returns an array of recipe objects
export async function searchRecipes(query) {
  const response = await fetch(
    `/api/recipes/search?query=${encodeURIComponent(query)}`,
  );

  const data = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      message: data.error,
      type: getErrorType(response.status)
    };
  }

  return {
    ok: true,
    data: data
  };
}

// Fetches a specific recipe by ID
// Returns a recipe data object
export async function getRecipeById(id) {
  const response = await fetch(`/api/recipes/${id}`);
  const data = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      message: data.error,
      type: getErrorType(response.status)
    };
  }

  return {
    ok: true,
    data: data
  };
}

// Requests PDF generation for a recipe
// Returns an object with pdfUrl
export async function generateRecipePDF(recipeId) {
  // Check if PDF can be generated without downloading the entire file
  const response = await fetch(`/pdf/${recipeId}`, { 
    method: 'HEAD'  // HEAD request only checks if URL works
  });

  if (!response.ok) {
    return {
      ok: false,
      message: "Could not generate PDF",
      type: "error"
    };
  }

  return {
    ok: true,
    pdfUrl: `/pdf/${recipeId}`
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

  const data = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      message: data.error,
      type: getErrorType(response.status)
    };
  }

  return {
    ok: true,
    data: data
  };
}
