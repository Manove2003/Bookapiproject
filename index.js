const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb+srv://manove:manove@cluster0.yqdfj.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number, required: true },
});

const Book = mongoose.model("Book", bookSchema);

// GET all books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// GET a specific book by ID
app.get("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book not found");
  res.json(book);
});

// POST a new book
app.post("/books", async (req, res) => {
  const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
    publishedYear: req.body.publishedYear,
  });
  await newBook.save();
  res.status(201).json(newBook);
});

// PUT to update a book
app.put("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book not found");

  book.title = req.body.title;
  book.author = req.body.author;
  book.publishedYear = req.body.publishedYear;
  await book.save();
  res.json(book);
});

// DELETE a book
app.delete("/books/:id", async (req, res) => {
  const result = await Book.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).send("Book not found");

  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
