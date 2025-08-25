import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from "multer";
const app = express();
const port = 3000;

app.set("view engine", "ejs");


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
let posts = [

    // {
     //id: 1,
     //author: "Phoenix Baker",
     //date: "19 Jan 2025",
     //title: "Migrating to Linear 101",
     //description: "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here’s how to get started.",
    // tags: ["Product", "Tools", "SaaS"],
  //   image: "https://via.placeholder.com/600x400?text=Linear+101"
//   },
//   {
//     id: 2,
//     author: "Lana Steiner",
//     date: "18 Jan 2025",
//     title: "Building your API stack",
//     description: "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
//     tags: ["Software Development", "Tools"],
//     image: "https://via.placeholder.com/600x400?text=API+Stack"
//   },
//   {
//     id: 3,
//     author: "Alec Whitten",
//     date: "17 Jan 2025",
//     title: "Bill Walsh leadership lessons",
//     description: "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
//     tags: ["Leadership", "Management"],
//     image: "https://via.placeholder.com/600x400?text=Leadership"
//   },
//   {
//     id: 4,
//     author: "Demi Wilkinson",
//     date: "16 Jan 2025",
//     title: "PM mental models",
//     description: "Mental models are simple expressions of complex processes or relationships.",
//     tags: ["Product", "Research", "Frameworks"],
//     image: "https://via.placeholder.com/600x400?text=PM+Models"
//   },
//   {
//     id: 5,
//     author: "Candice Wu",
//     date: "15 Jan 2025",
//     title: "What is wireframing?",
//     description: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
//     tags: ["Design", "Research"],
//     image: "https://via.placeholder.com/600x400?text=Wireframing"
//   },
//   {
//     id: 6,
//     author: "Natalie Craig",
//     date: "14 Jan 2025",
//     title: "How collaboration makes us better designers",
//     description: "Collaboration can make our teams stronger, and our individual designs better.",
//     tags: ["Design", "Research"],
//     image: "https://via.placeholder.com/600x400?text=Collaboration"
//   }
];
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

  res.render("edit.ejs", { post });  // ✅ Now renders edit.ejs
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



