// emailTemplate.js - Email HTML templates

export function recipeEmailTemplate(recipe) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2ecc71;">${recipe.title}</h1>
      
      <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%; max-width: 500px; border-radius: 8px;">
      
      <div style="margin: 20px 0;">
        <p><strong>⏱️ Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
        <p><strong>👥 Servings:</strong> ${recipe.servings}</p>
      </div>
      
      <h2 style="color: #2c3e50;">Ingredients</h2>
      <ul>
        ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
      </ul>
      
      <h2 style="color: #2c3e50;">Instructions</h2>
      ${formatInstructions(recipe)}
      
      <hr style="margin: 30px 0;">
      <p style="color: #7f8c8d; font-size: 12px;">
        Sent from Plan2Plate 🍽️<br>
        Recipe data provided by <a href="https://spoonacular.com">Spoonacular</a>
      </p>
    </div>
  `;
}

function formatInstructions(recipe) {
  if (recipe.analyzedInstructions && recipe.analyzedInstructions[0]?.steps) {
    return `
      <ol>
        ${recipe.analyzedInstructions[0].steps.map(step => `<li>${step.step}</li>`).join('')}
      </ol>
    `;
  } else if (recipe.instructions) {
    return `<p>${recipe.instructions}</p>`;
  } else {
    return '<p>No instructions available.</p>';
  }
}