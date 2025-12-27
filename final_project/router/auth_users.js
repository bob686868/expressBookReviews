const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [ { username: "testUser", password: "testPass" }];

const isValid = (username)=>{ //returns boolean
  for(u of users){
    if(u.username==username)return false
  }
  return true
}

const authenticatedUser = (username,password)=>{ 
  for(u of users){
    if(u.username == username && u.password == password)return true
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username=req.body.username
  let password=req.body.password

  if(!authenticatedUser(username,password))return res.status(401).send("credentials not valid")
  else{
    let accessToken =jwt.sign({data:password},'access',{expiresIn:60*60})
    req.session.authorization={accessToken,username}
     return res.status(200).send("User successfully logged in");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review=req.query.review
  let isbn=req.params.isbn
  let username=req.session["authorization"]["username"]
  if(!books[isbn])return res.status(404).send("Book not found")
  books[isbn]["reviews"][username]=review
  res.send("added")
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn=req.params.isbn
  let username=req.session.authorization.username
  if(!books[isbn])return res.status(404).send("book not found")
  delete books[isbn]["reviews"][username]
  res.send("deleted review successfully")
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
