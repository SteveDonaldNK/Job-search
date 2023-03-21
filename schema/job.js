const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    titre: String,
    description: String,
    salaire: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = new mongoose.model('Job', jobSchema);

;