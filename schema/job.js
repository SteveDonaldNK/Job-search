const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    titre: String,
    entreprise: String,
    categorie: String,
    site: String,
    description: String,
    salaire: String,
    image: Array,
    createdAt: { type: Date, default: Date.now }
});

module.exports = new mongoose.model('Job', jobSchema);

;