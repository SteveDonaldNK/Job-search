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
const moment = require('moment');

const app = express();
const auth = require('./auth');
const User = require('./schema/user');
const Job = require('./schema/job');
const expressInit = require('./expressInit/init');
const passportInit = require('./passportInit/init');

let docName = [];

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
    docName.push(doc);
    cb(null, doc);
  }
})

const upload = multer({ storage: storage });

function formatDate(timeAgo) {
  let replacements = {
    'years': 'An(s)',
    'month': 'mois',
    'weeks': 'semaine(s)',
    'days': 'jour(s)',
    'hour': 'heure(s)',
    'ago':'',
    'an': '1'
  };
  return timeAgo.replace(/\b(?:hour|days|weeks|month|An(s)|ago|an)\b/g, match => replacements[match]);
}

app.get("/", function(req, res) {
  res.render('index');
});

app.get("/connexion", function(req, res) {
    if(req.isAuthenticated()) {
        res.redirect('/utilisateur');
    } else {
        res.render("connexion");
    }
});

app.get("/admin", function(req, res) {
    if(req.isAuthenticated() && req.user.admin) {
        res.redirect('/administrateur');
    } else {
        res.render("connexionAdmin");
    }
});

app.post("/adminLogin",
passport.authenticate("local", { 
    failureRedirect: '/admin',
    successRedirect: '/admin',
    failureFlash: true })
);

app.get("/administrateur", async function(req, res) {
  if (req.isAuthenticated() && req.user.admin) {
    const postulants = await User.find({postulant: true});
    const offres = await Job.find();

    res.render('Administrateur', {postulants, offres});
  } else {
    res.redirect('/connexion');
  }
});

app.get("/utilisateur", async function(req, res) {
  if (req.isAuthenticated()) {
    res.render('utilisateur', {username: req.user.username});
  } else {
    res.redirect('/connexion');
  }
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

app.get("/account", function(req, res) {
  if(req.isAuthenticated()) {
    res.render('pricing');
  } else {
    res.redirect("/connexion");
  }
});

app.get("/portfolio", function(req, res) {
  res.render('portfolio');
});

app.get("/blog", async function(req, res) {
  const foundJobs = await Job.find();
  foundJobs.forEach(job => {
    const timeAgo = moment(job.createdAt).fromNow();
    job.date = formatDate(timeAgo);
  });
  res.render('blog', {foundJobs});
});

app.get("/contact", function(req, res) {
  res.render('contact');
});

app.get("/categories", async function(req, res) {
  const foundJobs = await Job.find();
  res.render('portfolio', {foundJobs});
});

app.get("/emplois/:jobId", function (req, res) {
  const jobId = req.params.jobId;
  Job.findById(jobId, (err, foundJob) => {
    if (err) {
      console.log(err);
    } else {
      const timeAgo = moment(foundJob.createdAt).fromNow();
      const date = formatDate(timeAgo);
      res.render('portfolio-details', {foundJob, date});
    }
  })
})

app.post('/submit', upload.single('cv'), (req, res) => {
  User.updateOne({_id: req.user.id}, {
    document: docName[0],
    tel: req.body.tel,
    nom: req.body.nom,
    prenom: req.body.prenom,
    secteur: req.body.Secteur,
    anniv: req.body.anniv,
    addresse: req.body.addresse,
    email: req.body.email,
    freelance: req.body.freelance,
    commentaire: req.body.commentaire,
    postulant: true,
  }, err => {
    if (err) {
      docName = [];
      console.log(err);
    } else {
      docName = [];
      res.send('uploaded successfully!');
    }
  });
});

app.post('/publish', upload.array('image'), (req, res) => {
  if (req.isAuthenticated() && req.user.admin) {
    const job = new Job({
      titre: req.body.titre,
      entreprise: req.body.entreprise,
      categorie: req.body.categorie,
      site: req.body.site,
      description: req.body.description,
      salaire: req.body.salaire,
      image: docName,
      timestamps: true
    })
    job.save();
    docName = [];
    res.status(200).send("Publie avec success");
  } else {
    res.status(400).send("pas authorise");
  }
});

app.post('/update-profile',upload.none(), async (req, res) => {
  User.updateOne({_id: req.user.id}, {
    password: await bcrypt.hash(req.body.password, 10),
    email: req.body.email,
  }, err => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send('Mise a jour effectue!');
    }
  });
})

app.get('/search', (req, res) => {
  let searchQuery = req.query.q;
  Job.find({ $or: [ { titre: { $regex: searchQuery, $options: "i" } },
   { description: { $regex: searchQuery, $options: "i" } } ] }, (err, foundJobs) => {
    if (err) return console.error(err);
    res.send(foundJobs);
  });
})

app.get('/image/:imageId', (req, res) => {
  const imageId = req.params.imageId;
  res.sendFile(__dirname + `/uploads/${imageId}`);
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
