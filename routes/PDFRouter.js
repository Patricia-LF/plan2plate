import express from "express";
import { getRecipeDetails } from "../services/recipeAPI.js";
import createPDF from "../services/getPDF.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Get recipe from API
    const recipe = await getRecipeDetails(recipeId);

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="recipe-${recipe.id}.pdf"`,
    );

    // Generate PDF directly to response stream
    createPDF(recipe, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate PDF" });
  }
});

export default router;
