// displayState.js - Manages loading and error display states

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

// Shows the loading spinner
export function showLoading() {
  loadingEl?.classList.remove("hidden");
}

// Hides the loading spinner
export function hideLoading() {
  loadingEl?.classList.add("hidden");
}

// Shows error message depending on type
export function showError(message, type = 'error') {
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.className = `error-message ${type}`; // Add type-class
    errorEl.classList.remove("hidden");

    // Scroll to error message
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Hides the error message
export function hideError() {
  errorEl?.classList.add("hidden");
}


