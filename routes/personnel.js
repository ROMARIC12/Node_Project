const express = require("express");
const router = express.Router();
const Personnel = require("../models/Personnel");

// Afficher le formulaire pour ajouter un personnel
router.get("/add", async (req, res) => {
  try {
    const personnels = await Personnel.find(); // Récupérer tous les personnels
    res.render("addPersonnel", { personnels });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Erreur lors du chargement des personnels");
    res.redirect("/dashboard");
  }
});

// Ajouter un personnel
router.post("/add", async (req, res) => {
  try {
    const newPersonnel = new Personnel(req.body);
    await newPersonnel.save();
    req.flash("success_msg", "Personnel ajouté avec succès");
    res.redirect("/personnel/add");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Erreur lors de l'ajout du personnel");
    res.redirect("/personnel/add");
  }
});

// Afficher le formulaire pour modifier un personnel
router.get("/edit/:id", async (req, res) => {
  try {
    const personnel = await Personnel.findById(req.params.id); // Trouver le personnel par ID
    if (!personnel) {
      req.flash("error_msg", "Personnel introuvable");
      return res.redirect("/dashboard");
    }
    res.render("editPersonnel", { personnel }); // Rendre la vue pour l'édition
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Erreur lors du chargement du personnel");
    res.redirect("/dashboard");
  }
});

// Mettre à jour un personnel
router.post("/edit/:id", async (req, res) => {
  try {
    await Personnel.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Mettre à jour le personnel
    req.flash("success_msg", "Personnel mis à jour avec succès");
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Erreur lors de la mise à jour du personnel");
    res.redirect("/dashboard");
  }
});

// Supprimer un personnel
router.get("/delete/:id", async (req, res) => {
  try {
    await Personnel.findByIdAndDelete(req.params.id); // Supprimer le personnel par ID
    req.flash("success_msg", "Personnel supprimé avec succès");
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Erreur lors de la suppression du personnel");
    res.redirect("/dashboard");
  }
});

module.exports = router;
