import express from "express";
import path from "path";

import multer from "multer";
const app = express();
const port = 3000;

app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: true }));


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
  res.render("index.ejs", { posts });
});

app.get("/create", (req, res) => {
  res.render("create.ejs",);
});




app.get("/post/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("post.ejs", { post });  // Renders views/post.ejs
});

app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("edit.ejs", { post });  // 
});



// update route
app.post("/update/:id", upload.single("picture"), (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  // Update the post
  post.title = req.body.title;
  post.author = req.body.author;
  post.date = req.body.date;
  post.description = req.body.content;
  post.tags = [req.body.category];

  // If a new picture is uploaded, replace the old one
  if (req.file) {
    post.image = `/uploads/${req.file.filename}`;
  }

  console.log(`Post ${postId} updated:`, post);
  res.redirect("/"); // Back to homepage
});

// Delete route
app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  console.log("Trying to delete post:", postId, "Current posts:", posts);
  posts = posts.filter(p => p.id !== postId);
  console.log("Remaining posts:", posts);
  res.redirect("/");
});


app.post("/add-post", upload.single("picture"), (req, res) => {
  const { title, author, date, content, category } = req.body;

  // Create a new post object
  const newPost = {
    id: posts.length + 1,
     title: title,
    author: author,
    date: date,
    image: req.file ? `/uploads/${req.file.filename}` : null, // save filename if uploaded
    description: content,
    tags: [category],
  };

  // Add it to the array
  posts.push(newPost);

  console.log("New Post Added:", newPost);
  console.log("All Posts:", posts);

  // Redirect to a page showing all posts (or back to form)
  res.redirect("/");

//   res.redirect("/posts");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



