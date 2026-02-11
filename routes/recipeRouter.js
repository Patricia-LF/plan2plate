import express from "express";
import { searchRecipes, getRecipeDetails } from "../services/recipeAPI.js";
import { sendRecipeEmail } from "../services/emailService.js";

const router = express.Router();

// ---------- Search for recipes based on query string ----------
router.get("/recipes/search", async (req, res, next) => {
  try {
    // Get search query
    const { query } = req.query;

    // Validate search term
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Please enter a search term" });
    }

    // Fetch recipes from API
    const results = await searchRecipes(query);

    // Return empty array for UX
    if (!results || results.length === 0) {
      return res.status(200).json([]);
    }

    // Success
    res.json(results);
  } catch (err) {
    next(err); // Global error handler
  }
});

// ---------- Fetch chosen recipe by ID ----------
// Dynamic route
router.get("/recipes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch recipe details
    const recipe = await getRecipeDetails(id);

    // Return 404 if not found
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Success
    res.json(recipe);
  } catch (err) {
    next(err); // Global error handler
  }
});

// ---------- POST: Send recipe via email ----------
router.post("/recipes/:id/email", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email address required" });
    }

    const recipe = await getRecipeDetails(id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    await sendRecipeEmail(email, recipe);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
