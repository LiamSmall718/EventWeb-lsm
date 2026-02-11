const express = require('express'); // Moteur du serveur
const cors = require("cors"); // Permet la communication avec le front

const app = express(); // Création du serveur web
app.use(express.json()); // Si on reçoit un json -> permet le parsing
app.use(cors()); // Autorise le front à communiquer

const { login, signup, me } = require("./auth/authController");
const { requireAuth } = require('./auth/authMiddleware');
const { list, create, remove, update } = require("./events/eventController");
const {join, leave} = require("./events/registration");

// Routes
app.post("/api/login", login)
app.get("/api/me", requireAuth, me)
app.post("/api/signup", signup)
app.get("/api/events", requireAuth, list);
app.post("/api/events", requireAuth, create);
app.delete("/api/events/:id", requireAuth, remove);
app.put("/api/events/:id", requireAuth, update);
app.post("/api/events/:id/join", requireAuth, join);
app.delete("/api/events/:id/join", requireAuth, leave);


// Démarrer le serveur
const PORT = 5001;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
});

