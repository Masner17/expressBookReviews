const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Verificar si se proporcionaron username y password
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Verificar si el usuario ya existe en el array users
  const userExists = users.some(user => user.username === username);
  if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
  }

  // Registrar nuevo usuario
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2)); // null, 2 agrega formato para que se vea ordenado
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; //Captura el valor del isbn en la solicitud
  if (books[isbn]) {
    return res.status(200).json(books[isbn]); // devuelve los detalles del libro si lo encuentra
  }else{
    return res.status(404).json({message: "Book not found"}); // devuelve mensaje de error si no lo encuentra
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Captura el autor desde la URL
  const bookList = Object.values(books); // Convierte el objeto a un array
  const foundBooks = bookList.filter(book => book.author === author); // Filtra por autor

  if (foundBooks.length > 0) {
      return res.status(200).json(foundBooks); // Devuelve los libros encontrados
  } else {
      return res.status(404).json({ message: "No books found for this author." });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const foundBooks = Object.values(books).filter(book => book.title === title);

  if (foundBooks.length > 0) {
    return res.status(200).json(foundBooks);
  } else {
    return res.status(404).json({ message: "No books found for this title." });
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }else{
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
