const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    function findBookByAuthor(authorName) {
        let bookKeys = Object.keys(books);
        for (let i = 0; i < bookKeys.length; i++) {
          let bookKey = bookKeys[i];
          let book = books[bookKey];
          if (book.author === authorName) {
            return book;
          }
        }
        return null;
      }
      let book = findBookByAuthor(author);
      return res.send(book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    function findBookByTitle(titleName) {
        let bookKeys = Object.keys(books);
        for (let i = 0; i < bookKeys.length; i++) {
          let bookKey = bookKeys[i];
          let book = books[bookKey];
          if (book.title === titleName) {
            return book;
          }
        }
        return null;
      }
      let book = findBookByTitle(title);
      return res.send(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
