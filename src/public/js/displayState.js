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

// Shows an error message (auto-hides after 5 seconds)
export function showError(message) {
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
    setTimeout(() => {
      hideError();
    }, 5000);
  }
}

// Hides the error message
export function hideError() {
  errorEl?.classList.add("hidden");
}
