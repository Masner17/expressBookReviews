const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        
        jwt.verify(token, "secret_customer", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // ✅ Continúa con la siguiente función
            } else {
                res.status(403).json({ message: "Unauthorized" }); // ✅ Enviar respuesta
            }
        });
    } else {
        res.status(401).json({ message: "No authorization data found" }); // ✅ Se maneja el caso en que no haya token
    }
});

// Agregar una ruta de prueba
app.get("/customer/auth/test", (req, res) => {
    res.json({ message: "Middleware funcionando correctamente" });
});
 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
