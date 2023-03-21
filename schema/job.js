const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    salary: String,
    img: String,
});

module.exports = new mongoose.model('Job', jobSchema);

;