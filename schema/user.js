const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    tel: String,
    nom: String,
    prenom: String,
    secteur: String,
    anniv: String,
    addresse: String,
    freelance: {
        type: Boolean,
        default: false,
    },
    postulant: {
        type: Boolean,
        default: true,
    },
    commentaire: String,
    document: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = new mongoose.model('User', userSchema);

;