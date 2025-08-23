import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3000;


// Get the current file path
// const __filename = fileURLToPath(import.meta.url);

// Get the current directory
// const __dirname = dirname(__filename);
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get("/", (req, res) => {
  
  res.render("index.ejs");
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.get("/create", (req, res) => {
  
  res.render("create.ejs");
});

app.post("/add-post", (req, res) => {
  
  res.render("create.ejs");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.set("view engine", "ejs");