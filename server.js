import express from "express";
import path from "path";
import url from "url";
import recipeRoutes from "./routes/recipeRouter.js";
import PDFRouter from "./routes/PDFRouter.js";

const app = express();
const port = 3000;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect stylesheets & scrips
app.use(express.static(path.join(__dirname, "src/public/")));

// Connect to API
app.use("/api", recipeRoutes);

// Enable PDF
app.use("/pdf", PDFRouter);

// File paths
const filePath = path.join(__dirname, "./", "src", "/index.html");
const filePathRecipe = path.join(__dirname, "./", "src", "/recipe.html");
const fileError = path.join(__dirname, "./", "src", "/error.html");

// Route for Start page
app.get("/", (req, res) => {
  res.sendFile(filePath);
});

//Route for Recipe page
app.get("/recipe", (req, res) => {
  res.sendFile(filePathRecipe);
});

// Wildcard for wrong URLs, 404
app.get("*s", (req, res) => {
  res.status(404).sendFile(fileError);
});

// Global 500 handler - if API connection fails/no recipe is found with those limits/something when wrong check your input - show error on start page!
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Something went wrong. Please try again later." });
});

//Start port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
