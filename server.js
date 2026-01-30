import express from "express";
import path from "path";
import url from "url";

const app = express();
const port = 3000;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "./", "src", "/index.html");
const filePathRecipe = path.join(__dirname, "./", "src", "/recipe.html");

app.get("/", (req, res) => {
  res.sendFile(filePath);
});

app.get("/recipe", (req, res) => {
  res.sendFile(filePathRecipe);
});

app.use(express.static(path.join(__dirname, "src/public/")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

console.log("Recipe path:", filePathRecipe);
