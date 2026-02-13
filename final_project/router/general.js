const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using Promises
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve) => {
    resolve(books);
  });
  getBooks.then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)));
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject({status: 404, message: "Book not found"});
  })
  .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch((err) => res.status(err.status).json({message: err.message}));
});

// Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve) => {
    let filtered_books = Object.values(books).filter((b) => b.author === author);
    resolve(filtered_books);
  })
  .then((book) => res.status(200).send(JSON.stringify(book, null, 4)));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve) => {
    let filtered_books = Object.values(books).filter((b) => b.title === title);
    resolve(filtered_books);
  })
  .then((book) => res.status(200).send(JSON.stringify(book, null, 4)));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
