import express from "express";
import path from "path";
import url from "url";

const app = express();
const port = 3000;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Connect stylesheets & scrips
app.use(express.static(path.join(__dirname, "src/public/")));

// File paths
const filePath = path.join(__dirname, "./", "src", "/index.html");
const filePathRecipe = path.join(__dirname, "./", "src", "/recipe.html");
const fileError = path.join(__dirname, "./", "src", "/error.html");

// Route for Start page
app.get("/", (req, res) => {
  res.sendFile(filePath);
});

//Routes for Recipe page
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
  res.status(500).json({ error: "Internal server error" });
});

//Start port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
