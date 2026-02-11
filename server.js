import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import url from "url";
import recipeRoutes from "./routes/recipeRouter.js";
import PDFRouter from "./routes/PDFRouter.js";

// Debug: verify that email environment variables are loaded (remove after debug)
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "EXISTS" : "MISSING");

const app = express();
const port = 3000;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "src/public/")));

// Routers
app.use("/api", recipeRoutes);
app.use("/pdf", PDFRouter);

// HTML file paths
const viewsPath = path.join(__dirname, "./src/");
const fileIndex = path.join(viewsPath, "index.html");
const fileRecipe = path.join(viewsPath, "recipe.html");
const fileError = path.join(viewsPath, "error.html");

// Route for Start page
app.get("/", (req, res) => {
  res.sendFile(fileIndex);
});

//Route for Recipe page
app.get("/recipe", (req, res) => {
  res.sendFile(fileRecipe);
});

// Wildcard for wrong URLs, 404
app.get("*s", (req, res) => {
  res.status(404).sendFile(fileError);
});

//Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);

  const status = err.status || 500;
  const message = err.message || "Something went wrong. Please try again later";

  res.status(status).json({ error: message });
});

//Start port
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
