const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let reviews = [];

// Función para validar si el nombre de usuario es válido
const isValid = (username) => {
    return username && username.length > 3; // Aquí puedes definir las reglas de validación
};

// Función para autenticar al usuario con su nombre y contraseña
const authenticatedUser = (username, password) => {
    // Buscar el usuario en la lista de usuarios registrados
    const user = users.find(user => user.username === username && user.password === password);
    
    // Si existe, devuelve true; si no, false
    return !!user;
};

// Ruta para hacer login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generar el token JWT
    const accessToken = jwt.sign({ username }, "secret_customer", { expiresIn: '1h' });

    if (req.session) {
        req.session.authorization = { accessToken };
    }

    return res.status(200).json({ message: "Login successful", accessToken });
});

const authenticatedUser2 = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;  // Obtenemos el ISBN del libro
    const { review } = req.body;  // Obtenemos la reseña desde el cuerpo de la solicitud

    if (!review || !isbn) {
        return res.status(400).json({ message: "Review and ISBN are required." });
    }

    // Verificamos que el usuario esté autenticado a través del token
    const token = req.session?.authorization?.accessToken;
    if (!token) {
        return res.status(403).json({ message: "Authorization token is required" });
    }

    jwt.verify(token, "secret_customer", (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        const username = decodedToken.username; // Obtenemos el nombre de usuario desde el token

        // Buscamos el libro con el ISBN
        let book = reviews.find(book => book.isbn === isbn);

        if (!book) {
            // Si no existe el libro, lo agregamos
            book = { isbn: isbn, reviews: [] };
            reviews.push(book);
        }

        // Buscamos si el usuario ya tiene una reseña para este libro
        const existingReviewIndex = book.reviews.findIndex(r => r.username === username);

        if (existingReviewIndex !== -1) {
            // Si ya tiene una reseña, la modificamos
            book.reviews[existingReviewIndex].review = review;
        } else {
            // Si no tiene reseña, agregamos una nueva
            book.reviews.push({ username, review });
        }

        return res.status(200).json({ message: "Review added/modified successfully", book });
    });

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;  // Obtenemos el ISBN del libro
    const token = req.session?.authorization?.accessToken;  // Obtenemos el token desde la sesión

    if (!token) {
        return res.status(403).json({ message: "Authorization token is required" });
    }

    // Verificamos el token
    jwt.verify(token, "secret_customer", (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        const username = decodedToken.username;  // Obtenemos el nombre de usuario desde el token

        // Buscamos el libro con el ISBN
        let book = reviews.find(book => book.isbn === isbn);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Buscamos la reseña del usuario en el libro
        const reviewIndex = book.reviews.findIndex(r => r.username === username);

        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Eliminamos la reseña
        book.reviews.splice(reviewIndex, 1);

        return res.status(200).json({ message: "Review deleted successfully", book });
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
