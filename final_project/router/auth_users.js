const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length == 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  let user = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (user.length == 0) {
    return false;
  } else {
    return true;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).json({ message: "You are successfully login now." })
  } else {
    return res.status(208).json({ message: "Invalid login credientials." })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn       = req.params.isbn;
  let reviews    = books[isbn]['reviews'];
  let username   = req.session.authorization["username"];
  let reviewText = req.body.reviewText;
  reviews[username]     = { "review": reviewText };
  books[isbn]['reviews'] = reviews;
  return res.status(200).json({ message: "Review has been stored." });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn       = req.params.isbn;
  let reviews    = books[isbn]['reviews'];
  let username   = req.session.authorization["username"];
  delete reviews[username] ;
  books[isbn]['reviews'] = reviews;
  return res.status(200).json({ message: "Review has been Deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
