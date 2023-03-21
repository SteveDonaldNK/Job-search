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
    commentaire: String,
    document: String,
});

module.exports = new mongoose.model('User', userSchema);

;