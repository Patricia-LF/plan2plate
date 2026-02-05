import PDFDocument from "pdfkit";
import fs from "fs";

//Connect with choosen recipe (NEEDS TO BE DONE!!!!!)

// For Dev-phase
import mockReceipe from "./mockRecipe.js";
const recipe = mockReceipe;

// ------------ Setup ------------
// Start a PDF document, 1st page is added by default & set size to A4 (letter by default) & set margin
const document = new PDFDocument({ size: "A4", margin: 50 });

// Connect content to an output (file)
document.pipe(fs.createWriteStream("recipe.pdf"));

// Layout: 2 columns
const pageWidth =
  document.page.width -
  document.page.margins.left -
  document.page.margins.right;
const gutter = 20;
const leftColumnWidth = pageWidth * 0.33 - gutter / 2;
const rightColumnWidth = pageWidth * 0.66 - gutter / 2;

// ------------ Document content ------------
// Add title
document.fontSize(24).text(recipe.title, { width: pageWidth, align: "left" });

// ----- Left column -----
//INSERT INGREDIENT LIST
document
  .fontSize(14)
  .text("Ingredients", { width: leftColumnWidth, align: "left" });

// Loop out ingredient list
recipe.extendedIngredients.forEach((ingredient) => {
  document
    .fontSize(12)
    .text(ingredient.original, { width: leftColumnWidth, align: "left" });
});

// ----- Right column -----
// Add image

try {
  //This will be the real code line
  // TODO: Needs to buffer!!!
  //document.image(recipe.image, { width: rightColumnWidth });

  //TEST: This image is broken
  document.image("./../src/public/images/bg5.jpg", { width: rightColumnWidth });
} catch (err) {
  // Fallback image
  document.image("./../src/public/images/thaipasta.jpg", {
    width: rightColumnWidth,
  }); //WORKS FINE
}

// INSERT INSTRUCTIONS HERE
document.fontSize(14).text("Instructions", { width: rightColumnWidth });

// Loop out instructions list
recipe.analyzedInstructions[0].steps.forEach((step) => {
  document.fontSize(12).text(`${step.number}. ${step.step}`, {
    width: rightColumnWidth,
    align: "left",
  });
});

// ---------- Close document ----------
document.end();
