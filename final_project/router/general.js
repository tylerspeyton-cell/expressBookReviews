const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = await new Promise((resolve) => resolve(books));
    res.status(200).send(JSON.stringify(getBooks, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
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
    let filtered = Object.values(books).filter((b) => b.author === author);
    resolve(filtered);
  })
  .then((list) => res.status(200).send(JSON.stringify(list, null, 4)));
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve) => {
    let filtered = Object.values(books).filter((b) => b.title === title);
    resolve(filtered);
  })
  .then((list) => res.status(200).send(JSON.stringify(list, null, 4)));
});

module.exports.general = public_users;
