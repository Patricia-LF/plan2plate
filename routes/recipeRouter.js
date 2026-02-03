import express from "express";
import { searchRecipes, getRecipeDetails } from "../services/recipeAPI.js";

const router = express.Router();

// Get search query -> API
router.get("/recipes/search", async (req, res, next) => {
  try {
    const { query } = req.query;

    // UX: Return 200 instead of 400?
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Missing search query" });
    }

    const results = await searchRecipes(query);

    // UX: Return 200 (instead of 404/error page)
    if (!results || results.length === 0) {
      return res.status(200).json([]);
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// Get choosen recipe on dynamic route
router.get("/recipes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const recipe = await getRecipeDetails(id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// Get PDF file
// router.get("/recipes/:id/pdf", async (req, res, next) => {
//   try {
//     return res
//       .status(501)
//       .json({ error: "PDF generation not implemented yet" });
//   } catch (err) {
//     next(err);
//   }
// });

// POST: Send PDF as email
// router.post("/recipes/:id/email", async (req, res, next) => {
//   try {
//     return res.status(501).json({ error: "Email sending not implemented yet" });
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
