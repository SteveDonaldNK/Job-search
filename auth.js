module.exports = function (app, passport, User, bcrypt) {

    app.post("/register", function(req, res) {
        User.findOne({username: req.body.username}, async (err, foundUser) => {
            if (err) {
               console.log(err)
            } else if (foundUser){
                res.redirect("connexion")
            } else {
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    timestamps: true
                })
                newUser.save();
                res.redirect('/connexion')
            }
        })
        
    });

    app.post('/login',
    passport.authenticate("local", { 
        failureRedirect: '/connexion',
        failureFlash: true })
    , (req, res) => {
        res.redirect('/utilisateur');
    });

    app.get("/failed", function(req, res) {
        res.render("connexion")
    })

    app.get("/logout", function(req, res) {
        req.logout(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/connexion");
            }
        });
    });
}