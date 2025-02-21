const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


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
const getBooks = async () => {
  try {
      const response = await axios.get("http://localhost:5001"); // Cambia la URL si es diferente en tu servidor
      return response.data;
  } catch (error) {
      console.error("Error fetching books:", error.message);
      throw error;
  }
};

// Llamada a la función y ejemplo de uso
getBooks()
  .then(books => console.log("Books:", books))
  .catch(error => console.log("Failed to fetch books:", error.message));



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; //Captura el valor del isbn en la solicitud
  if (books[isbn]) {
    return res.status(200).json(books[isbn]); // devuelve los detalles del libro si lo encuentra
  }else{
    return res.status(404).json({message: "Book not found"}); // devuelve mensaje de error si no lo encuentra
  }
 });

 // Función para obtener los detalles de un libro por ISBN usando async/await
async function getBookDetails(isbn) {
  try {
    const response = await axios.get("http://localhost:5001/isbn/" + isbn);    // Hacemos una petición GET al servidor
      console.log("Detalles del libro:", response.data); // Mostramos los detalles del libro en consola
  } catch (error) {
      console.error("Error al obtener los detalles del libro:", error.message); // Manejo de errores
  }
}

// Llamamos a la función pasando un ISBN de prueba (reemplázalo con uno válido)
getBookDetails("1");
  
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

//ver libros escritos por X autor usando async/await y Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;  // Captura el autor desde la URL
  try {
      // Filtra los libros por autor
      const foundBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

      if (foundBooks.length > 0) {
          // Si hay libros del autor, devuelve los detalles
          return res.status(200).json(foundBooks);
      } else {
          // Si no se encuentra el autor, muestra mensaje de error
          return res.status(404).json({ message: "No books found for this author." });
      }
  } catch (error) {
      return res.status(500).json({ message: "An error occurred while fetching books." });
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

// Función para obtener el libro basado en el título
const getBookByTitle = async (title) => {
  try {
    // Usamos la URL con el título (asegúrate de que los espacios estén reemplazados por '%20' o utiliza encodeURIComponent)
    const response = await axios.get(`http://localhost:5001/title/${encodeURIComponent(title)}`);
    
    console.log('Books:', response.data); // Mostrar los libros encontrados
  } catch (error) {
    console.error('Error al obtener el libro por título:', error.response ? error.response.data : error.message);
  }
};

// Llamar a la función pasando un título como ejemplo
getBookByTitle("The Divine Comedy");  // Cambia esto por el título que deseas buscar

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
