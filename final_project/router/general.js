const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username=req.body.username
  let password=req.body.password
  if(!username || !password){
    return res.status(400).send("credentials not provided")
}
  for(u of users){
    if(u.username==username)return res.status(400).send("a user with this username already exists")
  }
  users.push({username,password})
  res.send("registered successfully")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve,reject)=>{
    if(books)resolve(books)
      else reject('No books available')
  }).then((data)=>{
    res.send(JSON.stringify(data,null,4))
  }).catch((err)=>{
    res.status(500).send(err)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  let isbn=req.params.isbn
  try {
    let data=await new Promise((resolve,reject)=>{
        if(Object.keys(books).includes(isbn)){
        resolve(books[isbn])
      }
      else{
        reject("book not available")
      }
    })
    res.send(JSON.stringify(data,null,4))

}catch (error) {
    res.status(404).send("book not available")
  }
  })
;
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author=req.params.author
  console.log(author)
  for(key of Object.keys(books)){
    console.log(books[key])
    if(books[key]["author"]==author){
     return res.send(JSON.stringify(books[key]))
    }
  }
  return res.status(404).send("author not available")
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title=req.params.title
  for(key of Object.keys(books)){
    if(books[key]["title"]==title){
      return res.send(JSON.stringify(books[key]))
    }
  }
 return res.status(404).send("title not available")
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn=req.params.isbn
  if(Object.keys(books).includes(isbn)){
    return res.send(JSON.stringify(books[isbn]["reviews"]))
  }
  else{
    return  res.status(404).send("book not available")
  }
});

module.exports.general = public_users;
