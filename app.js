const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

require('dotenv').config();
const app = express();

// Configuration de Passport
require("./config/passport")(passport);

// Configuration de la base de données
//const db = require("./config/keys").mongoURI;

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur MongoDB:', err));


// Définir le moteur de rendu EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Définir le répertoire des vues

// Middleware pour parser les données des formulaires
app.use(express.urlencoded({ extended: false }));

// Configuration de la session Express
app.use(
    session({
        secret: "secret", // Clé secrète pour signer la session
        resave: true, // Forcer la sauvegarde de la session même si elle n'a pas été modifiée
        saveUninitialized: true, // Sauvegarder une session non initialisée
    })
);

// Middleware Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour les messages flash
app.use(flash());

// Variables globales pour les messages flash
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg"); // Message de succès
    res.locals.error_msg = req.flash("error_msg"); // Message d'erreur
    res.locals.error = req.flash("error"); // Erreur générale
    next();
});

// Définir les routes
app.use("/", require("./routes/index.js")); // Route pour la page d'accueil
app.use("/users", require("./routes/users.js")); // Routes pour la gestion des utilisateurs
app.use("/personnel", require("./routes/personnel")); // Routes pour la gestion du personnel



//app.listen(process.env.PORT, () => console.log(`Serveur démarré sur le port ${process.env.PORT}`)); // Message de confirmation lorsque le serveur démarre
