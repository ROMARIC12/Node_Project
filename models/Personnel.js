const mongoose = require("mongoose");

const PersonnelSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    prenoms: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
    },
    genre: {
        type: String,
        enum: ["Homme", "Femme"],
    },
    profession: {
        type: String,
    },
    departement: {
        type: String,
    },
    salaire: {
        type: Number,
    },
    date_embauche: {
        type: Date,
    },
    nombre_enfants: {
        type: Number,
    },
    situation_matrimoniale: {
        type: String,
        enum: ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf(ve)"],
    },
    date_creation: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Personnel", PersonnelSchema);
