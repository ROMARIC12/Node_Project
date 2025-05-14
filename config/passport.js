const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Charger le modèle utilisateur
const User = require("../models/User");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                try {
                    // Vérifier si l'utilisateur existe
                    const user = await User.findOne({ email: email });
                    if (!user) {
                        return done(null, false, {
                            message: "Cet email n'est pas enregistré",
                        });
                    }

                    // Vérifier le mot de passe
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Mot de passe incorrect" });
                    }
                } catch (err) {
                    console.error(err);
                    return done(err);
                }
            }
        )
    );

    // Sérialiser l'utilisateur
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Désérialiser l'utilisateur
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id); // Utilisation d'async/await
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
