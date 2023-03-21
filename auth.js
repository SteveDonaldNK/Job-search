module.exports = function (app, passport, User, bcrypt) {

    app.post("/register", function(req, res) {
        User.findOne({username: req.body.username}, async (err, foundUser) => {
            if (err) {
               console.log(err)
               res.status("unknown error"); 
            } else if (foundUser){
                res.send("l'utilisateur a un compte")
            } else {
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword
                })
                newUser.save();
                res.send("Utilisateur créé")
            }
        })
        
    });

    app.post('/login',
    passport.authenticate("local", { 
        successRedirect: '/administrateur',
        failureRedirect: '/connexion',
        failureFlash: true })
    );

    app.get("/failed", function(req, res) {
        res.render("connexion", {error: "wrong credentials"})
    })

    app.get("/logout", function(req, res) {
        req.logout(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
    });
}