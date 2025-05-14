const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Charger le modèle utilisateur
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");

// Page de connexion
router.get("/login", forwardAuthenticated, (req, res) => {
    console.log("Accès à la page de connexion"); // Débogage
    res.render("login");
});

// Page d'inscription
router.get("/register", forwardAuthenticated, (req, res) => {
    console.log("Accès à la page d'inscription"); // Débogage
    res.render("register");
});

// Inscription
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Vérification des champs obligatoires
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Veuillez remplir tous les champs" });
    }

    // Vérification de la correspondance des mots de passe
    if (password != password2) {
        errors.push({ msg: "Les mots de passe ne correspondent pas" });
    }

    // Vérification de la longueur du mot de passe
    if (password.length < 6) {
        errors.push({ msg: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    // Si des erreurs existent, les afficher
    if (errors.length > 0) {
        console.log("Erreurs lors de l'inscription :", errors); // Débogage
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        // Vérifier si l'utilisateur existe déjà
        User.findOne({ email: email }).then((user) => {
            if (user) {
                errors.push({ msg: "Cet email est déjà enregistré" });
                console.log("Email déjà utilisé :", email); // Débogage
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                });
            } else {
                // Créer un nouvel utilisateur
                const newUser = new User({
                    name,
                    email,
                    password,
                });

                // Hachage du mot de passe
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.error("Erreur lors de la génération du sel :", err); // Débogage
                        throw err;
                    }
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            console.error("Erreur lors du hachage du mot de passe :", err); // Débogage
                            throw err;
                        }
                        newUser.password = hash;
                        // Sauvegarder l'utilisateur dans la base de données
                        newUser
                            .save()
                            .then((user) => {
                                console.log("Nouvel utilisateur enregistré :", user); // Débogage
                                req.flash(
                                    "success_msg",
                                    "Vous êtes maintenant inscrit et pouvez vous connecter"
                                );
                                res.redirect("/users/login");
                            })
                            .catch((err) => console.error("Erreur lors de l'enregistrement :", err)); // Débogage
                    });
                });
            }
        });
    }
});

// Connexion
router.post("/login", (req, res, next) => {
    console.log("Tentative de connexion pour :", req.body.email); // Débogage
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true,
    })(req, res, next);
});

// Déconnexion
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error("Erreur lors de la déconnexion :", err); // Débogage
            return next(err); // Gérer les erreurs si nécessaire
        }
        console.log("Utilisateur déconnecté"); // Débogage
        req.flash("success_msg", "Vous êtes déconnecté");
        res.redirect("/users/login");
    });
});

module.exports = router;
