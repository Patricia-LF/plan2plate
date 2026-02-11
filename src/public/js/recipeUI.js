// recipeUI.js - Handles all DOM manipulation and rendering

const resultsContainer = document.getElementById("results");
const recipeDetailEl = document.getElementById("recipe-detail");

// Renders a list of recipes in the results container
export function renderRecipes(recipes) {
  if (!recipes || recipes.length === 0) {
    const noResults = document.createElement("p");
    noResults.className = "no-results";
    noResults.textContent = "No recipes found. Try a different search term!";
    resultsContainer.appendChild(noResults);
    return;
  }

  recipes.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    resultsContainer.appendChild(card);
  });
}

// Creates a recipe card element
export function createRecipeCard(recipe) {
  // Card container
  const card = document.createElement("div");
  card.className = "recipe-card";

  // Image
  const img = document.createElement("img");
  img.src = recipe.image || "/images/placeholder.jpg";
  img.alt = recipe.title;

  // Info container
  const info = document.createElement("div");
  info.className = "recipe-info";

  // Title
  const title = document.createElement("h3");
  title.textContent = recipe.title;

  // Meta info
  const meta = document.createElement("p");
  meta.className = "recipe-meta";
  meta.textContent = `⏱️ ${recipe.readyInMinutes || "N/A"} min | 👥 ${recipe.servings || "N/A"} servings`;

  // Button
  const btn = document.createElement("a");
  btn.href = `/recipe?id=${recipe.id}`;
  btn.className = "view-recipe-btn";
  btn.textContent = "View Recipe";

  // Assemble the card
  info.appendChild(title);
  info.appendChild(meta);
  info.appendChild(btn);

  card.appendChild(img);
  card.appendChild(info);

  // Click event on whole card (navigate unless clicking the button)
  card.addEventListener("click", (e) => {
    if (e.target.tagName !== "A") {
      window.location.href = `/recipe?id=${recipe.id}`;
    }
  });

  return card;
}

// Clears the results container
export function clearResults() {
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
  }
}

// Displays a complete recipe on the recipe page
export function displayRecipe(recipe) {
  // Clear previous content
  while (recipeDetailEl.firstChild) {
    recipeDetailEl.removeChild(recipeDetailEl.firstChild);
  }

  // Create and append header section
  const header = createRecipeHeader(recipe);
  recipeDetailEl.appendChild(header);

  // Create and append content section
  const content = createRecipeContent(recipe);
  recipeDetailEl.appendChild(content);

  recipeDetailEl.classList.remove("hidden");
}

// Creates the header section for the recipe page
export function createRecipeHeader(recipe) {
  const header = document.createElement("div");
  header.className = "recipe-header";

  const img = document.createElement("img");
  img.src = recipe.image;
  img.alt = recipe.title;

  const overlay = document.createElement("div");
  overlay.className = "recipe-title-overlay";

  const title = document.createElement("h2");
  title.textContent = recipe.title;

  const meta = document.createElement("p");
  meta.className = "recipe-meta";
  meta.textContent = `⏱️ ${recipe.readyInMinutes} minutes | 👥 ${recipe.servings} servings`;

  overlay.appendChild(title);
  overlay.appendChild(meta);

  header.appendChild(img);
  header.appendChild(overlay);

  return header;
}

// Creates the content section for the recipe page
export function createRecipeContent(recipe) {
  const content = document.createElement("div");
  content.className = "recipe-content";

  // Action buttons (PDF, Email)
  const actions = createActions(recipe.id);
  content.appendChild(actions);

  // Recipe sections (Ingredients & Instructions)
  const sections = document.createElement("div");
  sections.className = "recipe-sections";

  const ingredients = createIngredientsSection(recipe.extendedIngredients);
  const instructions = createInstructionsSection(recipe);

  sections.appendChild(ingredients);
  sections.appendChild(instructions);

  content.appendChild(sections);

  return content;
}

// Creates action buttons (PDF, Email)
export function createActions(recipeId) {
  const actions = document.createElement("div");
  actions.className = "recipe-actions";

  const pdfBtn = document.createElement("button");
  pdfBtn.className = "btn btn-primary";
  pdfBtn.textContent = "📄 Download PDF";
  pdfBtn.dataset.recipeId = recipeId;

  const emailBtn = document.createElement("button");
  emailBtn.className = "btn btn-secondary";
  emailBtn.textContent = "📧 Email Recipe";
  emailBtn.dataset.recipeId = recipeId;

  actions.appendChild(pdfBtn);
  actions.appendChild(emailBtn);

  return actions;
}

// Creates the ingredients section
export function createIngredientsSection(ingredients) {
  const section = document.createElement("div");
  section.className = "ingredients-section";

  const heading = document.createElement("h3");
  heading.textContent = "Ingredients";

  const list = document.createElement("ul");
  list.className = "ingredients-list";

  ingredients.forEach((ing) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `ing-${ing.id}`;

    const label = document.createElement("label");
    label.htmlFor = `ing-${ing.id}`;
    label.textContent = ing.original;

    li.appendChild(checkbox);
    li.appendChild(label);
    list.appendChild(li);
  });

  section.appendChild(heading);
  section.appendChild(list);

  return section;
}

// Creates the instructions section
export function createInstructionsSection(recipe) {
  const section = document.createElement("div");
  section.className = "instructions-section";

  const heading = document.createElement("h3");
  heading.textContent = "Instructions";

  section.appendChild(heading);

  // Check if there are structured instructions
  if (recipe.analyzedInstructions && recipe.analyzedInstructions[0]?.steps) {
    recipe.analyzedInstructions[0].steps.forEach((step) => {
      const stepDiv = document.createElement("div");
      stepDiv.className = "instruction-step";

      const stepNumber = document.createElement("strong");
      stepNumber.textContent = `Step ${step.number}:`;

      const stepText = document.createTextNode(` ${step.step}`);

      stepDiv.appendChild(stepNumber);
      stepDiv.appendChild(stepText);
      section.appendChild(stepDiv);
    });
  } else if (recipe.instructions) {
    // Fallback to unstructured instructions
    const stepDiv = document.createElement("div");
    stepDiv.className = "instruction-step";
    stepDiv.textContent = recipe.instructions;
    section.appendChild(stepDiv);
  } else {
    // No instructions available
    const noInstructions = document.createElement("p");
    noInstructions.textContent = "No instructions available.";
    section.appendChild(noInstructions);
  }

  return section;
}
