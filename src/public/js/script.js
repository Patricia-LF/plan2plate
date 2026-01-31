console.log('Script loaded! ✅');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');

// Temporary MOCK DATA - remove when backend is finished
const USE_MOCK = true;  // Change to false when backend is working

// Event listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
  const query = searchInput.value.trim();
  
  if (!query) {
    showError('Please enter a search term');
    return;
  }
  
  showLoading();
  hideError();
  clearResults();
  
  // ========== Temporary MOCK DATA ==========
  if (USE_MOCK) {
    console.log('Using mock data for testing...');
    setTimeout(() => {
      const mockRecipes = [
        {
          id: 716429,
          title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
          image: "https://img.spoonacular.com/recipes/716429-312x231.jpg",
          readyInMinutes: 45,
          servings: 2
        },
        {
          id: 715538,
          title: "Bruschetta Style Pork & Pasta",
          image: "https://img.spoonacular.com/recipes/715538-312x231.jpg",
          readyInMinutes: 30,
          servings: 5
        },
        {
          id: 644387,
          title: "Chicken Parmesan",
          image: "https://img.spoonacular.com/recipes/644387-312x231.jpg",
          readyInMinutes: 35,
          servings: 4
        },
        {
          id: 782585,
          title: "Cannellini Bean and Asparagus Salad",
          image: "https://img.spoonacular.com/recipes/782585-312x231.jpg",
          readyInMinutes: 20,
          servings: 6
        }
      ];
      displayRecipes(mockRecipes);
      hideLoading();
    }, 1000); // Simulates API-delay
    return;
  }
  // ========== END MOCK DATA ==========
  
  try {
    const response = await fetch(`/api/recipes/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch recipes');
    }
    
    const recipes = await response.json();
    displayRecipes(recipes);
  } catch (error) {
    console.error('Search error:', error);
    showError(error.message || 'Could not load recipes. Please try again later.');
  } finally {
    hideLoading();
  }
}

function displayRecipes(recipes) {
  if (!recipes || recipes.length === 0) {
    const noResults = document.createElement('p');
    noResults.className = 'no-results';
    noResults.textContent = 'No recipes found. Try a different search term!';
    resultsContainer.appendChild(noResults);
    return;
  }
  
  recipes.forEach(recipe => {
    const card = createRecipeCard(recipe);
    resultsContainer.appendChild(card);
  });
}

function createRecipeCard(recipe) {
  // Card container
  const card = document.createElement('div');
  card.className = 'recipe-card';
  
  // Image
  const img = document.createElement('img');
  img.src = recipe.image || '/images/placeholder.jpg';
  img.alt = recipe.title;
  
  // Info container
  const info = document.createElement('div');
  info.className = 'recipe-info';
  
  // Title
  const title = document.createElement('h3');
  title.textContent = recipe.title;
  
  // Meta info
  const meta = document.createElement('p');
  meta.className = 'recipe-meta';
  meta.textContent = `⏱️ ${recipe.readyInMinutes || 'N/A'} min | 👥 ${recipe.servings || 'N/A'} servings`;
  
  // Button
  const btn = document.createElement('a');
  btn.href = `/recipe?id=${recipe.id}`;
  btn.className = 'view-recipe-btn';
  btn.textContent = 'View Recipe';
  
  // Assemble
  info.appendChild(title);
  info.appendChild(meta);
  info.appendChild(btn);
  
  card.appendChild(img);
  card.appendChild(info);
  
  // Click event on whole card
  card.addEventListener('click', (e) => {
    // Don't navigate if clicking the button directly
    if (e.target.tagName !== 'A') {
      window.location.href = `/recipe?id=${recipe.id}`;
    }
  });
  
  return card;
}

function clearResults() {
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
  }
}

function showLoading() {
  loadingEl.classList.remove('hidden');
}

function hideLoading() {
  loadingEl.classList.add('hidden');
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
  setTimeout(() => {
    hideError();
  }, 5000);
}

function hideError() {
  errorEl.classList.add('hidden');
}