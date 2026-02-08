import express from "express";
import { getRecipeDetails } from "../services/recipeAPI.js";
import createPDF from "../services/getPDF.js";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const recipeId = req.params.id;

    // Get recipe from API
    const recipe = await getRecipeDetails(recipeId);

    // If API returns null/undefined
    if (!recipe) {
      const error = new Error("Recipe not found");
      error.status = 400;
      throw error;
    }

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="recipe-${recipe.id}.pdf"`,
    );

    try {
      // Generate PDF directly to response stream
      createPDF(recipe, res);
    } catch (pdfError) {
      pdfError.status = 500;
      pdfError.message = "Failed to generate PDF";
      throw pdfError;
    }
  } catch (err) {
    next(err); // Global error handler
  }
});

export default router;
