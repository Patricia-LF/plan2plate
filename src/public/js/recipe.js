console.log("Recipe script loaded! ✅");

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const recipeDetailEl = document.getElementById("recipe-detail");

// Get recipe ID from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

if (!recipeId) {
  showError("No recipe ID provided");
  hideLoading();
} else {
  loadRecipe(recipeId);
}

async function loadRecipe(id) {
  try {
    const response = await fetch(`/api/recipes/${id}`);

    if (!response.ok) {
      throw new Error("Failed to load recipe");
    }

    const recipe = await response.json();
    displayRecipe(recipe);
  } catch (error) {
    console.error("Error loading recipe:", error);
    showError("Could not load recipe. Please try again.");
  } finally {
    hideLoading();
  }
}

function displayRecipe(recipe) {
  // Clear previous content
  while (recipeDetailEl.firstChild) {
    recipeDetailEl.removeChild(recipeDetailEl.firstChild);
  }

  // Create header
  const header = createRecipeHeader(recipe);
  recipeDetailEl.appendChild(header);

  // Create content
  const content = createRecipeContent(recipe);
  recipeDetailEl.appendChild(content);

  recipeDetailEl.classList.remove("hidden");
}

function createRecipeHeader(recipe) {
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

function createRecipeContent(recipe) {
  const content = document.createElement("div");
  content.className = "recipe-content";

  // Actions
  const actions = createActions(recipe.id);
  content.appendChild(actions);

  // Sections
  const sections = document.createElement("div");
  sections.className = "recipe-sections";

  const ingredients = createIngredientsSection(recipe.extendedIngredients);
  const instructions = createInstructionsSection(recipe);

  sections.appendChild(ingredients);
  sections.appendChild(instructions);

  content.appendChild(sections);

  return content;
}

function createActions(recipeId) {
  const actions = document.createElement("div");
  actions.className = "recipe-actions";

  const pdfBtn = document.createElement("button");
  pdfBtn.className = "btn btn-primary";
  pdfBtn.textContent = "📄 Download PDF";
  pdfBtn.addEventListener("click", () => downloadPDF(recipeId));

  const emailBtn = document.createElement("button");
  emailBtn.className = "btn btn-secondary";
  emailBtn.textContent = "📧 Email Recipe";
  emailBtn.addEventListener("click", () => emailRecipe(recipeId));

  actions.appendChild(pdfBtn);
  actions.appendChild(emailBtn);

  return actions;
}

function createIngredientsSection(ingredients) {
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

function createInstructionsSection(recipe) {
  const section = document.createElement("div");
  section.className = "instructions-section";

  const heading = document.createElement("h3");
  heading.textContent = "Instructions";

  section.appendChild(heading);

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
    const stepDiv = document.createElement("div");
    stepDiv.className = "instruction-step";
    stepDiv.textContent = recipe.instructions;
    section.appendChild(stepDiv);
  } else {
    const noInstructions = document.createElement("p");
    noInstructions.textContent = "No instructions available.";
    section.appendChild(noInstructions);
  }

  return section;
}

async function downloadPDF(recipeId) {
  try {
    //mock data response
    if (USE_MOCK) {
      alert("PDF download will be available when backend is ready!");
      return;
    }

    const response = await fetch(`/api/recipes/${recipeId}/pdf`);

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    const data = await response.json();
    window.open(data.pdfUrl, "_blank");
  } catch (error) {
    alert("Could not generate PDF. Please try again.");
  }
}

async function emailRecipe(recipeId) {
  const email = prompt("Enter your email address:");

  if (!email || !email.includes("@")) {
    alert("Please enter a valid email address");
    return;
  }

  try {
    //mock data response
    if (USE_MOCK) {
      alert(
        `Email would be sent to: ${email}\n(Will work when backend is ready!)`,
      );
      return;
    }

    const response = await fetch(`/api/recipes/${recipeId}/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    alert("Recipe sent to your email!");
  } catch (error) {
    alert("Could not send email. Please try again.");
  }
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function hideLoading() {
  loadingEl.classList.add("hidden");
}
