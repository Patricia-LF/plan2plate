import PDFDocument from "pdfkit";
import fs from "fs";
import axios from "axios";
import path from "path";

// Take URL to image, buffer image, infoga in PDF
async function fetchImageBuffer(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
}

// For Dev-phase
// import mockReceipe from "./mockRecipe.js";
// const recipe = mockReceipe;

async function createPDF(recipe, res) {
  // ------------ Setup ------------
  // Start a PDF document, 1st page is added by default & set size to A4 (letter by default) & set margins
  const document = new PDFDocument({ size: "A4", margin: 50 });

  // Connect content to an output (file)
  // document.pipe(fs.createWriteStream("recipe.pdf"));

  // Connect to browser/client
  document.pipe(res);

  // Layout - Create 2 columns for content
  const pageWidth =
    document.page.width -
    document.page.margins.left -
    document.page.margins.right;
  const gutter = 20;
  const leftColumnWidth = pageWidth * 0.5 - gutter / 2;
  const rightColumnWidth = pageWidth * 0.5 - gutter / 2;

  // ------------ Document content ------------
  // Add title
  document
    .fontSize(24)
    .text(recipe.title, { width: pageWidth, align: "left" })
    .moveDown();

  const leftX = document.page.margins.left;
  const rightX = leftX + leftColumnWidth + gutter; //Upper left corner of right column
  const startY = document.y;

  // ----- Left column: Ingredients -----
  //Title
  document
    .fontSize(14)
    .text("Ingredients", { width: leftColumnWidth, align: "left" })
    .moveDown(0.5);

  // Loop out ingredient list
  recipe.extendedIngredients.forEach((ingredient) => {
    document
      .fontSize(12)
      .text(`- ${ingredient.original}`, {
        width: leftColumnWidth,
        align: "left",
      })
      .moveDown(0.3);
  });

  // ----- Right column -----
  // Add image
  try {
    //This will be the real code line
    const imgBuffer = await fetchImageBuffer(recipe.image);
    document.image(imgBuffer, rightX, startY, { width: rightColumnWidth });

    //TEST: This image is broken
    // document.image("./../src/public/images/bg5.jpg", rightX, startY, {
    //   width: rightColumnWidth,
    // });
  } catch (err) {
    // Fallback image
    const fallbackPath = path.resolve("src/public/images/thaipasta.jpg");
    document.image(fallbackPath, rightX, startY, {
      width: rightColumnWidth,
    }); //TESTING!
  }
  document.moveDown(2);

  // INSERT INSTRUCTIONS HERE
  document
    .fontSize(14)
    .text("Instructions", { width: rightColumnWidth })
    .moveDown(0.5);

  // Loop out instructions list
  recipe.analyzedInstructions[0].steps.forEach((step) => {
    document
      .fontSize(12)
      .text(`${step.number}. ${step.step}`, { align: "left" })
      .moveDown();
  });

  // ---------- Close document ----------
  document.end();
}

export default createPDF;
