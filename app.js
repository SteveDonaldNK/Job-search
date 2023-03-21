const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session'); // to setup sessions
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const flash = require('express-flash');

const app = express();
const auth = require('./auth');
const User = require('./schema/user');
const Job = require('./schema/job');
const expressInit = require('./expressInit/init');
const passportInit = require('./passportInit/init');

expressInit(app, express, session, flash);
passportInit(app,passport, LocalStrategy, User, bcrypt);

mongoose.connect('mongodb://127.0.0.1:27017/job', {
    useNewUrlParser: true,
    dbName: 'job'
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error: ', err);
});

auth(app, passport, User, bcrypt);

const UPLOADS_DIR = './uploads';

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {

    const name = Date.now() + '-' + Math.round(Math.random() * 1E9);

    const doc = name + '-' + file.originalname;

    console.log(doc);

    User.updateOne({_id: req.user.id}, {
      document: doc,
      tel: req.body.tel,
      nom: req.body.nom,
      prenom: req.body.prenom,
      secteur: req.body.Secteur,
      anniv: req.body.anniv,
      addresse: req.body.addresse,
      email: req.body.email,
      freelance: req.body.freelance,
      commentaire: req.body.commentaire,
    }, err => {
      if (err) {
        console.log(err);
      }
    });

    cb(null, doc);
  }
})

const upload = multer({ storage: storage })

app.get("/", function(req, res) {
  res.render('index');
});

app.get("/connexion", function(req, res) {
    if(req.isAuthenticated()) {
        res.render('Administrateur');
    } else {
        res.render("connexion");
    }
});

app.get("/administrateur", function(req, res) {
    // if(req.isAuthenticated()) {
        res.render('Administrateur');
    // } else {
    //     res.redirect("connexion");
    // }
});

app.get("/inscription", function(req, res) {
    res.render('inscription');
});

app.get("/about", function(req, res) {
  res.render('about');
});

app.get("/services", function(req, res) {
  res.render('services');
});

app.get("/testimonials", function(req, res) {
  res.render('testimonials');
});

app.get("/pricing", function(req, res) {
  if(req.isAuthenticated()) {
    res.render('pricing');
  } else {
    res.redirect("/connexion");
  }
});

app.get("/portfolio", function(req, res) {
  res.render('portfolio');
});

app.get("/blog", function(req, res) {
  res.render('blog');
});

app.get("/contact", function(req, res) {
  res.render('contact');
});

app.post('/submit', upload.single('cv'), (req, res) => {
  res.send('uploaded successfully!');
});

app.post('/publish', upload.single('image'), (req, res) => {
  res.send('publie avec success !!!');
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
