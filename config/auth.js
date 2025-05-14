module.exports = {
    // Middleware pour vérifier si l'utilisateur est authentifié
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next(); // Si l'utilisateur est authentifié, continuer vers la ressource demandée
        }
        req.flash('error_msg', 'Veuillez vous connecter pour accéder à cette ressource'); // Message d'erreur
        res.redirect('/users/login'); // Rediriger vers la page de connexion
    },

    // Middleware pour rediriger les utilisateurs déjà connectés
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next(); // Si l'utilisateur n'est pas authentifié, continuer vers la ressource demandée
        }
        res.redirect('/dashboard'); // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté
    }
};