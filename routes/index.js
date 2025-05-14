const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Personnel = require("../models/Personnel");

// Page d'accueil
router.get("/", (req, res) => res.render("welcome"));

// Tableau de bord
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
    try {
        const personnels = await Personnel.find(); // Récupérer tous les personnels
        res.render("dashboard", {
            user: req.user,
            personnels: personnels,
        });
    } catch (err) {
        console.error(err);
        req.flash("error_msg", "Erreur lors du chargement des personnels");
        res.redirect("/users/login");
    }
});

module.exports = router;
