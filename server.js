import express from "express";
import path from "path";
import url from "url";

const app = express();
const port = 3000;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "./", "src", "/index.html");
app.use(express.static(path.join(__dirname, "src/public/")));

app.get("/", (req, res) => {
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
