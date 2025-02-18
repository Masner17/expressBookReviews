const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Función para validar si el nombre de usuario es válido
const isValid = (username) => {
    return username && username.length > 3; // Aquí puedes definir las reglas de validación
};

// Función para autenticar al usuario con su nombre y contraseña
const authenticatedUser = (username, password) => {
    // Lógica para verificar que el usuario y la contraseña coincidan
    return username === 'usuario1' && password === 'contraseña123'; // Ejemplo simple
};

// Ruta para hacer login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body; // Recibimos el nombre de usuario y la contraseña desde el cuerpo de la solicitud

    // Verificamos si el nombre de usuario es válido y si el usuario está autenticado
    if (isValid(username) && authenticatedUser(username, password)) {
        // Si es válido, generamos un token JWT
        const accessToken = jwt.sign({ username: username }, "secret_customer", { expiresIn: '1h' });

        // Guardamos el token en la sesión
        req.session.authorization = {
            accessToken: accessToken
        };

        // Enviamos el token al cliente
        return res.status(200).json({ message: "Login successful", accessToken: accessToken });
    } else {
        // Si no es válido, enviamos un error
        return res.status(401).json({ message: "Invalid username or password" });
    }
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
