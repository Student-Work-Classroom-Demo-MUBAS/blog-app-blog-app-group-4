import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from "multer";
const app = express();
const port = 3000;


// Get the current file path
// const __filename = fileURLToPath(import.meta.url);

// Get the current directory
// const __dirname = dirname(__filename);
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
// const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save in uploads folder
  },
  filename: function (req, file, cb) {
    // preserve original extension (.png, .jpg, etc.)
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));
let posts = [];
app.get("/", (req, res) => {
  
  res.render("index.ejs");
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});



// app.post("/add-post", (req, res) => {
  
//   res.render("create.ejs");
// });
app.post("/add-post", upload.single("picture"), (req, res) => {
  const { title, author, date, content, category } = req.body;

  // Create a new post object
  const newPost = {
    id: posts.length + 1,
    title,
    author,
    date,
    picture: req.file ? `/uploads/${req.file.filename}` : null, // save filename if uploaded
    content,
    category,
  };

  // Add it to the array
  posts.push(newPost);

  console.log("New Post Added:", newPost);
  console.log("All Posts:", posts);

  // Redirect to a page showing all posts (or back to form)
  res.redirect("/posts");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// app.set("view engine", "ejs");